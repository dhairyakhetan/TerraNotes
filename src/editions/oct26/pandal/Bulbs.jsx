// Strings of bulbs for October's pandal pages, cheap to twinkle: the bulbs are split into two plain SVG layers, and each
// layer fades as a whole (opacity on the layer: the browser composites it, nothing is redrawn), one a beat after the
// other, so the string seems to twinkle. Animating each bulb on its own made the browser repaint the whole drawing
// every frame (too slow on phones). Class .pd-twinkle (pandal.css; with .dz, so reduced motion, LITE and page changes
// stop it). points: [[x, y], …] in the layer's own coordinates; w / h: its size; it sits at left / top.
// still: one plain layer that doesn't twinkle (phones: every extra full-size layer costs graphics memory, and iPhones
// leave parts of the page blank when they run out).
export default function Bulbs({ points, r, w, h, left = 0, top = 0, fill = "var(--bulb)", still = false }) {
  const halves = still ? [points] : [points.filter((_, i) => i % 2 === 0), points.filter((_, i) => i % 2 === 1)];
  return halves.map((pts, k) => (
    <svg key={k} className={still ? undefined : "dz pd-twinkle"} aria-hidden="true" width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ position: "absolute", left: `${left}px`, top: `${top}px`, overflow: "visible", pointerEvents: "none", animationDelay: k ? "-0.8s" : "0s" }}>
      {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={r} style={{ fill, stroke: "var(--ink)", strokeWidth: "1" }} />)}
    </svg>
  ));
}
