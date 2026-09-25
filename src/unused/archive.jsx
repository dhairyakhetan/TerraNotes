// ─────────────────────────────────────────────────────────────────────────────────────────────────────────────────
// UNUSED: kept for reference, not part of the site. Nothing imports this file, so none of it is built or shipped.
// To bring something back, move it into its own file under src/ again and import it where it's needed.
//
//   1. AllArticlesPage : the phone's old "All articles" page (/articles). Replaced by the articles on the home page.
//   2. LineView        : the phone home's "Line" view: every article on one sideways string, swiped along.
//   3. TilesView       : the phone home's "Tiles" view: big rounded tiles in a sideways row, double-tap to like
//                        (the heart pops up where you tapped and drops into the like button; likes kept on the device).
//   4. ViewSwitch      : the Hang / Line / Tiles switch that sat in the phone header to flip between the three views.
//
// Their styles (the ones nothing else uses) are in ./archive.css, with notes.
// ─────────────────────────────────────────────────────────────────────────────────────────────────────────────────
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import PageHeader from '../components/PageHeader.jsx';
import MenuSheet from '../components/MenuSheet.jsx';
import ArticleCard from '../components/ArticleCard.jsx';
import Img from '../components/Img.jsx';
import { ARTICLES, COMING_SOON, TAGS } from '../data/articles.js';
import { MEMBERS } from '../data/team.js';
import { DURATION, SoonCard, SWING, TILT } from '../web/ArticleLine.jsx';
import { pad2 } from '../lib/format.js';
import { ByTape, useByWriter } from '../lib/byWriter.jsx';
import { coverFloor, useFitTitle } from '../lib/fit.js';


// ═════ 1 ═════════════════════════════════════════════════════════════════════════════════════════════
// 1. AllArticlesPage: was src/pages/Articles.jsx (route /articles on phone). Every article in its own hand-placed spot;
//    with ?by=<writer> that writer's pieces came first, taped, under a "showing …" bar.
const string = (left, top, height) => (
  <div style={{ position: "absolute", left: `${left}px`, top: `${top}px`, width: "1.4px", height: `${height}px`, background: "#5B3A1E" }} />
);
const wire = (top) => <div style={{ position: "absolute", left: "0", top: `${top}px`, width: "390px", height: "2px", background: "#5B3A1E" }} />;
const pill = (tag, size) => ({ background: TAGS[tag].color, color: TAGS[tag].ink, fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: size, letterSpacing: "1px", textTransform: "uppercase", padding: "3px 8px", borderRadius: "999px", lineHeight: "1.2" });
const num = (a) => `${pad2(ARTICLES.indexOf(a) + 1)} / ${pad2(ARTICLES.length)}`;

// All articles, each hanging in its own hand-placed spot (articles 01–06 in order).
// Spots 04 and 05 show the coming-soon cards until there are articles for them; spot 06 appears with article 06.
// Long titles shrink to fit their card (lib/fit.js); the covers above them give up some height first.
export function AllArticlesPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => { document.title = 'Aquaterra — All articles'; }, []);
  const { by, mine, isMine, list } = useByWriter(); // ?by=<name>: that writer's pieces first, marked
  const [a1, a2, a3, a4, a5, a6] = list;
  const fit1 = useFitTitle(a1.title, 32, 22), fit4 = useFitTitle(a4?.title, 21, 15), fit5 = useFitTitle(a5?.title, 28, 20);

  return (
    <>
      <div className="page-articles" style={{ position: "relative", width: "390px", height: a6 ? "2150px" : "1760px", margin: "0 auto", overflow: "clip", background: "#F3EEE4", fontFamily: "'Figtree', system-ui, sans-serif", color: "#111111" }}>
        <PageHeader menuOpen={menuOpen} onOpenMenu={() => setMenuOpen(true)} />
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
        ) : <SoonCard text={COMING_SOON[COMING_SOON.length - 1]} w={310} h={330} font="30px" style={{ left: "52px", top: "1380px", transform: "rotate(-1.8deg)" }} />}

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

