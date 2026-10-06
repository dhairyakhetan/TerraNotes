import { useRef } from 'react';
import { Link } from '../../../router.jsx';
import ImageSlot from '../../../shared/ImageSlot.jsx';
import { cardCover, coverSet, TagPill } from '../../../shared/ArticleCard.jsx';
import { ByTape, FeaturedTape } from '../../../shared/Tapes.jsx';
import { articleLink } from '../../../data/editions.js';
import { flight } from '../../../lib/cardFlight.js';
import { useReveal } from '../../../lib/reveal.js';
import { useEdition } from '../../../lib/edition.js';
import { FONT } from '../../../styles/fonts.js';
import { Folio, Head, p2, pagesOf } from './parts.jsx';

// The annual's stories (AnnualHome.jsx), laid out like a printed magazine: the lead story as a spread (its cover big on
// the left; on the right its tag, title, dek, the opening of its first paragraph under a drop cap, and "Read the story")
// then every other story in columns with thin rules between them (web three across, phones one under another), and a
// dashed "more stories soon" slot when a row has room. Each story is a link; its cover flies out (lib/cardFlight.js) and
// the page turns (PageTurn.jsx). ?by=<writer>: their pieces first, taped (lib/byWriter.js, from AnnualHome).
const opening = (a) => { const t = (a.body || []).find((b) => typeof b === 'string') || a.dek || ''; return t.length > 230 ? `${t.slice(0, 230).replace(/\s+\S*$/, '')}…` : t; };
const meta = (a) => [a.author || 'TerraNotes', a.readTime && `${a.readTime} min read`].filter(Boolean).join(' · ').toUpperCase();

function Lead({ web, a, mine }) {
  const ref = useRef(null);
  useReveal(ref);
  return (
    <Link ref={ref} to={articleLink(a)} {...flight(a)} className="an-story" style={{ position: "relative", display: "flex", flexDirection: web ? "row" : "column", gap: web ? "50px" : "16px", textDecoration: "none", color: "var(--ink)", paddingBottom: web ? "40px" : "28px", borderBottom: "3px double var(--ink)" }}>
      <div style={{ position: "relative", width: web ? "660px" : "100%", flexShrink: "0" }}>
        {mine && <ByTape name={a.author} />}
        {a.featured && <FeaturedTape />}
        <div style={{ border: "2px solid var(--ink)", boxShadow: `${web ? 10 : 6}px ${web ? 10 : 6}px 0 var(--ink)`, background: "var(--card)", padding: web ? "10px" : "7px" }}>
          <ImageSlot src={a.cover} srcSet={coverSet(a.cover)} sizes={web ? '660px' : '350px'} alt={a.alt} first box={{ width: "100%", height: web ? "430px" : "220px" }} />
        </div>
      </div>
      <div style={{ minWidth: "0", paddingTop: web ? "6px" : "0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <TagPill a={a} size={web ? "11px" : "9.5px"} pad="3px 10px" lh="1.3" />
          <span style={{ fontFamily: FONT.mono, fontSize: web ? "11px" : "9.5px", letterSpacing: "1.6px", color: "var(--red)" }}>COVER STORY</span>
        </div>
        <h3 style={{ margin: web ? "16px 0 0" : "10px 0 0", fontFamily: FONT.head, fontWeight: "400", fontSize: web ? "54px" : "32px", lineHeight: "calc(1.02 * var(--head-lead, 1))", textTransform: "uppercase" }}>{a.title}</h3>
        <div style={{ marginTop: web ? "12px" : "8px", fontFamily: FONT.hand, fontSize: web ? "30px" : "22px", lineHeight: "1.05", color: "var(--dek)" }}>{a.dek}</div>
        <p style={{ margin: web ? "20px 0 0" : "14px 0 0", fontFamily: FONT.read, fontSize: web ? "19px" : "16.5px", lineHeight: "1.6", color: "var(--text)" }}>
          <span className="an-drop" style={{ float: "left", fontFamily: FONT.head, fontSize: web ? "78px" : "56px", lineHeight: "0.82", color: "var(--red)", margin: web ? "8px 10px 0 0" : "6px 8px 0 0" }}>{opening(a).charAt(0)}</span>
          {opening(a).slice(1)}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: web ? "24px" : "16px", flexWrap: "wrap" }}>
          <span className="press btn" style={{ "--c": "var(--yellow)", display: "inline-flex", alignItems: "center", minHeight: "44px", padding: "0 18px", background: "var(--ink)", color: "var(--card)", border: "2px solid var(--ink)", boxShadow: "4px 4px 0 var(--yellow)", fontFamily: FONT.mono, fontWeight: "700", fontSize: web ? "12px" : "11px", letterSpacing: "1px", textTransform: "uppercase" }}>Read the story →</span>
          <span style={{ fontFamily: FONT.mono, fontSize: web ? "11px" : "9.5px", letterSpacing: "1.4px", color: "var(--muted)" }}>{meta(a)}</span>
        </div>
      </div>
    </Link>
  );
}

