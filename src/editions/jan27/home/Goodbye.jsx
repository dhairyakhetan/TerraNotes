import { useRef } from 'react';
import { useReveal } from '../../../lib/reveal.js';
import { FONT } from '../../../styles/fonts.js';

// January's goodbye (home.jsx): a library book's date-due card. Its earlier stamps are this year's issues, and the last
// line stamps itself (home.css .jn-stamp, once the section is in view: useReveal's .shown) with the next one: "DUE BACK:
// FEBRUARY". Over it, "Thanks for browsing".
const ROWS = [['SEP 2026', 'Ed. 01'], ['OCT 2026', 'Ed. 02'], ['NOV 2026', 'Ed. 03'], ['DEC 2026', 'Ed. 04'], ['JAN 2027', 'Ed. 05']];

export default function Goodbye({ web }) {
  const ref = useRef(null);
  useReveal(ref);
  return (
    <section ref={ref} aria-label="Thanks for browsing" className="jn-bye" style={{ marginTop: web ? "140px" : "80px", padding: web ? "0 120px" : "0 20px", display: "flex", flexDirection: web ? "row" : "column", alignItems: "center", justifyContent: "center", gap: web ? "80px" : "30px" }}>
      <div style={{ textAlign: web ? "left" : "center", maxWidth: web ? "520px" : "100%" }}>
        <div style={{ fontFamily: FONT.mono, fontSize: web ? "12px" : "10px", letterSpacing: "2px", color: "var(--h-accent)" }}>THE LAST PAGE · CLOSING TIME</div>
        <h2 style={{ margin: web ? "10px 0 0" : "8px 0 0", fontFamily: FONT.head, fontWeight: "900", fontSize: web ? "92px" : "48px", lineHeight: "1", color: "var(--h-ink)" }}>Thanks for browsing</h2>
        <div style={{ marginTop: web ? "12px" : "10px", fontFamily: FONT.script, fontSize: web ? "30px" : "22px", color: "var(--h-aside)" }}>the stall stays open. come back any time.</div>
        <p style={{ margin: web ? "18px 0 0" : "14px 0 0", fontFamily: FONT.read, fontSize: web ? "18px" : "15px", lineHeight: "1.55", color: "var(--h-ink)" }}>The fair packs up in twelve days. This issue doesn’t: it stays on the shelf, right here, for whenever you want it.</p>
      </div>
      <div aria-hidden="true" style={{ position: "relative", width: web ? "360px" : "300px", flexShrink: "0", background: "var(--h-paper)", border: "2px solid var(--h-ink)", boxShadow: "6px 6px 0 var(--h-ink)", transform: "rotate(2.5deg)", padding: web ? "18px 20px 22px" : "14px 16px 18px" }}>
        <div style={{ fontFamily: FONT.mono, fontWeight: "700", fontSize: web ? "13px" : "11px", letterSpacing: "2px", textAlign: "center", color: "var(--h-ink)", borderBottom: "2px solid var(--h-ink)", paddingBottom: "8px" }}>DATE DUE</div>
        {ROWS.map(([d, e], i) => (
          <div key={d} style={{ display: "flex", justifyContent: "space-between", padding: web ? "7px 4px" : "6px 4px", borderBottom: "1px solid var(--h-aside)", fontFamily: FONT.mono, fontSize: web ? "13px" : "11.5px", color: i % 2 ? "var(--h-aside)" : "var(--h-accent)" }}><span>{d}</span><span>{e}</span></div>
        ))}
        <div className="jn-stamp" style={{ marginTop: web ? "14px" : "12px", padding: web ? "6px 10px" : "5px 8px", border: "3px solid var(--h-accent)", borderRadius: "4px", color: "var(--h-accent)", fontFamily: FONT.mono, fontWeight: "700", fontSize: web ? "17px" : "14px", letterSpacing: "2px", textAlign: "center", transform: "rotate(-6deg)" }}>DUE BACK: FEBRUARY</div>
      </div>
    </section>
  );
}
