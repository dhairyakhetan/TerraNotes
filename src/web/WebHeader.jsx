import { Link, useLocation } from '../router.jsx';
import BackHome from '../shared/BackHome.jsx';
import WebEditionPicker from './WebEditionPicker.jsx';
import { AqLink, AqAction, AqGlobe, PILL, AQ_LINK, AQ_ON, AQ_TINT, AQ_ICONS } from '../shared/AQNav.jsx';
import { AQ_TOP } from '../data/aqNav.js';
import { homeLink } from '../data/editions.js';
import { useEdition } from '../lib/edition.js';
import { isHomePath } from '../lib/routes.js';

// The sticky 80px web header on every web page: AQ's own nav bar (its flat white pill: globe, home / projects / teams,
// search, log in, ⋯; data/aqNav.js, shared/AQNav.jsx) with its "terra notes" link lit, as on AQ's site, and the
// magazine's own links carrying on from it in the same style: the sections of the page's edition's home page
// (/articles, /photos…; /sep26/photos… for an older one) and the edition picker. "Terra Notes" is the magazine's home
// (on other pages a real Back when you came from there).
// The header itself is see-through, so the page runs under the floating pill, as on AQ's site.
const SECTIONS = [['articles', 'Articles'], ['photos', 'Photo wall'], ['words', 'Words'], ['members', 'Members']];
const ICON_BTN = { width: "44px", height: "44px", border: "0", borderRadius: "999px", background: "transparent", color: "var(--ink)", display: "flex", alignItems: "center", justifyContent: "center", padding: "0", cursor: "pointer" };
const tint = (key, icon) => <span aria-hidden="true" style={{ display: "inline-flex", color: AQ_TINT[key] }}>{AQ_ICONS[icon]()}</span>;

export default function WebHeader() {
  const back = !isHomePath(useLocation().pathname), { number } = useEdition();
  const lit = { ...AQ_LINK, ...AQ_ON };
  const notes = <>{tint('notes', 'open')}Terra Notes</>;
  return (
    <header className="site-header" style={{ position: "sticky", top: "0", zIndex: "50", width: "1440px", height: "80px", boxSizing: "border-box", padding: "0 40px", display: "flex", alignItems: "center", pointerEvents: "none" }}>
      <nav aria-label="Main" style={{ ...PILL, pointerEvents: "auto", flexGrow: "1", height: "58px", boxSizing: "border-box", padding: "0 6px 0 8px", display: "flex", alignItems: "center", gap: "2px" }}>
        <AqLink path="/" aria-label="Aquaterra home" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "44px", height: "44px", flexShrink: "0", marginRight: "6px" }}><AqGlobe size={34} /></AqLink>
        {AQ_TOP.map((l) => <AqLink key={l.path} path={l.path} className="aq-link" style={AQ_LINK}>{tint(l.label, l.icon)}{l.label}</AqLink>)}
        {/* AQ's "terra notes" link, lit: we're in the magazine */}
        {back
          ? <BackHome className="aq-link" aria-label="Terra Notes: back to the magazine's home" style={lit}>{notes}</BackHome>
          : <Link to="/" aria-current="page" style={lit}>{notes}</Link>}
        {/* the magazine's own links, carrying on from it */}
        <span aria-hidden="true" style={{ display: "inline-flex", color: "var(--muted)", margin: "0 2px 0 4px" }}>{AQ_ICONS.chevron()}</span>
        {SECTIONS.map(([id, label]) => <Link key={id} className="aq-link" to={homeLink(number, id)} style={{ ...AQ_LINK, padding: "0 11px", color: "var(--text)" }}>{label}</Link>)}
        <WebEditionPicker compact />
        <span style={{ flexGrow: "1" }} />
        {/* AQ's own controls: placeholders until AQ's code answers them (shared/AQNav.jsx) */}
        <AqAction action="search" className="aq-link" style={ICON_BTN}>{AQ_ICONS.search()}</AqAction>
        <AqAction action="account" className="press btn" style={{ ...AQ_LINK, padding: "0 18px", margin: "0 6px", border: "2px solid var(--ink)", background: "var(--mint)", boxShadow: "3px 3px 0 var(--ink)", cursor: "pointer", '--c': 'var(--ink)' }}>Log in →</AqAction>
        <AqAction action="menu" className="aq-link" style={{ ...AQ_LINK, gap: "8px", border: "0", background: "var(--page)", cursor: "pointer" }}>{AQ_ICONS.dots(16)}menu</AqAction>
      </nav>
    </header>
  );
}
