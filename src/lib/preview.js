// Preview switches: a new design that isn't live yet shows only to people who open the site with its switch in the
// address, so the team can look at it on the real site first. Remembered for the tab (sessionStorage), like ?aq.
//   ?pandal=1   October's "pandal hopping" home page and the curtain that opens its articles (src/editions/oct26/pandal/)
//   ?pandal=0   back to the live design
// Going live: set LIVE.pandal to true (the switch then does nothing).
const LIVE = { pandal: true }; // pandal: live for everyone since 6 Oct 2026

function on(name) {
  if (LIVE[name]) return true;
  try {
    const q = new URLSearchParams(location.search).get(name);
    if (q != null) sessionStorage.setItem(`tn-${name}`, q === '0' ? '0' : '1');
    return sessionStorage.getItem(`tn-${name}`) === '1';
  } catch { return false; }
}
export const PANDAL = typeof window !== 'undefined' && on('pandal');