function Column({ web, a, i, page, mine }) {
  const ref = useRef(null);
  useReveal(ref, web ? (i % 3) * 100 : 0);
  return (
    <Link ref={ref} to={articleLink(a)} {...flight(a)} className="an-story" style={{ position: "relative", display: "block", textDecoration: "none", color: "var(--ink)" }}>
      {mine && <ByTape name={a.author} />}
      <ImageSlot src={cardCover(a.cover)} fallback={a.cover} alt={a.alt} first={i < 3} box={{ width: "100%", height: web ? "230px" : "190px", border: "2px solid var(--ink)", boxSizing: "border-box" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px" }}>
        <TagPill a={a} size={web ? "10px" : "9.5px"} pad="3px 9px" lh="1.3" fit />
        <span style={{ fontFamily: FONT.mono, fontSize: web ? "11px" : "10px", color: "var(--ink)" }}>{`p. ${p2(page)}`}</span>
      </div>
      <h3 style={{ margin: "10px 0 0", fontFamily: FONT.head, fontWeight: "400", fontSize: web ? "28px" : "25px", lineHeight: "calc(1.05 * var(--head-lead, 1))", textTransform: "uppercase" }}>{a.title}</h3>
      <div style={{ marginTop: "6px", fontFamily: FONT.hand, fontSize: web ? "23px" : "21px", lineHeight: "1.05", color: "var(--dek)" }}>{a.dek}</div>
      <div style={{ marginTop: "10px", fontFamily: FONT.mono, fontSize: web ? "10.5px" : "9.5px", letterSpacing: "1.3px", color: "var(--muted)" }}>{`${meta(a)} · READ →`}</div>
    </Link>
  );
}

const Soon = ({ web }) => (
  <div style={{ minHeight: web ? "420px" : "160px", border: "2px dashed var(--slotLine)", background: "var(--blank)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px", padding: "20px", textAlign: "center" }}>
    <span style={{ fontFamily: FONT.mono, fontSize: web ? "11px" : "10px", letterSpacing: "1.4px", color: "var(--slotInk)" }}>[MORE STORIES SOON]</span>
    <span style={{ fontFamily: FONT.hand, fontSize: web ? "24px" : "21px", lineHeight: "1.1", color: "var(--hand)" }}>the writers are still filing</span>
  </div>
);

export default function Stories({ web, list, isMine }) {
  const { articles } = useEdition(), P = pagesOf(articles.length);
  const [lead, ...rest] = list;
  if (!lead) return null;
  return (
    <section aria-label="Stories" style={{ marginTop: web ? "100px" : "60px" }}>
      <Folio web={web} page={P.story(0)} label="stories" />
      <Head web={web} kicker="GOLPO · STORIES" title="Stories" aside={web ? 'read them in any order. pujo rules.' : null} />
      <Lead web={web} a={lead} mine={isMine(lead)} />
      <div style={{ display: "grid", gridTemplateColumns: web ? "repeat(3, 1fr)" : "1fr", columnGap: web ? "0" : "0", rowGap: web ? "40px" : "34px", marginTop: web ? "40px" : "30px" }}>
        {[...rest, ...(rest.length % 3 || !rest.length ? [null] : [])].map((a, i) => (
          <div key={a ? a.slug : 'soon'} style={web ? { padding: "0 30px", borderLeft: i % 3 ? "1px solid var(--rule)" : "none", ...(i % 3 === 0 && { paddingLeft: "0" }), ...(i % 3 === 2 && { paddingRight: "0" }) } : null}>
            {a ? <Column web={web} a={a} i={i} page={P.story(articles.indexOf(a))} mine={isMine(a)} /> : <Soon web={web} />}
          </div>
        ))}
      </div>
    </section>
  );
}
