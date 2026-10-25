// The drawing kit for tools/make-art.mjs: small SVG builders the editions' pictures are made from (each edition's
// own list is tools/art/<edition id>.mjs). Everything is flat vector art in a print-poster style: a few shapes, flat
// colours, a little grain. Coordinates are the picture's own pixels. rng(seed) makes the "random" parts (stars,
// windows, crowds) the same every time, so re-running the tool gives the same pictures.

import { readFileSync } from 'node:fs';

export const rng = (seed) => { let s = seed >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); };
const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;');

// the whole picture: size, defs, body; plus a soft paper grain on top (a fixed noise pattern)
export function svg(w, h, body, { defs = '', grain = 0.08 } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
<defs>${defs}
<filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 ${grain} 0"/></filter>
</defs>
${body}
<rect width="${w}" height="${h}" filter="url(#grain)" opacity="1"/>
</svg>`;
}

export const grad = (id, stops, { x2 = 0, y2 = 1 } = {}) => `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('')}</linearGradient>`;
export const radial = (id, stops) => `<radialGradient id="${id}">${stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('')}</radialGradient>`;
export const rect = (x, y, w, h, fill, extra = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" ${extra}/>`;
export const circle = (x, y, r, fill, extra = '') => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" ${extra}/>`;
export const path = (d, fill, extra = '') => `<path d="${d}" fill="${fill}" ${extra}/>`;
export const glow = (x, y, r, color, a = 0.55, id = `g${Math.round(x)}x${Math.round(y)}`) => `<radialGradient id="${id}"><stop offset="0" stop-color="${color}" stop-opacity="${a}"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient><circle cx="${x}" cy="${y}" r="${r}" fill="url(#${id})"/>`;

// text on a cover: a small kicker at the top, a two-line title at the bottom (the second line in the accent), in a
// frame inset from the edges, as the October covers have
export function coverText({ w, h, kicker, title, title2, title3, ink, accent, font, mono = "'Space Mono', monospace", size = 92, frame = null, at = 'bottom' }) {
  const fr = frame ? `<rect x="40" y="40" width="${w - 80}" height="${h - 80}" fill="none" stroke="${frame}" stroke-width="4"/>` : '';
  const lines = [[title, ink], [title2, accent], [title3, ink]].filter(([t]) => t), last = at === 'bottom' ? h - 110 : 330;
  return `${fr}
<text x="80" y="118" font-family="${mono}" font-size="26" letter-spacing="4" fill="${ink}" opacity=".85">${esc(kicker)}</text>
${lines.map(([t, c], i) => `<text x="80" y="${last - (lines.length - 1 - i) * size * 1.05}" font-family="${font}" font-size="${size}" fill="${c}" letter-spacing="1">${esc(t)}</text>`).join('\n')}`;
}

// a real picture (a JPEG kept beside the edition's list, tools/art/<id>/), laid on the poster as a print: a paper
// edge and a hard shadow, so the team's own artwork sits in the same frame as the drawn covers. (x, y, w, h) is the
// picture itself; give it the picture's own shape.
export function print(file, x, y, w, h, { paper = '#FFF8EC', edge = 14, shadow = '#00000073', off = 14, tilt = 0 } = {}) {
  const href = `data:image/jpeg;base64,${readFileSync(file).toString('base64')}`;
  return `<g transform="rotate(${tilt} ${x + w / 2} ${y + h / 2})">${rect(x - edge + off, y - edge + off, w + edge * 2, h + edge * 2, shadow)}${rect(x - edge, y - edge, w + edge * 2, h + edge * 2, paper)}
<image href="${href}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice"/></g>`;
}

// stars in a band of sky
export function stars(r, n, w, h, color = '#fff') {
  let s = '';
  for (let i = 0; i < n; i++) s += circle((r() * w).toFixed(1), (r() * h).toFixed(1), (0.6 + r() * 1.8).toFixed(2), color, `opacity="${(0.35 + r() * 0.65).toFixed(2)}"`);
  return s;
}

