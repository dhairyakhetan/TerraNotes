// October 2026's drawn pictures (tools/make-art.mjs): stand-in covers for the writers' five articles, in the edition's
// Pujo poster style (deep colours, a marigold frame, Rozha One titles), and photo-wall pictures of Pujo nights.
import { burst, circle, coverText, crowd, figure, glow, grad, howrah, lights, path, radial, rect, rng, skyline, stars, svg, taxi, water } from './kit.mjs';

const C = { red: '#C8102E', maroon: '#3A0A10', deep: '#5A0E18', gold: '#FFC914', cream: '#FFF4D6', ink: '#1A0508', green: '#2E7D32', leaf: '#4CAF50', white: '#FFF8EC' };
const head = "'Rozha One', Georgia, serif";
const D = '/editions/oct26';

// --- covers (900 × 1200): the writers' pieces
function weave() {
  const w = 900, h = 1200, r = rng(31);
  const saree = (y, body, border, k) => `<g transform="rotate(${k} 450 ${y + 60})">${rect(170, y, 560, 120, body, `stroke="${C.ink}" stroke-width="4"`)}${rect(170, y + 92, 560, 28, border)}${rect(170, y + 6, 560, 10, C.gold)}${Array.from({ length: 13 }, (_, i) => circle(205 + i * 42, y + 52, 6, C.gold, 'opacity=".75"')).join('')}</g>`;
  let threads = '';
  for (let i = 0; i < 26; i++) threads += path(`M${(r() * 900).toFixed(0)} 160 q${(r() - 0.5) * 120} 300 ${(r() - 0.5) * 60} 700`, 'none', `stroke="${C.gold}" stroke-width="1.4" opacity=".18"`);
  return svg(w, h, `${rect(0, 0, w, h, C.deep)}${threads}
${saree(300, C.white, C.red, -2)}${saree(430, C.red, C.gold, 1.5)}${saree(560, '#1F6E43', C.red, -1)}${saree(690, C.white, C.red, 2)}
${path('M560 260 q60 -40 120 0 l20 70 q-80 30 -160 0 Z', '#E7A72B', `stroke="${C.ink}" stroke-width="4"`)}${path('M600 270 q20 30 40 0', 'none', `stroke="${C.ink}" stroke-width="3"`)}
${coverText({ w, h, kicker: 'ESSAY · PRIYADARSHINI HAZRA', title: 'WHISPERS IN', title2: 'THE WEAVE', ink: C.cream, accent: C.gold, font: head, size: 100, frame: C.gold })}`);
}
function kolkata() {
  const w = 900, h = 1200, r = rng(44);
  return svg(w, h, `${rect(0, 0, w, h, 'url(#k)')}${glow(640, 330, 260, '#FFD27A', 0.55, 'sun')}${circle(640, 330, 70, '#FFC56A')}
${skyline(r, { x1: w, y: 760, hMin: 140, hMax: 300, fill: '#3A1420', lit: C.gold, litChance: 0.2 })}
${howrah(60, 840, 760, { ink: C.ink, lw: 7 })}${water(r, { y: 760, w, h: 1200, fill: '#5A2030', ripple: '#F4B183', n: 40 })}
${taxi(150, 742, 230, { body: '#F5C518', ink: C.ink })}
${coverText({ w, h, kicker: 'FIELD NOTES · PAHAL SETHI', title: 'KOLKATA AS', title2: 'WE KNOW IT', ink: C.cream, accent: C.gold, font: head, size: 104, frame: C.gold })}`, { defs: grad('k', [[0, '#F29E6B'], [0.55, '#B8405A'], [1, C.maroon]]) });
}
function cab() {
  const w = 900, h = 1200, r = rng(57);
  let rain = '';
  for (let i = 0; i < 140; i++) { const x = r() * w, y = r() * 1000; rain += `<line x1="${x.toFixed(0)}" y1="${y.toFixed(0)}" x2="${(x - 10).toFixed(0)}" y2="${(y + 34).toFixed(0)}" stroke="#9FC3D6" stroke-width="2" opacity=".45"/>`; }
  return svg(w, h, `${rect(0, 0, w, h, '#1E1A2E')}${rain}${glow(450, 640, 380, '#F5C518', 0.25, 'g')}
${rect(0, 820, w, 380, '#2A2438')}${path('M0 860 L900 860', 'none', 'stroke="#F5C518" stroke-width="6" stroke-dasharray="40 30" opacity=".6"')}
${taxi(120, 820, 660, { body: '#F5C518', ink: C.ink })}
${rect(380, 560, 140, 44, C.ink)}<text x="450" y="590" text-anchor="middle" font-family="'Space Mono', monospace" font-weight="700" font-size="20" fill="#F5C518">NO REFUSAL</text>
${coverText({ w, h, kicker: 'PROSE · DHRITI AGARWAL', title: 'ECHOES OF THE', title2: 'YELLOW CAB', ink: C.cream, accent: '#F5C518', font: head, size: 92, frame: '#F5C518' })}`);
}
function festive() {
  const w = 900, h = 1200, r = rng(71);
  let sp = '';
  for (const [x, y, k] of [[180, 300, 0], [720, 260, 1], [760, 620, 2], [140, 640, 3]]) sp += burst(r, x, y, 90, [[C.gold, '#FF5FA2', '#3DDCC4', '#FFFFFF'][k], C.gold, '#FFFFFF'], 24);
  return svg(w, h, `${rect(0, 0, w, h, '#2A0A3A')}${sp}
<g transform="rotate(-6 450 520)">${rect(270, 230, 360, 620, '#14101E', 'rx="44"')}${rect(290, 280, 320, 520, 'url(#p)', 'rx="10"')}
${path('M330 800 L330 600 Q330 420 450 420 Q570 420 570 600 L570 800 Z', C.red)}${circle(450, 600, 60, '#FFE082')}${glow(450, 600, 160, '#FFB300', 0.5, 'core')}
${lights({ x1: 290, y1: 330, x2: 610, y2: 320, sag: 20, n: 12, bulb: '#FFE082', wire: '#000', r: 5, glowColor: '#FFC107' })}
${circle(450, 760, 34, 'none', 'stroke="#FFFFFF" stroke-width="5"')}${rect(400, 246, 100, 14, '#2A2438', 'rx="7"')}</g>
${coverText({ w, h, kicker: 'DISPATCH · DITI SHAH', title: 'MAIN CHARACTER', title2: 'ENERGY?', ink: C.cream, accent: C.gold, font: head, size: 78, frame: C.gold })}`, { defs: grad('p', [[0, '#3B1A5C'], [1, '#7A1F4A']]) });
}
function dirt() {
  const w = 900, h = 1200, r = rng(83);
  let dust = '';
  for (let i = 0; i < 220; i++) dust += circle((r() * w).toFixed(0), (760 + r() * 300).toFixed(0), (1 + r() * 5).toFixed(1), r() < 0.5 ? '#8E7A68' : '#6E5C4C', `opacity="${(0.3 + r() * 0.6).toFixed(2)}"`);
  const s = 230, x = 450, y = 470;
  return svg(w, h, `${rect(0, 0, w, h, '#2B1A12')}${glow(450, 420, 420, '#C8102E', 0.25, 'g')}${dust}
${path(`M${x} ${y - s} Q${x + s * 0.85} ${y - s} ${x + s * 0.8} ${y} Q${x + s * 0.7} ${y + s * 1.05} ${x} ${y + s * 1.15} Q${x - s * 0.7} ${y + s * 1.05} ${x - s * 0.8} ${y} Q${x - s * 0.85} ${y - s} ${x} ${y - s} Z`, '#9C8571')}
${path(`M${x - 110} ${y - 10} Q${x - 64} ${y - 50} ${x - 22} ${y - 10} Q${x - 64} ${y + 18} ${x - 110} ${y - 10} Z M${x + 22} ${y - 10} Q${x + 64} ${y - 50} ${x + 110} ${y - 10} Q${x + 64} ${y + 18} ${x + 22} ${y - 10} Z`, '#00000033')}
${path(`M${x} ${y - 120} q14 22 0 44 q-14 -22 0 -44 Z`, C.red)}${path(`M${x - 50} ${y + 150} Q${x} ${y + 175} ${x + 50} ${y + 150}`, 'none', 'stroke="#00000040" stroke-width="7"')}
${path('M120 980 Q170 860 280 820 Q330 800 340 840 Q300 880 250 990 Z', '#B07A50', `stroke="${C.ink}" stroke-width="4"`)}${path('M780 980 Q730 860 620 820 Q570 800 560 840 Q600 880 650 990 Z', '#A06C44', `stroke="${C.ink}" stroke-width="4"`)}
${coverText({ w, h, kicker: 'POETRY · RISHAVI BANERJEE', title: 'DIRT BENEATH', title2: 'HER FEET', ink: C.cream, accent: '#E8A33D', font: head, size: 100, frame: '#E8A33D' })}`);
}

