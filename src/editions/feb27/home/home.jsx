import { seasonHome } from '../../season/SeasonHome.jsx';
import Hero from './Hero.jsx';
import Envelopes from './Envelopes.jsx';
import Goodbye from './Goodbye.jsx';

// February's own home page, "Letters" (both layouts; src/editions/pages.js OWN_PAGES), on the newer editions' shared
// frame (src/editions/season/SeasonHome.jsx): Saraswati Puja yellow, and the post. A sealed envelope and palash flowers
// up top (Hero.jsx), the articles as letters to open (Envelopes.jsx), the photos as postage stamps (home.css .fb-print),
// the words game and the team, and a signed, sealed goodbye (Goodbye.jsx). Colours: look.js `home`; CSS: home.css.
export const FEB_PAGES = {
  home: seasonHome({
    className: 'fb-home',
    Hero,
    Stories: Envelopes,
    Goodbye,
    photoClass: 'fb-print',
    viewer: 'Letters, in pictures',
    buddy: { web: { left: 1330, top: 110 }, phone: { left: 300, top: 360 } },
    heads: {
      articles: { kicker: 'ONE LETTER PER STORY', title: 'Your post', aside: 'break the seal. read slowly' },
      photos: { kicker: 'FIRST CLASS', title: 'Stamps', aside: 'tap one to see it big' },
      words: { kicker: 'SHOBDO · WORDS', title: 'Words we should bring back', aside: 'five words, three guesses each' },
      members: { kicker: 'THE SENDERS', title: 'Written by', aside: 'tap anyone' },
    },
  }),
};
