import { useEffect, useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router';
import WebHeader from './WebHeader.jsx';
import WebCard from './WebCard.jsx';
import Img from '../components/Img.jsx';
import Extra, { isExtra } from '../components/Extras.jsx';
import { PhotoIcon } from '../components/home/Members.jsx';
import { placeOf, TAGS } from '../data/articles.js';
import { MEMBERS } from '../data/team.js';
import { pad2 } from '../lib/format.js';
import { useFitTitle } from '../lib/fit.js';
import { BackHome } from '../lib/backHome.jsx';
import { FeaturedTape } from '../lib/byWriter.jsx';
import { flyInFromCard } from '../lib/fly.js';

const P = { fontFamily: "'Newsreader', Georgia, serif", fontSize: "21px", lineHeight: "1.65", color: "#1E2723", margin: "0" };
const MONO = { fontFamily: "'Space Mono', monospace", letterSpacing: "1px", textTransform: "uppercase" };

// Drop cap: the first letter, plus any opening quote mark in front of it.
const cap = (t) => t.match(/^[“‘"'(]*./u)[0];

// One body block (see src/data/articles.js). The field log isn't here: on web it sits in the right margin.
function Block({ b, first, a, tag }) {
  if (typeof b === 'string') {
    if (!first) return <p style={P}>{b}</p>;
    // drop cap = the paragraph's first letter (the title's while the paragraph is still a [placeholder])
    const draft = b.startsWith('[');
    return <p style={P}><span style={{ float: "left", fontFamily: "'Archivo Black', Impact, sans-serif", fontSize: "78px", lineHeight: "0.8", margin: "8px 14px 0 0", padding: "8px 10px", background: tag.color, color: tag.ink, border: "2px solid #111111" }}>{draft ? a.title[0] : cap(b)}</span>{draft ? b : b.slice(cap(b).length)}</p>;
  }
  if (isExtra(b)) return <Extra b={b} tag={tag} web />;
  if (b.h2 != null) {
    return <h2 style={{ margin: "12px 0 0", fontFamily: "'Archivo Black', Impact, sans-serif", fontWeight: "400", fontSize: "32px", lineHeight: "1", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "14px" }}><span style={{ width: "18px", height: "18px", background: tag.color, border: "2px solid #111111", flexShrink: "0" }} />{b.h2}</h2>;
  }
  if (b.quote != null) {
    return (
      <blockquote style={{ margin: "16px -120px", boxSizing: "border-box", transform: "rotate(-1.2deg)", background: "#FFFFFF", border: "2px solid #111111", boxShadow: `10px 10px 0 ${tag.color}`, padding: "30px 34px 26px" }}>
        <div style={{ fontFamily: "'Archivo Black', Impact, sans-serif", fontSize: "40px", lineHeight: "1", textTransform: "uppercase", letterSpacing: "-0.6px" }}>{`“${b.quote}”`}</div>
        <div style={{ ...MONO, marginTop: "14px", fontSize: "12px" }}>{`— ${b.by}`}</div>
      </blockquote>
    );
  }
  if (b.photos) {
    const small = (p, { left, top, transform }) => (
      <figure style={{ position: "absolute", left, top, width: "360px", margin: "0", transform, background: "#FFFFFF", border: "2px solid #111111", boxShadow: "7px 7px 0 #111111", padding: "9px 9px 0" }}>
        <Img src={p.photo} alt={p.caption} label="photo" box={{ height: "220px" }} icon={22} font="12px" />
        <figcaption style={{ fontFamily: "'Caveat', cursive", fontSize: "20px", padding: "6px 0 8px" }}>{p.caption || '[caption]'}</figcaption>
      </figure>
    );
    return (
      <div style={{ position: "relative", height: "330px" }}>
        {small(b.photos[0], { left: "-40px", top: "0", transform: "rotate(-3deg)" })}
        {b.photos[1] && small(b.photos[1], { left: "380px", top: "40px", transform: "rotate(3deg)" })}
      </div>
    );
  }
  if (b.photo != null) {
    return (
      <figure style={{ position: "relative", margin: "14px 0 0 40px", width: "600px", transform: "rotate(1.5deg)" }}>
        <div style={{ position: "absolute", left: "50%", top: "-8px", marginLeft: "-18px", width: "36px", height: "10px", background: tag.color, border: "1.5px solid #111111", boxSizing: "border-box", zIndex: "2" }} />
        <div style={{ background: "#FFFFFF", border: "2px solid #111111", boxShadow: "8px 8px 0 #111111", padding: "12px 12px 0" }}>
          <Img src={b.photo} alt={b.caption} label="photo" box={{ height: "360px" }} icon={22} font="12px" />
          <figcaption style={{ fontFamily: "'Caveat', cursive", fontSize: "24px", padding: "8px 2px 10px" }}>{b.caption || "[caption — what we're looking at]"}</figcaption>
        </div>
      </figure>
    );
  }
  return null;
}


// One article, web layout: cover on the left, title on the right, a 700px reading column, the field log in the margin.
export default function WebArticle({ article: a, next }) {
  const hero = useRef(null);
  useEffect(() => { document.title = `Aquaterra — ${a.title}`; }, [a.title]);
  useLayoutEffect(() => {
    flyInFromCard(hero.current);
  }, []);
  const tag = TAGS[a.tag];
  const author = MEMBERS.find((m) => m.name === a.author);
  const firstText = a.body.findIndex((b) => typeof b === 'string');
  const log = a.body.find((b) => b.log)?.log;
  const title = useFitTitle(a.title, 76, 54, 5); // a long title gets smaller rather than taller than five lines

  return (
    <div className="web">
      <div style={{ position: "relative", width: "1440px", margin: "0 auto", overflow: "clip", background: "#F3EEE4", fontFamily: "'Figtree', system-ui, sans-serif", color: "#111111" }}>
        <WebHeader />
        <BackHome className="lift-link" style={{ position: "absolute", left: "80px", top: "96px", minHeight: "44px", display: "flex", alignItems: "center", fontFamily: "'Caveat', cursive", fontSize: "24px", color: "#111111", textDecoration: "none" }}>← back to home</BackHome>
        <div style={{ position: "absolute", left: "0", top: "150px", width: "1440px", height: "2px", background: "#5B3A1E" }} />
        {/* hero: drops onto the wire when the page opens (or flies in from the card), then keeps swaying */}
        <div ref={hero} className="hero-drop" style={{ position: "absolute", left: "80px", top: "190px", width: a.cover ? "fit-content" : "620px", transformOrigin: "50% -38px" }}>
          <div className="hero-sway" style={{ transformOrigin: "50% -38px", transform: "rotate(-1deg)" }}>
            <div style={{ position: "absolute", left: "50%", marginLeft: "-0.7px", top: "-38px", width: "1.4px", height: "40px", background: "#5B3A1E" }} />
            <div style={{ position: "absolute", left: "50%", top: "-8px", marginLeft: "-20px", width: "40px", height: "10px", background: tag.color, border: "1.5px solid #111111", boxSizing: "border-box", zIndex: "2" }} />
            {a.featured && <FeaturedTape style={{ left: "-10px", top: "-12px", fontSize: "12px" }} />}
            <div style={{ background: "#FFFFFF", border: "2px solid #111111", boxShadow: `12px 12px 0 ${a.featured ? "#F7C21A" : "#111111"}`, padding: "14px" }}>
              <Img src={a.cover} alt={a.alt} label={`${a.alt} — lead photo`} box={a.cover ? { height: "560px", width: "auto", maxWidth: "620px" } : { height: "420px" }} icon={22} font="12px" /> {/* a cover shows whole */}
            </div>
          </div>
        </div>
        {/* title, dek and byline: in the page's flow, so a long title pushes the text down instead of running into it */}
        <div className="rise-in" style={{ position: "relative", margin: "120px 0 0 780px", width: "580px", minHeight: "560px", display: "flex", flexDirection: "column", gap: "22px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span style={{ ...MONO, background: tag.color, color: tag.ink, fontWeight: "700", fontSize: "12px", padding: "3px 9px", borderRadius: "999px", lineHeight: "1.3" }}>{a.tag}</span>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "13px", letterSpacing: "1px" }}>{`${pad2(placeOf(a).i + 1)} / ${pad2(placeOf(a).n)}`}</span>
          </div>
          <h1 ref={title} style={{ margin: "0", fontFamily: "'Archivo Black', Impact, sans-serif", fontWeight: "400", fontSize: "76px", lineHeight: "0.92", letterSpacing: "-1.5px", textTransform: "uppercase" }}>{a.title}</h1>
          <p style={{ margin: "0", fontFamily: "'Caveat', cursive", fontSize: "32px", lineHeight: "1.1", color: "#5B4630" }}>{a.dek}</p>
          <div style={{ ...MONO, display: "flex", border: "2px solid #111111", background: "#FFFFFF", fontSize: "12px", alignSelf: "flex-start" }}>
            {a.author !== null && <div style={{ padding: "12px 16px", borderRight: "2px solid #111111" }}>{`By ${a.author || '[Author]'}`}</div>}
            <div style={{ padding: "12px 16px", borderRight: "2px solid #111111" }}>{a.date || '[Date]'}</div>
            <div style={{ padding: "12px 16px", background: tag.color, color: tag.ink }}>{`${a.readTime || '[x]'} min read`}</div>
          </div>
        </div>
        {/* body: the reading column starts at y 800 (lower under a long title) and the page grows with it */}
        <div className="rise-in" style={{ position: "relative", margin: "40px 0 0 370px", width: "700px", display: "flex", flexDirection: "column", gap: "28px" }}>
          {/* field log, in the right margin beside the start of the text */}
          {log && (
            <aside style={{ position: "absolute", left: "740px", top: "30px", width: "260px", boxSizing: "border-box", transform: "rotate(1.5deg)", background: "#F7C21A", border: "2px solid #111111", boxShadow: "7px 7px 0 #111111", padding: "16px 18px", display: "flex", flexDirection: "column", gap: "9px", fontFamily: "'Space Mono', monospace", fontSize: "12px", lineHeight: "1.4" }}>
              <div style={{ fontFamily: "'Archivo Black', Impact, sans-serif", fontSize: "20px", textTransform: "uppercase" }}>Field log</div>
              {log.map(([label, value], i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: "10px", borderTop: "1.5px solid #111111", paddingTop: "7px" }}>
                  <span>{label}</span>
                  <span style={{ textAlign: "right" }}>{value}</span>
                </div>
              ))}
            </aside>
          )}
          {a.body.map((b, i) => <Block key={i} b={b} first={i === firstText} a={a} tag={tag} />)}
          <div style={{ width: "18px", height: "18px", background: "#111111" }} />
          {/* author (none for pieces from Aquaterra itself) */}
          {a.author !== null && (
          <div style={{ marginTop: "20px", boxSizing: "border-box", background: "#FFFFFF", border: "2px solid #111111", boxShadow: "7px 7px 0 #111111", padding: "18px", display: "flex", gap: "18px", alignItems: "center" }}>
            <div style={{ width: "88px", height: "88px", flexShrink: "0", boxSizing: "border-box", borderRadius: "50%", border: "2px solid #111111", background: "#F2F1ED", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {author && author.photo ? <img src={author.photo} alt="" style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }} /> : <PhotoIcon size={22} />}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "1px" }}>WORDS BY</div>
              <div style={{ fontFamily: "'Archivo Black', Impact, sans-serif", fontSize: "24px", textTransform: "uppercase", lineHeight: "1" }}>{a.author || '[Name]'}</div>
            </div>
          </div>
          )}
          {/* next on the line */}
          <div style={{ position: "relative", margin: "30px -370px 0", width: "1440px", height: "620px" }}>
            <div style={{ position: "absolute", left: "80px", top: "0", fontFamily: "'Space Mono', monospace", fontSize: "12px", letterSpacing: "1.8px" }}>NEXT ON THE LINE</div>
            <div style={{ position: "absolute", left: "0", top: "36px", width: "1440px", height: "2px", background: "#5B3A1E" }} />
            <div className="hang sway" style={{ position: "absolute", left: "550px", top: "38px", width: "340px", height: "512px", "--a": "0.81deg", "--d": "5.4s", animationDelay: "-1.2s" }}>
              <div style={{ position: "absolute", left: "169.3px", top: "0", width: "1.4px", height: "54px", background: "#5B3A1E" }} />
              <div className="flutter" style={{ position: "absolute", left: "0", top: "52px", width: "340px", height: "460px", "--r": "-2deg", transform: "rotate(-2deg)", animationDelay: "-1.9s" }}>
                <WebCard article={next} size="next" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
