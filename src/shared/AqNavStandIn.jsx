import { Link } from '../router.jsx';
import { SITE } from '../data/site.js';
import { withBase } from '../lib/base.js';
import { FONT } from '../styles/fonts.js';

// A stand-in for AQ's own nav bar, drawn only on the magazine's own site while it shows AQ's look (src/host.js
// AQ_LOOK), so the pages can be checked as they will sit inside AQ's website: a fixed 70px strip with AQ's white pill
// on top of the page, where the magazine's (hidden) header leaves room. Inside AQ the real one is there instead. Its
// links go to AQ's site; "Terra Notes" is lit, as AQ lights the page you're on. Real px (not zoomed), like AQ's.
const LINK = { fontFamily: FONT.body, fontWeight: "800", fontSize: "12.5px", letterSpacing: "0.02em", textTransform: "uppercase", color: "var(--ink)", textDecoration: "none", display: "inline-flex", alignItems: "center", minHeight: "40px", padding: "0 14px", borderRadius: "999px", whiteSpace: "nowrap" };

export default function AqNavStandIn({ web }) {
  return (
    <div aria-label="Aquaterra (stand-in for AQ's nav)" role="navigation" style={{ position: "fixed", left: "0", right: "0", top: "0", zIndex: "60", height: "70px", boxSizing: "border-box", padding: web ? "8px 24px 0" : "8px 10px 0", pointerEvents: "none" }}>
      <div style={{ pointerEvents: "auto", height: "54px", boxSizing: "border-box", maxWidth: "1280px", margin: "0 auto", padding: "0 6px 0 10px", display: "flex", alignItems: "center", gap: "4px", background: "var(--card)", border: "2px solid var(--ink)", borderRadius: "999px" }}>
        <a href={SITE.website} aria-label="Aquaterra home" style={{ display: "flex", padding: "0 6px" }}><img src={withBase('/brand/aquaterra-globe.webp')} alt="" width="32" height="32" style={{ display: "block" }} /></a>
        <span style={{ flexGrow: "1" }} />
        {web && <>
          <a href={`${SITE.website}/`} style={LINK}>Home</a>
          <a href={`${SITE.website}/projects`} style={LINK}>Projects</a>
          <a href={`${SITE.website}/teams`} style={LINK}>Teams</a>
          <Link to="/" aria-current="page" style={{ ...LINK, background: "var(--green)", color: "var(--card)" }}>Terra Notes</Link>
          <span style={{ flexGrow: "1" }} />
        </>}
        <a href={SITE.website} style={{ ...LINK, background: "var(--green)", color: "var(--card)", border: "2px solid var(--ink)", boxShadow: "2px 2px 0 var(--ink)" }}>Apply →</a>
        <a href={SITE.website} style={{ ...LINK, background: "var(--page)" }}>⋯ menu</a>
      </div>
    </div>
  );
}
