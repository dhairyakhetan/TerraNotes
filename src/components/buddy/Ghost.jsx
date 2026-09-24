// Buddy himself: a small sheet ghost. face: 'happy' | 'boo' (mouth wide open).
export default function Ghost({ size = 60, face = 'happy', style, className }) {
  return (
    <svg className={className} width={size} height={size * 70 / 60} viewBox="0 0 60 70" style={style} aria-hidden="true">
      <path d="M30 4 C14 4 6 16 6 32 V61 q4 -6 8 0 q4 6 8 0 q4 -6 8 0 q4 6 8 0 q4 -6 8 0 q4 6 8 0 V32 C54 16 46 4 30 4 Z" fill="#FBF8F1" stroke="#111111" strokeWidth="2.5" strokeLinejoin="round" />
      <ellipse cx="22" cy="29" rx="3.6" ry={face === 'boo' ? 6 : 5} fill="#111111" />
      <ellipse cx="38" cy="29" rx="3.6" ry={face === 'boo' ? 6 : 5} fill="#111111" />
      <circle cx="23.2" cy="27" r="1.2" fill="#FFFFFF" /><circle cx="39.2" cy="27" r="1.2" fill="#FFFFFF" />
      <ellipse cx="15" cy="39" rx="4" ry="2.4" fill="#EE4E8A" opacity=".45" /><ellipse cx="45" cy="39" rx="4" ry="2.4" fill="#EE4E8A" opacity=".45" />
      {face === 'boo'
        ? <ellipse cx="30" cy="43" rx="5" ry="6.5" fill="#111111" />
        : <path d="M25.5 40 q4.5 4.5 9 0" fill="none" stroke="#111111" strokeWidth="2.2" strokeLinecap="round" />}
    </svg>
  );
}

// The same ghost on a canvas (for the games). (x, y) = centre of his head; r = head radius; look = eye offset
// (-1…1 each way); t = seconds, for the wavy hem; face as above.
export function drawGhost(g, x, y, r, { look = [0, 0], t = 0, face = 'happy', tilt = 0, sx = 1, sy = 1 } = {}) {
  g.save();
  g.translate(x, y); g.rotate(tilt); g.scale(sx, sy);
  const w = r, h = r * 2.1, waves = 5;
  g.beginPath();
  g.moveTo(-w, 0);
  g.arc(0, 0, w, Math.PI, 0);
  g.lineTo(w, h * 0.55);
  for (let i = 0; i < waves; i++) {
    const x0 = w - (i * 2 * w) / waves, x1 = w - ((i + 1) * 2 * w) / waves;
    const bob = Math.sin(t * 8 + i) * r * 0.08;
    g.quadraticCurveTo((x0 + x1) / 2, h * 0.55 + (i % 2 ? -r * 0.28 : r * 0.28) + bob, x1, h * 0.55);
  }
  g.closePath();
  g.fillStyle = '#FBF8F1'; g.fill();
  g.lineWidth = Math.max(1.5, r * 0.12); g.strokeStyle = '#111111'; g.lineJoin = 'round'; g.stroke();
  const ex = look[0] * r * 0.18, ey = look[1] * r * 0.14;
  g.fillStyle = '#111111';
  for (const s of [-1, 1]) { g.beginPath(); g.ellipse(s * r * 0.34 + ex, -r * 0.05 + ey, r * 0.13, face === 'boo' ? r * 0.22 : r * 0.18, 0, 0, Math.PI * 2); g.fill(); }
  g.fillStyle = 'rgba(238,78,138,.45)';
  for (const s of [-1, 1]) { g.beginPath(); g.ellipse(s * r * 0.55, r * 0.3, r * 0.14, r * 0.08, 0, 0, Math.PI * 2); g.fill(); }
  g.fillStyle = '#111111';
  if (face === 'boo') { g.beginPath(); g.ellipse(ex * 0.5, r * 0.45, r * 0.16, r * 0.22, 0, 0, Math.PI * 2); g.fill(); }
  g.restore();
}
