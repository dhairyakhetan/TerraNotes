import { useState } from 'react';
import { Link } from '../../../router.jsx';
import { cardCover, TagPill } from '../../../shared/ArticleCard.jsx';
import { ByTape } from '../../../shared/Tapes.jsx';
import { articleLink } from '../../../data/editions.js';
import { flight } from '../../../lib/cardFlight.js';
import { FONT } from '../../../styles/fonts.js';
import { Postmark, Seal } from './parts.jsx';

// February's twist on the articles (home.jsx): your post. Every article is a sealed envelope, addressed "Dear reader"
// with its title, its cover as the stamp, postmarked with its number. Tapping one breaks the seal, lifts the flap and
// slides the letter out (transform / opacity only): its tag, title, dek and "read the letter →" (the link). Opened
// envelopes stay open; a sealed letter can't be tabbed into (inert). Web: three a row; phones: one. The space above
// each envelope is where its letter rises to (a "tap to open" note waits there while it's sealed); a sealed letter is
// hidden, so its words don't show through the gaps.
const SIZE = { web: { w: 350, h: 230, rise: 196 }, phone: { w: 330, h: 210, rise: 176 } };
const TILT = [-2, 1.5, -1, 2, -1.5, 1, -2.2];

function Envelope({ web, a, i, open, onOpen, mine }) {
  const S = SIZE[web ? 'web' : 'phone'], no = String(i + 1).padStart(2, '0');
  return (
    <div className={`fb-env${open ? ' is-open' : ''}`} style={{ position: "relative", width: `${S.w}px`, height: `${S.h + S.rise}px`, margin: "0 auto", "--rise": `${S.rise}px`, transform: `rotate(${TILT[i % TILT.length]}deg)` }}>
      <div aria-hidden="true" className="fb-tap" style={{ position: "absolute", left: "0", right: "0", bottom: `${S.h + 14}px`, textAlign: "center", fontFamily: FONT.hand, fontSize: web ? "24px" : "22px", color: "var(--h-accent)", pointerEvents: "none" }}>{a.featured ? '★ open me first ↓' : 'tap to open ↓'}</div>
      <div style={{ position: "absolute", left: "0", right: "0", bottom: "0", height: `${S.h}px`, perspective: "900px" }}>
        <div style={{ position: "absolute", inset: "0", background: "var(--h-flap)", border: "2px solid var(--h-ink)", boxShadow: "6px 6px 0 color-mix(in srgb, var(--h-ink) 75%, transparent)" }} />
        <div className="fb-letter" inert={!open} style={{ position: "absolute", left: "5%", right: "5%", top: "8px", height: `${S.h - 14}px`, boxSizing: "border-box", padding: web ? "16px 18px 12px" : "14px 16px 10px", display: "flex", flexDirection: "column", background: "var(--h-paper)", border: "1.5px solid var(--h-ink)", backgroundImage: "repeating-linear-gradient(transparent 0 27px, color-mix(in srgb, var(--h-aside) 18%, transparent) 27px 28px)", color: "var(--ink)" }}>
          {mine && <div style={{ position: "absolute", right: "8px", top: "-12px" }}><ByTape name={a.author} /></div>}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><span style={{ fontFamily: FONT.mono, fontSize: "10px", letterSpacing: "1.4px", color: "var(--h-accent)" }}>{`NO. ${no}`}</span><TagPill a={a} size="9px" pad="2px 7px" lh="1.3" fit />{a.featured && <span style={{ color: "var(--h-accent)", fontSize: "12px" }}>★</span>}</div>
          <div style={{ marginTop: "8px", fontFamily: FONT.head, fontSize: web ? "25px" : "24px", lineHeight: "1.05", color: "var(--h-ink)", textWrap: "balance" }}>{a.title}</div>
          <div style={{ marginTop: "6px", fontFamily: FONT.hand, fontSize: web ? "19px" : "18px", lineHeight: "1.1", color: "var(--hand)", textWrap: "pretty" }}>{a.dek}</div>
          <Link to={articleLink(a)} {...flight(a)} className="fb-read" style={{ marginTop: "auto", alignSelf: "flex-start", display: "inline-flex", alignItems: "center", minHeight: "40px", fontFamily: FONT.mono, fontWeight: "700", fontSize: "11px", letterSpacing: "1.2px", textTransform: "uppercase", color: "var(--h-ink)", textDecoration: "none", borderBottom: "2px solid var(--h-seal)" }}>{`read the letter · ${a.readTime} min →`}</Link>
        </div>
        <button type="button" onClick={onOpen} aria-expanded={open} aria-label={open ? `Letter ${no}, open: ${a.title}` : `Open letter ${no}: ${a.title}`} tabIndex={open ? -1 : 0} className="fb-pocket-btn" style={{ position: "absolute", inset: "0", padding: "0", border: "0", background: "transparent", cursor: "pointer", font: "inherit", pointerEvents: open ? "none" : "auto" }}>
          <span aria-hidden="true" style={{ position: "absolute", inset: "0", background: "var(--h-envelope)", clipPath: "polygon(0 22%, 50% 60%, 100% 22%, 100% 100%, 0 100%)", borderBottom: "2px solid var(--h-ink)" }} />
          <svg aria-hidden="true" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: "0" }}><path d="M0 22 L50 60 L100 22" fill="none" stroke="var(--h-ink)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" /><path d="M0 100 L38 68 M100 100 L62 68" fill="none" stroke="var(--h-ink)" strokeOpacity=".35" strokeWidth="1.5" vectorEffect="non-scaling-stroke" /></svg>
          <span aria-hidden="true" style={{ position: "absolute", left: web ? "20px" : "18px", right: web ? "100px" : "96px", bottom: web ? "16px" : "14px", textAlign: "left", color: "var(--h-ink)" }}>
            <span style={{ display: "block", fontFamily: FONT.script, fontSize: web ? "12px" : "11.5px", lineHeight: "1.6", color: "var(--h-aside)" }}>Dear reader,</span>
            <span style={{ display: "block", marginTop: "2px", fontFamily: FONT.head, fontSize: web ? "19px" : "18px", lineHeight: "1.1", textWrap: "balance" }}>{a.title}</span>
          </span>
          <span aria-hidden="true" style={{ position: "absolute", right: web ? "16px" : "14px", bottom: web ? "16px" : "14px", width: web ? "62px" : "58px", height: web ? "78px" : "72px", boxSizing: "border-box", background: `var(--h-stamp${(i % 3) + 1})`, border: "4px dotted var(--h-envelope)", outline: "1px solid color-mix(in srgb, var(--h-ink) 40%, transparent)", overflow: "hidden" }}>
            {a.cover && <img src={cardCover(a.cover)} alt="" loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />}
          </span>
          <Postmark size={web ? 44 : 42} no={no} style={{ position: "absolute", right: web ? "40px" : "36px", bottom: web ? "64px" : "60px", pointerEvents: "none" }} />
        </button>
        <div className="fb-flap" aria-hidden="true" style={{ position: "absolute", left: "0", right: "0", top: "0", height: "62%", transformOrigin: "50% 0", pointerEvents: "none" }}>
          <div style={{ position: "absolute", inset: "0", background: "var(--h-flap)", clipPath: "polygon(0 0, 100% 0, 50% 100%)", filter: "drop-shadow(0 2px 0 var(--h-ink))" }} />
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: "0" }}><path d="M0 0 L50 100 L100 0" fill="none" stroke="var(--h-ink)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" /></svg>
          <span className="fb-seal" style={{ position: "absolute", left: "50%", top: "100%", translate: "-50% -60%" }}><Seal size={web ? 46 : 44} text={no} /></span>
        </div>
      </div>
    </div>
  );
}

export default function Envelopes({ web, list, isMine }) {
  const [open, setOpen] = useState(() => new Set());
  return (
    <div>
      <div style={{ marginBottom: web ? "10px" : "6px", fontFamily: FONT.script, fontSize: web ? "20px" : "15px", lineHeight: "1.8", color: "var(--h-aside)", textAlign: "center" }}>{`you’ve got ${list.length} letters`}</div>
      <div style={{ display: "grid", gridTemplateColumns: web ? "repeat(3, 1fr)" : "1fr", rowGap: web ? "10px" : "0", columnGap: "40px" }}>
        {list.map((a, i) => <Envelope key={a.slug} web={web} a={a} i={i} mine={isMine(a)} open={open.has(a.slug)} onOpen={() => setOpen((s) => new Set(s).add(a.slug))} />)}
      </div>
    </div>
  );
}
