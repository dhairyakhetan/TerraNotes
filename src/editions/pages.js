// Pages an edition draws its own way, for a month that wants more than a new look.js: its own home page and/or article
// page, per layout. Start from a copy of the shared one (src/web/WebHome.jsx, src/phone/PhoneHome.jsx,
// src/web/WebArticle.jsx, src/phone/PhoneArticle.jsx) kept in the edition's folder, e.g. src/editions/oct26/WebHome.jsx,
// and list it here. Anything not listed uses the shared page. They read the edition with useEdition() like the shared
// ones. Kept apart from index.js: the build reads the editions' data in Node, which can't load components.
//   import Oct26WebHome from './oct26/WebHome.jsx';
//   export const OWN_PAGES = { oct26: { home: { web: Oct26WebHome } } };
// keys: edition id → { home: { web, phone }, article: { web, phone } }
export const OWN_PAGES = {};
