import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { BackHome } from '../lib/backHome.jsx';
import PageHeader from '../components/PageHeader.jsx';
import MenuSheet from '../components/MenuSheet.jsx';
import ArticleCard from '../components/ArticleCard.jsx';
import Img from '../components/Img.jsx';
import Extra, { isExtra } from '../components/Extras.jsx';
import { placeOf, TAGS } from '../data/articles.js';
import { MEMBERS } from '../data/team.js';
import { pad2 } from '../lib/format.js';
import { useFitTitle } from '../lib/fit.js';

const P = { fontFamily: "'Newsreader', Georgia, serif", fontSize: "18px", lineHeight: "1.6", color: "#1E2723", margin: "0" };

// Drop cap: the first letter, plus any opening quote mark in front of it.
const cap = (t) => t.match(/^[“‘"'(]*./u)[0];

// One body block from the article's data (see src/data/articles.js).
function Block({ b, first, a, tag }) {
  if (typeof b === 'string') {
    if (!first) return <p style={P}>{b}</p>;
    // drop cap = the paragraph's first letter (the title's while the paragraph is still a [placeholder])
    const draft = b.startsWith('[');
    return <p style={P}><span style={{ float: "left", fontFamily: "'Archivo Black', Impact, sans-serif", fontSize: "62px", lineHeight: "0.8", margin: "6px 10px 0 0", padding: "6px 8px", background: tag.color, color: tag.ink, border: "2px solid #111111" }}>{draft ? a.title[0] : cap(b)}</span>{draft ? b : b.slice(cap(b).length)}</p>;
  }
  if (isExtra(b)) return <Extra b={b} tag={tag} />;
  if (b.h2 != null) {
    return <h2 style={{ margin: "10px 0 0", fontFamily: "'Archivo Black', Impact, sans-serif", fontWeight: "400", fontSize: "24px", lineHeight: "1", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "10px" }}><span style={{ width: "14px", height: "14px", background: tag.color, border: "2px solid #111111", flexShrink: "0" }} />{b.h2}</h2>;
  }
  if (b.quote != null) {
    return (
      <blockquote style={{ margin: "8px 0", boxSizing: "border-box", width: "342px", transform: "rotate(-1.5deg)", background: "#FFFFFF", border: "2px solid #111111", boxShadow: `8px 8px 0 ${tag.color}`, padding: "20px 18px 18px" }}>
        <div style={{ fontFamily: "'Archivo Black', Impact, sans-serif", fontSize: "26px", lineHeight: "1", textTransform: "uppercase", letterSpacing: "-0.4px" }}>{`“${b.quote}”`}</div>
        <div style={{ marginTop: "12px", fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase" }}>{`— ${b.by}`}</div>
      </blockquote>
    );
  }
  if (b.log) {
    return (
      <aside style={{ boxSizing: "border-box", width: "300px", marginLeft: "30px", transform: "rotate(1.2deg)", background: "#F7C21A", border: "2px solid #111111", boxShadow: "6px 6px 0 #111111", padding: "14px 16px", display: "flex", flexDirection: "column", gap: "8px", fontFamily: "'Space Mono', monospace", fontSize: "12px", lineHeight: "1.4" }}>
        <div style={{ fontFamily: "'Archivo Black', Impact, sans-serif", fontSize: "18px", textTransform: "uppercase", letterSpacing: "-0.2px" }}>Field log</div>
        {b.log.map(([label, value], i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", borderTop: "1.5px solid #111111", paddingTop: "6px" }}>
            <span>{label}</span>
            <span>{value}</span>
          </div>
        ))}
      </aside>
    );
  }
  if (b.photos) {
    const small = (p, { left, top, transform }) => (
      <figure style={{ position: "absolute", left, top, width: "158px", margin: "0", transform, background: "#FFFFFF", border: "2px solid #111111", boxShadow: "5px 5px 0 #111111", padding: "6px 6px 0" }}>
        <Img src={p.photo} alt={p.caption} label="photo" box={{ height: "130px" }} />
        <figcaption style={{ fontFamily: "'Caveat', cursive", fontSize: "16px", padding: "4px 0 6px" }}>{p.caption || '[caption]'}</figcaption>
      </figure>
    );
    return (
      <div style={{ position: "relative", height: "230px" }}>
        {small(b.photos[0], { left: "0", top: "0", transform: "rotate(-3deg)" })}
        {b.photos[1] && small(b.photos[1], { left: "176px", top: "40px", transform: "rotate(3deg)" })}
      </div>
    );
  }
  if (b.photo != null) {
    return (
      <figure style={{ position: "relative", margin: "10px 0 0 18px", width: "290px", transform: "rotate(2deg)" }}>
        <div style={{ position: "absolute", left: "50%", top: "-7px", marginLeft: "-15px", width: "30px", height: "9px", background: tag.color, border: "1.5px solid #111111", boxSizing: "border-box", zIndex: "2" }} />
        <div style={{ background: "#FFFFFF", border: "2px solid #111111", boxShadow: "6px 6px 0 #111111", padding: "8px 8px 0" }}>
          <Img src={b.photo} alt={b.caption} label="photo" box={{ height: "200px" }} />
          <figcaption style={{ fontFamily: "'Caveat', cursive", fontSize: "19px", padding: "6px 2px 8px" }}>{b.caption || "[caption — what we're looking at]"}</figcaption>
        </div>
      </figure>
    );
  }
  return null;
}

// One article (data: src/data/articles.js). `next` hangs on the "next on the line" wire.
export default function Article({ article: a, next }) {
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => { document.title = `Aquaterra — ${a.title}`; }, [a.title]);
  const tag = TAGS[a.tag];
  const author = MEMBERS.find((m) => m.name === a.author);
  const firstText = a.body.findIndex((b) => typeof b === 'string');
  const title = useFitTitle(a.title, 42, 30, 4); // a long title gets smaller rather than taller than four lines

  return (
    <>
      <div className="page-article" style={{ position: "relative", width: "390px", margin: "0 auto", overflow: "clip", background: "#F3EEE4", fontFamily: "'Figtree', system-ui, sans-serif", color: "#111111" }}>
        <PageHeader menuOpen={menuOpen} onOpenMenu={() => setMenuOpen(true)} />
        <div style={{ position: "absolute", left: "0", top: "100px", width: "390px", height: "2px", background: "#5B3A1E" }} />
        {/* hero: drops onto the wire when the page opens, then keeps swaying (styles/article.css).
            The hero, byline and body are in the page's flow: a taller hero pushes the rest down instead of running under it. */}
        <div className="hero-drop" style={{ position: "relative", margin: "70px 0 0 16px", width: "358px", minHeight: "484px", transformOrigin: "50% -32px" }}>
          <div className="hero-sway" style={{ transformOrigin: "50% -32px", transform: "rotate(-0.8deg)" }}>
            <div style={{ position: "absolute", left: "178.3px", top: "-32px", width: "1.4px", height: "34px", background: "#5B3A1E" }} />
            <div style={{ position: "absolute", left: "50%", top: "-7px", marginLeft: "-17px", width: "34px", height: "9px", background: tag.color, border: "1.5px solid #111111", boxSizing: "border-box", zIndex: "2" }} />
            <article style={{ boxSizing: "border-box", background: "#FFFFFF", border: "2px solid #111111", boxShadow: "8px 8px 0 #111111", padding: "10px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <Img src={a.cover} alt={a.alt} label={`${a.alt} — lead photo`} box={a.cover ? { height: "auto" } : { height: "240px" }} /> {/* a cover shows whole, at its own shape */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ background: tag.color, color: tag.ink, fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase", padding: "3px 8px", borderRadius: "999px", lineHeight: "1.2" }}>{a.tag}</span>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "1px", color: "#111111" }}>{`${pad2(placeOf(a).i + 1)} / ${pad2(placeOf(a).n)}`}</span>
              </div>
              <h1 ref={title} style={{ margin: "0", fontFamily: "'Archivo Black', Impact, sans-serif", fontWeight: "400", fontSize: "42px", lineHeight: "0.95", letterSpacing: "-0.3px", textTransform: "uppercase", color: "#111111" }}>{a.title}</h1>
              <p style={{ margin: "0", fontFamily: "'Caveat', cursive", fontSize: "22px", lineHeight: "1.1", color: "#5B4630" }}>{a.dek}</p>
            </article>
          </div>
        </div>
        <div className="rise-in" style={{ position: "relative", margin: "28px 0 0 20px", width: "350px", display: "flex", border: "2px solid #111111", background: "#FFFFFF", fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase" }}>
          <div style={{ flexGrow: "1", padding: "10px", borderRight: "2px solid #111111" }}>{`By ${a.author || '[Author]'}`}</div>
          <div style={{ padding: "10px", borderRight: "2px solid #111111" }}>{a.date || '[Date]'}</div>
          <div style={{ padding: "10px", background: tag.color, color: tag.ink }}>{`${a.readTime || '[x]'} min`}</div>
        </div>
        {/* body: the blocks stack with 22px gaps; the page grows with them */}
        <div className="rise-in" style={{ position: "relative", margin: "39px 0 0 24px", width: "342px", minHeight: "2606px", display: "flex", flexDirection: "column", gap: "22px" }}>
          {a.body.map((b, i) => <Block key={i} b={b} first={i === firstText} a={a} tag={tag} />)}
          <div style={{ width: "16px", height: "16px", background: "#111111" }} />
          {/* author */}
          <div style={{ margin: "18px 0 0 -4px", width: "350px", boxSizing: "border-box", background: "#FFFFFF", border: "2px solid #111111", boxShadow: "6px 6px 0 #111111", padding: "14px", display: "flex", gap: "14px", alignItems: "center" }}>
            <div style={{ width: "72px", height: "72px", flexShrink: "0", borderRadius: "50%", border: "2px solid #111111", background: "#E3E8D8", overflow: "hidden" }}>
              {author && author.photo
                ? <img src={author.photo} alt="" style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }} />
                : <svg width="68" height="68" viewBox="0 0 100 100" fill="none" stroke="#1E2723" strokeWidth="2" aria-hidden="true">
                    <circle cx="50" cy="40" r="13" />
                    <path d="M22 84 C24 60 76 60 78 84" />
                  </svg>}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "1px" }}>WORDS BY</div>
              <div style={{ fontFamily: "'Archivo Black', Impact, sans-serif", fontSize: "20px", textTransform: "uppercase", lineHeight: "1" }}>{a.author || '[Name]'}</div>
            </div>
          </div>
          {/* next on the line */}
          <div style={{ position: "relative", margin: "10px -24px 0", width: "390px", height: "470px" }}>
            <div style={{ position: "absolute", left: "20px", top: "0", fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "1.6px" }}>NEXT ON THE LINE</div>
            <div style={{ position: "absolute", left: "0", top: "30px", width: "390px", height: "2px", background: "#5B3A1E" }} />
            <div style={{ position: "absolute", left: "200px", top: "32px", width: "1.4px", height: "36px", background: "#5B3A1E" }} />
            <ArticleCard article={next} style={{ position: "absolute", left: "70px", top: "70px", width: "250px", height: "330px", transform: "rotate(-2deg)" }} imgH="150px" titleSize="22px" dekSize="18px" />
            <BackHome className="lift-link" style={{ position: "absolute", left: "20px", top: "420px", minHeight: "44px", display: "flex", alignItems: "center", fontFamily: "'Caveat', cursive", fontSize: "21px", textDecoration: "none" }}>← back to home</BackHome>
          </div>
        </div>
      </div>
      <MenuSheet open={menuOpen} onClose={() => setMenuOpen(false)} current="article" edge={tag.color} />
    </>
  );
}
