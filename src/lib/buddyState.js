import { useEffect, useState } from 'react';

// Buddy the ghost (shared/buddy/): whether he's been called. Memory only, so he stays while you move between pages
// and is gone after a reload. Components talk through window events: 'aq-buddy' (he arrives), 'aq-games' (open his
// games popup, detail = 'snake' | 'float').
let called = false;
export function callBuddy() {
  called = true;
  dispatchEvent(new Event('aq-buddy'));
}
// → { here, fresh }: fresh = he was called while this component was on screen (so it plays his entrance)
export function useBuddy() {
  const [here, setHere] = useState(called);
  const [fresh, setFresh] = useState(false);
  useEffect(() => { const on = () => { setHere(true); setFresh(true); }; addEventListener('aq-buddy', on); return () => removeEventListener('aq-buddy', on); }, []);
  return { here, fresh };
}
export const openGames = (game) => dispatchEvent(new CustomEvent('aq-games', { detail: game }));

// Buddy's trophy: won by clearing Fling's last level (shared/buddy/Fling.jsx), kept for good on this device
// (localStorage 'aq-buddy-trophy'); he wears it over his head whenever he's called. 'aq-trophy' tells him at once.
const TROPHY = 'aq-buddy-trophy';
const hasTrophy = () => { try { return !!localStorage.getItem(TROPHY); } catch { return false; } };
export function giveTrophy() {
  try { localStorage.setItem(TROPHY, String(Date.now())); } catch { /* private mode: just this visit */ }
  won = true;
  dispatchEvent(new Event('aq-trophy'));
}
let won = typeof window !== 'undefined' && hasTrophy();
export function useTrophy() {
  const [has, setHas] = useState(won);
  useEffect(() => { const on = () => setHas(true); addEventListener('aq-trophy', on); return () => removeEventListener('aq-trophy', on); }, []);
  return has;
}

// Where the last tap / click landed (screen px), so Buddy's games popup can grow out of the button that opened it
// (shared/buddy/BuddyGames.jsx). Recorded before any click handler runs.
export const lastTap = { x: null, y: null };
if (typeof window !== 'undefined') addEventListener('pointerdown', (e) => { lastTap.x = e.clientX; lastTap.y = e.clientY; }, { capture: true, passive: true });
