import { useEffect, useRef, useState } from 'react';
import WebHeader from '../../../web/WebHeader.jsx';
import PhoneHeader from '../../../phone/PhoneHeader.jsx';
import PhotoWallSection from '../../../shared/PhotoWallSection.jsx';
import PhotoViewer from '../../../shared/PhotoViewer.jsx';
import WordsGameSection from '../../../shared/WordsGameSection.jsx';
import TeamSection, { teamHeight } from '../../../shared/TeamSection.jsx';
import { PhoneBuddy, WebBuddy } from '../../../shared/buddy/Buddy.jsx';
import EndCards, { endCardsSpace } from '../../../shared/EndCards.jsx';
import { homeTitle, useEdition } from '../../../lib/edition.js';
import { usePauseEach } from '../../../lib/pauseOffscreen.js';
import { usePresence } from '../../../lib/usePresence.js';
import { FONT } from '../../../styles/fonts.js';
import Gate from './Gate.jsx';
import PandalMap, { mapHeight } from './PandalMap.jsx';
import { Awning, Banner, Canopy, Dashami, dashamiHeight } from './Frames.jsx';

// October's own home page, "a night of pandal hopping" (both layouts; src/editions/pages.js OWN_PAGES, for now behind
// lib/preview.js PANDAL: ?pandal=1). Top to bottom: the pandal gate with the issue in its arch (Gate.jsx), the route of
// articles as pandals on a winding road (PandalMap.jsx), the photo wall under a pandal canopy, the words game under a
// stall's awning, the team as "The Pujo Committee" (its faces in marigold rings), the Dashami goodbye, then the games
// and editions cards (Frames.jsx for the canopy, awning, banner and goodbye). The photo wall, words game and team are
// the shared sections, each moved to its place here (a box offset from where the shared home pages put it), so they
// work exactly as everywhere else. Like the shared home pages, an artboard: everything under the header is placed
// absolutely, and the page grows with the articles (mapHeight) and the team (teamHeight).
// SHARED: where the shared home pages put each section (the sections place themselves there: their own tables).
const SHARED = { web: { photos: 1090, words: 1910, team: 2570 }, phone: { photos: 1190, words: 1830, team: 2470 } };

// every section's top on this page, from the articles' and team's sizes
export function plan(edition, web) {
  const n = edition.articles.length, team = teamHeight(edition, web ? 'web' : 'phone');
  const map = web ? 1050 : 704;
  const photos = map + mapHeight(n, web) + (web ? 90 : 70);
  const words = photos + (web ? 760 : 600) + (web ? 140 : 100);
  const members = words + (web ? 600 : 650) + (web ? 70 : 30);
  const dashami = members + team + (web ? 30 : 30);
  const end = dashami + dashamiHeight(web) + (web ? 70 : 50);
  return { map, photos, words, members, dashami, end, height: end - 40 + endCardsSpace(web) };
}

function PandalHome({ web }) {
  const [photo, setPhoto] = useState(null);
  const [shownPhoto, photoLeaving] = usePresence(photo, 180);
  const edition = useEdition(), P = plan(edition, web), S = SHARED[web ? 'web' : 'phone'];
  useEffect(() => { document.title = homeTitle(edition); }, [edition]);
  const page = useRef(null);
  usePauseEach(page, '.pd-bulb,.pd-flag,.pd-flame,.oct-leaf,.oct-alpana,.oct-dhak,.oct-conch,.oct-twinkle,.spark,.bulb,.buddy-bob,.fl1,.fl2,.fl3,.fl4,.fl5,.fl6,.fk1,.fk2,.fk3,.fk4');
  const at = (y) => ({ position: "absolute", left: "0", top: `${y}px`, width: web ? "1440px" : "390px", height: "0" });
  const w = web ? 1440 : 390;
  const sheet = (
    <div id="top" ref={page} className={web ? 'page-sheet pd-home' : 'page-home page-sheet pd-home'} style={{ position: "relative", width: `${w}px`, height: `${P.height}px`, margin: "0 auto", overflow: "clip", background: "var(--page)", fontFamily: FONT.body, color: "var(--ink)" }}>
      {web ? <WebHeader /> : <PhoneHeader current="home" />}
      <Gate web={web} />
      {web ? <WebBuddy /> : <PhoneBuddy />}
      <PandalMap web={web} top={P.map} />
      <Canopy left={web ? 40 : 10} top={P.photos - (web ? 40 : 26)} width={web ? 1360 : 370} web={web} />
      <div style={at(P.photos - S.photos)}><PhotoWallSection web={web} onOpen={setPhoto} /></div>
      <Awning left={0} top={P.words - (web ? 76 : 50)} width={w} web={web} sign={web ? 'THE WORDS STALL · OPEN TILL DASHAMI' : 'WORDS STALL'} />
      <div style={at(P.words - S.words)}><WordsGameSection web={web} /></div>
      <div style={at(P.members - S.team)}>
        <TeamSection web={web} title={false} garland />
        <div style={{ position: "absolute", left: "0", top: `${S.team}px` }}><Banner web={web} /></div>
      </div>
      <Dashami web={web} top={P.dashami} />
      <EndCards web={web} top={P.end} />
    </div>
  );
  return web
    ? <div className="web">{sheet}{shownPhoto != null && <PhotoViewer web start={shownPhoto} closing={photoLeaving} onClose={() => setPhoto(null)} />}</div>
    : <>{sheet}{shownPhoto != null && <PhotoViewer start={shownPhoto} closing={photoLeaving} onClose={() => setPhoto(null)} />}</>;
}

export const WebPandalHome = () => <PandalHome web />;
export const PhonePandalHome = () => <PandalHome />;
