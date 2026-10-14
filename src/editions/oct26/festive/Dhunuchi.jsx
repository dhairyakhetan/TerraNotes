// October's words game dressing (the design brief: the clouds become dhunuchi smoke; the A / B / C marks become a
// dhunuchi, a paper lantern and a firework; src/editions/pages.js WORDS_ART, used by shared/WordsGameSection.jsx).
// Smoke: drawn in the cloud's own 200 × 110 box (stretched to the game's cloud size, strokes kept even), a billow of
// curls rising from a clay dhunuchi at its lower left, with three wisps drifting up off it (home motion: look.css
// .oct-wisp, a loop stopped by reduced motion and LITE). The marks: small line icons in currentColor, so they turn
// white with the option when it's picked. Decoration only (the letters stay as their accessible names).
const SMOKE = 'M22 84 C6 84 2 66 14 58 C4 46 14 30 30 34 C30 18 50 10 62 20 C70 6 94 4 104 16 C114 4 140 6 146 22 C162 14 184 24 180 42 C196 46 198 70 182 76 C186 92 164 100 150 92 C140 104 112 104 104 94 C92 106 64 104 58 94 C46 102 26 98 22 84 Z';
const CURLS = 'M40 44 q10 -8 18 0 q6 8 -2 12 M92 30 q12 -10 22 0 q6 8 -4 12 M136 52 q12 -8 20 2 q4 8 -6 10 M70 72 q10 -6 16 2';

export function Smoke({ w, h }) {
  return (
    <svg width={w} height={h} viewBox="0 0 200 110" preserveAspectRatio="none" style={{ position: "absolute", left: "0", top: "0", overflow: "visible" }} aria-hidden="true">
      <path d={SMOKE} transform="translate(2.5 3)" style={{ fill: "var(--ink)" }} />
      <path d={SMOKE} strokeWidth="2" vectorEffect="non-scaling-stroke" style={{ fill: "var(--card)", stroke: "var(--ink)" }} />
      <path d={CURLS} strokeWidth="1.6" vectorEffect="non-scaling-stroke" style={{ fill: "none", stroke: "var(--muted)", strokeLinecap: "round", opacity: ".45" }} />
      {[[60, 1], [104, 2.2], [150, 0.4]].map(([x, d]) => (
        <path key={x} className="dz oct-wisp" d={`M${x} 18 q-8 -8 0 -14 q8 -6 0 -14`} strokeWidth="1.8" vectorEffect="non-scaling-stroke" style={{ fill: "none", stroke: "var(--muted)", strokeLinecap: "round", animationDelay: `${-d}s` }} />
      ))}
      {/* the dhunuchi: a clay cup on a stem, glowing coals, the smoke rising out of it */}
      <g transform="translate(-6 78)">
        <path d="M0 0 Q14 10 28 0 L24 12 Q14 16 4 12 Z" strokeWidth="1.6" vectorEffect="non-scaling-stroke" style={{ fill: "var(--red)", stroke: "var(--ink)" }} />
        <path d="M11 13 L10 22 L18 22 L17 13" strokeWidth="1.6" vectorEffect="non-scaling-stroke" style={{ fill: "var(--red)", stroke: "var(--ink)" }} />
        <path d="M6 22 L22 22" strokeWidth="2" vectorEffect="non-scaling-stroke" style={{ stroke: "var(--ink)" }} />
        <ellipse cx="14" cy="1" rx="11" ry="2.6" style={{ fill: "var(--yellow)" }} />
      </g>
    </svg>
  );
}

const icon = (children) => ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" }}>{children}</svg>
);
export const DhunuchiMark = icon(<><path d="M4 11 Q12 16 20 11 L18 16 Q12 18 6 16 Z" /><path d="M10 17 L10 21 L14 21 L14 17" /><path d="M9 8 q-2 -2 0 -4 M13 8 q-2 -2 0 -4 q2 -2 0 -3 M17 8 q-2 -2 0 -4" /></>);
export const LanternMark = icon(<><path d="M12 2 L12 4" /><path d="M8 5 L16 5 L18 9 L18 16 L16 19 L8 19 L6 16 L6 9 Z" /><path d="M6 9 L18 9 M6 16 L18 16 M12 5 L12 19" /><path d="M12 19 L12 22" /></>);
export const FireworkMark = icon(<><path d="M12 12 L12 3 M12 12 L19 6 M12 12 L21 13 M12 12 L17 20 M12 12 L7 20 M12 12 L3 13 M12 12 L5 6" /><circle cx="12" cy="12" r="1.6" style={{ fill: "currentColor" }} /></>);
export const WORD_MARKS = [DhunuchiMark, LanternMark, FireworkMark];
