import { Link } from '../../../router.jsx';
import { homeLink } from '../../../data/editions.js';
import { useEdition } from '../../../lib/edition.js';
import { FONT } from '../../../styles/fonts.js';
import { Bunting, Stack } from './parts.jsx';

// January's top (home.jsx): the gate of the Book Fair. Bunting strung across, stacks of books on either side (web) or
// along the bottom (phones), "Boi Mela" in the heavy book-jacket serif, the month's line in a felt-pen hand, the issue's
// line, and "browse the stall ↓" to the shelf of articles (/articles).
const L = {
  web: { h: 700, title: "190px", script: "32px", intro: "21px", kicker: "13px" },
  phone: { h: 640, title: "84px", script: "23px", intro: "16px", kicker: "9.5px" },
};
const LEFT = [[1, 1], [3, 0.85], [6, 0.95], [4, 0.8], [2, 1.05], [5, 0.9], [7, 0.85]];
const RIGHT = [[2, 0.95], [5, 1.05], [1, 0.85], [7, 0.9], [3, 1], [4, 0.8]];

export default function Hero({ web }) {
  const S = L[web ? 'web' : 'phone'], { number, month, intro } = useEdition(), W = web ? 1440 : 390;
  return (
    <section aria-label="Boi Mela, the January issue" className="jn-hero" style={{ position: "relative", height: `${S.h}px`, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: "0", top: "14px" }}><Bunting w={W} n={web ? 30 : 10} sag={web ? 40 : 20} size={web ? 38 : 28} y0={4} /></div>
      <div style={{ position: "absolute", left: "0", top: web ? "70px" : "54px" }}><Bunting w={W} n={web ? 26 : 9} sag={web ? 30 : 16} size={web ? 30 : 22} y0={4} /></div>
      {web && <Stack books={LEFT} w={180} h={30} style={{ position: "absolute", left: "110px", bottom: "60px", flexDirection: "column-reverse" }} />}
      {web && <Stack books={RIGHT} w={170} h={34} style={{ position: "absolute", right: "120px", bottom: "60px", flexDirection: "column-reverse" }} />}
      {!web && <div aria-hidden="true" style={{ position: "absolute", left: "0", right: "0", bottom: "22px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", padding: "0 20px" }}>
        <Stack books={LEFT.slice(0, 4)} w={90} h={18} style={{ flexDirection: "column-reverse" }} />
        <Stack books={RIGHT.slice(0, 3)} w={84} h={20} style={{ flexDirection: "column-reverse" }} />
      </div>}
      <div style={{ position: "absolute", left: "0", right: "0", top: web ? "190px" : "170px", textAlign: "center", padding: web ? "0" : "0 18px" }}>
        <div style={{ fontFamily: FONT.mono, fontSize: S.kicker, letterSpacing: web ? "3px" : "1.8px", color: "var(--h-accent)" }}>{`TERRANOTES · EDITION ${String(number).padStart(2, '0')} · ${month.toUpperCase()}`}</div>
        <h1 style={{ margin: web ? "6px 0 0" : "8px 0 0", fontFamily: FONT.head, fontWeight: "900", fontSize: S.title, lineHeight: "0.95", letterSpacing: web ? "-3px" : "-1px", color: "var(--h-ink)" }}>Boi Mela</h1>
        <div style={{ display: "inline-block", marginTop: web ? "14px" : "12px", padding: web ? "4px 16px" : "3px 12px", background: "var(--h-tag)", border: "2px solid var(--h-ink)", transform: "rotate(-2deg)", fontFamily: FONT.script, fontSize: S.script, lineHeight: "1.15", color: "var(--h-ink)" }}>the book fair · Republic Day · winter</div>
        <p style={{ margin: web ? "20px auto 0" : "16px auto 0", maxWidth: web ? "540px" : "300px", fontFamily: FONT.read, fontSize: S.intro, lineHeight: "1.45", color: "var(--h-ink)" }}>{intro}</p>
        <Link to={homeLink(number, 'articles')} className="press btn" style={{ "--c": "var(--h-ink)", display: "inline-flex", alignItems: "center", minHeight: "44px", marginTop: web ? "24px" : "18px", padding: web ? "0 22px" : "0 16px", background: "var(--h-awning)", color: "var(--h-canvas)", border: "2px solid var(--h-ink)", boxShadow: "4px 4px 0 var(--h-ink)", fontFamily: FONT.mono, fontWeight: "700", fontSize: web ? "12px" : "11px", letterSpacing: "1.4px", textTransform: "uppercase", textDecoration: "none" }}>browse the stall ↓</Link>
      </div>
    </section>
  );
}
