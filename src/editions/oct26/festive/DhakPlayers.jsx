// October's dhakis in "Meet the team" (the design brief: "a flat illustration of people playing dhak" in the empty
// space on the left; "the movement of the arms and the gentle bounce of the drums", the players otherwise still):
// two drummers side by side, each with a dhak slung at the hip, its kash-flower plume on top, beating it with two
// thin sticks (src/editions/pages.js TEAM_NOTE; shared/TeamSection.jsx places it: web under the team legend, phones
// beside it). Flat shapes, ink outlines, the look's colours. Motion: look.css .oct-beat-l / .oct-beat-r (the arms, out of
// step) and .oct-bounce (the drum), class dz (stopped by reduced motion and LITE). Decoration only.
const ln = { stroke: "var(--ink)", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round" };

function Dhaki({ x, kurta, delay }) {
  return (
    <g transform={`translate(${x} 0)`}>
      {/* legs and body: a dhoti and a kurta, a gamchha over the shoulder */}
      <path d="M38 150 L34 196 M62 150 L66 196" style={{ ...ln, strokeWidth: "6" }} />
      <path d="M28 150 Q50 160 72 150 L70 176 Q50 182 30 176 Z" style={{ ...ln, fill: "var(--card)" }} />
      <path d="M30 84 Q50 74 70 84 L74 152 Q50 160 26 152 Z" style={{ ...ln, fill: kurta }} />
      <path d="M34 84 L62 150" style={{ stroke: "var(--red)", strokeWidth: "6", strokeLinecap: "round" }} />
      {/* head */}
      <circle cx="50" cy="58" r="17" style={{ ...ln, fill: "var(--peg)" }} />
      <path d="M33 54 Q36 38 50 38 Q64 38 67 54 Q58 46 50 47 Q42 46 33 54 Z" style={{ fill: "var(--ink)" }} />
      <path d="M44 60 L45 60 M55 60 L56 60" style={{ ...ln, strokeWidth: "3" }} />
      <path d="M45 67 Q50 70 55 67" style={{ ...ln, strokeWidth: "1.6", fill: "none" }} />
      {/* the dhak, on its strap, bouncing */}
      <g className="dz oct-bounce" style={{ animationDelay: `${delay}s`, transformBox: "fill-box", transformOrigin: "50% 100%" }}>
        <path d="M34 86 L70 112" style={{ ...ln, strokeWidth: "2", stroke: "var(--ink)" }} />
        {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M76 104 Q${80 + i * 5} ${86 - i * 3} ${86 + i * 6} ${80 - (i % 2) * 6}`} style={{ ...ln, strokeWidth: "1.4", stroke: "var(--wire)", fill: "none" }} />)}
        <rect x="56" y="104" width="54" height="34" rx="14" style={{ ...ln, fill: "var(--card)" }} />
        <ellipse cx="58" cy="121" rx="6" ry="17" style={{ ...ln, fill: "var(--yellow)" }} />
        <ellipse cx="108" cy="121" rx="6" ry="17" style={{ ...ln, fill: "var(--yellow)" }} />
        <path d="M62 107 L104 135 M62 135 L104 107" style={{ stroke: "var(--red)", strokeWidth: "1.8" }} />
      </g>
      {/* the arms with their sticks, beating out of step */}
      <g className="dz oct-beat-l" style={{ animationDelay: `${delay}s`, transformBox: "fill-box", transformOrigin: "0 0" }}>
        <path d="M36 90 L52 116" style={{ ...ln, strokeWidth: "7", stroke: "var(--peg)" }} />
        <path d="M36 90 L52 116" style={{ ...ln, strokeWidth: "1.4", fill: "none" }} />
        <path d="M52 116 L70 100" style={{ ...ln, strokeWidth: "2.6" }} />
      </g>
      <g className="dz oct-beat-r" style={{ animationDelay: `${delay}s`, transformBox: "fill-box", transformOrigin: "0 0" }}>
        <path d="M66 90 L86 100" style={{ ...ln, strokeWidth: "7", stroke: "var(--peg)" }} />
        <path d="M86 100 L96 120" style={{ ...ln, strokeWidth: "2.6" }} />
      </g>
    </g>
  );
}

export default function DhakPlayers({ web, style }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 250 200" style={{ position: "absolute", height: "auto", overflow: "visible", ...style, width: web ? "300px" : "160px" }}>
      <ellipse cx="125" cy="196" rx="118" ry="5" style={{ fill: "var(--ink)", opacity: ".12" }} />
      <Dhaki x={6} kurta="var(--blue)" delay={0} />
      <Dhaki x={124} kurta="var(--green)" delay={-0.26} />
    </svg>
  );
}
