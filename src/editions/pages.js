import sep26Css from './sep26/look.css?inline';
import Sep26Decor from './sep26/Decor.jsx';
import Sep26Diary from './sep26/Diary.jsx';
import oct26Css from './oct26/look.css?inline';
import Oct26Decor from './oct26/Decor.jsx';

// Pages an edition draws its own way, for a month that wants more than a new look.js: its own home page and/or article
// page, per layout. Start from a copy of the shared one (src/web/WebHome.jsx, src/phone/PhoneHome.jsx,
// src/web/WebArticle.jsx, src/phone/PhoneArticle.jsx) kept in the edition's folder, e.g. src/editions/oct26/WebHome.jsx,
// and list it here. Anything not listed uses the shared page. They read the edition with useEdition() like the shared
// ones. Kept apart from index.js: the build reads the editions' data in Node, which can't load components.
//   import Oct26WebHome from './oct26/WebHome.jsx';
//   export const OWN_PAGES = { oct26: { home: { web: Oct26WebHome } } };
// keys: edition id → { home: { web, phone }, article: { web, phone } }
export const OWN_PAGES = {};

// An edition's own decorations, beyond its look.js colours and fonts:
// - EDITION_CSS: its look.css (scoped to [data-edition="<id>"]), put on the page while one of its pages shows (App.jsx)
// - DECOR: a component drawn on its home pages' artboard ({ web }: which layout), for doodles and the like
export const EDITION_CSS = { sep26: sep26Css, oct26: oct26Css };
export const DECOR = { sep26: Sep26Decor, oct26: Oct26Decor };
// - TEAM_NOTE: a component drawn in its "Meet the team" section ({ style, size }: where and how big, from
//   shared/TeamSection.jsx: web under the legend, phone beside it), e.g. September's diary
export const TEAM_NOTE = { sep26: Sep26Diary };
