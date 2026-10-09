// November's small drawn pieces (home.jsx): a clay diya with a flickering flame (.nv-flame: the goodbye lights them), and a small sky lantern hanging from
// a rope, swaying. Colours from the look's `home` (--h-…), motion in home.css (class names ending -loop stop for
// reduced motion: src/editions/season/season.css).
export function Diya({ size, delay = 0 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" style={{ overflow: "visible", display: "block" }}>
      <g className="nv-flame">
        <ellipse cx="30" cy="22" rx="22" ry="22" fill="var(--h-glow)" opacity=".22" />
        <g className="nv-flicker-loop" style={{ "--d": `${delay}s` }}>
          <path d="M30 10 Q38 24 30 34 Q22 24 30 10 Z" fill="var(--h-flame)" />
          <path d="M30 18 Q34 26 30 32 Q26 26 30 18 Z" fill="var(--h-star)" />
        </g>
      </g>
      <path d="M6 36 Q30 34 54 36 Q50 52 30 54 Q10 52 6 36 Z" fill="var(--h-lantern2)" />
      <path d="M6 36 Q30 40 54 36" fill="none" stroke="var(--h-page)" strokeOpacity=".35" strokeWidth="2" />
    </svg>
  );
}

// a small akash prodip on the hero's rope: a string down to a paper lantern (top cap, glowing body, bottom cap, tassel)
export function SkyLantern({ x, y, s = 1, c = 1, drop = 20, delay = 0 }) {
  const w = 34 * s, h = 46 * s;
  return (
    <div aria-hidden="true" className="nv-sway-loop" style={{ position: "absolute", left: `${x - w / 2}px`, top: `${y}px`, width: `${w}px`, "--d": `${delay}s`, transformOrigin: "50% 0" }}>
      <div style={{ width: "1px", height: `${drop}px`, margin: "0 auto", background: "var(--h-accent)", opacity: ".6" }} />
      <div style={{ height: `${8 * s}px`, margin: `0 ${6 * s}px`, background: "var(--h-page)", clipPath: "polygon(20% 0, 80% 0, 100% 100%, 0 100%)" }} />
      <div className="nv-lamp-glow" style={{ height: `${h}px`, background: `var(--h-lantern${c})`, borderRadius: `${6 * s}px`, boxShadow: `0 0 ${24 * s}px var(--h-lantern${c})`, backgroundImage: "linear-gradient(90deg, transparent 0 30%, rgba(255,255,255,.28) 30% 34%, transparent 34% 66%, rgba(255,255,255,.28) 66% 70%, transparent 70%)" }} />
      <div style={{ height: `${8 * s}px`, margin: `0 ${6 * s}px`, background: "var(--h-page)", clipPath: "polygon(0 0, 100% 0, 80% 100%, 20% 100%)" }} />
      <div style={{ width: "2px", height: `${14 * s}px`, margin: "0 auto", background: `var(--h-lantern${c})` }} />
    </div>
  );
}