// ═════ 2 ═════════════════════════════════════════════════════════════════════════════════════════════
// 2. LineView: was src/components/home/ScrollingArticles.jsx. Home's articles on one sideways string, like the web home.
// The wire: sags between pegs, runs off both ends of the track. dy moves it up or down. (was in src/web/ArticleLine.jsx; only this view used it)
const wirePath = (pegs, width, dy = 0) => {
  let d = `M0 ${78 + dy} Q82 ${100 + dy} ${pegs[0].x} ${pegs[0].y}`;
  for (let i = 1; i < pegs.length; i++) d += ` Q${(pegs[i - 1].x + pegs[i].x) / 2} ${110 + dy} ${pegs[i].x} ${pegs[i].y}`;
  const last = pegs[pegs.length - 1];
  return `${d} Q${(last.x + width) / 2} ${110 + dy} ${width} ${78 + dy}`;
};

// TEMPORARY: the phone's "scroll" view of the articles (switch in the header), to compare with the hanging view.
// Every write-up on one sideways line, like the web home page.
const PITCH = 196;
const CARD_TOP = [62, 104, 74, 112, 68, 96, 100, 70, 84, 110, 76, 98]; // where each card's clip sits
const peg = (i) => {
  const x = 110 + PITCH * i, y = i % 2 ? 40 : 30;
  return { x, y, drop: CARD_TOP[i % 12] - y, tilt: TILT[i % 12], swing: SWING[i % 12], dur: DURATION[i % 3] };
};

