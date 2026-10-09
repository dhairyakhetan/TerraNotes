import { useState } from 'react';
import { Link } from '../../../router.jsx';
import { cardCover, TagPill } from '../../../shared/ArticleCard.jsx';
import { ByTape } from '../../../shared/Tapes.jsx';
import { articleLink } from '../../../data/editions.js';
import { flight } from '../../../lib/cardFlight.js';
import { FONT } from '../../../styles/fonts.js';

// January's twist on the articles (home.jsx): a stall at the Book Fair. Under a striped awning and the stall's sign,
// every article is a book standing on a wooden shelf, its title down the spine. Tapping a spine pulls that book up and
// opens it on the counter below: the cover on the left page, and on the right its tag, title, dek, its first lines and
// a yellow price tag that says how long it takes to read, with "read it →" (the link). The first book starts open.
// Both layouts: the same shelf (web: plain books either side fill it out), the spines narrower on phones, the open
// book one page above the other there.
const SPINE = { web: { w: [92, 80, 100, 86, 96, 84, 90], h: [330, 300, 350, 310, 340, 296, 320] }, phone: { w: [54, 48, 58, 50, 56, 48, 52], h: [210, 190, 224, 196, 216, 188, 204] } };
// web: plain books either side of the articles, so the shelf looks full ([colour, width, height]; not buttons)
const FILL = { left: [[6, 40, 250], [2, 30, 280], [4, 46, 230], [7, 34, 300], [3, 52, 260], [1, 28, 240], [5, 40, 290]], right: [[3, 36, 270], [5, 48, 240], [1, 30, 300], [6, 44, 260], [2, 34, 230], [4, 50, 280], [7, 38, 250]] };
const Filler = ({ books }) => books.map(([c, w, h], i) => <span key={i} aria-hidden="true" style={{ width: `${w}px`, height: `${h}px`, flexShrink: "0", background: `var(--h-book${c})`, border: "2px solid var(--h-ink)", borderBottom: "0", borderRadius: "3px 3px 0 0", opacity: ".45" }} />);
const opening = (a) => { const t = (a.body || []).find((b) => typeof b === 'string') || ''; return t.length > 210 ? `${t.slice(0, 210).replace(/\s+\S*$/, '')}…` : t; };

function OpenBook({ web, a, i, mine }) {
  return (
    <div className="jn-open" aria-live="polite" style={{ position: "relative", display: "grid", gridTemplateColumns: web ? "1fr 1fr" : "1fr", marginTop: web ? "54px" : "30px", background: "var(--h-paper)", border: "2px solid var(--h-ink)", boxShadow: `${web ? 10 : 6}px ${web ? 10 : 6}px 0 var(--h-ink)`, perspective: "1600px" }}>
      <div className="jn-page-l" style={{ position: "relative", height: web ? "460px" : "250px", borderRight: web ? "2px solid var(--h-ink)" : "none", borderBottom: web ? "none" : "2px solid var(--h-ink)", background: `var(--h-book${(i % 7) + 1})`, padding: web ? "28px" : "16px", boxSizing: "border-box", transformOrigin: web ? "100% 50%" : "50% 100%" }}>
        {a.cover && <img src={cardCover(a.cover)} alt={a.alt || ''} loading="lazy" decoding="async" style={{ display: "block", height: "100%", aspectRatio: "3 / 4", maxWidth: "100%", margin: "0 auto", objectFit: "cover", border: "2px solid var(--h-ink)", boxShadow: "6px 6px 0 color-mix(in srgb, var(--h-ink) 45%, transparent)" }} />}
      </div>
      <div className="jn-page-r" style={{ position: "relative", padding: web ? "36px 44px 36px" : "18px 18px 22px", display: "flex", flexDirection: "column", transformOrigin: web ? "0 50%" : "50% 0" }}>
        {mine && <div style={{ position: "absolute", right: "14px", top: "-12px" }}><ByTape name={a.author} /></div>}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontFamily: FONT.mono, fontSize: web ? "12px" : "10px", letterSpacing: "1.5px", color: "var(--h-accent)" }}>{`NO. ${String(i + 1).padStart(2, '0')}`}</span>
          <TagPill a={a} size={web ? "10px" : "9px"} pad="3px 8px" lh="1.3" fit />
          {a.featured && <span style={{ fontFamily: FONT.script, fontSize: web ? "18px" : "15px", color: "var(--h-accent)" }}>★ staff pick</span>}
        </div>
        <h3 style={{ margin: web ? "14px 0 0" : "10px 0 0", fontFamily: FONT.head, fontWeight: "900", fontSize: web ? "44px" : "28px", lineHeight: "1.02", color: "var(--h-ink)", textWrap: "balance" }}>{a.title}</h3>
        <div style={{ marginTop: web ? "8px" : "6px", fontFamily: FONT.hand, fontSize: web ? "25px" : "20px", lineHeight: "1.1", color: "var(--hand)" }}>{a.dek}</div>
        {web && <p style={{ margin: "16px 0 0", fontFamily: FONT.read, fontSize: "17px", lineHeight: "1.55", color: "var(--text)" }}>{opening(a)}</p>}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", marginTop: web ? "auto" : "18px", paddingTop: web ? "18px" : "0" }}>
          <Link to={articleLink(a)} {...flight(a)} className="press btn" style={{ "--c": "var(--h-ink)", display: "inline-flex", alignItems: "center", minHeight: "44px", padding: "0 18px", background: "var(--h-ink)", color: "var(--h-paper)", border: "2px solid var(--h-ink)", boxShadow: "3px 3px 0 var(--h-tag)", fontFamily: FONT.mono, fontWeight: "700", fontSize: web ? "12px" : "11px", letterSpacing: "1.2px", textTransform: "uppercase", textDecoration: "none" }}>read it →</Link>
          <span aria-label={`${a.readTime} minute read`} style={{ position: "relative", padding: web ? "6px 14px 6px 22px" : "4px 10px 4px 18px", background: "var(--h-tag)", color: "var(--h-ink)", fontFamily: FONT.script, fontSize: web ? "24px" : "19px", lineHeight: "1.1", transform: "rotate(4deg)", clipPath: "polygon(12px 0, 100% 0, 100% 100%, 12px 100%, 0 50%)" }}>{`₹ ${a.readTime} min`}</span>
        </div>
      </div>
    </div>
  );
}

