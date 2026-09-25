import { Navigate, Route, Routes, useLocation, useParams } from 'react-router';
import PhoneHome from './phone/PhoneHome.jsx';
import PhoneArticle from './phone/PhoneArticle.jsx';
import WebHome from './web/WebHome.jsx';
import WebArticle from './web/WebArticle.jsx';
import { EditionPage, EditionsPage } from './pages/EditionsPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import ErrorBoundary from './shared/ErrorBoundary.jsx';
import SiteFooter from './shared/SiteFooter.jsx';
import BuddyGames from './shared/buddy/BuddyGames.jsx';
import { ALL_ARTICLES } from './data/articles.js';
import { useIsWeb } from './lib/layoutMode.js';
import { SECTIONS } from './lib/routes.js';
import { ScrollMemory } from './lib/scrollMemory.js';

// The routes, per layout (lib/layoutMode.js: 900px+ wide = web, else phone):
//   /                         home (PhoneHome / WebHome)
//   /articles /photos /words /members   the home page, opened at that section (lib/scrollMemory.js scrolls)
//   /articles/<slug>          one article (PhoneArticle / WebArticle); `next` = the following one in its edition
//   /editions, /editions/<n>  every edition / a previous one (pages/EditionsPage.jsx)
//   anything else             404 (pages/NotFoundPage.jsx)
// Any address with ?by=<writer> goes to /articles?by=<writer> (that writer's articles first, lib/byWriter.js).
// Around them: the skip link, the crash card, the footer and Buddy's games popup (these last two outlive navigation).

function SectionRoute({ web }) {
  const { section } = useParams();
  if (!SECTIONS.includes(section)) return <NotFoundPage web={web} />;
  return web ? <WebHome /> : <PhoneHome />;
}

function ArticleRoute({ web }) {
  const { slug } = useParams();
  const a = ALL_ARTICLES.find((x) => x.slug === slug);
  if (!a) return <NotFoundPage web={web} />;
  const Page = web ? WebArticle : PhoneArticle;
  const same = ALL_ARTICLES.filter((x) => x.edition === a.edition);
  return <Page key={slug} article={a} next={same[(same.indexOf(a) + 1) % same.length]} />; // key: remount per article so its entrance replays
}

// "Skip to main content": hidden until focused with the keyboard; moves focus past the page's header.
function SkipLink() {
  const skip = (e) => {
    e.preventDefault();
    const main = document.querySelector('#root header')?.nextElementSibling || document.querySelector('#root main');
    if (!main) return;
    if (!main.hasAttribute('tabindex')) main.setAttribute('tabindex', '-1');
    main.style.outline = 'none';
    main.focus();
  };
  return <a className="skip-link" href="#main" onClick={skip}>Skip to main content</a>;
}

export default function App() {
  const { pathname, search } = useLocation();
  const web = useIsWeb();
  const toWriter = pathname !== '/articles' && new URLSearchParams(search).get('by');
  return (
    <>
      <SkipLink />
      <ScrollMemory />
      <ErrorBoundary resetKey={pathname}>
        {toWriter ? <Navigate to={{ pathname: '/articles', search }} replace /> : (
          <Routes>
            <Route path="/" element={web ? <WebHome /> : <PhoneHome />} />
            <Route path="/editions" element={<EditionsPage web={web} />} />
            <Route path="/editions/:n" element={<EditionPage web={web} />} />
            <Route path="/:section" element={<SectionRoute web={web} />} />
            <Route path="/articles/:slug" element={<ArticleRoute web={web} />} />
            <Route path="*" element={<NotFoundPage web={web} />} />
          </Routes>
        )}
      </ErrorBoundary>
      <SiteFooter />
      <BuddyGames />
    </>
  );
}
