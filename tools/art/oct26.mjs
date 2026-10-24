// October 2026's drawn pictures (tools/make-art.mjs): stand-in covers for the writers' articles that have no real one yet, in the edition's
// Pujo poster style (deep colours, a marigold frame, Rozha One titles). The photo wall has readers' real photos.
import { burst, circle, coverText, glow, grad, lights, path, rect, rng, svg, taxi } from './kit.mjs';

const C = { red: '#C8102E', maroon: '#3A0A10', deep: '#5A0E18', gold: '#FFC914', cream: '#FFF4D6', ink: '#1A0508', green: '#2E7D32', leaf: '#4CAF50', white: '#FFF8EC' };
const head = "'Rozha One', Georgia, serif";
const D = '/editions/oct26';

// --- covers (900 × 1200): the writers' pieces
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

export default [
  { out: `public${D}/articles/echoes-of-the-yellow-cab/cover.jpg`, w: 900, h: 1200, svg: cab() },
  { out: `public${D}/articles/festive-season-or-peak-main-character-energy/cover.jpg`, w: 900, h: 1200, svg: festive() },
  { out: `public${D}/articles/dirt-beneath-her-feet/cover.jpg`, w: 900, h: 1200, svg: dirt() },
];
