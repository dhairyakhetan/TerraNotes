import { useRef, useState } from 'react';
import WebCard from './WebCard.jsx';
import { ARTICLES, COMING_SOON } from '../data/articles.js';
import { pad2 } from '../lib/format.js';

// Peg i hangs from x = 164 + 208·i on the wire; these repeat every 12 pegs.
const PITCH = 208;
const CARD_TOP = [106, 158, 118, 180, 112, 150, 162, 118, 136, 184, 122, 160]; // where each card's clip sits
const TILT = [-2.2, 1.6, -1.2, 2.4, -1.8, 1.4, -2.6, 1.9, -1.1, 2.2, -1.6, 1.2];
const SWING = [1.75, 1.39, 1.63, 1.26, 1.69, 1.45, 1.3, 1.73, 1.48, 1.23, 1.59, 1.38];
const DURATION = [4.8, 5.5, 6.2];

const peg = (i) => {
  const x = 164 + PITCH * i, y = i % 2 ? 88 : 78, drop = CARD_TOP[i % 12] - y;
  return { x, y, drop, tilt: TILT[i % 12], swing: SWING[i % 12], dur: DURATION[i % 3] };
};

// The wire: sags between pegs, runs off both ends of the track.
const wirePath = (pegs, width) => {
  let d = `M0 78 Q82 100 ${pegs[0].x} ${pegs[0].y}`;
  for (let i = 1; i < pegs.length; i++) d += ` Q${(pegs[i - 1].x + pegs[i].x) / 2} 110 ${pegs[i].x} ${pegs[i].y}`;
  const last = pegs[pegs.length - 1];
  return `${d} Q${(last.x + width) / 2} 110 ${width} 78`;
};

