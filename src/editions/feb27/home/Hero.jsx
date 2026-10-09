import { Link } from '../../../router.jsx';
import { homeLink } from '../../../data/editions.js';
import { useEdition } from '../../../lib/edition.js';
import { FONT } from '../../../styles/fonts.js';
import { Palash, Postmark, Seal } from './parts.jsx';

// February's top (home.jsx): a page of Saraswati Puja yellow between two airmail-striped bands. "Letters" in the
// letter-heading serif, "with love, from February" in a looping pen hand, the issue's line and "open your post ↓" (to
// the envelopes, /articles); beside it (phones: under it) a big sealed envelope with stamps and a postmark, a letter
// peeking out; palash flowers drifting down.
const L = {
  web: { h: 720, title: "200px", script: "30px", intro: "21px", kicker: "13px" },
  phone: { h: 760, title: "92px", script: "19px", intro: "16px", kicker: "9.5px" },
};
const FLOWERS = { web: [[90, 140, 40], [640, 110, 30], [1340, 180, 46], [1200, 600, 34], [520, 600, 28]], phone: [[30, 110, 28], [350, 150, 32], [40, 700, 26]] };

export default function Hero({ web }) {
  const S = L[web ? 'web' : 'phone'], { number, month, intro } = useEdition();
  const env = web ? { w: 460, h: 300 } : { w: 300, h: 196 };
  return (
    <section aria-label="Letters, the February issue" className="fb-hero" style={{ position: "relative", height: `${S.h}px`, overflow: "hidden" }}>
      <div aria-hidden="true" className="fb-air" style={{ position: "absolute", left: "0", right: "0", top: "0", height: web ? "18px" : "12px" }} />
      {FLOWERS[web ? 'web' : 'phone'].map(([x, y, s], i) => <Palash key={i} size={s} className="fb-fall-loop" style={{ position: "absolute", left: `${x}px`, top: `${y}px`, "--d": `${i * 1.7}s` }} />)}
      <div style={{ position: "absolute", left: web ? "120px" : "0", right: web ? "auto" : "0", top: web ? "150px" : "70px", width: web ? "640px" : "auto", textAlign: web ? "left" : "center", padding: web ? "0" : "0 18px" }}>
        <div style={{ fontFamily: FONT.mono, fontSize: S.kicker, letterSpacing: web ? "3px" : "1.8px", color: "var(--h-accent)" }}>{`TERRANOTES · EDITION ${String(number).padStart(2, '0')} · ${month.toUpperCase()}`}</div>
        <h1 style={{ margin: web ? "4px 0 0" : "6px 0 0", fontFamily: FONT.head, fontWeight: "400", fontSize: S.title, lineHeight: "0.95", letterSpacing: web ? "-3px" : "-1px", color: "var(--h-ink)" }}>Letters</h1>
        <div style={{ marginTop: web ? "10px" : "8px", fontFamily: FONT.script, fontSize: S.script, lineHeight: "1.6", color: "var(--h-aside)", transform: "rotate(-2deg)" }}>with love, from February</div>
        <p style={{ margin: web ? "20px 0 0" : "14px auto 0", maxWidth: web ? "520px" : "320px", fontFamily: FONT.read, fontSize: S.intro, lineHeight: "1.45", color: "var(--h-ink)" }}>{intro}</p>
        <Link to={homeLink(number, 'articles')} className="press btn" style={{ "--c": "var(--h-ink)", display: "inline-flex", alignItems: "center", minHeight: "44px", marginTop: web ? "26px" : "18px", padding: web ? "0 22px" : "0 16px", background: "var(--h-seal)", color: "var(--h-paper)", border: "2px solid var(--h-ink)", boxShadow: "4px 4px 0 var(--h-ink)", fontFamily: FONT.mono, fontWeight: "700", fontSize: web ? "12px" : "11px", letterSpacing: "1.4px", textTransform: "uppercase", textDecoration: "none" }}>open your post ↓</Link>
      </div>
      <div aria-hidden="true" style={{ position: "absolute", left: web ? "820px" : "45px", top: web ? "200px" : "480px", width: `${env.w}px`, height: `${env.h}px`, transform: "rotate(-4deg)" }}>
        <div className="fb-peek-loop" style={{ position: "absolute", left: "8%", right: "8%", top: web ? "-70px" : "-46px", height: "80%", background: "var(--h-paper)", border: "2px solid var(--h-ink)", padding: web ? "18px 22px" : "10px 14px", boxSizing: "border-box", fontFamily: FONT.script, fontSize: web ? "18px" : "12px", color: "var(--h-aside)" }}>Dear reader,</div>
        <div style={{ position: "absolute", inset: "0", background: "var(--h-pocket)", border: "2px solid var(--h-ink)", clipPath: "polygon(0 0, 50% 52%, 100% 0, 100% 100%, 0 100%)", boxShadow: "inset 0 -10px 0 color-mix(in srgb, var(--h-ink) 8%, transparent)" }} />
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: "0", overflow: "visible" }}><path d="M0 0 L50 52 L100 0" fill="none" stroke="var(--h-ink)" strokeWidth="2" vectorEffect="non-scaling-stroke" /><rect x="0" y="0" width="100" height="100" fill="none" stroke="var(--h-ink)" strokeWidth="2" vectorEffect="non-scaling-stroke" /></svg>
        <div style={{ position: "absolute", left: web ? "40px" : "24px", bottom: web ? "40px" : "24px", fontFamily: FONT.script, fontSize: web ? "20px" : "13px", lineHeight: "1.7", color: "var(--h-ink)" }}>To: you,<br />somewhere in Kolkata</div>
        <div style={{ position: "absolute", right: web ? "26px" : "16px", bottom: web ? "30px" : "20px", width: web ? "70px" : "44px", height: web ? "86px" : "54px", background: "var(--h-stamp1)", border: `${web ? 5 : 3}px dotted var(--h-paper)`, display: "flex", alignItems: "center", justifyContent: "center" }}><Palash size={web ? 46 : 30} /></div>
        <Postmark size={web ? 70 : 44} no={String(number).padStart(2, '0')} style={{ position: "absolute", right: web ? "50px" : "30px", bottom: web ? "90px" : "56px" }} />
        <div style={{ position: "absolute", left: "50%", top: "46%", translate: "-50% -50%" }}><Seal size={web ? 64 : 42} /></div>
      </div>
      <div aria-hidden="true" className="fb-air" style={{ position: "absolute", left: "0", right: "0", bottom: "0", height: web ? "18px" : "12px" }} />
    </section>
  );
}
