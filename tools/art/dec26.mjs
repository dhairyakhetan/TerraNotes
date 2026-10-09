// December 2026's drawn pictures (tools/make-art.mjs): six article covers in the "Park Street" style (wine, pine,
// tinsel gold, Abril Fatface titles) and seven photo-wall pictures of Christmas week in Kolkata.
import { burst, circle, coverText, crowd, glow, grad, lights, path, rect, rng, skyline, stars, svg, tram } from './kit.mjs';

const C = { wine: '#2B0A12', wine2: '#4A1020', pine: '#14382C', gold: '#F2C14E', cream: '#FFF2DC', red: '#C8102E', pink: '#E86A92', blue: '#2B5DA8', green: '#1E7F55', mint: '#7EE0C3' };
const head = "'Abril Fatface', Georgia, serif";
const D = '/editions/dec26';
const BULBS = ['#FFE08A', '#FF6B6B', '#7EE0C3', '#8FB8FF'];
const star = (x, y, s, c) => path(`M${x} ${y - s} L${x + s * 0.25} ${y - s * 0.3} L${x + s * 0.95} ${y - s * 0.3} L${x + s * 0.38} ${y + s * 0.12} L${x + s * 0.6} ${y + s * 0.82} L${x} ${y + s * 0.4} L${x - s * 0.6} ${y + s * 0.82} L${x - s * 0.38} ${y + s * 0.12} L${x - s * 0.95} ${y - s * 0.3} L${x - s * 0.25} ${y - s * 0.3} Z`, c);
const strings = (w, ys, n = 26) => ys.map(([a, b, sag], k) => lights({ x1: 0, y1: a, x2: w, y2: b, sag, n, bulb: BULBS[k % 4], wire: '#1a0a0e', r: 6, glowColor: BULBS[k % 4] })).join('');

