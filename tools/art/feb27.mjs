// February 2027's drawn pictures (tools/make-art.mjs): six article covers in the "Letters" style (basanti yellow,
// aubergine, sealing-wax red, ink blue, DM Serif Display titles) and six photo-wall pictures.
import { circle, coverText, glow, grad, howrah, path, rect, rng, svg, taxi } from './kit.mjs';

const C = { basanti: '#F9D85E', yellow: '#F5C518', ink: '#3B1F4A', red: '#B3122E', blue: '#1F4F8A', paper: '#FFFBEF', env: '#FFF6E2', flap: '#EAD8AE', palash: '#E8501E', green: '#2E8B57', violet: '#6A3D9A', rose: '#E8749A' };
const head = "'DM Serif Display', Georgia, serif";
const D = '/editions/feb27';
const flower = (x, y, s, c = C.palash) => [0, 72, 144, 216, 288].map((a) => `<path transform="translate(${x} ${y}) rotate(${a}) scale(${s})" d="M0 -6 C14 -22 10 -44 0 -46 C-6 -40 -10 -24 0 -6 Z" fill="${c}"/>`).join('') + circle(x, y, 7 * s, C.ink);
const heart = (x, y, s, c) => path(`M${x} ${y + s * 0.9} C${x - s * 1.6} ${y - s * 0.1} ${x - s * 0.9} ${y - s * 1.2} ${x} ${y - s * 0.4} C${x + s * 0.9} ${y - s * 1.2} ${x + s * 1.6} ${y - s * 0.1} ${x} ${y + s * 0.9} Z`, c);
const envelope = (x, y, w, h, rot = 0) => `<g transform="rotate(${rot} ${x + w / 2} ${y + h / 2})">${rect(x, y, w, h, C.env, `stroke="${C.ink}" stroke-width="4"`)}${path(`M${x} ${y} L${x + w / 2} ${y + h * 0.55} L${x + w} ${y}`, 'none', `stroke="${C.ink}" stroke-width="4"`)}${circle(x + w / 2, y + h * 0.55, h * 0.12, C.red)}</g>`;

