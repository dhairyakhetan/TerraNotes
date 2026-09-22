import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import PageHeader from '../components/PageHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import MenuSheet from '../components/MenuSheet.jsx';

/*
  Single Article screen (mobile) — one template for all six write-ups (data: src/data/articles.js).
  Phone design, 390px wide: everything below the sticky header is absolutely positioned inside the
  root; coordinates are page px from the top-left.
  `a` = this article, `next` = the one hanging on the "next on the line" wire.
*/
export default function Article({ article: a, next }) {
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => { document.title = `Aquaterra — ${a.title}`; }, [a.title]);

  return (
    <>
      <div className="page-article" style={{ position: "relative", width: "390px", height: "3500px", margin: "0 auto", overflow: "clip", background: "#F3EEE4", fontFamily: "'Figtree', system-ui, sans-serif", color: "#111111" }}>
        <PageHeader backTo="/articles" backLabel="Back to all articles" menuOpen={menuOpen} onOpenMenu={() => setMenuOpen(true)} />
        {/* hero card on the wire */}
        <div style={{ position: "absolute", left: "0", top: "100px", width: "390px", height: "2px", background: "#5B3A1E" }} />
        {/* HERO — drops onto the line when the page opens (.hero-drop), then keeps hanging with a slow sway (.hero-sway).
           Motion lives in styles/article.css under "PAGE OPEN". The short string is part of the card so it moves with it. */}
        <div className="hero-drop" style={{ position: "absolute", left: "16px", top: "134px", width: "358px", transformOrigin: "50% -32px" }}>
          <div className="hero-sway" style={{ transformOrigin: "50% -32px", transform: "rotate(-0.8deg)" }}>
            <div style={{ position: "absolute", left: "178.3px", top: "-32px", width: "1.4px", height: "34px", background: "#5B3A1E" }} />
            <div style={{ position: "absolute", left: "50%", top: "-7px", marginLeft: "-17px", width: "34px", height: "9px", background: a.color, border: "1.5px solid #111111", boxSizing: "border-box", zIndex: "2" }} />
            <article style={{ boxSizing: "border-box", background: "#FFFFFF", border: "2px solid #111111", boxShadow: "8px 8px 0 #111111", padding: "10px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ height: "240px", background: "#F2F1ED", border: "1.5px dashed #B9B5AA", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px", fontSize: "11px", color: "#444" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.6" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="16" rx="1" />
                  <circle cx="9" cy="10" r="2" />
                  <path d="M3 17 L9 13 L13 16 L16 13 L21 17" />
                </svg>
                <span>{a.photo} — lead photo</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ background: a.color, color: a.ink, fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase", padding: "3px 8px", borderRadius: "999px", lineHeight: "1.2" }}>{a.tag}</span>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "1px", color: "#111111" }}>{a.num} / 06</span>
              </div>
              <h1 style={{ margin: "0", fontFamily: "'Archivo Black', Impact, sans-serif", fontWeight: "400", fontSize: "42px", lineHeight: "0.95", letterSpacing: "-0.3px", textTransform: "uppercase", color: "#111111" }}>{a.title}</h1>
              <p style={{ margin: "0", fontFamily: "'Caveat', cursive", fontSize: "22px", lineHeight: "1.1", color: "#5B4630" }}>{a.dek}</p>
            </article>
          </div>
        </div>
        {/* meta strip */}
        <div className="rise-in" style={{ position: "absolute", left: "20px", top: "646px", width: "350px", display: "flex", border: "2px solid #111111", background: "#FFFFFF", fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase" }}>
          <div style={{ flexGrow: "1", padding: "10px", borderRight: "2px solid #111111" }}>By [Author]</div>
          <div style={{ padding: "10px", borderRight: "2px solid #111111" }}>[Date]</div>
          <div style={{ padding: "10px", background: a.color, color: a.ink }}>[x] min</div>
        </div>
        {/* ============ BODY — BLOCK LIBRARY (provision for adding elements) ============
        The body is a vertical flex column: drop any block below in any order and it stacks with 22px gaps.
        Copy a block from this page and change its text/colour. Available blocks:
          • PARAGRAPH ........ <p> Newsreader 18px/1.6
          • DROP-CAP PARAGRAPH  first <p>, with the coloured square letter
          • FIELD LOG ........ yellow <aside> of key facts (label / value rows) — add or remove rows freely
          • PULL QUOTE ....... tilted <blockquote> with the article-colour hard shadow
          • PINNED PHOTO ..... <figure> with a clip + handwritten caption (swap the placeholder for an <img>)
          • SECTION HEADING .. <h2> with the coloured square
          • PHOTO PAIR ....... two small tilted photos, staggered
          • END MARK ......... the small black square that closes the piece
        Adding content makes the page longer: raise the root height (and this column's height) by the same amount,
        or the bottom (author card / next article / footer) gets clipped.
        The whole body fades up after the hero lands (.rise-in). */}
        <div className="rise-in" style={{ position: "absolute", left: "24px", top: "724px", width: "342px", height: "2776px", display: "flex", flexDirection: "column", gap: "22px" }}>
          <p style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: "18px", lineHeight: "1.6", color: "#1E2723", margin: "0" }}><span style={{ float: "left", fontFamily: "'Archivo Black', Impact, sans-serif", fontSize: "62px", lineHeight: "0.8", margin: "6px 10px 0 0", padding: "6px 8px", background: a.color, color: a.ink, border: "2px solid #111111" }}>{a.title[0]}</span>{a.opening}</p>
          <p style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: "18px", lineHeight: "1.6", color: "#1E2723", margin: "0" }}>{a.second}</p>
          {/* field log tile */}
          <aside style={{ boxSizing: "border-box", width: "300px", marginLeft: "30px", transform: "rotate(1.2deg)", background: "#F7C21A", border: "2px solid #111111", boxShadow: "6px 6px 0 #111111", padding: "14px 16px", display: "flex", flexDirection: "column", gap: "8px", fontFamily: "'Space Mono', monospace", fontSize: "12px", lineHeight: "1.4" }}>
            <div style={{ fontFamily: "'Archivo Black', Impact, sans-serif", fontSize: "18px", textTransform: "uppercase", letterSpacing: "-0.2px" }}>Field log</div>
            <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1.5px solid #111111", paddingTop: "6px" }}>
              <span>PLACE</span>
              <span>[Location]</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1.5px solid #111111", paddingTop: "6px" }}>
              <span>VISITS</span>
              <span>{a.visits}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1.5px solid #111111", paddingTop: "6px" }}>
              <span>DATES</span>
              <span>[Dates]</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1.5px solid #111111", paddingTop: "6px" }}>
              <span>KIT</span>
              <span>{a.kit}</span>
            </div>
          </aside>
          <p style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: "18px", lineHeight: "1.6", color: "#1E2723", margin: "0" }}>[Third paragraph. The first morning: what you saw, who you met, what surprised you.]</p>
          <p style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: "18px", lineHeight: "1.6", color: "#1E2723", margin: "0" }}>[Fourth paragraph. Let the story turn — something changed, or something was already gone.]</p>
          {/* pull quote */}
          <blockquote style={{ margin: "8px 0", boxSizing: "border-box", width: "342px", transform: "rotate(-1.5deg)", background: "#FFFFFF", border: "2px solid #111111", boxShadow: `8px 8px 0 ${a.color}`, padding: "20px 18px 18px" }}>
            <div style={{ fontFamily: "'Archivo Black', Impact, sans-serif", fontSize: "26px", lineHeight: "1", textTransform: "uppercase", letterSpacing: "-0.4px" }}>“[A line from the piece worth pulling out.]”</div>
            <div style={{ marginTop: "12px", fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "1px" }}>— [WHO SAID IT]</div>
          </blockquote>
          {/* pinned photo */}
          <figure style={{ position: "relative", margin: "10px 0 0 18px", width: "290px", transform: "rotate(2deg)" }}>
            <div style={{ position: "absolute", left: "50%", top: "-7px", marginLeft: "-15px", width: "30px", height: "9px", background: a.color, border: "1.5px solid #111111", boxSizing: "border-box", zIndex: "2" }} />
            <div style={{ background: "#FFFFFF", border: "2px solid #111111", boxShadow: "6px 6px 0 #111111", padding: "8px 8px 0" }}>
              <div style={{ height: "200px", background: "#F2F1ED", border: "1.5px dashed #B9B5AA", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px", fontSize: "11px", color: "#444" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.6" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="16" rx="1" />
                  <circle cx="9" cy="10" r="2" />
                  <path d="M3 17 L9 13 L13 16 L16 13 L21 17" />
                </svg>
                <span>photo</span>
              </div>
              <figcaption style={{ fontFamily: "'Caveat', cursive", fontSize: "19px", padding: "6px 2px 8px" }}>[caption — what we're looking at]</figcaption>
            </div>
          </figure>
          <p style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: "18px", lineHeight: "1.6", color: "#1E2723", margin: "0" }}>[Fifth paragraph. The second morning. Pick up where the photo leaves off.]</p>
          <h2 style={{ margin: "10px 0 0", fontFamily: "'Archivo Black', Impact, sans-serif", fontWeight: "400", fontSize: "24px", lineHeight: "1", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "10px" }}><span style={{ width: "14px", height: "14px", background: a.color, border: "2px solid #111111", flexShrink: "0" }} />[Section heading]</h2>
          <p style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: "18px", lineHeight: "1.6", color: "#1E2723", margin: "0" }}>[Sixth paragraph. What the numbers, the people, or the place itself are saying now.]</p>
          {/* two small photos, staggered */}
          <div style={{ position: "relative", height: "230px" }}>
            <figure style={{ position: "absolute", left: "0", top: "0", width: "158px", margin: "0", transform: "rotate(-3deg)", background: "#FFFFFF", border: "2px solid #111111", boxShadow: "5px 5px 0 #111111", padding: "6px 6px 0" }}>
              <div style={{ height: "130px", background: "#F2F1ED", border: "1.5px dashed #B9B5AA", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px", fontSize: "11px", color: "#444" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.6" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="16" rx="1" />
                  <circle cx="9" cy="10" r="2" />
                  <path d="M3 17 L9 13 L13 16 L16 13 L21 17" />
                </svg>
                <span>photo</span>
              </div>
              <figcaption style={{ fontFamily: "'Caveat', cursive", fontSize: "16px", padding: "4px 0 6px" }}>[caption]</figcaption>
            </figure>
            <figure style={{ position: "absolute", left: "176px", top: "40px", width: "158px", margin: "0", transform: "rotate(3deg)", background: "#FFFFFF", border: "2px solid #111111", boxShadow: "5px 5px 0 #111111", padding: "6px 6px 0" }}>
              <div style={{ height: "130px", background: "#F2F1ED", border: "1.5px dashed #B9B5AA", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px", fontSize: "11px", color: "#444" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.6" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="16" rx="1" />
                  <circle cx="9" cy="10" r="2" />
                  <path d="M3 17 L9 13 L13 16 L16 13 L21 17" />
                </svg>
                <span>photo</span>
              </div>
              <figcaption style={{ fontFamily: "'Caveat', cursive", fontSize: "16px", padding: "4px 0 6px" }}>[caption]</figcaption>
            </figure>
          </div>
          <p style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: "18px", lineHeight: "1.6", color: "#1E2723", margin: "0" }}>[Closing paragraph. End on an image, not a summary.]</p>
          <div style={{ width: "16px", height: "16px", background: "#111111" }} />
          {/* author tile */}
          <div style={{ margin: "18px 0 0 -4px", width: "350px", boxSizing: "border-box", background: "#FFFFFF", border: "2px solid #111111", boxShadow: "6px 6px 0 #111111", padding: "14px", display: "flex", gap: "14px", alignItems: "center" }}>
            <div style={{ width: "72px", height: "72px", flexShrink: "0", borderRadius: "50%", border: "2px solid #111111", background: "#E3E8D8", overflow: "hidden" }}>
              <svg width="68" height="68" viewBox="0 0 100 100" fill="none" stroke="#1E2723" strokeWidth="2" aria-hidden="true">
                <circle cx="50" cy="40" r="13" />
                <path d="M22 84 C24 60 76 60 78 84" />
              </svg>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "1px" }}>WORDS BY</div>
              <div style={{ fontFamily: "'Archivo Black', Impact, sans-serif", fontSize: "20px", textTransform: "uppercase", lineHeight: "1" }}>[Name]</div>
              <div style={{ fontFamily: "'Caveat', cursive", fontSize: "17px", color: "#5B3A1E" }}>[role / one line about them]</div>
            </div>
          </div>
          {/* next up: hanging card */}
          <div style={{ position: "relative", margin: "10px -24px 0", width: "390px", height: "470px" }}>
            <div style={{ position: "absolute", left: "20px", top: "0", fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "1.6px" }}>NEXT ON THE LINE</div>
            <div style={{ position: "absolute", left: "0", top: "30px", width: "390px", height: "2px", background: "#5B3A1E" }} />
            <div style={{ position: "absolute", left: "200px", top: "32px", width: "1.4px", height: "36px", background: "#5B3A1E" }} />
            <Link style={{ position: "absolute", left: "70px", top: "70px", width: "250px", height: "330px", transform: "rotate(-2deg)", display: "block", textDecoration: "none", color: "#111111" }} to={`/articles/${next.slug}`}>
              <div style={{ position: "absolute", left: "50%", top: "-6px", marginLeft: "-12px", width: "24px", height: "9px", background: next.color, border: "1.5px solid #111111", boxSizing: "border-box", zIndex: "2" }} />
              <article style={{ width: "100%", height: "100%", boxSizing: "border-box", background: "#FFFFFF", border: "2px solid #111111", boxShadow: "6px 6px 0 #111111", padding: "8px", display: "flex", flexDirection: "column", gap: "7px", overflow: "hidden" }}>
                <div style={{ height: "150px", background: "#F2F1ED", border: "1.5px dashed #B9B5AA", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px", fontSize: "11px", color: "#444" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.6" aria-hidden="true">
                    <rect x="3" y="4" width="18" height="16" rx="1" />
                    <circle cx="9" cy="10" r="2" />
                    <path d="M3 17 L9 13 L13 16 L16 13 L21 17" />
                  </svg>
                  <span>{next.photo}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ background: next.color, color: next.ink, fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "8.5px", letterSpacing: "1px", textTransform: "uppercase", padding: "3px 8px", borderRadius: "999px", lineHeight: "1.2" }}>{next.tag}</span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", letterSpacing: "1px", color: "#111111" }}>{next.num} / 06</span>
                </div>
                <h3 style={{ margin: "0", fontFamily: "'Archivo Black', Impact, sans-serif", fontWeight: "400", fontSize: "22px", lineHeight: "0.95", letterSpacing: "-0.3px", textTransform: "uppercase", color: "#111111" }}>{next.title}</h3>
                <p style={{ margin: "0", fontFamily: "'Caveat', cursive", fontSize: "18px", lineHeight: "1.1", color: "#5B4630" }}>{next.dek}</p>
              </article>
            </Link>
            <Link style={{ position: "absolute", left: "20px", top: "420px", minHeight: "44px", display: "flex", alignItems: "center", fontFamily: "'Caveat', cursive", fontSize: "21px", textDecoration: "none" }} to="/articles">← back to all articles</Link>
          </div>
          <div style={{ margin: "auto -24px 0", width: "390px", position: "relative", height: "170px" }}>
            <SiteFooter top="0px" />
          </div>
        </div>
      </div>
      <MenuSheet open={menuOpen} onClose={() => setMenuOpen(false)} current="article" edge={a.color} />
    </>
  );
}
