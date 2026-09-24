import { useEffect, useLayoutEffect } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigationType, useParams } from 'react-router';
import Home from './pages/Home.jsx';
import Articles from './pages/Articles.jsx';
import Article from './pages/Article.jsx';
import NotFound from './pages/NotFound.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import WebHome from './web/WebHome.jsx';
import WebArticle from './web/WebArticle.jsx';
import OrbitBanner from './components/OrbitBanner.jsx';
import Footer from './components/Footer.jsx';
import { ALL_ARTICLES } from './data/articles.js';
import { EditionPage, Editions } from './pages/Editions.jsx';
import { useIsWeb } from './lib/layout.js';
import Games from './components/buddy/Games.jsx';
import './styles/buddy.css';

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
let lastPath = null;
// the home page, under any of its section addresses (/articles is the home page on web only)
const onHome = (p) => !!p && (p === '/' || (SECTIONS.includes(p.slice(1)) && (p !== '/articles' || document.documentElement.dataset.layout === 'web')));

function ScrollManager() {
  const { pathname, hash, key } = useLocation();
  const type = useNavigationType();
  useLayoutEffect(() => {
    current = null; // stop recording the page we're leaving before anything scrolls
    persist();
    // a section link on the page you're already on glides there; everything else lands instantly
    const behavior = type === 'PUSH' && onHome(lastPath) && onHome(pathname) && !matchMedia('(prefers-reduced-motion: reduce)').matches ? 'smooth' : 'auto';
    lastPath = pathname;
    if (type === 'POP' && saved[key] != null) window.scrollTo(0, saved[key]);
    else {
      const id = SECTIONS.find((s) => pathname === `/${s}`) || (hash && decodeURIComponent(hash.slice(1)));
      const target = id && document.getElementById(id);
      if (target) target.scrollIntoView({ behavior });
      else window.scrollTo({ top: 0, behavior });
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
  const a = ALL_ARTICLES.find((x) => x.slug === slug);
  if (!a) return <NotFound web={web} />;
  const Page = web ? WebArticle : Article;
  const same = ALL_ARTICLES.filter((x) => x.edition === a.edition); // "next on the line" stays in the article's edition
  // key: remount per article so the hero drop animation replays
  return <Page key={slug} article={a} next={same[(same.indexOf(a) + 1) % same.length]} />;
}

// "Skip to main content": hidden until it gets keyboard focus; jumps past the page's header.
function SkipLink() {
  const skip = (e) => {
    e.preventDefault();
    const header = document.querySelector('#root header');
    const main = header?.nextElementSibling || document.querySelector('#root main');
    if (!main) return;
    if (!main.hasAttribute('tabindex')) main.setAttribute('tabindex', '-1');
    main.style.outline = 'none';
    main.focus();
  };
  return <a className="skip-link" href="#main" onClick={skip}>Skip to main content</a>;
}

export default function App() {
  const { pathname, search } = useLocation();
  const web = useIsWeb(); // 900px and up: the 1440px web layout (src/web/); below: the phone layout (src/pages/)
  // any address with ?by=<name> goes to that writer's articles: /?by=diti, /members?by=diti… → /articles?by=diti
  const toWriter = pathname !== '/articles' && new URLSearchParams(search).get('by');
  return (
    <>
      <SkipLink />
      <ScrollManager />
      <ErrorBoundary resetKey={pathname}>
        {toWriter ? <Navigate to={{ pathname: '/articles', search }} replace /> : <Routes>
          <Route path="/" element={web ? <WebHome /> : <Home />} />
          {/* on web every write-up is on the home page's line */}
          <Route path="/articles" element={web ? <WebHome /> : <Articles />} />
          <Route path="/editions" element={<Editions web={web} />} />
          <Route path="/editions/:n" element={<EditionPage web={web} />} />
          <Route path="/:section" element={<SectionRoute web={web} />} />
          <Route path="/articles/:slug" element={<ArticleRoute web={web} />} />
          <Route path="*" element={<NotFound web={web} />} />
        </Routes>}
      </ErrorBoundary>
      {/* outside the routes so the banner's one <video> survives navigation */}
      <OrbitBanner />
      <Footer />
      <Games />
    </>
  );
}
