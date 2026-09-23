import Logo from '../components/Logo.jsx';
import SmartLink from '../components/SmartLink.jsx';
import { SITE } from '../data/site.js';
import { instagramUrl } from '../lib/format.js';

const NAV = [['articles', 'Articles'], ['photos', 'Photo wall'], ['words', 'Words'], ['members', 'Members']];
const navText = { fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "12px", letterSpacing: "1.6px", textTransform: "uppercase", color: "#111111" };

// Sticky web header: logo, the home page's sections (clean addresses: /photos…), Instagram.
export default function WebHeader() {
  return (
    <header style={{ position: "sticky", top: "0", zIndex: "50", width: "1440px", height: "80px", boxSizing: "border-box", padding: "0 48px", background: "#F3EEE4", borderBottom: "2px solid #111111", display: "flex", alignItems: "center", gap: "40px" }}>
      <SmartLink href="/" aria-label="Aquaterra — home" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
        <Logo globe={46} word={27} sub={15} />
      </SmartLink>
      <span style={{ flexGrow: "1" }} />
      <nav aria-label="Main" style={{ display: "flex", alignItems: "center", gap: "36px" }}>
        {NAV.map(([id, label]) => <SmartLink key={id} className="nav-link" href={`/${id}`} style={navText}>{label}</SmartLink>)}
      </nav>
      <a className="btn" href={instagramUrl(SITE.instagram)} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: "8px", minHeight: "44px", padding: "0 16px", background: "#FFFFFF", border: "2px solid #111111", boxShadow: "4px 4px 0 #111111", fontFamily: "'Space Mono', monospace", fontSize: "12px", textDecoration: "none", color: "#111111" }}>
        {`@${SITE.instagram}`}
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M2 10 L10 2" />
          <path d="M4 2 H10 V8" />
        </svg>
      </a>
    </header>
  );
}
