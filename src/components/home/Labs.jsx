import { LABS } from '../../data/labs.js';
import { LabCard } from '../Lab.jsx';

// "Under Aquaterra": AQ Labs, phone. Heading, intro and numbers, the eight projects pinned up two by two, and the
// program's closing line handwritten at the end. Placed by Home under the team.
export const LABS_HEIGHT = 1680;
const TILT = [-1.6, 1.4, 1, -1.3, -0.8, 1.6, 1.2, -1.1];

export default function Labs({ top }) {
  return (
    <section id="labs" aria-label="Under Aquaterra: AQ Labs" style={{ position: "absolute", left: "0", top: `${top}px`, width: "390px", height: `${LABS_HEIGHT}px`, boxSizing: "border-box", padding: "34px 20px 0" }}>
      <div style={{ position: "absolute", left: "20px", top: "0", width: "350px", height: "2px", background: "#111111" }} />
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "1.6px", color: "#111111" }}>EIGHT TEAMS · EIGHT LIVE BUILDS</div>
      <h2 style={{ margin: "10px 0 0", fontFamily: "'Archivo Black', Impact, sans-serif", fontWeight: "400", fontSize: "46px", lineHeight: "0.9", letterSpacing: "-1px", textTransform: "uppercase", color: "#111111" }}>Under<br />Aquaterra</h2>
      <div style={{ marginTop: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ background: "#111111", color: "#F3EEE4", fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "11px", letterSpacing: "2px", padding: "6px 12px", transform: "rotate(-2deg)", boxShadow: "3px 3px 0 #F7C21A" }}>{LABS.name.toUpperCase()}</span>
        <span style={{ fontFamily: "'Caveat', cursive", fontSize: "22px", color: "#5B3A1E" }}>the student build program</span>
      </div>
      <div style={{ marginTop: "18px" }}>
        {LABS.intro.map((t) => <p key={t} style={{ margin: "0 0 10px", fontSize: "15px", lineHeight: "1.55", color: "#1E2723" }}>{t}</p>)}
      </div>
      <div style={{ marginTop: "14px", display: "flex", gap: "26px" }}>
        {LABS.stats.map(([n, label]) => (
          <div key={label}>
            <div style={{ fontFamily: "'Archivo Black', Impact, sans-serif", fontSize: "40px", lineHeight: "0.9", color: "#111111" }}>{n}</div>
            <div style={{ marginTop: "5px", fontFamily: "'Space Mono', monospace", fontSize: "9.5px", letterSpacing: "1.3px", textTransform: "uppercase", color: "#111111" }}>{label}</div>
          </div>
        ))}
      </div>
      <p style={{ margin: "22px 0 0", fontSize: "15px", lineHeight: "1.55", color: "#1E2723" }}>{LABS.shipped}</p>
      <div style={{ marginTop: "26px", display: "grid", gridTemplateColumns: "repeat(2, 164px)", justifyContent: "space-between", gap: "30px 0" }}>
        {LABS.projects.map((p, i) => <LabCard key={p.name} p={p} i={i} tilt={TILT[i]} z={{ w: 164, band: 50, name: 16, what: 12.5, icon: 24 }} style={{ height: "208px" }} />)}
      </div>
      <p style={{ margin: "34px 0 0", fontFamily: "'Caveat', cursive", fontSize: "25px", lineHeight: "1.15", color: "#5B3A1E", transform: "rotate(-1.5deg)" }}>
        <span style={{ fontSize: "19px" }}>{LABS.closing} </span>{LABS.quote}
      </p>
    </section>
  );
}
