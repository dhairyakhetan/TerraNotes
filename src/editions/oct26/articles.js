// October 2026's articles, in order (the order sets their numbers, 01, 02…, and the "next on the line" chain), and the
// tags they use (tag colours: color = the tag, ink = text on it; September's to start). Every field is explained at the
// top of src/data/articles.js. Writers' text is verbatim, typos included. Covers and photos go in
// public/editions/oct26/articles/<slug>/.

// Pujo colours: alta red, marigold, banana leaf, lotus, peacock
export const TAGS = {
  'Field notes': { color: '#C8102E', ink: '#FFFDF7' },
  Reportage: { color: '#1F6F8B', ink: '#FFFDF7' },
  Logbook: { color: '#3E7D2C', ink: '#FFFDF7' },
  'Object study': { color: '#7A2E8E', ink: '#FFFDF7' },
  Dispatch: { color: '#F4B400', ink: '#3A0B0E' },
  Essay: { color: '#E35D8C', ink: '#3A0B0E' },
  Prose: { color: '#3E7D2C', ink: '#FFFDF7' },
  'Under Aquaterra': { color: '#F4B400', ink: '#3A0B0E' },
};

// Two sample pieces, written to show off the Pujo look (from Aquaterra itself: no writer). Swap them for the
// writers' articles.
export const ARTICLES = [
  {
    slug: 'pandal-hopping-field-guide',
    tag: 'Field notes',
    title: 'Five days, one city: a pandal-hopping field guide',
    dek: 'how to survive the queues, the crowds and the 2 a.m. phuchka',
    cover: '/editions/oct26/articles/pandal-hopping-field-guide/cover.jpg',
    alt: 'a pandal lit up at night under strings of fairy lights',
    author: null,
    featured: true,
    date: 'Oct 2026',
    readTime: '4',
    body: [
      'For five days every October, Kolkata stops pretending to be a normal city. Roads become one-way rivers of people, the traffic police give up and start taking photos, and somewhere around Saptami everyone agrees that sleep is optional. This is our field guide to doing Pujo properly: on foot, in groups, and with a phone at 40%.',
      { log: [['ROUTE', 'north to south'], ['PANDALS', '11'], ['STEPS', '31,402'], ['PHUCHKAS', 'too many']] },
      { h2: 'Start before the sun goes down' },
      'The famous pandals have queues that reach the next neighbourhood by eight. Go at five, when the light is still gold and the dhakis are only warming up. You get the idol, the lights coming on, and a pavement you can actually walk on.',
      { h2: 'The queue is the point' },
      'Nobody likes standing in a line for ninety minutes. But the queue is where Pujo actually happens: aunties comparing sarees, kids on shoulders, strangers sharing the same umbrella when the sky remembers it is still technically monsoon. By the time you reach the gate, you know half the line.',
      { quote: 'Every year we say we will skip the big ones. Every year we stand in the big ones.', by: 'everyone, every year' },
      { checklist: [['comfortable sandals', true], ['a power bank', true], ['cash for phuchka', true], ['an umbrella, just in case', false]], title: 'The Pujo bag' },
      { h2: 'Eat like it is Navami' },
      'Rolls, phuchka, mughlai paratha, then bhog at the para pandal because someone’s mother insists. The rule is simple: if there is a stall, there is a reason to stop.',
      { h2: 'Going home at 4 a.m.' },
      'At some point the city goes quiet in the strangest way: the lights still on, the roads empty, a dhak somewhere far off still going. You walk home slower than you need to. Nobody wants the night to be the last one.',
    ],
  },
  {
    slug: 'sound-of-the-dhak',
    tag: 'Essay',
    title: 'The sound of the dhak',
    dek: 'how one drum tells a whole city that autumn is here',
    cover: '/editions/oct26/articles/sound-of-the-dhak/cover.jpg',
    alt: 'a dhak drum with its white kash-flower plume on a red alpana',
    author: null,
    date: 'Oct 2026',
    readTime: '3',
    body: [
      'Before the pandals go up, before the lights, before the first new clothes are unfolded, there is the sound. Somewhere in the lane, someone tries out a dhak, and the whole neighbourhood looks up. Pujo has not started yet. But now everyone knows it will.',
      { h2: 'A drum with a feather crown' },
      'The dhak is huge, slung from the shoulder and played with two thin sticks. On top sits a plume of white kash flowers, the same grass that turns the riverbanks white in autumn. It looks less like an instrument and more like a messenger.',
      { quote: 'You do not hear the dhak. You feel it in your ribs first.', by: 'a dhaki at a para pandal' },
      { then: [['Mahalaya on the radio at 4 a.m.', 'Mahalaya on a phone at 4 a.m.'], ['dhakis walking in from the villages', 'dhakis walking in from the villages'], ['dancing with the dhunuchi', 'filming the dhunuchi dance'], ['the beat that means “Pujo”', 'the same beat']], title: 'What changed, what didn’t' },
      { h2: 'The last beat' },
      'On Dashami the rhythm changes. It gets faster, louder, almost angry, as the idols are carried to the river. And then it stops, and the city is just a city again, waiting a whole year to hear it.',
    ],
  },
];