export default function Shelf({ web, list, isMine }) {
  const [pick, setPick] = useState(0), S = SPINE[web ? 'web' : 'phone'], a = list[pick] || list[0];
  if (!a) return null;
  return (
    <div>
      <div aria-hidden="true" className="jn-awning" style={{ height: web ? "54px" : "34px" }} />
      <div style={{ position: "relative", background: "var(--h-canvas)", border: "2px solid var(--h-ink)", borderTop: "0", padding: web ? "30px 40px 0" : "16px 12px 0" }}>
        <div style={{ position: "absolute", left: "50%", top: web ? "-10px" : "-6px", translate: "-50% 0", padding: web ? "6px 18px" : "4px 12px", background: "var(--h-ink)", color: "var(--h-canvas)", fontFamily: FONT.mono, fontSize: web ? "12px" : "9.5px", letterSpacing: "2px", whiteSpace: "nowrap" }}>STALL 27 · TERRANOTES &amp; SONS</div>
        <div style={{ margin: web ? "26px 0 14px" : "22px 0 10px", fontFamily: FONT.script, fontSize: web ? "24px" : "18px", color: "var(--h-aside)", textAlign: "center" }}>pick a book off the shelf ↓</div>
        <div role="group" aria-label="The articles, as books" style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: web ? "10px" : "5px", minHeight: `${Math.max(...S.h) + 30}px` }}>
          {web && <><Filler books={FILL.left.slice(0, Math.max(0, 8 - list.length))} /><span style={{ width: "14px" }} /></>}
          {list.map((b, i) => {
            const on = b === a, c = (i % 7) + 1;
            return (
              <button key={b.slug} type="button" className={`jn-spine${on ? ' is-on' : ''}`} aria-pressed={on} aria-label={`Book ${i + 1}: ${b.title}`} onClick={() => setPick(i)} style={{ position: "relative", width: `${S.w[i % 7]}px`, height: `${S.h[i % 7]}px`, padding: "0", background: `var(--h-book${c})`, border: "2px solid var(--h-ink)", borderBottom: "0", borderRadius: "4px 4px 0 0", cursor: "pointer", color: c === 4 ? "var(--h-ink)" : "var(--h-paper)", font: "inherit", flexShrink: "0" }}>
                <span aria-hidden="true" style={{ position: "absolute", left: "0", right: "0", top: web ? "14px" : "8px", height: web ? "8px" : "5px", borderTop: "2px solid currentColor", borderBottom: "2px solid currentColor", opacity: ".55" }} />
                <span aria-hidden="true" style={{ position: "absolute", left: "0", right: "0", bottom: web ? "18px" : "10px", height: web ? "8px" : "5px", borderTop: "2px solid currentColor", borderBottom: "2px solid currentColor", opacity: ".55" }} />
                <span style={{ position: "absolute", left: "50%", top: web ? "34px" : "20px", bottom: web ? "36px" : "22px", translate: "-50% 0", writingMode: "vertical-rl", fontFamily: FONT.head, fontWeight: "900", fontSize: web ? "21px" : "13.5px", lineHeight: "1", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{b.title}</span>
              </button>
            );
          })}
          {web && <><span style={{ width: "14px" }} /><Filler books={FILL.right.slice(0, Math.max(0, 8 - list.length))} /></>}
        </div>
        <div aria-hidden="true" style={{ height: web ? "26px" : "16px", margin: web ? "0 -40px" : "0 -12px", background: "linear-gradient(var(--h-woodTop), var(--h-wood))", borderTop: "2px solid var(--h-ink)" }} />
      </div>
      <OpenBook key={a.slug} web={web} a={a} i={pick} mine={isMine(a)} />
    </div>
  );
}
