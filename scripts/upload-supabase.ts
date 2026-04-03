import * as fs from 'fs';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const BUCKET = 'figurinhas';
const FIGURINHAS_DIR = path.join(__dirname, '..', 'figurinhas');

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Erro: NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY precisam estar no .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function getAllFiles(dir: string, baseDir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllFiles(fullPath, baseDir));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

const MIME_TYPES: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
};

async function main() {
  // Verificar se o bucket existe, senão criar
  const { data: buckets } = await supabase.storage.listBuckets();
  const bucketExists = buckets?.some((b) => b.name === BUCKET);

  if (!bucketExists) {
    const { error } = await supabase.storage.createBucket(BUCKET, { public: false });
    if (error) {
      console.error('Erro ao criar bucket:', error.message);
      process.exit(1);
    }
    console.log(`Bucket '${BUCKET}' criado.`);
  } else {
    console.log(`Bucket '${BUCKET}' já existe.`);
  }

  const allFiles = getAllFiles(FIGURINHAS_DIR, FIGURINHAS_DIR);
  const imageFiles = allFiles.filter((f) => {
    const ext = path.extname(f).toLowerCase();
    return ext in MIME_TYPES;
  });

  console.log(`Total de arquivos para upload: ${imageFiles.length}`);

  let ok = 0;
  let erros = 0;

  for (let i = 0; i < imageFiles.length; i++) {
    const filePath = imageFiles[i];
    const rawPath = path.relative(FIGURINHAS_DIR, filePath).replace(/\\/g, '/');
    // Normaliza cada segmento do path: remove acentos e caracteres inválidos
    const relativePath = rawPath
      .split('/')
      .map((seg) =>
        seg
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/%/g, '')
          .trim()
      )
      .join('/');
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext];
    const fileBuffer = fs.readFileSync(filePath);

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(relativePath, fileBuffer, { contentType, upsert: true });

    if (error) {
      console.error(`[${i + 1}/${imageFiles.length}] ERRO: ${relativePath} — ${error.message}`);
      erros++;
    } else {
      ok++;
      if (ok % 50 === 0 || i === imageFiles.length - 1) {
        console.log(`[${i + 1}/${imageFiles.length}] OK: ${ok} enviados, ${erros} erros`);
      }
    }
  }

  console.log(`\nConcluído! ${ok} arquivos enviados, ${erros} erros.`);
}

main().catch((err) => {
  console.error('Erro inesperado:', err);
  process.exit(1);
});
