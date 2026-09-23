import { useEffect, useState } from 'react';

// 900px and up (CSS px) gets the web layout; phones are pinned to 390px by the viewport tag in index.html.
const WEB = '(min-width: 900px)';
const DESIGN_WIDTH = 1440;

export function useIsWeb() {
  const [web, setWeb] = useState(() => matchMedia(WEB).matches);
  useEffect(() => {
    const m = matchMedia(WEB);
    const on = () => setWeb(m.matches);
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, []);
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.layout = web ? 'web' : 'phone';
    if (!web) return;
    // the web layout is drawn at 1440px; narrower windows get it scaled down to fit.
    // body, not <html>: with scrollbar-gutter the root's clientWidth still counts the scrollbar's strip
    const fit = () => root.style.setProperty('--web-zoom', String(Math.min(1, document.body.clientWidth / DESIGN_WIDTH)));
    fit();
    addEventListener('resize', fit);
    return () => { removeEventListener('resize', fit); root.style.removeProperty('--web-zoom'); };
  }, [web]);
  return web;
}

// Scale factor the web layout is drawn at (1 at 1440px+).
export const webZoom = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--web-zoom')) || 1;
