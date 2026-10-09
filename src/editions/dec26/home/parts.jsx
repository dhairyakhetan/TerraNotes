// December's small drawn pieces (home.jsx): a string of fairy lights sagging between two points, its bulbs in four
// colours twinkling out of step (home.css .dc-bulb-loop), and a five-pointed paper star.
export function FairyLights({ w, h = 60, sag = 40, n = 24, y0 = 6, y1 = 6, r = 5, phase = 0 }) {
  const at = (t) => [t * w, y0 + (y1 - y0) * t + sag * 4 * t * (1 - t)];
  return (
    <svg aria-hidden="true" width={w} height={h} style={{ display: "block", overflow: "visible" }}>
      <path d={`M0 ${y0} Q${w / 2} ${y0 + (y1 - y0) / 2 + sag * 2} ${w} ${y1}`} fill="none" stroke="var(--h-board)" strokeWidth="2" />
      {Array.from({ length: n }, (_, i) => {
        const [x, y] = at((i + 0.5) / n), c = ((i + phase) % 4) + 1;
        return (
          <g key={i} className="dc-bulb-loop" style={{ "--d": `${((i * 7 + phase) % 11) * 0.23}s` }}>
            <circle cx={x} cy={y + r + 2} r={r * 2.4} fill={`var(--h-bulb${c})`} opacity=".25" />
            <circle cx={x} cy={y + r + 2} r={r} fill={`var(--h-bulb${c})`} />
          </g>
        );
      })}
    </svg>
  );
}

export const Star = ({ size, color = 'var(--h-accent)', style }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="-50 -50 100 100" style={style}>
    <path d="M0 -48 L12 -15 L46 -15 L18 6 L29 40 L0 19 L-29 40 L-18 6 L-46 -15 L-12 -15 Z" fill={color} />
  </svg>
);
