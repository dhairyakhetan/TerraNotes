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

// On navigation: jump to the #section when the URL has one, otherwise start at the top.
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useLayoutEffect(() => {
    const target = hash && document.getElementById(decodeURIComponent(hash.slice(1)));
    if (target) target.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

function ArticleRoute({ web }) {
  const { slug } = useParams();
  const i = ARTICLES.findIndex((a) => a.slug === slug);
  if (i === -1) return <Navigate to={web ? '/#articles' : '/articles'} replace />;
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
        <Route path="/articles" element={web ? <Navigate to="/#articles" replace /> : <Articles />} />
        <Route path="/articles/:slug" element={<ArticleRoute web={web} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {/* outside the routes so the banner's one <video> survives navigation */}
      <OrbitBanner />
      <Footer />
    </>
  );
}
