// November 2026's drawn pictures (tools/make-art.mjs): five article covers in the "Lights" style (night blue, lamp gold,
// diya orange, Fraunces titles) and six photo-wall pictures of the festival nights.
import { burst, circle, coverText, crowd, diya, glow, grad, lantern, lights, path, rect, rng, skyline, stars, svg } from './kit.mjs';

const C = { night: '#0F1533', sky: '#1E2866', gold: '#FFC23D', flame: '#FF8A2A', cream: '#FFF3D6', red: '#E5383B', pink: '#F06A9B', aqua: '#3FC1B0', violet: '#7B4FD6', ink: '#1B2559' };
const head = "'Fraunces', Georgia, serif";
const D = '/editions/nov26';
const BURST = [C.gold, C.pink, C.aqua, C.flame, '#FFFFFF'];
const night = (id) => grad(id, [[0, C.night], [0.75, C.sky], [1, '#3A2C5E']]);

// --- covers (900 × 1200)
function poles() {
  const w = 900, h = 1200, r = rng(201);
  let ps = '';
  for (const [x, top, c] of [[200, 330, C.red], [460, 250, C.flame], [700, 380, C.pink]]) {
    ps += rect(x - 4, top, 8, 900 - top, '#3B2A1E') + `<line x1="${x}" y1="${top}" x2="${x + 40}" y2="${top + 30}" stroke="#3B2A1E" stroke-width="5"/>`;
    ps += glow(x + 40, top + 100, 150, C.gold, 0.55, `p${x}`) + lantern(x + 40, top + 100, 46, { body: c, trim: C.gold, light: '#FFE9A8' });
  }
  return svg(w, h, `${rect(0, 0, w, h, 'url(#n)')}${stars(r, 110, w, 700, '#FFF6D8')}
${circle(720, 160, 46, '#FFF3D6')}${circle(738, 150, 46, C.night)}
${ps}${skyline(r, { x1: w, y: 950, hMin: 100, hMax: 240, fill: '#0A0E24', lit: C.gold, litChance: 0.2 })}${rect(0, 948, w, 260, '#0A0E24')}
${coverText({ w, h, kicker: 'REPORTAGE · AKASH PRODIP', title: 'LAMPS ON', title2: 'BAMBOO POLES', ink: C.cream, accent: C.gold, font: head, size: 88, frame: C.gold })}`, { defs: night('n') });
}
function rooftop() {
  const w = 900, h = 1200, r = rng(211);
  let b = '';
  for (const [x, y, rad, k] of [[230, 300, 150, 0], [640, 240, 190, 1], [470, 520, 110, 2], [770, 560, 90, 3], [130, 560, 80, 4]]) b += glow(x, y, rad * 1.3, BURST[k], 0.25, `b${x}`) + burst(r, x, y, rad, [BURST[k], BURST[(k + 2) % 5], '#FFFFFF'], 30);
  return svg(w, h, `${rect(0, 0, w, h, 'url(#n)')}${stars(r, 70, w, 600, '#FFF6D8')}${b}
${skyline(r, { x1: w, y: 860, hMin: 120, hMax: 300, fill: '#0A0E24', lit: C.gold, litChance: 0.25 })}
${rect(0, 860, w, 340, '#151B3D')}${rect(0, 850, w, 18, '#2A3268')}
${crowd(r, { x1: w, y: 960, fill: '#060915', size: 34, rows: 1 })}
${coverText({ w, h, kicker: 'FIELD NOTES · KALI PUJA', title: 'A ROOFTOP', title2: 'ON KALI PUJA', ink: C.cream, accent: C.gold, font: head, size: 86, frame: C.gold })}`, { defs: night('n') });
}
function quiet() {
  const w = 900, h = 1200;
  let ds = '';
  for (let i = 0; i < 7; i++) ds += diya(120 + i * 110, 650 + (i % 2) * 8, 44, { clay: '#C2562B', rim: C.flame, flame: C.gold });
  return svg(w, h, `${rect(0, 0, w, h, '#1A1430')}
${rect(90, 160, 720, 500, '#0F1533')}${rect(90, 160, 720, 500, 'none', 'stroke="#5A3A2A" stroke-width="22"')}${rect(445, 160, 10, 500, '#5A3A2A')}${rect(90, 405, 720, 10, '#5A3A2A')}
${circle(650, 290, 40, '#FFF3D6', 'opacity=".8"')}
${rect(40, 660, 820, 50, '#7A4A32')}${rect(40, 700, 820, 16, '#5A3A2A')}${ds}
${coverText({ w, h, kicker: 'ESSAY · DIWALI', title: 'THE QUIET', title2: 'DIWALI', ink: C.cream, accent: C.gold, font: head, size: 100, frame: C.flame })}`);
}
function fourteen() {
  const w = 900, h = 1200, r = rng(223);
  let ds = '';
  for (let i = 0; i < 14; i++) { const a = Math.PI * (0.1 + (0.8 * i) / 13), x = 450 + Math.cos(a) * 330, y = 640 - Math.sin(a) * 330; ds += glow(x, y - 14, 70, C.gold, 0.45, `f${i}`) + diya(x, y, 32, { clay: '#B4532A', rim: C.flame, flame: C.gold, glowOn: false }); }
  return svg(w, h, `${rect(0, 0, w, h, '#120E22')}${glow(450, 560, 420, C.violet, 0.25, 'v')}${stars(r, 40, w, 900, '#FFF6D8')}
<text x="450" y="600" text-anchor="middle" font-family="${head}" font-size="230" fill="${C.gold}" opacity=".9">14</text>${ds}
${coverText({ w, h, kicker: 'OBJECT STUDY · BHOOT CHATURDASHI', title: 'FOURTEEN', title2: 'LAMPS', ink: C.cream, accent: C.gold, font: head, size: 100, frame: C.gold })}`);
}
function letter() {
  const w = 900, h = 1200;
  const crayon = (x, y, rot, c) => `<g transform="translate(${x} ${y}) rotate(${rot})">${rect(0, 0, 200, 34, c)}${path('M200 0 L240 17 L200 34 Z', c)}${rect(30, 0, 40, 34, '#00000022')}</g>`;
  return svg(w, h, `${rect(0, 0, w, h, '#FFF3D6')}
${rect(120, 150, 660, 640, '#FFFFFF', 'transform="rotate(-2 450 470)"')}
<g transform="rotate(-2 450 470)" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="10">
<path d="M260 640 L260 470 L400 360 L540 470 L540 640 Z" stroke="${C.red}"/><path d="M370 640 L370 540 L430 540 L430 640" stroke="${C.ink}"/>
<circle cx="640" cy="280" r="60" stroke="${C.gold}"/><path d="M640 190 L640 160 M720 280 L750 280 M700 220 L722 198 M580 220 L558 198" stroke="${C.gold}"/>
<path d="M200 300 L250 230 L300 300 L250 370 Z" stroke="${C.pink}"/><path d="M250 370 Q230 430 270 470 Q300 500 280 550" stroke="${C.ink}" stroke-width="5"/>
<path d="M160 700 Q450 660 740 700" stroke="${C.aqua}"/></g>
${crayon(560, 820, -20, C.red)}${crayon(600, 880, -8, C.aqua)}${crayon(190, 860, 12, C.violet)}
${coverText({ w, h, kicker: 'PROSE · CHILDREN’S DAY', title: 'DEAR TEN-', title2: 'YEAR-OLD ME', ink: C.ink, accent: C.red, font: head, size: 86, frame: C.ink })}`);
}

