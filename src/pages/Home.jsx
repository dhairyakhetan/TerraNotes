import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import MenuSheet from '../components/MenuSheet.jsx';
import HangingArticles from '../components/home/HangingArticles.jsx';
import PhotoWall from '../components/home/PhotoWall.jsx';
import WordsGame from '../components/home/WordsGame.jsx';
import Members from '../components/home/Members.jsx';
import PhotoViewer from '../components/home/PhotoViewer.jsx';
import { SITE } from '../data/site.js';
import { instagramUrl } from '../lib/format.js';

// Home. Everything below the sticky header is absolutely placed in a 390px-wide page.
// motion={false} turns off the sway/float animations.
export default function Home({ motion = true }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [photo, setPhoto] = useState(null); // index open in the photo viewer
  useEffect(() => { document.title = 'Aquaterra'; }, []);

  return (
    <>
      <div id="top" className={motion ? 'page-home' : 'page-home no-motion'} style={{ position: "relative", width: "390px", height: "3910px", margin: "0 auto", overflow: "clip", background: "#F3EEE4", fontFamily: "'Figtree', system-ui, sans-serif", color: "#1E2723" }}>
        {/* sticky header: the page root must stay overflow: clip (not hidden) for sticky to work */}
        <header className="site-header" style={{ position: "sticky", top: "0", zIndex: "50", width: "390px", height: "64px", boxSizing: "border-box", padding: "0 10px 0 16px", background: "#F3EEE4", borderBottom: "2px solid #111111", display: "flex", alignItems: "center", gap: "4px" }}>
          <Link aria-label="Aquaterra — home" style={{ display: "flex", alignItems: "center", gap: "6px", minHeight: "44px", textDecoration: "none" }} to="/">
            <img src="/logo.png" alt="" width="38" height="38" style={{ display: "block", width: "38px", height: "38px" }} />
            <span className="wordmark" style={{ fontFamily: "'Archivo Black', Impact, sans-serif", fontSize: "30px", lineHeight: "1", letterSpacing: "0.5px", textTransform: "uppercase" }}>Aquaterra</span>
          </Link>
          <span style={{ flexGrow: "1" }} />
          <button onClick={() => setMenuOpen(true)} aria-label="Open menu" aria-expanded={menuOpen ? 'true' : 'false'} style={{ width: "44px", height: "44px", flexShrink: "0", border: "0", background: "transparent", padding: "0", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="26" height="18" viewBox="0 0 26 18" fill="none" stroke="#1E2723" strokeWidth="1.8" strokeLinecap="round">
              <path d="M2 5 C9 3 17 6 24 4" />
              <path d="M8 13 C13 12 19 14 24 12" />
            </svg>
          </button>
        </header>
        {/* intro card; the red knot is where the "Articles" string is tied */}
        <section style={{ position: "absolute", left: "20px", top: "118px", width: "250px", transform: "rotate(-1deg)", zIndex: "3" }}>
          <div style={{ position: "absolute", left: "7px", top: "7px", width: "250px", height: "200px", background: "#111111" }} />
          <div style={{ position: "relative", width: "250px", height: "200px", boxSizing: "border-box", padding: "18px 20px", background: "#FFFFFF", border: "2px solid #111111", display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ fontFamily: "'Caveat', cursive", fontSize: "24px", lineHeight: "1", color: "#4B6647" }}>Introduction</div>
            <h1 style={{ margin: "0", fontFamily: "'Instrument Serif', Georgia, serif", fontWeight: "400", fontSize: "27px", lineHeight: "1.08" }}>Notes from where the land meets the water.</h1>
            <p style={{ margin: "0", fontSize: "13px", lineHeight: "1.5", color: "#4A524D" }}>{SITE.intro || '[Two or three lines introducing Aquaterra and what Terranotes is for.]'}</p>
          </div>
          <div style={{ position: "absolute", left: "68px", top: "194px", width: "14px", height: "14px", boxSizing: "border-box", borderRadius: "50%", background: "#F0442B", border: "2px solid #111111" }} />
        </section>
        <HangingArticles />
        <Link style={{ position: "absolute", right: "22px", top: "1122px", fontFamily: "'Caveat', cursive", fontSize: "22px", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px", minHeight: "44px" }} to="/articles">all articles{" "}<svg width="30" height="12" viewBox="0 0 30 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
          <path d="M1 7 C10 4 18 8 28 6" />
          <path d="M23 2 L28 6 L23 10" />
        </svg></Link>
        <PhotoWall onOpen={setPhoto} />
        <WordsGame />
        <Members />
        <footer style={{ position: "absolute", left: "0", top: "3720px", width: "390px", height: "190px", boxSizing: "border-box", padding: "26px 24px 0", borderTop: "1.5px solid #1E2723", display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <a href="#top" aria-label="Aquaterra — home" style={{ display: "flex", alignItems: "center", gap: "6px", minHeight: "44px", textDecoration: "none" }}>
              <img src="/logo.png" alt="" width="32" height="32" style={{ display: "block", width: "32px", height: "32px" }} />
              <span className="wordmark" style={{ fontFamily: "'Archivo Black', Impact, sans-serif", fontSize: "25px", lineHeight: "1", letterSpacing: "0.5px", textTransform: "uppercase" }}>Aquaterra</span>
            </a>
            <a href={instagramUrl(SITE.instagram)} target="_blank" rel="noreferrer" style={{ fontSize: "13px", textDecoration: "none", padding: "12px 0" }}>{`@${SITE.instagram}`}</a>
          </div>
          <nav style={{ display: "flex", flexWrap: "wrap", gap: "4px 18px", fontSize: "14px" }}>
            <Link to="/articles" style={{ textDecoration: "none", padding: "10px 0" }}>Articles</Link>
            <a href="#photos" style={{ textDecoration: "none", padding: "10px 0" }}>Photos</a>
            <a href="#words" style={{ textDecoration: "none", padding: "10px 0" }}>Words</a>
            <a href="#members" style={{ textDecoration: "none", padding: "10px 0" }}>Members</a>
          </nav>
          <div style={{ fontSize: "12px", color: "#4A524D" }}>Terranotes · © {new Date().getFullYear()}</div>
        </footer>
      </div>
      <MenuSheet open={menuOpen} onClose={() => setMenuOpen(false)} current="home" />
      {photo != null && <PhotoViewer start={photo} onClose={() => setPhoto(null)} />}
    </>
  );
}
