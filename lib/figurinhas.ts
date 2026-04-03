import fs from 'fs';
import path from 'path';
import { Categoria, Figurinha, Subcategoria } from '@/types';

const FIGURINHAS_DIR = path.join(process.cwd(), 'figurinhas');
const IMAGE_EXTS = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif'];

// Mapeamento de categorias para ícones e cores
const CATEGORIA_CONFIG: Record<string, { icone: string; cor: string }> = {
  default: { icone: 'Folder', cor: '#ff6b00' },
  '2026': { icone: 'CalendarDays', cor: '#ff6b00' },
  'BOM DIA': { icone: 'Sun', cor: '#fbbf24' },
  'BOA TARDE': { icone: 'Sunset', cor: '#f97316' },
  'BOA NOITE': { icone: 'Moon', cor: '#8b5cf6' },
  'REAÇÕES': { icone: 'Smile', cor: '#10b981' },
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

function isImageFile(filename: string): boolean {
  return IMAGE_EXTS.includes(path.extname(filename).toLowerCase());
}

export function listarCategorias(): Categoria[] {
  if (!fs.existsSync(FIGURINHAS_DIR)) return [];

  const entries = fs.readdirSync(FIGURINHAS_DIR, { withFileTypes: true });
  const categorias: Categoria[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const nomeCategoria = entry.name;
    const catPath = path.join(FIGURINHAS_DIR, nomeCategoria);
    const config = CATEGORIA_CONFIG[nomeCategoria] || CATEGORIA_CONFIG.default;

    const subEntries = fs.readdirSync(catPath, { withFileTypes: true });
    const subcategorias: Subcategoria[] = [];
    let totalFigurinhas = 0;

    for (const sub of subEntries) {
      if (sub.isDirectory()) {
        const subPath = path.join(catPath, sub.name);
        const subFiles = fs.readdirSync(subPath).filter(isImageFile);
        subcategorias.push({
          nome: sub.name,
          slug: slugify(sub.name),
          totalFigurinhas: subFiles.length,
        });
        totalFigurinhas += subFiles.length;
      } else if (isImageFile(sub.name)) {
        totalFigurinhas++;
      }
    }

    categorias.push({
      nome: nomeCategoria,
      slug: slugify(nomeCategoria),
      icone: config.icone,
      cor: config.cor,
      subcategorias,
      totalFigurinhas,
    });
  }

  return categorias.sort((a, b) => a.nome.localeCompare(b.nome));
}

export function listarFigurinhas(categoria: string, subcategoria?: string): Figurinha[] {
  const categorias = listarCategorias();
  const cat = categorias.find((c) => c.slug === categoria);
  if (!cat) return [];

  let dirPath = path.join(FIGURINHAS_DIR, cat.nome);

  if (subcategoria) {
    const sub = cat.subcategorias.find((s) => s.slug === subcategoria);
    if (!sub) return [];
    dirPath = path.join(dirPath, sub.nome);
  }

  if (!fs.existsSync(dirPath)) return [];

  const files = fs.readdirSync(dirPath).filter(isImageFile);

  return files.map((file) => ({
    nome: file,
    url: subcategoria
      ? `/api/imagem/${encodeURIComponent(cat.nome)}/${encodeURIComponent(
          cat.subcategorias.find((s) => s.slug === subcategoria)!.nome
        )}/${encodeURIComponent(file)}`
      : `/api/imagem/${encodeURIComponent(cat.nome)}/${encodeURIComponent(file)}`,
    tipo: path.extname(file).replace('.', ''),
  }));
}

export function getImagePath(segments: string[]): string | null {
  const fullPath = path.join(FIGURINHAS_DIR, ...segments.map(decodeURIComponent));
  if (!fs.existsSync(fullPath)) return null;
  const ext = path.extname(fullPath).toLowerCase();
  if (!IMAGE_EXTS.includes(ext)) return null;
  return fullPath;
}
