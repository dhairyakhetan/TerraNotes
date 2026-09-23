import { useRef } from 'react';
import { usePauseOffscreen } from '../../lib/offscreen.js';
import { PHOTOS } from '../../data/photos.js';

// Where each photo hangs on the wall (PHOTOS[0] → first spot). r = tilt; dur/delay = its occasional turn on the peg.
const SPOTS = [
  { left: '2px', top: '134px', width: '116px', peg: '53px', height: '96px', r: '-5deg', dur: '11s', delay: '-2s', ink: '#EDE9DD' },
  { left: '132px', top: '104px', width: '116px', peg: '53px', height: '96px', r: '3.5deg', dur: '13s', delay: '-7s', ink: '#EDE9DD' },
  { left: '250px', top: '82px', width: '116px', peg: '53px', height: '96px', r: '-2.5deg', dur: '12s', delay: '-4.5s', ink: '#F3EEE4' },
  { left: '50px', top: '388px', width: '128px', peg: '59px', height: '108px', r: '3deg', dur: '14s', delay: '-10s', ink: '#F3EEE4' },
  { left: '234px', top: '348px', width: '120px', peg: '55px', height: '100px', r: '-4deg', dur: '10.5s', delay: '-0.5s', ink: '#EDE9DD' },
];
// Fairy lights: [x, y, flicker class, big]
const BULBS = [
  [25, 112.5, 'fk1'], [95, 132.5], [130, 130, 'fk2'], [165, 119], [233, 84, 'fk3'], [266, 76], [333, 82, 'fk4'], [366, 97],
  [33, 356, 'fk2'], [77, 373, 'fk1'], [163, 383], [207, 376, 'fk3', true], [276, 349], [352, 347, 'fk4'], [376, 356],
];
// Glints that pop on a few bulbs: [x, y, size, classes]
const SPARKS = [[130, 130, 9, 'sp1'], [266, 76, 8, 'sp2'], [207, 376, 11, 'sp3'], [352, 347, 8, 'sp1 sp-late'], [25, 112.5, 7, 'sp2 sp-late']];

export default function PhotoWall({ onOpen }) {
  const self = useRef(null);
  usePauseOffscreen(self);
  return (
    <section ref={self} id="photos" style={{ position: "absolute", left: "10px", top: "1190px", width: "370px", height: "600px", background: "#1C2622", borderRadius: "28px", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: "22px", top: "24px", fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "30px", color: "#F3EEE4", lineHeight: "1" }}>Photo wall</div>
      <div style={{ position: "absolute", left: "190px", top: "30px", fontFamily: "'Caveat', cursive", fontSize: "20px", color: "#E9A23B", transform: "rotate(-4deg)" }}>moments, strung up</div>
      <svg width="370" height="600" viewBox="10 0 370 600" style={{ position: "absolute", left: "0", top: "0" }} aria-hidden="true">
        <defs>
          <radialGradient id="glow">
            <stop offset="0" stopColor="#FFC861" stopOpacity=".75" />
            <stop offset="1" stopColor="#FFC861" stopOpacity="0" />
          </radialGradient>
        </defs>
        <g stroke="#8E8A7A" strokeWidth="1.2" fill="none">
          <path d="M-10 90 Q95 170 200 100 Q300 40 400 120" />
          <path d="M-10 330 Q120 420 250 360 Q330 320 400 370" />
        </g>
        {BULBS.map(([x, y, fk, big], i) => (
          <g key={i} className={fk ? `bulb ${fk}` : 'bulb'}>
            <circle cx={x} cy={y} r={big ? 19 : 15} fill="url(#glow)" />
            <circle cx={x} cy={y} r={big ? 4.2 : 3.6} fill="#FFE6AE" />
          </g>
        ))}
        {SPARKS.map(([x, y, s, cls], i) => (
          <g key={i} transform={`translate(${x} ${y})`}>
            <path className={`spark ${cls}`} d={`M0 -${s} L1.6 -1.6 L${s} 0 L1.6 1.6 L0 ${s} L-1.6 1.6 L-${s} 0 L-1.6 -1.6 Z`} fill="#FFF4D6" />
          </g>
        ))}
      </svg>
      {/* .twist = the photo turns on its peg now and then while a .glint crosses the print */}
      {SPOTS.map((s, i) => {
        const p = PHOTOS[i];
        if (!p) return null;
        return (
          <figure key={i} className="twist" style={{ position: "absolute", left: s.left, top: s.top, width: s.width, margin: "0", "--r": s.r, transform: `rotate(${s.r})`, transformOrigin: "50% 0", animationDuration: s.dur, animationDelay: s.delay }}>
            <div style={{ position: "absolute", left: s.peg, top: "-10px", width: "9px", height: "18px", background: "#C9A57A", borderRadius: "2px" }} />
            <div style={{ background: "#FFFFFF", padding: "7px 7px 0", border: "2px solid #111111", boxShadow: "5px 5px 0 #E9A23B" }}>
              <div style={{ position: "relative", overflow: "hidden", height: s.height, background: p.tint, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", color: s.ink }}>
                {p.photo ? <img src={p.photo} alt={p.caption} style={{ position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover" }} /> : '[photo]'}
                <div className="glint" style={{ animationDuration: s.dur, animationDelay: s.delay }} />
              </div>
              <figcaption style={{ fontFamily: "'Caveat', cursive", fontSize: "16px", padding: "4px 0 6px", textAlign: "center" }}>{p.caption || '[caption]'}</figcaption>
            </div>
            <button className="ph-open" onClick={() => onOpen(i)} aria-label={`Open photo ${i + 1} of ${PHOTOS.length}`} style={{ position: "absolute", left: "0", top: "0", width: "100%", height: "100%", padding: "0", background: "transparent", border: "0" }} />
          </figure>
        );
      })}
      <button onClick={() => onOpen(0)} style={{ position: "absolute", left: "22px", bottom: "16px", minHeight: "44px", padding: "0", background: "transparent", border: "0", color: "#F3EEE4", fontFamily: "'Figtree', system-ui, sans-serif", fontSize: "13px", letterSpacing: "1.4px", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ borderBottom: "1px solid #8E8A7A", paddingBottom: "3px" }}>See every photo</span>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke="#F7C21A" strokeWidth="2">
          <path d="M1 6 H14" />
          <path d="M9 1 L14 6 L9 11" />
        </svg>
      </button>
    </section>
  );
}
