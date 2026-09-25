import { useEffect, useState } from 'react';
import { usePresence } from '../lib/presence.js';
import { Link } from 'react-router';
import MenuSheet from '../components/MenuSheet.jsx';
import HangingArticles, { HANG_EXTRA } from '../components/home/HangingArticles.jsx';
import PhotoWall from '../components/home/PhotoWall.jsx';
import WordsGame from '../components/home/WordsGame.jsx';
import Members, { MEMBERS_HEIGHT } from '../components/home/Members.jsx';
import Labs, { LABS_HEIGHT } from '../components/home/Labs.jsx';
import PhotoViewer from '../components/home/PhotoViewer.jsx';
import { SITE } from '../data/site.js';
import Logo from '../components/Logo.jsx';
import { PhoneBuddy } from '../components/buddy/Buddy.jsx';

// Home. Everything below the sticky header is absolutely placed in a 390px-wide page.
// motion={false} turns off the sway/float animations.
export default function Home({ motion = true }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [photo, setPhoto] = useState(null); // index open in the photo viewer
  const [shownPhoto, photoLeaving] = usePresence(photo, 180); // stays mounted while it fades out
  useEffect(() => { document.title = 'Aquaterra'; }, []);
  const shift = HANG_EXTRA; // the hanging articles (all six) run taller than the page was drawn for, so everything below moves down

  return (
    <>
      <div id="top" className={motion ? 'page-home' : 'page-home no-motion'} style={{ position: "relative", width: "390px", height: `${2480 + MEMBERS_HEIGHT + LABS_HEIGHT + shift}px`, margin: "0 auto", overflow: "clip", background: "#F3EEE4", fontFamily: "'Figtree', system-ui, sans-serif", color: "#1E2723" }}>
        {/* sticky header: the page root must stay overflow: clip (not hidden) for sticky to work */}
        <header className="site-header" style={{ position: "sticky", top: "0", zIndex: "50", width: "390px", height: "64px", boxSizing: "border-box", padding: "0 10px 0 16px", background: "#F3EEE4", borderBottom: "2px solid #111111", display: "flex", alignItems: "center", gap: "4px" }}>
          <Link aria-label="Aquaterra — home" style={{ display: "flex", alignItems: "center", gap: "6px", minHeight: "44px", textDecoration: "none" }} to="/">
            <Logo globe={38} word={22} sub={14} />
          </Link>
          <span style={{ flexGrow: "1" }} />
          <button onClick={() => setMenuOpen(true)} aria-label="Open menu" aria-expanded={menuOpen ? 'true' : 'false'} style={{ width: "44px", height: "44px", flexShrink: "0", border: "0", background: "transparent", padding: "0", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="26" height="18" viewBox="0 0 26 18" fill="none" stroke="#1E2723" strokeWidth="1.8" strokeLinecap="round">
              <path d="M2 5 C9 3 17 6 24 4" />
              <path d="M8 13 C13 12 19 14 24 12" />
            </svg>
          </button>
        </header>
        <PhoneBuddy />
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
        {/* /articles lands here (just above the "Articles" card) */}
        <div id="articles" aria-hidden="true" style={{ position: "absolute", left: "0", top: "236px", width: "1px", height: "1px" }} />
        {/* zero-height box at the page's corner: the hanging articles keep their page coordinates */}
        <div style={{ position: "absolute", left: "0", top: "0", width: "390px", height: "0" }}>
          <HangingArticles />
        </div>
        {/* the photo wall, words, team and AQ Labs, moved down by the hanging view's extra height */}
        <div style={{ position: "absolute", left: "0", top: `${shift}px`, width: "390px", height: "0" }}>
          <PhotoWall onOpen={setPhoto} />
          <WordsGame />
          <Members />
          <Labs top={2480 + MEMBERS_HEIGHT} />
        </div>
      </div>
      <MenuSheet open={menuOpen} onClose={() => setMenuOpen(false)} current="home" />
      {shownPhoto != null && <PhotoViewer start={shownPhoto} closing={photoLeaving} onClose={() => setPhoto(null)} />}
    </>
  );
}
