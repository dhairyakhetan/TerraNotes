import { flushSync } from 'react-dom';
import { UNSAFE_createBrowserHistory as createBrowserHistory } from 'react-router';
import { webZoom } from './layout.js';
import { rememberBox } from './fly.js';

// Page-to-page motion. Every navigation (links, navigate(), the browser's Back/Forward) goes through this history,
// which animates the page swap: when a card is involved, the card itself flies (into an article the cover flies out of
// the tapped card, lib/fly.js; back home the card flies from where the cover was into its slot) and the pages swap at
// once; otherwise a short view-transition crossfade (styles/motion.css, ::view-transition-*), header held still.
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

// The card, from the cover's box back into place: starts cover-sized where the cover was and settles straight in.
const flyBack = (card, from) => {
  const r = card.getBoundingClientRect();
  if (!r.width || r.bottom < 0 || r.top > innerHeight) return; // not on screen: nothing to see
  const z = webZoom(), s = from.width / r.width, dx = (from.left - r.left) / z, dy = (from.top - r.top) / z;
  const base = getComputedStyle(card).transform, rest = base === 'none' ? '' : ` ${base}`;
  const was = { origin: card.style.transformOrigin, z: card.style.zIndex };
  card.style.transformOrigin = '0 0';
  card.style.zIndex = '30';
  const an = card.animate([
    { transform: `translate(${dx}px, ${dy}px) scale(${s})${rest}`, easing: 'cubic-bezier(0.25, 0.8, 0.3, 1)' },
    { transform: `translate(0px, 3px) rotate(0.8deg)${rest}`, offset: 0.8, easing: 'ease-in-out' },
    { transform: `translate(0px, 0px)${rest}` },
  ], { duration: 620 });
  an.onfinish = an.oncancel = () => { card.style.transformOrigin = was.origin; card.style.zIndex = was.z; };
};

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
  // opening an article from its card: note the card's box so the article's cover can fly out of it
  const link = (kind === 'into' || kind === 'next') && document.querySelector(`a[href="/articles/${slugOf(to)}"]`);
  const box = link && link.getBoundingClientRect();
  const flies = !!(box && box.width && box.bottom > 0 && box.top < innerHeight);
  if (flies) rememberBox(box);
  // When a card flies (into an article, or back onto home), that flight IS the transition: swap the pages at once
  // and let it play. Crossfading as well played it twice (Safari snapshots the new page before the flight starts,
  // so the finished page faded in and then the cover jumped back to the card and flew again).
  if (flies || cover) {
    flushSync(update); // rendered right now, so the card can be found and measured
    const card = cover && document.querySelector(`a[href="/articles/${slug}"]`);
    if (card) flyBack(card, cover);
    return;
  }
  root.dataset.nav = kind;
  const t = document.startViewTransition(() => { flushSync(update); });
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
