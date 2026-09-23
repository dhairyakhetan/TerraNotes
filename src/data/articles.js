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
//     { quote: 'The line.', by: 'who said it' }            pull quote
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
    author: 'Ananya',
    date: '19 Jul 2026',
    readTime: '6',
    body: [
      'The first morning we got there before the birds did. The marsh was a sheet of grey, and the only sound was a pump somewhere behind the reeds, working as if it had somewhere to be.',
      'We went back twice because the first visit felt like a guess. A place changes with the light, and we wanted to count what was there, not what we hoped was there.',
      { log: [['PLACE', 'wetland edge, east'], ['VISITS', '2 mornings'], ['DATES', '12 & 19 July'], ['KIT', '1 flask of tea']] },
      "On the second dawn a man cutting grass for his cows walked us along the edge. He pointed at the places where water used to stand in the dry season and now doesn't.",
      { quote: 'Nobody fills in a marsh all at once. They do it one truck at a time.', by: 'a grass-cutter, on the second morning' },
      'Most of what we saw was ordinary: egrets, water hyacinth, plastic caught in the roots. It is the ordinary that disappears first, because nobody writes it down.',
      { photo: '', caption: 'the eastern edge, just after sunrise' },
      "By the time the tea in the flask went cold we had a list, a few photos and a map covered in pencil. It isn't science. It's a record, and a record is a start.",
      { h2: 'What we counted' },
      "We'll go back next season with the same list. If it gets shorter, at least we'll know by how much.",
      { photos: [{ photo: '', caption: 'egrets, counted twice' }, { photo: '', caption: 'the pump behind the reeds' }] },
    ],
  },
  {
    slug: 'what-the-river-remembers',
    title: 'What the river remembers',
    dek: "we tested the river with a borrowed meter. here's what it said.",
    tag: 'Reportage',
    cover: '',
    alt: 'the river',
    author: 'Rehan',
    date: '9 Aug 2026',
    readTime: '5',
    body: [
      'We borrowed a water-quality meter from a friend of a friend, then borrowed it again when the batteries died halfway through the first day.',
      'The plan was simple: walk the riverbank, stop wherever people actually use the water, and take a reading. Bathing ghats, washing steps, a pipe nobody would explain.',
      { log: [['PLACE', 'the ghats, north to south'], ['STOPS', '9'], ['KIT', '1 borrowed meter']] },
      "The numbers moved in ways we didn't expect. Cleaner near a busy ghat, worse by a quiet wall where a drain came in unannounced.",
      { quote: "The river doesn't forget what you put in it. It just carries it somewhere else.", by: 'a boatman, near the third stop' },
      'We are not scientists, and a borrowed meter is not a lab. But the pattern was clear enough to be worth writing down and checking again.',
      { photo: '', caption: 'testing at the washing steps' },
      'The people we met knew most of it already. They could tell you which step to avoid and which day the water smells different.',
      { h2: 'The readings' },
      "What they didn't have was the numbers. Now there are some, rough as they are, and we're sharing all of them.",
      { photos: [{ photo: '', caption: 'reading no. 4, the washing steps' }, { photo: '', caption: 'the drain nobody explained' }] },
    ],
  },
  {
    slug: 'six-months-of-compost',
    title: 'Six months of compost',
    dek: 'one terrace bin, six months, a lot of trial and error',
    tag: 'Logbook',
    cover: '',
    alt: 'compost',
    author: 'Nishtha',
    date: '30 Aug 2026',
    readTime: '7',
    body: [
      'It started with a bin, a bag of dry leaves and a lot of confidence. The confidence lasted about three weeks.',
      'Week three smelled like a mistake. Too wet, not enough air, and a neighbour who started closing her window when we came up the stairs.',
      { log: [['PLACE', 'our terrace'], ['DURATION', '6 months'], ['KIT', '1 bin, 1 stick']] },
      'So we kept a log. What went in, how it looked, how it smelled, and what we changed. Most changes were small: more leaves, a daily turn, a lid with holes.',
      { quote: 'Compost is mostly patience with a bad smell in the middle.', by: 'our logbook, month two' },
      'By month three it smelled like soil after rain. By month five there was something dark and crumbly at the bottom that we were ridiculously proud of.',
      { photo: '', caption: 'the bin, month five' },
      'The terrace plants got the first batch. The neighbour got the second, which is how she started opening her window again.',
      { h2: 'Month by month' },
      'The whole log is below, including the bad weeks. Especially the bad weeks.',
      { photos: [{ photo: '', caption: 'week three, the bad week' }, { photo: '', caption: 'month five, the good stuff' }] },
    ],
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

// Web home only: empty pegs after the real articles, so the line has something to scroll. One peg per line.
export const COMING_SOON = [
  "this peg's saving a spot for the next one",
  'still drying. check back soon.',
  'out in the field, back with notes',
  'the next story is still in the wash',
  "reserved for something we haven't seen yet",
  'more on the line soon. pinky promise.',
];
