import { LABS } from '../data/labs.js';
import { LabCard } from '../components/Lab.jsx';

// "Under Aquaterra": AQ Labs, web. Heading, intro and numbers on the left; the eight projects pinned up in a 4 × 2 grid
// on the right; the program's closing line handwritten underneath. Placed by WebHome under the team.
export const WEB_LABS_HEIGHT = 770;
const TILT = [-1.4, 1, -0.6, 1.5, 0.8, -1.2, 1.3, -0.8];

export default function WebLabs({ top }) {
  return (
    <section id="labs" aria-label="Under Aquaterra: AQ Labs" style={{ position: "absolute", left: "0", top: `${top}px`, width: "1440px", height: `${WEB_LABS_HEIGHT}px` }}>
      <div style={{ position: "absolute", left: "40px", top: "0", width: "1360px", height: "2px", background: "#111111" }} />
      <h2 style={{ position: "absolute", left: "78px", top: "56px", margin: "0", fontFamily: "'Archivo Black', Impact, sans-serif", fontWeight: "400", fontSize: "72px", lineHeight: "0.9", letterSpacing: "-1.5px", textTransform: "uppercase", color: "#111111" }}>Under<br />Aquaterra</h2>
      <div style={{ position: "absolute", left: "80px", top: "224px", display: "flex", alignItems: "center", gap: "12px" }}>
        <span style={{ background: "#111111", color: "#F3EEE4", fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "13px", letterSpacing: "2px", padding: "7px 14px", transform: "rotate(-2deg)", boxShadow: "4px 4px 0 #F7C21A" }}>{LABS.name.toUpperCase()}</span>
        <span style={{ fontFamily: "'Caveat', cursive", fontSize: "26px", color: "#5B3A1E" }}>the student build program</span>
      </div>
      <div style={{ position: "absolute", left: "80px", top: "290px", width: "440px" }}>
        {LABS.intro.map((t) => <p key={t} style={{ margin: "0 0 12px", fontSize: "17px", lineHeight: "1.55", color: "#1E2723" }}>{t}</p>)}
        <p style={{ margin: "0", fontSize: "17px", lineHeight: "1.55", color: "#1E2723" }}>{LABS.shipped} <span aria-hidden="true">→</span></p>
      </div>
      <div style={{ position: "absolute", left: "80px", top: "560px", display: "flex", gap: "34px" }}>
        {LABS.stats.map(([n, label]) => (
          <div key={label}>
            <div style={{ fontFamily: "'Archivo Black', Impact, sans-serif", fontSize: "56px", lineHeight: "0.9", color: "#111111" }}>{n}</div>
            <div style={{ marginTop: "6px", fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "1.6px", textTransform: "uppercase", color: "#111111" }}>{label}</div>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: "1080px", top: "30px", width: "300px", textAlign: "right", fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "1.8px", color: "#111111" }}>EIGHT TEAMS · EIGHT LIVE BUILDS</div>
      <div style={{ position: "absolute", left: "600px", top: "84px", display: "grid", gridTemplateColumns: "repeat(4, 180px)", gap: "34px 22px" }}>
        {LABS.projects.map((p, i) => <LabCard key={p.name} p={p} i={i} tilt={TILT[i]} z={{ w: 180, band: 54, name: 17, what: 13.5, icon: 27 }} style={{ height: "226px" }} />)}
      </div>
      <p style={{ position: "absolute", left: "600px", top: "640px", width: "780px", margin: "0", fontFamily: "'Caveat', cursive", fontSize: "30px", lineHeight: "1.15", color: "#5B3A1E", transform: "rotate(-1deg)" }}>
        <span style={{ fontSize: "22px" }}>{LABS.closing} </span>{LABS.quote}
      </p>
    </section>
  );
}