// a row of city buildings standing on y, lit windows here and there
export function skyline(r, { x0 = 0, x1, y, hMin = 80, hMax = 260, fill, lit, litChance = 0.35, step = [40, 110] }) {
  let s = '', x = x0;
  while (x < x1) {
    const bw = step[0] + r() * (step[1] - step[0]), bh = hMin + r() * (hMax - hMin);
    s += rect(x.toFixed(1), (y - bh).toFixed(1), bw.toFixed(1), (bh + 2).toFixed(1), fill);
    if (r() < 0.3) s += rect((x + bw * 0.3).toFixed(1), (y - bh - 18).toFixed(1), (bw * 0.12).toFixed(1), 18, fill); // a water tank
    if (lit) for (let wy = y - bh + 14; wy < y - 16; wy += 22) for (let wx = x + 8; wx < x + bw - 12; wx += 16) if (r() < litChance) s += rect(wx.toFixed(1), wy.toFixed(1), 7, 10, lit, `opacity="${(0.6 + r() * 0.4).toFixed(2)}"`);
    x += bw + 2;
  }
  return s;
}

// a crowd's heads and shoulders along y (silhouettes)
export function crowd(r, { x0 = 0, x1, y, fill, size = 26, rows = 2 }) {
  let s = '';
  for (let row = 0; row < rows; row++) {
    const yy = y + row * size * 0.9, sz = size * (1 + row * 0.25);
    for (let x = x0 - 10 + r() * 20; x < x1 + 20; x += sz * (0.9 + r() * 0.6)) {
      s += circle(x.toFixed(1), (yy - sz * 1.1).toFixed(1), (sz * 0.42).toFixed(1), fill);
      s += path(`M${(x - sz * 0.7).toFixed(1)} ${(yy + sz).toFixed(1)} Q${(x - sz * 0.6).toFixed(1)} ${(yy - sz * 0.55).toFixed(1)} ${x.toFixed(1)} ${(yy - sz * 0.6).toFixed(1)} Q${(x + sz * 0.6).toFixed(1)} ${(yy - sz * 0.55).toFixed(1)} ${(x + sz * 0.7).toFixed(1)} ${(yy + sz).toFixed(1)} Z`, fill);
    }
  }
  return s;
}

// a sagging string of bulbs from (x1, y1) to (x2, y2)
export function lights({ x1, y1, x2, y2, sag = 40, n = 18, bulb, wire = '#000', r = 6, glowColor = null }) {
  let s = `<path d="M${x1} ${y1} Q${(x1 + x2) / 2} ${(y1 + y2) / 2 + sag * 2} ${x2} ${y2}" fill="none" stroke="${wire}" stroke-width="2" opacity=".7"/>`;
  for (let i = 1; i < n; i++) {
    const t = i / n, x = (1 - t) ** 2 * x1 + 2 * (1 - t) * t * ((x1 + x2) / 2) + t * t * x2;
    const y = (1 - t) ** 2 * y1 + 2 * (1 - t) * t * ((y1 + y2) / 2 + sag * 2) + t * t * y2;
    if (glowColor) s += glow(x, y + r, r * 4, glowColor, 0.45, `l${Math.round(x)}_${Math.round(y)}`);
    s += circle(x.toFixed(1), (y + r).toFixed(1), r, bulb);
  }
  return s;
}

// a diya (clay lamp) with its flame, centred on (x, y), size s
export function diya(x, y, s, { clay = '#c2562b', rim = '#ffb347', flame = '#ffd23f', glowOn = true } = {}) {
  return `${glowOn ? glow(x, y - s * 0.55, s * 1.6, '#ffb000', 0.5, `d${Math.round(x)}_${Math.round(y)}`) : ''}
${path(`M${x - s} ${y - s * 0.15} Q${x} ${y + s * 0.75} ${x + s} ${y - s * 0.15} Q${x} ${y + s * 0.05} ${x - s} ${y - s * 0.15} Z`, clay)}
${path(`M${x - s} ${y - s * 0.15} Q${x} ${y + s * 0.05} ${x + s} ${y - s * 0.15}`, 'none', `stroke="${rim}" stroke-width="${(s * 0.08).toFixed(1)}"`)}
${path(`M${x + s * 0.55} ${y - s * 0.2} Q${x + s * 0.45} ${y - s * 0.75} ${x + s * 0.62} ${y - s * 1.05} Q${x + s * 0.85} ${y - s * 0.6} ${x + s * 0.55} ${y - s * 0.2} Z`, flame)}`;
}

