import { supabaseAdmin } from '@/lib/supabase';
import { Categoria, Figurinha, Subcategoria } from '@/types';

const BUCKET = 'figurinhas';
const CACHE_TTL_MS = 1000 * 60 * 2;
const IMAGE_EXTS = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif'];

type StorageEntry = {
  name: string;
  id: string | null;
};

type CacheEntry<T> = {
  expiresAt: number;
  value: T;
};

// Mapeamento de categorias para icones e cores.
const CATEGORIA_CONFIG: Record<string, { icone: string; cor: string }> = {
  default: { icone: 'Folder', cor: '#ff6b00' },
  '2026': { icone: 'CalendarDays', cor: '#ff6b00' },
  'BOM DIA': { icone: 'Sun', cor: '#fbbf24' },
  'BOA TARDE': { icone: 'Sunset', cor: '#f97316' },
  'BOA NOITE': { icone: 'Moon', cor: '#8b5cf6' },
  REACOES: { icone: 'Smile', cor: '#10b981' },
  GRAU: { icone: 'Bike', cor: '#ef4444' },
  CARRO: { icone: 'Car', cor: '#3b82f6' },
  INTERATIVAS: { icone: 'Zap', cor: '#f59e0b' },
  SOMBRAS: { icone: 'Layers', cor: '#6366f1' },
  PLATAFORMA: { icone: 'Globe', cor: '#06b6d4' },
  'MOTIVACIONAIS VIRAL': { icone: 'TrendingUp', cor: '#22c55e' },
  RIFAS: { icone: 'Gift', cor: '#ec4899' },
  LOJISTA: { icone: 'ShoppingBag', cor: '#84cc16' },
  BARBEARIA: { icone: 'Scissors', cor: '#a855f7' },
  CHOFFER: { icone: 'Navigation', cor: '#14b8a6' },
};

const folderCache = new Map<string, CacheEntry<StorageEntry[]>>();
const recursiveCountCache = new Map<string, CacheEntry<number>>();
const recursiveImageCache = new Map<string, CacheEntry<string[]>>();

function getCachedValue<T>(cache: Map<string, CacheEntry<T>>, key: string): T | null {
  const entry = cache.get(key);
  if (!entry) {
    return null;
  }

  if (Date.now() >= entry.expiresAt) {
    cache.delete(key);
    return null;
  }

  return entry.value;
}

function setCachedValue<T>(cache: Map<string, CacheEntry<T>>, key: string, value: T) {
  cache.set(key, {
    expiresAt: Date.now() + CACHE_TTL_MS,
    value,
  });
}

function isFolder(entry: StorageEntry): boolean {
  return entry.id === null;
}

function joinStoragePath(...segments: string[]): string {
  return segments.filter(Boolean).join('/');
}

function normalizeKey(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .trim();
}

function getCategoriaConfig(nomeCategoria: string) {
  return CATEGORIA_CONFIG[normalizeKey(nomeCategoria)] || CATEGORIA_CONFIG.default;
}

function isImageFile(name: string): boolean {
  const ext = name.slice(name.lastIndexOf('.')).toLowerCase();
  return IMAGE_EXTS.includes(ext);
}

async function listFolder(path: string): Promise<StorageEntry[]> {
  const cached = getCachedValue(folderCache, path);
  if (cached) {
    return cached;
  }

  const allEntries: StorageEntry[] = [];
  let offset = 0;
  const limit = 1000;

  while (true) {
    const { data, error } = await supabaseAdmin.storage.from(BUCKET).list(path, {
      limit,
      offset,
      sortBy: { column: 'name', order: 'asc' },
    });

    if (error) {
      throw new Error(`Erro ao listar "${path || '/'}": ${error.message}`);
    }

    if (!data || data.length === 0) {
      break;
    }

    allEntries.push(...(data as StorageEntry[]));

    if (data.length < limit) {
      break;
    }

    offset += limit;
  }

  allEntries.sort((a, b) =>
    a.name.localeCompare(b.name, 'pt-BR', { numeric: true, sensitivity: 'base' })
  );

  setCachedValue(folderCache, path, allEntries);
  return allEntries;
}

