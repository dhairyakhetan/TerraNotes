import { flushSync } from 'react-dom';
import { UNSAFE_createBrowserHistory as createBrowserHistory } from 'react-router';
import { webZoom } from './layout.js';

// Page-to-page motion. Every navigation (links, navigate(), the browser's Back/Forward) goes through this history,
// which wraps the page swap in a view transition: the old page is snapshotted, the new one rendered, and the CSS in
// styles/motion.css (::view-transition-*) animates between them. The header stays put (it's its own layer), and on
// the way back to the home page the article's card flies from where the cover was back into its slot: the same
// transform-only move as the way in (lib/fly.js), so it stays smooth on phones.
// Browsers without view transitions (or with reduced motion) just swap pages as before.

const HOME = /^\/(articles|photos|words|members)?\/?$/; // the home page, under any of its section addresses
const slugOf = (p) => (p.match(/^\/articles\/([^/]+)/) || [])[1];
const pathOf = (to) => (typeof to === 'string' ? new URL(to, location.href).pathname : to.pathname || location.pathname);

// into = opening an article, next / prev = article to article (prev: going back along the line),
// back = returning home, page = anything else
const kindOf = (from, to, backwards) => {
  if (HOME.test(to)) return 'back';
  if (slugOf(to)) return slugOf(from) ? (backwards ? 'prev' : 'next') : 'into';
  return 'page';
};

// The card, from the cover's box back into place: starts cover-sized where the cover was, lifts, and settles.
const flyBack = (card, from) => {
  const r = card.getBoundingClientRect();
  if (!r.width || r.bottom < 0 || r.top > innerHeight) return; // not on screen: nothing to see
  const z = webZoom(), s = from.width / r.width, dx = (from.left - r.left) / z, dy = (from.top - r.top) / z;
  const base = getComputedStyle(card).transform, rest = base === 'none' ? '' : ` ${base}`;
  const was = { origin: card.style.transformOrigin, z: card.style.zIndex };
  card.style.transformOrigin = '0 0';
  card.style.zIndex = '30';
  const an = card.animate([
    { transform: `translate(${dx}px, ${dy}px) scale(${s})${rest}`, easing: 'cubic-bezier(0.32, 0.72, 0, 1)' },
    { transform: `translate(0px, -18px) scale(1) rotate(-2deg)${rest}`, offset: 0.62, easing: 'cubic-bezier(0.5, 0, 0.5, 1)' },
    { transform: `translate(0px, 3px) rotate(0.8deg)${rest}`, offset: 0.84, easing: 'ease-in-out' },
    { transform: `translate(0px, 0px)${rest}` },
  ], { duration: 720 });
  an.onfinish = an.oncancel = () => { card.style.transformOrigin = was.origin; card.style.zIndex = was.z; };
};
const settle = (ms) => new Promise((ok) => setTimeout(ok, ms));

let seq = 0;
function swap(from, to, update, backwards = false) {
  const root = document.documentElement;
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // no animation within the home page (section links glide instead), or when nothing changes page
  if (!document.startViewTransition || calm || from === to || (HOME.test(from) && HOME.test(to)) || document.visibilityState !== 'visible') {
    update();
    return;
  }
  const kind = kindOf(from, to, backwards), id = ++seq;
  // coming back from an article: where its cover is now, so its card can fly back from there
  const slug = kind === 'back' && slugOf(from);
  const cover = slug && document.querySelector('.hero-drop img')?.getBoundingClientRect();
  root.dataset.nav = kind;
  const t = document.startViewTransition(async () => {
    flushSync(update);
    const card = cover && document.querySelector(`a[href="/articles/${slug}"]`);
    if (!card) return;
    const img = card.querySelector('img');
    if (img && !img.complete) await Promise.race([img.decode().catch(() => {}), settle(250)]); // no blank card mid-flight
    flyBack(card, cover);
  });
  t.finished.finally(() => { if (id === seq) delete root.dataset.nav; });
}

// A browser history (same as React Router's own) whose page changes are animated.
export function createAnimatedHistory() {
  const h = createBrowserHistory({ v5Compat: true });
  let shown = h.location.pathname; // the page on screen
  const idx = () => window.history.state?.idx ?? 0; // where we are in the tab's history
  let shownIdx = idx();
  let direct = false; // inside our own push/replace: the listener runs right away
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
    listen(fn) {
      return h.listen((update) => {
        const from = shown, backwards = idx() < shownIdx;
        const apply = () => { shown = update.location.pathname; shownIdx = idx(); fn(update); };
        if (direct) apply();
        else swap(from, update.location.pathname, apply, backwards); // Back / Forward
      });
    },
  };
}
