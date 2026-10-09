import { seasonHome } from '../../season/SeasonHome.jsx';
import Hero from './Hero.jsx';
import Shelf from './Shelf.jsx';
import Goodbye from './Goodbye.jsx';

// January's own home page, "Boi Mela" (both layouts; src/editions/pages.js OWN_PAGES), on the newer editions' shared
// frame (src/editions/season/SeasonHome.jsx): a stall at the Kolkata Book Fair, on kraft paper. The fair's gate under
// bunting (Hero.jsx), the articles as books on the stall's shelf that open on the counter (Shelf.jsx), the photos as
// postcards on a twine (home.css .jn-print), the words game and the team, and a library card's date-due stamp to say
// goodbye (Goodbye.jsx). Colours: look.js `home`; CSS: home.css.
export const JAN_PAGES = {
  home: seasonHome({
    className: 'jn-home',
    Hero,
    Stories: Shelf,
    Goodbye,
    photoClass: 'jn-print',
    viewer: 'Boi Mela, in pictures',
    buddy: { web: { left: 1320, top: 560 }, phone: { left: 300, top: 420 } },
    heads: {
      articles: { kicker: 'ONE BOOK PER STORY', title: 'On the shelf', aside: 'every one a bargain. tap a spine' },
      photos: { kicker: 'POSTCARDS FROM THE FAIR', title: 'Postcards', aside: 'tap one to see it big' },
      words: { kicker: 'SHOBDO · WORDS', title: 'Words we should bring back', aside: 'five words, three guesses each' },
      members: { kicker: 'THE STALL KEEPERS', title: 'Behind the counter', aside: 'tap anyone' },
    },
  }),
};
