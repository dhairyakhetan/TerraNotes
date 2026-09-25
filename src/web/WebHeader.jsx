import { Link } from 'react-router';
import Logo from '../shared/Logo.jsx';
import { GlobeIcon, InstagramIcon } from '../shared/Icons.jsx';
import WebEditionPicker from './WebEditionPicker.jsx';
import { SITE } from '../data/site.js';
import { instagramUrl } from '../lib/format.js';
import { FONT } from '../styles/fonts.js';

// The sticky 80px web header on every web page: logo (→ home), the edition picker, the home page's sections
// (/articles, /photos… glide there), then boxed buttons to Aquaterra's main website and Instagram.
const NAV = [['articles', 'Articles'], ['photos', 'Photo wall'], ['words', 'Words'], ['members', 'Members']];
const OUT = { display: "flex", alignItems: "center", gap: "8px", minHeight: "44px", padding: "0 16px", background: "#FFFFFF", border: "2px solid #111111", boxShadow: "4px 4px 0 #111111", fontFamily: FONT.mono, fontSize: "12px", textDecoration: "none", color: "#111111" };

export default function WebHeader() {
  return (
    <header className="site-header" style={{ position: "sticky", top: "0", zIndex: "50", width: "1440px", height: "80px", boxSizing: "border-box", padding: "0 48px", background: "#F3EEE4", borderBottom: "2px solid #111111", display: "flex", alignItems: "center", gap: "24px" }}>
      <Link to="/" aria-label="Aquaterra — home" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
        <Logo globe={46} word={27} sub={15} />
      </Link>
      <WebEditionPicker />
      <span style={{ flexGrow: "1" }} />
      <nav aria-label="Main" style={{ display: "flex", alignItems: "center", gap: "24px" }}>
        {NAV.map(([id, label]) => <Link key={id} className="nav-link" to={`/${id}`} style={{ fontFamily: FONT.mono, fontWeight: "700", fontSize: "12px", letterSpacing: "1.6px", textTransform: "uppercase", color: "#111111" }}>{label}</Link>)}
      </nav>
      <span aria-hidden="true" style={{ width: "2px", height: "32px", background: "#111111", opacity: ".25" }} />
      <a className="btn" href={SITE.website} target="_blank" rel="noreferrer" aria-label={`Aquaterra website (${new URL(SITE.website).host})`} style={OUT}><GlobeIcon />Website</a>
      <a className="btn" href={instagramUrl(SITE.instagram)} target="_blank" rel="noreferrer" aria-label={`Aquaterra on Instagram (@${SITE.instagram})`} style={OUT}><InstagramIcon />Instagram</a>
    </header>
  );
}