// --- covers (900 × 1200)
function saraswati() {
  const w = 900, h = 1200, r = rng(501);
  let fl = '';
  for (let i = 0; i < 16; i++) fl += flower(60 + r() * 780, 140 + r() * 760, 0.6 + r() * 0.6);
  let books = '';
  [C.red, C.blue, C.green, C.violet].forEach((c, i) => { books += rect(300 + i * 18, 720 - i * 46, 300 - i * 30, 44, c, `stroke="${C.ink}" stroke-width="3" rx="4"`); });
  return svg(w, h, `${rect(0, 0, w, h, C.basanti)}${glow(450, 520, 420, '#FFFFFF', 0.45, 'g')}${fl}
${circle(450, 470, 170, C.paper, `stroke="${C.ink}" stroke-width="4"`)}<text x="450" y="520" text-anchor="middle" font-family="${head}" font-size="150" fill="${C.ink}">অ</text>
${books}${path('M560 620 L700 500 L712 512 L572 632 Z', C.ink)}
${coverText({ w, h, kicker: 'FIELD NOTES · BASANT PANCHAMI', title: 'SARASWATI PUJA,', title2: 'IN BASANTI', ink: C.ink, accent: C.red, font: head, size: 82, frame: C.ink })}`);
}
function locker() {
  const w = 900, h = 1200;
  let vents = '';
  for (let i = 0; i < 6; i++) vents += rect(330, 230 + i * 22, 240, 8, '#2C5E86');
  return svg(w, h, `${rect(0, 0, w, h, '#1D3550')}${rect(200, 120, 500, 720, '#3E7CB1', `stroke="${C.ink}" stroke-width="5"`)}${vents}
<text x="450" y="440" text-anchor="middle" font-family="'Space Mono', monospace" font-weight="700" font-size="56" fill="${C.paper}">214</text>
${rect(620, 520, 30, 90, '#C9D6E2', `stroke="${C.ink}" stroke-width="3"`)}
<g transform="rotate(-6 450 640)">${rect(300, 540, 280, 200, C.paper, `stroke="${C.ink}" stroke-width="3"`)}${rect(400, 525, 80, 30, C.yellow, 'opacity=".8"')}
<text x="320" y="600" font-family="'Homemade Apple', cursive" font-size="22" fill="${C.blue}">Hello. You don’t</text><text x="320" y="645" font-family="'Homemade Apple', cursive" font-size="22" fill="${C.blue}">know me…</text></g>
${coverText({ w, h, kicker: 'PROSE · LOCKER 214', title: 'TO WHOEVER OPENS', title2: 'MY LOCKER NEXT', ink: C.paper, accent: C.yellow, font: head, size: 70, frame: C.paper })}`);
}
function boards() {
  const w = 900, h = 1200;
  return svg(w, h, `${rect(0, 0, w, h, C.violet)}${rect(80, 220, 740, 560, '#B5895A', `stroke="${C.ink}" stroke-width="4"`)}
<g transform="rotate(-4 400 450)">${rect(170, 300, 340, 260, C.paper, `stroke="${C.ink}" stroke-width="3"`)}<text x="190" y="350" font-family="'Space Mono', monospace" font-weight="700" font-size="22" fill="${C.ink}">ADMIT CARD</text>${rect(390, 330, 90, 110, '#D9CBB8')}${[0, 1, 2, 3].map((i) => rect(190, 380 + i * 34, 170, 8, C.ink, 'opacity=".5"')).join('')}</g>
${rect(560, 300, 200, 70, C.red, `stroke="${C.ink}" stroke-width="3" rx="10"`)}${path('M560 470 L760 450 L766 470 L566 490 Z', C.yellow)}${path('M760 450 L790 456 L766 470 Z', C.ink)}
${rect(600, 520, 80, 200, '#9ED3E8', `stroke="${C.ink}" stroke-width="3" rx="14"`)}${rect(610, 500, 60, 30, C.blue)}
${coverText({ w, h, kicker: 'ESSAY · BOARD EXAMS', title: 'A LETTER FOR', title2: 'THE BOARDS', ink: C.paper, accent: C.yellow, font: head, size: 92, frame: C.yellow })}`);
}
function dearKolkata() {
  const w = 900, h = 1200;
  return svg(w, h, `${rect(0, 0, w, h, C.rose)}
<g transform="rotate(-3 450 520)">${rect(110, 200, 680, 620, C.paper, `stroke="${C.ink}" stroke-width="4"`)}${rect(140, 230, 620, 400, 'url(#sky)')}${glow(620, 330, 160, '#FFE0B2', 0.6, 'sun')}${circle(620, 330, 50, '#FFB74D')}
${howrah(150, 750, 560, { ink: C.ink, lw: 6 })}${rect(140, 560, 620, 70, '#6B8BA4')}${taxi(200, 620, 220, { body: '#F5C518', ink: C.ink })}
${rect(640, 650, 110, 140, C.red, `stroke="${C.paper}" stroke-width="6" stroke-dasharray="6 6"`)}${heart(695, 715, 30, C.paper)}</g>
${coverText({ w, h, kicker: 'DISPATCH · A LOVE LETTER', title: 'DEAR', title2: 'KOLKATA', ink: C.ink, accent: C.paper, font: head, size: 110, frame: C.ink })}`, { defs: grad('sky', [[0, '#F7B58C'], [1, '#F6D7B0']]) });
}
function postOffice() {
  const w = 900, h = 1200;
  return svg(w, h, `${rect(0, 0, w, h, '#E9D8B8')}${rect(80, 180, 740, 600, '#C9A27A', `stroke="${C.ink}" stroke-width="4"`)}${path('M60 200 L450 90 L840 200 Z', '#8C5A3C', `stroke="${C.ink}" stroke-width="4"`)}
${rect(160, 230, 580, 60, C.red)}<text x="450" y="272" text-anchor="middle" font-family="${head}" font-size="38" fill="${C.paper}">POST OFFICE</text>
${rect(180, 340, 200, 300, '#5A3A28', `stroke="${C.ink}" stroke-width="3"`)}${rect(440, 340, 280, 180, '#F3E3C0', `stroke="${C.ink}" stroke-width="3"`)}
${[0, 1, 2].map((i) => [0, 1, 2, 3].map((j) => rect(455 + j * 66, 355 + i * 54, 56, 42, 'none', `stroke="${C.ink}" stroke-width="2"`)).join('')).join('')}
${rect(620, 560, 110, 280, C.red, `stroke="${C.ink}" stroke-width="4" rx="16"`)}${path('M610 570 Q675 500 740 570 Z', C.red, `stroke="${C.ink}" stroke-width="4"`)}${rect(640, 620, 70, 10, C.ink)}
${coverText({ w, h, kicker: 'REPORTAGE · SINCE 1964', title: 'THE POST OFFICE', title2: 'ON OUR STREET', ink: C.ink, accent: C.red, font: head, size: 78, frame: C.ink })}`);
}
function stoppedWriting() {
  const w = 900, h = 1200;
  let st = '';
  for (let i = 0; i < 6; i++) st += envelope(200 + (i % 2) * 30, 640 - i * 60, 460, 260, (i % 3 - 1) * 4);
  return svg(w, h, `${rect(0, 0, w, h, C.blue)}${st}${path('M200 520 L700 520 M200 560 L700 560', 'none', 'stroke="#C9A06A" stroke-width="8"')}
${path('M700 260 L760 760', 'none', `stroke="${C.ink}" stroke-width="22" stroke-linecap="round"`)}${path('M756 740 L772 820 L780 738 Z', '#C9A06A')}
${coverText({ w, h, kicker: 'OBJECT STUDY · THE LETTER', title: 'WHY WE STOPPED', title2: 'WRITING LETTERS', ink: C.paper, accent: C.yellow, font: head, size: 76, frame: C.yellow })}`);
}

