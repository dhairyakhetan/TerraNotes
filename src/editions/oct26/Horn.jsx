import { useEffect, useRef, useState } from 'react';
import { calm, LITE } from '../../lib/motion.js';

// October 2026's horn, at the height of the "Meet the team" legend's foot (src/editions/pages.js TEAM_NOTE;
// shared/TeamSection.jsx gives the top): the curved S-horn blown at Pujo, drawn like an old engraving (ink outline,
// hatching down its shaded side, beaded bands) in the look's colours. It lives just off the page's edge, as if someone
// out of sight holds it: now and then, while that part of the page is on screen, it slides in (from the left on web,
// from the right on phones, mirrored), lifts, sound rings roll out of the bell, and it slides back out. One-shot
// animations (look.css .horn-*) started from here. With reduced motion or on a low-end device it just rests in view,
// still. Decoration only: hidden from screen readers.

// the horn's centre line (cubic Bézier, mouthpiece → bell) in a 120×200 box, and its width along the way
const P = [[14, 192], [124, 170], [-38, 82], [96, 24]];
const at = (t) => {
  const u = 1 - t, k = [u * u * u, 3 * u * u * t, 3 * u * t * t, t * t * t];
  return [0, 1].map((i) => k.reduce((s, c, j) => s + c * P[j][i], 0));
};
const tangent = (t) => {
  const [a, b] = [at(Math.max(0, t - 0.005)), at(Math.min(1, t + 0.005))], l = Math.hypot(b[0] - a[0], b[1] - a[1]);
  return [(b[0] - a[0]) / l, (b[1] - a[1]) / l];
};
const width = (t) => 3 + 14 * t ** 1.6;
const side = (t, f) => { const [x, y] = at(t), [tx, ty] = tangent(t), w = width(t) * f; return [x - ty * w, y + tx * w]; };
const N = 48, TS = Array.from({ length: N + 1 }, (_, i) => (i / N) * 0.97);
const line = (pts) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
const BODY = `${line(TS.map((t) => side(t, 1)))} ${line(TS.slice().reverse().map((t) => side(t, -1))).replace('M', 'L')} Z`;
const HATCH = [0.35, 0.55, 0.75].map((f) => line(TS.filter((t) => t > 0.06).map((t) => side(t, -f))));
const BANDS = [0.18, 0.46, 0.72, 0.95].map((t) => ({ a: side(t, 1.12), b: side(t, -1.12), t }));
const [BX, BY] = at(0.97), [BTX, BTY] = tangent(0.97), BELL = Math.atan2(BTY, BTX) * 180 / Math.PI;

const ink = { stroke: "var(--ink)", strokeLinecap: "round", strokeLinejoin: "round" };
export default function Horn({ style, web }) {
  const box = useRef(null);
  const still = calm() || LITE;
  const [blow, setBlow] = useState(0); // counts appearances; each one restarts the animation
  useEffect(() => {
    if (still) return undefined;
    let timer = 0, seen = false;
    const next = (ms) => { clearTimeout(timer); timer = setTimeout(() => { if (seen) setBlow((n) => n + 1); next(10000 + Math.random() * 10000); }, ms); };
    const io = new IntersectionObserver(([e]) => { seen = e.isIntersecting; if (seen) next(3000); else clearTimeout(timer); }, { threshold: 0.6 });
    io.observe(box.current);
    return () => { io.disconnect(); clearTimeout(timer); };
  }, []);
  const s = web ? 1.3 : 0.9, W = 200 * s, H = 120 * s;
  return (
    <div ref={box} aria-hidden="true" style={{ position: "absolute", top: style.top, [web ? 'left' : 'right']: "0", width: `${W}px`, height: `${H}px`, pointerEvents: "none" }}>
      <div key={blow} className={blow ? 'horn-pop' : undefined} style={{ width: "100%", height: "100%", '--out': web ? '-105%' : '105%', translate: still ? "0" : "var(--out)" }}>
        <svg width={W} height={H} viewBox="0 -10 200 120" style={{ overflow: "visible", display: "block", transform: web ? undefined : "scaleX(-1)" }}>
          {/* lying down: mouthpiece at the page's edge, bell towards the page */}
          <g transform="translate(200 0) rotate(90)">
            <g className={blow ? 'horn-lift' : undefined} style={{ transformOrigin: `${P[0][0]}px ${P[0][1]}px`, transformBox: "view-box" }}>
              <path d={BODY} style={{ ...ink, fill: "var(--yellow)", strokeWidth: "2.2" }} />
              {HATCH.map((d, i) => <path key={i} d={d} style={{ ...ink, fill: "none", strokeWidth: "0.9", opacity: String(0.55 - i * 0.12) }} />)}
              {BANDS.map(({ a, b, t }) => (
                <g key={t}>
                  <path d={`M${a[0]} ${a[1]} L${b[0]} ${b[1]}`} style={{ ...ink, strokeWidth: String(4 + width(t) * 0.18), stroke: "var(--red)" }} />
                  <path d={`M${a[0]} ${a[1]} L${b[0]} ${b[1]}`} style={{ ...ink, strokeWidth: "1.4", strokeDasharray: "0.1 3.2", stroke: "var(--card)" }} />
                </g>
              ))}
              <g transform={`translate(${BX} ${BY}) rotate(${BELL})`}>
                <ellipse cx="2" cy="0" rx="6" ry={width(0.97) * 1.35} style={{ ...ink, fill: "var(--yellow)", strokeWidth: "2.2" }} />
                <ellipse cx="3" cy="0" rx="3.4" ry={width(0.97) * 1.0} style={{ ...ink, fill: "var(--ink)", strokeWidth: "1" }} />
                {blow > 0 && [0, 1, 2].map((i) => (
                  <path key={i} className="horn-ring" d={`M${12 + i * 10} ${-16 - i * 7} Q${24 + i * 13} 0 ${12 + i * 10} ${16 + i * 7}`} style={{ ...ink, fill: "none", strokeWidth: "2.6", stroke: "var(--hand)", animationDelay: `${1.25 + i * 0.18}s` }} />
                ))}
              </g>
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}
