// January 2027's drawn pictures (tools/make-art.mjs): five article covers in the "Boi Mela" style (kraft, ink blue,
// brick red, cloth-binding colours, Playfair Display titles) and six photo-wall pictures of the fair and winter.
import { circle, coverText, crowd, glow, grad, path, rect, rng, svg } from './kit.mjs';

const C = { kraft: '#F1E4C6', paper: '#FBF5E6', ink: '#1D2B36', red: '#C0392B', blue: '#2D6A8E', green: '#3C8D5A', mustard: '#E0A526', plum: '#6B4C9A', rose: '#D96C8A', wood: '#8A5A3B' };
const BOOKS = [C.red, C.blue, C.green, C.mustard, C.plum, C.ink, C.rose];
const head = "'Playfair Display', Georgia, serif";
const D = '/editions/jan27';
const awning = (x0, x1, y, h, a = C.red, b = C.paper) => { let s = ''; for (let x = x0, i = 0; x < x1; x += 50, i++) s += rect(x, y, 50, h, i % 2 ? b : a) + circle(x + 25, y + h, 25, i % 2 ? b : a); return s; };
const spines = (r, x0, x1, y, hMin, hMax) => { let s = '', x = x0; let i = 0; while (x < x1 - 20) { const w = 34 + r() * 30, h = hMin + r() * (hMax - hMin); s += rect(x, y - h, w, h, BOOKS[i % 7], `stroke="${C.ink}" stroke-width="2"`) + rect(x, y - h + 14, w, 6, '#FFFFFF', 'opacity=".35"'); x += w + 3; i++; } return s; };

