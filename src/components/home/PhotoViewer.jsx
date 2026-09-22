import React from 'react';
import { lockScroll, unlockScroll } from '../../lib/scrollLock.js';

const N = 5, W = 390;
const EASE = 'cubic-bezier(0.32, 0.72, 0, 1)';

/*
  PHOTO HIGHLIGHTS OVERLAY ("See every photo") — full-screen, no separate page. Mounted by the home page while open;
  `start` = the photo it opens on, `onClose` closes it.
  • Track = one row of 5 slides, each 390px wide; it moves with transform: translateX(−index × 390 + drag).
    While a finger is down the track follows it 1:1 (no transition); release decides: past 70px or a quick
    flick → next/prev, otherwise springs back.
  • No wrapping: first/last arrows are disabled and dragging past the ends rubber-bands (×0.3 resistance).
  • Dots: the active dot is a 22px pill; while dragging, it shrinks and the neighbour grows in proportion.
  • Thumbnails: tap to jump; the current one lifts and gets the amber outline.
  • --ph (styles/home.css) = photo height; it shrinks on short screens so the whole viewer fits.
  STATE: gal (index), dx (drag px), dragging (bool).
*/
export default class PhotoViewer extends React.Component {
  state = { gal: this.props.start || 0, dx: 0, dragging: false };

  componentDidMount() { lockScroll(); }
  componentWillUnmount() { unlockScroll(); }

  renderVals() {
    const st = this.state;
    const dx = st.dx || 0;
    const dragging = !!st.dragging;
    const go = (k) => this.setState({ gal: Math.max(0, Math.min(N - 1, k)), dx: 0, dragging: false });
    const cur = st.gal;
    const prog = Math.max(-1, Math.min(1, -dx / W));     // drag progress toward the neighbour (−1…1)
    const nb = prog > 0 ? cur + 1 : cur - 1;
    const g = {
      num: String(cur + 1).padStart(2, '0'),
      close: this.props.onClose,
      tx: -cur * W + dx,
      tr: dragging ? 'none' : `transform 420ms ${EASE}, opacity 420ms ${EASE}`,
      dtr: dragging ? 'none' : `width 420ms ${EASE}, background-color 200ms ease`,
      prev: () => go(cur - 1), next: () => go(cur + 1),
      prevOff: cur === 0, nextOff: cur === N - 1,
      prevOp: cur === 0 ? 0.3 : 1, nextOp: cur === N - 1 ? 0.3 : 1,
      ts: (e) => { const t = e.touches && e.touches[0]; if (!t) return; this._gx = t.clientX; this._gt = Date.now(); this.setState({ dragging: true, dx: 0 }); },
      tm: (e) => {
        const t = e.touches && e.touches[0]; if (!t || this._gx == null) return;
        let d = t.clientX - this._gx;
        if ((cur === 0 && d > 0) || (cur === N - 1 && d < 0)) d *= 0.3;   // rubber band, no wrap
        this.setState({ dx: d });
      },
      te: () => {
        if (this._gx == null) return;
        const d = this.state.dx || 0, v = d / Math.max(1, Date.now() - this._gt);   // px per ms
        this._gx = null;
        if (d < -70 || (v < -0.45 && d < -12)) go(cur + 1);
        else if (d > 70 || (v > 0.45 && d > 12)) go(cur - 1);
        else this.setState({ dx: 0, dragging: false });
      }
    };
    for (let k = 0; k < N; k++) {
      const on = k === cur;
      const w = on ? 22 - 15 * Math.abs(prog) : (k === nb ? 7 + 15 * Math.abs(prog) : 7);
      g['go' + k] = () => go(k);
      g['s' + k] = { sc: on ? 1 : 0.9, op: on ? 1 : 0.45, hid: on ? 'false' : 'true' };
      g['d' + k] = { w: w, bg: (on && Math.abs(prog) < 0.5) || (k === nb && Math.abs(prog) >= 0.5) ? '#F7C21A' : '#6B665C' };
      g['t' + k] = { cur: on ? 'true' : 'false', bd: on ? '#F7C21A' : '#3A3A36', sh: on ? '4px 4px 0 #E9A23B' : 'none', y: on ? -6 : 0, op: on ? 1 : 0.55 };
    }
    return { g };
  }

