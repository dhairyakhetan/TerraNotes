// Buddy himself: a round green ghost with three bumps along his hem, as SVG (Ghost) or drawn on a canvas for the
// games (drawGhost). face: 'happy' | 'boo' (mouth wide open). Colours: the edition's look (green, card, ink).
const fill = (c) => ({ fill: `var(--${c})` });
export default function Ghost({ size = 60, face = 'happy', style, className }) {
  return (
    <svg className={className} width={size} height={size * 70 / 60} viewBox="0 0 60 70" style={style} aria-hidden="true">
      <path d="M6 30 C6 14 17 4 30 4 C43 4 54 14 54 30 V60 a8 8 0 0 1 -16 0 a8 8 0 0 1 -16 0 a8 8 0 0 1 -16 0 Z" style={fill('green')} />
      <circle cx="21" cy="27" r="6.5" style={fill('card')} /><circle cx="39" cy="27" r="6.5" style={fill('card')} />
      <circle cx="21.5" cy="27" r="3.4" style={fill('ink')} /><circle cx="39.5" cy="27" r="3.4" style={fill('ink')} />
      {face === 'boo'
        ? <ellipse cx="30" cy="44" rx="5.5" ry="7" style={fill('ink')} />
        : <path d="M22 39 h16 a8 8 0 0 1 -16 0 Z" style={fill('ink')} />}
    </svg>
  );
}

// The same ghost on a canvas (for the games). (x, y) = centre of his head; r = head radius; C = the look's colours;
// look = where his pupils point (-1…1 each way); t = seconds, for the wiggling hem; face as above.
export function drawGhost(g, x, y, r, C, { look = [0, 0], t = 0, face = 'happy', tilt = 0, sx = 1, sy = 1 } = {}) {
  g.save();
  g.translate(x, y); g.rotate(tilt); g.scale(sx, sy);
  const w = r, base = r * 1.25, bump = (2 * w) / 3;
  g.beginPath();
  g.moveTo(-w, 0);
  g.arc(0, 0, w, Math.PI, 0);
  g.lineTo(w, base);
  for (let i = 0; i < 3; i++) {
    const cx = w - bump * (i + 0.5), dip = bump / 2 + Math.sin(t * 7 + i * 1.7) * r * 0.06;
    g.ellipse(cx, base, bump / 2, dip, 0, 0, Math.PI);
  }
  g.closePath();
  g.fillStyle = C.green; g.fill();
  const px = look[0] * r * 0.1, py = look[1] * r * 0.1;
  for (const s of [-1, 1]) {
    g.fillStyle = C.card; g.beginPath(); g.arc(s * r * 0.37, -r * 0.1, r * 0.27, 0, Math.PI * 2); g.fill();
    g.fillStyle = C.ink; g.beginPath(); g.arc(s * r * 0.37 + px, -r * 0.1 + py, r * 0.14, 0, Math.PI * 2); g.fill();
  }
  g.fillStyle = C.ink; g.beginPath();
  if (face === 'boo') g.ellipse(0, r * 0.55, r * 0.22, r * 0.3, 0, 0, Math.PI * 2);
  else { g.moveTo(-r * 0.33, r * 0.4); g.lineTo(r * 0.33, r * 0.4); g.arc(0, r * 0.4, r * 0.33, 0, Math.PI); }
  g.fill();
  g.restore();
}
