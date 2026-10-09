import { seasonHome } from '../../season/SeasonHome.jsx';
import Hero from './Hero.jsx';
import Doors from './Doors.jsx';
import Goodbye from './Goodbye.jsx';

// December's own home page, "Park Street" (both layouts; src/editions/pages.js OWN_PAGES), on the newer editions'
// shared frame (src/editions/season/SeasonHome.jsx): Park Street at night, in wine red. The street under fairy lights
// (Hero.jsx), the articles behind the doors of an advent calendar (Doors.jsx), the photos in gilt frames (home.css
// .dc-print), the words game and the team on cream panels, and a goodbye to the year (Goodbye.jsx). Colours: look.js
// `home`; CSS: home.css.
export const DEC_PAGES = {
  home: seasonHome({
    className: 'dc-home',
    Hero,
    Stories: Doors,
    Goodbye,
    photoClass: 'dc-print',
    viewer: 'Park Street, in pictures',
    buddy: { web: { left: 1320, top: 600 }, phone: { left: 300, top: 520 } },
    heads: {
      articles: { kicker: 'ONE DOOR PER STORY', title: 'Open the doors', aside: 'a story behind every one. no peeking (ok, peek)' },
      photos: { kicker: 'THE WEEK IN PICTURES', title: 'Christmas week', aside: 'tap one to see it big' },
      words: { kicker: 'WINTER WORDS', title: 'Words we should bring back', aside: 'five words, three guesses each' },
      members: { kicker: 'THE TEAM', title: 'With love, from', aside: 'tap anyone' },
    },
  }),
};
