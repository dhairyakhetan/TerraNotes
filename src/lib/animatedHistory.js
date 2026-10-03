import { flushSync } from 'react-dom';
import { UNSAFE_createBrowserHistory as createBrowserHistory } from 'react-router';
import { isTnPath, stripBase } from './base.js';
import { flyBack, rememberBox } from './cardFlight.js';
import { $, flag } from './dom.js';
import { calm } from './motion.js';
import { isHomePath, sameHome, slugOf } from './routes.js';

// A drop-in replacement for React Router's browser history (main.jsx; inside AQ's website, its App.tsx) that animates
// every page change within the magazine: links, navigate(), and the browser's Back/Forward. Inside AQ, changes that
// don't stay within /terranotes (AQ to the magazine, back out, AQ to AQ) pass straight through untouched.
// - A card is involved (opening an article from its card, or returning home from an article): that card's flight IS
//   the transition (cardFlight.js); the pages swap instantly. Adding a crossfade too played it twice (Safari
//   snapshots the new page before the flight starts).
// - Anything else: a short view-transition crossfade (styles/motion.css, html[data-tn-nav]), header held still.
// - No animation between one home page's sections (/ and /photos), with reduced motion, in a hidden tab, or without
//   view-transition support.
// Paths below are the magazine's own (lib/base.js strips AQ's /terranotes); the real ones are used to find links.
const pathOf = (to) => (typeof to === 'string' ? new URL(to, location.href).pathname : to.pathname || location.pathname);

let seq = 0;
function swap(realFrom, realTo, update, backwards = false) {
  if (!isTnPath(realFrom) || !isTnPath(realTo)) { update(); return; }
  const from = stripBase(realFrom), to = stripBase(realTo);
  // (also none when an article's other address redirects to it, e.g. /sep26/articles/labs → /articles/labs)
  if (!document.startViewTransition || calm() || from === to || sameHome(from, to) || (slugOf(from) && slugOf(from) === slugOf(to)) || document.visibilityState !== 'visible') {
    update();
    return;
  }
  const kind = isHomePath(to) ? 'back' : slugOf(to) ? (slugOf(from) ? (backwards ? 'prev' : 'next') : 'into') : 'page';
  const cover = kind === 'back' && slugOf(from) && $('.hero-drop img')?.getBoundingClientRect();
  // a card whose article has its own page (data-flight="off", e.g. AQ Labs: no cover to land) crossfades instead
  const link = (kind === 'into' || kind === 'next') && $(`a[href="${realTo}"]:not([data-flight="off"])`);
  const box = link && link.getBoundingClientRect();
  const flies = !!(box && box.width && box.bottom > 0 && box.top < innerHeight);
  if (flies) rememberBox(box);
  if (flies || cover) {
    flushSync(update); // rendered now, so the card on the new page can be found and measured
    const card = cover && $(`a[href="${realFrom}"]`);
    if (card) flyBack(card, cover);
    return;
  }
  const id = ++seq;
  flag('tnNav', kind);
  document.startViewTransition(() => { flushSync(update); }).finished.finally(() => { if (id === seq) flag('tnNav', null); });
}

export function createAnimatedHistory() {
  const h = createBrowserHistory({ v5Compat: true });
  let shown = h.location.pathname; // the page on screen
  const idx = () => window.history.state?.idx ?? 0; // position in the tab's history (tells Back from Forward)
  let shownIdx = idx();
  let direct = false; // inside our own push/replace, whose listener call must run synchronously
  const shownListeners = new Set(); // a history takes ONE listener (the router's): anything else that wants to know goes here
  const go = (method) => (to, state) => swap(shown, pathOf(to), () => {
    direct = true;
    try { h[method](to, state); } finally { direct = false; }
  });
  return {
    get action() { return h.action; },
    get location() { return h.location; },
    createHref: (to) => h.createHref(to),
    createURL: (to) => h.createURL(to),
    encodeLocation: (to) => h.encodeLocation(to),
    go: (n) => h.go(n),
    push: go('push'),
    replace: go('replace'),
    // runs each time a new page has been put on screen (after the router has taken it), with its real pathname
    onShown: (fn) => { shownListeners.add(fn); return () => shownListeners.delete(fn); },
    listen: (fn) => h.listen((update) => {
      const from = shown, backwards = idx() < shownIdx;
      const apply = () => { shown = update.location.pathname; shownIdx = idx(); fn(update); shownListeners.forEach((l) => l(shown)); };
      if (direct) apply();
      else swap(from, update.location.pathname, apply, backwards);
    }),
  };
}
