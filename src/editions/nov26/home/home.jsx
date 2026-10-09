import { seasonHome } from '../../season/SeasonHome.jsx';
import Hero from './Hero.jsx';
import Lanterns from './Lanterns.jsx';
import Goodbye from './Goodbye.jsx';

// November's own home page, "Lights" (both layouts; src/editions/pages.js OWN_PAGES), on the newer editions' shared
// frame (src/editions/season/SeasonHome.jsx): the whole page is night. The night sky with fireworks and a rope of
// lanterns (Hero.jsx), the articles as sky lanterns that light up as you reach them (Lanterns.jsx), the photos as
// polaroids glowing in the dark (home.css .nv-print), the words game and the team on paper panels, and fourteen diyas
// to say goodbye (Goodbye.jsx). Colours: look.js `home`; CSS: home.css.
export const NOV_PAGES = {
  home: seasonHome({
    className: 'nv-home',
    Hero,
    Stories: Lanterns,
    Goodbye,
    photoClass: 'nv-print',
    viewer: 'Lights, in pictures',
    buddy: { web: { left: 1330, top: 640 }, phone: { left: 300, top: 470 } },
    heads: {
      articles: { kicker: 'ONE LANTERN PER STORY', title: 'Light the lanterns', aside: 'they light up as you reach them. tap one to read' },
      photos: { kicker: 'CHHOBI · PICTURES', title: 'The long night', aside: 'tap one to see it big' },
      words: { kicker: 'SHOBDO · WORDS', title: 'Words we should bring back', aside: 'five words, three guesses each' },
      members: { kicker: 'THE TEAM', title: 'Who lit these', aside: 'tap anyone' },
    },
  }),
};