async function countImagesRecursively(path: string): Promise<number> {
  const cached = getCachedValue(recursiveCountCache, path);
  if (cached !== null) {
    return cached;
  }

  const entries = await listFolder(path);
  const directImages = entries.filter((entry) => !isFolder(entry) && isImageFile(entry.name)).length;
  const childFolders = entries.filter(isFolder);

  if (childFolders.length === 0) {
    setCachedValue(recursiveCountCache, path, directImages);
    return directImages;
  }

  const nestedTotals = await Promise.all(
    childFolders.map((entry) => countImagesRecursively(joinStoragePath(path, entry.name)))
  );

  const total = directImages + nestedTotals.reduce((acc, value) => acc + value, 0);
  setCachedValue(recursiveCountCache, path, total);
  return total;
}

async function collectImagesRecursively(path: string): Promise<string[]> {
  const cached = getCachedValue(recursiveImageCache, path);
  if (cached) {
    return cached;
  }

  const entries = await listFolder(path);
  const directImages = entries
    .filter((entry) => !isFolder(entry) && isImageFile(entry.name))
    .map((entry) => joinStoragePath(path, entry.name));

  const childFolders = entries.filter(isFolder);
  const nestedImages = await Promise.all(
    childFolders.map((entry) => collectImagesRecursively(joinStoragePath(path, entry.name)))
  );

  const imagePaths = [...directImages, ...nestedImages.flat()].sort((a, b) =>
    a.localeCompare(b, 'pt-BR', { numeric: true, sensitivity: 'base' })
  );

  setCachedValue(recursiveImageCache, path, imagePaths);
  return imagePaths;
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
let categoriasCacheExpiry = 0;

export async function listarCategorias(): Promise<Categoria[]> {
  if (cachedCategorias && Date.now() < categoriasCacheExpiry) {
    return cachedCategorias;
  }

  const raiz = await listFolder('');
  const categorias = await Promise.all(
    raiz
      .filter(isFolder)
      .map(async (entry) => {
        const nomeCategoria = entry.name;
        const config = getCategoriaConfig(nomeCategoria);
        const conteudoCategoria = await listFolder(nomeCategoria);

        const subcategorias: Subcategoria[] = await Promise.all(
          conteudoCategoria
            .filter(isFolder)
            .map(async (item) => ({
              nome: item.name,
              slug: slugify(item.name),
              totalFigurinhas: await countImagesRecursively(joinStoragePath(nomeCategoria, item.name)),
            }))
        );

        subcategorias.sort((a, b) =>
          a.nome.localeCompare(b.nome, 'pt-BR', { numeric: true, sensitivity: 'base' })
        );

        const imagensDiretas = conteudoCategoria.filter(
          (item) => !isFolder(item) && isImageFile(item.name)
        ).length;
        const totalSubcategorias = subcategorias.reduce(
          (acc, subcategoria) => acc + subcategoria.totalFigurinhas,
          0
        );

        return {
          nome: nomeCategoria,
          slug: slugify(nomeCategoria),
          icone: config.icone,
          cor: config.cor,
          subcategorias,
          totalFigurinhas: imagensDiretas + totalSubcategorias,
        };
      })
  );

  categorias.sort((a, b) =>
    a.nome.localeCompare(b.nome, 'pt-BR', { numeric: true, sensitivity: 'base' })
  );

  cachedCategorias = categorias;
  categoriasCacheExpiry = Date.now() + CACHE_TTL_MS;

  return categorias;
}

export async function listarFigurinhas(
  categoria: string,
  subcategoria?: string
): Promise<Figurinha[]> {
  const categorias = await listarCategorias();
  const categoriaAtual = categorias.find((item) => item.slug === categoria);
  if (!categoriaAtual) {
    return [];
  }

  let storagePath = categoriaAtual.nome;

  if (subcategoria) {
    const subcategoriaAtual = categoriaAtual.subcategorias.find((item) => item.slug === subcategoria);
    if (!subcategoriaAtual) {
      return [];
    }

    storagePath = joinStoragePath(categoriaAtual.nome, subcategoriaAtual.nome);
  }

  const imagePaths = await collectImagesRecursively(storagePath);

  return imagePaths.map((filePath) => {
    const segments = filePath.split('/');
    const nomeArquivo = segments[segments.length - 1];
    const publicUrl = supabaseAdmin.storage.from(BUCKET).getPublicUrl(filePath).data.publicUrl;

    return {
      nome: nomeArquivo,
      url: publicUrl,
      tipo: nomeArquivo.slice(nomeArquivo.lastIndexOf('.') + 1).toLowerCase(),
    };
  });
}
