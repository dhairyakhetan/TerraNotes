// Addresses. The home page also answers at /articles, /photos, /words and /members (opened scrolled to that section).
// Articles: /articles/<slug> (latest edition) or /<edition id>/articles/<slug> (older ones; data/editions.js).
export const SECTIONS = ['articles', 'photos', 'words', 'members'];
export const isHomePath = (p) => /^\/(articles|photos|words|members)?\/?$/.test(p);
export const slugOf = (p) => (p.match(/^(?:\/[a-z]{3}\d{2})?\/articles\/([^/]+)/) || [])[1]; // "/sep26/articles/labs" → "labs"

// Where each page was opened from (history entry key → previous path), noted on every link click by scrollMemory.js.
// shared/BackHome.jsx uses it: opened from home → "back to home" is a real Back (lands on the same scroll spot).
const cameFrom = {};
export const noteFrom = (key, path) => { cameFrom[key] = path; };
export const openedFromHome = (key) => !!cameFrom[key] && isHomePath(cameFrom[key]);
