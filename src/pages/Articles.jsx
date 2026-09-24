import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import PageHeader from '../components/PageHeader.jsx';
import MenuSheet from '../components/MenuSheet.jsx';
import ArticleCard from '../components/ArticleCard.jsx';
import Img from '../components/Img.jsx';
import { ARTICLES, COMING_SOON, TAGS } from '../data/articles.js';
import { SoonCard } from '../web/ArticleLine.jsx';
import { pad2 } from '../lib/format.js';
import { ByTape, useByWriter } from '../lib/byWriter.jsx';
import { coverFloor, useFitTitle } from '../lib/fit.js';

const string = (left, top, height) => (
  <div style={{ position: "absolute", left: `${left}px`, top: `${top}px`, width: "1.4px", height: `${height}px`, background: "#5B3A1E" }} />
);
const wire = (top) => <div style={{ position: "absolute", left: "0", top: `${top}px`, width: "390px", height: "2px", background: "#5B3A1E" }} />;
const pill = (tag, size) => ({ background: TAGS[tag].color, color: TAGS[tag].ink, fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: size, letterSpacing: "1px", textTransform: "uppercase", padding: "3px 8px", borderRadius: "999px", lineHeight: "1.2" });
const num = (a) => `${pad2(ARTICLES.indexOf(a) + 1)} / ${pad2(ARTICLES.length)}`;

