import { useEffect, useRef } from 'react';
import { useEdition } from '../../../lib/edition.js';
import { calm, LITE } from '../../../lib/motion.js';
import { byId } from '../../../lib/dom.js';
import { FONT } from '../../../styles/fonts.js';
import { Alpana, Conch, Dhak, Sparkle, Toran } from '../Decor.jsx';

// The top of October's pandal home page (PandalHome.jsx): a pandal's gate, lit with bulbs, and the issue inside its
// arch: "Land. Water. City.", the edition's intro and a way in to the route of articles. Scrolling walks you in: the
// gate grows and fades past you while the words inside drift up more slowly (transform / opacity on scroll, drawn in
// one requestAnimationFrame per scroll; not with reduced motion or LITE). Bulbs twinkle (.pd-bulb, pandal.css).
// G: the drawing's numbers per layout (artboard px; the SVG's own coordinates start at the gate's top).
const G = {
  web: { top: 80, w: 1440, h: 900, cx: 720, tower: [220, 330], towerTop: 210, base: 860, facade: [330, 1110, 250], roof: [[300, 262], [720, 92], [1140, 262]], roofIn: [[390, 252], [720, 146], [1050, 252]], spire: 40, arch: [430, 1010, 520], cusp: 17, tiers: [300, 420, 540, 660, 780], dome: 55,
    text: { left: 470, top: 330, width: 500 }, mono: "12px", title: "70px", hand: "30px", intro: "15.5px", btn: "12px" },
  phone: { top: 64, w: 390, h: 640, cx: 195, tower: [8, 48], towerTop: 176, base: 612, facade: [48, 342, 186], roof: [[28, 190], [195, 70], [362, 190]], roofIn: [[74, 186], [195, 108], [316, 186]], spire: 34, arch: [64, 326, 312], cusp: 9, tiers: [250, 340, 430, 520], dome: 24,
    text: { left: 78, top: 262, width: 234 }, mono: "9px", title: "31px", hand: "20px", intro: "12.5px", btn: "11px" },
};
const ink = { stroke: "var(--ink)", strokeWidth: "3", strokeLinejoin: "round" };

