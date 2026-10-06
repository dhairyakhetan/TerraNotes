import { useRef } from 'react';
import { useEdition } from '../../../lib/edition.js';
import { useReveal } from '../../../lib/reveal.js';
import { FONT } from '../../../styles/fonts.js';
import { p2 } from './parts.jsx';

// The annual's back cover (AnnualHome.jsx), the Dashami goodbye: the same alta red cloth and marigold frame as the
// front, "Subho Bijoya!", "asche bochor abar hobe" (see you next year), a line about Dashami, and a printed barcode
// with the issue number, as on the back of a real annual. Element id "back-cover" (the contents page links to it).
const BARS = [3, 1, 2, 1, 1, 3, 1, 2, 2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 1, 3, 1, 2, 1, 2];

export default function BackCover({ web }) {
  const ref = useRef(null), { number } = useEdition();
  useReveal(ref);
  const W = web ? 1140 : 350, H = web ? 440 : 530;
  return (
    <section ref={ref} id="back-cover" aria-label="Subho Bijoya" style={{ position: "relative", width: `${W}px`, height: `${H}px`, margin: web ? "120px auto 0" : "70px auto 0", transform: "rotate(0.5deg)" }}>
      <div style={{ position: "absolute", inset: "0", background: "var(--ink)", translate: web ? "14px 14px" : "8px 8px" }} />
      <div style={{ position: "absolute", inset: "0", boxSizing: "border-box", background: "var(--red)", border: "2px solid var(--ink)", overflow: "hidden", color: "var(--page)", backgroundImage: "radial-gradient(circle, rgba(255,201,20,.16) 0 2px, transparent 2.5px)", backgroundSize: web ? "30px 30px" : "22px 22px" }}>
        <div style={{ position: "absolute", inset: web ? "20px" : "10px", border: `${web ? 4 : 3}px solid var(--yellow)`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: web ? "30px" : "16px", border: "1.5px solid var(--yellow)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", left: web ? "70px" : "32px", top: web ? "64px" : "40px", width: web ? "820px" : "290px" }}>
          <div style={{ fontFamily: FONT.mono, fontSize: web ? "12px" : "9.5px", letterSpacing: "2px", color: "var(--yellow)" }}>DASHAMI · THE LAST PAGE</div>
          <h2 style={{ margin: web ? "10px 0 0" : "8px 0 0", fontFamily: FONT.head, fontWeight: "400", fontSize: web ? "92px" : "50px", lineHeight: "1", textTransform: "uppercase", color: "var(--page)" }}>Subho Bijoya!</h2>
          <div style={{ marginTop: web ? "8px" : "8px", fontFamily: FONT.hand, fontSize: web ? "38px" : "25px", lineHeight: "1.05", color: "var(--yellow)", transform: "rotate(-1.5deg)" }}>asche bochor abar hobe: see you next year</div>
          <p style={{ margin: web ? "20px 0 0" : "14px 0 0", maxWidth: web ? "600px" : "100%", fontFamily: FONT.read, fontSize: web ? "18px" : "15.5px", lineHeight: "1.55", color: "var(--page)" }}>On Dashami the idols go to the river, everyone smears sindoor on everyone, and the city waits a whole year to hear the dhak again. This issue stays right here: come back to it any time.</p>
        </div>
        <div aria-hidden="true" style={{ position: "absolute", right: web ? "70px" : "auto", left: web ? "auto" : "32px", bottom: web ? "64px" : "36px", background: "var(--card)", padding: web ? "12px 14px 8px" : "8px 10px 6px", border: "2px solid var(--ink)" }}>
          <div style={{ display: "flex", alignItems: "stretch", gap: web ? "2px" : "1.5px", height: web ? "64px" : "40px" }}>
            {BARS.map((b, i) => <span key={i} style={{ width: `${b * (web ? 2 : 1.4)}px`, background: i % 2 ? "transparent" : "var(--ink)" }} />)}
          </div>
          <div style={{ marginTop: "4px", fontFamily: FONT.mono, fontSize: web ? "11px" : "8.5px", letterSpacing: "2px", color: "var(--ink)", textAlign: "center" }}>{`TN · 2026 · ${p2(number)}`}</div>
        </div>
      </div>
    </section>
  );
}
