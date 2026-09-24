// When the opening notebook animation plays (components/Intro.jsx):
//   - on someone's first visit, and again once INTRO_TTL has passed since they last saw it,
//   - on a hard refresh (Ctrl+Shift+R / Cmd+Shift+R), but not on a normal one,
//   - always with ?intro in the address (handy for showing it off; the ?intro is then dropped).
// Automated browsers (tests, crawlers that run scripts) skip it.
const KEY = 'aq-intro';
export const INTRO_TTL = 2.5 * 60 * 60 * 1000; // 2½ hours

// A hard refresh fetches everything again, ignoring the cache. So: a reload whose copy of this very script came over
// the network in full (a normal reload takes it from the cache, or at most asks the server if it changed).
function hardRefresh() {
  const nav = performance.getEntriesByType?.('navigation')[0];
  if (!nav || nav.type !== 'reload') return false;
  const me = performance.getEntriesByName(import.meta.url)[0];
  return !!me && me.encodedBodySize > 0 && me.transferSize > me.encodedBodySize;
}

export function introWanted() {
  try {
    const q = new URLSearchParams(location.search);
    if (q.has('intro')) {
      q.delete('intro');
      history.replaceState(history.state, '', `${location.pathname}${q.toString() ? `?${q}` : ''}${location.hash}`);
      return true;
    }
    if (navigator.webdriver) return false;
    const last = Number(localStorage.getItem(KEY)) || 0;
    return Date.now() - last > INTRO_TTL || hardRefresh();
  } catch {
    return false; // no storage (some private modes): don't replay it on every page
  }
}

export function introSeen() {
  try { localStorage.setItem(KEY, String(Date.now())); } catch { /* private mode */ }
}
