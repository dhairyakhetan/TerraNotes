import { useEffect, useRef, useState } from 'react';
import { PHOTOS } from '../data/photos.js';
import { pad2 } from '../lib/format.js';
import { webZoom } from '../lib/layout.js';
import { lockScroll, unlockScroll } from '../lib/scrollLock.js';

const W = 1440;
const EASE = 'cubic-bezier(0.32, 0.72, 0, 1)';
const TILTS = ['-1.2deg', '1deg', '-0.6deg', '1.3deg', '-1deg'];

// Full-screen "See every photo" viewer, web layout. Drag with mouse or finger, the arrows, or ← → keys; Esc closes.
// No wrap-around: the ends rubber-band. --ph (web.css) is the photo height and shrinks on short screens.
export default function WebPhotoViewer({ start = 0, closing, onClose }) {
  const n = PHOTOS.length;
  const [cur, setCur] = useState(start);
  const [dx, setDx] = useState(0);            // live drag offset in px
  const [dragging, setDragging] = useState(false);
  const drag = useRef(null);
  const go = (k) => { setCur(Math.max(0, Math.min(n - 1, k))); setDx(0); setDragging(false); };

  useEffect(() => { lockScroll(); return unlockScroll; }, []);
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') go(cur - 1);
      else if (e.key === 'ArrowRight') go(cur + 1);
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [cur]);

  const onPointerDown = (e) => {
    if (e.button !== 0) return;
    drag.current = { x: e.clientX, time: Date.now() };
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true); setDx(0);
  };
  const onPointerMove = (e) => {
    if (!drag.current) return;
    let d = (e.clientX - drag.current.x) / webZoom();
    if ((cur === 0 && d > 0) || (cur === n - 1 && d < 0)) d *= 0.3;
    setDx(d);
  };
  const onPointerUp = () => {
    if (!drag.current) return;
    const v = dx / Math.max(1, Date.now() - drag.current.time); // px per ms
    drag.current = null;
    if (dx < -110 || (v < -0.5 && dx < -16)) go(cur + 1);
    else if (dx > 110 || (v > 0.5 && dx > 16)) go(cur - 1);
    else { setDx(0); setDragging(false); }
  };

  const tr = dragging ? 'none' : `transform 420ms ${EASE}, opacity 420ms ${EASE}`;
  const prog = Math.max(-1, Math.min(1, -dx / W)); // drag progress towards the neighbour
  const nb = prog > 0 ? cur + 1 : cur - 1;
  const arrow = { position: "absolute", top: "calc((var(--ph) + 170px) / 2 - 32px)", width: "64px", height: "64px", padding: "0", background: "#FFFFFF", border: "2px solid #F3EEE4", boxShadow: "5px 5px 0 #E9A23B", display: "flex", alignItems: "center", justifyContent: "center", zIndex: "3" };

  return (
    <div className={`web-viewer ${closing ? 'viewer-out' : 'viewer-in'}`} role="dialog" aria-label="Photo highlights" style={{ position: "fixed", left: "0", right: "0", top: "0", margin: "0 auto", width: "1440px", zIndex: "90", background: "#111111", color: "#F3EEE4" }}>
      <div style={{ position: "absolute", left: "60px", top: "34px", fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "44px", lineHeight: "1" }}>Photo wall</div>
      <div style={{ position: "absolute", left: "62px", top: "86px", fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "1.8px", color: "#BDB6A6" }}>HIGHLIGHTS ·{" "}<span style={{ color: "#F7C21A" }}>{pad2(cur + 1)}</span>{" "}{`/ ${pad2(n)}`}</div>
      <button className="btn" onClick={onClose} aria-label="Close photos" autoFocus style={{ position: "absolute", right: "60px", top: "30px", width: "56px", height: "56px", padding: "0", background: "#FFFFFF", border: "2px solid #F3EEE4", boxShadow: "5px 5px 0 #E9A23B", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#111111" strokeWidth="2.6" strokeLinecap="square"><path d="M3 3 L17 17" /><path d="M17 3 L3 17" /></svg>
      </button>
      <div className="viewer-stage" style={{ position: "absolute", left: "0", top: "120px", width: "1440px", height: "calc(var(--ph) + 170px)" }}>
        <div onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp} style={{ position: "absolute", inset: "0", overflow: "hidden", touchAction: "pan-y", cursor: dragging ? "grabbing" : "grab", userSelect: "none" }}>
          <div className="gal-track" style={{ display: "flex", width: `${n * W}px`, height: "100%", transform: `translate3d(${-cur * W + dx}px, 0, 0)`, transition: tr, willChange: "transform" }}>
            {PHOTOS.map((p, i) => (
              <div key={i} className="gal-slide" aria-hidden={i === cur ? 'false' : 'true'} style={{ width: "1440px", flexShrink: "0", boxSizing: "border-box", paddingTop: "24px", display: "flex", justifyContent: "center", transform: `scale(${i === cur ? 1 : 0.88})`, opacity: i === cur ? 1 : 0.35, transition: tr }}>
                <figure style={{ position: "relative", margin: "0", width: "760px", transform: `rotate(${TILTS[i % TILTS.length]})` }}>
                  <div style={{ position: "absolute", left: "50%", top: "-14px", marginLeft: "-10px", width: "20px", height: "30px", background: "#C9A57A", border: "1.5px solid #111111", boxSizing: "border-box", zIndex: "2" }} />
                  <div style={{ background: "#FFFFFF", border: "2px solid #111111", boxShadow: "10px 10px 0 #E9A23B", padding: "14px 14px 0" }}>
                    {p.photo
                      ? <img src={p.photo} alt={p.caption} draggable="false" style={{ display: "block", width: "100%", height: "var(--ph)", objectFit: "cover" }} />
                      : <div style={{ height: "var(--ph)", background: p.tint, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", color: "#F3EEE4" }}>{`[photo ${i + 1}]`}</div>}
                    <figcaption style={{ padding: "14px 4px 16px", display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "20px" }}>
                      <div style={{ fontFamily: "'Caveat', cursive", fontSize: "28px", lineHeight: "1.1", color: "#111111" }}>{p.caption || "[caption — what's happening here]"}</div>
                      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "1.4px", textTransform: "uppercase", color: "#6B665C", whiteSpace: "nowrap" }}>{`Highlight ${pad2(i + 1)} · ${p.place || '[place]'}`}</div>
                    </figcaption>
                  </div>
                </figure>
              </div>
            ))}
          </div>
        </div>
        <button className="btn" onClick={() => go(cur - 1)} disabled={cur === 0} aria-label="Previous photo" style={{ ...arrow, left: "200px", opacity: cur === 0 ? 0.3 : 1 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2.8" strokeLinecap="square"><path d="M15 4 L7 12 L15 20" /></svg>
        </button>
        <button className="btn" onClick={() => go(cur + 1)} disabled={cur === n - 1} aria-label="Next photo" style={{ ...arrow, right: "200px", opacity: cur === n - 1 ? 0.3 : 1 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2.8" strokeLinecap="square"><path d="M9 4 L17 12 L9 20" /></svg>
        </button>
      </div>
      <div className="viewer-bits" aria-hidden="true" style={{ position: "absolute", left: "0", top: "calc(var(--ph) + 314px)", width: "1440px", display: "flex", justifyContent: "center", gap: "9px" }}>
        {PHOTOS.map((p, i) => {
          const w = i === cur ? 26 - 17 * Math.abs(prog) : (i === nb ? 9 + 17 * Math.abs(prog) : 9);
          const lit = (i === cur && Math.abs(prog) < 0.5) || (i === nb && Math.abs(prog) >= 0.5);
          return <span key={i} style={{ display: "block", height: "8px", width: `${w}px`, borderRadius: "4px", background: lit ? '#F7C21A' : '#6B665C', transition: dragging ? 'none' : `width 420ms ${EASE}, background-color 200ms ease` }} />;
        })}
      </div>
      <div className="viewer-bits" style={{ position: "absolute", left: "0", top: "calc(var(--ph) + 346px)", width: "1440px", display: "flex", justifyContent: "center", gap: "14px" }}>
        {PHOTOS.map((p, i) => {
          const on = i === cur;
          return (
            <button key={i} onClick={() => go(i)} aria-label={`Show photo ${i + 1}`} aria-current={on ? 'true' : 'false'} style={{ width: "64px", height: "64px", padding: "4px", boxSizing: "border-box", background: "#FFFFFF", border: `2px solid ${on ? '#F7C21A' : '#3A3A36'}`, boxShadow: on ? '4px 4px 0 #E9A23B' : 'none', transform: `translateY(${on ? -6 : 0}px)`, opacity: on ? 1 : 0.55, transition: "transform 300ms cubic-bezier(0.32, 0.72, 0, 1), opacity 300ms ease, border-color 150ms ease" }}>
              {p.photo
                ? <img src={p.photo} alt="" style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }} />
                : <span style={{ display: "block", width: "100%", height: "100%", background: p.tint }} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
