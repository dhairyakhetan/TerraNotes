import { Link } from '../../../router.jsx';
import { homeLink } from '../../../data/editions.js';
import { useEdition } from '../../../lib/edition.js';
import { FONT } from '../../../styles/fonts.js';
import { FairyLights, Star } from './parts.jsx';

// December's top (home.jsx): Park Street on Christmas week. Strings of fairy lights criss-cross overhead, paper stars
// hang and turn, an enamel street sign says PARK STREET in the fat signboard serif, a neon script under it, the issue's
// line, and "open the doors ↓" to the advent calendar (/articles).
const L = {
  web: { h: 740, sign: "150px", script: "40px", intro: "21px", kicker: "13px" },
  phone: { h: 620, sign: "54px", script: "26px", intro: "16px", kicker: "9.5px" },
};
const STARS = { web: [[150, 130, 70], [330, 230, 44], [1120, 110, 80], [1290, 260, 50], [760, 60, 36]], phone: [[50, 120, 40], [330, 140, 44], [210, 60, 26]] };

export default function Hero({ web }) {
  const S = L[web ? 'web' : 'phone'], { number, month, intro } = useEdition(), W = web ? 1440 : 390;
  return (
    <section aria-label="Park Street, the December issue" className="dc-hero" style={{ position: "relative", height: `${S.h}px`, overflow: "hidden", background: "radial-gradient(ellipse at 50% 45%, var(--h-sky), var(--h-page) 70%)" }}>
      <div style={{ position: "absolute", left: "0", top: "0" }}><FairyLights w={W} h={120} sag={web ? 50 : 26} n={web ? 40 : 14} y0={10} y1={60} /></div>
      <div style={{ position: "absolute", left: "0", top: web ? "40px" : "36px" }}><FairyLights w={W} h={120} sag={web ? 40 : 22} n={web ? 36 : 12} y0={50} y1={0} phase={2} /></div>
      {STARS[web ? 'web' : 'phone'].map(([x, y, s], i) => (
        <div key={i} aria-hidden="true" className="dc-turn-loop" style={{ position: "absolute", left: `${x - s / 2}px`, top: `${y}px`, "--d": `${i * 0.8}s`, transformOrigin: "50% 0" }}>
          <div style={{ width: "1px", height: `${y < 100 ? 20 : 40}px`, margin: "0 auto", background: "var(--h-accent)", opacity: ".6" }} />
          <Star size={s} color={i % 2 ? 'var(--h-bulb2)' : 'var(--h-accent)'} style={{ display: "block", filter: "drop-shadow(0 0 10px var(--h-accent))" }} />
        </div>
      ))}
      <div style={{ position: "absolute", left: "0", right: "0", top: web ? "200px" : "200px", textAlign: "center", padding: web ? "0" : "0 16px" }}>
        <div style={{ fontFamily: FONT.mono, fontSize: S.kicker, letterSpacing: web ? "3px" : "1.8px", color: "var(--h-accent)" }}>{`TERRANOTES · EDITION ${String(number).padStart(2, '0')} · ${month.toUpperCase()}`}</div>
        <div style={{ display: "inline-block", marginTop: web ? "18px" : "14px", padding: web ? "10px 44px 18px" : "6px 18px 10px", background: "var(--h-board)", border: `${web ? 6 : 4}px solid var(--h-paper)`, borderRadius: web ? "18px" : "12px", boxShadow: `0 0 0 ${web ? 3 : 2}px var(--h-board), ${web ? 10 : 6}px ${web ? 12 : 8}px 0 rgba(0,0,0,.35)` }}>
          <h1 style={{ margin: "0", fontFamily: FONT.head, fontWeight: "400", fontSize: S.sign, lineHeight: "1.05", letterSpacing: web ? "2px" : "0", color: "var(--h-paper)", whiteSpace: "nowrap" }}>Park Street</h1>
        </div>
        <div className="dc-neon" style={{ marginTop: web ? "22px" : "16px", fontFamily: FONT.script, fontSize: S.script, lineHeight: "1.15", color: "var(--h-aside)" }}>{web ? 'Christmas · New Year’s Eve · the year, wrapped' : <>Christmas · New Year’s Eve<br />the year, wrapped</>}</div>
        <p style={{ margin: web ? "16px auto 0" : "12px auto 0", maxWidth: web ? "560px" : "300px", fontFamily: FONT.read, fontSize: S.intro, lineHeight: "1.45", color: "var(--h-ink)", opacity: ".88" }}>{intro}</p>
        <Link to={homeLink(number, 'articles')} className="press btn" style={{ "--c": "var(--h-door1)", display: "inline-flex", alignItems: "center", minHeight: "44px", marginTop: web ? "24px" : "18px", padding: web ? "0 22px" : "0 16px", background: "var(--h-accent)", color: "var(--ink)", border: "2px solid var(--h-paper)", boxShadow: "4px 4px 0 var(--h-door1)", fontFamily: FONT.mono, fontWeight: "700", fontSize: web ? "12px" : "11px", letterSpacing: "1.4px", textTransform: "uppercase", textDecoration: "none" }}>open the doors ↓</Link>
      </div>
    </section>
  );
}
