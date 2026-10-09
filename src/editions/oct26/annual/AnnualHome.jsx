import { useEffect, useState } from 'react';
import WebHeader from '../../../web/WebHeader.jsx';
import PhoneHeader from '../../../phone/PhoneHeader.jsx';
import PhotoViewer from '../../../shared/PhotoViewer.jsx';
import WordsGameSection from '../../../shared/WordsGameSection.jsx';
import { PhoneBuddy, WebBuddy } from '../../../shared/buddy/Buddy.jsx';
import EndCards, { endCardsSpace } from '../../../shared/EndCards.jsx';
import { homeTitle, useEdition } from '../../../lib/edition.js';
import { useByWriter } from '../../../lib/byWriter.js';
import { usePresence } from '../../../lib/usePresence.js';
import { FONT } from '../../../styles/fonts.js';
import Cover from './Cover.jsx';
import Contents from './Contents.jsx';
import Stories from './Stories.jsx';
import Photos from './Photos.jsx';
import Board from './Board.jsx';
import BackCover from './BackCover.jsx';
import { Folio, Head, pagesOf } from './parts.jsx';

// October's own home page, "the Pujo annual" (both layouts; src/editions/pages.js OWN_PAGES): every Pujo, Bengal's
// magazines bring out a fat special issue, the Pujabarshiki, and this page is TerraNotes' one, laid out like print.
// Top to bottom: the front cover (Cover.jsx), the contents page and a note from the editors (Contents.jsx), the
// stories, the lead one as a spread (Stories.jsx), the photographs (Photos.jsx), the puzzle corner (the shared words
// game, framed), the editorial board (Board.jsx), the back cover's goodbye (BackCover.jsx), then the games and editions
// cards. Each part starts with a folio and a page number (parts.jsx). Unlike the shared home pages, the parts flow one
// under another inside the artboard (its width fixed, its height whatever they need), so stories, photos and people can
// be added freely. The words game is the shared section (it places itself on the shared page's artboard), moved into
// its frame by an offset box. Element ids for the section addresses: articles, photos, words, members.
// SHARED_WORDS: where the shared words game places itself and its size (WordsGameSection.jsx), and how it's fitted into
// the page's column: its content spans x 70–1360 on web (10–380 on phones), wider than the column, so it's drawn a
// little smaller (scale) and shifted (left) to sit centred in the frame
const SHARED_WORDS = { web: { top: 1910, height: 600, scale: 0.88, left: -32, pad: 18 }, phone: { top: 1830, height: 650, scale: 0.92, left: -7, pad: 12 } };

function Puzzle({ web }) {
  const { articles } = useEdition(), S = SHARED_WORDS[web ? 'web' : 'phone'];
  return (
    <section aria-label="Puzzle corner" style={{ marginTop: web ? "110px" : "64px" }}>
      <Folio web={web} page={pagesOf(articles.length).puzzle} label="puzzle corner" />
      <Head web={web} kicker="DHADHA · PUZZLE" title="Puzzle corner" aside="five words, three guesses each. no googling" />
      <div style={{ position: "relative", height: `${Math.round(S.height * S.scale) + S.pad}px`, background: "var(--card)", border: "3px double var(--ink)", overflow: "clip" }}>
        <div style={{ position: "absolute", left: `${S.left}px`, top: `${S.pad - 4}px`, width: web ? "1440px" : "390px", height: "0", transform: `scale(${S.scale})`, transformOrigin: "0 0" }}>
          <div style={{ position: "absolute", left: "0", top: `${-S.top}px`, width: "100%", height: "0" }}><WordsGameSection web={web} /></div>
        </div>
      </div>
    </section>
  );
}

function AnnualHome({ web }) {
  const [photo, setPhoto] = useState(null);
  const [shownPhoto, photoLeaving] = usePresence(photo, 180);
  const edition = useEdition(), { isMine, list } = useByWriter();
  useEffect(() => { document.title = homeTitle(edition); }, [edition]);
  const w = web ? 1440 : 390, pad = web ? 120 : 20;
  const sheet = (
    <div id="top" className={web ? 'an-home' : 'page-home an-home'} style={{ position: "relative", width: `${w}px`, margin: "0 auto", overflow: "clip", background: "var(--page)", fontFamily: FONT.body, color: "var(--ink)" }}>
      {web ? <WebHeader /> : <PhoneHeader current="home" />}
      {web ? <WebBuddy at={{ left: 1338, top: 112 }} /> : <PhoneBuddy at={{ left: 282, top: 776 }} />}{/* his own spot: right of the cover (web), right of the Contents heading (phone) */}
      <Cover web={web} lead={list[0]} lines={list.slice(0, 3)} />
      <div style={{ padding: `0 ${pad}px` }}>
        <Contents web={web} list={list} />
        <Stories web={web} list={list} isMine={isMine} />
        <Photos web={web} onOpen={setPhoto} />
        <Puzzle web={web} />
        <Board web={web} />
      </div>
      <BackCover web={web} />
      <div style={{ position: "relative", height: `${endCardsSpace(web)}px`, marginTop: web ? "40px" : "30px" }}>
        <EndCards web={web} top={40} />
      </div>
    </div>
  );
  return web
    ? <div className="web">{sheet}{shownPhoto != null && <PhotoViewer web title="Photographs" start={shownPhoto} closing={photoLeaving} onClose={() => setPhoto(null)} />}</div>
    : <>{sheet}{shownPhoto != null && <PhotoViewer title="Photographs" start={shownPhoto} closing={photoLeaving} onClose={() => setPhoto(null)} />}</>;
}

export const WebAnnualHome = () => <AnnualHome web />;
export const PhoneAnnualHome = () => <AnnualHome />;
