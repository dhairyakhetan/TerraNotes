import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { portalRoot } from '../../../lib/dom.js';
import { calm, LITE } from '../../../lib/motion.js';
import { takeTap } from '../../../lib/cardFlight.js';
import { FONT } from '../../../styles/fonts.js';

// October's article opening (src/editions/oct26/annual/pages.jsx): when an article is opened by tapping it on the
// annual's home page, the page you were on turns like a page of a book, hinged on its left edge, and the article is
// underneath (its cover flying in from where you tapped: lib/cardFlight.js). A printed page: cream paper, a folio,
// grey lines of "text", a page number; a shadow deepens as it turns. About 0.8 s; it takes no taps. Not with reduced
// motion or on low-end devices (LITE), nor on a direct visit. Keyframes in annual.css (.an-turn*).
const LINES = Array.from({ length: 22 }, (_, i) => 55 + ((i * 37) % 40));

export default function PageTurn() {
  const [show, setShow] = useState(() => takeTap() && !calm() && !LITE);
  useEffect(() => { if (!show) return undefined; const t = setTimeout(() => setShow(false), 1000); return () => clearTimeout(t); }, [show]);
  if (!show) return null;
  return createPortal(
    <div className="an-turn-stage" aria-hidden="true" style={{ position: "fixed", inset: "0", zIndex: "2000", pointerEvents: "none", perspective: "2200px", overflow: "hidden" }}>
      <div className="an-turn" style={{ position: "absolute", inset: "0", transformOrigin: "0 50%", background: "var(--page)", borderRight: "2px solid var(--ink)", boxShadow: "inset -30px 0 40px -20px rgba(0,0,0,.18), 14px 0 30px rgba(0,0,0,.22)", padding: "7vh 8vw", boxSizing: "border-box", backfaceVisibility: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "8px", borderBottom: "3px double var(--ink)", fontFamily: FONT.mono, fontSize: "11px", letterSpacing: "1.6px", color: "var(--ink)" }}><span>TERRANOTES · SHARADIYA 2026</span><span>TURNING…</span></div>
        <div style={{ marginTop: "5vh", display: "flex", flexDirection: "column", gap: "2.2vh" }}>
          {LINES.map((w, i) => <div key={i} style={{ width: `${w}%`, height: "8px", background: "var(--faint)" }} />)}
        </div>
        <div className="an-turn-shade" style={{ position: "absolute", inset: "0", background: "linear-gradient(90deg, rgba(0,0,0,0), rgba(0,0,0,.28))" }} />
      </div>
    </div>,
    portalRoot(),
  );
}
