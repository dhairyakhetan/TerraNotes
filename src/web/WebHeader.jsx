import { Link, useLocation } from '../router.jsx';
import BackHome from '../shared/BackHome.jsx';
import WebEditionPicker from './WebEditionPicker.jsx';
import { AqLink, AqAction, AqGlobe, PILL, AQ_LABEL, AQ_ICONS } from '../shared/AQNav.jsx';
import { AQ_TOP } from '../data/aqNav.js';
import { homeLink } from '../data/editions.js';
import { useEdition } from '../lib/edition.js';
import { isHomePath } from '../lib/routes.js';
import { FONT } from '../styles/fonts.js';

// The sticky 80px web header on every web page: AQ's nav pill (its globe, home / projects / teams, search, log in, ⋯;
// data/aqNav.js, shared/AQNav.jsx) with its "terra notes" item opened up into the magazine's own bar: "Terra Notes"
// (the magazine's home; on other pages "← Terra Notes", a real Back when you came from there), the sections of the
// page's edition's home page (/articles, /photos…; /sep26/photos… for an older one) and the edition picker.
// The header itself is see-through, so the page runs under the floating pill, as on AQ's site.
const SECTIONS = [['articles', 'Articles'], ['photos', 'Photo wall'], ['words', 'Words'], ['members', 'Members']];
const ON_GREEN = { ...AQ_LABEL, fontSize: "11px", color: "var(--card)" };
const ICON_BTN = { width: "44px", height: "44px", border: "0", borderRadius: "999px", background: "transparent", color: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "center", padding: "0", cursor: "pointer" };

export default function WebHeader() {
  const back = !isHomePath(useLocation().pathname), { number } = useEdition();
  const title = <><span aria-hidden="true">{back ? '← ' : ''}</span><span style={{ fontFamily: FONT.serif, fontStyle: "italic", fontSize: "22px", textTransform: "none", letterSpacing: "0" }}>Terra Notes</span></>;
  const tnLink = { ...ON_GREEN, display: "flex", alignItems: "center", minHeight: "44px", padding: "0 6px 0 10px", whiteSpace: "nowrap" };
  return (
    <header className="site-header" style={{ position: "sticky", top: "0", zIndex: "50", width: "1440px", height: "80px", boxSizing: "border-box", padding: "0 40px", display: "flex", alignItems: "center", pointerEvents: "none" }}>
      <nav aria-label="Main" style={{ ...PILL, pointerEvents: "auto", flexGrow: "1", height: "60px", boxSizing: "border-box", padding: "0 8px 0 10px", display: "flex", alignItems: "center", gap: "6px" }}>
        <AqLink path="/" aria-label="Aquaterra home" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "44px", height: "44px", flexShrink: "0" }}><AqGlobe size={34} /></AqLink>
        {AQ_TOP.map((l) => <AqLink key={l.path} path={l.path} className="nav-link" style={{ ...AQ_LABEL, fontSize: "11px", padding: "14px 8px" }}>{l.label}</AqLink>)}
        {/* AQ's "terra notes" item, opened up: the magazine's own bar */}
        <div aria-label="Terra Notes" role="group" style={{ display: "flex", alignItems: "center", gap: "14px", height: "48px", marginLeft: "6px", padding: "0 8px 0 4px", borderRadius: "999px", background: "var(--green)", boxShadow: "3px 3px 0 var(--ink)", border: "2px solid var(--ink)", boxSizing: "border-box" }}>
          {back
            ? <BackHome className="lift-link" aria-label="Back to Terra Notes" style={tnLink}>{title}</BackHome>
            : <Link to="/" aria-current="page" style={tnLink}>{title}</Link>}
          <span aria-hidden="true" style={{ width: "1.5px", height: "22px", background: "var(--card)", opacity: ".5" }} />
          {SECTIONS.map(([id, label]) => <Link key={id} className="nav-link" to={homeLink(number, id)} style={ON_GREEN}>{label}</Link>)}
          <WebEditionPicker onDark />
        </div>
        <span style={{ flexGrow: "1" }} />
        {/* AQ's own controls: placeholders until AQ's code answers them (shared/AQNav.jsx) */}
        <AqAction action="search" className="btn" style={ICON_BTN}>{AQ_ICONS.search()}</AqAction>
        <AqAction action="account" style={{ ...AQ_LABEL, fontSize: "11px", minHeight: "44px", padding: "0 18px", borderRadius: "999px", border: "2px solid var(--ink)", background: "var(--ink)", color: "var(--card)", cursor: "pointer" }}>Log in →</AqAction>
        <AqAction action="menu" style={ICON_BTN}>{AQ_ICONS.dots(20)}</AqAction>
      </nav>
    </header>
  );
}
