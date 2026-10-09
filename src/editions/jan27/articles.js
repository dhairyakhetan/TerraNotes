// January 2027's articles, in order (the order sets their numbers, 01, 02…, and the "next on the line" chain), and the
// tags they use (tag colours: color = the tag, ink = text on it). Every field is explained at the top of
// src/data/articles.js. Writers' text is verbatim, typos included. Covers and photos go in
// public/editions/jan27/articles/<slug>/.

// Cloth-binding colours: brick red, ink blue, bottle green, mustard, plum, rose
export const TAGS = {
  'Field notes': { color: '#C0392B', ink: '#FFFFFF' },
  Reportage: { color: '#2D6A8E', ink: '#FFFFFF' },
  Logbook: { color: '#3C8D5A', ink: '#FFFFFF' },
  'Object study': { color: '#6B4C9A', ink: '#FFFFFF' },
  Dispatch: { color: '#F0B429', ink: '#1D2B36' },
  Essay: { color: '#D96C8A', ink: '#1D2B36' },
  Prose: { color: '#4BAA9C', ink: '#1D2B36' },
  'Under Aquaterra': { color: '#F0B429', ink: '#1D2B36' },
};

// Five sample pieces, written to show off the Boi Mela look (from Aquaterra itself: no writer). Swap them for the
// writers' articles.
export const ARTICLES = [
  {
    slug: 'the-book-fair-in-a-day',
    tag: 'Field notes',
    title: 'The Book Fair in a day',
    dek: 'eleven hours, nine hundred stalls and one very sore shoulder',
    cover: '/editions/jan27/articles/the-book-fair-in-a-day/cover.jpg',
    alt: 'crowded aisles of book stalls under bright canvas awnings',
    author: null,
    featured: true,
    date: 'Jan 2027',
    readTime: '4',
    body: [
      'The Kolkata Book Fair is not a shop. It is a small city made of books, put up every winter on a big field in Salt Lake and taken down twelve days later. You need a plan to see it in a day. We had one. It lasted about twenty minutes.',
      { log: [['HOURS', '11'], ['STALLS VISITED', '43'], ['BOOKS BOUGHT', '9'], ['FISH FRY EATEN', '2']] },
      { h2: 'The plan, and what happened to it' },
      'The plan was: the big publishers first, then the little magazines, then food. What happened was: a stall of old atlases near the gate, a poetry reading we stumbled into, a queue for a writer’s autograph that we joined without knowing who the writer was.',
      { quote: 'Nobody comes to the Book Fair for one book. Nobody leaves with one book.', by: 'a man at the bag counter' },
      { checklist: [['a strong cloth bag', true], ['cash for the small stalls', true], ['a list of what you want', true], ['sticking to the list', false]], title: 'The Book Fair bag' },
      { h2: 'Closing time' },
      'At eight the loudspeakers announce that the fair is closing, and nobody moves. Then they announce it again, and the crowd starts drifting to the gates, everyone carrying more than they meant to. Our bag had nine books in it. We had come for two.',
    ],
  },
  {
    slug: 'the-little-magazines',
    tag: 'Reportage',
    title: 'The little magazines',
    dek: 'stapled, photocopied, and the most alive stalls at the fair',
    cover: '/editions/jan27/articles/the-little-magazines/cover.jpg',
    alt: 'piles of thin handmade magazines on a table under a hand-painted sign',
    author: null,
    date: 'Jan 2027',
    readTime: '3',
    body: [
      'In one corner of the fair is a long shed full of tables, and on every table are piles of thin magazines with hand-drawn covers. These are the little magazines, laghu patrika in Bengali: poetry, stories and essays printed by groups of friends who mostly lose money doing it.',
      { h2: 'Who makes them' },
      'We met a retired schoolteacher who has printed the same poetry magazine every year since 1979, two college students with their first issue and a box of stickers, and a group of friends from a small town who take the night train in every January just to sit behind their table.',
      { quote: 'We print three hundred copies. If thirty people read it properly, that is a success.', by: 'an editor, behind a stack of issue 47' },
      { then: [['typed and cyclostyled', 'typed and photocopied'], ['sold at the fair', 'sold at the fair'], ['ten rupees', 'forty rupees'], ['run by friends', 'run by friends']], title: 'What changed, what didn’t' },
      'TerraNotes is, if you think about it, a little magazine too. We bought four, and came away wanting to print ours on paper.',
    ],
  },
  {
    slug: 'the-book-i-will-never-return',
    tag: 'Essay',
    title: 'The book I’ll never return',
    dek: 'a confession about a library copy, three years overdue',
    cover: '/editions/jan27/articles/the-book-i-will-never-return/cover.jpg',
    alt: 'a worn library book with a date-due card sticking out of it',
    author: null,
    date: 'Jan 2027',
    readTime: '3',
    body: [
      'There is a book on my shelf with a school library stamp inside it and a date-due card that says 14 March. Not this March. Three Marches ago. I am not proud of this. I am also not giving it back.',
      { h2: 'How it happened' },
      'I borrowed it in Class 8 for a project I never finished. I read it on a long train journey, then again on a sick day, then again the night before an exam I should have been studying for. Somewhere in there, it stopped feeling like the library’s book.',
      { quote: 'Some books you borrow. Some books borrow you.', by: 'written in pencil on the last page, not by me' },
      { h2: 'What I will do instead' },
      { checklist: [['buy the library a new copy', true], ['write my name under the pencil line', true], ['return this one', false]], title: 'The deal I made with myself' },
      'So this January, at the Book Fair, I bought a fresh copy and gave it to the librarian without saying a word. She looked at it, then at me, and stamped it. I think she knew.',
    ],
  },
  {
    slug: 'republic-day-from-the-pavement',
    tag: 'Dispatch',
    title: 'Republic Day, from the pavement',
    dek: 'a 6 a.m. start, a borrowed flag and the bands on Red Road',
    cover: '/editions/jan27/articles/republic-day-from-the-pavement/cover.jpg',
    alt: 'a marching band in white uniforms passing under tricolour flags',
    author: null,
    date: 'Jan 2027',
    readTime: '2',
    body: [
      'The Republic Day parade on Red Road starts early and cold, and the best way to see it is from the pavement with a flask of tea. We were there at six, in the kuasha, with about four thousand other people and one very excited dog.',
      { numbers: [['bands', '9'], ['tableaux', '14'], ['degrees, at dawn', '11'], ['flags waved', 'all of them']], title: 'The parade, counted' },
      'First the bands, brass shining through the fog. Then the marching contingents, then the tableaux from every department, each one a float with something enormous on it: a tiger, a tea garden, a ship.',
      { quote: 'It is the only morning of the year I am happy to wake up at five.', by: 'a grandfather with a folding stool' },
      'By nine the sun was out, the fog was gone and the crowd was walking home, still humming the last band’s tune.',
    ],
  },
  {
    slug: 'winter-in-eleven-sentences',
    tag: 'Prose',
    title: 'Winter in eleven sentences',
    dek: 'a short piece about the only season Kolkata really waits for',
    cover: '/editions/jan27/articles/winter-in-eleven-sentences/cover.jpg',
    alt: 'a cup of tea steaming on a windowsill on a foggy morning',
    author: null,
    date: 'Jan 2027',
    readTime: '2',
    body: [
      'Winter in Kolkata lasts about six weeks, and the whole city spends the rest of the year waiting for it. The mornings are grey and soft. The fog sits on the Maidan until nine. The quilts come out of the trunk smelling of mothballs.',
      'Every mother says the same three words: wear a sweater. Every child wears the sweater as far as the gate and then ties it around their waist.',
      { h2: 'The afternoons' },
      'Oranges are eaten on terraces in the sun, peel by peel. Somebody always has a cricket match going in the lane. The light at four o’clock is the colour of tea.',
      { quote: 'Winter here is not cold. It is just a little kinder.', by: 'my mother' },
      'And then one morning in February you wake up warm, and it is over, and you miss it already.',
    ],
  },
];
