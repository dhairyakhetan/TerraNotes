import Logo from '../components/Logo.jsx';
import SmartLink from '../components/SmartLink.jsx';
import EditionPicker from '../components/EditionPicker.jsx';
import { GlobeIcon, InstagramIcon } from '../components/LinkIcons.jsx';
import { SITE } from '../data/site.js';
import { instagramUrl } from '../lib/format.js';

const NAV = [['articles', 'Articles'], ['photos', 'Photo wall'], ['words', 'Words'], ['members', 'Members']];
const navText = { fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "12px", letterSpacing: "1.6px", textTransform: "uppercase", color: "#111111" };

// Sticky web header: logo, the edition picker, the home page's sections (clean addresses: /photos…), Aquaterra's
// main site and Instagram.
export default function WebHeader() {
  return (
    <header style={{ position: "sticky", top: "0", zIndex: "50", width: "1440px", height: "80px", boxSizing: "border-box", padding: "0 48px", background: "#F3EEE4", borderBottom: "2px solid #111111", display: "flex", alignItems: "center", gap: "24px" }}>
      <SmartLink href="/" aria-label="Aquaterra — home" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
        <Logo globe={46} word={27} sub={15} />
      </SmartLink>
      <EditionPicker />
      <span style={{ flexGrow: "1" }} />
      <nav aria-label="Main" style={{ display: "flex", alignItems: "center", gap: "24px" }}>
        {NAV.map(([id, label]) => <SmartLink key={id} className="nav-link" href={`/${id}`} style={navText}>{label}</SmartLink>)}
      </nav>
      {/* links that leave the site: boxed buttons after a divider (the section links above stay in the page) */}
      <span aria-hidden="true" style={{ width: "2px", height: "32px", background: "#111111", opacity: ".25" }} />
      <a className="btn" href={SITE.website} target="_blank" rel="noreferrer" aria-label="Aquaterra website (ngoaquaterra.com)" style={{ display: "flex", alignItems: "center", gap: "8px", minHeight: "44px", padding: "0 16px", background: "#FFFFFF", border: "2px solid #111111", boxShadow: "4px 4px 0 #111111", fontFamily: "'Space Mono', monospace", fontSize: "12px", textDecoration: "none", color: "#111111" }}>
        <GlobeIcon />Website
      </a>
      <a className="btn" href={instagramUrl(SITE.instagram)} target="_blank" rel="noreferrer" aria-label={`Aquaterra on Instagram (@${SITE.instagram})`} style={{ display: "flex", alignItems: "center", gap: "8px", minHeight: "44px", padding: "0 16px", background: "#FFFFFF", border: "2px solid #111111", boxShadow: "4px 4px 0 #111111", fontFamily: "'Space Mono', monospace", fontSize: "12px", textDecoration: "none", color: "#111111" }}>
        <InstagramIcon />Instagram
      </a>
    </header>
  );
}
