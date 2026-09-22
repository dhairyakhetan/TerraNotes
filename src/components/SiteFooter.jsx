import { Link } from 'react-router';
import { SITE } from '../data/site.js';
import { instagramUrl } from '../lib/format.js';

// Dark footer for inner pages. `top` = its y inside the page root.
export default function SiteFooter({ top }) {
  return (
    <footer style={{ position: "absolute", left: "0", top, width: "390px", height: "170px", boxSizing: "border-box", padding: "24px 24px 0", background: "#111111", color: "#F3EEE4", display: "flex", flexDirection: "column", gap: "12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <Link to="/" aria-label="Aquaterra — home" style={{ display: "flex", alignItems: "center", gap: "6px", minHeight: "44px", textDecoration: "none" }}>
          <img src="/logo.png" alt="" width="32" height="32" style={{ display: "block", width: "32px", height: "32px" }} />
          <span className="wordmark" style={{ fontFamily: "'Archivo Black', Impact, sans-serif", fontSize: "25px", lineHeight: "1", letterSpacing: "0.5px", textTransform: "uppercase" }}>Aquaterra</span>
        </Link>
        <a href={instagramUrl(SITE.instagram)} target="_blank" rel="noreferrer" style={{ fontSize: "13px", textDecoration: "none", padding: "12px 0", color: "#F3EEE4" }}>{`@${SITE.instagram}`}</a>
      </div>
      <nav style={{ display: "flex", flexWrap: "wrap", gap: "4px 18px", fontSize: "14px" }}>
        <Link to="/" style={{ textDecoration: "none", padding: "10px 0", color: "#F3EEE4" }}>Home</Link>
        <Link to="/articles" style={{ textDecoration: "none", padding: "10px 0", color: "#F3EEE4" }}>Articles</Link>
        <Link to="/#photos" style={{ textDecoration: "none", padding: "10px 0", color: "#F3EEE4" }}>Photos</Link>
        <Link to="/#members" style={{ textDecoration: "none", padding: "10px 0", color: "#F3EEE4" }}>Members</Link>
      </nav>
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", color: "#BDB6A6" }}>TERRANOTES · © {new Date().getFullYear()}</div>
    </footer>
  );
}
