import { useEffect, useState } from 'react';

// Buddy the ghost. Once called (the hidden "Call buddy?" button on the web home page, or "click me" in the phone
// menu) he stays for the rest of the visit (sessionStorage). Tapping him offers two little games (Games.jsx).
const KEY = 'aq-buddy';
export const buddyHere = () => { try { return sessionStorage.getItem(KEY) === '1'; } catch { return false; } };
export function callBuddy() {
  try { sessionStorage.setItem(KEY, '1'); } catch { /* private mode: he stays for this page only */ }
  dispatchEvent(new Event('aq-buddy'));
}
// { here: he's been called, fresh: he was called just now (so he makes an entrance) }
export function useBuddy() {
  const [here, setHere] = useState(buddyHere);
  const [fresh, setFresh] = useState(false);
  useEffect(() => {
    const on = () => { setHere(true); setFresh(true); };
    addEventListener('aq-buddy', on);
    return () => removeEventListener('aq-buddy', on);
  }, []);
  return { here, fresh };
}
export const openGames = (game) => dispatchEvent(new CustomEvent('aq-games', { detail: game }));
