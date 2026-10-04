// Buddy's mini games (shared/buddy/BuddyGames.jsx), the same in every edition: what the games card (shared/GameCard.jsx)
// says about each, and what its own address shows in a link preview. Each game has an address that opens it on the home
// page: /games/<id> (/games opens the first); build/siteFiles.js writes their pages and tools/make-link-previews.mjs
// their pictures (public/og/game-<id>.jpg, games.jpg).
//   id     the game's key (the popup's tabs, the address)          name   its tab label
//   title  the games card's heading                                line   its one-line how-to
//   about  a sentence for link previews and search results
export const GAMES = [
  { id: 'snake', name: 'Snake', title: 'Snake, but spooky', line: 'eat the stars. don’t eat yourself.', about: 'Snake with a ghost: eat the stars, don’t eat yourself. A mini game in TerraNotes, Aquaterra’s monthly magazine.' },
  { id: 'float', name: 'Float', title: 'Float, little ghost', line: 'tap to rise. mind the posts.', about: 'Tap to float Buddy the ghost between the posts. A mini game in TerraNotes, Aquaterra’s monthly magazine.' },
  { id: 'fling', name: 'Fling', title: 'Fling, little ghost', line: 'pull back. let go. knock ’em down.', about: 'Fling Buddy at the gremlins’ forts, Angry Birds style: 50 levels. A mini game in TerraNotes, Aquaterra’s monthly magazine.' },
];
export const gameOf = (id) => GAMES.find((g) => g.id === id);
export const gameLink = (id) => (id ? `/games/${id}` : '/games');
