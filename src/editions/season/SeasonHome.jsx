import { useEffect, useRef, useState } from 'react';
import WebHeader from '../../web/WebHeader.jsx';
import PhoneHeader from '../../phone/PhoneHeader.jsx';
import PhotoViewer from '../../shared/PhotoViewer.jsx';
import FramedWords from '../../shared/FramedWords.jsx';
import Board from '../../shared/Board.jsx';
import { PhoneBuddy, WebBuddy } from '../../shared/buddy/Buddy.jsx';
import EndCards, { endCardsSpace } from '../../shared/EndCards.jsx';
import { homeTitle, useEdition } from '../../lib/edition.js';
import { useByWriter } from '../../lib/byWriter.js';
import { useReveal } from '../../lib/reveal.js';
import { usePresence } from '../../lib/usePresence.js';
import { FONT } from '../../styles/fonts.js';
import PhotoWall from './PhotoWall.jsx';

// The frame the newer editions' own home pages share (November 2026 on; src/editions/pages.js OWN_PAGES), so each month
// only draws what makes it different: its top (Hero), the way its articles are laid out (Stories: the month's twist),
// how its photos are dressed and its goodbye. Top to bottom: the header and Buddy, the Hero, the articles, the photos
// (PhotoWall.jsx, or the month's own), the words game (shared/FramedWords.jsx), the team (shared/Board.jsx), the
// goodbye, then the games and editions cards. Like October's annual, the parts flow one under another inside the
// artboard (1440 web, 390 phone wide; as tall as they need), so articles, photos and people can be added freely.
// Element ids for the section addresses: articles, photos, words, members.
// Colours: the page's own (its sky, its panels) come from the edition's look.js `home` (each key → --h-<key> on the
// page, so every colour still lives in look.js): page, ink (headings on the page), accent (kickers), aside (the
// handwritten asides) and any the month's parts use. Its CSS (class names <month>-…) goes in the edition's home.css.
// seasonHome(cfg) → { web, phone } home pages. cfg:
//   className  the page's class, for its CSS (e.g. 'nv-home')
//   Hero, Stories, Goodbye   the month's parts ({ web, list, isMine }: list = its articles, a writer's first)
//   Photos     optional: its own photo section body ({ web, onOpen }), else PhotoWall with photoClass
//   heads      { articles, photos, words, members }: each { kicker, title, aside } (members: kicker gets "· N OF US")
//   buddy      { web: { left, top }, phone: { left, top } }: Buddy's spot on the artboard (shared/buddy/Buddy.jsx)
//   viewer     the photo viewer's title
export function Head({ web, kicker, title, aside }) {
  return (
    <div className="ss-head" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "20px", margin: web ? "0 0 34px" : "0 0 22px", flexWrap: web ? "nowrap" : "wrap" }}>
      <div>
        {kicker && <div style={{ fontFamily: FONT.mono, fontSize: web ? "12px" : "10px", letterSpacing: "1.8px", color: "var(--h-accent)", marginBottom: web ? "8px" : "5px" }}>{kicker}</div>}
        <h2 style={{ margin: "0", fontFamily: FONT.head, fontWeight: "400", fontSize: web ? "80px" : "44px", lineHeight: "calc(0.98 * var(--head-lead, 1))", color: "var(--h-ink)" }}>{title}</h2>
      </div>
      {aside && <div style={{ maxWidth: web ? "400px" : "100%", fontFamily: FONT.hand, fontSize: web ? "28px" : "22px", lineHeight: "1.1", color: "var(--h-aside)", textAlign: web ? "right" : "left", transform: "rotate(-1.5deg)" }}>{aside}</div>}
    </div>
  );
}

function Part({ web, id, head, label, children }) {
  const ref = useRef(null);
  useReveal(ref);
  return (
    <section ref={ref} id={id} aria-label={label || head.title} style={{ marginTop: web ? "130px" : "72px" }}>
      <Head web={web} {...head} />
      {children}
    </section>
  );
}

function SeasonHome({ web, cfg }) {
  const [photo, setPhoto] = useState(null);
  const [shownPhoto, photoLeaving] = usePresence(photo, 180);
  const edition = useEdition(), { isMine, list } = useByWriter();
  useEffect(() => { document.title = homeTitle(edition); }, [edition]);
  const { Hero, Stories, Goodbye, Photos, heads } = cfg;
  const vars = Object.fromEntries(Object.entries(edition.look.home || {}).map(([k, v]) => [`--h-${k}`, v]));
  const sheet = (
    <div id="top" className={`${web ? '' : 'page-home '}ss-home ${cfg.className}`} style={{ position: "relative", width: web ? "1440px" : "390px", margin: "0 auto", overflow: "clip", background: "var(--h-page)", fontFamily: FONT.body, color: "var(--h-ink)", ...vars }}>
      {web ? <WebHeader /> : <PhoneHeader current="home" />}
      <div style={{ display: "contents", "--hand": "var(--h-aside)" }}>{web ? <WebBuddy at={cfg.buddy.web} /> : <PhoneBuddy at={cfg.buddy.phone} />}</div>{/* his "tap him" in the page's own hand colour */}
      <Hero web={web} list={list} isMine={isMine} />
      <div style={{ padding: `0 ${web ? 120 : 20}px` }}>
        <Part web={web} id="articles" head={heads.articles} label="Articles"><Stories web={web} list={list} isMine={isMine} /></Part>
        <Part web={web} id="photos" head={heads.photos} label="Photos">
          {Photos ? <Photos web={web} onOpen={setPhoto} /> : <PhotoWall web={web} onOpen={setPhoto} printClass={cfg.photoClass} />}
        </Part>
        <Part web={web} head={heads.words} label="Words game"><FramedWords web={web} className="ss-panel" /></Part>
        <Part web={web} id="members" head={{ ...heads.members, kicker: `${heads.members.kicker} · ${edition.members.length} OF US` }} label="The team">
          <div className="ss-panel ss-board" style={{ background: "var(--card)", border: "2px solid var(--ink)", padding: web ? "30px 34px 34px" : "18px 16px 20px" }}><Board web={web} /></div>
        </Part>
      </div>
      <Goodbye web={web} />
      <div style={{ position: "relative", height: `${endCardsSpace(web)}px`, marginTop: web ? "50px" : "34px" }}>
        <EndCards web={web} top={40} />
      </div>
    </div>
  );
  const viewer = shownPhoto != null && <PhotoViewer web={web} title={cfg.viewer} start={shownPhoto} closing={photoLeaving} onClose={() => setPhoto(null)} />;
  return web ? <div className="web">{sheet}{viewer}</div> : <>{sheet}{viewer}</>;
}

export function seasonHome(cfg) {
  return { web: () => <SeasonHome web cfg={cfg} />, phone: () => <SeasonHome cfg={cfg} /> };
}
