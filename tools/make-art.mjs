// Draws the editions' pictures: article covers (cover.jpg) and photo-wall pictures (.webp), from the drawing lists in
// tools/art/<edition id>.mjs (each a list of { out, w, h, svg }, built with tools/art/kit.mjs). They are illustrations
// made in code, standing in until real photos arrive: drop a real picture at the same path and stop drawing that one
// (delete its entry). Renders each SVG in Chromium (with the site's own fonts from public/fonts) and saves it with
// sharp. Then run tools/make-card-covers.mjs for the covers' WebP copies.
//   node tools/make-art.mjs            every edition's list
//   node tools/make-art.mjs oct26      one edition's
import { readdirSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';
import { chromium } from 'playwright';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const only = process.argv[2];
const lists = readdirSync(join(ROOT, 'tools/art')).filter((f) => f !== 'kit.mjs' && f.endsWith('.mjs') && (!only || f === `${only}.mjs`));
const fontsCss = (await import('node:fs')).readFileSync(join(ROOT, 'src/styles/fontfaces.css'), 'utf8').replaceAll('url(/fonts/', `url(${pathToFileURL(join(ROOT, 'public/fonts')).href}/`);

const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const page = await browser.newPage();
let n = 0;
for (const file of lists) {
  const { default: items } = await import(pathToFileURL(join(ROOT, 'tools/art', file)).href);
  for (const { out, w, h, svg } of items) {
    await page.setViewportSize({ width: w, height: h });
    await page.setContent(`<!doctype html><html><head><style>${fontsCss} html,body{margin:0;background:#000}</style></head><body>${svg}</body></html>`);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(80);
    const png = await page.screenshot({ clip: { x: 0, y: 0, width: w, height: h } });
    const dest = join(ROOT, out);
    mkdirSync(dirname(dest), { recursive: true });
    const img = sharp(png);
    if (out.endsWith('.webp')) await img.webp({ quality: 82 }).toFile(dest); else await img.jpeg({ quality: 84, mozjpeg: true }).toFile(dest);
    console.log(`${out} ${w}x${h}`);
    n++;
  }
}
await browser.close();
console.log(`${n} pictures`);
