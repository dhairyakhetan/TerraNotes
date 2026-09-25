import { useEffect, useState } from 'react';
import PhoneHeader from './PhoneHeader.jsx';
import PhoneHangingArticles, { HANG_EXTRA } from './PhoneHangingArticles.jsx';
import HomeIntroCard from '../shared/HomeIntroCard.jsx';
import PhotoWallSection from '../shared/PhotoWallSection.jsx';
import PhotoViewer from '../shared/PhotoViewer.jsx';
import WordsGameSection from '../shared/WordsGameSection.jsx';
import TeamSection, { TEAM_HEIGHT } from '../shared/TeamSection.jsx';
import { PhoneBuddy } from '../shared/buddy/Buddy.jsx';
import { usePresence } from '../lib/usePresence.js';
import { FONT } from '../styles/fonts.js';

// The phone home page (also at /articles, /photos, /words, /members, scrolled to that section): a 390px page where
// everything under the sticky header is absolutely placed. Top to bottom: intro card, hanging articles, photo wall,
// words game, team. The articles run HANG_EXTRA taller than the original design, so everything after them sits in a
// box moved down by that much (the sections keep their design coordinates).
export default function PhoneHome() {
  const [photo, setPhoto] = useState(null); // index open in the photo viewer
  const [shownPhoto, photoLeaving] = usePresence(photo, 180);
  useEffect(() => { document.title = 'Aquaterra'; }, []);

  return (
    <>
      <div id="top" className="page-home" style={{ position: "relative", width: "390px", height: `${2480 + TEAM_HEIGHT.phone + HANG_EXTRA}px`, margin: "0 auto", overflow: "clip", background: "#F3EEE4", fontFamily: FONT.body, color: "#1E2723" }}>
        <PhoneHeader current="home" />
        <PhoneBuddy />
        <HomeIntroCard />
        <div id="articles" aria-hidden="true" style={{ position: "absolute", left: "0", top: "236px", width: "1px", height: "1px" }} />
        <div style={{ position: "absolute", left: "0", top: "0", width: "390px", height: "0" }}>
          <PhoneHangingArticles />
        </div>
        <div style={{ position: "absolute", left: "0", top: `${HANG_EXTRA}px`, width: "390px", height: "0" }}>
          <PhotoWallSection onOpen={setPhoto} />
          <WordsGameSection />
          <TeamSection />
        </div>
      </div>
      {shownPhoto != null && <PhotoViewer start={shownPhoto} closing={photoLeaving} onClose={() => setPhoto(null)} />}
    </>
  );
}
