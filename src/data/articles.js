// Articles, in order: this order sets the numbers (01, 02…) and the "next on the line" chain.
//   slug:     the address, /articles/<slug>
//   tag:      one of the keys in TAGS (sets the colours)
//   cover:    put the picture in public/articles/ and write its path, e.g. '/articles/wetlands.jpg'
//   alt:      a few words describing the cover (also the placeholder label until there is one)
//   author:   a name from src/data/team.js
//   readTime: minutes, e.g. '6'
//   body:     the article, top to bottom. Each item is one block:
//     'Some text.'                                         paragraph (the first one gets the drop cap)
//     { h2: 'Heading' }                                    section heading
//     { quote: 'The line.', by: 'Who said it' }            pull quote
//     { photo: '/articles/x.jpg', caption: '' }            pinned photo
//     { photos: [{ photo, caption }, { photo, caption }] } two small photos
//     { log: [['PLACE', 'Kolkata'], ['VISITS', '3']] }     yellow field log box
// Leave a field '' and the design's placeholder shows instead.

export const TAGS = {
  'Field notes': { color: '#F0442B', ink: '#FFFFFF' },
  Reportage: { color: '#3DA5F4', ink: '#111111' },
  Logbook: { color: '#1E7A4C', ink: '#FFFFFF' },
  'Object study': { color: '#7B5CE6', ink: '#FFFFFF' },
  Dispatch: { color: '#F7C21A', ink: '#111111' },
  Essay: { color: '#EE4E8A', ink: '#111111' },
};

// Placeholder body from the design, until an article is written.
const DRAFT = [
  '[Opening paragraph. Set the scene: where you were, what time it was, what it felt like. Two or three sentences that pull the reader straight in before any explanation.]',
  '[Second paragraph. Why this matters, and why you kept going back. Keep it plain and specific — a detail only someone who was there would notice.]',
  { log: [['PLACE', '[Location]'], ['VISITS', '[x]'], ['DATES', '[Dates]'], ['KIT', '[what you carried]']] },
  '[Third paragraph. The first morning: what you saw, who you met, what surprised you.]',
  '[Fourth paragraph. Let the story turn — something changed, or something was already gone.]',
  { quote: '[A line from the piece worth pulling out.]', by: '[WHO SAID IT]' },
  { photo: '', caption: '' },
  '[Fifth paragraph. The second morning. Pick up where the photo leaves off.]',
  { h2: '[Section heading]' },
  '[Sixth paragraph. What the numbers, the people, or the place itself are saying now.]',
  { photos: [{ photo: '', caption: '' }, { photo: '', caption: '' }] },
  '[Closing paragraph. End on an image, not a summary.]',
];

export const ARTICLES = [
  {
    slug: 'the-last-of-the-wetlands',
    title: 'The last of the wetlands',
    dek: "two dawns counting what's left of the city's marshes",
    tag: 'Field notes',
    cover: '',
    alt: 'wetlands',
    author: '',
    date: '',
    readTime: '',
    body: [
      '[Opening paragraph. Set the scene: where you were, what time it was, what the air felt like. Two or three sentences that pull the reader straight into the wetland before any explanation.]',
      '[Second paragraph. Why this place matters, and why you went back twice. Keep it plain and specific — a detail only someone who was there would notice.]',
      { log: [['PLACE', '[Location]'], ['VISITS', '2 mornings'], ['DATES', '[Dates]'], ['KIT', '1 flask of tea']] },
      ...DRAFT.slice(3),
    ],
  },
  {
    slug: 'what-the-river-remembers',
    title: 'What the river remembers',
    dek: "we tested the river with a borrowed meter. here's what it said.",
    tag: 'Reportage',
    cover: '',
    alt: 'the river',
    author: '',
    date: '',
    readTime: '',
    body: DRAFT,
  },
  {
    slug: 'six-months-of-compost',
    title: 'Six months of compost',
    dek: 'one terrace bin, six months, a lot of trial and error',
    tag: 'Logbook',
    cover: '',
    alt: 'compost',
    author: '',
    date: '',
    readTime: '',
    body: DRAFT,
  },
  {
    slug: 'a-history-of-the-plastic-chair',
    title: 'A history of the plastic chair',
    dek: 'eleven chairs on one street, and what they say about the city',
    tag: 'Object study',
    cover: '',
    alt: 'plastic chair',
    author: '',
    date: '',
    readTime: '',
    body: DRAFT,
  },
  {
    slug: 'kolkata-at-41-degrees',
    title: 'Kolkata at 41 degrees',
    dek: "a heatwave bus ride, stop by stop: who gets shade, who doesn't",
    tag: 'Dispatch',
    cover: '',
    alt: '41 degrees',
    author: '',
    date: '',
    readTime: '',
    body: DRAFT,
  },
  {
    slug: 'who-owns-the-roof',
    title: 'Who owns the roof?',
    dek: 'we asked eleven buildings for their roofs. two said yes.',
    tag: 'Essay',
    cover: '',
    alt: 'the roof',
    author: '',
    date: '',
    readTime: '',
    body: DRAFT,
  },
];
