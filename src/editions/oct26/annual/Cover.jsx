import { Link } from '../../../router.jsx';
import ImageSlot from '../../../shared/ImageSlot.jsx';
import { coverSet } from '../../../shared/ArticleCard.jsx';
import { articleLink } from '../../../data/editions.js';
import { flight } from '../../../lib/cardFlight.js';
import { useEdition } from '../../../lib/edition.js';
import { FONT } from '../../../styles/fonts.js';
import { p2 } from './parts.jsx';

// The annual's front cover (AnnualHome.jsx): a hardback in alta red with a marigold double frame and a dark spine,
// "TERRANOTES" across the top, "the Pujo issue", the cover lines (the issue's first few stories, each a link), and the
// lead story's cover in an arched window on the right (a link too). A round marigold sticker says what it costs.
// Bengali year 1433 = 2026's autumn.
const C = {
  web: { w: 1140, h: 780, spine: 34, pad: 50, mast: "150px", issue: "13px", line: "30px", art: [420, 450], sticker: 132 },
  phone: { w: 350, h: 610, spine: 16, pad: 20, mast: "50px", issue: "9px", line: "19px", art: [300, 250], sticker: 76 },
};

export default function Cover({ web, lead, lines }) {
  const L = C[web ? 'web' : 'phone'], { number, month } = useEdition();
  const frame = { position: "absolute", pointerEvents: "none" };
  const Art = lead && (
    <Link to={articleLink(lead)} {...flight(lead)} aria-label={`Cover story: ${lead.title}`} className="press btn" style={{ "--c": "var(--ink)", display: "block", width: `${L.art[0]}px`, height: `${L.art[1]}px`, boxSizing: "border-box", border: `${web ? 7 : 5}px solid var(--yellow)`, borderRadius: `${L.art[0] / 2}px ${L.art[0] / 2}px 0 0`, overflow: "hidden", boxShadow: `${web ? 10 : 6}px ${web ? 10 : 6}px 0 var(--ink)`, background: "var(--blank)", flexShrink: "0" }}>
      <ImageSlot src={lead.cover} srcSet={coverSet(lead.cover)} sizes={web ? '420px' : '300px'} alt={lead.alt} first box={{ width: "100%", height: "100%" }} />
    </Link>
  );
  return (
    <section aria-label="Cover" className="an-cover" style={{ position: "relative", width: `${L.w}px`, height: `${L.h}px`, margin: web ? "40px auto 0" : "20px auto 0", transform: "rotate(-0.5deg)" }}>
      <div style={{ position: "absolute", inset: "0", background: "var(--ink)", translate: web ? "14px 14px" : "8px 8px" }} />
      <div style={{ position: "absolute", inset: "0", boxSizing: "border-box", background: "var(--red)", border: "2px solid var(--ink)", overflow: "hidden", color: "var(--page)" }}>
        {/* the spine, the frame and a faint alpana dot pattern on the cloth */}
        <div style={{ ...frame, left: "0", top: "0", bottom: "0", width: `${L.spine}px`, background: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {web && <span style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", fontFamily: FONT.mono, fontSize: "11px", letterSpacing: "4px", color: "var(--yellow)" }}>{`TERRANOTES · ISSUE ${p2(number)} · SHARADIYA 1433`}</span>}
        </div>
        <div style={{ ...frame, inset: `0 0 0 ${L.spine}px`, backgroundImage: "radial-gradient(circle, rgba(255,201,20,.16) 0 2px, transparent 2.5px)", backgroundSize: web ? "30px 30px" : "22px 22px" }} />
        <div style={{ ...frame, left: `${L.spine + (web ? 20 : 10)}px`, top: web ? "20px" : "10px", right: web ? "20px" : "10px", bottom: web ? "20px" : "10px", border: `${web ? 4 : 3}px solid var(--yellow)` }} />
        <div style={{ ...frame, left: `${L.spine + (web ? 30 : 16)}px`, top: web ? "30px" : "16px", right: web ? "30px" : "16px", bottom: web ? "30px" : "16px", border: "1.5px solid var(--yellow)" }} />
        <div style={{ position: "absolute", left: `${L.spine + L.pad}px`, right: `${L.pad}px`, top: web ? "52px" : "30px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: FONT.mono, fontSize: L.issue, letterSpacing: web ? "2.4px" : "1.2px", color: "var(--yellow)" }}>
            <span>{`ISSUE ${p2(number)} · ${month.toUpperCase()}`}</span><span>SHARADIYA 1433</span>
          </div>
          <h1 style={{ margin: web ? "4px 0 0" : "6px 0 0", fontFamily: FONT.head, fontWeight: "400", fontSize: L.mast, lineHeight: "1", letterSpacing: web ? "2px" : "0", textTransform: "uppercase", color: "var(--page)", textAlign: "center" }}>TerraNotes</h1>
          <div style={{ marginTop: web ? "2px" : "0", borderTop: `${web ? 3 : 2}px solid var(--yellow)`, borderBottom: "1px solid var(--yellow)", height: web ? "4px" : "3px" }} />
          <div style={{ display: "flex", flexDirection: web ? "row" : "column", gap: web ? "50px" : "14px", marginTop: web ? "34px" : "14px", alignItems: web ? "flex-start" : "center" }}>
            <div style={{ flexGrow: "1", minWidth: "0", alignSelf: "stretch" }}>
              <div style={{ fontFamily: FONT.serif, fontStyle: "italic", fontSize: web ? "54px" : "28px", lineHeight: "1", color: "var(--yellow)" }}>The Pujo issue</div>
              {web && <ol style={{ listStyle: "none", margin: "28px 0 0", padding: "0", display: "flex", flexDirection: "column", gap: "18px" }}>
                {lines.map((a) => (
                  <li key={a.slug}>
                    <Link to={articleLink(a)} {...flight(a)} className="an-line" style={{ display: "block", textDecoration: "none", color: "var(--page)" }}>
                      <span style={{ display: "block", fontFamily: FONT.mono, fontSize: "11px", letterSpacing: "1.8px", color: "var(--yellow)" }}>{a.tag.toUpperCase()}</span>
                      <span style={{ display: "block", marginTop: "4px", fontFamily: FONT.head, fontSize: L.line, lineHeight: "1.05", textTransform: "uppercase" }}>{a.title}</span>
                    </Link>
                  </li>
                ))}
              </ol>}
              {web && <div style={{ marginTop: "26px", fontFamily: FONT.hand, fontSize: "28px", lineHeight: "1.1", color: "var(--yellow)", transform: "rotate(-1.5deg)" }}>+ a photo page, a word puzzle and the people who made it all</div>}
            </div>
            {Art}
          </div>
          {!web && lines[0] && (
            <div style={{ marginTop: "16px", textAlign: "center" }}>
              <span style={{ display: "block", fontFamily: FONT.mono, fontSize: "9px", letterSpacing: "1.4px", color: "var(--yellow)" }}>{`INSIDE · ${lines.length} ${lines.length === 1 ? 'STORY' : 'STORIES'}`}</span>
              <span style={{ display: "block", marginTop: "4px", fontFamily: FONT.head, fontSize: L.line, lineHeight: "1.08", textTransform: "uppercase" }}>{lines.map((a) => a.title).join(' · ')}</span>
            </div>
          )}
        </div>
        {/* the price sticker */}
        <div aria-hidden="true" style={{ position: "absolute", right: web ? "448px" : "14px", top: web ? "238px" : "128px", width: `${L.sticker}px`, height: `${L.sticker}px`, borderRadius: "50%", background: "var(--yellow)", border: "2px solid var(--ink)", boxShadow: "4px 4px 0 var(--ink)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: "rotate(-12deg)", color: "var(--ink)", textAlign: "center" }}>
          <span style={{ fontFamily: FONT.mono, fontSize: web ? "11px" : "7.5px", letterSpacing: "1.2px" }}>PRICE</span>
          <span style={{ fontFamily: FONT.head, fontSize: web ? "34px" : "19px", lineHeight: "1" }}>FREE</span>
          <span style={{ fontFamily: FONT.hand, fontSize: web ? "18px" : "12px", lineHeight: "1" }}>read it all</span>
        </div>
      </div>
    </section>
  );
}
