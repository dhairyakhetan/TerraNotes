import { useEffect, useRef } from 'react';
import WebCard from './WebCard.jsx';
import { webZoom } from '../lib/layout.js';
import { ARTICLES, COMING_SOON } from '../data/articles.js';
import { pad2 } from '../lib/format.js';

// Peg i hangs from x = 164 + 208·i on the wire; these repeat every 12 pegs.
const PITCH = 208;
const CARD_TOP = [106, 158, 118, 180, 112, 150, 162, 118, 136, 184, 122, 160]; // where each card's clip sits
export const TILT = [-2.2, 1.6, -1.2, 2.4, -1.8, 1.4, -2.6, 1.9, -1.1, 2.2, -1.6, 1.2];
export const SWING = [1.75, 1.39, 1.63, 1.26, 1.69, 1.45, 1.3, 1.73, 1.48, 1.23, 1.59, 1.38];
export const DURATION = [4.8, 5.5, 6.2];

const peg = (i) => {
  const x = 164 + PITCH * i, y = i % 2 ? 88 : 78, drop = CARD_TOP[i % 12] - y;
  return { x, y, drop, tilt: TILT[i % 12], swing: SWING[i % 12], dur: DURATION[i % 3] };
};

// The wire: sags between pegs, runs off both ends of the track. dy moves it up or down. (Phone line view.)
export const wirePath = (pegs, width, dy = 0) => {
  let d = `M0 ${78 + dy} Q82 ${100 + dy} ${pegs[0].x} ${pegs[0].y}`;
  for (let i = 1; i < pegs.length; i++) d += ` Q${(pegs[i - 1].x + pegs[i].x) / 2} ${110 + dy} ${pegs[i].x} ${pegs[i].y}`;
  const last = pegs[pegs.length - 1];
  return `${d} Q${(last.x + width) / 2} ${110 + dy} ${width} ${78 + dy}`;
};

// Web wire: starts at peg `from` (the lead string from the label card ties on there) and runs off the far end.
const wireFrom = (pegs, width, from) => {
  let d = `M${pegs[from].x} ${pegs[from].y}`;
  for (let i = from + 1; i < pegs.length; i++) d += ` Q${(pegs[i - 1].x + pegs[i].x) / 2} 110 ${pegs[i].x} ${pegs[i].y}`;
  const last = pegs[pegs.length - 1];
  return `${d} Q${(last.x + width) / 2} 110 ${width} 78`;
};

const RAD = Math.PI / 180;
const rot = ([x, y], t) => [x * Math.cos(t) - y * Math.sin(t), x * Math.sin(t) + y * Math.cos(t)]; // CSS rotate (y down)
// CSS ease-in-out, cubic-bezier(0.42, 0, 0.58, 1): solve x(u) = t for u, return y(u)
const easeInOut = (t) => {
  const bx = (u) => 3 * u * (1 - u) * (1 - u) * 0.42 + 3 * u * u * (1 - u) * 0.58 + u * u * u;
  let u = t;
  for (let i = 0; i < 6; i++) { const dx = 3 * (1 - u) * (1 - u) * 0.42 + 6 * u * (1 - u) * (0.58 - 0.42) + 3 * u * u * (1 - 0.58); if (Math.abs(dx) < 1e-6) break; u -= (bx(u) - t) / dx; }
  u = Math.min(1, Math.max(0, u));
  return 3 * u * u * (1 - u) + u * u * u;
};
const KICK = [1, 0.8, 1.15, 0.9, 1.05]; // how strongly each card answers the swing
const RETIE_MS = 220;                    // the lead string sliding over to the next card
const PULL_WAIT = 160;                   // after the last scroll/drag, how long before the string starts pulling
const PULL_K = 0.07, PULL_DAMP = 0.8;    // the pull's spring: a little overshoot, then it settles