// --- covers (900 × 1200)
function fairInADay() {
  const w = 900, h = 1200, r = rng(401);
  return svg(w, h, `${rect(0, 0, w, h, C.kraft)}
${awning(0, w, 160, 110)}${rect(0, 300, w, 520, '#E9D8B0')}${spines(r, 60, 840, 560, 120, 220)}${rect(40, 560, 820, 26, C.wood)}${spines(r, 60, 840, 800, 120, 200)}${rect(40, 800, 820, 26, C.wood)}
${crowd(r, { x1: w, y: 880, fill: C.ink, size: 36, rows: 1 })}${rect(0, 878, w, 330, C.ink)}${rect(0, 0, w, 150, C.ink)}
${coverText({ w, h, kicker: 'FIELD NOTES · BOI MELA', title: 'THE BOOK FAIR', title2: 'IN A DAY', ink: C.paper, accent: C.mustard, font: head, size: 92, frame: C.mustard })}`);
}
function littleMags() {
  const w = 900, h = 1200, r = rng(411);
  let mags = '';
  for (let i = 0; i < 14; i++) { const x = 90 + (i % 5) * 150 + (r() - 0.5) * 30, y = 260 + Math.floor(i / 5) * 210 + (r() - 0.5) * 30, c = BOOKS[i % 7]; mags += `<g transform="rotate(${((r() - 0.5) * 16).toFixed(1)} ${x + 60} ${y + 80})">${rect(x, y, 120, 160, C.paper, `stroke="${C.ink}" stroke-width="2"`)}${rect(x + 12, y + 14, 96, 70, c)}${rect(x + 12, y + 96, 80, 8, C.ink)}${rect(x + 12, y + 112, 60, 6, C.ink, 'opacity=".5"')}${circle(x + 92, y + 140, 6, C.ink)}</g>`; }
  return svg(w, h, `${rect(0, 0, w, h, C.red)}${rect(60, 220, 780, 680, '#E9D8B0')}${mags}
${coverText({ w, h, kicker: 'REPORTAGE · LAGHU PATRIKA', title: 'THE LITTLE', title2: 'MAGAZINES', ink: C.paper, accent: C.mustard, font: head, size: 100, frame: C.paper })}`);
}
function neverReturn() {
  const w = 900, h = 1200;
  return svg(w, h, `${rect(0, 0, w, h, C.blue)}${glow(450, 520, 460, '#FFFFFF', 0.18, 'g')}
<g transform="rotate(-8 450 520)">${rect(200, 220, 460, 600, C.green, `stroke="${C.ink}" stroke-width="4"`)}${rect(200, 220, 40, 600, '#2C6B44')}${rect(270, 300, 330, 120, C.paper, 'opacity=".9"')}
<text x="435" y="372" text-anchor="middle" font-family="${head}" font-size="40" font-weight="900" fill="${C.ink}">LIBRARY COPY</text></g>
<g transform="rotate(10 600 380)">${rect(520, 140, 210, 300, C.paper, `stroke="${C.ink}" stroke-width="3"`)}<text x="625" y="182" text-anchor="middle" font-family="'Space Mono', monospace" font-size="20" font-weight="700" fill="${C.ink}">DATE DUE</text>
${[0, 1, 2, 3].map((i) => `<line x1="540" y1="${206 + i * 50}" x2="710" y2="${206 + i * 50}" stroke="${C.blue}" stroke-width="2"/>`).join('')}
<text x="560" y="240" font-family="'Space Mono', monospace" font-size="22" fill="${C.red}" transform="rotate(-4 600 240)">14 MAR</text></g>
${coverText({ w, h, kicker: 'ESSAY · OVERDUE', title: 'THE BOOK I’LL', title2: 'NEVER RETURN', ink: C.paper, accent: C.mustard, font: head, size: 84, frame: C.mustard })}`);
}
function parade() {
  const w = 900, h = 1200, r = rng(421);
  let band = '';
  for (let i = 0; i < 6; i++) { const x = 110 + i * 130; band += rect(x - 26, 560, 52, 230, '#FFFFFF', `stroke="${C.ink}" stroke-width="2"`) + circle(x, 532, 30, '#8D5524') + rect(x - 30, 488, 60, 30, C.ink) + rect(x - 34, 515, 68, 8, C.ink) + rect(x - 22, 790, 18, 60, C.ink) + rect(x + 4, 790, 18, 60, C.ink) + circle(x + 30, 640, 26, C.mustard, `stroke="${C.ink}" stroke-width="2"`); }
  let flags = '';
  for (let i = 0; i < 9; i++) { const x = 60 + i * 100, y = 170 + (i % 2) * 20; flags += rect(x, y, 70, 16, '#FF9933') + rect(x, y + 16, 70, 16, '#FFFFFF') + rect(x, y + 32, 70, 16, '#138808') + circle(x + 35, y + 24, 6, '#000080'); }
  return svg(w, h, `${rect(0, 0, w, h, 'url(#m)')}${rect(0, 0, w, 150, C.ink)}${flags}${rect(0, 850, w, 360, '#7B6E62')}${band}${crowd(r, { x1: w, y: 900, fill: C.ink, size: 30, rows: 1 })}${rect(0, 898, w, 310, C.ink)}
${coverText({ w, h, kicker: 'DISPATCH · 26 JANUARY', title: 'REPUBLIC DAY,', title2: 'FROM THE PAVEMENT', ink: C.paper, accent: C.mustard, font: head, size: 70, frame: C.mustard })}`, { defs: grad('m', [[0, '#C9D3D6'], [1, '#EFE5D2']]) });
}
function winter() {
  const w = 900, h = 1200;
  let steam = '';
  for (let i = 0; i < 3; i++) steam += path(`M${400 + i * 40} 470 q-30 -60 0 -110 t0 -110`, 'none', `stroke="#FFFFFF" stroke-width="10" stroke-linecap="round" opacity="${0.55 - i * 0.12}"`);
  return svg(w, h, `${rect(0, 0, w, h, '#C9D0D2')}${rect(100, 120, 700, 560, '#E8ECEC')}${rect(100, 120, 700, 560, 'none', `stroke="${C.ink}" stroke-width="16"`)}${rect(445, 120, 10, 560, C.ink)}
${path('M100 520 Q300 480 450 520 Q620 560 800 500 L800 680 L100 680 Z', '#B5BEC0')}
${rect(60, 680, 780, 40, C.wood)}${steam}${path('M350 520 L550 520 L530 670 L370 670 Z', C.red, `stroke="${C.ink}" stroke-width="4"`)}${path('M550 550 Q610 560 600 610 Q590 640 540 640', 'none', `stroke="${C.ink}" stroke-width="10"`)}
${coverText({ w, h, kicker: 'PROSE · KUASHA', title: 'WINTER IN', title2: 'ELEVEN SENTENCES', ink: C.ink, accent: C.red, font: head, size: 78, frame: C.ink })}`);
}

