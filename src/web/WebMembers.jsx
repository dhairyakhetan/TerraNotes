import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { usePauseOffscreen } from '../lib/offscreen.js';
import { Link } from 'react-router';
import { Chair, NUMBER_WORDS, PhotoIcon } from '../components/home/Members.jsx';
import { MEMBERS, TEAMS, teamsOf } from '../data/team.js';
import { articlesBy, byLink } from '../lib/byWriter.jsx';
import { usePresence } from '../lib/presence.js';
import { profileTop, teamLinks, useFaceColors } from '../lib/team.js';
import { instagramUrl } from '../lib/format.js';

// Faces sit in loose rows of 5 and 4 right of the text (a honeycomb), each nudged a little so it looks hand-placed.
const ROWS = [[650, 820, 990, 1160, 1330], [735, 905, 1075, 1245]]; // face centres (x) for the two kinds of row
const SIZES = [112, 98, 120, 104, 108, 116, 100, 110, 96];
const NUDGE_X = [-10, 8, -4, 12, -8, 5, 3, -12, 9, -6];
const NUDGE_Y = [0, 22, -14, 10, 28, -8, 16, -18, 6, 24, -4];
const TOP = 120, ROW = 205;
const SPOTS = [];
for (let row = 0; SPOTS.length < MEMBERS.length; row++) {
  const xs = ROWS[row % 2], line = row % 4 < 2 ? xs : [...xs].reverse(); // alternate direction so the trail zigzags
  for (const x of line) {
    if (SPOTS.length === MEMBERS.length) break;
    const i = SPOTS.length, size = SIZES[i % SIZES.length];
    SPOTS.push({ cx: x + NUDGE_X[i % NUDGE_X.length], cy: TOP + row * ROW + NUDGE_Y[i % NUDGE_Y.length] + size / 2, size, float: `fl${(i % 6) + 1}` });
  }
}
// Section height; the web home page grows with it.
export const WEB_MEMBERS_HEIGHT = Math.max(900, Math.max(...SPOTS.map((s) => s.cy + s.size / 2)) + 110);
// Dotted links joining each team's faces (lib/team.js).
const LINKS = teamLinks(SPOTS, 24);
const photoFill = { width: "100%", height: "100%", objectFit: "cover", display: "block" };

// "Meet the team", web layout: click a team to fade the others, click a face for a profile card beside it.
// the badge pictures, fetched and decoded ahead of time so they're there the moment a card opens
const kept = []; // held on to, so the browser keeps them ready
const preloadBadges = () => { if (kept.length) return; MEMBERS.filter((m) => m.badge).forEach((m) => { const i = new Image(); i.src = m.badge.img; i.decode?.().catch(() => {}); kept.push(i); }); };
// a little extra on one card (badge in data/team.js): a small picture in the card's corner; its line shows on hover (or tap)
const Badge = ({ b }) => (
  <button type="button" className="card-badge" aria-label={b.text}>
    <span>{b.text}</span>
    <img src={b.img} alt="" width="24" height="24" decoding="sync" />
  </button>
);

// a crown for the one card that asks for it (crown: true in data/team.js)
const Crown = () => (
  <svg className="crown" width="44" height="34" viewBox="0 0 44 34" aria-hidden="true" style={{ position: "absolute", left: "-12px", top: "-18px", transform: "rotate(-22deg)", zIndex: "1" }}>
    <path d="M4 28 L2 8 L13 17 L22 3 L31 17 L42 8 L40 28 Z" fill="#F7C21A" stroke="#111111" strokeWidth="2.4" strokeLinejoin="round" />
    <path d="M4 28 H40" stroke="#111111" strokeWidth="2.4" />
    <circle cx="22" cy="21" r="2.6" fill="#F0442B" stroke="#111111" strokeWidth="1.4" /><circle cx="12" cy="23" r="1.8" fill="#3DA5F4" stroke="#111111" strokeWidth="1.2" /><circle cx="32" cy="23" r="1.8" fill="#3DA5F4" stroke="#111111" strokeWidth="1.2" />
  </svg>
);

