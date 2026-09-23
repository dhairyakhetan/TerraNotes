import { useState } from 'react';
import { Link } from 'react-router';
import { MEMBERS, TEAMS, colorOf, teamsOf } from '../../data/team.js';
import { instagramUrl, pad2 } from '../../lib/format.js';

// Faces sit in loose rows of 3 and 2 (a honeycomb), each nudged a little so it looks hand-placed.
const ROWS = [[72, 196, 318], [134, 256]];     // face centres (x) for the two kinds of row
const SIZES = [92, 80, 98, 84, 88, 96, 82, 90];
const NUDGE_X = [-6, 5, -3, 8, -8, 4, 2, -5, 7];
const NUDGE_Y = [0, 16, -10, 8, 20, -6, 12, -14, 4, 18, -4];
const FACES_TOP = 510, ROW = 176;
const SPOTS = [];
for (let row = 0; SPOTS.length < MEMBERS.length; row++) {
  const xs = ROWS[row % 2], line = row % 4 < 2 ? xs : [...xs].reverse(); // alternate direction so the trail zigzags
  for (const x of line) {
    if (SPOTS.length === MEMBERS.length) break;
    const i = SPOTS.length, size = SIZES[i % SIZES.length], top = FACES_TOP + row * ROW + NUDGE_Y[i % NUDGE_Y.length];
    const cx = x + NUDGE_X[i % NUDGE_X.length];
    SPOTS.push({ cx, cy: top + size / 2, left: cx - 58, top, size, float: `fl${(i % 6) + 1}` });
  }
}
// Dotted trail through the face centres, spot by spot.
const TRAIL = SPOTS.slice(1).map((s, i) => { const p = SPOTS[i]; return `M${p.cx} ${p.cy} Q${(p.cx + s.cx) / 2 + 18} ${(p.cy + s.cy) / 2 + 22} ${s.cx} ${s.cy}`; }).join(' ');
const FACES_END = Math.max(...SPOTS.map((s) => s.top + s.size)) + 56;
// Section height; the home page grows with it.
export const MEMBERS_HEIGHT = FACES_END + 260;

export const NUMBER_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];

export const PhotoIcon = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.6" aria-hidden="true">
    <rect x="3" y="4" width="18" height="16" rx="1" />
    <circle cx="9" cy="10" r="2" />
    <path d="M3 17 L9 13 L13 16 L16 13 L21 17" />
  </svg>
);
const photoFill = { width: "100%", height: "100%", objectFit: "cover", display: "block" };

export const Chair = ({ empty, width = 34, height = 40 }) => (
  <svg width={width} height={height} viewBox="0 0 34 40" aria-hidden="true">
    <g fill="none" stroke="#111111" strokeWidth="2.4" strokeLinecap="square" strokeDasharray={empty ? "3 3" : undefined}>
      <path d="M7 2 V22" />
      <rect x="7" y="18" width="21" height="5" fill={empty ? "none" : "#111111"} />
      <path d="M9 23 L6 38" />
      <path d="M26 23 L29 38" />
      <path d="M7 8 H13" />
    </g>
  </svg>
);

