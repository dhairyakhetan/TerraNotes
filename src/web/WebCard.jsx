import { Link } from 'react-router';
import Img from '../components/Img.jsx';
import { ARTICLES, TAGS } from '../data/articles.js';
import { pad2 } from '../lib/format.js';
import { rememberCard } from '../lib/fly.js';

// Web article card. 'line' = the small card on the home page's line; 'next' = the big "next on the line" card.
const SIZES = {
  line: { w: 172, h: 272, clip: 28, pad: 10, gap: 9, shadow: 6, img: 108, pill: '10px', num: '10px', slash: '/', title: '16px', dek: '16px' },
  next: { w: 340, h: 460, clip: 32, pad: 12, gap: 12, shadow: 8, img: 200, pill: '11px', num: '11px', slash: ' / ', title: '28px', dek: '21px' },
};

export default function WebCard({ article: a, size = 'line' }) {
  const z = SIZES[size];
  const tag = TAGS[a.tag];
  return (
    <Link className="card-link" to={`/articles/${a.slug}`} onClick={rememberCard} style={{ position: "absolute", left: "0", top: "0", width: `${z.w}px`, height: `${z.h}px`, display: "block", textDecoration: "none", color: "#111111" }}>
      <div style={{ position: "absolute", left: "50%", top: "-7px", marginLeft: `-${z.clip / 2}px`, width: `${z.clip}px`, height: "10px", background: tag.color, border: "1.5px solid #111111", boxSizing: "border-box", zIndex: "2" }} />
      <article style={{ width: "100%", height: "100%", boxSizing: "border-box", background: "#FFFFFF", border: "2px solid #111111", boxShadow: `${z.shadow}px ${z.shadow}px 0 #111111`, padding: `${z.pad}px`, display: "flex", flexDirection: "column", gap: `${z.gap}px`, overflow: "hidden" }}>
        <Img src={a.cover} alt={a.alt} box={{ height: `${z.img}px` }} icon={22} font="12px" />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ background: tag.color, color: tag.ink, fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: z.pill, letterSpacing: "1px", textTransform: "uppercase", padding: "3px 9px", borderRadius: "999px", lineHeight: "1.3", whiteSpace: "nowrap" }}>{a.tag}</span>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: z.num, letterSpacing: "1px", color: "#111111", whiteSpace: "nowrap" }}>{`${pad2(ARTICLES.indexOf(a) + 1)}${z.slash}${pad2(ARTICLES.length)}`}</span>
        </div>
        <h3 style={{ margin: "0", fontFamily: "'Archivo Black', Impact, sans-serif", fontWeight: "400", fontSize: z.title, lineHeight: "0.95", letterSpacing: "-0.3px", textTransform: "uppercase", color: "#111111" }}>{a.title}</h3>
        <p style={{ margin: "0", fontFamily: "'Caveat', cursive", fontSize: z.dek, lineHeight: "1.1", color: "#5B4630" }}>{a.dek}</p>
        {size === 'next' && (
          <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase" }}>
            <span>{a.author || '[Author]'}</span>
            <span>{`${a.readTime || '[x]'} min read →`}</span>
          </div>
        )}
      </article>
    </Link>
  );
}
