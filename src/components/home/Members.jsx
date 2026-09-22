import React from 'react';

const teams = [{"label": "Editorial", "c": "#F0442B"}, {"label": "Visual", "c": "#3DA5F4"}, {"label": "Research", "c": "#1E7A4C"}, {"label": "Operations", "c": "#7B5CE6"}];
// members: same order as the faces in the markup (m1…m8). `top` = the face's y inside the section, used to place the pop-up.
const members = [{"name": "Ananya", "role": "Editorial lead", "team": 0, "top": 342.0}, {"name": "Sohom", "role": "Photography", "team": 1, "top": 482.0}, {"name": "Rehan", "role": "Field research", "team": 2, "top": 532.0}, {"name": "Ishita", "role": "Visual strategy", "team": 3, "top": 588.0}, {"name": "Mitali", "role": "Design", "team": 1, "top": 654.0}, {"name": "Tanvi", "role": "Interviews", "team": 2, "top": 747.0}, {"name": "Kabir", "role": "Outreach", "team": 3, "top": 848.0}, {"name": "Nishtha", "role": "Copy & voice", "team": 0, "top": 837.0}];
const NUMBER_WORDS = ['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve'];

/*
  MEMBERS ("Meet the team") — the home page's team section.
  STATE: team – index into `teams` for the legend filter, null = show all
         member – index of the member whose profile pop-up is open, null = closed
  Face shadow colours in the markup match `teams`.
  Title + intro copy + handwritten aside, a VERTICAL legend on the left (tap a team to filter, tap again to clear),
  eight faces linked by a dotted trail, then the "four chairs" note.
  • Each face: wrapper .flN (float animation) → round photo button (hard shadow = TEAM colour) + name/role label
    (the label has a paper background so the dotted trail passes behind it).
  • Faces are placed by CENTRE (see each comment); the dotted-trail segments go centre-to-centre, so if you move a face,
    update its two trail segments in the <svg> below too.
  • Member data (name, role, team) is ALSO in `members` (top of this file) for the pop-up — keep both in sync,
    and update the counts in the legend chips.
*/
export default class Members extends React.Component {
  state = { team: null, member: null };

  renderVals() {
    const st = this.state;
    const team = st.team;
    const sel = st.member != null ? members[st.member] : null;
    const countWord = NUMBER_WORDS[members.length] || String(members.length);
    const vals = {
      countWord: countWord,
      countUpper: countWord.toUpperCase(),
      popOpen: !!sel,
      closePop: () => this.setState({ member: null }),
      pop: sel ? { name: sel.name, role: sel.role, team: teams[sel.team].label, c: teams[sel.team].c, num: String(st.member + 1).padStart(2, '0'), top: Math.max(120, Math.min(sel.top - 60, 720)) } : { name: '', role: '', team: '', c: '#111111', num: '', top: 120 }
    };
    members.forEach((m, i) => {
      vals['m' + (i + 1)] = { op: team == null || team === m.team ? 1 : 0.18, open: () => this.setState({ member: i }) };
    });
    teams.forEach((t, k) => {
      const on = team === k;
      vals['l' + (k + 1)] = { bg: on ? '#111111' : 'transparent', fg: on ? '#FFFFFF' : '#111111', bd: on ? '#111111' : 'transparent', pressed: on ? 'true' : 'false', pick: () => this.setState({ team: on ? null : k }) };
    });
    return vals;
  }

