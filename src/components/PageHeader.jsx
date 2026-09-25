import { Link } from 'react-router';
import Logo from './Logo.jsx';
import { BackHome } from '../lib/backHome.jsx';

// Sticky header for inner pages (the page root must stay overflow: clip for sticky to work).
// Every inner page's way out is "back to home" (a real Back when the page was opened from home).
export default function PageHeader({ menuOpen, onOpenMenu }) {
  return (
    <header className="site-header" style={{ position: "sticky", top: "0", zIndex: "50", width: "390px", height: "64px", boxSizing: "border-box", padding: "0 10px 0 12px", background: "#F3EEE4", borderBottom: "2px solid #111111", display: "flex", alignItems: "center", gap: "4px" }}>
      <BackHome className="back-home" style={{ height: "44px", flexShrink: "0", display: "flex", alignItems: "center", gap: "6px", paddingRight: "6px", textDecoration: "none", color: "#111111", fontFamily: "'Caveat', cursive", fontSize: "21px", lineHeight: "1", whiteSpace: "nowrap" }}>
        <svg width="24" height="13" viewBox="0 0 30 12" fill="none" stroke="#111111" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
          <path d="M29 6 C20 8 12 4 2 6" />
          <path d="M7 2 L2 6 L7 10" />
        </svg>
        back to home
      </BackHome>
      <span style={{ flexGrow: "1" }} />
      <Link to="/" aria-label="Aquaterra — home" style={{ display: "flex", alignItems: "center", gap: "6px", minHeight: "44px", textDecoration: "none" }}>
        <Logo globe={28} word={16} sub={10} />
      </Link>
      <button onClick={onOpenMenu} aria-label="Open menu" aria-expanded={menuOpen ? 'true' : 'false'} style={{ width: "44px", height: "44px", flexShrink: "0", border: "0", background: "transparent", padding: "0", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="26" height="18" viewBox="0 0 26 18" fill="none" stroke="#1E2723" strokeWidth="1.8" strokeLinecap="round">
          <path d="M2 5 C9 3 17 6 24 4" />
          <path d="M8 13 C13 12 19 14 24 12" />
        </svg>
      </button>
    </header>
  );
}
