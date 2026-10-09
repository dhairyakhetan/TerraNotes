import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from '../../../router.jsx';
import { CloseIcon, PhotoIcon } from '../../../shared/Icons.jsx';
import { Clip } from '../../../shared/Tapes.jsx';
import { Badge, Crown } from '../../../shared/TeamSection.jsx';
import { useEdition } from '../../../lib/edition.js';
import { useReveal } from '../../../lib/reveal.js';
import { usePresence } from '../../../lib/usePresence.js';
import { useDialogA11y } from '../../../lib/useDialogA11y.js';
import { portalRoot } from '../../../lib/dom.js';
import { firstName, instagramUrl, teamsOf } from '../../../lib/format.js';
import { articlesBy, byLink } from '../../../lib/byWriter.js';
import { FONT } from '../../../styles/fonts.js';
import { Folio, Head, pagesOf } from './parts.jsx';

// The annual's editorial board (AnnualHome.jsx): the team printed as a magazine's credits page, a column per team (web
// four teams across, a big team (more than five) in two columns of its own, so the board fits a laptop's screen;
// phones: one team under another, two people a row), each member a line with their face, name and role. Someone in two
// teams is listed in both. Tapping a member opens their card over the page (bio, what their team made, their articles,
// Instagram ↗, and their crown / badge if team.js gives them one), like the other editions' "Meet the team" card.
// Element id "members" (/members).
const photoFill = { width: "100%", height: "100%", objectFit: "cover", display: "block" };