  render() {
    const v = this.renderVals();
    return (
      <section id="members" style={{ position: "absolute", left: "0", top: "2470px", width: "390px", height: "1240px" }}>
            <div style={{ position: "absolute", left: "20px", top: "0", width: "350px", height: "2px", background: "#111111" }} />
            <h2 style={{ position: "absolute", left: "18px", top: "22px", margin: "0", fontFamily: "'Archivo Black', Impact, sans-serif", fontWeight: "400", fontSize: "46px", lineHeight: "0.92", letterSpacing: "-1px", textTransform: "uppercase", color: "#111111" }}>Meet<br />the team</h2>
            <div style={{ position: "absolute", right: "20px", top: "30px", textAlign: "right", fontFamily: "'Space Mono', monospace", fontSize: "9px", letterSpacing: "1.6px", lineHeight: "1.6", color: "#111111" }}>{v.countUpper} OF US<br />TAP A FACE</div>
            <p style={{ position: "absolute", left: "20px", top: "136px", width: "340px", margin: "0", fontSize: "15px", lineHeight: "1.5", color: "#1E2723" }}>four desks, one terrace, {v.countWord} people who are all doing something else on a weekday. editorial writes it, visual shoots and lays it out, research keeps the numbers honest, operations makes sure a building says yes.</p>
            <div style={{ position: "absolute", left: "22px", top: "270px", width: "250px", fontFamily: "'Caveat', cursive", fontSize: "21px", lineHeight: "1.1", color: "#5B3A1E", transform: "rotate(-2deg)" }}>nobody here is a professional. that is the point.</div>
            {/* the dotted trail connecting the faces (order = CHAIN in the build notes: Ananya → Sohom → Rehan → Ishita → Tanvi → Mitali → Kabir → Nishtha).
             Each segment runs centre-to-centre with a small sag; the ends are hidden under the photos, so floating never detaches it. */}
            <svg width="390" height="1240" viewBox="0 0 390 1240" style={{ position: "absolute", left: "0", top: "0" }} aria-hidden="true" fill="none" stroke="#1E2723" strokeWidth="1.2" strokeDasharray="3 5" strokeLinecap="round" opacity=".5">
              <path d="M262 392 Q299 484 336 524 M336 524 Q270.5 577 205 578 M205 578 Q140.5 631 76 632 M76 632 Q131 738 186 792 M186 792 Q252 773 318 702 M318 702 Q309 823 300 892 M300 892 Q185 914 70 884" />
            </svg>
            {/* legend (vertical) */}
            <div style={{ position: "absolute", left: "16px", top: "340px", width: "142px", display: "flex", flexDirection: "column", gap: "4px" }}>
              <button className="legend-chip" onClick={v.l1.pick} aria-pressed={v.l1.pressed} style={{ minHeight: "32px", width: "100%", padding: "0 10px 0 6px", display: "flex", alignItems: "center", gap: "8px", background: v.l1.bg, color: v.l1.fg, border: `1.5px solid ${v.l1.bd}`, borderRadius: "999px", fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "9.5px", letterSpacing: "1.2px", textTransform: "uppercase", textAlign: "left" }}>
                <span style={{ width: "12px", height: "12px", flexShrink: "0", borderRadius: "50%", background: "#F0442B", border: "1.5px solid #111111", boxSizing: "border-box" }} />
                <span style={{ flexGrow: "1" }}>Editorial</span>
                <span>2</span>
              </button>
              <button className="legend-chip" onClick={v.l2.pick} aria-pressed={v.l2.pressed} style={{ minHeight: "32px", width: "100%", padding: "0 10px 0 6px", display: "flex", alignItems: "center", gap: "8px", background: v.l2.bg, color: v.l2.fg, border: `1.5px solid ${v.l2.bd}`, borderRadius: "999px", fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "9.5px", letterSpacing: "1.2px", textTransform: "uppercase", textAlign: "left" }}>
                <span style={{ width: "12px", height: "12px", flexShrink: "0", borderRadius: "50%", background: "#3DA5F4", border: "1.5px solid #111111", boxSizing: "border-box" }} />
                <span style={{ flexGrow: "1" }}>Visual</span>
                <span>2</span>
              </button>
              <button className="legend-chip" onClick={v.l3.pick} aria-pressed={v.l3.pressed} style={{ minHeight: "32px", width: "100%", padding: "0 10px 0 6px", display: "flex", alignItems: "center", gap: "8px", background: v.l3.bg, color: v.l3.fg, border: `1.5px solid ${v.l3.bd}`, borderRadius: "999px", fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "9.5px", letterSpacing: "1.2px", textTransform: "uppercase", textAlign: "left" }}>
                <span style={{ width: "12px", height: "12px", flexShrink: "0", borderRadius: "50%", background: "#1E7A4C", border: "1.5px solid #111111", boxSizing: "border-box" }} />
                <span style={{ flexGrow: "1" }}>Research</span>
                <span>2</span>
              </button>
              <button className="legend-chip" onClick={v.l4.pick} aria-pressed={v.l4.pressed} style={{ minHeight: "32px", width: "100%", padding: "0 10px 0 6px", display: "flex", alignItems: "center", gap: "8px", background: v.l4.bg, color: v.l4.fg, border: `1.5px solid ${v.l4.bd}`, borderRadius: "999px", fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "9.5px", letterSpacing: "1.2px", textTransform: "uppercase", textAlign: "left" }}>
                <span style={{ width: "12px", height: "12px", flexShrink: "0", borderRadius: "50%", background: "#7B5CE6", border: "1.5px solid #111111", boxSizing: "border-box" }} />
                <span style={{ flexGrow: "1" }}>Operations</span>
                <span>2</span>
              </button>
            </div>
            {/* 01 Ananya · Editorial lead · Editorial · centre (262,392) */}
            <div className="fl1" style={{ position: "absolute", left: "202px", top: "342px", width: "120px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", opacity: v.m1.op, transition: "opacity .25s" }}>
              <button className="bub" onClick={v.m1.open} aria-label="Ananya, Editorial lead — open profile" style={{ width: "100px", height: "100px", padding: "0", borderRadius: "50%", border: "2px solid #111111", background: "#F2F1ED", boxShadow: "6px 5px 0 #F0442B", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "3px", fontSize: "11px", color: "#444" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.6" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="16" rx="1" />
                  <circle cx="9" cy="10" r="2" />
                  <path d="M3 17 L9 13 L13 16 L16 13 L21 17" />
                </svg>
                <span>ananya</span>
              </button>
              <div style={{ textAlign: "center", lineHeight: "1.1", padding: "2px 6px", background: "#F3EEE4" }}>
                <div style={{ fontFamily: "'Archivo Black', Impact, sans-serif", fontSize: "14px", textTransform: "uppercase", color: "#111111" }}>Ananya</div>
                <div style={{ marginTop: "3px", fontFamily: "'Space Mono', monospace", fontSize: "8.5px", letterSpacing: "1px", textTransform: "uppercase", color: "#4A4A45" }}>Editorial lead</div>
              </div>
            </div>
            {/* 02 Sohom · Photography · Visual · centre (336,524) */}
            <div className="fl2" style={{ position: "absolute", left: "276px", top: "482px", width: "120px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", opacity: v.m2.op, transition: "opacity .25s" }}>
              <button className="bub" onClick={v.m2.open} aria-label="Sohom, Photography — open profile" style={{ width: "84px", height: "84px", padding: "0", borderRadius: "50%", border: "2px solid #111111", background: "#F2F1ED", boxShadow: "6px 5px 0 #3DA5F4", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "3px", fontSize: "11px", color: "#444" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.6" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="16" rx="1" />
                  <circle cx="9" cy="10" r="2" />
                  <path d="M3 17 L9 13 L13 16 L16 13 L21 17" />
                </svg>
                <span>sohom</span>
              </button>
              <div style={{ textAlign: "center", lineHeight: "1.1", padding: "2px 6px", background: "#F3EEE4" }}>
                <div style={{ fontFamily: "'Archivo Black', Impact, sans-serif", fontSize: "14px", textTransform: "uppercase", color: "#111111" }}>Sohom</div>
                <div style={{ marginTop: "3px", fontFamily: "'Space Mono', monospace", fontSize: "8.5px", letterSpacing: "1px", textTransform: "uppercase", color: "#4A4A45" }}>Photography</div>
              </div>
            </div>
            {/* 03 Rehan · Field research · Research · centre (205,578) */}
            <div className="fl3" style={{ position: "absolute", left: "145px", top: "532px", width: "120px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", opacity: v.m3.op, transition: "opacity .25s" }}>
              <button className="bub" onClick={v.m3.open} aria-label="Rehan, Field research — open profile" style={{ width: "92px", height: "92px", padding: "0", borderRadius: "50%", border: "2px solid #111111", background: "#F2F1ED", boxShadow: "6px 5px 0 #1E7A4C", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "3px", fontSize: "11px", color: "#444" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.6" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="16" rx="1" />
                  <circle cx="9" cy="10" r="2" />
                  <path d="M3 17 L9 13 L13 16 L16 13 L21 17" />
                </svg>
                <span>rehan</span>
              </button>
              <div style={{ textAlign: "center", lineHeight: "1.1", padding: "2px 6px", background: "#F3EEE4" }}>
                <div style={{ fontFamily: "'Archivo Black', Impact, sans-serif", fontSize: "14px", textTransform: "uppercase", color: "#111111" }}>Rehan</div>
                <div style={{ marginTop: "3px", fontFamily: "'Space Mono', monospace", fontSize: "8.5px", letterSpacing: "1px", textTransform: "uppercase", color: "#4A4A45" }}>Field research</div>
              </div>
            </div>
            {/* 04 Ishita · Visual strategy · Operations · centre (76,632) */}
            <div className="fl4" style={{ position: "absolute", left: "16px", top: "588px", width: "120px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", opacity: v.m4.op, transition: "opacity .25s" }}>
              <button className="bub" onClick={v.m4.open} aria-label="Ishita, Visual strategy — open profile" style={{ width: "88px", height: "88px", padding: "0", borderRadius: "50%", border: "2px solid #111111", background: "#F2F1ED", boxShadow: "6px 5px 0 #7B5CE6", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "3px", fontSize: "11px", color: "#444" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.6" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="16" rx="1" />
                  <circle cx="9" cy="10" r="2" />
                  <path d="M3 17 L9 13 L13 16 L16 13 L21 17" />
                </svg>
                <span>ishita</span>
              </button>
              <div style={{ textAlign: "center", lineHeight: "1.1", padding: "2px 6px", background: "#F3EEE4" }}>
                <div style={{ fontFamily: "'Archivo Black', Impact, sans-serif", fontSize: "14px", textTransform: "uppercase", color: "#111111" }}>Ishita</div>
                <div style={{ marginTop: "3px", fontFamily: "'Space Mono', monospace", fontSize: "8.5px", letterSpacing: "1px", textTransform: "uppercase", color: "#4A4A45" }}>Visual strategy</div>
              </div>
            </div>
            {/* 05 Mitali · Design · Visual · centre (318,702) */}
            <div className="fl5" style={{ position: "absolute", left: "258px", top: "654px", width: "120px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", opacity: v.m5.op, transition: "opacity .25s" }}>
              <button className="bub" onClick={v.m5.open} aria-label="Mitali, Design — open profile" style={{ width: "96px", height: "96px", padding: "0", borderRadius: "50%", border: "2px solid #111111", background: "#F2F1ED", boxShadow: "6px 5px 0 #3DA5F4", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "3px", fontSize: "11px", color: "#444" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.6" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="16" rx="1" />
                  <circle cx="9" cy="10" r="2" />
                  <path d="M3 17 L9 13 L13 16 L16 13 L21 17" />
                </svg>
                <span>mitali</span>
              </button>
              <div style={{ textAlign: "center", lineHeight: "1.1", padding: "2px 6px", background: "#F3EEE4" }}>
                <div style={{ fontFamily: "'Archivo Black', Impact, sans-serif", fontSize: "14px", textTransform: "uppercase", color: "#111111" }}>Mitali</div>
                <div style={{ marginTop: "3px", fontFamily: "'Space Mono', monospace", fontSize: "8.5px", letterSpacing: "1px", textTransform: "uppercase", color: "#4A4A45" }}>Design</div>
              </div>
            </div>
            {/* 06 Tanvi · Interviews · Research · centre (186,792) */}
            <div className="fl6" style={{ position: "absolute", left: "126px", top: "747px", width: "120px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", opacity: v.m6.op, transition: "opacity .25s" }}>
              <button className="bub" onClick={v.m6.open} aria-label="Tanvi, Interviews — open profile" style={{ width: "90px", height: "90px", padding: "0", borderRadius: "50%", border: "2px solid #111111", background: "#F2F1ED", boxShadow: "6px 5px 0 #1E7A4C", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "3px", fontSize: "11px", color: "#444" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.6" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="16" rx="1" />
                  <circle cx="9" cy="10" r="2" />
                  <path d="M3 17 L9 13 L13 16 L16 13 L21 17" />
                </svg>
                <span>tanvi</span>
              </button>
              <div style={{ textAlign: "center", lineHeight: "1.1", padding: "2px 6px", background: "#F3EEE4" }}>
                <div style={{ fontFamily: "'Archivo Black', Impact, sans-serif", fontSize: "14px", textTransform: "uppercase", color: "#111111" }}>Tanvi</div>
                <div style={{ marginTop: "3px", fontFamily: "'Space Mono', monospace", fontSize: "8.5px", letterSpacing: "1px", textTransform: "uppercase", color: "#4A4A45" }}>Interviews</div>
              </div>
            </div>
            {/* 07 Kabir · Outreach · Operations · centre (300,892) */}
            <div className="fl1" style={{ position: "absolute", left: "240px", top: "848px", width: "120px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", opacity: v.m7.op, transition: "opacity .25s" }}>
              <button className="bub" onClick={v.m7.open} aria-label="Kabir, Outreach — open profile" style={{ width: "88px", height: "88px", padding: "0", borderRadius: "50%", border: "2px solid #111111", background: "#F2F1ED", boxShadow: "6px 5px 0 #7B5CE6", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "3px", fontSize: "11px", color: "#444" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.6" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="16" rx="1" />
                  <circle cx="9" cy="10" r="2" />
                  <path d="M3 17 L9 13 L13 16 L16 13 L21 17" />
                </svg>
                <span>kabir</span>
              </button>
              <div style={{ textAlign: "center", lineHeight: "1.1", padding: "2px 6px", background: "#F3EEE4" }}>
                <div style={{ fontFamily: "'Archivo Black', Impact, sans-serif", fontSize: "14px", textTransform: "uppercase", color: "#111111" }}>Kabir</div>
                <div style={{ marginTop: "3px", fontFamily: "'Space Mono', monospace", fontSize: "8.5px", letterSpacing: "1px", textTransform: "uppercase", color: "#4A4A45" }}>Outreach</div>
              </div>
            </div>
            {/* 08 Nishtha · Copy & voice · Editorial · centre (70,884) */}
            <div className="fl2" style={{ position: "absolute", left: "10px", top: "837px", width: "120px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", opacity: v.m8.op, transition: "opacity .25s" }}>
              <button className="bub" onClick={v.m8.open} aria-label={"Nishtha, Copy & voice — open profile"} style={{ width: "94px", height: "94px", padding: "0", borderRadius: "50%", border: "2px solid #111111", background: "#F2F1ED", boxShadow: "6px 5px 0 #F0442B", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "3px", fontSize: "11px", color: "#444" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.6" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="16" rx="1" />
                  <circle cx="9" cy="10" r="2" />
                  <path d="M3 17 L9 13 L13 16 L16 13 L21 17" />
                </svg>
                <span>nishtha</span>
              </button>
              <div style={{ textAlign: "center", lineHeight: "1.1", padding: "2px 6px", background: "#F3EEE4" }}>
                <div style={{ fontFamily: "'Archivo Black', Impact, sans-serif", fontSize: "14px", textTransform: "uppercase", color: "#111111" }}>Nishtha</div>
                <div style={{ marginTop: "3px", fontFamily: "'Space Mono', monospace", fontSize: "8.5px", letterSpacing: "1px", textTransform: "uppercase", color: "#4A4A45" }}>{"Copy & voice"}</div>
              </div>
            </div>
            {/* fun note: "four chairs" — four taken, a dashed fifth for the reader. Swap copy freely. */}
            <div style={{ position: "absolute", left: "22px", top: "1000px", width: "330px", boxSizing: "border-box", background: "#F7C21A", border: "2px solid #111111", boxShadow: "8px 8px 0 #111111", padding: "18px 18px 16px", transform: "rotate(-2deg)" }}>
              <div style={{ position: "absolute", right: "-12px", top: "-16px", background: "#111111", color: "#F7C21A", fontFamily: "'Caveat', cursive", fontSize: "20px", padding: "2px 12px", transform: "rotate(6deg)" }}>psst.</div>
              <div style={{ fontFamily: "'Archivo Black', Impact, sans-serif", fontSize: "25px", lineHeight: "0.95", textTransform: "uppercase", color: "#111111" }}>We meet on<br />the terrace.</div>
              <div style={{ marginTop: "8px", fontFamily: "'Caveat', cursive", fontSize: "23px", lineHeight: "1.1", color: "#111111" }}>bring a chair — there are only four.</div>
              <div style={{ marginTop: "12px", display: "flex", alignItems: "flex-end", gap: "8px" }}>
                <svg width="34" height="40" viewBox="0 0 34 40" aria-hidden="true">
                  <g fill="none" stroke="#111111" strokeWidth="2.4" strokeLinecap="square">
                    <path d="M7 2 V22" />
                    <rect x="7" y="18" width="21" height="5" fill="#111111" />
                    <path d="M9 23 L6 38" />
                    <path d="M26 23 L29 38" />
                    <path d="M7 8 H13" />
                  </g>
                </svg>
                <svg width="34" height="40" viewBox="0 0 34 40" aria-hidden="true">
                  <g fill="none" stroke="#111111" strokeWidth="2.4" strokeLinecap="square">
                    <path d="M7 2 V22" />
                    <rect x="7" y="18" width="21" height="5" fill="#111111" />
                    <path d="M9 23 L6 38" />
                    <path d="M26 23 L29 38" />
                    <path d="M7 8 H13" />
                  </g>
                </svg>
                <svg width="34" height="40" viewBox="0 0 34 40" aria-hidden="true">
                  <g fill="none" stroke="#111111" strokeWidth="2.4" strokeLinecap="square">
                    <path d="M7 2 V22" />
                    <rect x="7" y="18" width="21" height="5" fill="#111111" />
                    <path d="M9 23 L6 38" />
                    <path d="M26 23 L29 38" />
                    <path d="M7 8 H13" />
                  </g>
                </svg>
                <svg width="34" height="40" viewBox="0 0 34 40" aria-hidden="true">
                  <g fill="none" stroke="#111111" strokeWidth="2.4" strokeLinecap="square">
                    <path d="M7 2 V22" />
                    <rect x="7" y="18" width="21" height="5" fill="#111111" />
                    <path d="M9 23 L6 38" />
                    <path d="M26 23 L29 38" />
                    <path d="M7 8 H13" />
                  </g>
                </svg>
                <div style={{ marginLeft: "6px", display: "flex", alignItems: "flex-end", gap: "4px" }}>
                  <svg width="34" height="40" viewBox="0 0 34 40" aria-hidden="true">
                    <g fill="none" stroke="#111111" strokeWidth="2.4" strokeLinecap="square" strokeDasharray="3 3">
                      <path d="M7 2 V22" />
                      <rect x="7" y="18" width="21" height="5" fill="none" />
                      <path d="M9 23 L6 38" />
                      <path d="M26 23 L29 38" />
                      <path d="M7 8 H13" />
                    </g>
                  </svg>
                  <span style={{ fontFamily: "'Caveat', cursive", fontSize: "19px", lineHeight: "1", transform: "rotate(-8deg)", paddingBottom: "20px" }}>yours?</span>
                </div>
              </div>
            </div>
            {/* profile pop-up (state: member); vertical position follows the tapped face (pop.top) */}
            {v.popOpen && (
              <>
                <button onClick={v.closePop} aria-label="Close profile" style={{ position: "absolute", left: "0", top: "0", width: "390px", height: "1240px", border: "0", padding: "0", background: "rgba(17,17,17,.55)" }} />
                <div role="dialog" aria-label="Member profile" style={{ position: "absolute", left: "28px", top: `${v.pop.top}px`, width: "334px", boxSizing: "border-box", background: "#FFFFFF", border: "2px solid #111111", boxShadow: `8px 8px 0 ${v.pop.c}`, padding: "18px", display: "flex", flexDirection: "column", gap: "12px", transform: "rotate(-1deg)" }}>
                  <div style={{ position: "absolute", left: "50%", top: "-7px", marginLeft: "-17px", width: "34px", height: "10px", background: v.pop.c, border: "1.5px solid #111111", boxSizing: "border-box" }} />
                  <button className="press" onClick={v.closePop} aria-label="Close profile" style={{ "--c": "#111111", position: "absolute", right: "10px", top: "10px", width: "44px", height: "44px", background: "#FFFFFF", border: "2px solid #111111", boxShadow: "3px 3px 0 #111111", padding: "0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="#111111" strokeWidth="2.6" strokeLinecap="square">
                      <path d="M3 3 L17 17" />
                      <path d="M17 3 L3 17" />
                    </svg>
                  </button>
                  <div style={{ width: "96px", height: "96px", borderRadius: "50%", border: "2px solid #111111", background: "#F2F1ED", boxShadow: `6px 5px 0 ${v.pop.c}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.6" aria-hidden="true">
                      <rect x="3" y="4" width="18" height="16" rx="1" />
                      <circle cx="9" cy="10" r="2" />
                      <path d="M3 17 L9 13 L13 16 L16 13 L21 17" />
                    </svg>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ background: v.pop.c, color: "#FFFFFF", fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase", padding: "3px 9px", borderRadius: "999px", border: "1.5px solid #111111" }}>{v.pop.team}</span>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "1px" }}>{v.pop.num} / 08</span>
                  </div>
                  <div style={{ fontFamily: "'Archivo Black', Impact, sans-serif", fontSize: "30px", lineHeight: "0.95", textTransform: "uppercase", color: "#111111" }}>{v.pop.name}</div>
                  <div style={{ fontFamily: "'Caveat', cursive", fontSize: "20px", lineHeight: "1.1", color: "#5B3A1E" }}>{v.pop.role}</div>
                  <p style={{ margin: "0", fontSize: "14px", lineHeight: "1.5", color: "#333333" }}>[Two lines about them: where they work from, what they write or shoot, what they care about.]</p>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <a href="#" style={{ minHeight: "44px", flexGrow: "1", display: "flex", alignItems: "center", justifyContent: "center", background: "#111111", color: "#FFFFFF", border: "2px solid #111111", fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "11px", letterSpacing: "1px", textDecoration: "none" }}>THEIR ARTICLES</a>
                    <a href="#" style={{ minHeight: "44px", padding: "0 14px", display: "flex", alignItems: "center", background: "#FFFFFF", color: "#111111", border: "2px solid #111111", boxShadow: "3px 3px 0 #111111", fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "11px", letterSpacing: "1px", textDecoration: "none" }}>[@HANDLE] ↗</a>
                  </div>
                </div>
              </>
            )}
          </section>
    );
  }
}
