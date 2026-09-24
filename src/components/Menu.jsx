import { useLayoutEffect, useState } from 'react';
import SmartLink from './SmartLink.jsx';
import { SITE } from '../data/site.js';
import { instagramUrl } from '../lib/format.js';
import Logo from './Logo.jsx';
import { GlobeIcon, InstagramIcon } from './LinkIcons.jsx';
import { MenuCall } from './buddy/Buddy.jsx';

// Stops on the wire. left = card x; string = x of its string on the card; rot = tilt; here = the page where its card says "you're here".
const STOPS = [
  { num: '01', label: 'Home', hrefKey: 'home', left: '20px', string: '170px', rot: '-1.5deg', color: '#F0442B', here: 'home' },
  { num: '02', label: 'Articles', hrefKey: 'articles', left: '50px', string: '60px', rot: '1.2deg', color: '#3DA5F4', here: 'articles' },
  { num: '03', label: 'Photo wall', hrefKey: 'photos', left: '24px', string: '246px', rot: '-0.8deg', color: '#F7C21A', here: 'photos' },
  { num: '04', label: 'Words', hrefKey: 'words', left: '46px', string: '84px', rot: '1.6deg', color: '#7FC49B', here: 'words' },
  { num: '05', label: 'Members', hrefKey: 'members', left: '22px', string: '228px', rot: '-1.2deg', color: '#EE4E8A', here: 'members' },
  { num: '06', label: 'Editions', hrefKey: 'editions', left: '44px', string: '96px', rot: '1deg', color: '#7B5CE6', here: 'editions' },
];

// On the home page, where "you're here" goes: the section in the upper part of the screen right now
// (the intro at the very top, then the articles, photo wall, words, team).
function homeSection() {
  if (typeof document === 'undefined') return 'home';
  const line = innerHeight * 0.4;
  const top = (id) => document.getElementById(id)?.getBoundingClientRect().top ?? Infinity;
  if (top('members') <= line) return 'members';
  if (top('words') <= line) return 'words';
  if (top('photos') <= line) return 'photos';
  return scrollY < 220 ? 'home' : 'articles';
}

