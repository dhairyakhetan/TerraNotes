import { useEffect, useRef, useState } from 'react';
import { calm } from '../../../lib/motion.js';
import { FONT } from '../../../styles/fonts.js';
import { Diya } from './parts.jsx';

// November's goodbye (home.jsx): fourteen diyas, the choddo prodip of Bhoot Chaturdashi, in a row that light one by one
// when it comes into view, over "Shubho Deepaboli" and a line to see you in December. Reduced motion: all lit at once.
export default function Goodbye({ web }) {
  const ref = useRef(null), [lit, setLit] = useState(false);
  useEffect(() => {
    if (calm() || typeof IntersectionObserver === 'undefined') { setLit(true); return undefined; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setLit(true); io.disconnect(); } }, { threshold: 0.4 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <section ref={ref} aria-label="Shubho Deepaboli" className="nv-bye" style={{ position: "relative", marginTop: web ? "140px" : "80px", padding: web ? "70px 120px 80px" : "46px 20px 52px", background: "linear-gradient(180deg, var(--h-page), var(--h-sky))", textAlign: "center" }}>
      <div aria-hidden="true" className={`nv-row${lit ? ' is-lit' : ''}`} style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: web ? "18px" : "8px 10px", maxWidth: web ? "1000px" : "330px", margin: "0 auto" }}>
        {Array.from({ length: 14 }, (_, i) => <span key={i} style={{ "--t": `${i * 0.14}s` }}><Diya size={web ? 50 : 34} delay={i * 0.31} /></span>)}
      </div>
      <div style={{ marginTop: web ? "34px" : "24px", fontFamily: FONT.mono, fontSize: web ? "12px" : "10px", letterSpacing: "2px", color: "var(--h-accent)" }}>THE LAST PAGE · CHODDO PRODIP</div>
      <h2 className="nv-glow" style={{ margin: web ? "8px 0 0" : "6px 0 0", fontFamily: FONT.head, fontWeight: "800", fontSize: web ? "96px" : "46px", lineHeight: "1", letterSpacing: web ? "-2px" : "-1px", color: "var(--h-ink)" }}>Shubho Deepaboli</h2>
      <div style={{ marginTop: web ? "12px" : "10px", fontFamily: FONT.script, fontSize: web ? "30px" : "21px", color: "var(--h-aside)" }}>light one for us. see you in December.</div>
      <p style={{ margin: web ? "22px auto 0" : "16px auto 0", maxWidth: web ? "620px" : "320px", fontFamily: FONT.read, fontSize: web ? "18px" : "15px", lineHeight: "1.55", color: "var(--h-ink)", opacity: ".85" }}>Fourteen lamps for fourteen generations, one for every dark corner. This issue stays lit right here: come back to it any time.</p>
    </section>
  );
}
