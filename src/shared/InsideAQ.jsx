import { Link } from '../router.jsx';
import BackHome from './BackHome.jsx';
import { LatestTag } from './Tapes.jsx';
import { LATEST, PUBLISHED, editionLink, editionName } from '../data/editions.js';
import { useEdition } from '../lib/edition.js';
import { HOST } from '../host.js';
import { FONT } from '../styles/fonts.js';

// Inside AQ's website only (HOST.embedded). There AQ's own nav stays as it is and the magazine's header is hidden
// (styles/base.css), so the two things only that header gave are drawn in the page instead:
// - PastEditionsCard: the way to the other editions (the header's edition picker), at the end of the home pages, under
//   the Snake card. Only when there is another edition to go to.
// - BackToMagazine: a small "← Terra Notes" pill under AQ's nav on the other pages (the header's back link).
const MONO = { fontFamily: FONT.mono, fontWeight: "700", letterSpacing: "1.4px", textTransform: "uppercase" };

const otherEditions = (here) => [...PUBLISHED].reverse().filter((e) => e.number !== here);
// how much taller the home page gets for the card (0 when it isn't drawn)
export const pastEditionsSpace = (here, web) => (HOST.embedded && otherEditions(here).length ? (web ? 240 : 230) + 64 * (otherEditions(here).length - 1) : 0);

export function PastEditionsCard({ web, top }) {
  const { number } = useEdition();
  const list = otherEditions(number);
  if (!HOST.embedded || !list.length) return null;
  const W = web ? 620 : 342;
  return (
    <nav aria-label="Other editions" style={{ position: "absolute", left: `${(web ? 1440 : 390) / 2 - W / 2}px`, top: `${top}px`, width: `${W}px`, boxSizing: "border-box", padding: web ? "22px 28px" : "16px", background: "var(--card)", border: "2px solid var(--ink)", boxShadow: `${web ? 8 : 5}px ${web ? 8 : 5}px 0 var(--yellow)`, transform: "rotate(0.8deg)", color: "var(--ink)" }}>
      <div style={{ ...MONO, fontSize: web ? "12px" : "10px", color: "var(--dek)" }}>{number === LATEST ? 'past editions' : 'other editions'}</div>
      {list.map((e) => (
        <Link key={e.number} to={editionLink(e.number)} style={{ display: "flex", alignItems: "center", gap: "10px", minHeight: "48px", borderBottom: "1.5px solid var(--rule)", textDecoration: "none", color: "var(--ink)" }}>
          <span style={{ fontFamily: FONT.head, fontSize: web ? "22px" : "17px", textTransform: "uppercase" }}>{editionName(e.number)}</span>
          <span style={{ fontFamily: FONT.hand, fontSize: web ? "24px" : "20px", color: "var(--hand)", flexGrow: "1" }}>{e.month}</span>
          {e.number === LATEST && <LatestTag />}
          <span aria-hidden="true" style={{ ...MONO, fontSize: "14px" }}>→</span>
        </Link>
      ))}
      <Link to="/editions" style={{ ...MONO, fontSize: web ? "12px" : "11px", display: "flex", alignItems: "center", minHeight: "44px", marginTop: "4px", textDecoration: "none", color: "var(--ink)" }}>all editions →</Link>
    </nav>
  );
}

// floats just under AQ's fixed nav (AQ sets --nav-h on its page; the custom property reaches into the shadow root),
// left, so it never moves the page's own layout. The page is zoomed, so the offset is divided back.
export function BackToMagazine({ web }) {
  if (!HOST.embedded) return null;
  const z = web ? 'var(--web-zoom, 1)' : 'var(--phone-zoom, 1)';
  return (
    <BackHome className={web ? 'btn' : 'press'} style={{ position: "fixed", zIndex: "40", top: `calc(var(--nav-h, 70px) / ${z} + 10px)`, left: web ? "24px" : "12px", display: "inline-flex", alignItems: "center", minHeight: "44px", padding: "0 16px", boxSizing: "border-box", borderRadius: "999px", background: "var(--card)", border: "2px solid var(--ink)", boxShadow: "3px 3px 0 var(--ink)", "--c": "var(--ink)", ...MONO, fontSize: web ? "12px" : "11px", color: "var(--ink)", textDecoration: "none" }}>← Terra Notes</BackHome>
  );
}