// All articles, each hanging in its own hand-placed spot (articles 01–06 in order).
// Spots 04 and 05 show the coming-soon cards until there are articles for them; spot 06 appears with article 06.
// Long titles shrink to fit their card (lib/fit.js); the covers above them give up some height first.
export default function Articles() {
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => { document.title = 'Aquaterra — All articles'; }, []);
  const { by, mine, isMine, list } = useByWriter(); // ?by=<name>: that writer's pieces first, marked
  const [a1, a2, a3, a4, a5, a6] = list;
  const fit1 = useFitTitle(a1.title, 32, 22), fit4 = useFitTitle(a4?.title, 21, 15), fit5 = useFitTitle(a5?.title, 28, 20);

  return (
    <>
      <div className="page-articles" style={{ position: "relative", width: "390px", height: a6 ? "2150px" : "1760px", margin: "0 auto", overflow: "clip", background: "#F3EEE4", fontFamily: "'Figtree', system-ui, sans-serif", color: "#111111" }}>
        <PageHeader backTo="/" backLabel="Back to home" menuOpen={menuOpen} onOpenMenu={() => setMenuOpen(true)} />
        <div style={{ position: "absolute", left: "20px", top: "96px", fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "1.6px" }}>{`INDEX · ${pad2(ARTICLES.length)} PIECES`}</div>
        <h1 style={{ position: "absolute", left: "18px", top: "116px", margin: "0", fontFamily: "'Archivo Black', Impact, sans-serif", fontWeight: "400", fontSize: "60px", lineHeight: "0.9", letterSpacing: "-1.5px", textTransform: "uppercase" }}>All<br />articles</h1>
        <div style={{ position: "absolute", left: "236px", top: "128px", width: "130px", fontFamily: "'Caveat', cursive", fontSize: "20px", lineHeight: "1.05", color: "#5B3A1E", transform: "rotate(-5deg)" }}>hung up to dry, one by one</div>

        {by && (
          <div className="slide-in" role="status" style={{ position: "absolute", left: "20px", top: "232px", width: "350px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ minWidth: "0", flexShrink: "1", background: "#F7C21A", border: "1.5px solid #111111", padding: "5px 10px", fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{mine.length ? `By ${by} · ${pad2(mine.length)} first` : `Nothing by ${by} yet`}</span>
            <Link to="/articles" replace aria-label="Show all articles" style={{ flexShrink: "0", minWidth: "44px", minHeight: "32px", display: "flex", alignItems: "center", justifyContent: "center", border: "1.5px solid #111111", background: "#FFFFFF", fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "12px", textDecoration: "none", color: "#111111" }}>✕</Link>
          </div>
        )}

        {/* row 1: featured */}
        {wire(270)}
        {string(194, 272, 34)}
        <Link to={`/articles/${a1.slug}`} style={{ position: "absolute", left: "20px", top: "308px", width: "350px", height: "396px", transform: "rotate(-1deg)", display: "block", textDecoration: "none", color: "#111111" }}>
            {isMine(a1) && <ByTape name={by} />}
          <div style={{ position: "absolute", left: "50%", top: "-7px", marginLeft: "-15px", width: "30px", height: "9px", background: TAGS[a1.tag].color, border: "1.5px solid #111111", boxSizing: "border-box", zIndex: "2" }} />
          <article style={{ width: "100%", height: "100%", boxSizing: "border-box", background: "#FFFFFF", border: "2px solid #111111", boxShadow: "8px 8px 0 #111111", padding: "10px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <Img src={a1.cover} alt={a1.alt} box={{ height: "200px", minHeight: coverFloor(200) }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: "0" }}>
              <span style={pill(a1.tag, "10px")}>{a1.tag}</span>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "1px", color: "#111111" }}>{num(a1)}</span>
            </div>
            <h2 ref={fit1} style={{ flexShrink: "0", margin: "0", fontFamily: "'Archivo Black', Impact, sans-serif", fontWeight: "400", fontSize: "32px", lineHeight: "0.95", letterSpacing: "-0.3px", textTransform: "uppercase", color: "#111111" }}>{a1.title}</h2>
            <p style={{ flexShrink: "0", margin: "0", fontFamily: "'Caveat', cursive", fontSize: "19px", lineHeight: "1.1", color: "#5B4630" }}>{a1.dek}</p>
            <div style={{ flexShrink: "0", marginTop: "auto", display: "flex", justifyContent: "space-between", fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase" }}>
              <span style={isMine(a1) ? { background: "#F7C21A", padding: "0 4px" } : undefined}>{a1.author || '[Author]'}</span>
              <span>{`${a1.readTime || '[x]'} min read →`}</span>
            </div>
          </article>
        </Link>

        {/* row 2: two staggered */}
        {wire(740)}
        {string(112, 742, 32)}
        {string(296, 742, 82)}
        <ArticleCard article={a2} mark={isMine(a2) && by} style={{ position: "absolute", left: "16px", top: "776px", width: "194px", height: "280px", transform: "rotate(-2deg)" }} imgH="112px" titleSize="18px" dekSize="16px" />
        <ArticleCard article={a3} mark={isMine(a3) && by} style={{ position: "absolute", left: "216px", top: "826px", width: "158px", height: "262px", transform: "rotate(2.6deg)" }} imgH="100px" titleSize="15.5px" dekSize="15px" />

        {/* row 3: wide card strung from both cards above */}
        {string(110, 1054, 82)}
        {string(292, 1086, 50)}
        {a4 ? (
          <Link to={`/articles/${a4.slug}`} style={{ position: "absolute", left: "22px", top: "1136px", width: "346px", height: "190px", transform: "rotate(1deg)", display: "block", textDecoration: "none", color: "#111111" }}>
            {isMine(a4) && <ByTape name={by} />}
            <article style={{ width: "100%", height: "100%", boxSizing: "border-box", background: "#FFFFFF", border: "2px solid #111111", boxShadow: `7px 7px 0 ${TAGS[a4.tag].color}`, padding: "8px", display: "flex", gap: "12px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "4px 0 0 4px", flexGrow: "1" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: "0" }}>
                  <span style={pill(a4.tag, "8.5px")}>{a4.tag}</span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", letterSpacing: "1px", color: "#111111" }}>{num(a4)}</span>
                </div>
                <h3 ref={fit4} style={{ flexShrink: "0", margin: "0", fontFamily: "'Archivo Black', Impact, sans-serif", fontWeight: "400", fontSize: "21px", lineHeight: "0.95", letterSpacing: "-0.3px", textTransform: "uppercase", color: "#111111" }}>{a4.title}</h3>
                <p style={{ flexShrink: "0", margin: "0", fontFamily: "'Caveat', cursive", fontSize: "16px", lineHeight: "1.1", color: "#5B4630" }}>{a4.dek}</p>
              </div>
              <Img src={a4.cover} alt={a4.alt} box={{ width: "124px", flexShrink: "0", height: "170px" }} />
            </article>
          </Link>
        ) : <SoonCard text={COMING_SOON[0]} w={346} h={190} font="26px" clips={[74, 256]} style={{ left: "22px", top: "1136px", transform: "rotate(1deg)" }} />}

        {/* row 4: dark card */}
        {string(200, 1324, 56)}
        {a5 ? (
          <Link to={`/articles/${a5.slug}`} style={{ position: "absolute", left: "52px", top: "1380px", width: "310px", height: "330px", transform: "rotate(-1.8deg)", display: "block", textDecoration: "none", color: "#FFFFFF" }}>
            {isMine(a5) && <ByTape name={by} />}
            <div style={{ position: "absolute", left: "50%", top: "-7px", marginLeft: "-15px", width: "30px", height: "9px", background: TAGS[a5.tag].color, border: "1.5px solid #111111", boxSizing: "border-box", zIndex: "2" }} />
            <article style={{ width: "100%", height: "100%", boxSizing: "border-box", background: "#111111", border: "2px solid #111111", boxShadow: `8px 8px 0 ${TAGS[a5.tag].color}`, padding: "10px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <Img src={a5.cover} alt={a5.alt} box={{ height: "160px", minHeight: coverFloor(160) }} dark />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: "0" }}>
                <span style={pill(a5.tag, "9.5px")}>{a5.tag}</span>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "1px", color: "#FFFFFF" }}>{num(a5)}</span>
              </div>
              <h3 ref={fit5} style={{ flexShrink: "0", margin: "0", fontFamily: "'Archivo Black', Impact, sans-serif", fontWeight: "400", fontSize: "28px", lineHeight: "0.95", letterSpacing: "-0.3px", textTransform: "uppercase", color: "#FFFFFF" }}>{a5.title}</h3>
              <p style={{ flexShrink: "0", margin: "0", fontFamily: "'Caveat', cursive", fontSize: "18px", lineHeight: "1.1", color: TAGS[a5.tag].color }}>{a5.dek}</p>
            </article>
          </Link>
        ) : <SoonCard text={COMING_SOON[1]} w={310} h={330} font="30px" style={{ left: "52px", top: "1380px", transform: "rotate(-1.8deg)" }} />}

        {/* row 5: last card + margin note */}
        {a6 && (
          <>
          {wire(1760)}
          {string(128, 1762, 32)}
          <ArticleCard article={a6} mark={isMine(a6) && by} style={{ position: "absolute", left: "18px", top: "1796px", width: "226px", height: "300px", transform: "rotate(2deg)" }} imgH="130px" titleSize="21px" dekSize="17px" />
          <div style={{ position: "absolute", left: "262px", top: "1860px", width: "110px", fontFamily: "'Caveat', cursive", fontSize: "20px", lineHeight: "1.05", color: "#5B3A1E", transform: "rotate(4deg)" }}>that's all of them, for now.</div>
          <svg width="60" height="40" viewBox="0 0 60 40" style={{ position: "absolute", left: "272px", top: "1932px" }} fill="none" stroke="#5B3A1E" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
            <path d="M50 4 C40 30 20 34 6 24" />
            <path d="M12 18 L6 24 L14 28" />
          </svg>
          </>
        )}
      </div>
      <MenuSheet open={menuOpen} onClose={() => setMenuOpen(false)} current="articles" />
    </>
  );
}
