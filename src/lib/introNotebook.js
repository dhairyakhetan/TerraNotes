import { stripBase } from './base.js';
import { isDemoPath } from './routes.js';

// When the opening notebook animation (shared/IntroNotebook.jsx) plays: on a first visit, again 2½ hours after it was
// last seen, on a hard refresh (Ctrl/Cmd+Shift+R), and always with ?intro in the address (the ?intro is then dropped).
// Automated browsers (tests, crawlers) never get it.
const KEY = 'aq-intro';
const TTL = 2.5 * 60 * 60 * 1000;

// A hard refresh re-downloads everything: this script arrived over the network in full rather than from the cache.
function hardRefresh() {
  const nav = performance.getEntriesByType?.('navigation')[0];
  if (!nav || nav.type !== 'reload') return false;
  const me = performance.getEntriesByName(import.meta.url)[0];
  return !!me && me.encodedBodySize > 0 && me.transferSize > me.encodedBodySize;
}

// React may render the magazine's root more than once before it commits (a suspended render is thrown away and retried;
// StrictMode does it on purpose), and the check has a side effect (it strips ?intro from the address), so a second call
// would say "no". A "yes" is therefore kept until the notebook has actually played (introSeen).
let pending = false;
export function introWanted() {
  if (pending) return true;
  pending = decide();
  return pending;
}

function decide() {
  try {
    if (isDemoPath(stripBase(location.pathname))) return false; // a demo opened in its own tab
    const q = new URLSearchParams(location.search);
    if (q.has('intro')) {
      q.delete('intro');
      history.replaceState(history.state, '', `${location.pathname}${q.toString() ? `?${q}` : ''}${location.hash}`);
      return true;
    }
    if (navigator.webdriver) return false;
    return Date.now() - (Number(localStorage.getItem(KEY)) || 0) > TTL || hardRefresh();
  } catch {
    return false; // no storage (some private modes): don't replay it on every page
  }
}

export function introSeen() {
  pending = false;
  try { localStorage.setItem(KEY, String(Date.now())); } catch { /* private mode */ }
}
