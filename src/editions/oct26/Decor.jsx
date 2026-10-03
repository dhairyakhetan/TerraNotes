// October 2026's decorations on the home pages (src/editions/pages.js DECOR; the page draws them first, so its cards
// sit on top), for the Pujo issue: a toran of marigolds and mango leaves across the top, an alpana rosette half under
// the intro card, a dhak with its kash plume, a conch shell, and a marigold tag saying "Subho Sharodiya!" (happy
// autumn festival). Positions are on the home artboard (web 1440, phone 390), in the empty spots between sections.
// Decoration only: hidden from screen readers. Colours: the look's (var(--yellow) marigold, var(--red) alta…).
import { FONT } from '../../styles/fonts.js';

const line = { stroke: "var(--ink)", strokeWidth: "2.2", fill: "none", strokeLinecap: "round", strokeLinejoin: "round" };

// a garland in swags: marigold beads along the string, a mango leaf hanging every few beads
function Toran({ width, top, swags, sag }) {
  const seg = width / swags, beads = [], leaves = [];
  const y = (x) => { const t = (x % seg) / seg; return 6 + sag * Math.sin(Math.PI * t); };
  for (let x = 6; x < width; x += 13) beads.push(x);
  for (let k = 0; k < swags; k++) for (const f of [0.25, 0.5, 0.75]) leaves.push(k * seg + f * seg);
  return (
    <svg width={width} height={sag + 60} viewBox={`0 0 ${width} ${sag + 60}`} style={{ position: "absolute", left: "0", top: `${top}px` }}>
      {leaves.map((x) => <path key={x} d={`M${x} ${y(x) + 4} q-9 18 0 34 q9 -16 0 -34 Z`} style={{ fill: "var(--green)", stroke: "var(--ink)", strokeWidth: "1.2" }} />)}
      {beads.map((x, i) => <circle key={x} cx={x} cy={y(x)} r="6.5" style={{ fill: i % 3 === 2 ? "var(--red)" : "var(--yellow)", stroke: "var(--ink)", strokeWidth: "1" }} />)}
    </svg>
  );
}
const Alpana = ({ left, top, d }) => (
  <svg width={d} height={d} viewBox="0 0 100 100" style={{ position: "absolute", left: `${left}px`, top: `${top}px`, opacity: ".55" }}>
    <circle cx="50" cy="50" r="46" style={{ fill: "var(--red)" }} />
    <circle cx="50" cy="50" r="38" style={{ fill: "none", stroke: "var(--card)", strokeWidth: "2.5" }} />
    {Array.from({ length: 12 }, (_, i) => <ellipse key={i} cx="50" cy="20" rx="5" ry="11" transform={`rotate(${i * 30} 50 50)`} style={{ fill: "var(--card)" }} />)}
    <circle cx="50" cy="50" r="12" style={{ fill: "var(--yellow)", stroke: "var(--card)", strokeWidth: "2" }} />
    {Array.from({ length: 24 }, (_, i) => <circle key={i} cx="50" cy="7" r="1.6" transform={`rotate(${i * 15} 50 50)`} style={{ fill: "var(--card)" }} />)}
  </svg>
);
const Dhak = ({ left, top, s }) => (
  <svg width={s} height={s} viewBox="0 0 100 100" style={{ position: "absolute", left: `${left}px`, top: `${top}px`, transform: "rotate(-10deg)" }}>
    {[0, 1, 2, 3, 4, 5, 6].map((i) => <path key={i} d={`M58 38 Q${62 + i * 4} ${14 - (i % 3) * 3} ${70 + i * 5} ${8 + (i % 2) * 4}`} style={{ ...line, stroke: "var(--wire)", strokeWidth: "1.6" }} />)}
    <rect x="14" y="40" width="72" height="42" rx="18" style={{ ...line, fill: "var(--card)" }} />
    <ellipse cx="16" cy="61" rx="7" ry="21" style={{ ...line, fill: "var(--yellow)" }} />
    <ellipse cx="84" cy="61" rx="7" ry="21" style={{ ...line, fill: "var(--yellow)" }} />
    <path d="M22 44 L78 78 M22 78 L78 44" style={{ ...line, stroke: "var(--red)", strokeWidth: "1.6" }} />
  </svg>
);
const Conch = ({ left, top, s }) => (
  <svg width={s} height={s * 0.7} viewBox="0 0 120 84" style={{ position: "absolute", left: `${left}px`, top: `${top}px`, transform: "rotate(8deg)" }}>
    <path d="M8 46 C20 18 70 10 104 30 C112 36 112 50 102 56 C80 70 34 74 8 46 Z" style={{ ...line, fill: "var(--card)" }} />
    <path d="M30 44 C46 34 72 32 96 40 M40 54 C56 46 76 46 98 50" style={{ ...line, strokeWidth: "1.5" }} />
    <path d="M104 30 L116 24 L112 38" style={line} />
  </svg>
);
function Tag({ left, top, w, size, deg }) {
  return (
    <div style={{ position: "absolute", left: `${left}px`, top: `${top}px`, width: `${w}px`, boxSizing: "border-box", padding: `${Math.round(w * 0.1)}px`, background: "var(--yellow)", border: "2px solid var(--ink)", boxShadow: "3px 3px 0 var(--red)", transform: `rotate(${deg}deg)`, fontFamily: FONT.hand, fontSize: `${size}px`, lineHeight: "1", color: "var(--ink)", textAlign: "center" }}>
      <div style={{ width: "10px", height: "10px", margin: "0 auto 6px", borderRadius: "50%", border: "2px solid var(--ink)", background: "var(--card)" }} />
      Subho Sharodiya!
    </div>
  );
}

export default function Oct26Decor({ web }) {
  return (
    <div aria-hidden="true" style={{ position: "absolute", left: "0", top: "0", width: "0", height: "0", pointerEvents: "none" }}>
      {web ? (
        <>
          <Toran width={1440} top={80} swags={4} sag={26} />
          <Alpana left={330} top={360} d={170} />
          <Tag left={1246} top={150} w={140} size={24} deg={5} />
          <Dhak left={1000} top={340} s={64} />
          <Conch left={1170} top={950} s={120} />
        </>
      ) : (
        <>
          <Toran width={390} top={64} swags={2} sag={14} />
          <Alpana left={-40} top={270} d={120} />
          <Tag left={288} top={252} w={94} size={17} deg={6} />
        </>
      )}
    </div>
  );
}
