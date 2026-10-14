// October's hanging diya (the design brief: "small hanging diyas alongside the writeups"): a clay lamp in a little
// string cradle, its flame flickering, the whole thing swinging gently from its thread. Used on the web article wire
// (web/WebArticleLine.jsx, between the cards: src/editions/pages.js HANGERS) and on the phone home (Decor.jsx).
// string: the thread's length; s: the lamp's width. Colours: the look's (var(--red) alta clay, var(--yellow) flame).
// Motion: look.css .oct-diya-sway / .oct-flame (class dz: stopped by reduced motion and LITE, paused off screen and
// while pages swap, styles/loops.css). Decoration only: hidden from screen readers.
export default function HangingDiya({ string = 40, s = 34, delay = 0, style }) {
  const h = s * 0.62;
  return (
    <div aria-hidden="true" className="dz oct-diya-sway" style={{ position: "absolute", width: `${s}px`, height: `${string + h + s * 0.2}px`, transformOrigin: "50% 0", animationDelay: `${delay}s`, pointerEvents: "none", ...style }}>
      <div style={{ position: "absolute", left: `${s / 2 - 0.7}px`, top: "0", width: "1.4px", height: `${string}px`, background: "var(--string)" }} />
      <svg width={s} height={h + s * 0.4} viewBox="0 0 60 56" style={{ position: "absolute", left: "0", top: `${string - s * 0.36}px`, overflow: "visible" }}>
        <path d="M30 0 L8 30 M30 0 L52 30" style={{ stroke: "var(--string)", strokeWidth: "1.6", fill: "none" }} />
        <g className="dz oct-flame" style={{ animationDelay: `${delay * 0.7}s` }}>
          <ellipse cx="30" cy="22" rx="16" ry="16" style={{ fill: "var(--yellow)", opacity: ".28" }} />
          <path d="M30 6 Q38 20 30 30 Q22 20 30 6 Z" style={{ fill: "var(--yellow)", stroke: "var(--ink)", strokeWidth: "1.5" }} />
          <path d="M30 15 Q33 22 30 28 Q27 22 30 15 Z" style={{ fill: "var(--card)" }} />
        </g>
        <path d="M4 30 Q30 27 56 30 Q51 50 30 52 Q9 50 4 30 Z" style={{ fill: "var(--red)", stroke: "var(--ink)", strokeWidth: "2", strokeLinejoin: "round" }} />
        <path d="M9 36 Q30 40 51 36" style={{ fill: "none", stroke: "var(--yellow)", strokeWidth: "2.2", strokeDasharray: "2 4", strokeLinecap: "round" }} />
      </svg>
    </div>
  );
}