  render() {
    const v = this.renderVals();
    return (
      <div className="photo-viewer" role="dialog" aria-label="Photo highlights" style={{ position: "fixed", left: "0", right: "0", top: "0", margin: "0 auto", width: "390px", zIndex: "90", background: "#111111", color: "#F3EEE4" }}>
        <div style={{ position: "absolute", left: "20px", top: "24px", fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "32px", lineHeight: "1" }}>Photo wall</div>
        <div style={{ position: "absolute", left: "22px", top: "64px", fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "1.6px", color: "#BDB6A6" }}>HIGHLIGHTS ·{" "}<span style={{ color: "#F7C21A" }}>{v.g.num}</span>{" "}/ 05</div>
        <button className="press" onClick={v.g.close} aria-label="Close photos" style={{ "--c": "#E9A23B", position: "absolute", right: "20px", top: "18px", width: "48px", height: "48px", padding: "0", background: "#FFFFFF", border: "2px solid #F3EEE4", boxShadow: "4px 4px 0 #E9A23B", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="#111111" strokeWidth="2.6" strokeLinecap="square">
            <path d="M3 3 L17 17" />
            <path d="M17 3 L3 17" />
          </svg>
        </button>
        {/* viewport + sliding track */}
        <div onTouchStart={v.g.ts} onTouchMove={v.g.tm} onTouchEnd={v.g.te} onTouchCancel={v.g.te} style={{ position: "absolute", left: "0", top: "104px", width: "390px", height: "calc(var(--ph) + 150px)", overflow: "hidden", touchAction: "pan-y" }}>
          <div className="gal-track" style={{ display: "flex", width: "1950px", height: "100%", transform: `translate3d(${v.g.tx}px, 0, 0)`, transition: v.g.tr, willChange: "transform" }}>
            <div className="gal-slide" style={{ width: "390px", flexShrink: "0", boxSizing: "border-box", padding: "18px 30px 0", transform: `scale(${v.g.s0.sc})`, opacity: v.g.s0.op, transition: v.g.tr }} aria-hidden={v.g.s0.hid}>
              <figure style={{ position: "relative", margin: "0", transform: "rotate(-1.5deg)" }}>
                <div style={{ position: "absolute", left: "50%", top: "-12px", marginLeft: "-8px", width: "16px", height: "26px", background: "#C9A57A", border: "1.5px solid #111111", boxSizing: "border-box", zIndex: "2" }} />
                <div style={{ background: "#FFFFFF", border: "2px solid #111111", boxShadow: "7px 7px 0 #E9A23B", padding: "10px 10px 0" }}>
                  <div style={{ height: "var(--ph)", background: "#6F8468", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "#F3EEE4" }}>[photo 1]</div>
                  <figcaption style={{ padding: "10px 2px 12px" }}>
                    <div style={{ fontFamily: "'Caveat', cursive", fontSize: "22px", lineHeight: "1.1", color: "#111111" }}>[caption — what's happening here]</div>
                    <div style={{ marginTop: "4px", fontFamily: "'Space Mono', monospace", fontSize: "9.5px", letterSpacing: "1.2px", textTransform: "uppercase", color: "#6B665C" }}>Highlight 01 · [place]</div>
                  </figcaption>
                </div>
              </figure>
            </div>
            <div className="gal-slide" style={{ width: "390px", flexShrink: "0", boxSizing: "border-box", padding: "18px 30px 0", transform: `scale(${v.g.s1.sc})`, opacity: v.g.s1.op, transition: v.g.tr }} aria-hidden={v.g.s1.hid}>
              <figure style={{ position: "relative", margin: "0", transform: "rotate(1.2deg)" }}>
                <div style={{ position: "absolute", left: "50%", top: "-12px", marginLeft: "-8px", width: "16px", height: "26px", background: "#C9A57A", border: "1.5px solid #111111", boxSizing: "border-box", zIndex: "2" }} />
                <div style={{ background: "#FFFFFF", border: "2px solid #111111", boxShadow: "7px 7px 0 #E9A23B", padding: "10px 10px 0" }}>
                  <div style={{ height: "var(--ph)", background: "#5E7F8C", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "#F3EEE4" }}>[photo 2]</div>
                  <figcaption style={{ padding: "10px 2px 12px" }}>
                    <div style={{ fontFamily: "'Caveat', cursive", fontSize: "22px", lineHeight: "1.1", color: "#111111" }}>[caption — what's happening here]</div>
                    <div style={{ marginTop: "4px", fontFamily: "'Space Mono', monospace", fontSize: "9.5px", letterSpacing: "1.2px", textTransform: "uppercase", color: "#6B665C" }}>Highlight 02 · [place]</div>
                  </figcaption>
                </div>
              </figure>
            </div>
            <div className="gal-slide" style={{ width: "390px", flexShrink: "0", boxSizing: "border-box", padding: "18px 30px 0", transform: `scale(${v.g.s2.sc})`, opacity: v.g.s2.op, transition: v.g.tr }} aria-hidden={v.g.s2.hid}>
              <figure style={{ position: "relative", margin: "0", transform: "rotate(-0.8deg)" }}>
                <div style={{ position: "absolute", left: "50%", top: "-12px", marginLeft: "-8px", width: "16px", height: "26px", background: "#C9A57A", border: "1.5px solid #111111", boxSizing: "border-box", zIndex: "2" }} />
                <div style={{ background: "#FFFFFF", border: "2px solid #111111", boxShadow: "7px 7px 0 #E9A23B", padding: "10px 10px 0" }}>
                  <div style={{ height: "var(--ph)", background: "#A7765A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "#F3EEE4" }}>[photo 3]</div>
                  <figcaption style={{ padding: "10px 2px 12px" }}>
                    <div style={{ fontFamily: "'Caveat', cursive", fontSize: "22px", lineHeight: "1.1", color: "#111111" }}>[caption — what's happening here]</div>
                    <div style={{ marginTop: "4px", fontFamily: "'Space Mono', monospace", fontSize: "9.5px", letterSpacing: "1.2px", textTransform: "uppercase", color: "#6B665C" }}>Highlight 03 · [place]</div>
                  </figcaption>
                </div>
              </figure>
            </div>
            <div className="gal-slide" style={{ width: "390px", flexShrink: "0", boxSizing: "border-box", padding: "18px 30px 0", transform: `scale(${v.g.s3.sc})`, opacity: v.g.s3.op, transition: v.g.tr }} aria-hidden={v.g.s3.hid}>
              <figure style={{ position: "relative", margin: "0", transform: "rotate(1.6deg)" }}>
                <div style={{ position: "absolute", left: "50%", top: "-12px", marginLeft: "-8px", width: "16px", height: "26px", background: "#C9A57A", border: "1.5px solid #111111", boxSizing: "border-box", zIndex: "2" }} />
                <div style={{ background: "#FFFFFF", border: "2px solid #111111", boxShadow: "7px 7px 0 #E9A23B", padding: "10px 10px 0" }}>
                  <div style={{ height: "var(--ph)", background: "#8A8F6A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "#F3EEE4" }}>[photo 4]</div>
                  <figcaption style={{ padding: "10px 2px 12px" }}>
                    <div style={{ fontFamily: "'Caveat', cursive", fontSize: "22px", lineHeight: "1.1", color: "#111111" }}>[caption — what's happening here]</div>
                    <div style={{ marginTop: "4px", fontFamily: "'Space Mono', monospace", fontSize: "9.5px", letterSpacing: "1.2px", textTransform: "uppercase", color: "#6B665C" }}>Highlight 04 · [place]</div>
                  </figcaption>
                </div>
              </figure>
            </div>
            <div className="gal-slide" style={{ width: "390px", flexShrink: "0", boxSizing: "border-box", padding: "18px 30px 0", transform: `scale(${v.g.s4.sc})`, opacity: v.g.s4.op, transition: v.g.tr }} aria-hidden={v.g.s4.hid}>
              <figure style={{ position: "relative", margin: "0", transform: "rotate(-1.2deg)" }}>
                <div style={{ position: "absolute", left: "50%", top: "-12px", marginLeft: "-8px", width: "16px", height: "26px", background: "#C9A57A", border: "1.5px solid #111111", boxSizing: "border-box", zIndex: "2" }} />
                <div style={{ background: "#FFFFFF", border: "2px solid #111111", boxShadow: "7px 7px 0 #E9A23B", padding: "10px 10px 0" }}>
                  <div style={{ height: "var(--ph)", background: "#4F6B78", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "#F3EEE4" }}>[photo 5]</div>
                  <figcaption style={{ padding: "10px 2px 12px" }}>
                    <div style={{ fontFamily: "'Caveat', cursive", fontSize: "22px", lineHeight: "1.1", color: "#111111" }}>[caption — what's happening here]</div>
                    <div style={{ marginTop: "4px", fontFamily: "'Space Mono', monospace", fontSize: "9.5px", letterSpacing: "1.2px", textTransform: "uppercase", color: "#6B665C" }}>Highlight 05 · [place]</div>
                  </figcaption>
                </div>
              </figure>
            </div>
          </div>
        </div>
        {/* arrows + morphing dots */}
        <div style={{ position: "absolute", left: "20px", top: "calc(var(--ph) + 274px)", width: "350px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button className="press" onClick={v.g.prev} disabled={v.g.prevOff} aria-label="Previous photo" style={{ "--c": "#E9A23B", width: "48px", height: "48px", flexShrink: "0", padding: "0", background: "#FFFFFF", border: "2px solid #F3EEE4", boxShadow: "4px 4px 0 #E9A23B", display: "flex", alignItems: "center", justifyContent: "center", opacity: v.g.prevOp, transition: "opacity 200ms ease" }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#111111" strokeWidth="2.6" strokeLinecap="square">
              <path d="M13 3 L6 10 L13 17" />
            </svg>
          </button>
          <div aria-hidden="true" style={{ display: "flex", alignItems: "center", gap: "7px" }}>
            <span style={{ display: "block", height: "7px", width: `${v.g.d0.w}px`, borderRadius: "4px", background: v.g.d0.bg, transition: v.g.dtr }} />
            <span style={{ display: "block", height: "7px", width: `${v.g.d1.w}px`, borderRadius: "4px", background: v.g.d1.bg, transition: v.g.dtr }} />
            <span style={{ display: "block", height: "7px", width: `${v.g.d2.w}px`, borderRadius: "4px", background: v.g.d2.bg, transition: v.g.dtr }} />
            <span style={{ display: "block", height: "7px", width: `${v.g.d3.w}px`, borderRadius: "4px", background: v.g.d3.bg, transition: v.g.dtr }} />
            <span style={{ display: "block", height: "7px", width: `${v.g.d4.w}px`, borderRadius: "4px", background: v.g.d4.bg, transition: v.g.dtr }} />
          </div>
          <button className="press" onClick={v.g.next} disabled={v.g.nextOff} aria-label="Next photo" style={{ "--c": "#E9A23B", width: "48px", height: "48px", flexShrink: "0", padding: "0", background: "#FFFFFF", border: "2px solid #F3EEE4", boxShadow: "4px 4px 0 #E9A23B", display: "flex", alignItems: "center", justifyContent: "center", opacity: v.g.nextOp, transition: "opacity 200ms ease" }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#111111" strokeWidth="2.6" strokeLinecap="square">
              <path d="M7 3 L14 10 L7 17" />
            </svg>
          </button>
        </div>
        {/* thumbnails */}
        <div style={{ position: "absolute", left: "0", top: "calc(var(--ph) + 360px)", width: "390px", display: "flex", justifyContent: "center", gap: "10px" }}>
          <button onClick={v.g.go0} aria-label="Show photo 1" aria-current={v.g.t0.cur} style={{ width: "52px", height: "52px", padding: "3px", boxSizing: "border-box", background: "#FFFFFF", border: `2px solid ${v.g.t0.bd}`, boxShadow: v.g.t0.sh, transform: `translateY(${v.g.t0.y}px)`, opacity: v.g.t0.op, transition: "transform 300ms cubic-bezier(0.32, 0.72, 0, 1), opacity 300ms ease, border-color 150ms ease" }}>
            <span style={{ display: "block", width: "100%", height: "100%", background: "#6F8468" }} />
          </button>
          <button onClick={v.g.go1} aria-label="Show photo 2" aria-current={v.g.t1.cur} style={{ width: "52px", height: "52px", padding: "3px", boxSizing: "border-box", background: "#FFFFFF", border: `2px solid ${v.g.t1.bd}`, boxShadow: v.g.t1.sh, transform: `translateY(${v.g.t1.y}px)`, opacity: v.g.t1.op, transition: "transform 300ms cubic-bezier(0.32, 0.72, 0, 1), opacity 300ms ease, border-color 150ms ease" }}>
            <span style={{ display: "block", width: "100%", height: "100%", background: "#5E7F8C" }} />
          </button>
          <button onClick={v.g.go2} aria-label="Show photo 3" aria-current={v.g.t2.cur} style={{ width: "52px", height: "52px", padding: "3px", boxSizing: "border-box", background: "#FFFFFF", border: `2px solid ${v.g.t2.bd}`, boxShadow: v.g.t2.sh, transform: `translateY(${v.g.t2.y}px)`, opacity: v.g.t2.op, transition: "transform 300ms cubic-bezier(0.32, 0.72, 0, 1), opacity 300ms ease, border-color 150ms ease" }}>
            <span style={{ display: "block", width: "100%", height: "100%", background: "#A7765A" }} />
          </button>
          <button onClick={v.g.go3} aria-label="Show photo 4" aria-current={v.g.t3.cur} style={{ width: "52px", height: "52px", padding: "3px", boxSizing: "border-box", background: "#FFFFFF", border: `2px solid ${v.g.t3.bd}`, boxShadow: v.g.t3.sh, transform: `translateY(${v.g.t3.y}px)`, opacity: v.g.t3.op, transition: "transform 300ms cubic-bezier(0.32, 0.72, 0, 1), opacity 300ms ease, border-color 150ms ease" }}>
            <span style={{ display: "block", width: "100%", height: "100%", background: "#8A8F6A" }} />
          </button>
          <button onClick={v.g.go4} aria-label="Show photo 5" aria-current={v.g.t4.cur} style={{ width: "52px", height: "52px", padding: "3px", boxSizing: "border-box", background: "#FFFFFF", border: `2px solid ${v.g.t4.bd}`, boxShadow: v.g.t4.sh, transform: `translateY(${v.g.t4.y}px)`, opacity: v.g.t4.op, transition: "transform 300ms cubic-bezier(0.32, 0.72, 0, 1), opacity 300ms ease, border-color 150ms ease" }}>
            <span style={{ display: "block", width: "100%", height: "100%", background: "#4F6B78" }} />
          </button>
        </div>
        <div style={{ position: "absolute", left: "0", top: "calc(var(--ph) + 442px)", width: "390px", textAlign: "center", fontFamily: "'Caveat', cursive", fontSize: "19px", color: "#8E8A7A" }}>swipe, or use the arrows</div>
      </div>
    );
  }
}
