// The six write-ups. Order = the numbering (01–06) and the "next on the line" chain (06 loops back to 01).
// `color` is the article's colour (tag, clips, drop cap, pull-quote shadow, menu edge); `ink` is the text on it.
// Bracketed copy is placeholder text from the design, waiting for the real piece.

const OPENING =
  '[Opening paragraph. Set the scene: where you were, what time it was, what it felt like. Two or three sentences that pull the reader straight in before any explanation.]';
const SECOND =
  '[Second paragraph. Why this matters, and why you kept going back. Keep it plain and specific — a detail only someone who was there would notice.]';

export const articles = [
  {
    num: '01',
    slug: 'the-last-of-the-wetlands',
    title: 'The last of the wetlands',
    dek: "two dawns counting what's left of the city's marshes",
    tag: 'Field notes',
    color: '#F0442B',
    ink: '#FFFFFF',
    photo: 'wetlands',
    opening:
      '[Opening paragraph. Set the scene: where you were, what time it was, what the air felt like. Two or three sentences that pull the reader straight into the wetland before any explanation.]',
    second:
      '[Second paragraph. Why this place matters, and why you went back twice. Keep it plain and specific — a detail only someone who was there would notice.]',
    visits: '2 mornings',
    kit: '1 flask of tea',
  },
  {
    num: '02',
    slug: 'what-the-river-remembers',
    title: 'What the river remembers',
    dek: "we tested the river with a borrowed meter. here's what it said.",
    tag: 'Reportage',
    color: '#3DA5F4',
    ink: '#111111',
    photo: 'the river',
    opening: OPENING,
    second: SECOND,
    visits: '[x]',
    kit: '[what you carried]',
  },
  {
    num: '03',
    slug: 'six-months-of-compost',
    title: 'Six months of compost',
    dek: 'one terrace bin, six months, a lot of trial and error',
    tag: 'Logbook',
    color: '#1E7A4C',
    ink: '#FFFFFF',
    photo: 'compost',
    opening: OPENING,
    second: SECOND,
    visits: '[x]',
    kit: '[what you carried]',
  },
  {
    num: '04',
    slug: 'a-history-of-the-plastic-chair',
    title: 'A history of the plastic chair',
    dek: 'eleven chairs on one street, and what they say about the city',
    tag: 'Object study',
    color: '#7B5CE6',
    ink: '#FFFFFF',
    photo: 'plastic chair',
    opening: OPENING,
    second: SECOND,
    visits: '[x]',
    kit: '[what you carried]',
  },
  {
    num: '05',
    slug: 'kolkata-at-41-degrees',
    title: 'Kolkata at 41 degrees',
    dek: "a heatwave bus ride, stop by stop: who gets shade, who doesn't",
    tag: 'Dispatch',
    color: '#F7C21A',
    ink: '#111111',
    photo: '41 degrees',
    opening: OPENING,
    second: SECOND,
    visits: '[x]',
    kit: '[what you carried]',
  },
  {
    num: '06',
    slug: 'who-owns-the-roof',
    title: 'Who owns the roof?',
    dek: 'we asked eleven buildings for their roofs. two said yes.',
    tag: 'Essay',
    color: '#EE4E8A',
    ink: '#111111',
    photo: 'the roof',
    opening: OPENING,
    second: SECOND,
    visits: '[x]',
    kit: '[what you carried]',
  },
];
