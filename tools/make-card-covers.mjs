// Writes two WebP copies of each article's cover.jpg, in its folder (public/editions/<id>/articles/<slug>/):
// - cover-card.webp: 480px wide, q78, for the cards (and the article page on a low-density screen)
// - cover-page.webp: 900px wide, q80, for the article page (a third to half the weight of the JPEG; srcset picks)
// The cards on the home pages are ~150-340px wide, so loading the 900-1200px original for every one of them (rotated,
// swinging) is what made the home page heavy (~1.8 MB of covers for one edition; the copies are a tenth of that).
// Link previews keep cover.jpg (not every app reads WebP); a page falls back to cover.jpg if a copy is missing.
// Run after adding or changing a cover (needs `npm install`, for sharp):  node tools/make-card-covers.mjs
import { readdirSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const ROOT = new URL('../public/editions/', import.meta.url).pathname;
let n = 0;
for (const ed of readdirSync(ROOT)) {
  const arts = join(ROOT, ed, 'articles');
  if (!existsSync(arts)) continue;
  for (const slug of readdirSync(arts)) {
    const src = join(arts, slug, 'cover.jpg');
    if (!existsSync(src) || !statSync(src).isFile()) continue;
    const info = await sharp(src).resize({ width: 480, withoutEnlargement: true }).webp({ quality: 78 }).toFile(join(arts, slug, 'cover-card.webp'));
    const page = await sharp(src).resize({ width: 900, withoutEnlargement: true }).webp({ quality: 80 }).toFile(join(arts, slug, 'cover-page.webp'));
    console.log(`${ed}/${slug}: card ${info.width}x${info.height} ${(info.size / 1024).toFixed(0)}k, page ${page.width}x${page.height} ${(page.size / 1024).toFixed(0)}k (jpg ${(statSync(src).size / 1024).toFixed(0)}k)`);
    n++;
  }
}
console.log(`${n} card covers`);
