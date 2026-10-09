// January's small drawn pieces (home.jsx): a string of paper bunting (triangle flags in four colours, fluttering:
// home.css .jn-flag-loop) and a little stack of books.
export function Bunting({ w, n, y0 = 0, sag = 30, size = 34 }) {
  return (
    <svg aria-hidden="true" width={w} height={sag * 2 + size + 10} style={{ display: "block", overflow: "visible" }}>
      <path d={`M0 ${y0} Q${w / 2} ${y0 + sag * 2} ${w} ${y0}`} fill="none" stroke="var(--h-ink)" strokeWidth="1.5" />
      {Array.from({ length: n }, (_, i) => {
        const t = (i + 0.5) / n, x = t * w, y = y0 + sag * 2 * t * (1 - t);
        return <path key={i} className="jn-flag-loop" style={{ "--d": `${(i % 5) * 0.31}s` }} d={`M${x - size * 0.45} ${y} L${x + size * 0.45} ${y} L${x} ${y + size} Z`} fill={`var(--h-flag${(i % 4) + 1})`} />;
      })}
    </svg>
  );
}

export function Stack({ books, w = 120, h = 22, style }) {
  return (
    <div aria-hidden="true" style={{ display: "flex", flexDirection: "column", alignItems: "center", ...style }}>
      {books.map(([c, k], i) => <div key={i} style={{ width: `${w * k}px`, height: `${h}px`, background: `var(--h-book${c})`, border: "1.5px solid var(--h-ink)", borderRadius: "2px", translate: `${(i % 2 ? 1 : -1) * (i * 3)}px 0`, boxShadow: "inset 6px 0 0 color-mix(in srgb, var(--h-paper) 35%, transparent)" }} />)}
    </div>
  );
}