function Profile({ m, closing, onClose, web }) {
  const { teams: TEAMS, articles, number } = useEdition(), card = useRef(null), color = TEAMS[teamsOf(m)[0]]?.color || 'var(--ink)';
  useDialogA11y(!closing, card, onClose, 'button[aria-label="Close profile"]');
  return createPortal(
    <div className={closing ? 'fade-out' : 'fade-in'} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} style={{ position: "fixed", inset: "0", zIndex: "950", background: "rgba(17,17,17,.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
      <div ref={card} className={closing ? 'card-lift' : 'card-drop'} role="dialog" aria-modal="true" aria-label={`${m.name} — profile`} style={{ position: "relative", width: web ? "380px" : "100%", maxWidth: "380px", maxHeight: "calc(100dvh - 32px)", overflowY: "auto", boxSizing: "border-box", background: "var(--card)", border: "2px solid var(--ink)", boxShadow: `9px 9px 0 ${color}`, padding: "22px", display: "flex", flexDirection: "column", gap: "10px", transform: "rotate(-0.6deg)" }}>
        <Clip color={color} w={36} h={11} top="-8px" />
        <button type="button" className="press btn" onClick={onClose} aria-label="Close profile" style={{ "--c": "var(--ink)", position: "absolute", right: "12px", top: "12px", width: "44px", height: "44px", padding: "0", background: "var(--card)", border: "2px solid var(--ink)", boxShadow: "3px 3px 0 var(--ink)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><CloseIcon size={16} /></button>
        {m.badge && <Badge b={m.badge} />}
        <div style={{ position: "relative", alignSelf: "flex-start" }}>
          {m.crown && <Crown />}
          <div style={{ width: "100px", height: "100px", borderRadius: "50%", overflow: "hidden", border: "2px solid var(--ink)", boxShadow: `6px 5px 0 ${color}`, background: "var(--blank)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {m.photo ? <img src={m.photo} alt={m.name} style={photoFill} /> : <PhotoIcon size={22} />}
          </div>
        </div>
        <div style={{ fontFamily: FONT.head, fontSize: "30px", lineHeight: "calc(0.98 * var(--head-lead, 1))", textTransform: "uppercase", color: "var(--ink)", paddingRight: "40px" }}>{m.name}</div>
        <div style={{ fontFamily: FONT.hand, fontSize: "22px", lineHeight: "1.1", color: "var(--hand)" }}>{m.role}</div>
        <p style={{ margin: "0", fontSize: "14.5px", lineHeight: "1.5", color: "var(--bioText)" }}>{m.bio || '[Two lines about them: where they work from, what they write or shoot, what they care about.]'}</p>
        {teamsOf(m).map((t) => { const c = m.credit || TEAMS[t].credit; return <p key={t} style={{ margin: "0", paddingLeft: "10px", borderLeft: `3px solid ${TEAMS[t].color}`, fontSize: "13.5px", lineHeight: "1.45", color: "var(--text)" }}><strong style={{ fontWeight: "600" }}>{TEAMS[t].label}</strong>{` — ${c[0].toLowerCase()}${c.slice(1)}.`}</p>; })}
        <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
          {articlesBy(m.name, articles).length > 0 && <Link className="press btn" to={byLink(m.name, number)} onClick={onClose} style={{ "--c": "var(--yellow)", minHeight: "44px", flexGrow: "1", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--ink)", color: "var(--card)", border: "2px solid var(--ink)", boxShadow: "3px 3px 0 var(--yellow)", fontFamily: FONT.mono, fontWeight: "700", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", textDecoration: "none" }}>{`${firstName(m.name)}’s articles`}</Link>}
          {m.instagram && <a className="press btn" href={instagramUrl(m.instagram)} target="_blank" rel="noreferrer" style={{ "--c": "var(--ink)", minHeight: "44px", padding: "0 14px", display: "flex", alignItems: "center", background: "var(--card)", color: "var(--ink)", border: "2px solid var(--ink)", boxShadow: "3px 3px 0 var(--ink)", fontFamily: FONT.mono, fontWeight: "700", fontSize: "11px", letterSpacing: "0.5px", textDecoration: "none" }}>{`@${m.instagram} ↗`}</a>}
        </div>
      </div>
    </div>,
    portalRoot(),
  );
}

export default function Board({ web }) {
  const { members, teams: TEAMS, articles } = useEdition(), P = pagesOf(articles.length), ref = useRef(null);
  const [open, setOpen] = useState(null), [shown, leaving] = usePresence(open, 170);
  const teams = Object.entries(TEAMS).map(([key, t]) => [key, t, members.filter((m) => teamsOf(m).includes(key)).length]);
  useReveal(ref);
  return (
    <section ref={ref} id="members" aria-label="Editorial board" style={{ marginTop: web ? "110px" : "64px" }}>
      <Folio web={web} page={P.board} label="editorial board" />
      <Head web={web} kicker={`SAMPADAKMANDALI · ${members.length} OF US`} title="Editorial board" aside="the people who made this issue. tap anyone" />
      <div style={{ display: "grid", gridTemplateColumns: web ? teams.map(([, , n]) => `${n > 5 ? 2 : 1}fr`).join(' ') : "1fr", columnGap: "0", rowGap: web ? "0" : "22px", alignItems: "start" }}>
        {teams.map(([key, t, n], col) => (
          <div key={key} style={web ? { padding: "0 22px", borderLeft: col ? "1px solid var(--rule)" : "none", ...(col === 0 && { paddingLeft: "0" }), ...(col === teams.length - 1 && { paddingRight: "0" }) } : null}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingBottom: "8px", borderBottom: "2px solid var(--ink)", fontFamily: FONT.mono, fontWeight: "700", fontSize: web ? "11.5px" : "10.5px", letterSpacing: "1.6px", textTransform: "uppercase", color: "var(--ink)" }}>
              <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: t.color, border: "1.5px solid var(--ink)", flexShrink: "0" }} />{t.label}
            </div>
            <div style={{ margin: "6px 0 4px", fontFamily: FONT.hand, fontSize: web ? "19px" : "18px", lineHeight: "1.1", color: "var(--hand)", textWrap: "pretty" }}>{t.made}</div>
            <ul style={{ listStyle: "none", margin: "0", padding: "0", display: "grid", gridTemplateColumns: !web || n > 5 ? "1fr 1fr" : "1fr", columnGap: web ? "22px" : "12px" }}>
              {members.filter((m) => teamsOf(m).includes(key)).map((m) => (
                <li key={m.name}>
                  <button type="button" className="an-member" onClick={() => setOpen(m)} aria-label={`${m.name}, ${m.role} — open profile`} style={{ display: "flex", alignItems: "center", gap: web ? "10px" : "8px", width: "100%", minHeight: "48px", padding: "4px 0", background: "none", border: "0", borderBottom: "1px dotted var(--rule)", textAlign: "left", cursor: "pointer", font: "inherit" }}>
                    <span style={{ width: web ? "40px" : "36px", height: web ? "40px" : "36px", flexShrink: "0", borderRadius: "50%", overflow: "hidden", border: "2px solid var(--ink)", boxShadow: `3px 2px 0 ${t.color}`, background: "var(--blank)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {m.photo ? <img src={m.photo} alt="" loading="lazy" decoding="async" width="400" height="400" style={photoFill} /> : <PhotoIcon size={16} />}
                    </span>
                    <span style={{ minWidth: "0" }}>
                      <span style={{ display: "block", fontFamily: FONT.head, fontSize: web ? "15px" : "13.5px", lineHeight: "1.1", textTransform: "uppercase", color: "var(--ink)" }}>{m.name}</span>
                      <span style={{ display: "block", marginTop: "2px", fontFamily: FONT.mono, fontSize: web ? "9.5px" : "8.5px", letterSpacing: web ? "1px" : "0.5px", textTransform: "uppercase", color: "var(--grey)" }}>{m.role}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {shown && <Profile m={shown} web={web} closing={leaving} onClose={() => setOpen(null)} />}
    </section>
  );
}