// a paper sky lantern (akash prodip style: a box with a pointed top) hanging from a line, centred on (x, y)
export function lantern(x, y, s, { body, trim, light = '#fff2b3' }) {
  return `${glow(x, y, s * 2.2, light, 0.4, `ln${Math.round(x)}_${Math.round(y)}`)}
<line x1="${x}" y1="${y - s * 1.5}" x2="${x}" y2="${y - s * 3}" stroke="${trim}" stroke-width="2"/>
${path(`M${x} ${y - s * 1.5} L${x + s * 0.8} ${y - s * 0.8} L${x + s * 0.8} ${y + s * 0.8} L${x} ${y + s * 1.4} L${x - s * 0.8} ${y + s * 0.8} L${x - s * 0.8} ${y - s * 0.8} Z`, body)}
${path(`M${x} ${y - s * 1.5} L${x} ${y + s * 1.4} M${x - s * 0.8} ${y - s * 0.1} L${x + s * 0.8} ${y - s * 0.1}`, 'none', `stroke="${trim}" stroke-width="2" opacity=".7"`)}
${rect(x - s * 0.35, y + s * 1.4, s * 0.7, s * 0.25, trim)}`;
}

// a fireworks burst: rays from (x, y)
export function burst(r, x, y, rad, colors, n = 28) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + r() * 0.1, l = rad * (0.7 + r() * 0.3), c = colors[i % colors.length];
    s += `<line x1="${(x + Math.cos(a) * rad * 0.18).toFixed(1)}" y1="${(y + Math.sin(a) * rad * 0.18).toFixed(1)}" x2="${(x + Math.cos(a) * l).toFixed(1)}" y2="${(y + Math.sin(a) * l).toFixed(1)}" stroke="${c}" stroke-width="3" stroke-linecap="round"/>`;
    s += circle((x + Math.cos(a) * l * 1.06).toFixed(1), (y + Math.sin(a) * l * 1.06).toFixed(1), 3.2, c);
  }
  return glow(x, y, rad * 1.2, colors[0], 0.25, `b${Math.round(x)}_${Math.round(y)}`) + s;
}

// a Kolkata yellow taxi (an Ambassador), side on, its wheels on y, facing right; length L
export function taxi(x, y, L, { body = '#f5c518', ink = '#1d1d1d', glass = '#9fc3d6' } = {}) {
  const h = L * 0.32;
  return `${path(`M${x} ${y - h * 0.35} Q${x} ${y - h * 0.62} ${x + L * 0.12} ${y - h * 0.64} L${x + L * 0.26} ${y - h * 0.66} Q${x + L * 0.34} ${y - h} ${x + L * 0.46} ${y - h} L${x + L * 0.66} ${y - h} Q${x + L * 0.76} ${y - h} ${x + L * 0.8} ${y - h * 0.66} L${x + L * 0.94} ${y - h * 0.6} Q${x + L} ${y - h * 0.55} ${x + L} ${y - h * 0.32} L${x + L} ${y - h * 0.1} L${x} ${y - h * 0.1} Z`, body, `stroke="${ink}" stroke-width="3"`)}
${path(`M${x + L * 0.3} ${y - h * 0.66} Q${x + L * 0.37} ${y - h * 0.94} ${x + L * 0.47} ${y - h * 0.94} L${x + L * 0.54} ${y - h * 0.94} L${x + L * 0.54} ${y - h * 0.66} Z M${x + L * 0.57} ${y - h * 0.94} L${x + L * 0.66} ${y - h * 0.94} Q${x + L * 0.73} ${y - h * 0.94} ${x + L * 0.76} ${y - h * 0.66} L${x + L * 0.57} ${y - h * 0.66} Z`, glass, `stroke="${ink}" stroke-width="2"`)}
${rect(x - 4, y - h * 0.25, L + 8, h * 0.1, ink)}
${circle(x + L * 0.2, y - h * 0.06, h * 0.22, ink)}${circle(x + L * 0.2, y - h * 0.06, h * 0.1, '#888')}
${circle(x + L * 0.8, y - h * 0.06, h * 0.22, ink)}${circle(x + L * 0.8, y - h * 0.06, h * 0.1, '#888')}
${rect(x + L * 0.5, y - h * 1.12, L * 0.1, h * 0.12, ink)}`;
}

