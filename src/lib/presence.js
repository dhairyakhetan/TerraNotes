import { useEffect, useRef, useState } from 'react';

const still = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

// Keeps a popup on screen for `ms` after it's closed, so it can play its closing animation.
// value: what's open (a number, an id… null/undefined = closed).
// Returns [what to show, leaving]: the last open value while it animates out, then null.
export function usePresence(value, ms = 180) {
  const kept = useRef(value);
  const [, rerender] = useState(0);
  if (value != null) kept.current = value;
  const leaving = value == null && kept.current != null;
  useEffect(() => {
    if (!leaving) return;
    const t = setTimeout(() => { kept.current = null; rerender((n) => n + 1); }, still() ? 0 : ms);
    return () => clearTimeout(t);
  }, [leaving, value, ms]);
  return [value != null ? value : kept.current, leaving];
}
