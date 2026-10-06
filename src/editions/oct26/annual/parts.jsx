import { FONT } from '../../../styles/fonts.js';

// Small shared pieces of October's annual (AnnualHome.jsx): the page numbers, the folio line at the top of each "page",
// and a section's heading.
// The issue's page numbers: the cover is 1, contents 2–3, every story two pages from 4, then photographs, the puzzle,
// the editorial board and the back cover. Playful, but consistent: the contents page and the folios agree.
export function pagesOf(n) {
  const story = (i) => 4 + i * 2, photos = 4 + Math.max(1, n) * 2;
  return { contents: 2, story, photos, puzzle: photos + 2, board: photos + 4, back: photos + 6 };
}
export const p2 = (n) => String(n).padStart(2, '0');

// the folio: "TERRANOTES · SHARADIYA 2026" on the left, the page on the right, over a thick-and-thin rule
export function Folio({ web, page, label }) {
  return (
    <div aria-hidden="true" style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "12px", paddingBottom: web ? "8px" : "6px", borderBottom: "3px double var(--ink)", fontFamily: FONT.mono, fontSize: web ? "11px" : "9px", letterSpacing: web ? "1.8px" : "1.2px", color: "var(--ink)" }}>
      <span>{`TERRANOTES · SHARADIYA 2026${label && web ? ` · ${label.toUpperCase()}` : ''}`}</span>
      <span>{`PAGE ${p2(page)}`}</span>
    </div>
  );
}

// a section's heading: big poster serif, a small mono kicker, an optional handwritten aside
export function Head({ web, title, kicker, aside, id }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "20px", margin: web ? "26px 0 30px" : "18px 0 20px", flexWrap: web ? "nowrap" : "wrap" }}>
      <div>
        {kicker && <div style={{ fontFamily: FONT.mono, fontSize: web ? "12px" : "10px", letterSpacing: "1.8px", color: "var(--hand)", marginBottom: web ? "6px" : "4px" }}>{kicker}</div>}
        <h2 id={id} style={{ margin: "0", fontFamily: FONT.head, fontWeight: "400", fontSize: web ? "84px" : "46px", lineHeight: "0.95", textTransform: "uppercase", color: "var(--ink)" }}>{title}</h2>
      </div>
      {aside && <div style={{ maxWidth: web ? "380px" : "100%", fontFamily: FONT.serif, fontStyle: "italic", fontSize: web ? "26px" : "20px", lineHeight: "1.15", color: "var(--hand)", textAlign: web ? "right" : "left" }}>{aside}</div>}
    </div>
  );
}
