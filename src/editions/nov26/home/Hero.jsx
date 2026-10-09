import { Link } from '../../../router.jsx';
import { homeLink } from '../../../data/editions.js';
import { useEdition } from '../../../lib/edition.js';
import { FONT } from '../../../styles/fonts.js';
import { Diya, SkyLantern } from './parts.jsx';

// November's top (home.jsx): the night sky over the city. Stars, three fireworks opening and fading in turn, a rope of
// small sky lanterns swaying across the top, "Lights" glowing in the middle with the month's festivals under it, and a
// row of diyas flickering along the bottom. "Light the lanterns ↓" goes to the articles (/articles).
const L = {
  web: { h: 760, title: "230px", script: "34px", intro: "21px", kicker: "13px", lanterns: 9, diyas: 13, diya: 46 },
  phone: { h: 620, title: "104px", script: "21px", intro: "16px", kicker: "9.5px", lanterns: 5, diyas: 7, diya: 36 },
};
const BURSTS = { web: [[230, 150, 120, 1], [1190, 120, 150, 3], [960, 330, 90, 4]], phone: [[70, 140, 70, 1], [320, 110, 80, 3]] };

function Burst({ x, y, r, c }) {
  const rays = Array.from({ length: 16 }, (_, i) => (i * Math.PI) / 8);
  return (
    <svg aria-hidden="true" className="nv-burst-loop" width={r * 2} height={r * 2} viewBox="-50 -50 100 100" style={{ position: "absolute", left: `${x - r}px`, top: `${y - r}px`, "--d": `${c * 0.9}s`, overflow: "visible" }}>
      {rays.map((a, i) => <line key={i} x1={Math.cos(a) * 14} y1={Math.sin(a) * 14} x2={Math.cos(a) * 46} y2={Math.sin(a) * 46} stroke={`var(--h-lantern${(i % 5) + 1})`} strokeWidth="3" strokeLinecap="round" />)}
      {rays.map((a, i) => <circle key={`d${i}`} cx={Math.cos(a + 0.2) * 34} cy={Math.sin(a + 0.2) * 34} r="2.2" fill="var(--h-star)" />)}
    </svg>
  );
}

export default function Hero({ web }) {
  const S = L[web ? 'web' : 'phone'], { number, month, intro } = useEdition(), W = web ? 1440 : 390;
  const n = S.lanterns, sag = web ? 70 : 34, y0 = web ? 26 : 18;
  const ropeY = (x) => y0 + sag * 4 * (x / W) * (1 - x / W);
  return (
    <section aria-label="Lights, the November issue" className="nv-hero" style={{ position: "relative", height: `${S.h}px`, overflow: "hidden", background: "linear-gradient(180deg, var(--h-page) 0%, var(--h-sky) 78%, var(--h-page) 100%)" }}>
      <div aria-hidden="true" className="nv-stars nv-twinkle-loop" style={{ position: "absolute", inset: "0" }} />
      {BURSTS[web ? 'web' : 'phone'].map(([x, y, r, c]) => <Burst key={x} x={x} y={y} r={r} c={c} />)}
      <svg aria-hidden="true" width={W} height={web ? 140 : 80} style={{ position: "absolute", left: "0", top: "0" }}>
        <path d={`M0 ${y0} Q${W / 2} ${y0 + sag * 2} ${W} ${y0}`} fill="none" stroke="var(--h-accent)" strokeOpacity=".5" strokeWidth="1.5" />
      </svg>
      {Array.from({ length: n }, (_, i) => {
        const x = ((i + 0.5) * W) / n;
        return <SkyLantern key={i} x={x} y={ropeY(x)} s={web ? 1 : 0.7} c={(i % 5) + 1} drop={web ? 18 + (i % 3) * 16 : 10 + (i % 2) * 10} delay={i * 0.37} />;
      })}
      <div style={{ position: "absolute", left: "0", right: "0", top: web ? "190px" : "150px", textAlign: "center", padding: web ? "0" : "0 20px" }}>
        <div style={{ fontFamily: FONT.mono, fontSize: S.kicker, letterSpacing: web ? "3px" : "1.8px", color: "var(--h-accent)" }}>{`TERRANOTES · EDITION ${String(number).padStart(2, '0')} · ${month.toUpperCase()}`}</div>
        <h1 className="nv-glow" style={{ margin: web ? "6px 0 0" : "8px 0 0", fontFamily: FONT.head, fontWeight: "800", fontSize: S.title, lineHeight: "0.9", letterSpacing: web ? "-4px" : "-2px", color: "var(--h-ink)" }}>Lights</h1>
        <div style={{ marginTop: web ? "14px" : "12px", fontFamily: FONT.script, fontSize: S.script, lineHeight: "1.2", color: "var(--h-aside)" }}>{web ? 'Kali Puja · Diwali · Bhai Phonta · Children’s Day' : <>Kali Puja · Diwali<br />Bhai Phonta · Children’s Day</>}</div>
        <p style={{ margin: web ? "18px auto 0" : "14px auto 0", maxWidth: web ? "560px" : "300px", fontFamily: FONT.read, fontSize: S.intro, lineHeight: "1.45", color: "var(--h-ink)", opacity: ".88" }}>{intro}</p>
        <Link to={homeLink(number, 'articles')} className="press btn" style={{ "--c": "var(--h-flame)", display: "inline-flex", alignItems: "center", minHeight: "44px", marginTop: web ? "26px" : "20px", padding: web ? "0 22px" : "0 16px", background: "var(--h-accent)", color: "var(--ink)", border: "2px solid var(--h-paper)", boxShadow: "4px 4px 0 var(--h-flame)", fontFamily: FONT.mono, fontWeight: "700", fontSize: web ? "12px" : "11px", letterSpacing: "1.4px", textTransform: "uppercase", textDecoration: "none" }}>light the lanterns ↓</Link>
      </div>
      <div aria-hidden="true" style={{ position: "absolute", left: "0", right: "0", bottom: web ? "26px" : "18px", display: "flex", justifyContent: "space-evenly", alignItems: "flex-end" }}>
        {Array.from({ length: S.diyas }, (_, i) => <Diya key={i} size={S.diya} delay={i * 0.23} />)}
      </div>
    </section>
  );
}
