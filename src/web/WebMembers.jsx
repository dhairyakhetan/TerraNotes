import { useState } from 'react';
import { Link } from 'react-router';
import { Chair, NUMBER_WORDS, PhotoIcon } from '../components/home/Members.jsx';
import { MEMBERS, TEAMS } from '../data/team.js';
import { instagramUrl, pad2 } from '../lib/format.js';

// Where each face sits (MEMBERS[0] → first spot): centre of the circle and its diameter.
const SPOTS = [
  { cx: 760, cy: 150, size: 150, float: 'fl1' },
  { cx: 1010, cy: 130, size: 124, float: 'fl2' },
  { cx: 1250, cy: 200, size: 136, float: 'fl3' },
  { cx: 680, cy: 410, size: 128, float: 'fl4' },
  { cx: 940, cy: 390, size: 146, float: 'fl5' },
  { cx: 1210, cy: 460, size: 124, float: 'fl6' },
  { cx: 800, cy: 660, size: 136, float: 'fl1' },
  { cx: 1080, cy: 670, size: 140, float: 'fl2' },
];
// Dotted trail through the face centres, spot by spot.
const TRAIL = 'M760 150 Q885 174 1010 130 M1010 130 Q1130 199 1250 200 M1250 200 Q1230 364 1210 460 M1210 460 Q1075 459 940 390 M940 390 Q810 434 680 410 M680 410 Q740 569 800 660 M800 660 Q940 699 1080 670';
const photoFill = { width: "100%", height: "100%", objectFit: "cover", display: "block" };

