// Articles, in order: this order sets the numbers (01, 02…) and the "next on the line" chain.
//   slug:     the address, /articles/<slug>
//   tag:      one of the keys in TAGS (sets the colours)
//   cover:    put the picture in public/articles/ and write its path, e.g. '/articles/wetlands.jpg'
//   alt:      a few words describing the cover (also the placeholder label until there is one)
//   author:   the writer's name (someone in src/data/team.js also gets their role under it)
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
    slug: 'exam-stress',
    title: 'Exam stress: the academic plot twist nobody asked for',
    dek: 'when a little pressure helps, and when it takes over',
    tag: 'Essay',
    cover: '',
    alt: 'exam season',
    author: '',
    date: '',
    readTime: '5',
    body: [
      'The syllabus is 14 chapters long. The exam is tomorrow. You have studied exactly… uhmm… precisely about two chapters. Suddenly, you’re hungry, your water bottle becomes fascinating, your room desperately needs cleaning, and your phone has never looked more interesting. Somehow, everything feels more urgent than actually opening your textbook. Welcome to exam season.',
      'For most students, examinations come with a familiar side dish containing stress, pressure, no sleep, coffee, energy drinks, and the feeling of guilt that goes, “Why did I not study before?” But sometimes, a little pressure can push us to stop procrastinating, organize our time, and actually get things done. However, when that pressure becomes constant, exams stop being about what we know and start becoming about how much stress we can survive under.',
      { h2: 'When pressure helps' },
      'Let’s be honest: without deadlines, some of us would probably study three business days after the exam. The tiny voice reminding us that the exam is in three days can sometimes be exactly what gets us to put our phone down and open our textbook.',
      'A little pressure can be a low-key cheat code for motivation. Knowing that a test is right around the corner can push us to make a study schedule, focus on difficult topics, and stop procrastinating. It can also help us organize our time and actually work towards our goals. Pressure itself is not the problem. It’s when the pressure becomes too much.',
      { h2: 'When pressure stops being productive' },
      'There is a huge difference between saying, “I need to prepare for this test,” and “If I don’t do well, I will fail.” The first thought encourages you to prepare, while the second can make you feel extremely stressed and overwhelmed.',
      'The pressure becomes worse when we start connecting our marks to our sense of worth. Students may worry about disappointing their parents, teachers, or even themselves. They may also start comparing their marks with friends and classmates. Someone else’s 95 suddenly makes your 85 feel like a disaster.',
      'Then comes the classic exam-season experience: long studying hours, no sleep, too much coffee, and staring at the same page while realizing that absolutely nothing is going into your brain. Too much stress can make it harder to concentrate, sleep properly, and think clearly. Ironically, the pressure to perform better can sometimes make performing harder.',
      { h2: 'The comparison trap' },
      'And then there is the question everyone somehow asks after receiving their marks: “How much did you get?” It sounds harmless at first. You get your marks, ask your friends, and suddenly marks become a scoreboard. One person got a 92, someone else got an 87, and then there’s that one person who says, “I didn’t even study,” and somehow gets a 95.',
      'Instead of thinking, “What did I learn?” or “What can I improve?”, we start thinking, “Where do I stand compared to everyone else?” That’s where it becomes unhealthy.',
      'Academic performance is not a personality trait. Getting a 95 doesn’t automatically make you smart, and getting a lower mark definitely doesn’t make you stupid. An exam measures how you performed on one particular paper, on one particular day, under one particular set of circumstances. That’s it. Your strengths may be in art, music, sports, coding, writing, or something that cannot be measured on a report card.',
      { quote: 'Your marks are a result. They are not your identity.', by: 'from the piece' },
      'You are so much more than a number written at the top of an answer sheet. Clock itttttt 🤭',
      { h2: 'So, is exam stress good or bad?' },
      'Honestly? It’s both. A little pressure can motivate us. It can push us to focus, stay disciplined, and get things done. But too much pressure can completely overwhelm us. The goal shouldn’t be to eliminate every bit of stress because, let’s be real, that’s probably impossible. Instead, we need to recognize when pressure is motivating us and when it is simply becoming too much.',
      'Pressure isn’t necessarily harmful. It becomes harmful when we start using it in the wrong way. When we use it in the right way, exams can feel more manageable, and we can stop feeling guilty every time we aren’t studying.',
      'Exams are supposed to measure what we’ve learned—not how well we can function while we’re stressed, exhausted, and terrified of a number on a piece of paper. Maybe we need to stop treating stress as proof that we’re working hard enough. Being constantly overwhelmed doesn’t mean you’re more dedicated, and being calm doesn’t mean you’re not trying.',
      'At the end of the day, one exam can measure one chapter of your life. It cannot measure you as a person.',
    ],
  },
  {
    slug: 'locked-in-or-logged-on',
    title: 'Locked in or logged on?',
    dek: 'two words, infinite promises, twenty-seven reels later',
    tag: 'Dispatch',
    cover: '',
    alt: 'lock-in',
    author: 'Pahal Sethi',
    date: '20 Sep 2026',
    readTime: '2',
    body: [
      '“Lock in.” Two words. Infinite promises.',
      'We say it before exams, after bad grades, on Sunday nights, on Monday mornings, and occasionally at 2 a.m. after watching a motivational edit that convinces us our entire life is about to change.',
      'And then we open Instagram. Just for five minutes, obviously.',
      'Twenty-seven reels later, we somehow know how a celebrity met their ex, why a random stranger’s cat has a better morning routine than us, and exactly what everyone else is doing with their lives. Our textbook, meanwhile, has remained open to the same page long enough to qualify as furniture.',
      'The irony is that Gen Z is probably more obsessed with productivity than any generation that has ever owned a smartphone. We have “lock-in” playlists, productivity apps, colour-coded planners, study-with-me videos and enough motivational quotes to wallpaper a bedroom.',
      'Yet somehow, we’re still doomscrolling at midnight. Maybe because doomscrolling isn’t really about wanting to scroll. It’s about not wanting to start.',
      'Starting means concentrating. It means risking the possibility that we won’t understand something, won’t finish on time, or won’t be as productive as the version of ourselves we imagined while making the timetable. Scrolling asks for none of that. It gives us the comforting illusion of doing something while requiring absolutely nothing from us.',
      { quote: 'Doomscrolling isn’t really about wanting to scroll. It’s about not wanting to start.', by: 'Pahal Sethi' },
      'So perhaps the problem isn’t that we don’t know how to “lock in.” We’ve just become incredibly good at announcing it. Maybe locking in isn’t a dramatic transformation. No 5 a.m. routine. No perfectly clean desk. No sudden personality change. Sometimes it’s just closing the app before “one more reel” becomes another hour.',
      'Because apparently, the hardest part of productivity isn’t knowing what to do. It’s resisting the urge to see what happens next on your For You page.',
    ],
  },
  {
    slug: 'fast-fashion-and-anxiety',
    title: 'The rise of “fast fashion” and anxiety',
    dek: 'why shopping for clothes started to feel exhausting',
    tag: 'Object study',
    cover: '',
    alt: 'fast fashion',
    author: 'Dhriti Agarwal',
    date: '',
    readTime: '2',
    body: [
      'Have you ever noticed how scrolling through clothing sites or walking into an apparel store can sometimes feel strangely exhausting instead of fun?',
      'We’ve all been there: buying a cute 2000Rs. top just to get that quick dopamine hit and look trendy on social media, only to feel a weird mix of regret and guilt a week later when a thread starts to unravel or a new “micro-trend” replaces it.',
      'We fail to realise that we start to lose ourselves along the way in the hurry of being ‘fashionable’, we don’t just lose our budgets on those tedious shopping hauls, but we actually end up losing our uniqueness in the effort of being a part of trend that will be replaced within the week if not in less time.',
      'That’s the unspoken trap of fast fashion. It promises us endless imagination and confidence on a budget, but it silently and unknowingly forces us into a relentless race to keep up. We have stopped to think for ourselves and rush to ‘Pinterest’ or ‘Instagram’ for “outfit inspos” as soon as we are in a clutz, we are dumbfounded when someone asks us what bottoms to wear with a top or what top to wear with a pair of jeans.',
      { quote: 'We aren’t just drowning in clothes—we’re drowning in the stress to keep up.', by: 'Dhriti Agarwal' },
      'Today clothes become completely disposable and shopping sprees have start to feel like a burden. We worry about missing out, we worry about fitting in, and about what others will or won’t think, we carry this heavy burden of societal acceptance that is slowly and internally eating us alive. We fail to realize that we aren’t just drowning in clothes—we’re drowning in the stress to keep up.',
    ],
  },
];

// Empty pegs after the real articles on the sideways line (web home, and the phone's scroll view). One peg per line.
export const COMING_SOON = [
  "this peg's saving a spot for the next one",
  'still drying. check back soon.',
];
