import { useEffect, useLayoutEffect } from 'react';
import { Route, Routes, useLocation, useNavigationType, useParams } from 'react-router';
import Home from './pages/Home.jsx';
import Articles from './pages/Articles.jsx';
import Article from './pages/Article.jsx';
import NotFound from './pages/NotFound.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import WebHome from './web/WebHome.jsx';
import WebArticle from './web/WebArticle.jsx';
import OrbitBanner from './components/OrbitBanner.jsx';
import Footer from './components/Footer.jsx';
import { ARTICLES } from './data/articles.js';
import { useIsWeb } from './lib/layout.js';

// Home page sections, each with its own clean address: /photos opens the home page at the photo wall.
// (/articles is the phone's All articles page; on web it's the article line on the home page.)
const SECTIONS = ['articles', 'photos', 'words', 'members'];

// Where each visited page was scrolled to, so Back/Forward return you there (kept for the tab's session).
const SAVED = 'aq-scroll';
const saved = (() => { try { return JSON.parse(sessionStorage.getItem(SAVED)) || {}; } catch { return {}; } })();
const persist = () => { try { sessionStorage.setItem(SAVED, JSON.stringify(saved)); } catch { /* private mode */ } };
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

// On navigation: Back/Forward (and reload) return to where you were; otherwise jump to the page's section
// (or an old-style #section), or start at the top. key: clicking the same link again jumps again.
let current = null; // the page whose scroll position is being recorded

function ScrollManager() {
  const { pathname, hash, key } = useLocation();
  const type = useNavigationType();
  useLayoutEffect(() => {
    current = null; // stop recording the page we're leaving before anything scrolls
    persist();
    if (type === 'POP' && saved[key] != null) window.scrollTo(0, saved[key]);
    else {
      const id = SECTIONS.find((s) => pathname === `/${s}`) || (hash && decodeURIComponent(hash.slice(1)));
      const target = id && document.getElementById(id);
      if (target) target.scrollIntoView();
      else window.scrollTo(0, 0);
    }
    current = key;
  }, [pathname, hash, key]);
  useEffect(() => {
    const remember = () => { if (current != null) saved[current] = Math.round(scrollY); };
    addEventListener('scroll', remember, { passive: true });
    addEventListener('pagehide', persist);
    return () => { removeEventListener('scroll', remember); removeEventListener('pagehide', persist); };
  }, []);
  return null;
}

// /photos, /words, /members: the home page, scrolled to that section
function SectionRoute({ web }) {
  const { section } = useParams();
  if (!SECTIONS.includes(section)) return <NotFound web={web} />;
  return web ? <WebHome /> : <Home />;
}

function ArticleRoute({ web }) {
  const { slug } = useParams();
  const i = ARTICLES.findIndex((a) => a.slug === slug);
  if (i === -1) return <NotFound web={web} />;
  const Page = web ? WebArticle : Article;
  // key: remount per article so the hero drop animation replays
  return <Page key={slug} article={ARTICLES[i]} next={ARTICLES[(i + 1) % ARTICLES.length]} />;
}

export default function App() {
  const { pathname } = useLocation();
  const web = useIsWeb(); // 900px and up: the 1440px web layout (src/web/); below: the phone layout (src/pages/)
  return (
    <>
      <ScrollManager />
      <ErrorBoundary resetKey={pathname}>
        <Routes>
          <Route path="/" element={web ? <WebHome /> : <Home />} />
          {/* on web every write-up is on the home page's line */}
          <Route path="/articles" element={web ? <WebHome /> : <Articles />} />
          <Route path="/:section" element={<SectionRoute web={web} />} />
          <Route path="/articles/:slug" element={<ArticleRoute web={web} />} />
          <Route path="*" element={<NotFound web={web} />} />
        </Routes>
      </ErrorBoundary>
      {/* outside the routes so the banner's one <video> survives navigation */}
      <OrbitBanner />
      <Footer />
    </>
  );
}
