import { useRef } from 'react';
import { useReveal } from '../../../lib/reveal.js';
import { usePauseOffscreen } from '../../../lib/pauseOffscreen.js';
import { FONT } from '../../../styles/fonts.js';
import { Dhak, Toran } from '../Decor.jsx';

// The pieces October's pandal home page (PandalHome.jsx) puts round the shared sections, plus its own ending:
//   Canopy     over the photo wall: a pandal's red cloth canopy, a scalloped marigold edge and a string of bulbs
//   Awning     over the words game: a striped stall awning with a sign, like a phuchka stall's
//   Banner     in the team section's heading spot: the "TerraNotes Pujo Committee" cloth banner, garlanded
//   Dashami    the goodbye before the games: a laal-paar panel, sindoor splashes, "Subho Bijoya!", a dhak and a diya
// All decoration is hidden from screen readers except the words. Positions: artboard px (left / top / width given).

export function Canopy({ left, top, width, web }) {
  const h = web ? 34 : 22, r = web ? 17 : 11, n = Math.ceil(width / (2 * r)), bulbs = [];
  for (let x = 20; x < width; x += web ? 44 : 30) bulbs.push(x);
  const sag = (x) => h + r + (web ? 26 : 16) * Math.sin(Math.PI * ((x / (width / 3)) % 1));
  return (
    <svg aria-hidden="true" width={width} height={h + r + (web ? 50 : 34)} viewBox={`0 0 ${width} ${h + r + (web ? 50 : 34)}`} style={{ position: "absolute", left: `${left}px`, top: `${top}px`, overflow: "visible", zIndex: "2" }}>
      <path d={`M0 ${h + r} ${Array.from({ length: 3 }, (_, k) => `Q${(k + 0.5) * width / 3} ${h + r + (web ? 52 : 32)} ${(k + 1) * width / 3} ${h + r}`).join(' ')}`} style={{ fill: "none", stroke: "var(--ink)", strokeWidth: "1.4" }} />
      {bulbs.map((x, i) => <circle key={x} className="dz pd-bulb" cx={x} cy={sag(x)} r={web ? 6 : 4} style={{ fill: "var(--bulb)", stroke: "var(--ink)", strokeWidth: "1", animationDelay: `${-(i % 4) * 0.45}s` }} />)}
      {Array.from({ length: n }, (_, i) => <circle key={`s${i}`} cx={r + i * 2 * r} cy={h} r={r} style={{ fill: i % 2 ? "var(--yellow)" : "var(--red)", stroke: "var(--ink)", strokeWidth: "2" }} />)}
      <rect x="0" y="0" width={width} height={h} style={{ fill: "var(--red)", stroke: "var(--ink)", strokeWidth: "2" }} />
      <rect x="0" y={h * 0.55} width={width} height={web ? 5 : 3} style={{ fill: "var(--yellow)" }} />
    </svg>
  );
}

export function Awning({ left, top, width, web, sign }) {
  const h = web ? 46 : 30, r = web ? 20 : 13, stripe = 2 * r, n = Math.ceil(width / stripe);
  return (
    <div aria-hidden="true" style={{ position: "absolute", left: `${left}px`, top: `${top}px`, width: `${width}px`, height: `${h + r}px`, zIndex: "2" }}>
      <svg width={width} height={h + r + 2} viewBox={`0 0 ${width} ${h + r + 2}`} style={{ position: "absolute", left: "0", top: "0", overflow: "visible" }}>
        {Array.from({ length: n }, (_, i) => (
          <g key={i}>
            <rect x={i * stripe} y="0" width={stripe} height={h} style={{ fill: i % 2 ? "var(--card)" : "var(--blue)" }} />
            <path d={`M${i * stripe} ${h} A${r} ${r} 0 0 0 ${(i + 1) * stripe} ${h}`} style={{ fill: i % 2 ? "var(--card)" : "var(--blue)", stroke: "var(--ink)", strokeWidth: "2" }} />
          </g>
        ))}
        <rect x="0" y="0" width={width} height={h} style={{ fill: "none", stroke: "var(--ink)", strokeWidth: "2" }} />
      </svg>
      {sign && <div style={{ position: "absolute", right: web ? "70px" : "16px", top: `${h + r - 4}px`, padding: web ? "6px 12px" : "4px 8px", background: "var(--yellow)", border: "2px solid var(--ink)", boxShadow: "3px 3px 0 var(--ink)", fontFamily: FONT.mono, fontWeight: "700", fontSize: web ? "11px" : "8.5px", letterSpacing: "1.2px", color: "var(--ink)", transform: "rotate(2deg)", whiteSpace: "nowrap" }}>{sign}</div>}
    </div>
  );
}