// --- the photo wall (illustrations of Pujo nights)
function gate() {
  const w = 1000, h = 750, r = rng(71);
  let bulbs = '';
  for (let a = 180; a >= 0; a -= 6) { const t = (a * Math.PI) / 180; bulbs += glow(500 + Math.cos(t) * 300, 470 - Math.sin(t) * 300, 16, '#FFD54F', 0.6, `ga${a}`) + circle(500 + Math.cos(t) * 300, 470 - Math.sin(t) * 300, 5, '#FFF3B0'); }
  return svg(w, h, `${rect(0, 0, w, h, 'url(#n)')}${stars(r, 60, w, 220, '#fff')}
${skyline(r, { x1: w, y: 560, hMin: 120, hMax: 300, fill: '#160B26', lit: '#FFB74D', litChance: 0.15 })}
${path('M140 700 L140 420 Q140 120 500 120 Q860 120 860 420 L860 700 L760 700 L760 450 Q760 250 500 250 Q240 250 240 450 L240 700 Z', '#C2185B')}
${path('M240 700 L240 450 Q240 250 500 250 Q760 250 760 450 L760 700 Z', '#3B1A5C')}
${glow(500, 520, 260, '#FFB300', 0.55, 'core')}${circle(500, 470, 70, '#FFE082')}${circle(500, 470, 46, '#FFF8E1')}
${bulbs}${crowd(r, { x1: w, y: 690, fill: '#0B0614', size: 30, rows: 2 })}`, { defs: grad('n', [[0, '#1A0B33'], [1, '#4A1240']]) });
}
function dhunuchi() {
  const w = 750, h = 1000, r = rng(83);
  let smoke = '';
  for (let i = 0; i < 9; i++) smoke += path(`M${380 + i * 6} ${560 - i * 50} q${-80 + r() * 160} -60 ${-20 + r() * 40} -120 t${-60 + r() * 120} -120`, 'none', `stroke="#F5F0E6" stroke-width="${18 - i}" stroke-linecap="round" opacity="${(0.25 - i * 0.02).toFixed(2)}"`);
  return svg(w, h, `${rect(0, 0, w, h, '#120A08')}${glow(375, 560, 380, '#FF8F00', 0.35, 'f')}${smoke}
${figure(375, 1000, 760, { body: '#7B1020', skin: '#5D3A25', hair: '#0D0705' })}
${path('M300 600 L250 470 L280 460 L330 590 Z', '#5D3A25')}
${path('M215 470 Q250 420 290 470 L280 500 Q250 510 225 500 Z', '#A1887F')}${glow(252, 455, 70, '#FFB300', 0.8, 'ember')}${circle(252, 458, 18, '#FF6F00')}
${path('M285 640 L460 640 L455 660 L290 660 Z', '#FFC914')}`);
}
function queue() {
  const w = 1000, h = 750, r = rng(91);
  return svg(w, h, `${rect(0, 0, w, h, 'url(#q)')}
${skyline(r, { x1: w, y: 520, hMin: 180, hMax: 420, fill: '#22142E', lit: '#FFCC80', litChance: 0.25 })}
${lights({ x1: 0, y1: 160, x2: 1000, y2: 120, sag: 40, n: 30, bulb: '#FFE082', wire: '#000', r: 6, glowColor: '#FFC107' })}
${lights({ x1: 0, y1: 260, x2: 1000, y2: 230, sag: 35, n: 28, bulb: '#F48FB1', wire: '#000', r: 5, glowColor: '#EC407A' })}
${rect(0, 520, w, 230, '#2A1B1F')}
${crowd(r, { x1: w, y: 640, fill: '#100A12', size: 26, rows: 3 })}`, { defs: grad('q', [[0, '#120A2A'], [1, '#3B1C44']]) });
}
function kash() {
  const w = 1000, h = 750, r = rng(101);
  let plumes = '';
  for (let i = 0; i < 70; i++) { const x = r() * w, y = 480 + r() * 260, l = 120 + r() * 160, b = (r() - 0.5) * 60; plumes += path(`M${x.toFixed(1)} ${y.toFixed(1)} Q${(x + b).toFixed(1)} ${(y - l * 0.6).toFixed(1)} ${(x + b * 1.6).toFixed(1)} ${(y - l).toFixed(1)}`, 'none', 'stroke="#6B8E3A" stroke-width="3"') + `<ellipse cx="${(x + b * 1.5).toFixed(1)}" cy="${(y - l + 20).toFixed(1)}" rx="${(10 + r() * 8).toFixed(1)}" ry="${(36 + r() * 20).toFixed(1)}" fill="#FFFDF7" opacity="${(0.75 + r() * 0.25).toFixed(2)}" transform="rotate(${(b / 3).toFixed(1)} ${(x + b * 1.5).toFixed(1)} ${(y - l + 20).toFixed(1)})"/>`; }
  return svg(w, h, `${rect(0, 0, w, h, 'url(#dawn)')}${circle(760, 300, 70, '#FFE0B2')}${glow(760, 300, 260, '#FFCC80', 0.5, 'sun')}
${path('M0 470 Q250 430 500 460 Q760 490 1000 450 L1000 750 L0 750 Z', '#8FA85C')}${plumes}`, { defs: grad('dawn', [[0, '#9FB7D9'], [0.6, '#F6C9A6'], [1, '#F9E1C2']]) });
}
function phuchka() {
  const w = 1000, h = 1000, r = rng(113);
  let puris = '';
  for (let i = 0; i < 46; i++) { const x = 290 + r() * 420, y = 560 + r() * 130; puris += circle(x.toFixed(1), y.toFixed(1), 30, '#E0A040', 'stroke="#B57324" stroke-width="3"') + circle((x - 6).toFixed(1), (y - 6).toFixed(1), 9, '#F6D08A'); }
  return svg(w, h, `${rect(0, 0, w, h, '#0E1426')}${glow(500, 420, 380, '#FFB74D', 0.4, 'lamp')}
${path('M470 160 L530 160 L560 260 L440 260 Z', '#455A64')}${circle(500, 290, 34, '#FFF3B0')}${glow(500, 290, 120, '#FFE082', 0.7, 'bulb')}
${path('M230 560 Q500 470 770 560 L740 760 Q500 820 260 760 Z', '#C9A063')}${path('M230 560 Q500 470 770 560', 'none', 'stroke="#8D6E3F" stroke-width="10"')}
${puris}
${path('M160 820 L840 820 L800 1000 L200 1000 Z', '#B23A2E')}${rect(160, 810, 680, 20, '#7F1D16')}
${path('M780 520 Q820 560 800 620 L860 620 Q880 560 840 520 Z', '#8D6E63')}${rect(805, 470, 12, 60, '#5D4037')}`);
}
function kumartuliPhoto() {
  const w = 1000, h = 750, r = rng(127);
  let idols = '';
  for (let i = 0; i < 6; i++) { const x = 90 + i * 165, H = 330 + r() * 90; idols += figure(x, 690, H, { body: '#8B7765', skin: '#9C8774', hair: '#6D5A4B' }); }
  return svg(w, h, `${rect(0, 0, w, h, '#3E2C22')}${rect(0, 0, w, 120, '#2A1D16')}
${path('M0 120 L1000 120 L1000 160 L0 160 Z', '#5D4537')}${glow(840, 60, 300, '#FFE0B2', 0.25, 'win')}
${idols}${rect(0, 690, w, 60, '#2A1D16')}`);
}
function ghat() {
  const w = 1000, h = 750, r = rng(139);
  let boats = '';
  for (const [x, y, s] of [[230, 560, 1], [620, 600, 1.3], [820, 540, 0.8]]) boats += path(`M${x - 80 * s} ${y} Q${x} ${y + 34 * s} ${x + 80 * s} ${y} L${x + 66 * s} ${y + 14 * s} Q${x} ${y + 40 * s} ${x - 66 * s} ${y + 14 * s} Z`, '#1C1410') + figure(x, y + 2, 70 * s, { body: '#3A1E16', skin: '#2A1A12', hair: '#120A08' });
  return svg(w, h, `${rect(0, 0, w, h, 'url(#dusk)')}${circle(720, 300, 60, '#FFB74D')}${glow(720, 300, 240, '#FF8A65', 0.45, 's')}
${howrah(80, 600, 400, { ink: '#2B2131', lw: 5 })}
${water(r, { y: 430, w, h, fill: '#6B4A5E', ripple: '#F4B183', n: 50 })}${boats}
${path('M600 600 Q620 470 640 440 Q660 420 680 440 Q700 470 720 600 Z', '#2B1A24')}${circle(660, 420, 30, '#2B1A24')}`, { defs: grad('dusk', [[0, '#3B2C5A'], [0.55, '#C9667A'], [1, '#F2A877']]) });
}

