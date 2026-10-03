// Link-preview pictures (1200×630, the shape WhatsApp, Instagram, iMessage… show big), all kept together in public/og/
// (src/data/editions.js ogImage):
//   home.jpg            the main page: every edition as its notebook from the opening animation ("Top secret", its
//                       issue in a foil box), fanned beside the TerraNotes name
//   <edition id>.jpg    each edition (sep26.jpg): its paper (September ruled notebook, October's Pujo ribbon and toran),
//                       the name, its month and a "No. 01" stamp, and up to three of its covers (topped up from its
//                       photo wall) hanging on a string
//   <id>-<slug>.jpg     each article (sep26-labs.jpg): on its edition's paper, the cover hanging in a frame its own shape
//                       (never cropped), a "TerraNotes · No. 01 · September 2026" tape, the tag, title, dek and byline
// The build (build/siteFiles.js; inside AQ, its prerender) points each page at its picture under a content-hashed name.
// Run after adding an article, changing a cover or adding an edition:  node tools/make-link-previews.mjs
// (needs Playwright: npm i -D playwright; env CHROMIUM = a browser to use, FONTS_DIR = serve the Google Fonts from a
// local folder: fonts.css + files named after their URL)
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { ALL_ARTICLES, tagOf } from '../src/data/articles.js';
import { EDITIONS, editionId, ogImage } from '../src/data/editions.js';
import { editionData } from '../src/editions/index.js';
import { withBase } from '../src/lib/base.js';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..'); // the project (inside AQ: its frontend/)
const pub = (url) => path.join(root, 'public', url.replace(/^\//, '')); // a site URL (with AQ's base) → its file
const TYPES = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp' };
const data = (url) => `data:${TYPES[url.split('.').pop().toLowerCase()]};base64,${fs.readFileSync(pub(url)).toString('base64')}`;
const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const pad = (n) => String(n).padStart(2, '0');
const FONTS = 'https://fonts.googleapis.com/css2?family=Archivo+Black&family=Caveat:wght@600;700&family=Instrument+Serif:ital@0;1&family=Space+Mono:wght@400;700&family=Figtree:wght@500&display=block';
const globe = data(withBase('/brand/aquaterra-globe.webp')), word = data(withBase('/brand/aquaterra-wordmark.webp'));
// a cover: its small card copy when there is one (tools/make-card-covers.mjs), else the original
const cover = (a) => { const card = a.cover.replace(/cover\.jpg$/, 'cover-card.webp'); return data(fs.existsSync(pub(card)) ? card : a.cover); };
const SIZE = new Map(); // picture → [w, h], so every frame takes its picture's own shape (nothing cropped)
const fit = (src, maxW, maxH) => { const [w, h] = SIZE.get(src); const k = Math.min(maxW / w, maxH / h); return [Math.round(w * k), Math.round(h * k)]; };

// the edition's paper: September a ruled notebook page, October bright Pujo cream with its ribbon, dots and a toran;
// an edition not listed here gets its plain page colour until it's given its own (and its own line in TAGLINE)
function paper(id, C) {
  if (id !== 'sep26' && id !== 'oct26') return `body{background:${C.page}}`;
  if (id === 'sep26') return `
    body{background:${C.page};background-image:linear-gradient(to right,transparent 0 108px,rgba(229,72,77,.55) 108px 110px,transparent 110px),repeating-linear-gradient(to bottom,transparent 0 31px,rgba(61,123,253,.18) 31px 32px);background-position:0 0,0 14px}
    .holes i{position:absolute;left:34px;width:30px;height:30px;border-radius:50%;background:${C.outside};box-shadow:inset 0 2px 3px rgba(0,0,0,.18)}`;
  return `
    body{background:${C.page};background-image:linear-gradient(to right,#F0214A 0 22px,#FFC914 22px 28px,#18C7B8 28px 33px,transparent 33px calc(100% - 33px),#18C7B8 calc(100% - 33px) calc(100% - 28px),#FFC914 calc(100% - 28px) calc(100% - 22px),#F0214A calc(100% - 22px)),radial-gradient(circle,rgba(232,17,95,.16) 0 2.5px,transparent 3px),radial-gradient(circle,rgba(24,199,184,.16) 0 2.5px,transparent 3px);background-size:auto,36px 36px,36px 36px;background-position:0 0,0 0,18px 18px}`;
}
function toran(C) { // marigolds across the top, a mango leaf every few
  let s = '<svg class="toran" width="1200" height="70" viewBox="0 0 1200 70">', y = (x) => 8 + 22 * Math.sin(Math.PI * ((x % 300) / 300));
  for (let k = 0; k < 4; k++) for (const f of [0.25, 0.5, 0.75]) { const x = k * 300 + f * 300; s += `<path d="M${x} ${y(x) + 4} q-9 18 0 34 q9 -16 0 -34 Z" fill="${C.green}" stroke="${C.ink}" stroke-width="1.4"/>`; }
  for (let x = 6, i = 0; x < 1200; x += 14, i++) s += `<circle cx="${x}" cy="${y(x)}" r="7" fill="${i % 3 === 2 ? C.red : C.yellow}" stroke="${C.ink}" stroke-width="1.2"/>`;
  return s + '</svg>';
}
const TAGLINE = { sep26: 'exam season: write-ups, photos & words', oct26: 'the Pujo issue: pandals, dhak & bhog' };
function shell(e, inner, extraCss = '') {
  const { look: { colors: C, fonts: F, fontsCss } } = editionData(e.number);
  const sep = e.id === 'sep26';
  return `<!doctype html><html><head><link rel="stylesheet" href="${FONTS}">${fontsCss ? `<link rel="stylesheet" href="${fontsCss}">` : ''}<style>
  *{box-sizing:border-box} body{margin:0;width:1200px;height:630px;overflow:hidden;position:relative;font-family:${F.body};color:${C.ink}}
  ${paper(e.id, C)}
  .toran{position:absolute;left:0;top:0}
  .badge{position:absolute;display:flex;flex-direction:column;align-items:center;justify-content:center;width:150px;height:150px;border-radius:50%;background:${sep ? C.yellow : C.hand};color:${sep ? C.ink : C.card};border:3px solid ${C.ink};box-shadow:6px 6px 0 ${C.ink};transform:rotate(-10deg);font:700 15px/1.1 ${F.mono};letter-spacing:2px;text-transform:uppercase;text-align:center}
  .badge b{display:block;font:400 64px/1 ${F.head};letter-spacing:-1px;margin:2px 0}
  .logo{display:flex;align-items:center;gap:12px} .logo .g{width:58px;height:58px} .logo .w{height:32px;display:block}
  ${extraCss}
  </style></head><body>${sep ? '<div class="holes"><i style="top:120px"></i><i style="top:300px"></i><i style="top:480px"></i></div>' : e.id === 'oct26' ? toran(C) : ''}${inner}</body></html>`;
}

function editionCard(e) {
  const d = editionData(e.number), { colors: C, fonts: F } = d.look, sep = e.id === 'sep26';
  // up to three prints on the wire: the edition's covers, topped up from its photo wall (October: Maa Durga)
  const picks = [...d.articles.filter((a) => a.cover).map((a) => ({ src: cover(a), color: tagOf(a).color })),
    ...d.photos.filter((x) => x.photo).map((x) => ({ src: data(x.photo), color: C.yellow }))].slice(0, 3);
  const spots = [[650, 150, -6], [835, 120, 3], [1000, 165, -2]];
  const cards = picks.map((k, i) => { const [x, y, r] = spots[i + (3 - picks.length)];
    const [w, h] = fit(k.src, 175, 210);
    return `<div class="hang" style="left:${x}px;top:${y}px;transform:rotate(${r}deg)"><div class="rope"></div><div class="peg" style="background:${k.color}"></div><img src="${k.src}" style="width:${w}px;height:${h}px"></div>`; }).join('');
  const css = `
  .left{position:absolute;left:${sep ? 150 : 80}px;top:${sep ? 96 : 120}px;width:520px}
  .kicker{font:700 17px/1 ${F.mono};letter-spacing:3px;text-transform:uppercase;color:${C.text}}
  h1{margin:18px 0 0;font:italic 400 128px/0.9 ${F.serif};letter-spacing:-2px;color:${C.ink}}
  .hand{margin-top:22px;font:700 40px/1.05 ${F.hand};color:${C.hand}}
  .month{margin-top:26px;display:inline-block;background:${C.card};border:3px solid ${C.ink};box-shadow:6px 6px 0 ${sep ? C.yellow : C.string};padding:10px 18px;font:400 26px/1 ${F.head};text-transform:uppercase}
  .wire{position:absolute;left:600px;right:-10px;top:${sep ? 120 : 104}px;height:2.5px;background:${C.string};transform:rotate(1.5deg)}
  .hang{position:absolute;background:${C.card};border:3px solid ${C.ink};box-shadow:10px 10px 0 ${C.ink};padding:9px}
  .hang img{display:block}
  .rope{position:absolute;left:50%;bottom:100%;width:2px;height:60px;background:${C.string}}
  .peg{position:absolute;left:50%;top:-12px;width:36px;height:15px;margin-left:-18px;border:2.5px solid ${C.ink}}
  .foot{position:absolute;left:${sep ? 150 : 80}px;bottom:42px}`;
  return shell(e, `
    <div class="left"><div class="kicker">Aquaterra's monthly magazine</div><h1>TerraNotes</h1>
      <div class="hand">${esc(TAGLINE[e.id] || `${e.month}: write-ups, photos & words`)}</div>
      <div class="month">${esc(e.month)}</div></div>
    <div class="wire"></div>${cards}
    <div class="badge" style="right:60px;bottom:40px">No.<b>${pad(e.number)}</b>edition</div>
    <div class="foot logo"><img class="g" src="${globe}"><img class="w" src="${word}"></div>`, css);
}

function articleCard(e, a) {
  const d = editionData(e.number), { colors: C, fonts: F } = d.look, sep = e.id === 'sep26', t = tagOf(a);
  const src = cover(a), [w, h] = fit(src, 400, 440), x0 = sep ? 150 : 76, top = Math.round((630 - h - 24) / 2) + 14;
  const css = `
  .hang{position:absolute;left:${x0}px;top:${top}px;background:${C.card};border:3px solid ${C.ink};box-shadow:12px 12px 0 ${t.color};padding:12px;transform:rotate(-2deg)}
  .hang img{display:block;width:${w}px;height:${h}px}
  .rope{position:absolute;left:50%;bottom:100%;width:2.5px;height:${top + 20}px;background:${C.string}}
  .peg{position:absolute;left:50%;top:-14px;width:46px;height:18px;margin-left:-23px;background:${t.color};border:2.5px solid ${C.ink}}
  .right{position:absolute;left:${x0 + w + 24 + 60}px;right:${sep ? 60 : 70}px;top:${sep ? 70 : 96}px;bottom:46px;display:flex;flex-direction:column}
  .ed{align-self:flex-start;background:${sep ? C.yellow : C.hand};color:${sep ? C.ink : C.card};border:2.5px solid ${C.ink};box-shadow:4px 4px 0 ${C.ink};padding:8px 14px;font:700 16px/1 ${F.mono};letter-spacing:2px;text-transform:uppercase;transform:rotate(-2deg)}
  .tag{align-self:flex-start;margin-top:22px;background:${t.color};color:${t.ink};border:2.5px solid ${C.ink};border-radius:999px;padding:6px 16px;font:700 16px/1 ${F.mono};letter-spacing:2px;text-transform:uppercase}
  h1{margin:16px 0 0;font:400 60px/0.98 ${F.head};text-transform:uppercase;letter-spacing:-1px;color:${C.ink}}
  .dek{margin-top:14px;font:700 32px/1.05 ${F.hand};color:${C.hand}}
  .by{margin-top:auto;display:flex;align-items:center;justify-content:space-between;font:700 16px/1 ${F.mono};letter-spacing:2px;text-transform:uppercase;color:${C.text}}`;
  return shell(e, `
    <div class="hang"><div class="rope"></div><div class="peg"></div><img src="${src}"></div>
    <div class="right"><div class="ed">TerraNotes · No. ${pad(e.number)} · ${esc(e.month)}</div><div class="tag">${esc(a.tag)}</div>
      <h1 id="t">${esc(a.title)}</h1><div class="dek">${esc(a.dek)}</div>
      <div class="by"><span>${a.author ? `By ${esc(a.author)}` : 'TerraNotes'}</span><span class="logo"><img class="g" src="${globe}" style="width:44px;height:44px"><img class="w" src="${word}" style="height:24px"></span></div></div>`, css);
}


// the main page: the magazine itself. Every edition as its notebook from the opening animation (its cover colour, the
// "Top secret" foil and its number in a foil box), fanned on a desk, newest on top, beside the name.
function mainCard() {
  const eds = EDITIONS.filter((e) => !e.draft), L = editionData(eds[eds.length - 1].number).look, C = L.colors, F = L.fonts;
  const books = eds.map((e, i) => { const { colors: c, fonts: f } = editionData(e.number).look, n = eds.length, k = i - (n - 1) / 2;
    return `<div class="book" style="left:${790 + k * 235}px;top:${118 + Math.abs(k) * 24}px;transform:rotate(${k * 10}deg);z-index:${i};background:${c.text};box-shadow:10px 10px 0 ${c.ink}">
      <div class="imp"><div class="s">Aquaterra · field notes</div><div class="sec" style="color:${c.yellow};font-family:${f.head}">Top<br>secret</div>
      <div class="rule"></div><div class="nm" style="font-family:${f.serif}">TerraNotes</div>
      <div class="iss" style="color:${c.yellow};border-color:${c.yellow};font-family:${f.head}">Issue ${pad(e.number)}</div><div class="mo" style="color:${c.page}">${esc(e.month)}</div></div></div>`; }).join('');
  return `<!doctype html><html><head><link rel="stylesheet" href="${FONTS}">${[...new Set(eds.map((e) => editionData(e.number).look.fontsCss).filter(Boolean))].map((h) => `<link rel="stylesheet" href="${h}">`).join('')}<style>
  *{box-sizing:border-box} body{margin:0;width:1200px;height:630px;overflow:hidden;position:relative;background:#EFEBE1;background-image:radial-gradient(rgba(24,33,58,.09) 1.2px,transparent 1.6px);background-size:22px 22px;font-family:${F.body};color:#18213A}
  .left{position:absolute;left:84px;top:118px;width:520px}
  .kicker{font:700 17px/1 ${F.mono};letter-spacing:3px;text-transform:uppercase;color:#253048}
  h1{margin:16px 0 0;font:italic 400 136px/0.88 'Instrument Serif',serif;letter-spacing:-2px}
  .hand{margin-top:20px;font:700 42px/1.05 'Caveat',cursive;color:#2349B8}
  .line{margin-top:24px;font:500 21px/1.45 'Figtree',sans-serif;color:#253048;max-width:470px}
  .logo{position:absolute;left:84px;bottom:46px;display:flex;align-items:center;gap:12px} .logo .g{width:58px;height:58px} .logo .w{height:32px;display:block}
  .book{position:absolute;width:268px;height:372px;border-radius:4px 12px 12px 4px;border:2.5px solid #18213A;display:flex;align-items:center;justify-content:center}
  .book::before{content:"";position:absolute;left:16px;top:6%;bottom:6%;border-left:1.5px dashed rgba(255,255,255,.3)}
  .imp{display:flex;flex-direction:column;align-items:center;gap:9px;padding:20px 22px;border:2px solid rgba(0,0,0,.32);box-shadow:0 1px 0 rgba(255,255,255,.14),inset 0 1px 0 rgba(255,255,255,.1);text-align:center}
  .s,.nm{color:rgba(0,0,0,.42);text-shadow:0 1px 0 rgba(255,255,255,.16),0 -1px 0 rgba(0,0,0,.35)}
  .s{font:400 11px/1.2 'Space Mono',monospace;letter-spacing:.18em;text-transform:uppercase}
  .nm{font-style:italic;font-size:32px;line-height:1}
  .rule{width:60%;border-top:2px solid rgba(0,0,0,.32);box-shadow:0 1px 0 rgba(255,255,255,.14)}
  .sec{font-size:46px;line-height:.9;text-transform:uppercase;opacity:.85;transform:rotate(-4deg);text-shadow:0 -1px 0 rgba(0,0,0,.45),0 1px 0 rgba(255,255,255,.2)}
  .iss{font-size:24px;line-height:1;text-transform:uppercase;letter-spacing:.04em;padding:5px 11px;border:2px solid;opacity:.9;text-shadow:0 -1px 0 rgba(0,0,0,.45)}
  .mo{font:700 12px/1.2 'Space Mono',monospace;letter-spacing:.14em;text-transform:uppercase}
  .tape{position:absolute;right:60px;bottom:44px;background:#FFD43B;border:2.5px solid #18213A;box-shadow:4px 4px 0 #18213A;padding:9px 16px;font:700 15px/1 'Space Mono',monospace;letter-spacing:2px;text-transform:uppercase;transform:rotate(-3deg)}
  </style></head><body>
  <div class="left"><div class="kicker">Aquaterra's monthly magazine</div><h1>TerraNotes</h1>
    <div class="hand">notes from where the land meets the water</div>
    <div class="line">Stories, research, fashion, photos and art by Aquaterra's students. A new edition every month, each with its own look.</div></div>
  ${books}
  <div class="tape">${eds.length} editions so far · read them all</div>
  <div class="logo"><img class="g" src="${globe}"><img class="w" src="${word}"></div></body></html>`;
}


const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const ctx = await browser.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
if (process.env.FONTS_DIR) { // offline: serve Google Fonts from a local folder (fonts.css + files named after their URL)
  const css = fs.readFileSync(path.join(process.env.FONTS_DIR, 'fonts.css'), 'utf8');
  await ctx.route(/fonts\.googleapis\.com/, (r) => r.fulfill({ body: css, contentType: 'text/css' }));
  await ctx.route(/fonts\.gstatic\.com/, (r) => r.fulfill({ path: path.join(process.env.FONTS_DIR, r.request().url().replace('https://fonts.gstatic.com/', '').replace(/\//g, '_')), contentType: 'font/woff2' }));
}
const p = await ctx.newPage();
const measure = async (srcs) => { for (const s of srcs) if (!SIZE.has(s)) SIZE.set(s, await p.evaluate((u) => new Promise((ok) => { const i = new Image(); i.onload = () => ok([i.naturalWidth, i.naturalHeight]); i.src = u; }), s)); };
const shot = async (html, url) => {
  await p.setContent(html, { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  // an article's title shrinks until it fits in four lines
  await p.evaluate(() => { const t = document.getElementById('t'); if (!t) return; let s = 60; while (t.getBoundingClientRect().height > s * 0.98 * 4 + 4 && s > 34) { s -= 2; t.style.fontSize = `${s}px`; } });
  const file = pub(url);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  await p.screenshot({ path: file, type: 'jpeg', quality: 84 });
  console.log(url, Math.round(fs.statSync(file).size / 1024), 'KB');
};
await shot(mainCard(), ogImage.home());
for (const ed of EDITIONS) {
  const e = { ...ed, id: editionId(ed.number) }, d = editionData(e.number), mine = ALL_ARTICLES.filter((a) => a.edition === e.number && a.cover);
  await measure([...mine.map(cover), ...d.photos.filter((x) => x.photo).map((x) => data(x.photo))]);
  await shot(editionCard(e), ogImage.edition(e.number));
  for (const a of mine) await shot(articleCard(e, a), ogImage.article(a));
}
await browser.close();