// the committee banner, in the team section's heading spot (its h2 is turned off there: TeamSection title={false})
export function Banner({ web }) {
  const W = web ? 500 : 236, H = web ? 170 : 108, r = web ? 12 : 8, n = Math.floor(W / (2 * r));
  return (
    <div style={{ position: "absolute", left: web ? "64px" : "14px", top: web ? "14px" : "14px", width: `${W}px`, height: `${H + r}px`, transform: "rotate(-1.2deg)" }}>
      <svg aria-hidden="true" width={W} height={H + r} viewBox={`0 0 ${W} ${H + r}`} style={{ position: "absolute", left: "0", top: "0", overflow: "visible" }}>
        <rect x="6" y="6" width={W - 6} height={H} style={{ fill: "var(--ink)" }} />
        <rect x="0" y="0" width={W - 6} height={H - 6} style={{ fill: "var(--red)", stroke: "var(--ink)", strokeWidth: "2" }} />
        <rect x={web ? 10 : 6} y={web ? 10 : 6} width={W - 6 - (web ? 20 : 12)} height={H - 6 - (web ? 20 : 12)} style={{ fill: "none", stroke: "var(--yellow)", strokeWidth: web ? "3" : "2", strokeDasharray: web ? "10 6" : "6 4" }} />
        {Array.from({ length: n }, (_, i) => <circle key={i} cx={r + i * 2 * r} cy={H - 6} r={r * 0.75} style={{ fill: "var(--yellow)", stroke: "var(--ink)", strokeWidth: "1.4" }} />)}
      </svg>
      {web && <div style={{ position: "absolute", left: "0", top: "0" }}><Toran width={W - 6} top={-26} swags={2} sag={14} /></div>}
      <h2 style={{ position: "absolute", left: web ? "28px" : "14px", top: web ? "34px" : "20px", right: web ? "24px" : "12px", margin: "0", textAlign: "center" }}>
        <span style={{ display: "block", fontFamily: FONT.mono, fontWeight: "700", fontSize: web ? "12px" : "8.5px", letterSpacing: web ? "2px" : "1.4px", color: "var(--yellow)" }}>AQUATERRA · SARBOJANIN · 2026</span>
        <span style={{ display: "block", marginTop: web ? "8px" : "4px", fontFamily: FONT.head, fontWeight: "400", fontSize: web ? "44px" : "23px", lineHeight: "1", textTransform: "uppercase", color: "var(--page)" }}>The Pujo Committee</span>
        <span style={{ display: "block", marginTop: web ? "8px" : "4px", fontFamily: FONT.hand, fontWeight: "400", fontSize: web ? "24px" : "16px", lineHeight: "1", color: "var(--yellow)" }}>(also known as: meet the team)</span>
      </h2>
    </div>
  );
}

// sindoor splashes: soft blobs in the alta red and lotus pink
const SPLASH = 'M50 8 C64 6 70 22 82 24 C96 27 96 44 88 52 C82 60 92 74 80 84 C68 94 56 84 46 90 C32 98 18 88 18 74 C18 62 6 58 8 44 C10 30 24 30 30 20 C36 12 40 9 50 8 Z';
const Diya = ({ left, top, s }) => (
  <svg aria-hidden="true" width={s} height={s} viewBox="0 0 100 100" style={{ position: "absolute", left: `${left}px`, top: `${top}px` }}>
    <path className="dz pd-flame" d="M50 14 C60 30 62 40 50 52 C38 40 40 30 50 14 Z" style={{ fill: "var(--yellow)", stroke: "var(--ink)", strokeWidth: "2.5", transformOrigin: "50px 52px" }} />
    <path d="M10 56 Q50 60 90 56 Q82 86 50 88 Q18 86 10 56 Z" style={{ fill: "var(--red)", stroke: "var(--ink)", strokeWidth: "3", strokeLinejoin: "round" }} />
    <path d="M24 66 Q50 72 76 66" style={{ fill: "none", stroke: "var(--yellow)", strokeWidth: "3" }} />
  </svg>
);

