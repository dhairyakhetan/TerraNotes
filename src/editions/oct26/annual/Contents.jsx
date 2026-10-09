import { useRef } from 'react';
import { Link } from '../../../router.jsx';
import { articleLink } from '../../../data/editions.js';
import { flight } from '../../../lib/cardFlight.js';
import { useReveal } from '../../../lib/reveal.js';
import { useEdition } from '../../../lib/edition.js';
import { byId } from '../../../lib/dom.js';
import { calm } from '../../../lib/motion.js';
import { FONT } from '../../../styles/fonts.js';
import { Folio, Head, p2, pagesOf } from './parts.jsx';

// The annual's contents page (AnnualHome.jsx), "Shuchipatra" (contents): every story as a printed contents line
// (number, title, its tag · writer · read time, a dotted leader, the page), then the rest of the issue (photographs,
// puzzle, editorial board, back cover; those scroll to their section), and, beside it on web (under it on phones), a
// note from the editors. Its element id is "articles", so /articles lands here.
const go = (id) => () => byId(id)?.scrollIntoView({ behavior: calm() ? 'auto' : 'smooth', block: 'start' });

function Row({ web, num, title, meta, page, to, a, onClick }) {
  const inner = (
    <>
      <span style={{ fontFamily: FONT.mono, fontSize: web ? "13px" : "11px", color: "var(--hand)", width: web ? "34px" : "26px", flexShrink: "0", paddingTop: web ? "10px" : "6px" }}>{num}</span>
      <span style={{ flexGrow: "1", minWidth: "0" }}>
        <span style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
          <span style={{ fontFamily: FONT.serif, fontSize: web ? "32px" : "22px", lineHeight: "1.1", color: "var(--ink)" }}>{title}</span>
          <span aria-hidden="true" style={{ flexGrow: "1", minWidth: web ? "30px" : "16px", borderBottom: "2px dotted var(--muted)", transform: "translateY(-6px)" }} />
          <span style={{ fontFamily: FONT.mono, fontSize: web ? "13px" : "11px", color: "var(--ink)", whiteSpace: "nowrap" }}>{`p. ${p2(page)}`}</span>
        </span>
        {meta && <span style={{ display: "block", marginTop: "4px", fontFamily: FONT.mono, fontSize: web ? "11px" : "9.5px", letterSpacing: "1.2px", color: "var(--muted)", textTransform: "uppercase" }}>{meta}</span>}
      </span>
    </>
  );
  const style = { display: "flex", gap: web ? "14px" : "10px", padding: web ? "14px 0" : "10px 0", borderBottom: "1px solid var(--rule)", textDecoration: "none", color: "inherit", width: "100%", background: "none", border: "0", borderBottomStyle: "solid", textAlign: "left", cursor: "pointer", minHeight: "44px" };
  return to
    ? <Link to={to} {...flight(a)} className="an-row" style={style}>{inner}</Link>
    : <button type="button" onClick={onClick} className="an-row" style={{ ...style, font: "inherit" }}>{inner}</button>;
}

export default function Contents({ web, list }) {
  const ref = useRef(null), { intro, articles } = useEdition(), P = pagesOf(articles.length);
  useReveal(ref);
  return (
    <section ref={ref} id="articles" aria-label="Contents" style={{ marginTop: web ? "90px" : "50px" }}>
      <Folio web={web} page={P.contents} label="contents" />
      <Head web={web} kicker="SHUCHIPATRA" title="Contents" aside={web ? 'what’s inside this year’s Pujo issue' : null} />
      <div style={{ display: "flex", flexDirection: web ? "row" : "column", gap: web ? "70px" : "30px", alignItems: "flex-start" }}>
        <div style={{ flexGrow: "1", minWidth: "0", width: web ? "auto" : "100%" }}>
          <div style={{ fontFamily: FONT.mono, fontSize: web ? "11px" : "9.5px", letterSpacing: "1.8px", color: "var(--ink)", paddingBottom: "6px", borderBottom: "2px solid var(--ink)" }}>STORIES</div>
          {list.map((a) => (
            <Row key={a.slug} web={web} a={a} to={articleLink(a)} num={p2(articles.indexOf(a) + 1)} title={a.title} page={P.story(articles.indexOf(a))}
              meta={[a.tag, a.author || 'TerraNotes', a.readTime && `${a.readTime} min read`].filter(Boolean).join(' · ')} />
          ))}
          <div style={{ marginTop: web ? "28px" : "22px", fontFamily: FONT.mono, fontSize: web ? "11px" : "9.5px", letterSpacing: "1.8px", color: "var(--ink)", paddingBottom: "6px", borderBottom: "2px solid var(--ink)" }}>ALSO IN THIS ISSUE</div>
          <Row web={web} num="✦" title="Photographs" page={P.photos} onClick={go('photos')} />
          <Row web={web} num="✦" title="Puzzle corner" page={P.puzzle} onClick={go('words')} />
          <Row web={web} num="✦" title="Editorial board" page={P.board} onClick={go('members')} />
          <Row web={web} num="✦" title="Subho Bijoya" page={P.back} onClick={go('back-cover')} />
        </div>
        <aside style={{ width: web ? "380px" : "100%", flexShrink: "0", boxSizing: "border-box", background: "var(--card)", border: "2px solid var(--ink)", boxShadow: `${web ? 8 : 6}px ${web ? 8 : 6}px 0 var(--yellow)`, transform: "rotate(0.6deg)" }}>
          <div style={{ height: web ? "14px" : "10px", background: "var(--red)", borderBottom: "3px solid var(--yellow)" }} />
          <div style={{ padding: web ? "24px 28px 26px" : "18px 20px 20px" }}>
            <div style={{ fontFamily: FONT.mono, fontSize: web ? "11px" : "9.5px", letterSpacing: "1.8px", color: "var(--hand)" }}>FROM THE EDITORS</div>
            <p style={{ margin: web ? "12px 0 0" : "10px 0 0", fontFamily: FONT.read, fontSize: web ? "18px" : "16px", lineHeight: "1.55", color: "var(--text)" }}>
              Every Pujo, Bengal’s magazines bring out a fat annual: stories, pictures, puzzles, the lot. This is ours.
            </p>
            <p style={{ margin: "10px 0 0", fontFamily: FONT.read, fontStyle: "italic", fontSize: web ? "18px" : "16px", lineHeight: "1.55", color: "var(--text)" }}>{intro || '[Two or three lines introducing Aquaterra and what Terranotes is for.]'}</p>
            <div style={{ marginTop: web ? "14px" : "10px", fontFamily: FONT.hand, fontSize: web ? "26px" : "22px", color: "var(--hand)", transform: "rotate(-2deg)" }}>— the TerraNotes team</div>
          </div>
        </aside>
      </div>
    </section>
  );
}
