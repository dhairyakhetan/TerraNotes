import { useEffect, useState } from 'react';
import WebHeader from './WebHeader.jsx';
import WebArticleLine from './WebArticleLine.jsx';
import HomeIntroCard from '../shared/HomeIntroCard.jsx';
import PhotoWallSection from '../shared/PhotoWallSection.jsx';
import PhotoViewer from '../shared/PhotoViewer.jsx';
import WordsGameSection from '../shared/WordsGameSection.jsx';
import TeamSection, { teamHeight } from '../shared/TeamSection.jsx';
import { WebBuddy } from '../shared/buddy/Buddy.jsx';
import { homeTitle, useEdition } from '../lib/edition.js';
import { usePresence } from '../lib/usePresence.js';
import { FONT } from '../styles/fonts.js';

// The web home page of an edition (the latest's at /, also at /articles, /photos, /words, /members, scrolled to that
// section; an older one's at /sep26…): a 1440px page where everything under the sticky header is absolutely placed.
// Intro card + "Land. Water. City." masthead, Buddy's corner, the sideways article line, photo wall, words game, team.
const DOT = <span style={{ color: "var(--blue)" }}>.</span>;

export default function WebHome() {
  const [photo, setPhoto] = useState(null); // index open in the photo viewer
  const [shownPhoto, photoLeaving] = usePresence(photo, 180);
  const edition = useEdition();
  useEffect(() => { document.title = homeTitle(edition); }, [edition]);

  return (
    <div className="web">
      <div id="top" style={{ position: "relative", width: "1440px", height: `${2610 + teamHeight(edition, 'web')}px`, margin: "0 auto", overflow: "clip", background: "var(--page)", fontFamily: FONT.body, color: "var(--ink)" }}>
        <WebHeader />
        <HomeIntroCard web />
        <div style={{ position: "absolute", left: "720px", top: "132px", fontFamily: FONT.mono, fontSize: "12px", letterSpacing: "1.8px" }}>TERRANOTES · WRITE-UPS, PHOTOS &amp; WORDS</div>
        <div style={{ position: "absolute", left: "716px", top: "160px", fontFamily: FONT.head, fontSize: "96px", lineHeight: "0.9", letterSpacing: "-2px", textTransform: "uppercase", color: "var(--ink)" }}>
          <div>Land{DOT}</div>
          <div style={{ paddingLeft: "70px" }}>Water{DOT}</div>
          <div style={{ paddingLeft: "20px" }}>City{DOT}</div>
        </div>
        <div style={{ position: "absolute", left: "1150px", top: "380px", width: "220px", fontFamily: FONT.hand, fontSize: "26px", lineHeight: "1.05", color: "var(--hand)", transform: "rotate(-4deg)" }}>write-ups, fresh off the line ↓</div>
        <WebBuddy />
        {edition.articles.length > 0 && <WebArticleLine />}
        <PhotoWallSection web onOpen={setPhoto} />
        <WordsGameSection web />
        <TeamSection web />
      </div>
      {shownPhoto != null && <PhotoViewer web start={shownPhoto} closing={photoLeaving} onClose={() => setPhoto(null)} />}
    </div>
  );
}