// --- the photo wall
function basanti() {
  const w = 1000, h = 1000, r = rng(531);
  let ppl = '';
  for (let i = 0; i < 7; i++) { const x = 90 + i * 135, H = 380 + r() * 80; ppl += path(`M${x - 50} 1000 L${x - 40} ${1000 - H * 0.7} Q${x} ${1000 - H * 0.8} ${x + 40} ${1000 - H * 0.7} L${x + 50} 1000 Z`, i % 2 ? C.yellow : '#F2B705', `stroke="${C.red}" stroke-width="5"`) + circle(x, 1000 - H * 0.82, 38, '#8D5524') + path(`M${x - 40} ${1000 - H * 0.86} Q${x} ${1000 - H * 1.02} ${x + 40} ${1000 - H * 0.86}`, '#1A0F0A'); }
  let fl = '';
  for (let i = 0; i < 14; i++) fl += flower(r() * w, 60 + r() * 360, 0.5 + r() * 0.5, i % 3 ? C.palash : C.red);
  return svg(w, h, `${rect(0, 0, w, h, '#FCE9A0')}${fl}${ppl}`);
}
function palash() {
  const w = 1000, h = 750, r = rng(541);
  let br = '', fl = '';
  for (let i = 0; i < 9; i++) { const a = -Math.PI * (0.1 + 0.8 * r()), l = 200 + r() * 260; br += path(`M500 750 Q${500 + Math.cos(a) * l * 0.5} ${750 + Math.sin(a) * l * 0.6} ${500 + Math.cos(a) * l} ${750 + Math.sin(a) * l}`, 'none', 'stroke="#4A2E22" stroke-width="10" stroke-linecap="round"'); for (let k = 0; k < 6; k++) fl += flower(500 + Math.cos(a) * l * (0.6 + k * 0.08) + (r() - 0.5) * 60, 750 + Math.sin(a) * l * (0.6 + k * 0.08) + (r() - 0.5) * 60, 0.7 + r() * 0.5); }
  return svg(w, h, `${rect(0, 0, w, h, 'url(#s)')}${br}${fl}`, { defs: grad('s', [[0, '#BFE0F2'], [1, '#F4E3C2']]) });
}
function pillarBox() {
  const w = 750, h = 1000;
  return svg(w, h, `${rect(0, 0, w, h, '#D8CDBA')}${rect(0, 760, w, 240, '#A8998A')}
${rect(240, 300, 270, 560, C.red, `stroke="${C.ink}" stroke-width="5" rx="20"`)}${path('M225 320 Q375 160 525 320 Z', C.red, `stroke="${C.ink}" stroke-width="5"`)}${rect(225, 312, 300, 26, '#8E0E24')}
${rect(300, 420, 150, 18, C.ink, 'rx="6"')}${rect(300, 500, 150, 110, '#F4EAD2', `stroke="${C.ink}" stroke-width="3"`)}<text x="375" y="545" text-anchor="middle" font-family="'Space Mono', monospace" font-size="16" fill="${C.ink}">LETTERS</text><text x="375" y="580" text-anchor="middle" font-family="'Space Mono', monospace" font-size="14" fill="${C.ink}">10 · 2 · 5</text>
${rect(225, 840, 300, 26, '#8E0E24')}`);
}
function slate() {
  const w = 1000, h = 750;
  return svg(w, h, `${rect(0, 0, w, h, C.yellow)}${rect(220, 120, 560, 420, '#B5895A', 'rx="18"')}${rect(250, 150, 500, 360, '#2F3B36', 'rx="8"')}
<text x="500" y="380" text-anchor="middle" font-family="${head}" font-size="190" fill="#F4F1E8" opacity=".92">অ আ</text>
${rect(620, 580, 140, 26, '#F4F1E8', 'rx="8" transform="rotate(-14 690 593)"')}${flower(220, 620, 0.9)}${flower(300, 660, 0.7)}${flower(860, 160, 0.8)}`);
}
function examDesk() {
  const w = 1000, h = 750;
  return svg(w, h, `${rect(0, 0, w, h, '#C9C2B4')}${path('M80 300 L920 300 L1000 750 L0 750 Z', '#A7774E')}
<g transform="rotate(-3 470 470)">${rect(300, 340, 360, 280, C.paper, `stroke="${C.ink}" stroke-width="3"`)}${[0, 1, 2, 3, 4, 5].map((i) => rect(330, 380 + i * 36, 260 - (i % 3) * 40, 7, C.ink, 'opacity=".45"')).join('')}</g>
${rect(700, 380, 160, 60, C.red, `stroke="${C.ink}" stroke-width="3" rx="10"`)}${rect(140, 400, 70, 190, '#9ED3E8', `stroke="${C.ink}" stroke-width="3" rx="12"`)}${path('M680 560 L860 520 L864 538 L684 578 Z', C.yellow)}`);
}
function hearts() {
  const w = 1000, h = 750, r = rng(571);
  let hs = '';
  for (let i = 0; i < 22; i++) hs += `<g transform="rotate(${((r() - 0.5) * 40).toFixed(1)} 0 0)">${heart(80 + r() * 840, 80 + r() * 600, 26 + r() * 40, [C.red, C.rose, '#F7A6BF', C.palash][i % 4])}</g>`;
  return svg(w, h, `${rect(0, 0, w, h, '#FFF1F4')}${hs}${envelope(330, 260, 340, 220, -5)}`);
}