// "Meet the team", web layout: click a team to fade the others, click a face for a profile card beside it.
export default function WebMembers() {
  const [team, setTeam] = useState(null);
  const [open, setOpen] = useState(null);
  const count = NUMBER_WORDS[MEMBERS.length] || String(MEMBERS.length);
  const sel = open != null ? MEMBERS[open] : null;
  const color = sel ? TEAMS[sel.team].color : '#111111';
  const spot = sel ? SPOTS[open] : null;
  const r = spot ? spot.size / 2 : 0;
  const close = () => setOpen(null);

  return (
    <section id="members" style={{ position: "absolute", left: "0", top: "2570px", width: "1440px", height: "900px" }}>
      <div style={{ position: "absolute", left: "80px", top: "0", width: "1280px", height: "2px", background: "#111111" }} />
      <h2 style={{ position: "absolute", left: "78px", top: "36px", margin: "0", fontFamily: "'Archivo Black', Impact, sans-serif", fontWeight: "400", fontSize: "72px", lineHeight: "0.9", letterSpacing: "-1.5px", textTransform: "uppercase", color: "#111111" }}>Meet<br />the team</h2>
      <div style={{ position: "absolute", left: "1080px", top: "30px", width: "280px", textAlign: "right", fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "1.8px", color: "#111111" }}>{`${count.toUpperCase()} OF US · CLICK A FACE`}</div>
      <p style={{ position: "absolute", left: "80px", top: "200px", width: "440px", margin: "0", fontSize: "17px", lineHeight: "1.55", color: "#1E2723" }}>four desks, one terrace, {count} people who are all doing something else on a weekday. editorial writes it, visual shoots and lays it out, research keeps the numbers honest, operations makes sure a building says yes.</p>
      <div style={{ position: "absolute", left: "82px", top: "360px", width: "400px", fontFamily: "'Caveat', cursive", fontSize: "27px", lineHeight: "1.1", color: "#5B3A1E", transform: "rotate(-2deg)" }}>nobody here is a professional. that is the point.</div>
      <div style={{ position: "absolute", left: "78px", top: "440px", width: "220px", display: "flex", flexDirection: "column", gap: "6px" }}>
        {Object.entries(TEAMS).map(([key, t]) => {
          const on = team === key;
          return (
            <button key={key} className="legend-chip" onClick={() => setTeam(on ? null : key)} aria-pressed={on ? 'true' : 'false'} style={{ minHeight: "40px", width: "100%", padding: "0 14px 0 8px", display: "flex", alignItems: "center", gap: "10px", background: on ? '#111111' : 'transparent', color: on ? '#FFFFFF' : '#111111', border: `1.5px solid ${on ? '#111111' : 'transparent'}`, borderRadius: "999px", fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "11px", letterSpacing: "1.4px", textTransform: "uppercase", textAlign: "left" }}>
              <span style={{ width: "14px", height: "14px", flexShrink: "0", borderRadius: "50%", background: t.color, border: "1.5px solid #111111", boxSizing: "border-box" }} />
              <span style={{ flexGrow: "1" }}>{t.label}</span>
              <span>{MEMBERS.filter((m) => m.team === key).length}</span>
            </button>
          );
        })}
      </div>
      <svg width="1440" height="900" viewBox="0 0 1440 900" style={{ position: "absolute", left: "0", top: "0", pointerEvents: "none" }} aria-hidden="true" fill="none" stroke="#1E2723" strokeWidth="1.3" strokeDasharray="3 6" strokeLinecap="round" opacity=".5">
        <path d={TRAIL} />
      </svg>
      {SPOTS.map((s, i) => {
        const m = MEMBERS[i];
        if (!m) return null;
        return (
          <div key={i} className={`${s.float} face`} style={{ position: "absolute", left: `${s.cx - 90}px`, top: `${s.cy - s.size / 2}px`, width: "180px", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", opacity: team == null || team === m.team ? 1 : 0.18, transition: "opacity .25s" }}>
            <button className="bub" onClick={() => setOpen(i)} aria-label={`${m.name}, ${m.role} — open profile`} style={{ width: `${s.size}px`, height: `${s.size}px`, padding: "0", borderRadius: "50%", border: "2px solid #111111", background: "#F2F1ED", boxShadow: `8px 6px 0 ${TEAMS[m.team].color}`, overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px", fontSize: "13px", color: "#444" }}>
              {m.photo ? <img src={m.photo} alt="" style={photoFill} /> : <><PhotoIcon size="22" /><span>{m.name.toLowerCase()}</span></>}
            </button>
            <div style={{ textAlign: "center", lineHeight: "1.1", padding: "2px 8px", background: "#F3EEE4" }}>
              <div style={{ fontFamily: "'Archivo Black', Impact, sans-serif", fontSize: "18px", textTransform: "uppercase", color: "#111111" }}>{m.name}</div>
              <div style={{ marginTop: "4px", fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "1.2px", textTransform: "uppercase", color: "#4A4A45" }}>{m.role}</div>
            </div>
          </div>
        );
      })}
      {/* terrace note: four chairs taken, a dashed fifth for the reader */}
      <div style={{ position: "absolute", left: "90px", top: "660px", width: "400px", boxSizing: "border-box", background: "#F7C21A", border: "2px solid #111111", boxShadow: "9px 9px 0 #111111", padding: "22px 24px 18px", transform: "rotate(-2deg)" }}>
        <div style={{ position: "absolute", right: "-14px", top: "-18px", background: "#111111", color: "#F7C21A", fontFamily: "'Caveat', cursive", fontSize: "22px", padding: "2px 14px", transform: "rotate(6deg)" }}>psst.</div>
        <div style={{ fontFamily: "'Archivo Black', Impact, sans-serif", fontSize: "30px", lineHeight: "0.95", textTransform: "uppercase", color: "#111111" }}>We meet on the terrace.</div>
        <div style={{ marginTop: "8px", fontFamily: "'Caveat', cursive", fontSize: "26px", lineHeight: "1.1", color: "#111111" }}>bring a chair — there are only four.</div>
        <div style={{ marginTop: "12px", display: "flex", alignItems: "flex-end", gap: "10px" }}>
          <Chair width={40} height={48} /><Chair width={40} height={48} /><Chair width={40} height={48} /><Chair width={40} height={48} />
          <div style={{ marginLeft: "8px", display: "flex", alignItems: "flex-end", gap: "4px" }}>
            <Chair empty width={40} height={48} />
            <span style={{ fontFamily: "'Caveat', cursive", fontSize: "22px", lineHeight: "1", transform: "rotate(-8deg)", paddingBottom: "22px" }}>yours?</span>
          </div>
        </div>
      </div>
      {/* profile card, beside the clicked face */}
      {sel && (
        <>
          <button onClick={close} aria-label="Close profile" style={{ position: "absolute", left: "0", top: "0", width: "1440px", height: "900px", border: "0", padding: "0", background: "rgba(17,17,17,.35)", cursor: "default" }} />
          <div className="web-pop" role="dialog" aria-label={`${sel.name} — profile`} style={{ position: "absolute", left: `${spot.cx < 1000 ? Math.round(spot.cx + r + 28) : Math.round(spot.cx - r - 28 - 360)}px`, top: `${Math.max(20, Math.min(Math.round(spot.cy - 150), 430))}px`, width: "360px", boxSizing: "border-box", background: "#FFFFFF", border: "2px solid #111111", boxShadow: `9px 9px 0 ${color}`, padding: "22px", display: "flex", flexDirection: "column", gap: "12px", transform: "rotate(-1deg)" }}>
            <div style={{ position: "absolute", left: "50%", top: "-8px", marginLeft: "-18px", width: "36px", height: "11px", background: color, border: "1.5px solid #111111", boxSizing: "border-box" }} />
            <button className="btn" onClick={close} aria-label="Close profile" style={{ position: "absolute", right: "12px", top: "12px", width: "44px", height: "44px", background: "#FFFFFF", border: "2px solid #111111", boxShadow: "3px 3px 0 #111111", padding: "0", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="#111111" strokeWidth="2.6" strokeLinecap="square"><path d="M3 3 L17 17" /><path d="M17 3 L3 17" /></svg>
            </button>
            <div style={{ width: "108px", height: "108px", borderRadius: "50%", border: "2px solid #111111", background: "#F2F1ED", boxShadow: `6px 5px 0 ${color}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: sel.photo ? "hidden" : undefined }}>
              {sel.photo ? <img src={sel.photo} alt={sel.name} style={photoFill} /> : <PhotoIcon size="22" />}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ background: color, color: "#FFFFFF", fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase", padding: "3px 10px", borderRadius: "999px", border: "1.5px solid #111111" }}>{TEAMS[sel.team].label}</span>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "1px" }}>{`${pad2(open + 1)} / ${pad2(MEMBERS.length)}`}</span>
            </div>
            <div style={{ fontFamily: "'Archivo Black', Impact, sans-serif", fontSize: "34px", lineHeight: "0.95", textTransform: "uppercase", color: "#111111" }}>{sel.name}</div>
            <div style={{ fontFamily: "'Caveat', cursive", fontSize: "23px", lineHeight: "1.1", color: "#5B3A1E" }}>{sel.role}</div>
            <p style={{ margin: "0", fontSize: "15px", lineHeight: "1.5", color: "#333333" }}>{sel.bio || '[Two lines about them: where they work from, what they write or shoot, what they care about.]'}</p>
            <div style={{ display: "flex", gap: "10px" }}>
              <Link className="btn" to="/articles" onClick={close} style={{ minHeight: "44px", flexGrow: "1", display: "flex", alignItems: "center", justifyContent: "center", background: "#111111", color: "#FFFFFF", border: "2px solid #111111", fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "11px", letterSpacing: "1px", textDecoration: "none" }}>THEIR ARTICLES</Link>
              <a className="btn" href={instagramUrl(sel.instagram)} target="_blank" rel="noreferrer" style={{ minHeight: "44px", padding: "0 14px", display: "flex", alignItems: "center", background: "#FFFFFF", color: "#111111", border: "2px solid #111111", boxShadow: "3px 3px 0 #111111", fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "11px", letterSpacing: "1px", textDecoration: "none" }}>{`${sel.instagram ? `@${sel.instagram}` : '[@HANDLE]'} ↗`}</a>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
