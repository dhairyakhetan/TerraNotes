import { useState } from 'react';
import { Link } from 'react-router';
import Img from '../Img.jsx';
import { ARTICLES, COMING_SOON, TAGS } from '../../data/articles.js';
import { MEMBERS } from '../../data/team.js';
import { pad2 } from '../../lib/format.js';

// TEMPORARY: the phone's "tiles" view of the articles (switch in the header), to compare with the other two.
// Big rounded tiles in a sideways row, the next one peeking in; title panel over the picture, reactions under it.
// Reaction counts are SAMPLE numbers for the look only; they aren't stored anywhere.
const SAMPLE = [[61, 7, 4], [48, 3, 2], [93, 12, 9], [27, 2, 1], [35, 5, 3], [52, 6, 5]]; // likes, comments, reposts
const icon = { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" };
const count = { fontFamily: "'Space Mono', monospace", fontSize: "11px" };

function Tile({ a, i }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const tag = TAGS[a.tag];
  const author = MEMBERS.find((m) => m.name === a.author);
  const [likes, comments, reposts] = SAMPLE[i % SAMPLE.length];
  return (
    <div style={{ flexShrink: "0", width: "300px", scrollSnapAlign: "start" }}>
      <div style={{ position: "relative" }}>
        <Link className="tile" to={`/articles/${a.slug}`} style={{ position: "relative", display: "block", height: "380px", borderRadius: "22px", overflow: "hidden", border: "2px solid #111111", boxSizing: "border-box", textDecoration: "none" }}>
          <Img src={a.cover} alt={a.alt} box={{ height: "100%", border: "0" }} icon={24} font="12px" />
          <span style={{ position: "absolute", left: "12px", top: "12px", background: tag.color, color: tag.ink, fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "9px", letterSpacing: "1px", textTransform: "uppercase", padding: "4px 9px", borderRadius: "999px", border: "1.5px solid #111111" }}>{a.tag}</span>
          <span style={{ position: "absolute", right: "12px", top: "12px", background: "#FFFFFF", fontFamily: "'Space Mono', monospace", fontSize: "9px", letterSpacing: "1px", color: "#111111", padding: "4px 8px", borderRadius: "999px", border: "1.5px solid #111111" }}>{`${pad2(i + 1)} / ${pad2(ARTICLES.length)}`}</span>
          <div style={{ position: "absolute", left: "10px", right: "10px", bottom: "10px", boxSizing: "border-box", padding: "12px 52px 14px 14px", borderRadius: "16px", background: "rgba(30,39,35,.82)", WebkitBackdropFilter: "blur(8px)", backdropFilter: "blur(8px)", color: "#F3EEE4" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", opacity: ".85" }}>
              <span style={{ width: "22px", height: "22px", flexShrink: "0", borderRadius: "6px", overflow: "hidden", background: tag.color, color: tag.ink, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Archivo Black', Impact, sans-serif", fontSize: "11px" }}>
                {author && author.photo ? <img src={author.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (a.author || '?')[0]}
              </span>
              {(a.author || '[author]').toLowerCase()}
            </div>
            <div style={{ marginTop: "8px", fontSize: "18px", fontWeight: "600", lineHeight: "1.2" }}>{a.title.toLowerCase()}</div>
          </div>
        </Link>
        <button onClick={() => setSaved(!saved)} aria-label={saved ? 'Remove bookmark' : 'Bookmark'} aria-pressed={saved ? 'true' : 'false'} style={{ position: "absolute", right: "20px", bottom: "20px", width: "36px", height: "36px", padding: "0", border: "0", background: "transparent", color: saved ? '#F7C21A' : '#F3EEE4', display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg {...icon} fill={saved ? 'currentColor' : 'none'}><path d="M6 3 H18 V21 L12 16 L6 21 Z" /></svg>
        </button>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "18px", padding: "10px 6px 0", color: "#1E2723" }}>
        <button onClick={() => setLiked(!liked)} aria-label={liked ? 'Unlike' : 'Like'} aria-pressed={liked ? 'true' : 'false'} style={{ minHeight: "36px", padding: "0", border: "0", background: "transparent", display: "flex", alignItems: "center", gap: "6px", color: liked ? '#F0442B' : '#1E2723' }}>
          <svg {...icon} fill={liked ? 'currentColor' : 'none'}><path d="M12 20 C5 15 3 12 3 8.5 A4.5 4.5 0 0 1 12 6 A4.5 4.5 0 0 1 21 8.5 C21 12 19 15 12 20 Z" /></svg>
          <span style={count}>{likes + (liked ? 1 : 0)}</span>
        </button>
        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <svg {...icon}><path d="M4 5 H20 V16 H11 L6 20 V16 H4 Z" /></svg>
          <span style={count}>{comments}</span>
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <svg {...icon}><path d="M4 11 V9 A3 3 0 0 1 7 6 H19 L16 3 M20 13 V15 A3 3 0 0 1 17 18 H5 L8 21" /></svg>
          <span style={count}>{reposts}</span>
        </span>
        <span style={{ marginLeft: "auto", fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase" }}>{`${a.readTime || '[x]'} min`}</span>
      </div>
    </div>
  );
}

// A tile with no story yet.
function SoonTile({ text }) {
  return (
    <div style={{ flexShrink: "0", width: "300px", height: "380px", scrollSnapAlign: "start", boxSizing: "border-box", borderRadius: "22px", border: "2px dashed #8E7A5E", background: "#FBF8F1", padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "1.4px", color: "#8E7A5E" }}>ON THE LINE SOON</span>
      <p style={{ margin: "0", fontFamily: "'Caveat', cursive", fontSize: "34px", lineHeight: "1.05", color: "#5B3A1E", transform: "rotate(-2deg)" }}>{text}</p>
      <svg width="44" height="16" viewBox="0 0 34 14" fill="none" stroke="#8E7A5E" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><path d="M1 8 C8 3 14 12 21 7 S30 4 33 7" /></svg>
    </div>
  );
}

export default function TileArticles() {
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
      <div className="tiles" aria-label="All write-ups, swipe sideways" style={{ position: "absolute", left: "0", top: "540px", width: "390px", display: "flex", gap: "14px", overflowX: "auto", overflowY: "hidden", scrollSnapType: "x mandatory", scrollPaddingLeft: "20px", padding: "0 20px 8px", boxSizing: "border-box", scrollbarWidth: "none", overscrollBehaviorX: "contain" }}>
        {ARTICLES.map((a, i) => <Tile key={a.slug} a={a} i={i} />)}
        {COMING_SOON.map((text, i) => <SoonTile key={i} text={text} />)}
        <span style={{ flexShrink: "0", width: "6px" }} />
      </div>
    </>
  );
}
