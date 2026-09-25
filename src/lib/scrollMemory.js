import { useEffect, useLayoutEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router';
import { calm } from './motion.js';
import { SECTIONS, isHomePath, noteFrom } from './routes.js';

// Scroll handling for every navigation. <ScrollMemory /> renders nothing; App.jsx places it BEFORE the routes so its
// layout effect runs before the new page's (the article page measures its cover for the card flight after this scroll).
// - Back/Forward and reload land where you were (positions saved per history entry, for the tab's session);
// - a new page starts at the top, or at its section (/photos → the element with id="photos", also old-style #hash);
// - a section link while already on the home page glides there instead of jumping;
// - ?by=<writer> also rewinds the web's sideways article line, since that writer's pieces now come first.
const KEY = 'aq-scroll';
const saved = (() => { try { return JSON.parse(sessionStorage.getItem(KEY)) || {}; } catch { return {}; } })();
const persist = () => { try { sessionStorage.setItem(KEY, JSON.stringify(saved)); } catch { /* private mode */ } };
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
let current = null; // the history entry whose scroll position is being recorded
let lastPath = null;

export function ScrollMemory() {
  const { pathname, hash, key, search } = useLocation();
  const type = useNavigationType();
  useLayoutEffect(() => {
    current = null; // stop recording the page being left before anything scrolls
    persist();
    const behavior = type === 'PUSH' && isHomePath(lastPath || '') && isHomePath(pathname) && !calm() ? 'smooth' : 'auto';
    if (type === 'PUSH') noteFrom(key, lastPath);
    lastPath = pathname;
    const spot = `${key}:${pathname}`; // a fresh load's key is always "default", so the path is part of it
    if (type === 'POP' && saved[spot] != null) window.scrollTo(0, saved[spot]);
    else {
      const id = SECTIONS.find((s) => pathname === `/${s}`) || (hash && decodeURIComponent(hash.slice(1)));
      const target = id && document.getElementById(id);
      if (target) target.scrollIntoView({ behavior });
      else window.scrollTo({ top: 0, behavior });
    }
    if (type === 'PUSH' && new URLSearchParams(search).get('by')) {
      requestAnimationFrame(() => document.querySelector('.art-scroller')?.scrollTo({ left: 0, behavior }));
    }
    current = spot;
  }, [pathname, hash, key]);
  useEffect(() => {
    const remember = () => { if (current != null) saved[current] = Math.round(scrollY); };
    addEventListener('scroll', remember, { passive: true });
    addEventListener('pagehide', persist);
    return () => { removeEventListener('scroll', remember); removeEventListener('pagehide', persist); };
  }, []);
  return null;
}
