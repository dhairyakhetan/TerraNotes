import { Link } from 'react-router';
import ArticleCard from '../ArticleCard.jsx';
import Img from '../Img.jsx';
import { ARTICLES, COMING_SOON, TAGS } from '../../data/articles.js';
import { SoonCard } from '../../web/ArticleLine.jsx';
import { pad2 } from '../../lib/format.js';

// Articles hanging on strings from the intro card. Shows articles 01, 02, 03 and 05 (a coming-soon card until there is a 05).
// A card nested inside another card's box hangs from it and moves with it.
// .sway = swing on the string (--a angle, --d duration); .flutter = wobble around the clip (--r = resting tilt).
export default function HangingArticles() {
  const [a1, a2, a3, , a5] = ARTICLES;
  const tag5 = a5 && TAGS[a5.tag];
  return (
    <>
      {/* wide card: hangs from both card 02 and card 03; painted first so its strings tuck behind them */}
      <div className="hang sway" style={{ position: "absolute", left: "28px", top: "760px", width: "334px", height: "344px", "--a": "0.35deg", "--d": "6.4s", animationDelay: "-2.6s" }}>
        <div className="string" style={{ position: "absolute", left: "121.3px", top: "0", width: "1.4px", height: "150px", background: "#5B3A1E" }} />
        <div className="string" style={{ position: "absolute", left: "261.3px", top: "100px", width: "1.4px", height: "50px", background: "#5B3A1E" }} />
        {a5 ? (
          <Link className="card" style={{ position: "absolute", left: "0", top: "148px", width: "334px", height: "196px", display: "block", textDecoration: "none", color: "#111111" }} to={`/articles/${a5.slug}`}>
            <div style={{ position: "absolute", left: "110px", top: "-6px", marginLeft: "0", width: "24px", height: "9px", background: tag5.color, border: "1.5px solid #111111", boxSizing: "border-box", zIndex: "2" }} />
            <div style={{ position: "absolute", left: "250px", top: "-6px", marginLeft: "0", width: "24px", height: "9px", background: tag5.color, border: "1.5px solid #111111", boxSizing: "border-box", zIndex: "2" }} />
            <article style={{ width: "100%", height: "100%", boxSizing: "border-box", background: "#FFFFFF", border: "2px solid #111111", boxShadow: "7px 7px 0 #111111", padding: "8px", display: "flex", gap: "12px" }}>
              <Img src={a5.cover} alt={a5.alt} box={{ width: "122px", flexShrink: "0", height: "176px" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", paddingTop: "4px", flexGrow: "1" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ background: tag5.color, color: tag5.ink, fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "8.5px", letterSpacing: "1px", textTransform: "uppercase", padding: "3px 8px", borderRadius: "999px", lineHeight: "1.2" }}>{a5.tag}</span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", letterSpacing: "1px", color: "#111111" }}>{`${pad2(ARTICLES.indexOf(a5) + 1)} / ${pad2(ARTICLES.length)}`}</span>
                </div>
                <h3 style={{ margin: "0", fontFamily: "'Archivo Black', Impact, sans-serif", fontWeight: "400", fontSize: "22px", lineHeight: "0.95", letterSpacing: "-0.3px", textTransform: "uppercase", color: "#111111" }}>{a5.title}</h3>
                <p style={{ margin: "0", fontFamily: "'Caveat', cursive", fontSize: "16px", lineHeight: "1.1", color: "#5B4630" }}>{a5.dek}</p>
              </div>
            </article>
          </Link>
        ) : <SoonCard text={COMING_SOON[0]} w={334} h={196} font="26px" clips={[110, 250]} style={{ top: "148px" }} />}
      </div>
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
              <ArticleCard article={a2} className="card" style={{ position: "absolute", left: "0", top: "0", width: "176px", height: "240px" }} imgH="92px" titleSize="15.5px" dekSize="15px" />
            </div>
          </div>
        </div>
      </div>
      {/* card 01: its string comes in from above the screen; card 03 hangs from it */}
      <div className="hang sway" style={{ position: "absolute", left: "196px", top: "-60px", width: "176px", height: "648px", "--a": "0.76deg", "--d": "6.0s", animationDelay: "-2.0s" }}>
        <div className="string" style={{ position: "absolute", left: "87.3px", top: "0", width: "1.4px", height: "410px", background: "#5B3A1E" }} />
        <div className="flutter" style={{ position: "absolute", left: "0", top: "408px", width: "176px", height: "240px", "--r": "1.8deg", transform: "rotate(1.8deg)", animationDelay: "-2.7s" }}>
          <ArticleCard article={a1} className="card" style={{ position: "absolute", left: "0", top: "0", width: "176px", height: "240px" }} imgH="92px" titleSize="16px" dekSize="15px" />
          <div className="hang sway" style={{ position: "absolute", left: "16px", top: "240px", width: "166px", height: "292px", "--a": "1.33deg", "--d": "5.4s", animationDelay: "-1.1s" }}>
            <div className="string" style={{ position: "absolute", left: "82.3px", top: "0", width: "1.4px", height: "54px", background: "#5B3A1E" }} />
            <div className="flutter" style={{ position: "absolute", left: "0", top: "52px", width: "166px", height: "240px", "--r": "0.6deg", transform: "rotate(0.6deg)", animationDelay: "-1.8s" }}>
              <ArticleCard article={a3} className="card" style={{ position: "absolute", left: "0", top: "0", width: "166px", height: "240px" }} imgH="92px" titleSize="15px" dekSize="15px" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
