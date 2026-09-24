import { useEffect, useState } from 'react';

// Buddy stays while you're on the site (moving between pages) and is gone after a reload or a new visit:
// kept in memory only, never stored.
let called = false;
export const buddyHere = () => called;
export function callBuddy() {
  called = true;
  dispatchEvent(new Event('aq-buddy'));
}
export function useBuddy() { // { here, fresh }: fresh = he was called while this component was on screen
  const [here, setHere] = useState(buddyHere); const [fresh, setFresh] = useState(false);
  useEffect(() => { const on = () => { setHere(true); setFresh(true); }; addEventListener('aq-buddy', on); return () => removeEventListener('aq-buddy', on); }, []);
  return { here, fresh };
}
export const openGames = (game) => dispatchEvent(new CustomEvent('aq-games', { detail: game }));