export default function WebMembers() {
  useEffect(() => { preloadBadges(); }, []);
  const self = useRef(null);
  usePauseOffscreen(self);
  const [team, setTeam] = useState(null);
  const { colorFor, fade } = useFaceColors(team); // people in two teams switch colours
  const [open, setOpen] = useState(null);
  const card = useRef(null);
  // the card opens on screen beside the face: on the side nearer the middle (if it fits), and as central up and down
  // as it can be while level with the face (measured before it's painted)
  const [cardAt, setCardAt] = useState(null);
  useLayoutEffect(() => {
    if (open == null || !card.current) return;
    const s = SPOTS[open], W = 360, gap = s.size / 2 + 28;
    const sides = [s.cx + gap, s.cx - gap - W], fits = sides.filter((x) => x >= 16 && x + W <= 1424);
    const left = (fits.length ? fits : sides).sort((a, b) => Math.abs(a + W / 2 - 720) - Math.abs(b + W / 2 - 720))[0];
    const zoom = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--web-zoom')) || 1;
    setCardAt({ left: Math.round(left), top: profileTop({ section: self.current, header: 80, cy: s.cy, height: card.current.offsetHeight, zoom }) });
  }, [open]);
  const count = NUMBER_WORDS[MEMBERS.length] || String(MEMBERS.length);
  const [shown, leaving] = usePresence(open, 170);     // stays on screen while it animates closed
  const sel = shown != null ? MEMBERS[shown] : null;
  const color = sel ? colorFor(sel) : '#111111';
  const spot = sel ? SPOTS[shown] : null;
  const r = spot ? spot.size / 2 : 0;
  const close = () => setOpen(null);

  return (
    <section ref={self} id="members" style={{ position: "absolute", left: "0", top: "2570px", width: "1440px", height: `${WEB_MEMBERS_HEIGHT}px` }}>
      <div style={{ position: "absolute", left: "80px", top: "0", width: "1280px", height: "2px", background: "#111111" }} />
      <h2 style={{ position: "absolute", left: "78px", top: "36px", margin: "0", fontFamily: "'Archivo Black', Impact, sans-serif", fontWeight: "400", fontSize: "72px", lineHeight: "0.9", letterSpacing: "-1.5px", textTransform: "uppercase", color: "#111111" }}>Meet<br />the team</h2>
      <div style={{ position: "absolute", left: "1080px", top: "30px", width: "280px", textAlign: "right", fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "1.8px", color: "#111111" }}>{`${count.toUpperCase()} OF US · CLICK A FACE`}</div>
      <p style={{ position: "absolute", left: "80px", top: "200px", width: "440px", margin: "0", fontSize: "17px", lineHeight: "1.55", color: "#1E2723" }}>one magazine, a meeting every Friday, {count} people who are all doing something else the rest of the week. writing writes the articles, design made this site's look and layout, tech built it, and the heads keep everyone on track.</p>
      <div style={{ position: "absolute", left: "82px", top: "360px", width: "400px", fontFamily: "'Caveat', cursive", fontSize: "27px", lineHeight: "1.1", color: "#5B3A1E", transform: "rotate(-2deg)" }}>nobody here is a professional. that is the point.</div>
      <div style={{ position: "absolute", left: "78px", top: "440px", width: "220px", display: "flex", flexDirection: "column", gap: "6px" }}>
        {Object.entries(TEAMS).map(([key, t]) => {
          const on = team === key;
          return (
            <button key={key} className="legend-chip" onClick={() => setTeam(on ? null : key)} aria-pressed={on ? 'true' : 'false'} style={{ minHeight: "40px", width: "100%", padding: "0 14px 0 8px", display: "flex", alignItems: "center", gap: "10px", background: on ? '#111111' : 'transparent', color: on ? '#FFFFFF' : '#111111', border: `1.5px solid ${on ? '#111111' : 'transparent'}`, borderRadius: "999px", fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "11px", letterSpacing: "1.4px", textTransform: "uppercase", textAlign: "left" }}>
              <span style={{ width: "14px", height: "14px", flexShrink: "0", borderRadius: "50%", background: t.color, border: "1.5px solid #111111", boxSizing: "border-box" }} />
              <span style={{ flexGrow: "1" }}>{t.label}</span>
              <span>{MEMBERS.filter((m) => teamsOf(m).includes(key)).length}</span>
            </button>
          );
        })}
      </div>
      <svg width="1440" height={WEB_MEMBERS_HEIGHT} viewBox={`0 0 1440 ${WEB_MEMBERS_HEIGHT}`} style={{ position: "absolute", left: "0", top: "0", pointerEvents: "none" }} aria-hidden="true" fill="none" strokeWidth="1.3" strokeDasharray="3 6" strokeLinecap="round">
        {LINKS.map((l) => <path key={l.team} d={l.d} stroke={TEAMS[l.team].color} opacity={team == null ? 0.55 : team === l.team ? 0.95 : 0.12} style={{ transition: "opacity .25s" }} />)}
      </svg>
      {SPOTS.map((s, i) => {
        const m = MEMBERS[i];
        if (!m) return null;
        return (
          <div key={i} className={`${s.float} face`} style={{ position: "absolute", left: `${s.cx - 66}px`, top: `${s.cy - s.size / 2}px`, width: "132px", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", opacity: team == null || teamsOf(m).includes(team) ? 1 : 0.18, transition: "opacity .25s" }}>
            <button className="bub" onClick={() => setOpen(i)} aria-label={`${m.name}, ${m.role} — open profile`} style={{ width: `${s.size}px`, height: `${s.size}px`, padding: "0", borderRadius: "50%", border: "2px solid #111111", background: "#F2F1ED", boxShadow: `8px 6px 0 ${colorFor(m)}`, transition: `box-shadow ${fade} ease, transform 180ms cubic-bezier(0.32, 0.72, 0, 1)`, overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px", fontSize: "13px", color: "#444" }}>
              {m.photo ? <img src={m.photo} alt="" loading="lazy" decoding="async" width="400" height="400" style={photoFill} /> : <><PhotoIcon size="22" /><span>{m.name.split(' ')[0].toLowerCase()}</span></>}
            </button>
            <div style={{ textAlign: "center", lineHeight: "1.1", padding: "2px 8px", background: "#F3EEE4" }}>
              <div style={{ fontFamily: "'Archivo Black', Impact, sans-serif", fontSize: "15px", textTransform: "uppercase", color: "#111111" }}>{m.name}</div>
              {/* the team tag hides while a team is picked in the legend (they'd all say the same) */}
              {team == null && <div className="fade-in" style={{ marginTop: "4px", fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "1.2px", textTransform: "uppercase", color: "#4A4A45" }}>{m.role}</div>}
            </div>
          </div>
        );
      })}
      {/* Friday note: four chairs taken, a dashed fifth for the reader */}
      <div style={{ position: "absolute", left: "90px", top: "660px", width: "400px", boxSizing: "border-box", background: "#F7C21A", border: "2px solid #111111", boxShadow: "9px 9px 0 #111111", padding: "22px 24px 18px", transform: "rotate(-2deg)" }}>
        <div style={{ position: "absolute", right: "-14px", top: "-18px", background: "#111111", color: "#F7C21A", fontFamily: "'Caveat', cursive", fontSize: "22px", padding: "2px 14px", transform: "rotate(6deg)" }}>psst.</div>
        <div style={{ fontFamily: "'Archivo Black', Impact, sans-serif", fontSize: "30px", lineHeight: "0.95", textTransform: "uppercase", color: "#111111" }}>We meet<br />every Friday.</div>
        <div style={{ marginTop: "8px", fontFamily: "'Caveat', cursive", fontSize: "26px", lineHeight: "1.1", color: "#111111" }}>there's always room for one more.</div>
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
          <button className={leaving ? 'fade-out' : 'fade-in'} onClick={close} aria-label="Close profile" style={{ position: "absolute", left: "0", top: "0", width: "1440px", height: `${WEB_MEMBERS_HEIGHT}px`, border: "0", padding: "0", background: "rgba(17,17,17,.35)", cursor: "default" }} />
          <div className={leaving ? 'card-lift' : 'card-drop'} ref={card} role="dialog" aria-label={`${sel.name} — profile`} style={{ position: "absolute", left: `${cardAt ? cardAt.left : spot.cx < 1000 ? Math.round(spot.cx + r + 28) : Math.round(spot.cx - r - 28 - 360)}px`, top: `${cardAt ? cardAt.top : Math.max(20, Math.min(Math.round(spot.cy - 150), WEB_MEMBERS_HEIGHT - 530))}px`, width: "360px", boxSizing: "border-box", background: "#FFFFFF", border: "2px solid #111111", boxShadow: `9px 9px 0 ${color}`, padding: "22px", display: "flex", flexDirection: "column", gap: "12px", transform: "rotate(-1deg)" }}>
            {sel.badge && <Badge b={sel.badge} />}
            <div style={{ position: "absolute", left: "50%", top: "-8px", marginLeft: "-18px", width: "36px", height: "11px", background: color, border: "1.5px solid #111111", boxSizing: "border-box" }} />
            <button className="btn" onClick={close} aria-label="Close profile" style={{ position: "absolute", right: "12px", top: "12px", width: "44px", height: "44px", background: "#FFFFFF", border: "2px solid #111111", boxShadow: "3px 3px 0 #111111", padding: "0", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="#111111" strokeWidth="2.6" strokeLinecap="square"><path d="M3 3 L17 17" /><path d="M17 3 L3 17" /></svg>
            </button>
            <div style={{ position: "relative", alignSelf: "flex-start" }}>
              {sel.crown && <Crown />}
              <div style={{ width: "108px", height: "108px", borderRadius: "50%", border: "2px solid #111111", background: "#F2F1ED", boxShadow: `6px 5px 0 ${color}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: sel.photo ? "hidden" : undefined }}>
              {sel.photo ? <img src={sel.photo} alt={sel.name} style={photoFill} /> : <PhotoIcon size="22" />}
            </div>
            </div>
            <div style={{ fontFamily: "'Archivo Black', Impact, sans-serif", fontSize: "34px", lineHeight: "0.95", textTransform: "uppercase", color: "#111111" }}>{sel.name}</div>
            <div style={{ fontFamily: "'Caveat', cursive", fontSize: "23px", lineHeight: "1.1", color: "#5B3A1E" }}>{sel.role}</div>
            <p style={{ margin: "0", fontSize: "15px", lineHeight: "1.5", color: "#333333" }}>{sel.bio || '[Two lines about them: where they work from, what they write or shoot, what they care about.]'}</p>
            {/* what their team made; "their articles" only for people with something published */}
            {teamsOf(sel).map((t) => (
              <p key={t} style={{ margin: "0", paddingLeft: "10px", borderLeft: `3px solid ${TEAMS[t].color}`, fontSize: "14px", lineHeight: "1.45", color: "#1E2723" }}><strong style={{ fontWeight: "600" }}>{TEAMS[t].label}</strong>{` — ${(sel.credit || TEAMS[t].credit)[0].toLowerCase()}${(sel.credit || TEAMS[t].credit).slice(1)}.`}</p>
            ))}
            <div style={{ display: "flex", gap: "10px" }}>
              {articlesBy(sel.name).length > 0 && <Link className="btn" to={byLink(sel.name)} onClick={close} style={{ minHeight: "44px", flexGrow: "1", display: "flex", alignItems: "center", justifyContent: "center", background: "#111111", color: "#FFFFFF", border: "2px solid #111111", fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "11px", letterSpacing: "1px", textDecoration: "none" }}>THEIR ARTICLES</Link>}
              {sel.instagram && <a className="btn" href={instagramUrl(sel.instagram)} target="_blank" rel="noreferrer" style={{ minHeight: "44px", padding: "0 14px", display: "flex", alignItems: "center", background: "#FFFFFF", color: "#111111", border: "2px solid #111111", boxShadow: "3px 3px 0 #111111", fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "11px", letterSpacing: "1px", textDecoration: "none" }}><span style={{ fontFamily: "'Figtree', system-ui, sans-serif", fontWeight: "700", fontSize: "13px", letterSpacing: "0", marginRight: "1px" }}>@</span>{`${sel.instagram} ↗`}</a>}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
