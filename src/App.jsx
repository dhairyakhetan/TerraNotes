import { Navigate, Route, Routes, useLocation, useParams } from 'react-router';
import PhoneHome from './phone/PhoneHome.jsx';
import PhoneArticle from './phone/PhoneArticle.jsx';
import WebHome from './web/WebHome.jsx';
import WebArticle from './web/WebArticle.jsx';
import { EditionPage, EditionsPage } from './pages/EditionsPage.jsx';
import LabsPage from './articles/labs/LabsPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import ErrorBoundary from './shared/ErrorBoundary.jsx';
import SiteFooter from './shared/SiteFooter.jsx';
import BuddyGames from './shared/buddy/BuddyGames.jsx';
import { ALL_ARTICLES } from './data/articles.js';
import { LATEST, articleLink, editionById, editionLink, editionOf } from './data/editions.js';
import { useIsWeb } from './lib/layoutMode.js';
import { SECTIONS } from './lib/routes.js';
import { ScrollMemory } from './lib/scrollMemory.js';

// The routes, per layout (lib/layoutMode.js: 900px+ wide = web, else phone):
//   /                         home (PhoneHome / WebHome)
//   /articles /photos /words /members   the home page, opened at that section (lib/scrollMemory.js scrolls)
//   /articles/<slug>          an article in the latest edition (PhoneArticle / WebArticle, or its own page: PAGES);
//                             `next` = the following one in its edition
//   /<id>/articles/<slug>     an article in an older edition, e.g. /sep26/articles/labs (data/editions.js). Either
//                             address of an article redirects to its current one, so links survive a new edition.
//   /editions, /<id>          every edition / a previous one (pages/EditionsPage.jsx); old /editions/<n> redirects
//   anything else             404 (pages/NotFoundPage.jsx)
// Any address with ?by=<writer> goes to /articles?by=<writer> (that writer's articles first, lib/byWriter.js).
// Around them: the skip link, the crash card, the footer and Buddy's games popup (these last two outlive navigation).

// Articles with their own page instead of the usual layout (an article's `page` in data/articles.js)
const PAGES = { labs: LabsPage };

// /articles, /photos… (the home page) or an edition's id (/sep26: that edition, or home if it's the latest)
function SectionRoute({ web }) {
  const { section } = useParams();
  if (SECTIONS.includes(section)) return web ? <WebHome /> : <PhoneHome />;
  const e = editionById(section);
  if (!e) return <NotFoundPage web={web} />;
  return e.number === LATEST ? <Navigate to="/" replace /> : <EditionPage web={web} n={e.number} />;
}

function OldEditionRoute({ web }) {
  const e = editionOf(Number(useParams().n));
  return e ? <Navigate to={editionLink(e.number)} replace /> : <NotFoundPage web={web} />;
}

function ArticleRoute({ web }) {
  const { edition, slug } = useParams();
  const { pathname, search, hash } = useLocation();
  const n = edition ? editionById(edition)?.number : LATEST;
  // an older edition's article at the clean address it had while it was the latest is still found (then redirected)
  const a = ALL_ARTICLES.find((x) => x.slug === slug && x.edition === n) || (!edition && ALL_ARTICLES.findLast((x) => x.slug === slug));
  if (!a) return <NotFoundPage web={web} />;
  if (pathname !== articleLink(a)) return <Navigate to={articleLink(a) + search + hash} replace />;
  const key = articleLink(a); // remount per article so its entrance replays
  if (a.page) { const Own = PAGES[a.page]; return <Own key={key} article={a} web={web} />; }
  const Page = web ? WebArticle : PhoneArticle;
  const same = ALL_ARTICLES.filter((x) => x.edition === a.edition);
  return <Page key={key} article={a} next={same[(same.indexOf(a) + 1) % same.length]} />;
}

// "Skip to main content": hidden until focused with the keyboard; moves focus past the page's header.
function SkipLink() {
  const skip = (e) => {
    e.preventDefault();
    const main = document.querySelector('#root main') || document.querySelector('#root header')?.nextElementSibling; // <main>: pages with a bar under the header (AQ Labs)
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
            <Route path="/editions/:n" element={<OldEditionRoute web={web} />} />
            <Route path="/:section" element={<SectionRoute web={web} />} />
            <Route path="/articles/:slug" element={<ArticleRoute web={web} />} />
            <Route path="/:edition/articles/:slug" element={<ArticleRoute web={web} />} />
            <Route path="*" element={<NotFoundPage web={web} />} />
          </Routes>
        )}
      </ErrorBoundary>
      <SiteFooter />
      <BuddyGames />
    </>
  );
}
