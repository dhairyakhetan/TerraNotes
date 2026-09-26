// The AQ Labs gallery's teams (the "labs" article's own page, src/articles/labs/), in chapter order.
//   id:    the chapter's address, /articles/labs/<id> (its element id on the page; photos: public/editions/<edition>/
//          articles/labs/<id>/). data/articles.js lists them as the article's chapters.
//   label: on its tab and folder; a long one folds onto two lines on the folder, at the |
//   c:     its accent (a colour name from src/articles/labs/labs.css: tomato, sky, pink, mint, lemon, grape)
//   glyph, cat: the folder's symbol and category
export const LABS_TEAMS = [
  { id: 'karyaarth', label: 'karyaarth', c: 'tomato', glyph: '★', cat: 'documentary' },
  { id: 'career-compass', label: 'career|compass', c: 'sky', glyph: '◆', cat: 'career data' },
  { id: 'quirk', label: 'quirk', c: 'pink', glyph: '✦', cat: 'hardware' },
  { id: 'wisdom-woods', label: 'wisdom| woods', c: 'mint', glyph: '♥', cat: 'ed-game' },
  { id: 'cirqle', label: 'cirqle| rentals', c: 'lemon', glyph: '◆', cat: 'rentals' },
  { id: 'hunar', label: 'hunar', c: 'grape', glyph: '★', cat: 'placement' },
  { id: 'photon', label: 'photon', c: 'sky', glyph: '✦', cat: 'wearable' },
  { id: 'human-manual', label: 'human| manual', c: 'pink', glyph: '♠', cat: 'card game' },
];
