import { useRef } from 'react';
import { useReveal } from '../../../lib/reveal.js';
import { FONT } from '../../../styles/fonts.js';
import { FairyLights, Star } from './parts.jsx';

// December's goodbye (home.jsx): the year's last page. A string of lights, "See you in 2027" with the 6 turning into a
// 7 like a flip clock (home.css .dc-flip), and a merry-christmas line in the neon script.
export default function Goodbye({ web }) {
  const ref = useRef(null), W = web ? 1440 : 390;
  useReveal(ref);
  return (
    <section ref={ref} aria-label="See you in 2027" className="dc-bye" style={{ position: "relative", marginTop: web ? "140px" : "80px", padding: web ? "40px 120px 80px" : "30px 20px 52px", background: "linear-gradient(180deg, var(--h-page), var(--h-sky))", textAlign: "center", overflow: "hidden" }}>
      <div style={{ marginLeft: web ? "-120px" : "-20px" }}><FairyLights w={W} h={70} sag={web ? 30 : 16} n={web ? 44 : 14} phase={1} /></div>
      <div style={{ marginTop: web ? "34px" : "22px", fontFamily: FONT.mono, fontSize: web ? "12px" : "10px", letterSpacing: "2px", color: "var(--h-accent)" }}>THE LAST PAGE · 31 DECEMBER, 11:59 P.M.</div>
      <h2 style={{ margin: web ? "10px 0 0" : "8px 0 0", fontFamily: FONT.head, fontWeight: "400", fontSize: web ? "104px" : "48px", lineHeight: "1.05", color: "var(--h-ink)" }}>
        See you in 202<span className="dc-flip" aria-label="7"><span aria-hidden="true">6</span><span aria-hidden="true">7</span></span>
      </h2>
      <div className="dc-neon" style={{ marginTop: web ? "10px" : "8px", fontFamily: FONT.script, fontSize: web ? "38px" : "25px", color: "var(--h-aside)" }}>merry christmas · happy new year</div>
      <p style={{ margin: web ? "22px auto 0" : "16px auto 0", maxWidth: web ? "620px" : "320px", fontFamily: FONT.read, fontSize: web ? "18px" : "15px", lineHeight: "1.55", color: "var(--h-ink)", opacity: ".85" }}>The lights on Park Street stay up until New Year. So does this issue, and longer: come back to it any time.</p>
      <div aria-hidden="true" style={{ display: "flex", justifyContent: "center", gap: web ? "30px" : "16px", marginTop: web ? "30px" : "22px" }}>
        {[0, 1, 2].map((i) => <Star key={i} size={web ? 34 : 24} color={`var(--h-bulb${i + 1})`} />)}
      </div>
    </section>
  );
}
