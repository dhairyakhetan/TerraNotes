import { useEffect, useRef, useState } from 'react';
import { PHOTOS } from '../../data/photos.js';
import { pad2 } from '../../lib/format.js';
import { lockScroll, unlockScroll } from '../../lib/scrollLock.js';

const W = 390;
const EASE = 'cubic-bezier(0.32, 0.72, 0, 1)';
const TILTS = ['-1.5deg', '1.2deg', '-0.8deg', '1.6deg', '-1.2deg'];

// Full-screen "See every photo" viewer. Swipe or use the arrows; no wrap-around (ends rubber-band).
// --ph (styles/home.css) is the photo height and shrinks on short screens.
export default function PhotoViewer({ start = 0, closing, onClose }) {
  const n = PHOTOS.length;
  const [cur, setCur] = useState(start);
  const [dx, setDx] = useState(0);            // live drag offset in px
  const [dragging, setDragging] = useState(false);
  const touch = useRef(null);
  useEffect(() => { lockScroll(); return unlockScroll; }, []);

  const go = (k) => { setCur(Math.max(0, Math.min(n - 1, k))); setDx(0); setDragging(false); };
  const onTouchStart = (e) => {
    const t = e.touches && e.touches[0]; if (!t) return;
    touch.current = { x: t.clientX, time: Date.now() };
    setDragging(true); setDx(0);
  };
  const onTouchMove = (e) => {
    const t = e.touches && e.touches[0]; if (!t || !touch.current) return;
    let d = t.clientX - touch.current.x;
    if ((cur === 0 && d > 0) || (cur === n - 1 && d < 0)) d *= 0.3;
    setDx(d);
  };
  const onTouchEnd = () => {
    if (!touch.current) return;
    const v = dx / Math.max(1, Date.now() - touch.current.time); // px per ms
    touch.current = null;
    if (dx < -70 || (v < -0.45 && dx < -12)) go(cur + 1);
    else if (dx > 70 || (v > 0.45 && dx > 12)) go(cur - 1);
    else { setDx(0); setDragging(false); }
  };

  const tr = dragging ? 'none' : `transform 420ms ${EASE}, opacity 420ms ${EASE}`;
  const dotTr = dragging ? 'none' : `width 420ms ${EASE}, background-color 200ms ease`;
  const prog = Math.max(-1, Math.min(1, -dx / W)); // drag progress towards the neighbour
  const nb = prog > 0 ? cur + 1 : cur - 1;
  const arrow = { "--c": "#E9A23B", width: "48px", height: "48px", flexShrink: "0", padding: "0", background: "#FFFFFF", border: "2px solid #F3EEE4", boxShadow: "4px 4px 0 #E9A23B", display: "flex", alignItems: "center", justifyContent: "center", transition: "opacity 200ms ease" };

  return (
    <div className={`photo-viewer ${closing ? 'viewer-out' : 'viewer-in'}`} role="dialog" aria-label="Photo highlights" style={{ position: "fixed", left: "0", right: "0", top: "0", margin: "0 auto", width: "390px", zIndex: "90", background: "#111111", color: "#F3EEE4" }}>
      <div style={{ position: "absolute", left: "20px", top: "24px", fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "32px", lineHeight: "1" }}>Photo wall</div>
      <div style={{ position: "absolute", left: "22px", top: "64px", fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "1.6px", color: "#BDB6A6" }}>HIGHLIGHTS ·{" "}<span style={{ color: "#F7C21A" }}>{pad2(cur + 1)}</span>{" "}{`/ ${pad2(n)}`}</div>
      <button className="press" onClick={onClose} aria-label="Close photos" style={{ "--c": "#E9A23B", position: "absolute", right: "20px", top: "18px", width: "48px", height: "48px", padding: "0", background: "#FFFFFF", border: "2px solid #F3EEE4", boxShadow: "4px 4px 0 #E9A23B", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="#111111" strokeWidth="2.6" strokeLinecap="square">
          <path d="M3 3 L17 17" />
          <path d="M17 3 L3 17" />
        </svg>
      </button>
      <div className="viewer-stage" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} onTouchCancel={onTouchEnd} style={{ position: "absolute", left: "0", top: "104px", width: "390px", height: "calc(var(--ph) + 150px)", overflow: "hidden", touchAction: "pan-y" }}>
        <div className="gal-track" style={{ display: "flex", width: `${n * W}px`, height: "100%", transform: `translate3d(${-cur * W + dx}px, 0, 0)`, transition: tr, willChange: "transform" }}>
          {PHOTOS.map((p, i) => (
            <div key={i} className="gal-slide" style={{ width: "390px", flexShrink: "0", boxSizing: "border-box", padding: "18px 30px 0", transform: `scale(${i === cur ? 1 : 0.9})`, opacity: i === cur ? 1 : 0.45, transition: tr }} aria-hidden={i === cur ? 'false' : 'true'}>
              <figure style={{ position: "relative", margin: "0", transform: `rotate(${TILTS[i % TILTS.length]})` }}>
                <div style={{ position: "absolute", left: "50%", top: "-12px", marginLeft: "-8px", width: "16px", height: "26px", background: "#C9A57A", border: "1.5px solid #111111", boxSizing: "border-box", zIndex: "2" }} />
                <div style={{ background: "#FFFFFF", border: "2px solid #111111", boxShadow: "7px 7px 0 #E9A23B", padding: "10px 10px 0" }}>
                  {p.photo
                    ? <img src={p.photo} alt={p.caption} style={{ display: "block", width: "100%", height: "var(--ph)", objectFit: "cover" }} />
                    : <div style={{ height: "var(--ph)", background: p.tint, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "#F3EEE4" }}>{`[photo ${i + 1}]`}</div>}
                  <figcaption style={{ padding: "10px 2px 12px" }}>
                    <div style={{ fontFamily: "'Caveat', cursive", fontSize: "22px", lineHeight: "1.1", color: "#111111" }}>{p.caption || "[caption — what's happening here]"}</div>
                    <div style={{ marginTop: "4px", fontFamily: "'Space Mono', monospace", fontSize: "9.5px", letterSpacing: "1.2px", textTransform: "uppercase", color: "#6B665C" }}>{`Highlight ${pad2(i + 1)} · ${p.place || '[place]'}`}</div>
                  </figcaption>
                </div>
              </figure>
            </div>
          ))}
        </div>
      </div>
      {/* arrows + dots (the active dot is a pill that hands over to its neighbour while dragging) */}
      <div className="viewer-bits" style={{ position: "absolute", left: "20px", top: "calc(var(--ph) + 274px)", width: "350px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button className="press" onClick={() => go(cur - 1)} disabled={cur === 0} aria-label="Previous photo" style={{ ...arrow, opacity: cur === 0 ? 0.3 : 1 }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#111111" strokeWidth="2.6" strokeLinecap="square">
            <path d="M13 3 L6 10 L13 17" />
          </svg>
        </button>
        <div aria-hidden="true" style={{ display: "flex", alignItems: "center", gap: "7px" }}>
          {PHOTOS.map((p, i) => {
            const w = i === cur ? 22 - 15 * Math.abs(prog) : (i === nb ? 7 + 15 * Math.abs(prog) : 7);
            const lit = (i === cur && Math.abs(prog) < 0.5) || (i === nb && Math.abs(prog) >= 0.5);
            return <span key={i} style={{ display: "block", height: "7px", width: `${w}px`, borderRadius: "4px", background: lit ? '#F7C21A' : '#6B665C', transition: dotTr }} />;
          })}
        </div>
        <button className="press" onClick={() => go(cur + 1)} disabled={cur === n - 1} aria-label="Next photo" style={{ ...arrow, opacity: cur === n - 1 ? 0.3 : 1 }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#111111" strokeWidth="2.6" strokeLinecap="square">
            <path d="M7 3 L14 10 L7 17" />
          </svg>
        </button>
      </div>
      <div className="viewer-bits" style={{ position: "absolute", left: "0", top: "calc(var(--ph) + 360px)", width: "390px", display: "flex", justifyContent: "center", gap: "10px" }}>
        {PHOTOS.map((p, i) => {
          const on = i === cur;
          return (
            <button key={i} onClick={() => go(i)} aria-label={`Show photo ${i + 1}`} aria-current={on ? 'true' : 'false'} style={{ width: "52px", height: "52px", padding: "3px", boxSizing: "border-box", background: "#FFFFFF", border: `2px solid ${on ? '#F7C21A' : '#3A3A36'}`, boxShadow: on ? '4px 4px 0 #E9A23B' : 'none', transform: `translateY(${on ? -6 : 0}px)`, opacity: on ? 1 : 0.55, transition: "transform 300ms cubic-bezier(0.32, 0.72, 0, 1), opacity 300ms ease, border-color 150ms ease" }}>
              {p.photo
                ? <img src={p.photo} alt="" style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }} />
                : <span style={{ display: "block", width: "100%", height: "100%", background: p.tint }} />}
            </button>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: "0", top: "calc(var(--ph) + 442px)", width: "390px", textAlign: "center", fontFamily: "'Caveat', cursive", fontSize: "19px", color: "#8E8A7A" }}>swipe, or use the arrows</div>
    </div>
  );
}