// Everything that moves on the line, in one requestAnimationFrame loop that only runs while the line is on screen:
// - cards on screen (or one card away) sway; the rest hold still
// - moving the line swings the cards: they trail behind it, swing back and settle (a damped spring)
// - the lead string runs tight from the label card's knot (following its sway) to the card nearest its spot,
//   and once you let go of the line it pulls that card into the spot (where the first card hangs at rest)
// - the progress bar and arrows (written directly, so scrolling never re-renders React)
function runLine(r, pegs, width) {
  const { el, svg, knot, lead, wire, bar, prev, next, label } = r;
  const hangs = [...r.hangs], kicks = [...r.kicks]; // copies: React clears the originals on unmount, a frame may still be queued
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const live = new Set();
  const near = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const i = hangs.indexOf(e.target);
      e.target.classList.toggle('live', e.isIntersecting);
      if (e.isIntersecting) live.add(i); else live.delete(i);
    }
  }, { root: el, rootMargin: `0px ${PITCH}px` });
  hangs.forEach((h) => near.observe(h));

  let shown = false, raf = 0;
  const SPOT = pegs[0].x; // the perfect spot: where the first card's peg sits when the line is at rest
  const tagged = (s) => pegs.reduce((b, p, i) => (Math.abs(p.x - s - SPOT) < Math.abs(pegs[b].x - s - SPOT) ? i : b), 0);
  // the pull: only ever after you've moved the line, and it stops the moment you touch it again
  let pulling = false, want = 0, pos = 0, vel = 0, idle = 0, held = false;
  const stopPull = () => { pulling = false; clearTimeout(idle); };
  const pullSoon = () => { clearTimeout(idle); if (!still && !held) idle = setTimeout(startPull, PULL_WAIT); };
  const startPull = () => {
    if (held || !shown) return;
    const s = el.scrollLeft, max = el.scrollWidth - el.clientWidth;
    // rest with a card in the spot, or at the very end of the line (so the last cards and the bar's 100% are reachable)
    want = [...pegs.map((p) => Math.max(0, Math.min(max, p.x - SPOT))), max].reduce((b, x) => (Math.abs(x - s) < Math.abs(b - s) ? x : b));
    if (Math.abs(want - s) < 0.5) return;
    pulling = true; pos = s; vel = 0; tick();
  };
  let last = el.scrollLeft, lean = 0, speed = 0, swinging = false;
  let tie = -1, from = null, end = null, tiedAt = 0, drawn = [NaN, NaN, NaN];
  // Where things are, in the lead svg's coordinates. Read from the DOM once (and on resize), never per frame.
  const g = {};
  const measure = () => {
    const z = svg.getBoundingClientRect().width / svg.width.baseVal.value || 1;
    const sr = svg.getBoundingClientRect(), er = el.getBoundingClientRect(), root = label.offsetParent.getBoundingClientRect();
    g.ox = (er.left - sr.left) / z; g.oy = (er.top - sr.top) / z;          // the scroller's top-left
    const sx = (sr.left - root.left) / z, sy = (sr.top - root.top) / z;      // the svg inside the page
    const flutter = knot.offsetParent;
    g.pivot = [label.offsetLeft + label.offsetWidth / 2 - sx, label.offsetTop - sy];                  // the label sways about its top middle…
    g.arm = [flutter.offsetLeft + flutter.offsetWidth / 2 - label.offsetWidth / 2, flutter.offsetTop];  // …the card wobbles about its own top middle…
    g.knot = [knot.offsetLeft + knot.offsetWidth / 2 - flutter.offsetWidth / 2, knot.offsetTop + knot.offsetHeight / 2]; // …and the knot rides on the card
    const cs = (n, v) => parseFloat(getComputedStyle(n).getPropertyValue(v)) || 0;
    g.sway = { anim: label.getAnimations()[0], a: cs(label, '--a') };
    g.wobble = { anim: flutter.getAnimations()[0], r: cs(flutter, '--r') };
  };
  // The two angles right now, from the running CSS animations (sway: -a → +a; flutter: r ∓ 0.7deg; both ease-in-out).
  const angle = (x, lo, hi) => {
    const t = x.anim && x.anim.effect.getComputedTiming().progress;
    return t == null ? (lo + hi) / 2 : lo + (hi - lo) * easeInOut(t);
  };
  const knotAt = () => {
    const ts = angle(g.sway, -g.sway.a, g.sway.a) * RAD, tf = angle(g.wobble, g.wobble.r - 0.7, g.wobble.r + 0.7) * RAD;
    const [kx, ky] = rot(g.knot, tf), [px, py] = rot([g.arm[0] + kx, g.arm[1] + ky], ts);
    return [g.pivot[0] + px, g.pivot[1] + py];
  };
  const progress = () => {
    const max = el.scrollWidth - el.clientWidth, p = max > 0 ? el.scrollLeft / max : 0;
    bar.style.width = `${Math.round(Math.max(0.06, p) * 100)}%`;
    prev.style.opacity = p <= 0.01 ? '0.35' : '1';
    next.style.opacity = p >= 0.99 ? '0.35' : '1';
  };

  const frame = (now) => {
    raf = 0;
    if (pulling) {
      vel = (vel + (want - pos) * PULL_K) * PULL_DAMP;
      pos += vel;
      if (Math.abs(want - pos) < 0.3 && Math.abs(vel) < 0.3) { pos = want; pulling = false; }
      el.scrollLeft = pos;
    }
    const s = el.scrollLeft, moved = s - last; // + = line moving left
    last = s;
    if (moved) progress();

    // swing
    if (!still && (moved || swinging)) {
      const target = Math.max(-10, Math.min(10, moved * 0.35)); // lean back against the motion
      speed = (speed + (target - lean) * 0.06) * 0.9;
      lean += speed;
      swinging = Math.abs(lean) > 0.02 || Math.abs(speed) > 0.02;
      if (swinging) live.forEach((i) => { kicks[i].style.transform = `rotate(${(lean * KICK[i % KICK.length]).toFixed(2)}deg)`; });
      else { lean = speed = 0; kicks.forEach((k) => { k.style.transform = ''; }); }
    }

    // lead string: knot on the label card → the card nearest the spot
    const k = tagged(s);
    const target = { x: g.ox + pegs[k].x - s, y: g.oy + pegs[k].y };
    if (k !== tie) {
      if (tie >= 0 && !still) { from = end; tiedAt = now; }
      tie = k;
      wire.setAttribute('d', wireFrom(pegs, width, k));
    }
    const t = from ? Math.min(1, (now - tiedAt) / RETIE_MS) : 1;
    const e = 1 - (1 - t) ** 3;
    end = t < 1 ? { x: from.x + (target.x - from.x) * e, y: from.y + (target.y - from.y) * e } : target;
    if (t >= 1) from = null;
    // redraw only when an end has actually moved (the label drifts ~2px a second; each redraw costs a layout)
    const [kx, ky] = knotAt();
    if (moved || from || Math.abs(kx - drawn[0]) + Math.abs(ky - drawn[1]) > 0.3 || end.x !== drawn[2]) {
      drawn = [kx, ky, end.x];
      const sag = Math.min(8, Math.hypot(end.x - kx, end.y - ky) * 0.025); // pulled tight: barely sags
      lead.setAttribute('d', `M${kx.toFixed(1)} ${ky.toFixed(1)} Q${((kx + end.x) / 2).toFixed(1)} ${((ky + end.y) / 2 + sag).toFixed(1)} ${end.x.toFixed(1)} ${end.y.toFixed(1)}`);
    }

    // keep going while on screen (the label card sways); with reduced motion, only while something moves
    if (shown && (!still || swinging || from || pulling)) raf = requestAnimationFrame(frame);
  };
  const tick = () => { if (shown && !raf) raf = requestAnimationFrame(frame); };

  const seen = new IntersectionObserver(([e]) => {
    shown = e.isIntersecting;
    el.classList.toggle('away', !shown);
    label.classList.toggle('away', !shown);
    if (shown) { measure(); tick(); }
  });
  seen.observe(el);
  const onScroll = () => { tick(); if (!pulling) pullSoon(); }; // our own pull's scrolling doesn't restart it
  const grab = () => { held = true; stopPull(); };
  const letGo = () => { if (held) { held = false; pullSoon(); } };
  el.addEventListener('scroll', onScroll, { passive: true });
  el.addEventListener('pointerdown', grab);
  el.addEventListener('touchstart', grab, { passive: true });
  el.addEventListener('wheel', stopPull, { passive: true });
  el.addEventListener('keydown', stopPull);
  addEventListener('pointerup', letGo);
  addEventListener('pointercancel', letGo);
  addEventListener('touchend', letGo);
  r.stopPull = stopPull; // the arrow buttons take over from a pull in progress
  const onResize = () => { measure(); tick(); };
  addEventListener('resize', onResize);
  progress();

  return () => {
    near.disconnect(); seen.disconnect(); cancelAnimationFrame(raf); clearTimeout(idle);
    el.removeEventListener('scroll', onScroll); removeEventListener('resize', onResize);
    el.removeEventListener('pointerdown', grab); el.removeEventListener('touchstart', grab);
    el.removeEventListener('wheel', stopPull); el.removeEventListener('keydown', stopPull);
    removeEventListener('pointerup', letGo); removeEventListener('pointercancel', letGo); removeEventListener('touchend', letGo);
  };
}

