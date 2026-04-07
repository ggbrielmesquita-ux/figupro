import * as fs from 'fs';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const BUCKET = 'figurinhas';

// SUA PASTA ESTÁ FORA DO PUBLIC, ENTÃO FICA ASSIM:
const FIGURINHAS_DIR = path.join(__dirname, '..', 'figurinhas');

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Erro: NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY precisam estar no .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function getAllFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...getAllFiles(fullPath));
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

async function ensureBucketIsPublic() {
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();

  if (listError) {
    console.error('❌ Erro ao listar buckets:', listError.message);
    process.exit(1);
  }

  const bucketExists = buckets?.some((b) => b.name === BUCKET);

  if (!bucketExists) {
    const { error } = await supabase.storage.createBucket(BUCKET, {
      public: true,
    });

    if (error) {
      console.error('❌ Erro ao criar bucket:', error.message);
      process.exit(1);
    }

    console.log(`✅ Bucket '${BUCKET}' criado como PUBLIC.`);
  } else {
    console.log(`ℹ️ Bucket '${BUCKET}' já existe.`);

    // Tenta atualizar para public caso já exista
    const { error: updateError } = await supabase.storage.updateBucket(BUCKET, {
      public: true,
    });

    if (updateError) {
      console.warn(`⚠️ Não consegui garantir que o bucket ficou público: ${updateError.message}`);
      console.warn('👉 Vá no Supabase > Storage > figurinhas > Settings e deixe como PUBLIC');
    } else {
      console.log(`✅ Bucket '${BUCKET}' garantido como PUBLIC.`);
    }
  }
}

async function main() {
  if (!fs.existsSync(FIGURINHAS_DIR)) {
    console.error(`❌ Erro: pasta não encontrada -> ${FIGURINHAS_DIR}`);
    process.exit(1);
  }

  await ensureBucketIsPublic();

  const allFiles = getAllFiles(FIGURINHAS_DIR);

  const imageFiles = allFiles.filter((f) => {
    const ext = path.extname(f).toLowerCase();
    return ext in MIME_TYPES;
  });

  console.log(`📦 Total de arquivos para upload: ${imageFiles.length}`);

  let ok = 0;
  let erros = 0;

  for (let i = 0; i < imageFiles.length; i++) {
    const filePath = imageFiles[i];
    const rawPath = path.relative(FIGURINHAS_DIR, filePath).replace(/\\/g, '/');

    // Mantém a estrutura, só remove acentos e % para evitar bugs
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
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const fileBuffer = fs.readFileSync(filePath);

    let success = false;
    let attempts = 0;
    while (attempts < 3 && !success) {
      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(relativePath, fileBuffer, {
          contentType,
          upsert: true,
        });

      if (error) {
        attempts++;
        if (attempts >= 3) {
          console.error(`❌ [${i + 1}/${imageFiles.length}] ERRO: ${relativePath} — ${error.message}`);
          erros++;
        } else {
          await new Promise((r) => setTimeout(r, 1000));
        }
      } else {
        success = true;
        ok++;

        if (ok % 50 === 0 || i === imageFiles.length - 1) {
          console.log(`✅ [${i + 1}/${imageFiles.length}] OK: ${ok} enviados, ${erros} erros`);
        }
      }
    }
  }

  console.log('\n🎉 Upload concluído!');
  console.log(`✅ Enviados: ${ok}`);
  console.log(`❌ Erros: ${erros}`);
}

main().catch((err) => {
  console.error('❌ Erro inesperado:', err);
  process.exit(1);
});