// --- the photo wall
function fireworks() {
  const w = 1000, h = 1000, r = rng(241);
  let b = '';
  for (const [x, y, rad, k] of [[260, 260, 170, 0], [700, 220, 210, 1], [520, 480, 120, 2], [820, 520, 100, 3], [150, 520, 90, 4]]) b += glow(x, y, rad * 1.4, BURST[k], 0.22, `w${x}`) + burst(r, x, y, rad, [BURST[k], BURST[(k + 1) % 5], '#FFFFFF'], 34);
  return svg(w, h, `${rect(0, 0, w, h, 'url(#n)')}${stars(r, 80, w, 700, '#FFF6D8')}${b}
${skyline(r, { x1: w, y: 860, hMin: 120, hMax: 330, fill: '#070A1C', lit: C.gold, litChance: 0.3 })}${rect(0, 858, w, 150, '#070A1C')}`, { defs: night('n') });
}
function diyas() {
  const w = 1000, h = 750;
  let ds = '';
  for (let i = 0; i < 9; i++) ds += diya(70 + i * 108, 480, 44, { clay: '#B4532A', rim: C.flame, flame: C.gold });
  return svg(w, h, `${rect(0, 0, w, h, '#14102A')}${glow(500, 420, 520, C.flame, 0.25, 'g')}
${rect(0, 490, w, 70, '#6B3E2A')}${rect(0, 556, w, 200, '#3A2418')}${ds}`);
}
function prodip() {
  const w = 750, h = 1000, r = rng(251);
  return svg(w, h, `${rect(0, 0, w, h, 'url(#d)')}${stars(r, 30, w, 400, '#FFF6D8')}
${skyline(r, { x1: w, y: 860, hMin: 160, hMax: 420, fill: '#1A1630', lit: C.gold, litChance: 0.18 })}${rect(0, 858, w, 150, '#1A1630')}
${rect(366, 240, 12, 640, '#2B1E16')}<line x1="372" y1="250" x2="430" y2="290" stroke="#2B1E16" stroke-width="6"/>
${glow(430, 400, 220, C.gold, 0.6, 'l')}${lantern(430, 400, 70, { body: C.red, trim: C.gold, light: '#FFE9A8' })}`, { defs: grad('d', [[0, '#2A2260'], [0.6, '#8E4A6E'], [1, '#E58A5A']]) });
}
function phuljhari() {
  const w = 1000, h = 750, r = rng(263);
  let sp = '';
  for (let i = 0; i < 140; i++) { const a = r() * Math.PI * 2, d = 20 + r() * 170; sp += `<line x1="${(560 + Math.cos(a) * d * 0.3).toFixed(1)}" y1="${(250 + Math.sin(a) * d * 0.3).toFixed(1)}" x2="${(560 + Math.cos(a) * d).toFixed(1)}" y2="${(250 + Math.sin(a) * d).toFixed(1)}" stroke="${r() < 0.6 ? '#FFE9A8' : C.gold}" stroke-width="${(1 + r() * 2).toFixed(1)}" stroke-linecap="round" opacity="${(0.4 + r() * 0.6).toFixed(2)}"/>`; }
  const trail = 'M220 520 Q300 380 380 470 Q450 560 520 420 Q545 360 560 250';
  return svg(w, h, `${rect(0, 0, w, h, '#0B0B1C')}${path(trail, 'none', `stroke="${C.gold}" stroke-width="8" stroke-linecap="round" opacity=".55"`)}${path(trail, 'none', 'stroke="#FFF6D8" stroke-width="2.5" stroke-linecap="round"')}
${glow(560, 250, 220, C.gold, 0.5, 's')}${sp}${circle(560, 250, 16, '#FFFFFF')}
${path('M620 760 L560 262', 'none', 'stroke="#888" stroke-width="5"')}${path('M560 760 Q600 640 660 600 Q700 590 720 640 L760 760 Z', '#6B4430')}`);
}
function rangoli() {
  const w = 1000, h = 1000;
  const ring = (rad, n, c, s) => Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2; return `<ellipse cx="${(500 + Math.cos(a) * rad).toFixed(1)}" cy="${(500 + Math.sin(a) * rad).toFixed(1)}" rx="${s}" ry="${s * 0.45}" fill="${c}" transform="rotate(${((a * 180) / Math.PI).toFixed(1)} ${(500 + Math.cos(a) * rad).toFixed(1)} ${(500 + Math.sin(a) * rad).toFixed(1)})"/>`; }).join('');
  let ds = '';
  for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; ds += diya(500 + Math.cos(a) * 440, 500 + Math.sin(a) * 440 + 20, 34, { clay: '#B4532A', rim: C.flame, flame: C.gold }); }
  return svg(w, h, `${rect(0, 0, w, h, '#5A3A2E')}
${circle(500, 500, 400, C.violet)}${ring(340, 24, C.pink, 46)}${circle(500, 500, 290, C.gold)}${ring(240, 16, C.red, 48)}${circle(500, 500, 190, C.aqua)}${ring(130, 12, '#FFFFFF', 40)}${circle(500, 500, 80, C.flame)}${circle(500, 500, 34, '#FFFFFF')}${ds}`);
}
function phonta() {
  const w = 1000, h = 750;
  return svg(w, h, `${rect(0, 0, w, h, '#F3E2C2')}
${circle(500, 400, 300, '#C9A04A')}${circle(500, 400, 270, '#E2BE6A')}
${circle(390, 300, 52, '#FFFFFF')}${circle(390, 300, 30, '#F7E7C4')}
${diya(610, 320, 52, { clay: '#B4532A', rim: C.flame, flame: C.gold })}
${circle(400, 500, 46, '#B71C1C')}${circle(470, 520, 40, '#F2C230')}${circle(540, 500, 44, '#FFFFFF')}${circle(610, 490, 38, '#8D5524')}
${path('M330 400 Q380 360 420 410 Q380 450 330 400 Z', '#4CAF50')}${path('M600 400 Q650 360 690 410 Q650 450 600 400 Z', '#4CAF50')}
${circle(500, 380, 22, '#E5383B')}`);
}

