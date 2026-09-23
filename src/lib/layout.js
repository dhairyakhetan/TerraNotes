import { useEffect, useState } from 'react';

// 900px and up (CSS px) gets the web layout; phones are pinned to 390px by the viewport tag in index.html.
const WEB = '(min-width: 900px)';
const DESIGN_WIDTH = 1440;

// Marks <html> with the layout and, on web, the scale (--web-zoom) the 1440px page is drawn at.
// body, not <html>: with scrollbar-gutter the root's clientWidth still counts the scrollbar's strip
const fit = () => document.documentElement.style.setProperty('--web-zoom', String(Math.min(1, document.body.clientWidth / DESIGN_WIDTH)));
const apply = (web) => {
  const root = document.documentElement;
  root.dataset.layout = web ? 'web' : 'phone';
  if (web) fit(); else root.style.removeProperty('--web-zoom');
};

export function useIsWeb() {
  // applied straight away, so the first jump to a section (/members…) already has the right header offset
  const [web, setWeb] = useState(() => { const w = matchMedia(WEB).matches; apply(w); return w; });
  useEffect(() => {
    const m = matchMedia(WEB);
    const on = () => { apply(m.matches); setWeb(m.matches); };
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, []);
  useEffect(() => {
    if (!web) return;
    addEventListener('resize', fit);
    return () => removeEventListener('resize', fit);
  }, [web]);
  return web;
}

// Scale factor the web layout is drawn at (1 at 1440px+).
export const webZoom = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--web-zoom')) || 1;
