// WORDS WE SHOULD BRING BACK — the pool the mini game draws from.
// Each round: the word, three options, index `a` of the right one, the real definition (shown after a pick)
// and a `hint` that fades in as a "psst." note if the reader is still thinking after a while.
// Keep `def` short (about 115 characters) so it fits under the options.
export const WORDS = [
  {
    word: 'Apricity',
    opts: ['the warmth of the sun in winter', 'a sour aftertaste from citrus', 'a fear of open water'],
    a: 0,
    def: 'Apricity (n.): the warmth of the sun in winter. Recorded in a 1623 dictionary, then almost never used again.',
    hint: "you'd feel it on a park bench in January.",
  },
  {
    word: 'Gloaming',
    opts: ['a soft glow on wet stone', 'twilight; the fall of dusk', 'a slow-moving river fog'],
    a: 1,
    def: 'Gloaming (n.): twilight, the fall of dusk. Still alive in Scottish speech and old songs.',
    hint: 'it happens every evening, if you look up.',
  },
  {
    word: 'Respair',
    opts: ['to repair something twice', 'a spare pair of shoes', 'fresh hope after despair'],
    a: 2,
    def: 'Respair (n.): fresh hope; recovering from despair. Last seen in writing around the 1500s.',
    hint: 'say it straight after the word “despair”.',
  },
  {
    word: 'Curglaff',
    opts: ['a loud laugh at a funeral', 'a crooked garden fence', 'the shock of plunging into cold water'],
    a: 2,
    def: 'Curglaff (n.): the shock you feel when you first plunge into cold water. An old Scots word.',
    hint: 'every sea swimmer knows it by the first gasp.',
  },
  {
    word: 'Snowbroth',
    opts: ['a winter soup of root vegetables', 'freshly melted snow', 'the crunch of boots on ice'],
    a: 1,
    def: 'Snowbroth (n.): freshly melted snow. Shakespeare gives a cold-blooded man “snow-broth” for blood.',
    hint: 'think less soup, more puddle.',
  },
  {
    word: 'Mizzle',
    opts: ['a very fine, misty rain', 'to chew with your mouth open', 'to doze off by the fire'],
    a: 0,
    def: 'Mizzle (v.): to rain in very fine drops, somewhere between mist and drizzle. Still heard in the West Country.',
    hint: 'squash two kinds of weather together.',
  },
  {
    word: 'Welkin',
    opts: ['a young hare', 'a hand-knitted shawl', 'the sky; the vault of heaven'],
    a: 2,
    def: 'Welkin (n.): the sky, the vault of heaven. From Old English wolcen, “cloud”.',
    hint: 'look up.',
  },
  {
    word: 'Uhtceare',
    opts: ['a wooden spoon for stirring ale', 'lying awake before dawn, worrying', 'the last boat home at night'],
    a: 1,
    def: 'Uhtceare (n.): lying awake before dawn, full of worry. Old English: uht, the hour before daybreak, and care.',
    hint: 'it tends to happen around 4 a.m.',
  },
  {
    word: 'Hurkle-durkle',
    opts: ['to stay in bed long after you should be up', 'a game of hopscotch', "a knot that won't come undone"],
    a: 0,
    def: "Hurkle-durkle (v.): to lounge in bed long after it's time to get up. An old Scots word, overdue a comeback.",
    hint: 'you probably did it last Sunday.',
  },
  {
    word: 'Groak',
    opts: ['the call of a heron', 'a lump of wet clay', "to watch someone eat, hoping they'll share"],
    a: 2,
    def: "Groak (v.): to watch someone eat in silence, hoping they'll offer you some. Dogs never needed the word.",
    hint: 'every dog alive has mastered it.',
  },
  {
    word: 'Ultracrepidarian',
    opts: ['someone who comments on things they know nothing about', 'a very early riser', 'a collector of old shoes'],
    a: 0,
    def: 'Ultracrepidarian (n.): someone who gives opinions beyond their knowledge. William Hazlitt used it in 1819.',
    hint: 'a Roman once told a shoemaker to stick to shoes.',
  },
  {
    word: 'Brabble',
    opts: ['a pebble polished by the sea', 'to squabble noisily over nothing', 'a small boat for two'],
    a: 1,
    def: 'Brabble (v.): to squabble noisily over trifles. Twelfth Night has a “private brabble” in it.',
    hint: 'two neighbours, one parking spot.',
  },
];