export default [
  { out: `public${D}/articles/saraswati-puja-in-basanti/cover.jpg`, w: 900, h: 1200, svg: saraswati() },
  { out: `public${D}/articles/to-whoever-opens-my-locker/cover.jpg`, w: 900, h: 1200, svg: locker() },
  { out: `public${D}/articles/a-letter-for-the-boards/cover.jpg`, w: 900, h: 1200, svg: boards() },
  { out: `public${D}/articles/dear-kolkata/cover.jpg`, w: 900, h: 1200, svg: dearKolkata() },
  { out: `public${D}/articles/the-post-office-on-our-street/cover.jpg`, w: 900, h: 1200, svg: postOffice() },
  { out: `public${D}/articles/why-we-stopped-writing-letters/cover.jpg`, w: 900, h: 1200, svg: stoppedWriting() },
  { out: `public${D}/photos/basanti.webp`, w: 1000, h: 1000, svg: basanti() },
  { out: `public${D}/photos/palash.webp`, w: 1000, h: 750, svg: palash() },
  { out: `public${D}/photos/pillar-box.webp`, w: 750, h: 1000, svg: pillarBox() },
  { out: `public${D}/photos/slate.webp`, w: 1000, h: 750, svg: slate() },
  { out: `public${D}/photos/exam-desk.webp`, w: 1000, h: 750, svg: examDesk() },
  { out: `public${D}/photos/hearts.webp`, w: 1000, h: 750, svg: hearts() },
];