// --- covers (900 × 1200)
function parkStreet() {
  const w = 900, h = 1200, r = rng(301);
  return svg(w, h, `${rect(0, 0, w, h, 'url(#s)')}${strings(w, [[80, 180, 60], [200, 110, 70], [280, 360, 60], [400, 300, 50], [480, 560, 40]])}
${skyline(r, { x0: 0, x1: 260, y: 900, hMin: 300, hMax: 520, fill: '#1A060B', lit: C.gold, litChance: 0.35 })}${skyline(r, { x0: 640, x1: w, y: 900, hMin: 300, hMax: 520, fill: '#1A060B', lit: C.gold, litChance: 0.35 })}
${path('M260 900 L640 900 L560 620 L340 620 Z', '#3A1018')}${crowd(r, { x0: 120, x1: 780, y: 960, fill: '#0E0306', size: 34, rows: 2 })}${rect(0, 958, w, 250, '#0E0306')}
${coverText({ w, h, kicker: 'REPORTAGE · PARK STREET', title: 'PARK STREET', title2: 'AFTER DARK', ink: C.cream, accent: C.gold, font: head, size: 96, frame: C.gold })}`, { defs: grad('s', [[0, '#12030A'], [1, C.wine2]]) });
}
function cake() {
  const w = 900, h = 1200, r = rng(311);
  let fruit = '';
  for (let i = 0; i < 70; i++) fruit += circle((230 + r() * 440).toFixed(1), (520 + r() * 250).toFixed(1), (5 + r() * 8).toFixed(1), ['#8B1E2B', '#C8102E', '#E7A33E', '#3E6B2E'][i % 4], 'opacity=".85"');
  return svg(w, h, `${rect(0, 0, w, h, C.pine)}${glow(450, 600, 480, C.gold, 0.2, 'g')}
<g transform="translate(90 -170) scale(.8)">${circle(450, 830, 330, '#FFFFFF', 'opacity=".92"')}${circle(450, 830, 310, 'none', 'stroke="#E8DCC8" stroke-width="6" stroke-dasharray="8 10"')}
${path('M200 500 L700 500 L700 800 L200 800 Z', '#5A2A16')}${path('M200 500 L700 500 L660 440 L240 440 Z', '#7A3C1E')}${fruit}
${rect(430, 440, 40, 360, C.red)}${path('M450 440 Q380 360 360 420 Q400 450 450 440 Q520 360 540 420 Q500 450 450 440 Z', C.red)}</g>
${coverText({ w, h, kicker: 'FIELD NOTES · NEW MARKET', title: 'THE CAKE', title2: 'QUEUE', ink: C.cream, accent: C.gold, font: head, size: 108, frame: C.gold })}`);
}
function bowBarracks() {
  const w = 900, h = 1200;
  let b = '';
  for (const [x, y] of [[160, 300], [450, 260], [740, 300]]) {
    b += rect(x - 130, y, 260, 640, '#9C3B2A') + rect(x - 130, y, 260, 18, '#7A2C1F');
    for (let f = 0; f < 3; f++) { const fy = y + 70 + f * 190; b += rect(x - 100, fy, 200, 110, '#2B0A12') + rect(x - 110, fy + 110, 220, 14, '#E8DCC8') + glow(x, fy + 50, 90, C.gold, 0.5, `w${x}${f}`) + star(x, fy + 50, 34, f % 2 ? C.red : C.gold); }
  }
  return svg(w, h, `${rect(0, 0, w, h, '#14050A')}${b}
${coverText({ w, h, kicker: 'DISPATCH · BOW BARRACKS', title: 'CHRISTMAS AT', title2: 'BOW BARRACKS', ink: C.cream, accent: C.gold, font: head, size: 82, frame: C.gold })}`);
}
function notebook() {
  const w = 900, h = 1200;
  const doodles = [C.red, C.gold, C.green, C.blue, C.pink, '#7A3E9D'];
  let cells = '';
  for (let i = 0; i < 12; i++) {
    const x = 150 + (i % 4) * 160, y = 260 + Math.floor(i / 4) * 170, c = doodles[i % 6];
    cells += rect(x, y, 130, 140, 'none', `stroke="${C.pine}" stroke-width="3" stroke-dasharray="6 6"`);
    cells += `<text x="${x + 10}" y="${y + 26}" font-family="'Space Mono', monospace" font-size="16" fill="${C.pine}">${['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'][i]}</text>`;
    cells += i % 3 === 0 ? circle(x + 65, y + 85, 32, c) : i % 3 === 1 ? star(x + 65, y + 85, 36, c) : rect(x + 35, y + 55, 60, 60, c, 'transform="rotate(12 ' + (x + 65) + ' ' + (y + 85) + ')"');
  }
  return svg(w, h, `${rect(0, 0, w, h, C.red)}${rect(100, 160, 700, 620, C.cream)}${rect(100, 160, 30, 620, '#E8DCC8')}${cells}
${coverText({ w, h, kicker: 'LOGBOOK · 2026, WRAPPED', title: 'TWELVE MONTHS,', title2: 'ONE NOTEBOOK', ink: C.cream, accent: C.gold, font: head, size: 78, frame: C.gold })}`);
}
function santa() {
  const w = 900, h = 1200;
  const gift = (x, y, gw, gh, c, rib) => rect(x, y, gw, gh, c) + rect(x + gw / 2 - 10, y, 20, gh, rib) + rect(x, y + gh / 2 - 10, gw, 20, rib) + path(`M${x + gw / 2} ${y} Q${x + gw / 2 - 50} ${y - 50} ${x + gw / 2 - 60} ${y - 10} Z M${x + gw / 2} ${y} Q${x + gw / 2 + 50} ${y - 50} ${x + gw / 2 + 60} ${y - 10} Z`, rib);
  return svg(w, h, `${rect(0, 0, w, h, C.pink)}${glow(450, 600, 500, '#FFFFFF', 0.25, 'g')}
${gift(140, 560, 260, 240, C.green, C.gold)}${gift(430, 470, 320, 330, C.red, C.cream)}${gift(300, 330, 200, 180, C.blue, C.gold)}
${rect(560, 300, 180, 110, '#FFFFFF', 'transform="rotate(-8 650 355)"')}<text x="590" y="370" font-family="Caveat, cursive" font-size="44" fill="${C.pine}" transform="rotate(-8 650 355)">you got…</text>
${coverText({ w, h, kicker: 'ESSAY · SECRET SANTA', title: 'A FIELD GUIDE TO', title2: 'SECRET SANTA', ink: C.pine, accent: C.cream, font: head, size: 80, frame: C.pine })}`);
}
function lastTram() {
  const w = 900, h = 1200, r = rng(331);
  return svg(w, h, `${rect(0, 0, w, h, 'url(#t)')}${stars(r, 60, w, 500, '#FFF7E0')}
${skyline(r, { x1: w, y: 720, hMin: 160, hMax: 380, fill: '#12030A', lit: C.gold, litChance: 0.25 })}${rect(0, 718, w, 480, '#1E0A10')}
${path('M0 900 L900 880 M0 940 L900 920', 'none', 'stroke="#6B5A55" stroke-width="5"')}
${path('M120 400 L780 380', 'none', 'stroke="#3A2A2A" stroke-width="3"')}${path('M450 395 L470 560', 'none', 'stroke="#3A2A2A" stroke-width="4"')}
${tram(120, 880, 640, { body: '#2F6DB5', band: '#F4EAD2', ink: '#14050A', windows: '#FFE08A' })}
${coverText({ w, h, kicker: 'PROSE · 31 DECEMBER', title: 'THE LAST TRAM', title2: 'OF THE YEAR', ink: C.cream, accent: C.gold, font: head, size: 86, frame: C.gold })}`, { defs: grad('t', [[0, '#0E0610'], [1, C.wine2]]) });
}

