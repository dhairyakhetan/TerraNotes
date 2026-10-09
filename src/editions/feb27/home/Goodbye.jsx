import { useRef } from 'react';
import { useReveal } from '../../../lib/reveal.js';
import { FONT } from '../../../styles/fonts.js';
import { Seal } from './parts.jsx';

// February's goodbye (home.jsx): the end of a letter. "Yours, always," a signature in the looping pen hand, two
// postscripts, and a wax seal that presses down onto the page once it's in view (home.css .fb-press, on useReveal's
// .shown), between airmail stripes.
export default function Goodbye({ web }) {
  const ref = useRef(null);
  useReveal(ref);
  return (
    <section ref={ref} aria-label="Yours, always" className="fb-bye" style={{ position: "relative", marginTop: web ? "140px" : "80px" }}>
      <div aria-hidden="true" className="fb-air" style={{ height: web ? "16px" : "10px" }} />
      <div style={{ position: "relative", margin: web ? "0 auto" : "0 20px", maxWidth: web ? "820px" : "none", padding: web ? "60px 70px 70px" : "34px 22px 44px", background: "var(--h-paper)", borderLeft: "2px solid var(--h-ink)", borderRight: "2px solid var(--h-ink)", backgroundImage: "repeating-linear-gradient(transparent 0 35px, color-mix(in srgb, var(--h-aside) 16%, transparent) 35px 36px)" }}>
        <div style={{ fontFamily: FONT.mono, fontSize: web ? "12px" : "10px", letterSpacing: "2px", color: "var(--h-accent)" }}>THE LAST PAGE · SIGNED, SEALED</div>
        <h2 style={{ margin: web ? "12px 0 0" : "8px 0 0", fontFamily: FONT.head, fontWeight: "400", fontSize: web ? "90px" : "50px", lineHeight: "1", color: "var(--h-ink)" }}>Yours, always,</h2>
        <div style={{ marginTop: web ? "14px" : "10px", fontFamily: FONT.script, fontSize: web ? "40px" : "26px", lineHeight: "1.5", color: "var(--h-aside)", transform: "rotate(-3deg)", transformOrigin: "0 50%" }}>TerraNotes</div>
        <p style={{ margin: web ? "26px 0 0" : "18px 0 0", maxWidth: web ? "520px" : "100%", fontFamily: FONT.read, fontSize: web ? "18px" : "15px", lineHeight: "1.6", color: "var(--h-ink)" }}><strong style={{ fontWeight: "600" }}>P.S.</strong> To everyone sitting the boards this month: you’ve got this. Sleep, eat breakfast, don’t discuss the paper afterwards.</p>
        <p style={{ margin: "10px 0 0", maxWidth: web ? "520px" : "100%", fontFamily: FONT.read, fontSize: web ? "18px" : "15px", lineHeight: "1.6", color: "var(--h-ink)" }}><strong style={{ fontWeight: "600" }}>P.P.S.</strong> These letters stay right here. Come back and reread them any time.</p>
        <div className="fb-press" style={{ position: "absolute", right: web ? "70px" : "20px", bottom: web ? "60px" : "auto", top: web ? "auto" : "110px" }}><Seal size={web ? 110 : 68} /></div>
      </div>
      <div aria-hidden="true" className="fb-air" style={{ height: web ? "16px" : "10px" }} />
    </section>
  );
}
