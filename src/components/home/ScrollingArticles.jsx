import { useRef } from 'react';
import ArticleCard from '../ArticleCard.jsx';
import { DURATION, SoonCard, SWING, TILT, wirePath } from '../../web/ArticleLine.jsx';
import { ARTICLES, COMING_SOON } from '../../data/articles.js';
import { pad2 } from '../../lib/format.js';

// TEMPORARY: the phone's "scroll" view of the articles (switch in the header), to compare with the hanging view.
// Every write-up on one sideways line, like the web home page, then the COMING_SOON pegs.
const PITCH = 196;
const CARD_TOP = [62, 104, 74, 112, 68, 96, 100, 70, 84, 110, 76, 98]; // where each card's clip sits
const peg = (i) => {
  const x = 110 + PITCH * i, y = i % 2 ? 40 : 30;
  return { x, y, drop: CARD_TOP[i % 12] - y, tilt: TILT[i % 12], swing: SWING[i % 12], dur: DURATION[i % 3] };
};

export default function ScrollingArticles() {
  const scroller = useRef(null), bar = useRef(null), prev = useRef(null), next = useRef(null);
  const items = [...ARTICLES.map((a) => ({ a })), ...COMING_SOON.map((text) => ({ text }))];
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
                    ? <ArticleCard article={item.a} className="card" style={{ position: "absolute", left: "0", top: "0", width: "176px", height: "240px" }} imgH="92px" titleSize="15.5px" dekSize="15px" />
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