// --- the photo wall
function streetPhoto() {
  const w = 1000, h = 1000, r = rng(341);
  return svg(w, h, `${rect(0, 0, w, h, 'url(#s)')}${strings(w, [[60, 160, 60], [170, 80, 70], [250, 330, 60], [360, 280, 50], [430, 500, 40], [520, 470, 30]], 30)}
${skyline(r, { x0: 0, x1: 300, y: 860, hMin: 320, hMax: 560, fill: '#1A060B', lit: C.gold, litChance: 0.35 })}${skyline(r, { x0: 700, x1: w, y: 860, hMin: 320, hMax: 560, fill: '#1A060B', lit: C.gold, litChance: 0.35 })}
${path('M300 860 L700 860 L620 600 L380 600 Z', '#3A1018')}${crowd(r, { x0: 150, x1: 850, y: 930, fill: '#0E0306', size: 30, rows: 3 })}${rect(0, 928, w, 80, '#0E0306')}`, { defs: grad('s', [[0, '#12030A'], [1, C.wine2]]) });
}
function cakeBox() {
  const w = 1000, h = 750;
  return svg(w, h, `${rect(0, 0, w, h, '#E9D9BE')}${rect(0, 520, w, 230, '#C9A97E')}
${path('M280 300 L720 300 L760 560 L240 560 Z', '#9B6B3E')}${path('M280 300 L720 300 L700 250 L300 250 Z', '#B68456')}
${path('M500 250 L500 560 M260 420 L740 420', 'none', 'stroke="#F4EAD2" stroke-width="10"')}${path('M500 250 Q440 180 420 240 Q460 260 500 250 Q560 180 580 240 Q540 260 500 250 Z', 'none', 'stroke="#F4EAD2" stroke-width="8"')}
<text x="500" y="360" text-anchor="middle" font-family="${head}" font-size="38" fill="#4A2A14">PLUM CAKE · 1 KG</text>`);
}
function barracksPhoto() {
  const w = 1000, h = 750;
  let b = '';
  for (let i = 0; i < 4; i++) { const x = 20 + i * 250; b += rect(x, 120, 230, 630, '#9C3B2A'); for (let f = 0; f < 3; f++) { const fy = 170 + f * 190; b += rect(x + 25, fy, 180, 100, '#2B0A12') + rect(x + 15, fy + 100, 200, 12, '#E8DCC8') + glow(x + 115, fy + 45, 80, C.gold, 0.5, `b${i}${f}`) + star(x + 115, fy + 45, 28, (i + f) % 2 ? C.red : C.gold); } }
  return svg(w, h, `${rect(0, 0, w, h, '#14050A')}${b}${lights({ x1: 0, y1: 110, x2: w, y2: 90, sag: 30, n: 30, bulb: '#FFE08A', wire: '#000', r: 5, glowColor: '#FFE08A' })}`);
}
function candles() {
  const w = 750, h = 1000, r = rng(353);
  let cs = '';
  for (let i = 0; i < 14; i++) { const x = 60 + (i % 7) * 105 + (r() - 0.5) * 20, y = 560 + Math.floor(i / 7) * 220, ch = 120 + r() * 80; cs += rect(x - 18, y - ch, 36, ch, '#FFF7E0') + glow(x, y - ch - 20, 70, C.gold, 0.6, `c${i}`) + path(`M${x} ${y - ch - 40} Q${x + 10} ${y - ch - 18} ${x} ${y - ch - 4} Q${x - 10} ${y - ch - 18} ${x} ${y - ch - 40} Z`, '#FFB000'); }
  return svg(w, h, `${rect(0, 0, w, h, '#120608')}${path('M150 0 L150 300 Q375 120 600 300 L600 0 Z', '#1E0A0E')}${glow(375, 180, 260, '#8FB8FF', 0.18, 'win')}${cs}`);
}
function tramPhoto() {
  const w = 1000, h = 750, r = rng(361);
  return svg(w, h, `${rect(0, 0, w, h, 'url(#t)')}${skyline(r, { x1: w, y: 480, hMin: 140, hMax: 320, fill: '#12030A', lit: C.gold, litChance: 0.25 })}${rect(0, 478, w, 280, '#1E0A10')}
${path('M0 640 L1000 625 M0 680 L1000 665', 'none', 'stroke="#6B5A55" stroke-width="5"')}${tram(160, 630, 680, { body: '#2F6DB5', band: '#F4EAD2', ink: '#14050A', windows: '#FFE08A' })}`, { defs: grad('t', [[0, '#0E0610'], [1, C.wine2]]) });
}
function oranges() {
  const w = 1000, h = 1000, r = rng(373);
  let o = '';
  for (let i = 0; i < 26; i++) { const x = 180 + r() * 640, y = 420 + r() * 330, s = 46 + r() * 16; o += circle(x.toFixed(1), y.toFixed(1), s.toFixed(1), i % 5 ? '#F28C28' : '#F6A23A') + circle((x - s * 0.3).toFixed(1), (y - s * 0.3).toFixed(1), (s * 0.18).toFixed(1), '#FFD08A', 'opacity=".7"') + path(`M${x.toFixed(1)} ${(y - s).toFixed(1)} q8 -16 24 -10`, 'none', 'stroke="#3E6B2E" stroke-width="5"'); }
  return svg(w, h, `${rect(0, 0, w, h, '#F4E2B8')}${glow(780, 160, 300, '#FFFFFF', 0.6, 'sun')}${path('M120 420 L880 420 L820 860 L180 860 Z', '#9B6B3E')}${o}${rect(100, 860, 800, 140, '#6B4430')}`);
}
function midnight() {
  const w = 1000, h = 750, r = rng(383);
  let b = '';
  for (const [x, y, rad, k] of [[200, 200, 140, 0], [520, 150, 180, 1], [820, 230, 130, 2], [380, 360, 90, 3]]) b += burst(r, x, y, rad, [BULBS[k], BULBS[(k + 1) % 4], '#FFFFFF'], 30);
  return svg(w, h, `${rect(0, 0, w, h, '#0A0612')}${stars(r, 60, w, 400, '#FFF7E0')}${b}
${rect(0, 560, w, 200, '#0F2A1E')}${crowd(r, { x1: w, y: 640, fill: '#05030A', size: 26, rows: 2 })}
<text x="500" y="720" text-anchor="middle" font-family="${head}" font-size="60" fill="${C.gold}" opacity=".9">2027</text>`);
}

