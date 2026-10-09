// October 2026's drawn pictures (tools/make-art.mjs): three article covers in the edition's Pujo poster style (alta
// red, maroon, marigold frame, Rozha One titles, like the first two covers) and photo-wall pictures of Pujo nights.
import { burst, circle, coverText, crowd, figure, glow, grad, howrah, lights, path, radial, rect, rng, skyline, stars, svg, water } from './kit.mjs';

const C = { red: '#C8102E', maroon: '#3A0A10', deep: '#5A0E18', gold: '#FFC914', cream: '#FFF4D6', ink: '#1A0508', green: '#2E7D32', leaf: '#4CAF50', white: '#FFF8EC' };
const head = "'Rozha One', Georgia, serif";
const D = '/editions/oct26';

// --- covers (900 × 1200)
function bhog() {
  const w = 900, h = 1200, r = rng(31);
  let rice = '';
  for (let i = 0; i < 220; i++) { const a = r() * Math.PI * 2, d = Math.sqrt(r()) * 150; rice += circle((450 + Math.cos(a) * d).toFixed(1), (560 + Math.sin(a) * d * 0.8).toFixed(1), (3 + r() * 3).toFixed(1), r() < 0.5 ? '#F2C230' : '#E8B020'); }
  let peas = '';
  for (let i = 0; i < 30; i++) { const a = r() * Math.PI * 2, d = Math.sqrt(r()) * 120; peas += circle((450 + Math.cos(a) * d).toFixed(1), (560 + Math.sin(a) * d * 0.8).toFixed(1), 5, '#7CB342'); }
  return svg(w, h, `${rect(0, 0, w, h, C.deep)}
${glow(450, 600, 520, C.gold, 0.18, 'bg')}
<g transform="translate(90 -30) scale(.8)">${path('M120 340 Q450 200 800 330 Q860 620 760 900 Q450 1010 150 900 Q60 620 120 340 Z', C.leaf)}
${path('M150 360 Q450 240 780 350', 'none', `stroke="${C.green}" stroke-width="6"`)}
${path('M450 260 L450 980', 'none', `stroke="${C.green}" stroke-width="5" opacity=".6"`)}
${circle(450, 560, 175, '#E9A919')}${rice}${peas}
${circle(240, 760, 85, '#E36414')}${circle(230, 750, 40, '#F7A35C')}${circle(262, 790, 28, '#8BC34A')}
${path('M600 720 L760 690 L770 735 L610 770 Z', '#B5651D')}${path('M590 780 L750 760 L758 805 L598 822 Z', '#C27A2B')}
${circle(680, 860, 70, '#B71C1C')}${circle(668, 848, 18, '#E57373')}
${circle(300, 420, 60, C.white)}${circle(300, 420, 46, '#FFF3D9')}</g>
${coverText({ w, h, kicker: 'FIELD NOTES · PUJO FOOD', title: 'BHOG, PLATE', title2: 'BY PLATE', ink: C.cream, accent: C.gold, font: head, size: 96, frame: C.gold })}`, { defs: '' });
}
function kumartuli() {
  const w = 900, h = 1200, r = rng(44);
  const face = (x, y, s, tone) => `${path(`M${x} ${y - s} Q${x + s * 0.85} ${y - s} ${x + s * 0.8} ${y} Q${x + s * 0.7} ${y + s * 1.05} ${x} ${y + s * 1.15} Q${x - s * 0.7} ${y + s * 1.05} ${x - s * 0.8} ${y} Q${x - s * 0.85} ${y - s} ${x} ${y - s} Z`, tone)}
${path(`M${x - s * 0.48} ${y - s * 0.05} Q${x - s * 0.28} ${y - s * 0.22} ${x - s * 0.1} ${y - s * 0.05} Q${x - s * 0.28} ${y + s * 0.08} ${x - s * 0.48} ${y - s * 0.05} Z M${x + s * 0.1} ${y - s * 0.05} Q${x + s * 0.28} ${y - s * 0.22} ${x + s * 0.48} ${y - s * 0.05} Q${x + s * 0.28} ${y + s * 0.08} ${x + s * 0.1} ${y - s * 0.05} Z`, '#00000033')}
${path(`M${x} ${y + s * 0.05} L${x - s * 0.08} ${y + s * 0.42} L${x + s * 0.08} ${y + s * 0.42}`, 'none', 'stroke="#00000030" stroke-width="4"')}
${path(`M${x - s * 0.22} ${y + s * 0.65} Q${x} ${y + s * 0.78} ${x + s * 0.22} ${y + s * 0.65}`, 'none', 'stroke="#00000035" stroke-width="5"')}
${circle(x, y - s * 0.45, s * 0.07, '#00000030')}`;
  let straw = '';
  for (let i = 0; i < 160; i++) { const x = r() * w, y = 860 + r() * 340; straw += `<line x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${(x + (r() - 0.5) * 80).toFixed(1)}" y2="${(y - 30 - r() * 60).toFixed(1)}" stroke="${r() < 0.5 ? '#C9A35A' : '#A9823C'}" stroke-width="3"/>`; }
  return svg(w, h, `${rect(0, 0, w, h, '#2B1A12')}
${rect(0, 0, w, h, 'url(#shed)')}
${face(250, 470, 130, '#8E7A68')}${face(640, 430, 150, '#A08B76')}${face(450, 700, 120, '#7D6A59')}${face(160, 790, 95, '#9C8571')}${face(760, 760, 105, '#8A7563')}
${straw}
${coverText({ w, h, kicker: 'REPORTAGE · KUMARTULI', title: 'BEFORE THE', title2: 'COLOUR', ink: C.cream, accent: C.gold, font: head, size: 100, frame: C.gold })}`, { defs: grad('shed', [[0, '#000', 0.55], [0.5, '#000', 0], [1, '#000', 0.5]]) });
}
function sindoor() {
  const w = 900, h = 1200, r = rng(57);
  let dust = '';
  for (let i = 0; i < 260; i++) { const a = r() * Math.PI * 2, d = 60 + r() * 330; dust += circle((450 + Math.cos(a) * d).toFixed(1), (520 + Math.sin(a) * d * 0.9).toFixed(1), (2 + r() * 9).toFixed(1), r() < 0.7 ? '#E3122B' : '#FF5468', `opacity="${(0.35 + r() * 0.6).toFixed(2)}"`); }
  const bangle = (x, y, rx, c) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${rx * 0.32}" fill="none" stroke="${c}" stroke-width="16"/>`;
  return svg(w, h, `${rect(0, 0, w, h, C.white)}
<g transform="translate(67 -60) scale(.85)">${dust}
${path('M450 300 Q620 360 640 520 Q650 700 470 760 Q300 790 250 620 Q210 430 450 300 Z', '#D90F2B')}
${path('M300 980 Q330 760 410 640 Q440 600 470 640 Q500 700 470 760 Q440 860 430 1000 Z', '#C68B59')}
${path('M600 1000 Q580 820 520 700 Q500 660 520 640 Q560 650 590 720 Q640 840 660 1000 Z', '#B5794A')}
${bangle(392, 900, 70, C.white)}${bangle(392, 900, 70, '#E8E1D0')}${bangle(392, 935, 70, '#C8102E')}${bangle(618, 890, 62, '#FFFFFF')}${bangle(618, 922, 62, '#C8102E')}</g>
${coverText({ w, h, kicker: 'ESSAY · DASHAMI', title: 'RED ON', title2: 'RED', ink: C.maroon, accent: '#C8102E', font: head, size: 110, frame: '#C8102E' })}`);
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
  { out: `public${D}/articles/bhog-plate-by-plate/cover.jpg`, w: 900, h: 1200, svg: bhog() },
  { out: `public${D}/articles/before-the-colour/cover.jpg`, w: 900, h: 1200, svg: kumartuli() },
  { out: `public${D}/articles/red-on-red/cover.jpg`, w: 900, h: 1200, svg: sindoor() },
  { out: `public${D}/photos/pandal-gate.webp`, w: 1000, h: 750, svg: gate() },
  { out: `public${D}/photos/dhunuchi.webp`, w: 750, h: 1000, svg: dhunuchi() },
  { out: `public${D}/photos/queue.webp`, w: 1000, h: 750, svg: queue() },
  { out: `public${D}/photos/kash.webp`, w: 1000, h: 750, svg: kash() },
  { out: `public${D}/photos/phuchka.webp`, w: 1000, h: 1000, svg: phuchka() },
  { out: `public${D}/photos/kumartuli.webp`, w: 1000, h: 750, svg: kumartuliPhoto() },
  { out: `public${D}/photos/ghat.webp`, w: 1000, h: 750, svg: ghat() },
];