function Drawing({ L, web }) {
  const [tl, tr] = L.tower, W = L.w, rTop = L.towerTop, [fl, fr, ft] = L.facade, [al, ar, spring] = L.arch, r = (ar - al) / 2, cx = L.cx;
  const sw = web ? 3 : 2;
  const pts = (p) => p.map((q) => q.join(',')).join(' ');
  const bulbs = [];
  // bulbs round the arch, up the towers and along the roof
  for (let a = 180; a >= 0; a -= web ? 7 : 10) { const t = (a * Math.PI) / 180; bulbs.push([cx + Math.cos(t) * (r + (web ? 22 : 12)), spring - Math.sin(t) * (r + (web ? 22 : 12))]); }
  for (let y = rTop + 20; y < L.base - 10; y += web ? 38 : 30) { bulbs.push([tl + (tr - tl) / 2, y]); bulbs.push([W - tl - (tr - tl) / 2, y]); }
  const [p0, p1, p2] = L.roof;
  for (let k = 0; k <= 1; k += web ? 0.05 : 0.08) { bulbs.push([p0[0] + (p1[0] - p0[0]) * k, p0[1] + (p1[1] - p0[1]) * k - (web ? 8 : 5)]); bulbs.push([p2[0] + (p1[0] - p2[0]) * k, p2[1] + (p1[1] - p2[1]) * k - (web ? 8 : 5)]); }
  return (
    <svg width={W} height={L.h} viewBox={`0 0 ${W} ${L.h}`} aria-hidden="true" style={{ position: "absolute", left: "0", top: "0", overflow: "visible" }}>
      {/* the steps */}
      <rect x={tl - 20} y={L.base} width={W - 2 * tl + 40} height={web ? 22 : 14} style={{ fill: "var(--outside)", ...ink, strokeWidth: sw }} />
      {/* towers: red with marigold bands, a dome and a kalash on top */}
      {[tl, W - tr].map((x) => (
        <g key={x}>
          <rect x={x} y={rTop} width={tr - tl} height={L.base - rTop} style={{ fill: "var(--red)", ...ink, strokeWidth: sw }} />
          {L.tiers.map((y) => <rect key={y} x={x - 6} y={y} width={tr - tl + 12} height={web ? 14 : 9} style={{ fill: "var(--yellow)", ...ink, strokeWidth: sw * 0.7 }} />)}
          <path d={`M${x - 6} ${rTop} A${(tr - tl) / 2 + 6} ${L.dome} 0 0 1 ${x + tr - tl + 6} ${rTop} Z`} style={{ fill: "var(--yellow)", ...ink, strokeWidth: sw }} />
          <circle cx={x + (tr - tl) / 2} cy={rTop - L.dome - (web ? 10 : 6)} r={web ? 10 : 6} style={{ fill: "var(--red)", ...ink, strokeWidth: sw * 0.7 }} />
        </g>
      ))}
      {/* the facade and its roof, two tiers and a spire with a flag */}
      <rect x={fl} y={ft} width={fr - fl} height={L.base - ft} style={{ fill: "var(--yellow)", ...ink, strokeWidth: sw }} />
      <polygon points={pts(L.roof)} style={{ fill: "var(--red)", ...ink, strokeWidth: sw }} />
      <polygon points={pts(L.roofIn)} style={{ fill: "var(--pink)", ...ink, strokeWidth: sw }} />
      <path d={`M${cx} ${p1[1]} V${L.spire}`} style={{ ...ink, strokeWidth: sw }} />
      <path className="dz pd-flag" d={`M${cx} ${L.spire} l${web ? 46 : 26} ${web ? 12 : 7} l-${web ? 46 : 26} ${web ? 12 : 7} Z`} style={{ fill: "var(--green)", ...ink, strokeWidth: sw * 0.7 }} />
      {/* the arch: the night inside, a cusped edge */}
      <path d={`M${al} ${L.base} V${spring} A${r} ${r} 0 0 1 ${ar} ${spring} V${L.base} Z`} style={{ fill: "var(--wall)", ...ink, strokeWidth: sw }} />
      {Array.from({ length: 13 }, (_, i) => { const t = (Math.PI * (i + 0.5)) / 13; return <circle key={i} cx={cx - Math.cos(t) * r} cy={spring - Math.sin(t) * r} r={L.cusp} style={{ fill: "var(--yellow)", ...ink, strokeWidth: sw * 0.7 }} />; })}
      {[al, ar].map((x) => <circle key={x} cx={x} cy={spring} r={L.cusp} style={{ fill: "var(--yellow)", ...ink, strokeWidth: sw * 0.7 }} />)}
      {/* little stars in the night inside */}
      {[[0.18, 0.15], [0.82, 0.2], [0.1, 0.55], [0.9, 0.6], [0.5, 0.06]].map(([x, y], i) => <circle key={i} className="dz pd-bulb" cx={al + (ar - al) * x} cy={spring - r + (L.base - spring + r) * y} r={web ? 3 : 2} style={{ fill: "var(--spark)", animationDelay: `${i * 0.4}s` }} />)}
      {bulbs.map(([x, y], i) => <circle key={`b${i}`} className="dz pd-bulb" cx={x} cy={y} r={web ? 5 : 3.2} style={{ fill: "var(--bulb)", stroke: "var(--ink)", strokeWidth: "1", animationDelay: `${-(i % 5) * 0.35}s` }} />)}
    </svg>
  );
}

