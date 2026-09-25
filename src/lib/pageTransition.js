import { flushSync } from 'react-dom';
import { UNSAFE_createBrowserHistory as createBrowserHistory } from 'react-router';

// Page-to-page motion. Every navigation (links, navigate(), the browser's Back/Forward) goes through this history,
// which wraps the page swap in a view transition: the old page is snapshotted, the new one rendered, and the CSS in
// styles/motion.css (::view-transition-*) animates between them. The header stays put (it's its own layer), and on
// the way back to the home page an article's cover flies back onto its card.
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

let seq = 0;
function swap(from, to, update, backwards = false) {
  const root = document.documentElement;
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // no animation within the home page (section links glide instead), or when nothing changes page
  if (!document.startViewTransition || calm || from === to || (HOME.test(from) && HOME.test(to)) || document.visibilityState !== 'visible') {
    update();
    return;
  }
  const kind = kindOf(from, to, backwards), id = ++seq, named = [];
  const name = (el) => { if (el) { el.style.viewTransitionName = 'cover'; named.push(el); } };
  // coming back from an article: its cover is the one thing that travels, onto the card it was opened from
  const slug = kind === 'back' && slugOf(from);
  if (slug) name(document.querySelector('.hero-drop img'));
  root.dataset.nav = kind;
  const t = document.startViewTransition(() => {
    flushSync(update);
    if (slug && named.length) name(document.querySelector(`a[href="/articles/${slug}"] img`));
  });
  t.finished.finally(() => {
    named.forEach((el) => { el.style.viewTransitionName = ''; });
    if (id === seq) delete root.dataset.nav;
  });
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
