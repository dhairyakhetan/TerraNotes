import { useEffect, useState } from 'react';
import { pageZoom } from './layoutMode.js';

// Writing on ruled paper (September 2026's notebook pages: src/editions/sep26/look.css draws the ruling, and
// sep26/ruled.js holds its numbers). `rule` = { start, gap }: the first ruling tile starts `start` px down the
// .page-sheet and there is a line every `gap` px (the last pixel of each tile). This is the fit the diary uses
// (sep26/Diary.jsx): the shift that puts a baseline 2px above its nearest ruled line.
export const ruledShift = (y, { start, gap }) => {
  const line = start - 1 + Math.round((y + 2 - (start - 1)) / gap) * gap;
  return Math.round(line - 2 - y);
};

// The shifts (px, by name) that put the first baseline of each block on a ruled line. `probes` is a ref to
// { name: element }: a 0-high inline box at the start of the block, which sits on its baseline; the block is the
// probe's positioned parent. A baseline is measured against its own block, and the block's top on the sheet is
// `base + tops[name]` (base: where the section starts on the sheet; tops: each block's own `top`, unshifted). So the
// shift a block already has, and the section's rise-in (lib/reveal.js), can't throw the measure off, and measuring
// again changes nothing. Measured again when the fonts arrive and when `key` changes (the layout). No `rule` (any
// other edition): nothing to do.
export function useRuleSnap(rule, base, tops, probes, key) {
  const [shifts, setShifts] = useState({});
  useEffect(() => {
    if (!rule) return undefined;
    let gone = false;
    const fit = () => {
      if (gone) return;
      const z = pageZoom(), next = {};
      for (const [name, el] of Object.entries(probes.current)) {
        const block = el?.offsetParent;
        if (block) next[name] = ruledShift(base + tops[name] + (el.getBoundingClientRect().top - block.getBoundingClientRect().top) / z, rule);
      }
      setShifts(next);
    };
    fit(); document.fonts?.ready.then(fit);
    return () => { gone = true; };
  }, [key]);
  return shifts;
}
