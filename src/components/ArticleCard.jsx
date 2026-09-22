import { Link } from 'react-router';
import Img from './Img.jsx';
import { ARTICLES, TAGS } from '../data/articles.js';
import { pad2 } from '../lib/format.js';

// Small hanging article card. Position and sizes come from the spot it hangs in.
export default function ArticleCard({ article: a, className, style, imgH, titleSize, dekSize }) {
  const tag = TAGS[a.tag];
  return (
    <Link to={`/articles/${a.slug}`} className={className} style={{ ...style, display: "block", textDecoration: "none", color: "#111111" }}>
      <div style={{ position: "absolute", left: "50%", top: "-6px", marginLeft: "-12px", width: "24px", height: "9px", background: tag.color, border: "1.5px solid #111111", boxSizing: "border-box", zIndex: "2" }} />
      <article style={{ width: "100%", height: "100%", boxSizing: "border-box", background: "#FFFFFF", border: "2px solid #111111", boxShadow: "6px 6px 0 #111111", padding: "8px", display: "flex", flexDirection: "column", gap: "7px", overflow: "hidden" }}>
        <Img src={a.cover} alt={a.alt} box={{ height: imgH }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ background: tag.color, color: tag.ink, fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "8.5px", letterSpacing: "1px", textTransform: "uppercase", padding: "3px 8px", borderRadius: "999px", lineHeight: "1.2" }}>{a.tag}</span>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", letterSpacing: "1px", color: "#111111" }}>{`${pad2(ARTICLES.indexOf(a) + 1)} / ${pad2(ARTICLES.length)}`}</span>
        </div>
        <h3 style={{ margin: "0", fontFamily: "'Archivo Black', Impact, sans-serif", fontWeight: "400", fontSize: titleSize, lineHeight: "0.95", letterSpacing: "-0.3px", textTransform: "uppercase", color: "#111111" }}>{a.title}</h3>
        <p style={{ margin: "0", fontFamily: "'Caveat', cursive", fontSize: dekSize, lineHeight: "1.1", color: "#5B4630" }}>{a.dek}</p>
      </article>
    </Link>
  );
}