// a tram, side on (the old Kolkata trams: two cars, a pole to the wire), its wheels on y; length L
export function tram(x, y, L, { body = '#2f6db5', band = '#f4ead2', ink = '#1d1d1d', windows = '#ffe08a' } = {}) {
  const h = L * 0.26;
  let w = '';
  for (let i = 0; i < 7; i++) w += rect((x + L * 0.06 + i * L * 0.13).toFixed(1), (y - h * 0.82).toFixed(1), (L * 0.09).toFixed(1), (h * 0.3).toFixed(1), windows, `stroke="${ink}" stroke-width="2"`);
  return `<line x1="${x + L * 0.5}" y1="${y - h}" x2="${x + L * 0.75}" y2="${y - h * 2.2}" stroke="${ink}" stroke-width="3"/>
${rect(x, y - h, L, h * 0.92, body, `stroke="${ink}" stroke-width="3" rx="${h * 0.18}"`)}
${rect(x, y - h * 0.42, L, h * 0.12, band)}${w}
${circle(x + L * 0.15, y - h * 0.04, h * 0.1, ink)}${circle(x + L * 0.3, y - h * 0.04, h * 0.1, ink)}${circle(x + L * 0.7, y - h * 0.04, h * 0.1, ink)}${circle(x + L * 0.85, y - h * 0.04, h * 0.1, ink)}`;
}

// Howrah Bridge, the cantilever truss, spanning x0–x1 with its deck at y
export function howrah(x0, x1, y, { ink = '#1f2b3a', lw = 6 } = {}) {
  const w = x1 - x0, t1 = x0 + w * 0.22, t2 = x1 - w * 0.22, top = y - w * 0.32, mid = y - w * 0.12;
  let s = `<g stroke="${ink}" stroke-width="${lw}" fill="none" stroke-linejoin="round">
<path d="M${x0} ${y} L${t1} ${top} L${t1} ${y} M${x1} ${y} L${t2} ${top} L${t2} ${y}"/>
<path d="M${t1} ${top} Q${(x0 + x1) / 2} ${mid} ${t2} ${top}"/>
<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}"/>`;
  for (let i = 1; i < 12; i++) { const x = t1 + ((t2 - t1) * i) / 12, yy = top + (mid - top) * Math.sin((Math.PI * i) / 12) * 0.95; s += `<line x1="${x.toFixed(1)}" y1="${yy.toFixed(1)}" x2="${x.toFixed(1)}" y2="${y}" stroke-width="${lw * 0.5}"/>`; }
  for (let i = 1; i < 5; i++) { const x = x0 + ((t1 - x0) * i) / 5; s += `<line x1="${x.toFixed(1)}" y1="${(y - ((top - y) * -1) * (i / 5)).toFixed(1)}" x2="${x.toFixed(1)}" y2="${y}" stroke-width="${lw * 0.5}"/>`; const x2 = x1 - ((x1 - t2) * i) / 5; s += `<line x1="${x2.toFixed(1)}" y1="${(y - (y - top) * (i / 5)).toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y}" stroke-width="${lw * 0.5}"/>`; }
  return `${s}</g>`;
}

// water: flat bands with light ripples, from y down to h
export function water(r, { y, w, h, fill, ripple, n = 40 }) {
  let s = rect(0, y, w, h - y, fill);
  for (let i = 0; i < n; i++) { const yy = y + 10 + r() * (h - y - 20), x = r() * w, l = 20 + r() * 90; s += `<line x1="${x.toFixed(1)}" y1="${yy.toFixed(1)}" x2="${(x + l).toFixed(1)}" y2="${yy.toFixed(1)}" stroke="${ripple}" stroke-width="2.5" stroke-linecap="round" opacity="${(0.3 + r() * 0.5).toFixed(2)}"/>`; }
  return s;
}

// a simple standing figure (head, body as a rounded robe), feet on y, height H
export function figure(x, y, H, { body, skin = '#8a5a3c', hair = '#1b1410', extra = '' }) {
  const hr = H * 0.11;
  return `${path(`M${x - H * 0.17} ${y} Q${x - H * 0.2} ${y - H * 0.55} ${x} ${y - H * 0.72} Q${x + H * 0.2} ${y - H * 0.55} ${x + H * 0.17} ${y} Z`, body)}
${circle(x, y - H * 0.83, hr, skin)}${path(`M${x - hr} ${y - H * 0.83} Q${x} ${y - H * 1.02} ${x + hr} ${y - H * 0.83} Q${x} ${y - H * 0.9} ${x - hr} ${y - H * 0.83} Z`, hair)}${extra}`;
}