export const dashamiHeight = (web) => (web ? 500 : 560);
export function Dashami({ web, top }) {
  const ref = useRef(null);
  useReveal(ref);
  usePauseOffscreen(ref);
  const W = web ? 1360 : 370, H = dashamiHeight(web), band = web ? 30 : 20;
  const splashes = web
    ? [[60, 70, 120, 'red', 0.5], [1180, 60, 150, 'pink', 0.45], [980, 300, 90, 'red', 0.35], [380, 330, 70, 'pink', 0.4], [1240, 330, 60, 'red', 0.5]]
    : [[230, 40, 110, 'red', 0.4], [-24, 470, 80, 'pink', 0.4], [280, 380, 70, 'red', 0.45]];
  return (
    <section ref={ref} aria-label="Subho Bijoya" style={{ position: "absolute", left: web ? "40px" : "10px", top: `${top}px`, width: `${W}px`, height: `${H}px`, boxSizing: "border-box", background: "var(--card)", border: "2px solid var(--ink)", boxShadow: `${web ? 10 : 7}px ${web ? 10 : 7}px 0 var(--red)`, overflow: "hidden" }}>
      {/* the saree's red border, top and bottom, each with a marigold thread */}
      {[0, 1].map((b) => <div key={b} aria-hidden="true" style={{ position: "absolute", left: "0", right: "0", [b ? 'bottom' : 'top']: "0", height: `${band}px`, background: "var(--red)", [b ? 'borderTop' : 'borderBottom']: `${web ? 5 : 3}px solid var(--yellow)` }} />)}
      {splashes.map(([x, y, s, c, o], i) => (
        <svg key={i} aria-hidden="true" width={s} height={s} viewBox="0 0 100 100" style={{ position: "absolute", left: `${x}px`, top: `${y}px`, opacity: o, transform: `rotate(${i * 47}deg)` }}><path d={SPLASH} style={{ fill: `var(--${c})` }} /></svg>
      ))}
      <div style={{ position: "absolute", left: web ? "90px" : "22px", top: web ? "84px" : "56px", width: web ? "760px" : "326px" }}>
        <div style={{ fontFamily: FONT.mono, fontSize: web ? "12px" : "10px", letterSpacing: "1.8px", color: "var(--ink)" }}>DASHAMI · THE LAST DAY</div>
        <h2 style={{ margin: web ? "10px 0 0" : "8px 0 0", fontFamily: FONT.head, fontWeight: "400", fontSize: web ? "96px" : "48px", lineHeight: "1", textTransform: "uppercase", color: "var(--red)" }}>Subho Bijoya!</h2>
        <div style={{ marginTop: web ? "10px" : "8px", fontFamily: FONT.hand, fontSize: web ? "36px" : "24px", lineHeight: "1.05", color: "var(--hand)", transform: "rotate(-1.5deg)" }}>asche bochor abar hobe: see you next year</div>
        <p style={{ margin: web ? "20px 0 0" : "14px 0 0", maxWidth: web ? "620px" : "320px", fontFamily: FONT.body, fontSize: web ? "17px" : "14.5px", lineHeight: "1.55", color: "var(--text)" }}>On Dashami the idols go to the river, everyone smears sindoor on everyone, and the city waits a whole year to hear the dhak again. This issue stays right here: come back to it any time.</p>
      </div>
      {web ? <><Dhak left={980} top={150} s={230} /><Diya left={880} top={330} s={110} /><Diya left={1220} top={350} s={80} /></> : <><Dhak left={180} top={400} s={120} /><Diya left={40} top={430} s={80} /></>}
    </section>
  );
}
