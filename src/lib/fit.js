import { useLayoutEffect, useRef } from 'react';

// How short a card's cover may get to make room for a long title (the rest comes out of the title's size).
export const coverFloor = (height) => `${Math.round(parseFloat(height) * 0.6)}px`;

// Long titles. Shrinks a heading's font size (px, from `max` down to `min`) until
//   - everything in its card fits: the heading's parent box (a flex column of a fixed height) doesn't overflow, or,
//   - with `lines`, it wraps to at most that many lines.
// If a card still overflows at `min`, the dek (the paragraph under the heading) is cut short, a line at a time.
// It's measured on the device, so it holds however that browser draws the fonts, and it measures again once the
// web fonts have loaded, or when the title changes. Returns the ref for the heading.
export function useFitTitle(title, max, min, lines) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const t = ref.current;
    if (!t) return undefined;
    const fits = () => {
      if (lines) return t.offsetHeight <= lines * parseFloat(getComputedStyle(t).lineHeight) + 1;
      const box = t.parentElement, cs = getComputedStyle(box);
      const kids = [...box.children].filter((k) => getComputedStyle(k).position !== 'absolute');
      const first = kids[0], last = kids[kids.length - 1];
      const used = last.offsetTop + last.offsetHeight - first.offsetTop;
      return used <= box.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    };
    const size = (px) => { if (t.style.fontSize !== `${px}px`) t.style.fontSize = `${px}px`; }; // unchanged = no new layout
    const dek = !lines && t.nextElementSibling?.tagName === 'P' ? t.nextElementSibling : null;
    const clamp = (n) => {
      for (const [k, v] of [['display', '-webkit-box'], ['-webkit-box-orient', 'vertical'], ['-webkit-line-clamp', String(n)], ['overflow', 'hidden']]) {
        if (n) dek.style.setProperty(k, v); else dek.style.removeProperty(k);
      }
    };
    const fit = () => {
      if (!t.isConnected) return;
      if (dek && dek.style.display) clamp(0);
      size(max);
      if (fits()) return;
      size(min);
      if (!fits()) { // too long even at the smallest size: it stays there, and the dek gives up lines
        if (dek) for (let n = Math.round(dek.offsetHeight / parseFloat(getComputedStyle(dek).lineHeight)) - 1; n >= 1 && !fits(); n--) clamp(n);
        return;
      }
      let lo = min, hi = max; // fits at lo, not at hi
      while (hi - lo > 0.5) {
        const mid = (lo + hi) / 2;
        size(mid);
        if (fits()) lo = mid; else hi = mid;
      }
      size(Math.floor(lo * 2) / 2);
    };
    fit();
    // fonts arriving: measure again before the next frame (once, however many arrive together)
    let queued = 0;
    const again = () => { if (!queued) queued = requestAnimationFrame(() => { queued = 0; fit(); }); };
    const fonts = document.fonts;
    if (fonts) {
      if (fonts.status === 'loading') fonts.ready.then(again); // measured with stand-in fonts: again with the real ones
      fonts.addEventListener?.('loadingdone', again);
    }
    return () => { cancelAnimationFrame(queued); queued = -1; fonts?.removeEventListener?.('loadingdone', again); };
  }, [title, max, min, lines]);
  return ref;
}
