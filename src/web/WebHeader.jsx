import { Link } from 'react-router';
import Logo from '../shared/Logo.jsx';
import WebEditionPicker from './WebEditionPicker.jsx';
import { FONT } from '../styles/fonts.js';

// The sticky 80px web header on every web page: logo (→ home), the edition picker, the home page's sections
// (/articles, /photos… glide there), aligned right.
const NAV = [['articles', 'Articles'], ['photos', 'Photo wall'], ['words', 'Words'], ['members', 'Members']];

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
    </header>
  );
}
