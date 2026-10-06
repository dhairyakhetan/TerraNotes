import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { portalRoot } from '../../../lib/dom.js';
import { calm, LITE } from '../../../lib/motion.js';
import { takeTap } from '../../../lib/cardFlight.js';
import { FONT } from '../../../styles/fonts.js';

// October's article opening (preview: lib/preview.js PANDAL; src/editions/pages.js): when an article is opened by
// tapping its card, a pandal's curtains (laal-paar: a cream saree with a red border and a marigold thread) stand closed
// over the page with a marigold garland and "Subho Sharodiya" knotted where they meet, then sweep apart while
// marigold petals fall, and the article (its cover flying in from the card, lib/cardFlight.js) is there behind them.
// About a second; it takes no taps. Not with reduced motion or on low-end devices (LITE), nor on a direct visit.
// Its keyframes are in pandal.css (.pc-*). Drawn over everything in the pop-up layer (portalRoot: inside AQ's website
// too).
const PETALS = Array.from({ length: 22 }, (_, i) => ({ x: (i * 37) % 100, d: (i % 7) * 0.06, s: 0.8 + ((i * 13) % 5) / 10, r: (i % 2 ? 1 : -1) * (160 + ((i * 29) % 200)), red: i % 4 === 0 }));

function Half({ side }) {
  const left = side === 'left';
  return (
    <div className={`pc-half pc-${side}`} style={{ position: "absolute", top: "0", bottom: "0", [left ? 'left' : 'right']: "0", width: "50.5%", background: "var(--cream)", overflow: "hidden" }}>
      {/* pleats: soft folds down the cloth */}
      <div style={{ position: "absolute", inset: "0", backgroundImage: "repeating-linear-gradient(90deg, rgba(0,0,0,0) 0 34px, rgba(120,60,0,.08) 34px 46px, rgba(0,0,0,0) 46px 64px)" }} />
      {/* the saree's border where the halves meet: a wide red band, a marigold thread, a row of little red diamonds */}
      <div style={{ position: "absolute", top: "0", bottom: "0", [left ? 'right' : 'left']: "0", width: "54px", background: "var(--red)" }} />
      <div style={{ position: "absolute", top: "0", bottom: "0", [left ? 'right' : 'left']: "60px", width: "6px", background: "var(--yellow)" }} />
      <div style={{ position: "absolute", top: "0", bottom: "0", [left ? 'right' : 'left']: "74px", width: "12px", backgroundImage: "linear-gradient(45deg, var(--red) 25%, transparent 25% 75%, var(--red) 75%), linear-gradient(-45deg, var(--red) 25%, transparent 25% 75%, var(--red) 75%)", backgroundSize: "12px 12px", opacity: ".7" }} />
      {/* the border at the bottom too */}
      <div style={{ position: "absolute", left: "0", right: "0", bottom: "0", height: "28px", background: "var(--red)", borderTop: "4px solid var(--yellow)" }} />
    </div>
  );
}

export default function Curtain() {
  const [show, setShow] = useState(() => takeTap() && !calm() && !LITE);
  useEffect(() => { if (!show) return undefined; const t = setTimeout(() => setShow(false), 1700); return () => clearTimeout(t); }, [show]);
  if (!show) return null;
  return createPortal(
    <div className="pc-stage" aria-hidden="true" style={{ position: "fixed", inset: "0", zIndex: "2000", pointerEvents: "none", overflow: "hidden" }}>
      <Half side="left" />
      <Half side="right" />
      {/* the valance along the top: red with a marigold fringe of beads, stays a moment longer */}
      <div className="pc-valance" style={{ position: "absolute", left: "0", right: "0", top: "0", height: "34px", background: "var(--red)", borderBottom: "4px solid var(--yellow)", backgroundImage: "radial-gradient(circle at 12px 34px, var(--yellow) 0 7px, transparent 7.5px)", backgroundSize: "24px 34px" }} />
      {/* the knot where the curtains meet: a marigold tag */}
      <div className="pc-knot" style={{ position: "absolute", left: "50%", top: "42%", translate: "-50% -50%", padding: "10px 18px", background: "var(--yellow)", border: "2px solid var(--ink)", boxShadow: "4px 4px 0 var(--ink)", fontFamily: FONT.hand, fontSize: "26px", color: "var(--ink)", whiteSpace: "nowrap", rotate: "-3deg" }}>Subho Sharodiya!</div>
      {PETALS.map((p, i) => (
        <svg key={i} className="pc-petal" width={16 * p.s} height={11 * p.s} viewBox="0 0 16 11" style={{ position: "absolute", left: `${p.x}%`, top: "-20px", animationDelay: `${0.25 + p.d}s`, "--r": `${p.r}deg` }}>
          <ellipse cx="8" cy="5.5" rx="7" ry="4.2" style={{ fill: p.red ? "var(--red)" : "var(--yellow)", stroke: "var(--ink)", strokeWidth: "1" }} />
        </svg>
      ))}
    </div>,
    portalRoot(),
  );
}
