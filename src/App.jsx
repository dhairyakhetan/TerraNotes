import { useLayoutEffect } from 'react';
import { Navigate, Route, Routes, useLocation, useParams } from 'react-router';
import Home from './pages/Home.jsx';
import Articles from './pages/Articles.jsx';
import Article from './pages/Article.jsx';
import { ARTICLES } from './data/articles.js';

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

function ArticleRoute() {
  const { slug } = useParams();
  const i = ARTICLES.findIndex((a) => a.slug === slug);
  if (i === -1) return <Navigate to="/articles" replace />;
  // key: remount per article so the hero drop animation replays
  return <Article key={slug} article={ARTICLES[i]} next={ARTICLES[(i + 1) % ARTICLES.length]} />;
}

export default function App() {
  return (
    <>
      <ScrollManager />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/articles/:slug" element={<ArticleRoute />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
