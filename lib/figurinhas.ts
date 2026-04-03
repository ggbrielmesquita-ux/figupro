import { supabaseAdmin } from '@/lib/supabase';
import { Categoria, Figurinha, Subcategoria } from '@/types';

const BUCKET = 'figurinhas';

// Mapeamento de categorias para ícones e cores
const CATEGORIA_CONFIG: Record<string, { icone: string; cor: string }> = {
  default: { icone: 'Folder', cor: '#ff6b00' },
  '2026': { icone: 'CalendarDays', cor: '#ff6b00' },
  'BOM DIA': { icone: 'Sun', cor: '#fbbf24' },
  'BOA TARDE': { icone: 'Sunset', cor: '#f97316' },
  'BOA NOITE': { icone: 'Moon', cor: '#8b5cf6' },
  'REACOES': { icone: 'Smile', cor: '#10b981' },
  'GRAU': { icone: 'Bike', cor: '#ef4444' },
  'CARRO': { icone: 'Car', cor: '#3b82f6' },
  'INTERATIVAS': { icone: 'Zap', cor: '#f59e0b' },
  'SOMBRAS': { icone: 'Layers', cor: '#6366f1' },
  'PLATAFORMA': { icone: 'Globe', cor: '#06b6d4' },
  'MOTIVACIONAIS VIRAL': { icone: 'TrendingUp', cor: '#22c55e' },
  'RIFAS': { icone: 'Gift', cor: '#ec4899' },
  'LOJISTA': { icone: 'ShoppingBag', cor: '#84cc16' },
  'BARBEARIA': { icone: 'Scissors', cor: '#a855f7' },
  'CHOFFER': { icone: 'Navigation', cor: '#14b8a6' },
};

const IMAGE_EXTS = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif'];

function isImageFile(name: string): boolean {
  const ext = name.slice(name.lastIndexOf('.')).toLowerCase();
  return IMAGE_EXTS.includes(ext);
}

export function slugify(nome: string): string {
  return nome
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function deslugify(slug: string, items: string[]): string | null {
  return items.find((item) => slugify(item) === slug) || null;
}

let cachedCategorias: Categoria[] | null = null;
let cacheExpiry: number = 0;

export async function listarCategorias(): Promise<Categoria[]> {
  if (cachedCategorias && Date.now() < cacheExpiry) {
    return cachedCategorias;
  }

  // Lista as "pastas" no raiz do bucket (prefixos de nível 1)
  const { data: raiz, error } = await supabaseAdmin.storage.from(BUCKET).list('', { limit: 200 });
  if (error || !raiz) return [];

  const promises = raiz
    .filter((entry) => entry.id === null) // Pega apenas subpastas
    .map(async (entry) => {
      const nomeCategoria = entry.name;
      const config = CATEGORIA_CONFIG[nomeCategoria] || CATEGORIA_CONFIG.default;

      // Lista conteúdo da categoria para descobrir subcategorias e arquivos diretos
      const { data: conteudo } = await supabaseAdmin.storage
        .from(BUCKET)
        .list(nomeCategoria, { limit: 500 });

      const subcategorias: Subcategoria[] = [];
      let totalFigurinhas = 0;

      if (conteudo) {
        const subPromises = conteudo.map(async (item) => {
          if (item.id === null) {
            // É uma subcategoria (pasta)
            const { data: subFiles } = await supabaseAdmin.storage
              .from(BUCKET)
              .list(`${nomeCategoria}/${item.name}`, { limit: 1000 });

            const total = subFiles?.filter((f) => f.id !== null && isImageFile(f.name)).length ?? 0;
            return { isSub: true, item, total };
          } else if (isImageFile(item.name)) {
            return { isSub: false, item, total: 1 };
          }
          return null;
        });

        const subResults = await Promise.all(subPromises);
        
        for (const res of subResults) {
          if (!res) continue;
          if (res.isSub) {
            subcategorias.push({
              nome: res.item.name,
              slug: slugify(res.item.name),
              totalFigurinhas: res.total,
            });
            totalFigurinhas += res.total;
          } else {
            totalFigurinhas++;
          }
        }
      }

      return {
        nome: nomeCategoria,
        slug: slugify(nomeCategoria),
        icone: config.icone,
        cor: config.cor,
        subcategorias,
        totalFigurinhas,
      };
    });

  const categorias = await Promise.all(promises);
  categorias.sort((a, b) => a.nome.localeCompare(b.nome));

  cachedCategorias = categorias;
  cacheExpiry = Date.now() + 1000 * 60 * 15; // 15 minutos em cache

  return categorias;
}

export async function listarFigurinhas(categoria: string, subcategoria?: string): Promise<Figurinha[]> {
  const categorias = await listarCategorias();
  const cat = categorias.find((c) => c.slug === categoria);
  if (!cat) return [];

  let storagePath = cat.nome;

  if (subcategoria) {
    const sub = cat.subcategorias.find((s) => s.slug === subcategoria);
    if (!sub) return [];
    storagePath = `${cat.nome}/${sub.nome}`;
  }

  const { data: files, error } = await supabaseAdmin.storage
    .from(BUCKET)
    .list(storagePath, { limit: 1000 });

  if (error || !files) return [];

  return files
    .filter((f) => f.id !== null && isImageFile(f.name))
    .map((f) => {
      const urlPath = subcategoria
        ? `/api/imagem/${encodeURIComponent(cat.nome)}/${encodeURIComponent(
            cat.subcategorias.find((s) => s.slug === subcategoria)!.nome
          )}/${encodeURIComponent(f.name)}`
        : `/api/imagem/${encodeURIComponent(cat.nome)}/${encodeURIComponent(f.name)}`;

      return {
        nome: f.name,
        url: urlPath,
        tipo: f.name.slice(f.name.lastIndexOf('.') + 1),
      };
    });
}
