import { useRef } from 'react';
import { usePauseOffscreen } from '../lib/offscreen.js';
import { fitFrame, usePhotoShapes } from '../lib/photoShape.js';
import { PHOTOS } from '../data/photos.js';

// Where each photo hangs (PHOTOS[0] → first spot): top-left, tilt, and the glint's clock.
const SPOTS = [
  { left: 145, top: 205, r: -4, dur: 11, delay: -2 },
  { left: 585, top: 221, r: 3, dur: 13, delay: -7 },
  { left: 1025, top: 181, r: -2.5, dur: 12, delay: -4.5 },
  { left: 335, top: 493, r: 3, dur: 14, delay: -10 },
  { left: 795, top: 493, r: -3.5, dur: 10.5, delay: -0.5 },
];
// Fairy lights along the two strings: [x, y, flicker class]
const BULBS = [
  [42, 162, 'fk1'], [96, 173], [150, 183, 'fk3'], [206, 191], [262, 198], [320, 204, 'fk2'], [378, 209], [438, 212, 'fk1'],
  [498, 214], [560, 215, 'fk3'], [622, 215], [686, 213], [751, 211, 'fk2'], [817, 207], [883, 201, 'fk1'], [951, 195],
  [1020, 187, 'fk3'], [1090, 178], [1161, 168], [1233, 157, 'fk2'], [1306, 144], [54, 441], [119, 451, 'fk4'], [183, 460],
  [247, 468, 'fk2'], [311, 475], [375, 481], [439, 485, 'fk1'], [502, 489], [566, 491, 'fk4'], [629, 492], [692, 492, 'fk2'],
  [756, 491], [819, 489], [881, 486, 'fk1'], [944, 482], [1007, 476, 'fk4'], [1069, 470], [1132, 462, 'fk2'], [1194, 453],
  [1256, 443], [1318, 432, 'fk1'],
];
const SPARKS = [[262, 198, 'sp1'], [817, 207, 'sp2'], [502, 489, 'sp3'], [1069, 470, 'sp1 sp-late'], [1233, 157, 'sp2 sp-late']];

// Web photo wall: click a photo (or the hanging tag) to open the viewer at that photo.
export default function WebPhotoWall({ onOpen }) {
  const shapes = usePhotoShapes(0.2, 5); // frames take each photo's own shape (fitFrame)
  const self = useRef(null);
  usePauseOffscreen(self);
  return (
    <section ref={self} id="photos" style={{ position: "absolute", left: "40px", top: "1090px", width: "1360px", height: "760px", background: "#1C2622", borderRadius: "36px", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: "48px", top: "40px", fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "56px", color: "#F3EEE4", lineHeight: "1" }}>Photo wall</div>
      <div style={{ position: "absolute", left: "330px", top: "56px", fontFamily: "'Caveat', cursive", fontSize: "28px", color: "#E9A23B", transform: "rotate(-4deg)" }}>moments, strung up</div>
      <svg width="1360" height="760" viewBox="0 0 1360 760" style={{ position: "absolute", left: "0", top: "0" }} aria-hidden="true">
        <g stroke="#8E8A7A" strokeWidth="1.4" fill="none">
          <path d="M-10 150 Q560 290 1380 130" />
          <path d="M-10 430 Q700 560 1380 420" />
        </g>
      </svg>
      {/* lights and sparkles are plain elements (not SVG) so their flicker runs on the GPU */}
      {BULBS.map(([x, y, fk], i) => <span key={i} className={fk ? `bulb-h ${fk}` : 'bulb-h'} style={{ left: `${x - 17}px`, top: `${y - 17}px` }} aria-hidden="true" />)}
      {SPARKS.map(([x, y, cls], i) => <span key={i} className={`spark-h spark ${cls}`} style={{ left: `${x - 10}px`, top: `${y - 10}px` }} aria-hidden="true" />)}
      {SPOTS.map((s, i) => {
        const p = PHOTOS[i];
        if (!p) return null;
        const f = fitFrame(p.photo && shapes[i], 188, 172, 140), fw = f.w + 22; // 22 = mat + border
        return (
          <figure key={i} className="twist" style={{ position: "absolute", left: `${s.left + (210 - fw) / 2}px`, top: `${s.top}px`, width: `${fw}px`, margin: "0", "--r": `${s.r}deg`, transform: `rotate(${s.r}deg)`, transformOrigin: "50% 0", animationDuration: `${s.dur}s`, animationDelay: `${s.delay}s` }}>
            <div style={{ position: "absolute", left: "50%", marginLeft: "-6px", top: "-12px", width: "12px", height: "22px", background: "#C9A57A", border: "1.5px solid #111111", boxSizing: "border-box", zIndex: "2" }} />
            <div style={{ padding: "9px 9px 0", border: "2px solid #111111", boxShadow: "6px 6px 0 #E9A23B", background: "#FFFFFF" }}>
              <div style={{ position: "relative", overflow: "hidden", height: p.photo ? `${f.h}px` : "170px", background: p.tint, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "#EDE9DD" }}>
                {p.photo ? <img src={p.photo} alt={p.caption} style={{ position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover" }} /> : '[photo]'}
                <div className="glint" style={{ animationDuration: `${s.dur}s`, animationDelay: `${s.delay}s` }} />
              </div>
              <figcaption style={{ fontFamily: "'Caveat', cursive", fontSize: "20px", padding: "6px 0 8px", textAlign: "center", color: "#111111" }}>{p.caption || '[caption]'}</figcaption>
            </div>
            <button className="ph-open" onClick={() => onOpen(i)} aria-label={`Open photo ${i + 1} of ${PHOTOS.length}`} style={{ position: "absolute", left: "0", top: "0", width: "100%", height: "100%", padding: "0", background: "transparent", border: "0" }} />
          </figure>
        );
      })}
      {/* the photos open when clicked; a handwritten nudge says so */}
      <div style={{ position: "absolute", left: "1130px", top: "500px", width: "220px", fontFamily: "'Caveat', cursive", fontSize: "30px", lineHeight: "1.05", color: "#F3EEE4", transform: "rotate(-4deg)", pointerEvents: "none" }}>click a photo to see it up close<div style={{ marginTop: "6px" }}><svg width="48" height="30" viewBox="0 0 34 22" fill="none" stroke="#F7C21A" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true" style={{ flexShrink: "0" }}><path d="M2 19 C10 18 22 14 30 4" /><path d="M24 4 L30 4 L30 10" /></svg></div></div>
    </section>
  );
}
