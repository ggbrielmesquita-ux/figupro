import { listarCategorias, listarFigurinhas } from './lib/figurinhas';

async function main() {
  console.log("Listing categories...");
  const cats = await listarCategorias();
  console.log(`Found ${cats.length} categories.`);
  if (cats.length > 0) {
     for (const cat of cats) {
       console.log(`\nCategory: ${cat.nome} (slug: ${cat.slug}), Total: ${cat.totalFigurinhas}`);
       const figs = await listarFigurinhas(cat.slug);
       console.log(`  -> Found ${figs.length} stickers directly in category.`);
       if (cat.subcategorias.length > 0) {
         for (const sub of cat.subcategorias) {
           const subFigs = await listarFigurinhas(cat.slug, sub.slug);
           console.log(`    -> Sub: ${sub.nome} (slug: ${sub.slug}), Found ${subFigs.length} stickers.`);
         }
       }
     }
  }
}

main().catch(console.error);