// Full-screen menu (inside MenuSheet). Sized by the --gap/--card/… variables in styles/global.css so it fits any screen.
export default function Menu({ current = 'home', open, onClose }) {
  const home = current === 'home';
  // measured the moment the menu opens, before the page behind it is locked
  const [spot, setSpot] = useState('home');
  useLayoutEffect(() => { if (open && home) setSpot(homeSection()); }, [open, home]);
  const here = home ? spot : current;
  const close = () => { if (onClose) onClose(); };
  const hrefs = { home: '/', articles: '/articles', photos: '/photos', words: '/words', members: '/members', editions: '/editions' };
  return (
    <nav aria-label="Main menu" className="main-menu" style={{ position: "relative", width: "390px", overflow: "hidden", background: "#111111", color: "#F3EEE4", fontFamily: "'Figtree', system-ui, sans-serif", display: "flex", flexDirection: "column" }}>
      {/* top bar */}
      <div style={{ position: "absolute", left: "18px", top: "16px" }}>
        <SmartLink href={hrefs.home} onClick={close} aria-label="Aquaterra — home" style={{ display: "flex", alignItems: "center", gap: "6px", minHeight: "44px", textDecoration: "none" }}>
          <Logo globe={36} word={21} sub={13} dark />
        </SmartLink>
      </div>
      <button className="press" onClick={close} aria-label="Close menu" style={{ "--c": "#F0442B", position: "absolute", right: "20px", top: "18px", width: "48px", height: "48px", background: "#FFFFFF", border: "2px solid #F3EEE4", boxShadow: "4px 4px 0 #F0442B", padding: "0", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#111111" strokeWidth="2.6" strokeLinecap="square">
          <path d="M3 3 L17 17" />
          <path d="M17 3 L3 17" />
        </svg>
      </button>
      <div style={{ position: "absolute", left: "20px", top: "calc(94px + var(--lift))", fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "1.6px", color: "#BDB6A6" }}>{`MENU · ${String(STOPS.length).padStart(2, '0')} STOPS`}</div>
      {/* the wire; each card hangs from the one above on its own string */}
      <div style={{ position: "absolute", left: "0", top: "calc(124px + var(--lift))", width: "390px", height: "2px", background: "#8E7A5E" }} />
      <ol style={{ listStyle: "none", margin: "0", padding: "calc(150px + var(--lift)) 0 24px", display: "flex", flexDirection: "column", gap: "var(--gap)" }}>
        {STOPS.map((s, i) => (
          <li key={s.num} style={{ position: "relative", marginLeft: s.left, width: "318px", height: "var(--card)" }}>
            <div aria-hidden="true" style={{ position: "absolute", left: s.string, bottom: "calc(100% - 4px)", width: "1.4px", height: i === 0 ? "28px" : "calc(var(--gap) + 8px)", background: "#8E7A5E" }} />
            <SmartLink href={hrefs[s.hrefKey]} onClick={close} className="menu-card" aria-current={here === s.here ? 'page' : undefined} style={{ "--c": s.color, position: "relative", zIndex: "1", height: "100%", boxSizing: "border-box", transform: `rotate(${s.rot})`, background: "#FFFFFF", border: "2px solid #F3EEE4", boxShadow: `6px 6px 0 ${s.color}`, padding: "0 16px", display: "flex", alignItems: "center", gap: "14px", textDecoration: "none", color: "#111111" }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px" }}>{s.num}</span>
              <span style={{ flexGrow: "1", fontFamily: "'Archivo Black', Impact, sans-serif", fontSize: "var(--title)", lineHeight: "1", textTransform: "uppercase", letterSpacing: "-0.5px" }}>{s.label}</span>
              {here === s.here
                ? <span className="here-note" style={{ fontFamily: "'Caveat', cursive", fontSize: "20px", lineHeight: "1", color: s.color, transform: "rotate(-6deg)", whiteSpace: "nowrap" }}>you're here</span>
                : <svg width="22" height="16" viewBox="0 0 22 16" fill="none" stroke="#111111" strokeWidth="2.4" aria-hidden="true"><path d="M1 8 H19" /><path d="M13 2 L19 8 L13 14" /></svg>}
            </SmartLink>
          </li>
        ))}
      </ol>
      {/* bottom */}
      <div style={{ position: "relative", marginTop: "auto", height: "var(--foot)", flexShrink: "0" }}>
        <div style={{ position: "absolute", left: "20px", top: "0", width: "350px", height: "1.5px", background: "#3A3A36" }} />
        <div style={{ position: "absolute", left: "20px", top: "16px", width: "200px", fontFamily: "'Caveat', cursive", fontSize: "22px", lineHeight: "1.05", color: "#F7C21A", transform: "rotate(-2deg)" }}>notes from where the land meets the water.</div>
        {/* the links that leave the site */}
        <a href={SITE.website} target="_blank" rel="noreferrer" aria-label="Aquaterra website (ngoaquaterra.com)" style={{ position: "absolute", right: "20px", top: "12px", minHeight: "40px", display: "flex", alignItems: "center", gap: "8px", fontFamily: "'Space Mono', monospace", fontSize: "12px", letterSpacing: "1px", textTransform: "uppercase", textDecoration: "none", color: "#F3EEE4" }}><GlobeIcon />Website ↗</a>
        <a href={instagramUrl(SITE.instagram)} target="_blank" rel="noreferrer" aria-label={`Aquaterra on Instagram (@${SITE.instagram})`} style={{ position: "absolute", right: "20px", top: "54px", minHeight: "40px", display: "flex", alignItems: "center", gap: "8px", fontFamily: "'Space Mono', monospace", fontSize: "12px", letterSpacing: "1px", textTransform: "uppercase", textDecoration: "none", color: "#F3EEE4" }}><InstagramIcon />Instagram ↗</a>
        <div style={{ position: "absolute", left: "20px", bottom: "36px", fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "1.4px", color: "#8E8A7A" }}>TERRANOTES · © {new Date().getFullYear()}</div>
        <MenuCall onClose={close} />
      </div>
    </nav>
  );
}
