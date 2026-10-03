import { useState } from 'react';
import { createPortal } from 'react-dom';
import BackHome from '../shared/BackHome.jsx';
import PhoneMenu from './PhoneMenu.jsx';
import { AqLink, AqAction, AqGlobe, PILL, AQ_LINK, AQ_ICONS } from '../shared/AQNav.jsx';
import { AQ_DOCK } from '../data/aqNav.js';
import { portalRoot } from '../lib/dom.js';

// The phone's two bars, AQ's nav with the magazine inside it (data/aqNav.js, shared/AQNav.jsx), as on AQ's site:
// - top: a sticky 64px strip with AQ's floating pill: AQ's globe, "Terra Notes" (on other pages "← Terra Notes", back to
//   the magazine's home, a real Back when you came from there); then search, log in and ⋯ (placeholders AQ's code
//   takes over).
// - bottom: AQ's dock (home, projects, teams, blog, notes, about). "notes" is the magazine: it's always the lit tab
//   here, and tapping it opens the magazine's own menu (sections, editions, Buddy), which slides in as before.
// current = which page this is (the menu marks it "you're here"); edge = the menu's edge colour.
const ICON_BTN = { width: "44px", height: "44px", flexShrink: "0", border: "0", borderRadius: "999px", background: "transparent", color: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "center", padding: "0" };

export default function PhoneHeader({ current, edge }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const home = current === 'home';
  return (
    <>
      <header className="site-header" style={{ position: "sticky", top: "0", zIndex: "50", width: "390px", height: "64px", boxSizing: "border-box", padding: "6px 10px 0", pointerEvents: "none" }}>
        <nav aria-label="Main" style={{ ...PILL, pointerEvents: "auto", height: "52px", boxSizing: "border-box", padding: "0 4px 0 4px", display: "flex", alignItems: "center", gap: "2px" }}>
          <AqLink path="/" aria-label="Aquaterra home" style={{ ...ICON_BTN }}><AqGlobe size={30} /></AqLink>
          {/* the magazine: AQ's lit "notes", which is also the way back to its home */}
          {home
            ? <span style={{ ...AQ_LINK, fontSize: "11.5px", padding: "0 10px" }}>Terra Notes</span>
            : <BackHome aria-label="Back to Terra Notes" style={{ ...AQ_LINK, fontSize: "11.5px", padding: "0 10px", gap: "4px" }}><span aria-hidden="true">←</span>Terra Notes</BackHome>}
          <span style={{ flexGrow: "1" }} />
          {/* AQ's own controls: placeholders until AQ's code answers them (shared/AQNav.jsx) */}
          <AqAction action="search" className="press" style={ICON_BTN}>{AQ_ICONS.search()}</AqAction>
          <AqAction action="account" className="press" style={{ ...AQ_LINK, fontSize: "11.5px", flexShrink: "0", minHeight: "38px", padding: "0 12px", border: "2px solid var(--ink)", background: "var(--mint)", boxShadow: "2px 2px 0 var(--ink)", '--c': 'var(--ink)' }}>Log in →</AqAction>
          <AqAction action="menu" className="press" style={ICON_BTN}>{AQ_ICONS.dots(20)}</AqAction>
        </nav>
      </header>
      {/* in the pop-up layer like the menu (so no page animation can carry it); styles/phone.css gives it the zoom */}
      {createPortal(<nav aria-label="Aquaterra" className="aq-dock" style={{ ...PILL, position: "fixed", left: "0", right: "0", bottom: "12px", zIndex: "45", width: "366px", height: "60px", margin: "0 auto", boxSizing: "border-box", padding: "0 6px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {AQ_DOCK.map((t) => (t.notes
          ? (
            <button key="notes" type="button" className="press" onClick={() => setMenuOpen(true)} aria-current="page" aria-label="Terra Notes: open the magazine's menu" aria-expanded={menuOpen ? 'true' : 'false'}
              style={{ ...AQ_LINK, fontSize: "11.5px", gap: "6px", padding: "0 14px", border: "0", background: "var(--ink)", color: "var(--card)", '--c': 'var(--ink)' }}>
              {AQ_ICONS[t.icon](18)}{t.label}
            </button>
          )
          : <AqLink key={t.path} path={t.path} aria-label={t.label} style={{ ...ICON_BTN, color: "var(--ink)" }}>{AQ_ICONS[t.icon]()}</AqLink>))}
      </nav>, portalRoot())}
      {/* outside the page (in <body>; inside AQ, the shadow root's pop-up layer): page styles (.page-home a …) must not reach it */}
      {createPortal(<PhoneMenu open={menuOpen} onClose={() => setMenuOpen(false)} current={current} edge={edge} />, portalRoot())}
    </>
  );
}