// A peg with no story yet: dashed card with a handwritten note. clips = where its clips sit (px from the left), centred by default.
export function SoonCard({ text, w = 172, h = 272, font = '27px', clips = [w / 2 - 14], style }) {
  return (
    <div style={{ position: "absolute", left: "0", top: "0", width: `${w}px`, height: `${h}px`, ...style }}>
      {clips.map((x) => <div key={x} style={{ position: "absolute", left: `${x}px`, top: "-7px", width: "28px", height: "10px", background: "#D9D1BF", border: "1.5px solid #111111", boxSizing: "border-box", zIndex: "2" }} />)}
      <div style={{ width: "100%", height: "100%", boxSizing: "border-box", background: "#FBF8F1", border: "2px dashed #8E7A5E", padding: "14px 14px 16px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "1.4px", color: "#8E7A5E" }}>ON THE LINE SOON</span>
        <p style={{ margin: "0", fontFamily: "'Caveat', cursive", fontSize: font, lineHeight: "1.05", color: "#5B3A1E", transform: "rotate(-2deg)" }}>{text}</p>
        <svg width="34" height="14" viewBox="0 0 34 14" fill="none" stroke="#8E7A5E" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
          <path d="M1 8 C8 3 14 12 21 7 S30 4 33 7" />
        </svg>
      </div>
    </div>
  );
}

// Every write-up on one line (this replaces the phone's "All articles" page), followed by empty pegs.
// Scroll with a trackpad, shift+wheel, the scrollbar, the keyboard, the arrows, or drag it with the mouse.
// No snapping: the line only moves when you move it.
export default function ArticleLine() {
  const refs = useRef({ hangs: [], kicks: [] }).current;
  const items = [...ARTICLES.map((a) => ({ a })), ...COMING_SOON.map((text) => ({ text }))];
  const pegs = items.map((_, i) => peg(i));
  const width = pegs[pegs.length - 1].x + 224;
  useEffect(() => runLine(refs, pegs, width), []);
  const scrollBy = (dx) => { refs.stopPull?.(); refs.el.scrollBy({ left: dx, behavior: 'smooth' }); };

  // Mouse: drag the line sideways (touch and trackpads scroll it natively). A drag isn't a click on a card.
  const dragged = useRef(false);
  const onPointerDown = (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    const el = refs.el, x0 = e.clientX, left0 = el.scrollLeft, z = webZoom(), id = e.pointerId;
    dragged.current = false;
    const move = (ev) => {
      const dx = (ev.clientX - x0) / z;
      if (!dragged.current && Math.abs(dx) > 5) {
        dragged.current = true;
        el.classList.add('dragging');
        try { el.setPointerCapture(id); } catch { /* pointer already gone */ }
      }
      if (dragged.current) el.scrollLeft = left0 - dx;
    };
    const up = () => {
      removeEventListener('pointermove', move);
      removeEventListener('pointerup', up);
      removeEventListener('pointercancel', up);
      el.classList.remove('dragging');
      setTimeout(() => { dragged.current = false; }); // after the click that ends a drag has been swallowed
    };
    // captured pointer events still bubble to window, so these keep coming even outside the window
    addEventListener('pointermove', move);
    addEventListener('pointerup', up);
    addEventListener('pointercancel', up);
  };
  const onClickCapture = (e) => { if (dragged.current) { e.preventDefault(); e.stopPropagation(); dragged.current = false; } };
  const arrow = { width: "48px", height: "48px", padding: "0", border: "2px solid #111111", boxShadow: "4px 4px 0 #111111", display: "flex", alignItems: "center", justifyContent: "center" };

  return (
    <>
      <section id="articles" aria-label="Articles" style={{ position: "absolute", left: "0", top: "420px", width: "1440px", height: "700px" }} />
      {/* the lead string: label card → nearest card on the line (drawn by runLine) */}
      <svg ref={(n) => { refs.svg = n; }} width="1440" height="200" viewBox="0 0 1440 200" style={{ position: "absolute", left: "0", top: "420px", pointerEvents: "none" }} aria-hidden="true">
        <path ref={(n) => { refs.lead = n; }} fill="none" stroke="#5B3A1E" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      {/* "Articles" label card, tied to the intro card's knot */}
      <div ref={(n) => { refs.label = n; }} className="hang sway" style={{ position: "absolute", left: "110px", top: "430px", width: "170px", height: "234px", "--a": "1deg", "--d": "5.2s", animationDelay: "-0.4s" }}>
        <div style={{ position: "absolute", left: "84.3px", top: "0", width: "1.4px", height: "82px", background: "#5B3A1E" }} />
        <div className="flutter" style={{ position: "absolute", left: "0", top: "80px", width: "170px", height: "154px", "--r": "-2.5deg", transform: "rotate(-2.5deg)" }}>
          <div style={{ position: "absolute", left: "50%", top: "-7px", marginLeft: "-14px", width: "28px", height: "10px", background: "#F0442B", border: "1.5px solid #111111", boxSizing: "border-box", zIndex: "2" }} />
          <div style={{ width: "100%", height: "100%", boxSizing: "border-box", background: "#111111", color: "#F3EEE4", padding: "18px", border: "2px solid #111111", boxShadow: "7px 7px 0 #F0442B", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <h2 style={{ margin: "0", fontFamily: "'Caveat', cursive", fontWeight: "700", fontSize: "52px", lineHeight: "0.9" }}>Articles</h2>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "1.4px", color: "#CFC8B8" }}>{`${pad2(ARTICLES.length)} PIECES`}</div>
          </div>
          {/* the knot the lead string is tied to; it moves with the card */}
          <div ref={(n) => { refs.knot = n; }} style={{ position: "absolute", left: "166px", top: "32px", width: "12px", height: "12px", boxSizing: "border-box", borderRadius: "50%", background: "#111111", border: "2px solid #F3EEE4", zIndex: "2" }} />
        </div>
      </div>
      <div ref={(n) => { refs.el = n; }} className="art-scroller" onPointerDown={onPointerDown} onClickCapture={onClickCapture} onDragStart={(e) => e.preventDefault()} tabIndex={0} aria-label="All write-ups, scroll sideways" style={{ position: "absolute", left: "300px", top: "470px", width: "1140px", height: "530px", overflowX: "auto", overflowY: "hidden", userSelect: "none", WebkitUserSelect: "none" }}>
        <div style={{ position: "relative", width: `${width}px`, height: "520px" }}>
          <svg width={width} height="200" viewBox={`0 0 ${width} 200`} style={{ position: "absolute", left: "0", top: "0" }} aria-hidden="true">
            <path ref={(n) => { refs.wire = n; }} d={wireFrom(pegs, width, 0)} fill="none" stroke="#5B3A1E" strokeWidth="1.8" />
          </svg>
          {items.map((item, i) => {
            const p = pegs[i];
            return (
              // a gentle idle sway (half the phone's, slower); the inner box takes the swing from scrolling
              <div key={i} ref={(n) => { refs.hangs[i] = n; }} className="hang sway" style={{ position: "absolute", left: `${p.x - 86}px`, top: `${p.y}px`, width: "172px", height: `${p.drop + 272}px`, "--a": `${(p.swing * 0.45).toFixed(2)}deg`, "--d": `${(p.dur * 1.5).toFixed(1)}s`, animationDelay: `${(-1.3 * i).toFixed(1)}s` }}>
                <div ref={(n) => { refs.kicks[i] = n; }} style={{ position: "absolute", inset: "0", transformOrigin: "50% 0" }}>
                  <div style={{ position: "absolute", left: "85.3px", top: "0", width: "1.4px", height: `${p.drop + 2}px`, background: "#5B3A1E" }} />
                  <div style={{ position: "absolute", left: "0", top: `${p.drop}px`, width: "172px", height: "272px", transform: `rotate(${p.tilt}deg)`, transformOrigin: "50% 0" }}>
                    {item.a ? <WebCard article={item.a} /> : <SoonCard text={item.text} />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ position: "absolute", left: "300px", top: "1024px", width: "1060px", display: "flex", alignItems: "center", gap: "20px" }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "1.6px", whiteSpace: "nowrap" }}>{`${pad2(ARTICLES.length)} WRITE-UPS · SCROLL SIDEWAYS`}</div>
        <div style={{ flexGrow: "1", height: "4px", background: "#D9D1BF", position: "relative" }}>
          <div ref={(n) => { refs.bar = n; }} style={{ position: "absolute", left: "0", top: "0", height: "4px", width: "6%", background: "#111111", transition: "width 120ms linear" }} />
        </div>
        <button ref={(n) => { refs.prev = n; }} className="btn" onClick={() => scrollBy(-624)} aria-label="Scroll write-ups left" style={{ ...arrow, background: "#FFFFFF", opacity: "0.35" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2.8" strokeLinecap="square"><path d="M15 4 L7 12 L15 20" /></svg>
        </button>
        <button ref={(n) => { refs.next = n; }} className="btn" onClick={() => scrollBy(624)} aria-label="Scroll write-ups right" style={{ ...arrow, background: "#F7C21A" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2.8" strokeLinecap="square"><path d="M9 4 L17 12 L9 20" /></svg>
        </button>
      </div>
    </>
  );
}