// --- the photo wall
function aisles() {
  const w = 1000, h = 1000, r = rng(431);
  return svg(w, h, `${rect(0, 0, w, h, '#BFD3DD')}${awning(0, 420, 120, 90)}${awning(580, w, 120, 90, C.blue, C.paper)}
${rect(0, 210, 420, 500, '#E9D8B0')}${spines(r, 20, 400, 420, 100, 180)}${rect(0, 420, 420, 20, C.wood)}${spines(r, 20, 400, 640, 100, 180)}${rect(0, 640, 420, 20, C.wood)}
${rect(580, 210, 420, 500, '#E9D8B0')}${spines(r, 600, 980, 420, 100, 180)}${rect(580, 420, 420, 20, C.wood)}${spines(r, 600, 980, 640, 100, 180)}${rect(580, 640, 420, 20, C.wood)}
${path('M420 1000 L580 1000 L540 300 L460 300 Z', '#D8C7A0')}${rect(0, 700, w, 300, '#CBB990')}${crowd(r, { x1: w, y: 860, fill: C.ink, size: 34, rows: 2 })}`);
}
function stack() {
  const w = 1000, h = 750;
  let s = '';
  for (let i = 0; i < 9; i++) { const bw = 380 + ((i * 53) % 140), x = 500 - bw / 2 + ((i % 3) - 1) * 20; s += rect(x, 640 - (i + 1) * 54, bw, 50, BOOKS[i % 7], `stroke="${C.ink}" stroke-width="3" rx="4"`) + rect(x + 20, 640 - (i + 1) * 54 + 18, bw * 0.3, 8, '#FFFFFF', 'opacity=".5"'); }
  return svg(w, h, `${rect(0, 0, w, h, C.kraft)}${rect(0, 640, w, 110, C.wood)}${s}`);
}
function littleMagsPhoto() {
  const w = 1000, h = 750, r = rng(441);
  let m = '';
  for (let i = 0; i < 18; i++) { const x = 40 + (i % 6) * 160 + (r() - 0.5) * 20, y = 120 + Math.floor(i / 6) * 200 + (r() - 0.5) * 20, c = BOOKS[(i * 3) % 7]; m += `<g transform="rotate(${((r() - 0.5) * 14).toFixed(1)} ${x + 60} ${y + 80})">${rect(x, y, 120, 160, C.paper, `stroke="${C.ink}" stroke-width="2"`)}${rect(x + 10, y + 12, 100, 74, c)}${rect(x + 10, y + 98, 78, 8, C.ink)}</g>`; }
  return svg(w, h, `${rect(0, 0, w, h, '#6F4A33')}${m}`);
}
function fog() {
  const w = 1000, h = 750, r = rng(451);
  let trees = '';
  for (let i = 0; i < 7; i++) { const x = 60 + i * 150 + (r() - 0.5) * 40, s = 0.7 + r() * 0.5; trees += rect(x - 6, 420 - 60 * s, 12, 160 * s, '#7E8A88', `opacity="${0.4 + s * 0.3}"`) + circle(x, 400 - 100 * s, 80 * s, '#9AA6A3', `opacity="${0.35 + s * 0.25}"`); }
  return svg(w, h, `${rect(0, 0, w, h, 'url(#f)')}${trees}${rect(0, 520, w, 230, '#A9B7A9')}${rect(0, 380, w, 260, '#E6EAEA', 'opacity=".55"')}
${circle(760, 180, 50, '#FFFFFF', 'opacity=".7"')}`, { defs: grad('f', [[0, '#DCE2E2'], [1, '#C4CDCB']]) });
}
function pithe() {
  const w = 1000, h = 1000;
  let p = '';
  for (let i = 0; i < 7; i++) { const a = (i / 7) * Math.PI * 2, x = 500 + Math.cos(a) * 200, y = 520 + Math.sin(a) * 170; p += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="80" ry="46" fill="#F3E3C0" stroke="#C9A06A" stroke-width="4" transform="rotate(${((a * 180) / Math.PI + 90).toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})"/>` + path(`M${x - 40} ${y} q20 -14 40 0 t40 0`, 'none', 'stroke="#C9A06A" stroke-width="3"'); }
  return svg(w, h, `${rect(0, 0, w, h, '#C9D7C4')}${circle(500, 520, 380, '#FFFFFF')}${circle(500, 520, 350, '#F1F4F0')}${p}${circle(500, 520, 90, '#8B4B2B')}${circle(480, 500, 30, '#B06B3E')}`);
}
function paradePhoto() {
  const w = 1000, h = 750, r = rng(461);
  let marchers = '';
  for (let row = 0; row < 3; row++) for (let i = 0; i < 9; i++) { const x = 70 + i * 105 + row * 20, y = 420 + row * 70; marchers += rect(x - 16, y, 32, 120, '#FFFFFF', `stroke="${C.ink}" stroke-width="1.5"`) + circle(x, y - 16, 16, '#8D5524') + rect(x - 18, y - 40, 36, 18, C.ink); }
  let flags = '';
  for (let i = 0; i < 10; i++) { const x = 30 + i * 100; flags += rect(x, 120, 60, 14, '#FF9933') + rect(x, 134, 60, 14, '#FFFFFF') + rect(x, 148, 60, 14, '#138808') + circle(x + 30, 141, 5, '#000080'); }
  return svg(w, h, `${rect(0, 0, w, h, 'url(#m)')}${flags}${rect(0, 380, w, 370, '#8A7D70')}${marchers}${crowd(r, { x1: w, y: 760, fill: C.ink, size: 30, rows: 1 })}`, { defs: grad('m', [[0, '#C9D3D6'], [1, '#EFE5D2']]) });
}

export default [
  { out: `public${D}/articles/the-book-fair-in-a-day/cover.jpg`, w: 900, h: 1200, svg: fairInADay() },
  { out: `public${D}/articles/the-little-magazines/cover.jpg`, w: 900, h: 1200, svg: littleMags() },
  { out: `public${D}/articles/the-book-i-will-never-return/cover.jpg`, w: 900, h: 1200, svg: neverReturn() },
  { out: `public${D}/articles/republic-day-from-the-pavement/cover.jpg`, w: 900, h: 1200, svg: parade() },
  { out: `public${D}/articles/winter-in-eleven-sentences/cover.jpg`, w: 900, h: 1200, svg: winter() },
  { out: `public${D}/photos/aisles.webp`, w: 1000, h: 1000, svg: aisles() },
  { out: `public${D}/photos/stack.webp`, w: 1000, h: 750, svg: stack() },
  { out: `public${D}/photos/little-mags.webp`, w: 1000, h: 750, svg: littleMagsPhoto() },
  { out: `public${D}/photos/fog.webp`, w: 1000, h: 750, svg: fog() },
  { out: `public${D}/photos/pithe.webp`, w: 1000, h: 1000, svg: pithe() },
  { out: `public${D}/photos/parade.webp`, w: 1000, h: 750, svg: paradePhoto() },
];
