import { useLayoutEffect } from 'react';
import { Navigate, Route, Routes, useLocation, useParams } from 'react-router';
import Home from './pages/Home.jsx';
import Articles from './pages/Articles.jsx';
import Article from './pages/Article.jsx';
import WebHome from './web/WebHome.jsx';
import WebArticle from './web/WebArticle.jsx';
import OrbitBanner from './components/OrbitBanner.jsx';
import Footer from './components/Footer.jsx';
import { ARTICLES } from './data/articles.js';
import { useIsWeb } from './lib/layout.js';

// Home page sections, each with its own clean address: /photos opens the home page at the photo wall.
// (/articles is the phone's All articles page; on web it's the article line on the home page.)
const SECTIONS = ['articles', 'photos', 'words', 'members'];

// On navigation: jump to the page's section (or an old-style #section), otherwise start at the top.
// key: clicking the same link again jumps again.
function ScrollManager() {
  const { pathname, hash, key } = useLocation();
  useLayoutEffect(() => {
    const id = SECTIONS.find((s) => pathname === `/${s}`) || (hash && decodeURIComponent(hash.slice(1)));
    const target = id && document.getElementById(id);
    if (target) target.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [pathname, hash, key]);
  return null;
}

// /photos, /words, /members: the home page, scrolled to that section
function SectionRoute({ web }) {
  const { section } = useParams();
  if (!SECTIONS.includes(section)) return <Navigate to="/" replace />;
  return web ? <WebHome /> : <Home />;
}

function ArticleRoute({ web }) {
  const { slug } = useParams();
  const i = ARTICLES.findIndex((a) => a.slug === slug);
  if (i === -1) return <Navigate to="/articles" replace />;
  const Page = web ? WebArticle : Article;
  // key: remount per article so the hero drop animation replays
  return <Page key={slug} article={ARTICLES[i]} next={ARTICLES[(i + 1) % ARTICLES.length]} />;
}

export default function App() {
  const web = useIsWeb(); // 900px and up: the 1440px web layout (src/web/); below: the phone layout (src/pages/)
  return (
    <>
      <ScrollManager />
      <Routes>
        <Route path="/" element={web ? <WebHome /> : <Home />} />
        {/* on web every write-up is on the home page's line */}
        <Route path="/articles" element={web ? <WebHome /> : <Articles />} />
        <Route path="/:section" element={<SectionRoute web={web} />} />
        <Route path="/articles/:slug" element={<ArticleRoute web={web} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {/* outside the routes so the banner's one <video> survives navigation */}
      <OrbitBanner />
      <Footer />
    </>
  );
}