export default function Gate({ web }) {
  const L = G[web ? 'web' : 'phone'], { intro, number, month } = useEdition();
  const front = useRef(null), words = useRef(null);
  useEffect(() => { // walking in: the gate grows past you as you scroll
    if (calm() || LITE) return undefined;
    let raf = 0;
    const draw = () => {
      raf = 0;
      const s = Math.min(1, Math.max(0, scrollY / (web ? 700 : 520)));
      if (front.current) { front.current.style.transform = `scale(${1 + s * 0.45})`; front.current.style.opacity = String(1 - s * 0.85); }
      if (words.current) words.current.style.transform = `translateY(${-s * (web ? 90 : 60)}px)`;
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(draw); };
    addEventListener('scroll', on, { passive: true });
    draw();
    return () => { removeEventListener('scroll', on); cancelAnimationFrame(raf); };
  }, [web]);
  const go = () => byId('articles')?.scrollIntoView({ behavior: calm() ? 'auto' : 'smooth', block: 'start' });
  const T = L.text;
  return (
    <section aria-label="The gate" style={{ position: "absolute", left: "0", top: `${L.top}px`, width: `${L.w}px`, height: `${L.h}px` }}>
      <div ref={front} style={{ position: "absolute", inset: "0", transformOrigin: `${L.cx}px ${L.arch[2]}px`, willChange: web ? "transform" : undefined }}>
        <Drawing L={L} web={web} />
      </div>
      <div aria-hidden="true" style={{ position: "absolute", left: "0", top: "0", width: "0", height: "0" }}>
        <Toran width={L.w} top={0} swags={web ? 4 : 2} sag={web ? 26 : 14} />
        {web ? <>
          <Alpana left={L.cx - 60} top={L.base + 4} d={120} />
          <Dhak left={70} top={720} s={110} />
          <Conch left={1260} top={780} s={130} />
          {[[120, 300, 30, "mint", 0], [1300, 420, 26, "pink", 0.8], [90, 560, 22, "yellow", 1.6], [1330, 640, 20, "mint", 0.4]].map(([x, y, s, c, d]) => <Sparkle key={x} left={x} top={y} s={s} c={c} delay={d} />)}
        </> : null}
      </div>
      <div ref={words} style={{ position: "absolute", left: `${T.left}px`, top: `${T.top}px`, width: `${T.width}px`, textAlign: "center", color: "var(--page)" }}>
        <div style={{ fontFamily: FONT.mono, fontSize: L.mono, letterSpacing: web ? "1.8px" : "1.2px", color: "var(--labelDark)" }}>{`${web ? 'TERRANOTES · ' : ''}ISSUE ${String(number).padStart(2, '0')} · ${month.toUpperCase()}`}</div>
        <h1 style={{ margin: web ? "16px 0 0" : "10px 0 0", fontFamily: FONT.head, fontWeight: "400", fontSize: L.title, lineHeight: "1", textTransform: "uppercase", color: "var(--page)" }}>
          Land<span style={{ color: "var(--yellow)" }}>.</span> Water<span style={{ color: "var(--yellow)" }}>.</span><br />City<span style={{ color: "var(--yellow)" }}>.</span>
        </h1>
        <div style={{ marginTop: web ? "14px" : "8px", fontFamily: FONT.hand, fontSize: L.hand, lineHeight: "1.05", color: "var(--amber)", transform: "rotate(-2deg)" }}>Subho Sharodiya! come in, the pandals are this way</div>
        <p style={{ margin: web ? "18px auto 0" : "10px auto 0", maxWidth: web ? "440px" : "230px", fontFamily: FONT.body, fontSize: L.intro, lineHeight: "1.5", color: "var(--labelDark)" }}>{intro || '[Two or three lines introducing Aquaterra and what Terranotes is for.]'}</p>
        <button type="button" className="press btn" onClick={go} style={{ "--c": "var(--ink)", marginTop: web ? "24px" : "14px", minHeight: "44px", padding: "0 20px", background: "var(--yellow)", color: "var(--ink)", border: "2px solid var(--ink)", boxShadow: "4px 4px 0 var(--ink)", fontFamily: FONT.mono, fontWeight: "700", fontSize: L.btn, letterSpacing: "1px", textTransform: "uppercase", cursor: "pointer" }}>Start pandal hopping ↓</button>
      </div>
    </section>
  );
}
