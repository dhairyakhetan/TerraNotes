import { Link } from 'react-router';

/*
  STICKY HEADER for inner pages: back arrow + logo + menu button.
  It is the only in-flow element of the page (everything else is absolutely positioned), so
  position: sticky pins it to the top while scrolling. It needs the page root to use overflow: clip
  (NOT hidden), otherwise sticky silently stops working.
*/
export default function PageHeader({ backTo, backLabel, menuOpen, onOpenMenu }) {
  return (
    <header className="site-header" style={{ position: "sticky", top: "0", zIndex: "50", width: "390px", height: "64px", boxSizing: "border-box", padding: "0 10px 0 12px", background: "#F3EEE4", borderBottom: "2px solid #111111", display: "flex", alignItems: "center", gap: "4px" }}>
      <Link to={backTo} aria-label={backLabel} style={{ width: "40px", height: "44px", flexShrink: "0", display: "flex", alignItems: "center", justifyContent: "flex-start", textDecoration: "none" }}>
        <svg width="26" height="14" viewBox="0 0 30 12" fill="none" stroke="#111111" strokeWidth="1.8" strokeLinecap="round">
          <path d="M29 6 C20 8 12 4 2 6" />
          <path d="M7 2 L2 6 L7 10" />
        </svg>
      </Link>
      <Link to="/" aria-label="Aquaterra — home" style={{ display: "flex", alignItems: "center", gap: "6px", minHeight: "44px", textDecoration: "none" }}>
        <img src="/logo.png" alt="" width="32" height="32" style={{ display: "block", width: "32px", height: "32px" }} />
        <span className="wordmark" style={{ fontFamily: "'Archivo Black', Impact, sans-serif", fontSize: "25px", lineHeight: "1", letterSpacing: "0.5px", textTransform: "uppercase" }}>Aquaterra</span>
      </Link>
      <span style={{ flexGrow: "1" }} />
      <button onClick={onOpenMenu} aria-label="Open menu" aria-expanded={menuOpen ? 'true' : 'false'} style={{ width: "44px", height: "44px", flexShrink: "0", border: "0", background: "transparent", padding: "0", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="26" height="18" viewBox="0 0 26 18" fill="none" stroke="#1E2723" strokeWidth="1.8" strokeLinecap="round">
          <path d="M2 5 C9 3 17 6 24 4" />
          <path d="M8 13 C13 12 19 14 24 12" />
        </svg>
      </button>
    </header>
  );
}