export default [
  { out: `public${D}/articles/lamps-on-bamboo-poles/cover.jpg`, w: 900, h: 1200, svg: poles() },
  { out: `public${D}/articles/a-rooftop-on-kali-puja/cover.jpg`, w: 900, h: 1200, svg: rooftop() },
  { out: `public${D}/articles/the-quiet-diwali/cover.jpg`, w: 900, h: 1200, svg: quiet() },
  { out: `public${D}/articles/fourteen-lamps/cover.jpg`, w: 900, h: 1200, svg: fourteen() },
  { out: `public${D}/articles/dear-ten-year-old-me/cover.jpg`, w: 900, h: 1200, svg: letter() },
  { out: `public${D}/photos/fireworks.webp`, w: 1000, h: 1000, svg: fireworks() },
  { out: `public${D}/photos/diyas.webp`, w: 1000, h: 750, svg: diyas() },
  { out: `public${D}/photos/akash-prodip.webp`, w: 750, h: 1000, svg: prodip() },
  { out: `public${D}/photos/phuljhari.webp`, w: 1000, h: 750, svg: phuljhari() },
  { out: `public${D}/photos/rangoli.webp`, w: 1000, h: 1000, svg: rangoli() },
  { out: `public${D}/photos/bhai-phonta.webp`, w: 1000, h: 750, svg: phonta() },
];