export default [
  { out: `public${D}/articles/whispers-in-the-weave/cover.jpg`, w: 900, h: 1200, svg: weave() },
  { out: `public${D}/articles/kolkata-as-we-know-it/cover.jpg`, w: 900, h: 1200, svg: kolkata() },
  { out: `public${D}/articles/echoes-of-the-yellow-cab/cover.jpg`, w: 900, h: 1200, svg: cab() },
  { out: `public${D}/articles/festive-season-or-peak-main-character-energy/cover.jpg`, w: 900, h: 1200, svg: festive() },
  { out: `public${D}/articles/dirt-beneath-her-feet/cover.jpg`, w: 900, h: 1200, svg: dirt() },
  { out: `public${D}/photos/pandal-gate.webp`, w: 1000, h: 750, svg: gate() },
  { out: `public${D}/photos/dhunuchi.webp`, w: 750, h: 1000, svg: dhunuchi() },
  { out: `public${D}/photos/queue.webp`, w: 1000, h: 750, svg: queue() },
  { out: `public${D}/photos/kash.webp`, w: 1000, h: 750, svg: kash() },
  { out: `public${D}/photos/phuchka.webp`, w: 1000, h: 1000, svg: phuchka() },
  { out: `public${D}/photos/kumartuli.webp`, w: 1000, h: 750, svg: kumartuliPhoto() },
  { out: `public${D}/photos/ghat.webp`, w: 1000, h: 750, svg: ghat() },
];