export default [
  { out: `public${D}/articles/park-street-after-dark/cover.jpg`, w: 900, h: 1200, svg: parkStreet() },
  { out: `public${D}/articles/the-cake-queue/cover.jpg`, w: 900, h: 1200, svg: cake() },
  { out: `public${D}/articles/christmas-at-bow-barracks/cover.jpg`, w: 900, h: 1200, svg: bowBarracks() },
  { out: `public${D}/articles/twelve-months-one-notebook/cover.jpg`, w: 900, h: 1200, svg: notebook() },
  { out: `public${D}/articles/a-field-guide-to-secret-santa/cover.jpg`, w: 900, h: 1200, svg: santa() },
  { out: `public${D}/articles/the-last-tram-of-the-year/cover.jpg`, w: 900, h: 1200, svg: lastTram() },
  { out: `public${D}/photos/park-street.webp`, w: 1000, h: 1000, svg: streetPhoto() },
  { out: `public${D}/photos/cake-box.webp`, w: 1000, h: 750, svg: cakeBox() },
  { out: `public${D}/photos/bow-barracks.webp`, w: 1000, h: 750, svg: barracksPhoto() },
  { out: `public${D}/photos/candles.webp`, w: 750, h: 1000, svg: candles() },
  { out: `public${D}/photos/tram.webp`, w: 1000, h: 750, svg: tramPhoto() },
  { out: `public${D}/photos/oranges.webp`, w: 1000, h: 1000, svg: oranges() },
  { out: `public${D}/photos/midnight.webp`, w: 1000, h: 750, svg: midnight() },
];