// A peg with no story yet: dashed card with a handwritten note.
function SoonCard({ text }) {
  return (
    <div style={{ position: "absolute", left: "0", top: "0", width: "172px", height: "272px" }}>
      <div style={{ position: "absolute", left: "50%", top: "-7px", marginLeft: "-14px", width: "28px", height: "10px", background: "#D9D1BF", border: "1.5px solid #111111", boxSizing: "border-box", zIndex: "2" }} />
      <div style={{ width: "100%", height: "100%", boxSizing: "border-box", background: "#FBF8F1", border: "2px dashed #8E7A5E", padding: "14px 14px 16px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "1.4px", color: "#8E7A5E" }}>ON THE LINE SOON</span>
        <p style={{ margin: "0", fontFamily: "'Caveat', cursive", fontSize: "27px", lineHeight: "1.05", color: "#5B3A1E", transform: "rotate(-2deg)" }}>{text}</p>
        <svg width="34" height="14" viewBox="0 0 34 14" fill="none" stroke="#8E7A5E" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
          <path d="M1 8 C8 3 14 12 21 7 S30 4 33 7" />
        </svg>
      </div>
    </div>
  );
}

// Every write-up on one line (this replaces the phone's "All articles" page), followed by empty pegs.
// Scroll with a trackpad, shift+wheel, the scrollbar, the keyboard or the arrows; the bar shows how far along you are.
export default function ArticleLine() {
  const scroller = useRef(null);
  const [progress, setProgress] = useState(0); // 0…1
  const items = [...ARTICLES.map((a) => ({ a })), ...COMING_SOON.map((text) => ({ text }))];
  const pegs = items.map((_, i) => peg(i));
  const width = pegs[pegs.length - 1].x + 224;
  const onScroll = (e) => {
    const el = e.currentTarget, max = el.scrollWidth - el.clientWidth;
    const p = max > 0 ? el.scrollLeft / max : 0;
    if (Math.abs(p - progress) > 0.01 || p === 0 || p === 1) setProgress(p);
  };
  const scrollBy = (dx) => scroller.current.scrollBy({ left: dx, behavior: 'smooth' });
  const arrow = { width: "48px", height: "48px", padding: "0", border: "2px solid #111111", boxShadow: "4px 4px 0 #111111", display: "flex", alignItems: "center", justifyContent: "center" };

  return (
    <>
      <section id="articles" aria-label="Articles" style={{ position: "absolute", left: "0", top: "420px", width: "1440px", height: "700px" }} />
      {/* where the wire comes out of the label card and into the line */}
      <div style={{ position: "absolute", left: "282px", top: "547px", width: "20px", height: "1.8px", background: "#5B3A1E" }} />
      <svg width="12" height="12" viewBox="0 0 12 12" style={{ position: "absolute", left: "276px", top: "542px" }} aria-hidden="true"><circle cx="6" cy="6" r="4" fill="#111111" /></svg>
      {/* "Articles" label card, tied to the intro card's knot */}
      <div className="hang sway" style={{ position: "absolute", left: "110px", top: "430px", width: "170px", height: "234px", "--a": "1deg", "--d": "5.2s", animationDelay: "-0.4s" }}>
        <div style={{ position: "absolute", left: "84.3px", top: "0", width: "1.4px", height: "82px", background: "#5B3A1E" }} />
        <div className="flutter" style={{ position: "absolute", left: "0", top: "80px", width: "170px", height: "154px", "--r": "-2.5deg", transform: "rotate(-2.5deg)" }}>
          <div style={{ position: "absolute", left: "50%", top: "-7px", marginLeft: "-14px", width: "28px", height: "10px", background: "#F0442B", border: "1.5px solid #111111", boxSizing: "border-box", zIndex: "2" }} />
          <div style={{ width: "100%", height: "100%", boxSizing: "border-box", background: "#111111", color: "#F3EEE4", padding: "18px", border: "2px solid #111111", boxShadow: "7px 7px 0 #F0442B", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <h2 style={{ margin: "0", fontFamily: "'Caveat', cursive", fontWeight: "700", fontSize: "52px", lineHeight: "0.9" }}>Articles</h2>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "1.4px", color: "#CFC8B8" }}>{`${pad2(ARTICLES.length)} PIECES`}</div>
          </div>
        </div>
      </div>
      <div ref={scroller} className="art-scroller" onScroll={onScroll} tabIndex={0} aria-label="All write-ups, scroll sideways" style={{ position: "absolute", left: "300px", top: "470px", width: "1140px", height: "530px", overflowX: "auto", overflowY: "hidden", scrollSnapType: "x proximity", scrollPaddingLeft: "40px" }}>
        <div style={{ position: "relative", width: `${width}px`, height: "520px" }}>
          <svg width={width} height="200" viewBox={`0 0 ${width} 200`} style={{ position: "absolute", left: "0", top: "0" }} aria-hidden="true">
            <path d={wirePath(pegs, width)} fill="none" stroke="#5B3A1E" strokeWidth="1.8" />
          </svg>
          {items.map((item, i) => {
            const p = pegs[i];
            return (
              <div key={i} className="hang sway" style={{ position: "absolute", left: `${p.x - 86}px`, top: `${p.y}px`, width: "172px", height: `${p.drop + 272}px`, "--a": `${p.swing}deg`, "--d": `${p.dur}s`, animationDelay: `${(-0.9 * i).toFixed(1)}s` }}>
                <div style={{ position: "absolute", left: "85.3px", top: "0", width: "1.4px", height: `${p.drop + 2}px`, background: "#5B3A1E" }} />
                <div className="flutter" style={{ position: "absolute", left: "0", top: `${p.drop}px`, width: "172px", height: "272px", "--r": `${p.tilt}deg`, transform: `rotate(${p.tilt}deg)`, animationDelay: `${(-0.7 - 0.9 * i).toFixed(1)}s` }}>
                  {item.a ? <WebCard article={item.a} /> : <SoonCard text={item.text} />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ position: "absolute", left: "300px", top: "1024px", width: "1060px", display: "flex", alignItems: "center", gap: "20px" }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "1.6px", whiteSpace: "nowrap" }}>{`${pad2(ARTICLES.length)} WRITE-UPS · SCROLL SIDEWAYS`}</div>
        <div style={{ flexGrow: "1", height: "4px", background: "#D9D1BF", position: "relative" }}>
          <div style={{ position: "absolute", left: "0", top: "0", height: "4px", width: `${Math.round(Math.max(0.06, progress) * 100)}%`, background: "#111111", transition: "width 120ms linear" }} />
        </div>
        <button className="btn" onClick={() => scrollBy(-624)} aria-label="Scroll write-ups left" style={{ ...arrow, background: "#FFFFFF", opacity: progress <= 0.01 ? 0.35 : 1 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2.8" strokeLinecap="square"><path d="M15 4 L7 12 L15 20" /></svg>
        </button>
        <button className="btn" onClick={() => scrollBy(624)} aria-label="Scroll write-ups right" style={{ ...arrow, background: "#F7C21A", opacity: progress >= 0.99 ? 0.35 : 1 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2.8" strokeLinecap="square"><path d="M9 4 L17 12 L9 20" /></svg>
        </button>
      </div>
    </>
  );
}
