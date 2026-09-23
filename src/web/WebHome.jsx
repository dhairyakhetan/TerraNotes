import { useEffect, useState } from 'react';
import WebHeader from './WebHeader.jsx';
import ArticleLine from './ArticleLine.jsx';
import WebPhotoWall from './WebPhotoWall.jsx';
import WebWords from './WebWords.jsx';
import WebMembers, { WEB_MEMBERS_HEIGHT } from './WebMembers.jsx';
import WebPhotoViewer from './WebPhotoViewer.jsx';
import { NUMBER_WORDS } from '../components/home/Members.jsx';
import { ARTICLES } from '../data/articles.js';
import { SITE } from '../data/site.js';

const DOT = <span style={{ color: "#3DA5F4" }}>.</span>;

// Home, web layout. Everything below the sticky header is absolutely placed in a 1440px-wide page.
export default function WebHome() {
  const [photo, setPhoto] = useState(null); // index open in the photo viewer
  useEffect(() => { document.title = 'Aquaterra'; }, []);
  const count = NUMBER_WORDS[ARTICLES.length] || String(ARTICLES.length);

  return (
    <div className="web">
      {/* the root must stay overflow: clip (not hidden) for the sticky header to work */}
      <div id="top" style={{ position: "relative", width: "1440px", height: `${2610 + WEB_MEMBERS_HEIGHT}px`, margin: "0 auto", overflow: "clip", background: "#F3EEE4", fontFamily: "'Figtree', system-ui, sans-serif", color: "#111111" }}>
        <WebHeader />
        {/* intro card; the red knot is where the "Articles" string is tied */}
        <section style={{ position: "absolute", left: "80px", top: "124px", width: "520px", transform: "rotate(-1deg)", zIndex: "3" }}>
          <div style={{ position: "absolute", left: "10px", top: "10px", width: "520px", height: "300px", background: "#111111" }} />
          <div style={{ position: "relative", width: "520px", height: "300px", boxSizing: "border-box", padding: "30px 34px", background: "#FFFFFF", border: "2px solid #111111", display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ fontFamily: "'Caveat', cursive", fontSize: "30px", lineHeight: "1", color: "#4B6647" }}>Introduction</div>
            <h1 style={{ margin: "0", fontFamily: "'Instrument Serif', Georgia, serif", fontWeight: "400", fontSize: "50px", lineHeight: "1.02" }}>Notes from where the land meets the water.</h1>
            <p style={{ margin: "0", fontSize: "16px", lineHeight: "1.55", color: "#4A524D" }}>{SITE.intro || '[Two or three lines introducing Aquaterra and what Terranotes is for.]'}</p>
          </div>
          <div style={{ position: "absolute", left: "112px", top: "292px", width: "16px", height: "16px", boxSizing: "border-box", borderRadius: "50%", background: "#F0442B", border: "2px solid #111111" }} />
        </section>
        {/* masthead */}
        <div style={{ position: "absolute", left: "720px", top: "132px", fontFamily: "'Space Mono', monospace", fontSize: "12px", letterSpacing: "1.8px" }}>TERRANOTES · WRITE-UPS, PHOTOS &amp; WORDS</div>
        <div style={{ position: "absolute", left: "716px", top: "160px", fontFamily: "'Archivo Black', Impact, sans-serif", fontSize: "96px", lineHeight: "0.9", letterSpacing: "-2px", textTransform: "uppercase", color: "#111111" }}>
          <div>Land{DOT}</div>
          <div style={{ paddingLeft: "70px" }}>Water{DOT}</div>
          <div style={{ paddingLeft: "20px" }}>City{DOT}</div>
        </div>
        <div style={{ position: "absolute", left: "1150px", top: "380px", width: "220px", fontFamily: "'Caveat', cursive", fontSize: "26px", lineHeight: "1.05", color: "#5B3A1E", transform: "rotate(-4deg)" }}>{`${count} write-ups, fresh off the line ↓`}</div>
        <ArticleLine />
        <WebPhotoWall onOpen={setPhoto} />
        <WebWords />
        <WebMembers />
      </div>
      {photo != null && <WebPhotoViewer start={photo} onClose={() => setPhoto(null)} />}
    </div>
  );
}
