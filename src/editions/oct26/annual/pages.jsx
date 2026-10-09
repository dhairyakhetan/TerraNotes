import WebArticle from '../../../web/WebArticle.jsx';
import PhoneArticle from '../../../phone/PhoneArticle.jsx';
import PageTurn from './PageTurn.jsx';
import { PhoneAnnualHome, WebAnnualHome } from './AnnualHome.jsx';

// October's own pages (src/editions/pages.js OWN_PAGES), "the Pujo annual":
//   home: its own home page (AnnualHome.jsx, both layouts)
//   article: the shared article page, opened with a page turn (PageTurn.jsx) when it was tapped on the home page
export const ANNUAL_PAGES = {
  home: { web: WebAnnualHome, phone: PhoneAnnualHome },
  article: {
    web: (props) => <><WebArticle {...props} /><PageTurn /></>,
    phone: (props) => <><PhoneArticle {...props} /><PageTurn /></>,
  },
};