export function LineView() {
  const scroller = useRef(null), bar = useRef(null), prev = useRef(null), next = useRef(null);
  const { by, isMine, list } = useByWriter(); // ?by=<writer>: their pieces first, taped
  const items = list.map((a) => ({ a }));
  const pegs = items.map((_, i) => peg(i));
  const width = pegs[pegs.length - 1].x + 150;
  // progress bar and arrows are written directly, so swiping never re-renders the cards
  const onScroll = (e) => {
    const el = e.currentTarget, max = el.scrollWidth - el.clientWidth;
    const p = max > 0 ? el.scrollLeft / max : 0;
    bar.current.style.width = `${Math.round(Math.max(0.06, p) * 100)}%`;
    prev.current.style.opacity = p <= 0.01 ? '0.35' : '1';
    next.current.style.opacity = p >= 0.99 ? '0.35' : '1';
  };
  const scrollBy = (dx) => scroller.current.scrollBy({ left: dx, behavior: 'smooth' });
  const arrow = { width: "40px", height: "40px", flexShrink: "0", padding: "0", border: "2px solid #111111", boxShadow: "3px 3px 0 #111111", display: "flex", alignItems: "center", justifyContent: "center", "--c": "#111111" };

  return (
    <>
      {/* "Articles" label card, tied to the intro card's knot */}
      <div className="hang sway" style={{ position: "absolute", left: "20px", top: "312px", width: "150px", height: "196px", "--a": "1.79deg", "--d": "5.0s", animationDelay: "-0.4s" }}>
        <div className="string" style={{ position: "absolute", left: "74.3px", top: "0", width: "1.4px", height: "62px", background: "#5B3A1E" }} />
        <div className="flutter" style={{ position: "absolute", left: "0", top: "60px", width: "150px", height: "136px", "--r": "-2.5deg", transform: "rotate(-2.5deg)", animationDelay: "-1.1s" }}>
          <div style={{ position: "absolute", left: "50%", top: "-6px", marginLeft: "-12px", width: "24px", height: "9px", background: "#F0442B", border: "1.5px solid #111111", boxSizing: "border-box", zIndex: "2" }} />
          <div style={{ width: "100%", height: "100%", boxSizing: "border-box", background: "#111111", color: "#F3EEE4", padding: "16px", border: "2px solid #111111", boxShadow: "6px 6px 0 #F0442B", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <h2 style={{ margin: "0", fontFamily: "'Caveat', cursive", fontWeight: "700", fontSize: "46px", lineHeight: "0.9" }}>Articles</h2>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "1.4px", textTransform: "uppercase", color: "#CFC8B8" }}>{`${pad2(ARTICLES.length)} pieces`}</div>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: "196px", top: "420px", width: "170px", fontFamily: "'Caveat', cursive", fontSize: "22px", lineHeight: "1.05", color: "#5B3A1E", transform: "rotate(-4deg)" }}>swipe along the line →</div>
      <div ref={scroller} className="art-scroller" onScroll={onScroll} aria-label="All write-ups, swipe sideways" style={{ position: "absolute", left: "0", top: "530px", width: "390px", height: "400px", overflowX: "auto", overflowY: "hidden", scrollSnapType: "x proximity", scrollPaddingLeft: "16px" }}>
        <div style={{ position: "relative", width: `${width}px`, height: "390px" }}>
          <svg width={width} height="120" viewBox={`0 0 ${width} 120`} style={{ position: "absolute", left: "0", top: "0" }} aria-hidden="true">
            <path d={wirePath(pegs, width, -48)} fill="none" stroke="#5B3A1E" strokeWidth="1.8" />
          </svg>
          {/* snap points sit still at each peg; snapping to the swaying cards made the line drift on its own */}
          {pegs.map((p, i) => <span key={i} style={{ position: "absolute", left: `${p.x - 88}px`, top: "0", width: "1px", height: "1px", scrollSnapAlign: "start" }} />)}
          {items.map((item, i) => {
            const p = pegs[i];
            return (
              <div key={i} className="hang sway" style={{ position: "absolute", left: `${p.x - 88}px`, top: `${p.y}px`, width: "176px", height: `${p.drop + 240}px`, "--a": `${p.swing}deg`, "--d": `${p.dur}s`, animationDelay: `${(-0.9 * i).toFixed(1)}s` }}>
                <div className="string" style={{ position: "absolute", left: "87.3px", top: "0", width: "1.4px", height: `${p.drop + 2}px`, background: "#5B3A1E" }} />
                <div className="flutter" style={{ position: "absolute", left: "0", top: `${p.drop}px`, width: "176px", height: "240px", "--r": `${p.tilt}deg`, transform: `rotate(${p.tilt}deg)`, animationDelay: `${(-0.7 - 0.9 * i).toFixed(1)}s` }}>
                  {item.a
                    ? <ArticleCard article={item.a} mark={isMine(item.a) ? by : undefined} className="card" style={{ position: "absolute", left: "0", top: "0", width: "176px", height: "240px" }} imgH="92px" titleSize="15.5px" dekSize="15px" />
                    : <SoonCard text={item.text} w={176} h={240} font="24px" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ position: "absolute", left: "20px", top: "946px", width: "350px", display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "9.5px", letterSpacing: "1.2px", whiteSpace: "nowrap" }}>{`${pad2(ARTICLES.length)} WRITE-UPS`}</div>
        <div style={{ flexGrow: "1", height: "4px", background: "#D9D1BF", position: "relative" }}>
          <div ref={bar} style={{ position: "absolute", left: "0", top: "0", height: "4px", width: "6%", background: "#111111", transition: "width 120ms linear" }} />
        </div>
        <button ref={prev} className="press" onClick={() => scrollBy(-392)} aria-label="Scroll write-ups left" style={{ ...arrow, background: "#FFFFFF", opacity: "0.35" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2.8" strokeLinecap="square"><path d="M15 4 L7 12 L15 20" /></svg>
        </button>
        <button ref={next} className="press" onClick={() => scrollBy(392)} aria-label="Scroll write-ups right" style={{ ...arrow, background: "#F7C21A" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2.8" strokeLinecap="square"><path d="M9 4 L17 12 L9 20" /></svg>
        </button>
      </div>
    </>
  );
}

// ═════ 3 ═════════════════════════════════════════════════════════════════════════════════════════════
// 3. TilesView: was src/components/home/TileArticles.jsx. Big tiles in a sideways row with a like button under each.
// TEMPORARY: the phone's "tiles" view of the articles (switch in the header), to compare with the other two.
// Big rounded tiles in a sideways row, the next one peeking in; title panel over the picture, a like button under it.
// Tap a tile to open it; double-tap it to like it: a heart pops up where you tapped, rises, then drops into the like
// button. Likes are remembered on this device (they survive reloads).
const LIKES = 'aq-liked';
const likedSet = () => { try { return new Set(JSON.parse(localStorage.getItem(LIKES) || '[]')); } catch { return new Set(); } };
const keepLike = (slug, on) => { try { const s = likedSet(); if (on) s.add(slug); else s.delete(slug); localStorage.setItem(LIKES, JSON.stringify([...s])); } catch { /* private mode */ } };
const icon = { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" };

const HEART = "M12 20 C5 15 3 12 3 8.5 A4.5 4.5 0 0 1 12 6 A4.5 4.5 0 0 1 21 8.5 C21 12 19 15 12 20 Z";
const HEART_SIZE = 84;

function Tile({ a, mark }) {
  const [liked, setLikedState] = useState(() => likedSet().has(a.slug));
  const [fly, setFly] = useState(null); // the heart on its way: where it starts, and how far to the like button
  const nav = useNavigate();
  const wait = useRef(null), wrap = useRef(null), likeIcon = useRef(null), heart = useRef(null);
  const tag = TAGS[a.tag];
  const author = MEMBERS.find((m) => m.name === a.author);
  const to = `/articles/${a.slug}`;
  const setLiked = (on) => { setLikedState(on); keepLike(a.slug, on); };
  // one tap opens the article (after a moment, in case a second tap is coming); a double tap likes it
  const onTap = (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button > 0) return; // new tab etc. as usual
    e.preventDefault();
    if (e.detail === 0) { nav(to); return; } // keyboard Enter
    if (wait.current) { clearTimeout(wait.current); wait.current = null; likeFrom(e.clientX, e.clientY); return; }
    wait.current = setTimeout(() => { wait.current = null; nav(to); }, 260);
  };
  const likeFrom = (x, y) => {
    keepLike(a.slug, true); // saved straight away; the button fills when the heart lands
    const box = wrap.current.getBoundingClientRect(), icon = likeIcon.current.getBoundingClientRect();
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !wrap.current.animate) { setLikedState(true); return; }
    const sx = x - box.left, sy = y - box.top;
    setFly({ sx, sy, dx: icon.left + icon.width / 2 - box.left - sx, dy: icon.top + icon.height / 2 - box.top - sy, rise: Math.min(60, sy - 50), n: Date.now() });
  };
  useLayoutEffect(() => {
    if (!fly || !heart.current) return undefined;
    const { dx, dy, rise } = fly;
    const an = heart.current.animate([
      { transform: 'translate(0px, 0px) scale(0.2) rotate(-14deg)', opacity: 0, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
      { transform: 'translate(0px, 0px) scale(1.1) rotate(5deg)', opacity: 1, offset: 0.22, easing: 'cubic-bezier(0.2, 0.8, 0.3, 1)' },
      { transform: `translate(0px, ${-rise}px) scale(1) rotate(-4deg)`, opacity: 1, offset: 0.52, easing: 'cubic-bezier(0.6, 0, 0.9, 0.4)' },
      { transform: `translate(${dx}px, ${dy}px) scale(${22 / HEART_SIZE}) rotate(0deg)`, opacity: 1 },
    ], { duration: 1050, fill: 'forwards' });
    an.onfinish = () => { setLikedState(true); setFly(null); };
    return () => { an.onfinish = null; };
  }, [fly]);
  return (
    <div ref={wrap} style={{ position: "relative", flexShrink: "0", width: "328px", scrollSnapAlign: "start" }}>
      {fly && (
        <svg key={fly.n} ref={heart} width={HEART_SIZE} height={HEART_SIZE} viewBox="0 0 24 24" aria-hidden="true" style={{ position: "absolute", zIndex: "4", left: `${fly.sx - HEART_SIZE / 2}px`, top: `${fly.sy - HEART_SIZE / 2}px`, pointerEvents: "none", opacity: "0", filter: "drop-shadow(2px 3px 0 rgba(17,17,17,.35))" }}>
          <path d={HEART} fill="#F0442B" stroke="#111111" strokeWidth="1.2" strokeLinejoin="round" />
        </svg>
      )}
      <div style={{ position: "relative" }}>
        <Link className="tile" to={to} onClick={onTap} style={{ touchAction: "manipulation", position: "relative", display: "block", height: "430px", borderRadius: "22px", overflow: "hidden", border: "2px solid #111111", boxSizing: "border-box", textDecoration: "none" }}>
          <Img src={a.cover} alt={a.alt} box={{ height: "100%", border: "0" }} icon={24} font="12px" />
          <span style={{ position: "absolute", left: "12px", top: "12px", background: tag.color, color: tag.ink, fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "10.5px", letterSpacing: "1px", textTransform: "uppercase", padding: "5px 10px", borderRadius: "999px", border: "1.5px solid #111111" }}>{a.tag}</span>
          <span style={{ position: "absolute", right: "12px", top: "12px", background: "#FFFFFF", fontFamily: "'Space Mono', monospace", fontSize: "10.5px", letterSpacing: "1px", color: "#111111", padding: "5px 9px", borderRadius: "999px", border: "1.5px solid #111111" }}>{`${pad2(ARTICLES.indexOf(a) + 1)} / ${pad2(ARTICLES.length)}`}</span>
          <div style={{ position: "absolute", left: "10px", right: "10px", bottom: "10px", boxSizing: "border-box", padding: "14px 16px 16px", borderRadius: "16px", background: "#1E2723", color: "#FFFFFF", WebkitFontSmoothing: "antialiased" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "9px", fontSize: "15px", color: "#D9D4C7" }}>
              <span style={{ width: "26px", height: "26px", flexShrink: "0", borderRadius: "7px", overflow: "hidden", background: tag.color, color: tag.ink, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Archivo Black', Impact, sans-serif", fontSize: "13px" }}>
                {author && author.photo ? <img src={author.photo} alt="" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (a.author || '?')[0]}
              </span>
              {(a.author || '[author]').toLowerCase()}
            </div>
            <div style={{ marginTop: "9px", fontSize: "22px", fontWeight: "600", lineHeight: "1.2", letterSpacing: "-0.2px" }}>{a.title.toLowerCase()}</div>
          </div>
        </Link>
        {mark && <ByTape name={mark} style={{ right: "18px", top: "-10px" }} />}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "20px", padding: "12px 6px 0", color: "#1E2723" }}>
        <button onClick={() => setLiked(!liked)} aria-label={liked ? 'Unlike' : 'Like'} aria-pressed={liked ? 'true' : 'false'} style={{ minHeight: "36px", padding: "0", border: "0", background: "transparent", display: "flex", alignItems: "center", gap: "6px", color: liked ? '#F0442B' : '#1E2723' }}>
          <span ref={likeIcon} style={{ display: "flex" }}><svg {...icon} key={liked ? 'on' : 'off'} className={liked ? 'icon-pop' : undefined} fill={liked ? 'currentColor' : 'none'}><path d={HEART} /></svg></span>
        </button>
        <span style={{ marginLeft: "auto", fontFamily: "'Space Mono', monospace", fontSize: "12px", letterSpacing: "1px", textTransform: "uppercase" }}>{`${a.readTime || '[x]'} min`}</span>
      </div>
    </div>
  );
}

export function TilesView() {
  const { by, isMine, list } = useByWriter(); // ?by=<writer>: their pieces first, taped
  return (
    <>
      {/* "Articles" label card, tied to the intro card's knot */}
      <div className="hang sway" style={{ position: "absolute", left: "20px", top: "312px", width: "150px", height: "196px", "--a": "1.79deg", "--d": "5.0s", animationDelay: "-0.4s" }}>
        <div className="string" style={{ position: "absolute", left: "74.3px", top: "0", width: "1.4px", height: "62px", background: "#5B3A1E" }} />
        <div className="flutter" style={{ position: "absolute", left: "0", top: "60px", width: "150px", height: "136px", "--r": "-2.5deg", transform: "rotate(-2.5deg)", animationDelay: "-1.1s" }}>
          <div style={{ position: "absolute", left: "50%", top: "-6px", marginLeft: "-12px", width: "24px", height: "9px", background: "#F0442B", border: "1.5px solid #111111", boxSizing: "border-box", zIndex: "2" }} />
          <div style={{ width: "100%", height: "100%", boxSizing: "border-box", background: "#111111", color: "#F3EEE4", padding: "16px", border: "2px solid #111111", boxShadow: "6px 6px 0 #F0442B", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <h2 style={{ margin: "0", fontFamily: "'Caveat', cursive", fontWeight: "700", fontSize: "46px", lineHeight: "0.9" }}>Articles</h2>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "1.4px", textTransform: "uppercase", color: "#CFC8B8" }}>{`${pad2(ARTICLES.length)} pieces`}</div>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: "196px", top: "420px", width: "170px", fontFamily: "'Caveat', cursive", fontSize: "22px", lineHeight: "1.05", color: "#5B3A1E", transform: "rotate(-4deg)" }}>swipe through them →</div>
      <div className="tiles" aria-label="All write-ups, swipe sideways" style={{ position: "absolute", left: "0", top: "540px", width: "390px", display: "flex", gap: "12px", overflowX: "auto", overflowY: "hidden", scrollSnapType: "x mandatory", scrollPaddingLeft: "16px", padding: "0 16px 8px", boxSizing: "border-box", scrollbarWidth: "none", overscrollBehaviorX: "contain" }}>
        {list.map((a) => <Tile key={a.slug} a={a} mark={isMine(a) ? by : undefined} />)}
        <span style={{ flexShrink: "0", width: "6px" }} />
      </div>
    </>
  );
}

// ═════ 4 ═════════════════════════════════════════════════════════════════════════════════════════════
// 4. ViewSwitch: was in the phone header (src/pages/Home.jsx). view = 'hang' | 'scroll' | 'tiles'; pick(v) switched it
//    and remembered the choice in localStorage ('aq-articles-view'). Home rendered
//    view === 'scroll' ? <LineView /> : view === 'tiles' ? <TilesView /> : <HangingArticles />
//    inside a <div key={view} className="view-in"> so each switch faded the new view in (see archive.css).
export function ViewSwitch({ view, pick }) {
  return (
          <div className="view-switch" role="group" aria-label="Articles view (temporary)" style={{ display: "flex", padding: "2px", gap: "2px", border: "1.5px dashed #111111", borderRadius: "999px" }}>
            {[['hang', 'Hang'], ['scroll', 'Line'], ['tiles', 'Tiles']].map(([v, label]) => (
              <button key={v} onClick={() => pick(v)} aria-pressed={view === v ? 'true' : 'false'} style={{ minHeight: "30px", padding: "0 6px", border: "0", borderRadius: "999px", background: view === v ? '#111111' : 'transparent', color: view === v ? '#F3EEE4' : '#111111', fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "8px", letterSpacing: "0.5px", textTransform: "uppercase" }}>{label}</button>
            ))}
          </div>
  );
}
