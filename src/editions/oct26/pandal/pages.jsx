import WebArticle from '../../../web/WebArticle.jsx';
import PhoneArticle from '../../../phone/PhoneArticle.jsx';
import Curtain from './Curtain.jsx';
import { PhonePandalHome, WebPandalHome } from './PandalHome.jsx';

// October's "pandal hopping" pages (src/editions/pages.js OWN_PAGES, behind lib/preview.js PANDAL):
//   home: its own home page (PandalHome.jsx, both layouts). Not fetched later (React.lazy): the page's sections must be
//         there as it opens, so an address like /photos can scroll straight to its section (lib/scrollMemory.js)
//   article: the shared article page, opened with the pandal curtain (Curtain.jsx) when a card was tapped
export const PANDAL_PAGES = {
  home: { web: WebPandalHome, phone: PhonePandalHome },
  article: {
    web: (props) => <><WebArticle {...props} /><Curtain /></>,
    phone: (props) => <><PhoneArticle {...props} /><Curtain /></>,
  },
};
