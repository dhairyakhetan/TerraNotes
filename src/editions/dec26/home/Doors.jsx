import { useState } from 'react';
import { Link } from '../../../router.jsx';
import { cardCover, TagPill } from '../../../shared/ArticleCard.jsx';
import { ByTape } from '../../../shared/Tapes.jsx';
import { articleLink } from '../../../data/editions.js';
import { flight } from '../../../lib/cardFlight.js';
import { FONT } from '../../../styles/fonts.js';
import { FairyLights, Star } from './parts.jsx';

// December's twist on the articles (home.jsx): an advent calendar on a pine board, one door per article, each with a
// December date on it. Tapping a door swings it open on its hinge (a 3D turn, transform only) to show the article
// behind: its cover, tag, title and dek, and "read it →" (the link). Open doors stay open; "open every door" opens the
// rest. Behind a closed door the article can't be tabbed to (inert). Web: three a row; phones: two. Dates: DAYS, in
// order (more articles than dates: the last ones count on).
const DAYS = [3, 9, 14, 19, 24, 25, 31];

function Door({ web, a, i, open, onOpen, mine, h }) {
  const day = DAYS[i] ?? DAYS[DAYS.length - 1] + i - DAYS.length + 1, c = (i % 7) + 1;
  return (
    <div className={`dc-cell${open ? ' is-open' : ''}`} style={{ position: "relative", height: `${h}px`, perspective: "1200px" }}>
      <div inert={!open} style={{ position: "absolute", inset: "0", display: "flex", flexDirection: "column", background: "var(--h-paper)", border: "2px solid var(--h-accent)", boxShadow: "inset 0 0 0 4px var(--h-board)", overflow: "hidden" }}>
        {mine && <div style={{ position: "absolute", right: "8px", top: "8px", zIndex: "1" }}><ByTape name={a.author} /></div>}
        <div style={{ position: "relative", flex: `0 0 ${web ? 52 : 44}%`, background: "var(--h-sky)" }}>
          {a.cover && <img src={cardCover(a.cover)} alt="" loading="lazy" decoding="async" style={{ position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 30%" }} />}
        </div>
        <div style={{ flexGrow: "1", minHeight: "0", display: "flex", flexDirection: "column", padding: web ? "14px 16px 14px" : "8px 9px 9px", color: "var(--ink)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}><TagPill a={a} size={web ? "9.5px" : "8px"} pad="2px 7px" lh="1.3" fit />{a.featured && <span style={{ color: "var(--hand)", fontSize: "12px" }}>★</span>}</div>
          <div style={{ marginTop: web ? "8px" : "6px", fontFamily: FONT.head, fontSize: web ? "24px" : "15.5px", lineHeight: "1.08", textWrap: "balance" }}>{a.title}</div>
          {web && <div style={{ marginTop: "6px", fontFamily: FONT.hand, fontSize: "19px", lineHeight: "1.1", color: "var(--hand)", textWrap: "pretty" }}>{a.dek}</div>}
          <Link to={articleLink(a)} {...flight(a)} className="dc-read" style={{ marginTop: "auto", alignSelf: "flex-start", display: "inline-flex", alignItems: "center", minHeight: "40px", fontFamily: FONT.mono, fontWeight: "700", fontSize: web ? "11px" : "10px", letterSpacing: "1.2px", textTransform: "uppercase", color: "var(--ink)", textDecoration: "none", borderBottom: "2px solid var(--hand)" }}>{`read it · ${a.readTime} min →`}</Link>
        </div>
      </div>
      <button type="button" className="dc-door" onClick={onOpen} aria-expanded={open} aria-label={open ? `Door ${day}, open: ${a.title}` : `Open door ${day}`} tabIndex={open ? -1 : 0} style={{ position: "absolute", inset: "0", padding: "0", border: "2px solid var(--h-accent)", background: `var(--h-door${c})`, color: "var(--h-paper)", cursor: "pointer", transformOrigin: "0 50%", font: "inherit", backfaceVisibility: "hidden", pointerEvents: open ? "none" : "auto" }}>
        <span aria-hidden="true" style={{ position: "absolute", inset: web ? "12px" : "8px", border: "1.5px dashed var(--h-paper)", opacity: ".45" }} />
        <span aria-hidden="true" style={{ position: "absolute", left: web ? "22px" : "14px", top: web ? "18px" : "12px", fontFamily: FONT.mono, fontSize: web ? "11px" : "9px", letterSpacing: "2px" }}>DEC</span>
        <span aria-hidden="true" style={{ position: "absolute", left: "0", right: "0", top: "50%", translate: "0 -58%", fontFamily: FONT.head, fontSize: web ? "120px" : "70px", lineHeight: "1", textAlign: "center" }}>{day}</span>
        <Star size={web ? 30 : 20} color="var(--h-accent)" style={{ position: "absolute", right: web ? "20px" : "12px", top: web ? "16px" : "10px" }} />
        <span aria-hidden="true" style={{ position: "absolute", right: web ? "18px" : "6px", top: "50%", width: web ? "10px" : "6px", height: web ? "34px" : "22px", translate: "0 -50%", borderRadius: "6px", background: "var(--h-accent)" }} />
        <span aria-hidden="true" className="dc-knock-loop" style={{ position: "absolute", left: "0", right: "0", bottom: web ? "20px" : "12px", textAlign: "center", fontFamily: FONT.script, fontSize: web ? "24px" : "17px", "--d": `${i * 0.5}s` }}>tap to open</span>
      </button>
    </div>
  );
}

export default function Doors({ web, list, isMine }) {
  const [open, setOpen] = useState(() => new Set());
  const cols = web ? 3 : 2, h = web ? 470 : 300, all = open.size >= list.length;
  return (
    <div style={{ position: "relative", padding: web ? "26px 34px 34px" : "16px 12px 18px", background: "var(--h-board)", border: "3px solid var(--h-accent)", boxShadow: `${web ? 12 : 7}px ${web ? 12 : 7}px 0 var(--h-door1)` }}>
      <div style={{ position: "absolute", left: "0", right: "0", top: web ? "-20px" : "-12px", overflow: "visible" }}><FairyLights w={web ? 1200 : 350} h={40} sag={web ? 24 : 12} n={web ? 30 : 10} r={web ? 5 : 4} /></div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", margin: web ? "18px 0 24px" : "14px 0 16px", color: "var(--h-paper)" }}>
        <div style={{ fontFamily: FONT.mono, fontSize: web ? "12px" : "9.5px", letterSpacing: "2px" }}>{web ? 'THE PARK STREET ADVENT CALENDAR · 2026' : 'ADVENT · 2026'}</div>
        <button type="button" className="press btn" disabled={all} onClick={() => setOpen(new Set(list.map((a) => a.slug)))} style={{ "--c": "var(--h-door1)", minHeight: "44px", padding: web ? "0 16px" : "0 12px", background: all ? "transparent" : "var(--h-accent)", color: all ? "var(--h-paper)" : "var(--ink)", border: "2px solid var(--h-paper)", boxShadow: all ? "none" : "3px 3px 0 var(--h-door1)", fontFamily: FONT.mono, fontWeight: "700", fontSize: web ? "11px" : "10px", letterSpacing: "1px", textTransform: "uppercase", cursor: all ? "default" : "pointer", opacity: all ? ".6" : "1" }}>{all ? 'all open' : 'open every door'}</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: web ? "26px" : "12px" }}>
        {list.map((a, i) => <Door key={a.slug} web={web} a={a} i={i} h={h} open={open.has(a.slug)} mine={isMine(a)} onOpen={() => setOpen((s) => new Set(s).add(a.slug))} />)}
      </div>
    </div>
  );
}