// "Meet the team": tap a team in the legend to fade the others, tap a face for its profile.
export default function Members() {
  const [team, setTeam] = useState(null);     // legend filter, null = everyone
  const [open, setOpen] = useState(null);     // index of the member whose profile is open
  const count = NUMBER_WORDS[MEMBERS.length] || String(MEMBERS.length);
  const sel = open != null ? MEMBERS[open] : null;
  const selColor = sel ? colorOf(sel) : "#111111";
  const close = () => setOpen(null);

  return (
    <section id="members" style={{ position: "absolute", left: "0", top: "2470px", width: "390px", height: `${MEMBERS_HEIGHT}px` }}>
      <div style={{ position: "absolute", left: "20px", top: "0", width: "350px", height: "2px", background: "#111111" }} />
      <h2 style={{ position: "absolute", left: "18px", top: "22px", margin: "0", fontFamily: "'Archivo Black', Impact, sans-serif", fontWeight: "400", fontSize: "46px", lineHeight: "0.92", letterSpacing: "-1px", textTransform: "uppercase", color: "#111111" }}>Meet<br />the team</h2>
      <div style={{ position: "absolute", right: "20px", top: "30px", textAlign: "right", fontFamily: "'Space Mono', monospace", fontSize: "9px", letterSpacing: "1.6px", lineHeight: "1.6", color: "#111111" }}>{count.toUpperCase()} OF US<br />TAP A FACE</div>
      <p style={{ position: "absolute", left: "20px", top: "136px", width: "340px", margin: "0", fontSize: "15px", lineHeight: "1.5", color: "#1E2723" }}>four desks, one terrace, {count} people who are all doing something else on a weekday. writing writes the articles, design made this site's look and layout, tech built it, and the heads keep everyone on track.</p>
      <div style={{ position: "absolute", left: "22px", top: "270px", width: "250px", fontFamily: "'Caveat', cursive", fontSize: "21px", lineHeight: "1.1", color: "#5B3A1E", transform: "rotate(-2deg)" }}>nobody here is a professional. that is the point.</div>
      <svg width="390" height={MEMBERS_HEIGHT} viewBox={`0 0 390 ${MEMBERS_HEIGHT}`} style={{ position: "absolute", left: "0", top: "0", pointerEvents: "none" }} aria-hidden="true" fill="none" stroke="#1E2723" strokeWidth="1.2" strokeDasharray="3 5" strokeLinecap="round" opacity=".5">
        <path d={TRAIL} />
      </svg>
      {/* legend */}
      <div style={{ position: "absolute", left: "16px", top: "340px", width: "142px", display: "flex", flexDirection: "column", gap: "4px" }}>
        {Object.entries(TEAMS).map(([key, t]) => {
          const on = team === key;
          return (
            <button key={key} className="legend-chip" onClick={() => setTeam(on ? null : key)} aria-pressed={on ? 'true' : 'false'} style={{ minHeight: "32px", width: "100%", padding: "0 10px 0 6px", display: "flex", alignItems: "center", gap: "8px", background: on ? '#111111' : 'transparent', color: on ? '#FFFFFF' : '#111111', border: `1.5px solid ${on ? '#111111' : 'transparent'}`, borderRadius: "999px", fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "9.5px", letterSpacing: "1.2px", textTransform: "uppercase", textAlign: "left" }}>
              <span style={{ width: "12px", height: "12px", flexShrink: "0", borderRadius: "50%", background: t.color, border: "1.5px solid #111111", boxSizing: "border-box" }} />
              <span style={{ flexGrow: "1" }}>{t.label}</span>
              <span>{MEMBERS.filter((m) => teamsOf(m).includes(key)).length}</span>
            </button>
          );
        })}
      </div>
      {/* faces: circle (photo or placeholder, shadow = team colour) + name and role */}
      {SPOTS.map((s, i) => {
        const m = MEMBERS[i];
        if (!m) return null;
        return (
          <div key={i} className={s.float} style={{ position: "absolute", left: `${s.left}px`, top: `${s.top}px`, width: "116px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", opacity: team == null || teamsOf(m).includes(team) ? 1 : 0.18, transition: "opacity .25s" }}>
            <button className="bub" onClick={() => setOpen(i)} aria-label={`${m.name}, ${m.role} — open profile`} style={{ width: `${s.size}px`, height: `${s.size}px`, padding: "0", borderRadius: "50%", border: "2px solid #111111", background: "#F2F1ED", boxShadow: `6px 5px 0 ${colorOf(m)}`, overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "3px", fontSize: "11px", color: "#444" }}>
              {m.photo ? <img src={m.photo} alt="" style={photoFill} /> : <><PhotoIcon size="20" /><span>{m.name.split(' ')[0].toLowerCase()}</span></>}
            </button>
            <div style={{ textAlign: "center", lineHeight: "1.1", padding: "2px 6px", background: "#F3EEE4" }}>
              <div style={{ fontFamily: "'Archivo Black', Impact, sans-serif", fontSize: "12px", textTransform: "uppercase", color: "#111111" }}>{m.name}</div>
              <div style={{ marginTop: "3px", fontFamily: "'Space Mono', monospace", fontSize: "8.5px", letterSpacing: "1px", textTransform: "uppercase", color: "#4A4A45" }}>{m.role}</div>
            </div>
          </div>
        );
      })}
      {/* terrace note: four chairs taken, a dashed fifth for the reader */}
      <div style={{ position: "absolute", left: "22px", top: `${FACES_END}px`, width: "330px", boxSizing: "border-box", background: "#F7C21A", border: "2px solid #111111", boxShadow: "8px 8px 0 #111111", padding: "18px 18px 16px", transform: "rotate(-2deg)" }}>
        <div style={{ position: "absolute", right: "-12px", top: "-16px", background: "#111111", color: "#F7C21A", fontFamily: "'Caveat', cursive", fontSize: "20px", padding: "2px 12px", transform: "rotate(6deg)" }}>psst.</div>
        <div style={{ fontFamily: "'Archivo Black', Impact, sans-serif", fontSize: "25px", lineHeight: "0.95", textTransform: "uppercase", color: "#111111" }}>We meet on<br />the terrace.</div>
        <div style={{ marginTop: "8px", fontFamily: "'Caveat', cursive", fontSize: "23px", lineHeight: "1.1", color: "#111111" }}>bring a chair — there are only four.</div>
        <div style={{ marginTop: "12px", display: "flex", alignItems: "flex-end", gap: "8px" }}>
          <Chair /><Chair /><Chair /><Chair />
          <div style={{ marginLeft: "6px", display: "flex", alignItems: "flex-end", gap: "4px" }}>
            <Chair empty />
            <span style={{ fontFamily: "'Caveat', cursive", fontSize: "19px", lineHeight: "1", transform: "rotate(-8deg)", paddingBottom: "20px" }}>yours?</span>
          </div>
        </div>
      </div>
      {/* profile pop-up, placed level with the tapped face */}
      {sel && (
        <>
          <button onClick={close} aria-label="Close profile" style={{ position: "absolute", left: "0", top: "0", width: "390px", height: `${MEMBERS_HEIGHT}px`, border: "0", padding: "0", background: "rgba(17,17,17,.55)" }} />
          <div role="dialog" aria-label="Member profile" style={{ position: "absolute", left: "28px", top: `${Math.max(120, Math.min(SPOTS[open].top - 60, MEMBERS_HEIGHT - 540))}px`, width: "334px", boxSizing: "border-box", background: "#FFFFFF", border: "2px solid #111111", boxShadow: `8px 8px 0 ${selColor}`, padding: "18px", display: "flex", flexDirection: "column", gap: "12px", transform: "rotate(-1deg)" }}>
            <div style={{ position: "absolute", left: "50%", top: "-7px", marginLeft: "-17px", width: "34px", height: "10px", background: selColor, border: "1.5px solid #111111", boxSizing: "border-box" }} />
            <button className="press" onClick={close} aria-label="Close profile" style={{ "--c": "#111111", position: "absolute", right: "10px", top: "10px", width: "44px", height: "44px", background: "#FFFFFF", border: "2px solid #111111", boxShadow: "3px 3px 0 #111111", padding: "0", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="#111111" strokeWidth="2.6" strokeLinecap="square">
                <path d="M3 3 L17 17" />
                <path d="M17 3 L3 17" />
              </svg>
            </button>
            <div style={{ width: "96px", height: "96px", borderRadius: "50%", border: "2px solid #111111", background: "#F2F1ED", boxShadow: `6px 5px 0 ${selColor}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: sel.photo ? "hidden" : undefined }}>
              {sel.photo ? <img src={sel.photo} alt={sel.name} style={photoFill} /> : <PhotoIcon size="22" />}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ background: selColor, color: "#FFFFFF", fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase", padding: "3px 9px", borderRadius: "999px", border: "1.5px solid #111111" }}>{teamsOf(sel).map((t) => TEAMS[t].label).join(' · ')}</span>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "1px" }}>{pad2(open + 1)} / {pad2(MEMBERS.length)}</span>
            </div>
            <div style={{ fontFamily: "'Archivo Black', Impact, sans-serif", fontSize: "30px", lineHeight: "0.95", textTransform: "uppercase", color: "#111111" }}>{sel.name}</div>
            <div style={{ fontFamily: "'Caveat', cursive", fontSize: "20px", lineHeight: "1.1", color: "#5B3A1E" }}>{sel.role}</div>
            <p style={{ margin: "0", fontSize: "14px", lineHeight: "1.5", color: "#333333" }}>{sel.bio || '[Two lines about them: where they work from, what they write or shoot, what they care about.]'}</p>
            {/* what their team made; only writers have articles */}
            {teamsOf(sel).filter((t) => t !== 'writing').map((t) => (
              <p key={t} style={{ margin: "0", paddingLeft: "10px", borderLeft: `3px solid ${TEAMS[t].color}`, fontSize: "13px", lineHeight: "1.45", color: "#1E2723" }}><strong style={{ fontWeight: "600" }}>{TEAMS[t].label}</strong>{` ${TEAMS[t].made}.`}</p>
            ))}
            <div style={{ display: "flex", gap: "10px" }}>
              {teamsOf(sel).includes('writing') && <Link to="/articles" style={{ minHeight: "44px", flexGrow: "1", display: "flex", alignItems: "center", justifyContent: "center", background: "#111111", color: "#FFFFFF", border: "2px solid #111111", fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "11px", letterSpacing: "1px", textDecoration: "none" }}>THEIR ARTICLES</Link>}
              <a href={instagramUrl(sel.instagram)} target="_blank" rel="noreferrer" style={{ minHeight: "44px", padding: "0 14px", display: "flex", alignItems: "center", background: "#FFFFFF", color: "#111111", border: "2px solid #111111", boxShadow: "3px 3px 0 #111111", fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "11px", letterSpacing: "1px", textDecoration: "none" }}>{`${sel.instagram ? `@${sel.instagram}` : '[@HANDLE]'} ↗`}</a>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
