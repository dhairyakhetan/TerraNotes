import { Link } from 'react-router';
import ArticleCard from '../ArticleCard.jsx';
import Img from '../Img.jsx';
import { ARTICLES, COMING_SOON, TAGS, PILL_FIT } from '../../data/articles.js';
import { SoonCard } from '../../web/ArticleLine.jsx';
import { pad2 } from '../../lib/format.js';
import { useFitTitle } from '../../lib/fit.js';
import { ByTape, useByWriter } from '../../lib/byWriter.jsx';

// Articles past the sixth hang in pairs below the wide card, a row each.
const MORE_ROWS = Math.ceil(Math.max(0, ARTICLES.length - 6) / 2), ROW = 300;
// How much taller than the page was drawn for (Home moves the sections below down by this much).
export const HANG_EXTRA = 270 + MORE_ROWS * ROW;

// All six articles hanging on strings from the intro card, in two columns with a wide card at the bottom:
//   left:  "Articles" label → 02 → 04        right: 01 (string from above the screen) → 03 → 05
//   06: the wide card, hanging from both 04 and 05. 07 onwards: in pairs below it.
// A card nested inside another card's box hangs from it and moves with it.
// .sway = swing on the string (--a angle, --d duration); .flutter = wobble around the clip (--r = resting tilt).
// With ?by=<writer> (their "Their articles" button) that writer's pieces come first, taped.
export default function HangingArticles() {
  const { by, isMine, list } = useByWriter();
  const [a1, a2, a3, a4, a5, a6, ...more] = list;
  const mark = (a) => (a && isMine(a) ? by : undefined);
  const a5w = a6; // the wide card
  const tag5 = a5w && TAGS[a5w.tag];
  const fit5 = useFitTitle(a5w?.title, 22, 15); // a long title shrinks to fit the wide card
  return (
    <>
      {/* 07 onwards: pairs below the wide card, each on its own string tucked behind the card above */}
      {more.map((a, i) => {
        const row = Math.floor(i / 2), alone = i % 2 === 0 && i === more.length - 1;
        const left = alone ? 112 : i % 2 ? 208 : 30, r = ['-1.2deg', '1.4deg'][i % 2];
        return (
          <div key={a.slug} className="hang sway" style={{ position: "absolute", left: `${left}px`, top: `${1376 + row * ROW}px`, width: "166px", height: "334px", "--a": "0.9deg", "--d": i % 2 ? "6.1s" : "5.5s", animationDelay: `${-0.8 - i}s` }}>
            <div className="string" style={{ position: "absolute", left: "82.3px", top: "0", width: "1.4px", height: "96px", background: "#5B3A1E" }} />
            <div className="flutter" style={{ position: "absolute", left: "0", top: "94px", width: "166px", height: "240px", "--r": r, transform: `rotate(${r})`, animationDelay: `${-1.5 - i}s` }}>
              <ArticleCard article={a} mark={mark(a)} className="card" style={{ position: "absolute", left: "0", top: "0", width: "166px", height: "240px" }} imgH="92px" titleSize="15px" dekSize="15px" />
            </div>
          </div>
        );
      })}
      {/* wide card (06): hangs from both card 04 and card 05; painted first so its strings tuck behind them */}
      <div className="hang sway" style={{ position: "absolute", left: "28px", top: "1052px", width: "334px", height: "344px", "--a": "0.35deg", "--d": "6.4s", animationDelay: "-2.6s" }}>
        <div className="string" style={{ position: "absolute", left: "121.3px", top: "0", width: "1.4px", height: "150px", background: "#5B3A1E" }} />
        <div className="string" style={{ position: "absolute", left: "261.3px", top: "100px", width: "1.4px", height: "50px", background: "#5B3A1E" }} />
        {a5w ? (
          <Link className="card" style={{ position: "absolute", left: "0", top: "148px", width: "334px", height: "196px", display: "block", textDecoration: "none", color: "#111111" }} to={`/articles/${a5w.slug}`}>
            {mark(a5w) && <ByTape name={by} />}
            <div style={{ position: "absolute", left: "110px", top: "-6px", marginLeft: "0", width: "24px", height: "9px", background: tag5.color, border: "1.5px solid #111111", boxSizing: "border-box", zIndex: "2" }} />
            <div style={{ position: "absolute", left: "250px", top: "-6px", marginLeft: "0", width: "24px", height: "9px", background: tag5.color, border: "1.5px solid #111111", boxSizing: "border-box", zIndex: "2" }} />
            <article style={{ width: "100%", height: "100%", boxSizing: "border-box", background: "#FFFFFF", border: "2px solid #111111", boxShadow: "7px 7px 0 #111111", padding: "8px", display: "flex", gap: "12px" }}>
              <Img src={a5w.cover} alt={a5w.alt} box={{ width: "122px", flexShrink: "0", height: "176px" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", paddingTop: "4px", flexGrow: "1" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "6px", flexShrink: "0" }}>
                  <span style={{ background: tag5.color, color: tag5.ink, fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "8.5px", letterSpacing: a5w.tag.length > 11 ? "0.2px" : "1px", textTransform: "uppercase", padding: "3px 8px", borderRadius: "999px", lineHeight: "1.2", ...PILL_FIT }}>{a5w.tag}</span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", letterSpacing: "1px", color: "#111111", whiteSpace: "nowrap", flexShrink: "0" }}>{`${pad2(ARTICLES.indexOf(a5w) + 1)} / ${pad2(ARTICLES.length)}`}</span>
                </div>
                <h3 ref={fit5} style={{ flexShrink: "0", margin: "0", fontFamily: "'Archivo Black', Impact, sans-serif", fontWeight: "400", fontSize: "22px", lineHeight: "0.95", letterSpacing: "-0.3px", textTransform: "uppercase", color: "#111111" }}>{a5w.title}</h3>
                <p style={{ flexShrink: "0", margin: "0", fontFamily: "'Caveat', cursive", fontSize: "16px", lineHeight: "1.1", color: "#5B4630" }}>{a5w.dek}</p>
              </div>
            </article>
          </Link>
        ) : <SoonCard text={COMING_SOON[0]} w={334} h={196} font="26px" clips={[110, 250]} style={{ top: "148px" }} />}
      </div>
      {/* 04 and 05 hang on their own strings, tucked behind 02 and 03 (not nested, so the swings don't add up) */}
      {[[a4, 30, 760, "-1.4deg", "5.6s", "-2.2s"], [a5, 208, 860, "1.2deg", "6.2s", "-0.6s"]].map(([a, left, top, r, d, delay]) => a && (
        <div key={a.slug} className="hang sway" style={{ position: "absolute", left: `${left}px`, top: `${top}px`, width: "166px", height: "312px", "--a": "0.9deg", "--d": d, animationDelay: delay }}>
          <div className="string" style={{ position: "absolute", left: "82.3px", top: "0", width: "1.4px", height: "74px", background: "#5B3A1E" }} />
          <div className="flutter" style={{ position: "absolute", left: "0", top: "72px", width: "166px", height: "240px", "--r": r, transform: `rotate(${r})`, animationDelay: delay }}>
            <ArticleCard article={a} mark={mark(a)} className="card" style={{ position: "absolute", left: "0", top: "0", width: "166px", height: "240px" }} imgH="92px" titleSize="15px" dekSize="15px" />
          </div>
        </div>
      ))}
      {/* "Articles" label card, tied to the intro card's knot; card 02 hangs from it */}
      <div className="hang sway" style={{ position: "absolute", left: "20px", top: "312px", width: "150px", height: "196px", "--a": "1.79deg", "--d": "5.0s", animationDelay: "-0.4s" }}>
        <div className="string" style={{ position: "absolute", left: "74.3px", top: "0", width: "1.4px", height: "62px", background: "#5B3A1E" }} />
        <div className="flutter" style={{ position: "absolute", left: "0", top: "60px", width: "150px", height: "136px", "--r": "-2.5deg", transform: "rotate(-2.5deg)", animationDelay: "-1.1s" }}>
          <div className="label-card" style={{ position: "absolute", left: "0", top: "0", width: "150px", height: "136px", display: "block", textDecoration: "none", color: "#111111" }}>
            <div style={{ position: "absolute", left: "50%", top: "-6px", marginLeft: "-12px", width: "24px", height: "9px", background: "#F0442B", border: "1.5px solid #111111", boxSizing: "border-box", zIndex: "2" }} />
            <div style={{ width: "100%", height: "100%", boxSizing: "border-box", background: "#111111", color: "#F3EEE4", padding: "16px", border: "2px solid #111111", boxShadow: "6px 6px 0 #F0442B", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <h2 style={{ margin: "0", fontFamily: "'Caveat', cursive", fontWeight: "700", fontSize: "46px", lineHeight: "0.9" }}>Articles</h2>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "1.4px", textTransform: "uppercase", color: "#CFC8B8" }}>{`${pad2(ARTICLES.length)} pieces`}</div>
            </div>
          </div>
          <div className="hang sway" style={{ position: "absolute", left: "6px", top: "136px", width: "176px", height: "272px", "--a": "1.51deg", "--d": "5.8s", animationDelay: "-3.4s" }}>
            <div className="string" style={{ position: "absolute", left: "87.3px", top: "0", width: "1.4px", height: "34px", background: "#5B3A1E" }} />
            <div className="flutter" style={{ position: "absolute", left: "0", top: "32px", width: "176px", height: "240px", "--r": "0.9deg", transform: "rotate(0.9deg)", animationDelay: "-4.1s" }}>
              <ArticleCard article={a2} mark={mark(a2)} className="card" style={{ position: "absolute", left: "0", top: "0", width: "176px", height: "240px" }} imgH="92px" titleSize="15.5px" dekSize="15px" />
            </div>
          </div>
        </div>
      </div>
      {/* card 01: its string comes in from above the screen; card 03 hangs from it */}
      <div className="hang sway" style={{ position: "absolute", left: "196px", top: "-60px", width: "176px", height: "648px", "--a": "0.76deg", "--d": "6.0s", animationDelay: "-2.0s" }}>
        <div className="string" style={{ position: "absolute", left: "87.3px", top: "0", width: "1.4px", height: "410px", background: "#5B3A1E" }} />
        <div className="flutter" style={{ position: "absolute", left: "0", top: "408px", width: "176px", height: "240px", "--r": "1.8deg", transform: "rotate(1.8deg)", animationDelay: "-2.7s" }}>
          <ArticleCard article={a1} mark={mark(a1)} className="card" style={{ position: "absolute", left: "0", top: "0", width: "176px", height: "240px" }} imgH="92px" titleSize="16px" dekSize="15px" />
          <div className="hang sway" style={{ position: "absolute", left: "16px", top: "240px", width: "166px", height: "292px", "--a": "1.33deg", "--d": "5.4s", animationDelay: "-1.1s" }}>
            <div className="string" style={{ position: "absolute", left: "82.3px", top: "0", width: "1.4px", height: "54px", background: "#5B3A1E" }} />
            <div className="flutter" style={{ position: "absolute", left: "0", top: "52px", width: "166px", height: "240px", "--r": "0.6deg", transform: "rotate(0.6deg)", animationDelay: "-1.8s" }}>
              <ArticleCard article={a3} mark={mark(a3)} className="card" style={{ position: "absolute", left: "0", top: "0", width: "166px", height: "240px" }} imgH="92px" titleSize="15px" dekSize="15px" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
