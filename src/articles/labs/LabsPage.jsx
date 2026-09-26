import { Fragment, memo, useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import PhoneHeader from '../../phone/PhoneHeader.jsx';
import WebHeader from '../../web/WebHeader.jsx';
import { TAGS } from '../../data/articles.js';
import { articleFolder, articleLink } from '../../data/editions.js';
import { LABS_TEAMS as TEAMS } from '../../data/labs.js';
import { calm, LITE } from '../../lib/motion.js';

// The "labs" article's own page (data/articles.js: page: 'labs'): the AQ Labs gallery, ported from the AQ Labs team's
// own site, so it keeps their design (styles: ./labs.css). Both layouts from one component (web: 1440px artboard with
// the web header; phone: 390px with the phone header). Top to bottom: the site header; a sticky bar with a folder tab
// per team (lights up for the chapter on screen), in-page search and "Apply"; the dark intro (floating screenshots,
// "AQ Labs", a shelf of 3D books, one per team); a ticker; one full-screen chapter per team, each with its own signature (contact
// sheet, dashboard, arcade screen, game HUD, orbit, typed claim, crossfading object, dealt cards); the outro.
// Photos: public/editions/<id>/articles/labs/<team>/ (this article's folder). Text is the team's, word for word.
// Behaviour (all skipped or stilled with reduced motion; LITE stops the loops, lib/motion.js):
// - chapters fade/slide in each time they come into view (.in); loops pause when their section is off screen;
// - web: the page snaps to chapters (html.labs-snap); the tab bar, the rack and "walk the gallery" glide to them;
// - each chapter has its own address, /articles/labs/<id> (ids: data/labs.js), shown when you jump there and dropped
//   again once you scroll a screen away (lib/scrollMemory.js); Wisdom Woods' demo opens in a new tab at
//   /articles/labs/wisdom-woods/demo (pages/DemoPage.jsx; its files: this article's folder, wisdom-woods/demo/);
// - each chapter title brightens as it nears the middle of the window (on scroll, not every frame);
// - search: type to highlight every match on the page, Enter / ↓ for the next; tabs with matches get a red dot.

const oneLine = (label) => label.replace('|', '');
const folded = (label) => label.split('|').map((part, i) => <Fragment key={i}>{i > 0 && <br />}{part}</Fragment>);
const ON = { tomato: 'var(--cream)', sky: 'var(--ink)', pink: 'var(--ink)', mint: 'var(--cream)', lemon: 'var(--ink)', grape: 'var(--cream)' }; // text on each accent
const tint = (c) => ({ '--c': `var(--${c})`, '--tc': ON[c] });
// every photo (in this article's folder) and its size in px
const SIZE = {
  'karyaarth/still-01.webp': [1100, 606], 'karyaarth/still-02.webp': [1100, 585], 'karyaarth/still-03.webp': [1100, 594],
  'karyaarth/still-04.webp': [1100, 586], 'karyaarth/still-05.webp': [1100, 657], 'karyaarth/still-06.webp': [900, 1686],
  'karyaarth/still-07.webp': [880, 496], 'karyaarth/still-08.webp': [880, 458], 'karyaarth/still-09.webp': [1100, 637],
  'karyaarth/still-10.webp': [900, 1637], 'career-compass/site-home.webp': [1400, 464], 'career-compass/site-find-your-path.webp': [1017, 868],
  'cirqle/poster.webp': [880, 1956], 'hunar/site.webp': [1400, 636], 'photon/band.webp': [784, 1168],
  'photon/sheet-parts.webp': [1280, 853], 'photon/sheet-design.webp': [1280, 700], 'photon/sheet-lock.webp': [1280, 853],
  'quirk/breadboard.webp': [1280, 960], 'quirk/site-meet-quirk.webp': [1400, 631], 'quirk/site-play-now.webp': [1400, 640],
  'quirk/oled-test.webp': [1000, 563], 'quirk/player-one.webp': [1000, 563], 'wisdom-woods/poster.webp': [1000, 563],
  'wisdom-woods/app-enter.webp': [880, 427], 'wisdom-woods/app-question.webp': [880, 403],
};
const KARYAARTH = ['karyaarth street vendor documentary', 'a tea stall owner mid-pour at his roadside counter', 'an ice cream cart vendor waiting for customers',
  'a street craftsman at work with his tools', 'a vendor arranging goods at his stall', 'a shopkeeper behind his counter at dusk',
  'a roadside seller framed against the street', 'hands at work preparing food on a cart', 'a portrait of a local vendor looking to camera', 'a street performer captured mid-act'];
// the intro's scattered screenshots: [photo, tilt, bob delay, web box]; on phone three hang off each side, faded
const FLOATS = [
  ['karyaarth/still-01.webp', '-8deg', '0s', { top: '9%', left: '2%', width: '180px', height: '150px' }],
  ['career-compass/site-home.webp', '-10deg', '.7s', { top: '40%', left: '5%', width: '172px', height: '150px' }],
  ['quirk/site-meet-quirk.webp', '5deg', '1.3s', { bottom: '2%', left: '3%', width: '205px', height: '150px' }],
  ['wisdom-woods/poster.webp', '7deg', '.4s', { top: '11%', right: '3%', width: '200px', height: '150px' }],
  ['cirqle/poster.webp', '8deg', '1s', { top: '42%', right: '5%', width: '170px', height: '150px' }],
  ['hunar/site.webp', '-6deg', '1.6s', { bottom: '2%', right: '2%', width: '150px', height: '172px' }],
];
const PHONE_FLOAT = (i) => ({ top: ['8%', '40%', '72%'][i % 3], [i < 3 ? 'left' : 'right']: i % 3 === 1 ? '-26px' : '-14px', width: '120px', height: '104px' });
// each team's book on the intro shelf (Book): [thickness in px (phone: ×0.77), height in % of the shelf]; the two-line
// titles need the thicker ones
const BOOKS = [[84, 90], [112, 96], [80, 84], [108, 98], [106, 88], [82, 86], [88, 93], [112, 95]];
const TICKER = ['AQ LABS', '2026', 'KOLKATA', '08 WORKS', 'ONE ROOM', 'STUDENT BUILT', 'GOT OUT OF HAND'];
const DOTS = ['tomato', 'sky', 'pink', 'mint', 'lemon', 'grape', 'tomato'];
const CLAIM = ['not a training problem.', 'a placement problem.'];
const TRUST = [['institute', 'highest', '100%'], ['employer', 'high', '78%'], ['portfolio', 'moderate', '52%'], ['peer', 'low', '28%'], ['self-declared', 'none', '6%']];
const SUITS = [
  ['-22deg', '14px', 'pink', '⧖', 'SUIT 01', 'Procrast­ination', 'the mechanics of later'],
  ['-11deg', '2px', 'lemon', '◈', 'SUIT 02', 'Money', 'why it felt like a personality'],
  ['0deg', '-6px', 'psky', '◲', 'SUIT 03', 'Stress & Freeze', 'the body acting without asking'],
  ['11deg', '2px', 'grape', '☾', 'SUIT 04', 'Impulse & Regret', 'the 2am pipeline'],
  ['22deg', '14px', 'ptom', '☰', 'SUIT 05', 'Stories You Tell', 'the lies with good PR'],
];
const OUT = { target: '_blank', rel: 'noreferrer' };

const behavior = () => (calm() ? 'auto' : 'smooth');
// "copy chapter link": the chapter's own address
async function copyLink(e, url) {
  const btn = e.currentTarget;
  try { await navigator.clipboard.writeText(url); } catch { return; }
  const was = btn.textContent;
  btn.textContent = '✓ copied';
  setTimeout(() => { btn.textContent = was; }, 1600);
}
const smooth = (t) => { t = Math.min(1, Math.max(0, t)); return t * t * (3 - 2 * t); };

// ---- search: every text match inside `root`, as Ranges. Text nodes in one block are read as one string, so a match
// can run across inline pieces ("training problem" over the word-by-word spans); blocks are kept apart.
const BLOCK = 'p,h1,h2,li,figcaption,a,button,.pill,.cr-tag,.cm-k,.cm-t,.l,.n,.hn,.hs,.hnm,.hg,.eh-k,.eh-t,.pc-k,.bl,.bv,.sectlabel,.mono,div';
function findAll(root, query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const nodes = [], starts = [];
  let text = '', block = null;
  const walk = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => (n.parentElement.closest('[aria-hidden="true"]') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
  });
  for (let n = walk.nextNode(); n; n = walk.nextNode()) {
    const b = n.parentElement.closest(BLOCK);
    if (b !== block) { text += '\u0000'; block = b; }
    nodes.push(n); starts.push(text.length); text += n.data.toLowerCase();
  }
  const at = (i) => { let k = starts.length - 1; while (starts[k] > i) k--; return k; }; // the node holding character i
  const out = [];
  for (let i = text.indexOf(q); i !== -1; i = text.indexOf(q, i + q.length)) {
    const a = at(i), b = at(i + q.length - 1), r = new Range();
    r.setStart(nodes[a], i - starts[a]);
    r.setEnd(nodes[b], i + q.length - starts[b]);
    out.push(r);
  }
  return out;
}
const HL = typeof CSS !== 'undefined' && !!CSS.highlights && typeof Highlight === 'function';
const unmark = () => { if (HL) { CSS.highlights.delete('labs-find'); CSS.highlights.delete('labs-find-now'); } };

// The sticky bar: team tabs (the one on screen lit, scrolled into view on phone), search, apply; the find row under it.
function LabsBar({ main, base, go }) {
  const [active, setActive] = useState(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [hits, setHits] = useState({ ranges: [], teams: new Set(), cur: 0 });
  const tabs = useRef(null), input = useRef(null), btn = useRef(null);

  useEffect(() => { // scroll spy: the chapter across the middle of the window (none while it's the intro or the outro)
    const spy = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) setActive(e.target.id || null); }), { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('.labs section.chapter').forEach((s) => spy.observe(s));
    return () => spy.disconnect();
  }, []);
  useEffect(() => { // keep the lit tab in view when the tabs scroll sideways (phone)
    const bar = tabs.current, tab = active && bar.querySelector(`[data-spy="${active}"]`);
    if (bar.scrollWidth > bar.clientWidth) bar.scrollTo({ left: tab ? tab.offsetLeft - (bar.clientWidth - tab.offsetWidth) / 2 : 0, behavior: behavior() });
  }, [active]);

  useEffect(() => { // new query: find everything, mark it, go to the first match
    if (!open) return;
    const ranges = findAll(main.current, query);
    const teams = new Set(ranges.map((r) => r.startContainer.parentElement.closest('section[data-team]')?.id).filter(Boolean));
    setHits({ ranges, teams, cur: 0 });
    if (HL) CSS.highlights.set('labs-find', new Highlight(...ranges));
  }, [query, open]);
  useEffect(() => { // the current match: marked brighter and scrolled to the middle of the window (or its row, sideways)
    const r = hits.ranges[hits.cur];
    if (!r || !r.startContainer.isConnected) { if (HL) CSS.highlights.delete('labs-find-now'); return; }
    if (HL) CSS.highlights.set('labs-find-now', new Highlight(r));
    const el = r.startContainer.parentElement;
    el.scrollIntoView({ block: 'center', inline: 'nearest', behavior: behavior() });
    if (!HL) { el.classList.add('flash'); setTimeout(() => el.classList.remove('flash'), 1200); }
  }, [hits]);
  useEffect(() => { // while searching the page doesn't snap to chapters (it would pull away from the match)
    if (!open) return undefined;
    document.documentElement.classList.add('labs-finding');
    input.current.focus();
    return () => document.documentElement.classList.remove('labs-finding');
  }, [open]);
  useEffect(() => unmark, []);

  const step = (d) => setHits((h) => (h.ranges.length ? { ...h, cur: (h.cur + d + h.ranges.length) % h.ranges.length } : h));
  const close = () => { setOpen(false); setQuery(''); setHits({ ranges: [], teams: new Set(), cur: 0 }); unmark(); btn.current.focus(); };
  const n = hits.ranges.length;
  return (
    <div className="labs-bar">
      <nav className="labs-tabs" ref={tabs} aria-label="Teams">
        {TEAMS.map((t, i) => (
          <a key={t.id} className={`tab${active === t.id ? ' on' : ''}${hits.teams.has(t.id) ? ' hit' : ''}`} data-spy={t.id} href={`${base}/${t.id}`} onClick={(e) => go(e, t.id)} style={tint(t.c)} aria-current={active === t.id ? 'true' : undefined}>
            <span className="tnum">{String(i + 1).padStart(2, '0')}</span><span className="tname">{oneLine(t.label)}</span>
          </a>
        ))}
      </nav>
      <div className="labs-tools">
        <button ref={btn} type="button" className="searchbtn" aria-label="Search this article" aria-expanded={open ? 'true' : 'false'} onClick={() => (open ? close() : setOpen(true))}>⌕</button>
        <a className="applybtn" href="https://www.instagram.com/ngo.aquaterra" {...OUT}>Apply →</a>
      </div>
      {open && (
        <div className="labs-find" role="search">
          <input ref={input} type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="search the gallery…" aria-label="Search the gallery" enterKeyHint="search"
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); step(e.shiftKey ? -1 : 1); } else if (e.key === 'Escape') close(); }} />
          <span className="count" aria-live="polite">{query.trim() ? (n ? `${hits.cur + 1} / ${n}` : 'none') : ''}</span>
          <button type="button" onClick={() => step(-1)} disabled={!n} aria-label="Previous match">↑</button>
          <button type="button" onClick={() => step(1)} disabled={!n} aria-label="Next match">↓</button>
          <button type="button" onClick={close} aria-label="Close search">✕</button>
        </div>
      )}
    </div>
  );
}

// "↑" in the corner once you're past the intro
function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(scrollY > innerHeight * 0.8);
    on();
    addEventListener('scroll', on, { passive: true });
    return () => removeEventListener('scroll', on);
  }, []);
  return <button type="button" className={`fab${show ? ' show' : ''}`} aria-label="Back to top" tabIndex={show ? 0 : -1} onClick={() => scrollTo({ top: 0, behavior: behavior() })}>↑</button>;
}

// A book on the intro shelf (labs.css, "the shelf of books"): w = thickness in px, h = height in % of the shelf. Its
// spine is a real curve: FACES narrow faces around a circular arc that bulges `sag` forward, each turned to face out
// from the arc and shaded by which way it faces (blending into its neighbours, so it reads smooth); the top is cut to
// the same arc (clip-path).
const FACES = 9;
const lightAt = (t) => Math.max(0, 0.24 * (1 - Math.abs(t + 0.35) * 1.7)); // t: -1 left edge … 1 right edge; lit left of centre
const darkAt = (t) => 0.06 + 0.34 * Math.max(0, t) ** 1.3 + 0.12 * Math.max(0, -t - 0.6);
function Book({ w, h, children }) {
  const sag = Math.round(w * 0.14), r = (w * w / 4 + sag * sag) / (2 * sag), half = Math.asin(w / 2 / r), step = (2 * half) / FACES;
  const px = (n) => `${n.toFixed(2)}px`;
  const arc = Array.from({ length: 9 }, (_, k) => { const x = (w * k) / 8; return `${px(x)} ${px(r - Math.sqrt(r * r - (x - w / 2) ** 2))}`; });
  return (
    <span className="book" style={{ '--bw': `${w}px`, '--bh': `${h}%`, '--sag': `${sag}px` }}>
      {Array.from({ length: FACES }, (_, i) => {
        const a = -half + step * (i + 0.5), c = 2 * r * Math.sin(step / 2) + 1.2;
        const x = w / 2 + r * Math.sin(a), z = r * Math.cos(a) - r;
        const t0 = (a - step / 2) / half, t1 = (a + step / 2) / half, rgba = (v, n) => `rgba(${v},${v},${v},${n.toFixed(3)})`;
        return <i key={i} className={`bk-face${i === 0 ? ' edge-l' : ''}${i === FACES - 1 ? ' edge-r' : ''}`} style={{ width: px(c), transform: `translate3d(${px(x - c / 2)}, 0, ${px(z)}) rotateY(${(a * 180) / Math.PI}deg)`, '--lt0': rgba(255, lightAt(t0)), '--lt1': rgba(255, lightAt(t1)), '--dk0': rgba(0, darkAt(t0)), '--dk1': rgba(0, darkAt(t1)) }} />;
      })}
      <i className="bk-head" style={{ clipPath: `polygon(${arc.join(', ')}, 100% 100%, 0 100%)` }} />
      <i className="bk-pages" />
      <i className="bk-side" />
      <span className="bk-label">{children}</span>
    </span>
  );
}

const Credits = ({ team, tags }) => <div className="credits"><span className="cr-team">{team}</span><span className="cr-tags">{tags.map((t) => <span key={t} className="cr-tag">{t}</span>)}</span></div>;
const Hint = ({ i, next, dark }) => <div className={`chaphint${dark ? ' dark' : ''}`} aria-hidden="true">{`${String(i).padStart(2, '0')} / 08 · ${next} `}<span className="a">↓</span></div>;
const Meta = ({ k, t }) => <div className="cmeta-row"><span className="cm-k">{k}</span><span className="cm-t">{t}</span></div>;
const Ticker = ({ light }) => (
  <div className={`marquee${light ? ' light' : ''}`} aria-hidden="true">
    <div className="mtrack">{[0, 1].map((r) => TICKER.map((t, i) => <span key={`${r}${i}`} className={i % 2 ? 'o' : undefined}><span className="dot" style={{ '--mc': `var(--${DOTS[i]})` }} />{t}</span>))}</div>
  </div>
);

// Everything under the bar. Never re-renders (no changing props), so the bar's state changes don't touch it.
const Gallery = memo(function Gallery({ web, dir, base, go }) {
  const pic = (f, alt = '', cls) => <img src={`${dir}/${f}`} width={SIZE[f][0]} height={SIZE[f][1]} alt={alt} className={cls} loading="lazy" decoding="async" />;
  const cols = (c) => (web ? { gridTemplateColumns: c } : undefined);
  const claim = CLAIM.map((part) => part.split(' '));
  return (
    <>
      <section className="chapter labs-intro dark" style={{ '--c': 'var(--mint)' }}>
        <div className="introglow" />
        {FLOATS.map(([f, r, d, box], i) => (
          <div key={f} className="floatcard" style={{ '--r': r, '--d': d, ...(web ? box : PHONE_FLOAT(i)) }}><img src={`${dir}/${f}`} alt="" width={SIZE[f][0]} height={SIZE[f][1]} /></div>
        ))}
        <div className="wrap intro-wrap">
          <div className="showpill reveal" style={{ '--i': 0 }}>★ AQ LABS '26 · AN AQUATERRA SHOWCASE</div>
          <h1 className="bigtitle reveal" style={{ '--i': 1 }}>AQ <span className="lab">Labs</span></h1>
          <p className="lead intro-lead reveal" style={{ '--i': 2 }}>eight teams. eight things that didn't exist six weeks ago, and now do.</p>
          <a className="walkbtn reveal" style={{ '--i': 3 }} href={`${base}/karyaarth`} onClick={(e) => go(e, 'karyaarth')}>walk the gallery <span className="arr">↓</span></a>
          <div className="sectlabel reveal" style={{ '--i': 4 }}>// or pull a book</div>
          <div className="rack reveal" style={{ '--i': 4 }}>
            {TEAMS.map((t, i) => (
              <a key={t.id} className="book-slot" href={`${base}/${t.id}`} onClick={(e) => go(e, t.id)} style={{ ...tint(t.c), '--sd': `${(i * 0.22).toFixed(2)}s` }}>
                <Book w={web ? BOOKS[i][0] : Math.round(BOOKS[i][0] * 0.77)} h={BOOKS[i][1]}>
                  <span className="snum2">{String(i + 1).padStart(2, '0')}</span><span className="stitle"><span className="sname2">{folded(t.label)}</span><span className="scat2">{t.cat}</span></span><span className="sglyph2" aria-hidden="true">{t.glyph}</span>
                </Book>
              </a>
            ))}
          </div>
        </div>
      </section>

      <Ticker />

      {/* 01 KARYAARTH · contact sheet */}
      <section id="karyaarth" className="chapter dark" data-team="" style={{ '--c': 'var(--tomato)' }}>
        <div className="wrap cols k-cols">
          <div className="k-grid media reveal" style={{ '--i': 1 }}>
            {KARYAARTH.map((alt, i) => (
              <div key={alt} className="k-cell" style={{ '--kd': `${(0.05 + i * 0.08).toFixed(2)}s` }}>{pic(`karyaarth/still-${String(i + 1).padStart(2, '0')}.webp`, alt)}{i === 0 && <span className="k-cap">the hustle</span>}</div>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", minWidth: "0" }}>
            <Meta k="01 · documentary" t="team karyaarth" />
            <h2 className="big2 reveal" style={{ '--i': 1 }}><span className="np">KARYAARTH</span></h2>
            <p className="it tagline reveal" style={{ '--i': 2, color: "var(--tomato)", fontSize: web ? "30px" : undefined, marginTop: "12px" }}>local log. legendary hustle.</p>
            <p className="lead reveal" style={{ '--i': 3, marginTop: "14px" }}>the ice cream cart. the tea stall. the man who has fixed shoes on the same corner for thirty years. karyaarth points a camera at the people we walk past every day and never actually see, and lets them talk.</p>
            <div className="pills reveal" style={{ '--i': 4 }}>
              <a className="pill solid" href="https://youtube.com/@karyaarth" {...OUT}>▶ youtube</a>
              <a className="pill" href="https://www.instagram.com/karyaarth" {...OUT}>◎ @karyaarth</a>
            </div>
          </div>
        </div>
        <div className="reveal" style={{ '--i': 2 }}><Credits team="team karyaarth · @karyaarth" tags={['documentary', 'street vendors', 'youtube']} /></div>
        <Hint i={1} next="scroll for careercompass" dark />
      </section>

      {/* 02 CAREERCOMPASS · dashboard */}
      <section id="career-compass" className="chapter" data-team="" style={{ '--c': 'var(--sky)' }}>
        <div className="wrap cols" style={cols('1fr 1.05fr')}>
          <div style={{ minWidth: "0" }}>
            <Meta k="02 · career data" t="team merge conflicts" />
            <h2 className="big2 reveal" style={{ '--i': 1 }}><span className="np">CAREER<br />COMPASS</span></h2>
            <p className="it tagline reveal" style={{ '--i': 2, color: "var(--sky)" }}>it won't pick your path. it just won't let you walk confidently the wrong way.</p>
            <p className="lead reveal" style={{ '--i': 3, marginTop: "14px" }}>india trains millions and still can't fill the jobs that matter. careercompass reads what industries actually need against what students actually study, and hands you a direction instead of a shrug.</p>
            <div className="pills reveal" style={{ '--i': 4 }}>
              <a className="pill solid" href="https://careerrcompassindia.netlify.app" {...OUT}>↗ visit site</a>
              <button className="pill" type="button" onClick={(e) => copyLink(e, `${location.origin}${base}/career-compass`)}>⧉ copy chapter link</button>
            </div>
          </div>
          <div className="cc-dash media reveal" style={{ '--i': 3 }}>
            <div className="cc-dhead"><span>the gap · live</span><span className="cc-needle" /></div>
            <div className="cc-body">
              <div className="stat"><div className="n">1.5 CR</div><div className="l">grads / year</div></div>
              <div className="stat fill" style={{ '--c': 'var(--sky)' }}><div className="n">42.6%</div><div className="l">employability</div></div>
              <div className="stat"><div className="n">25%</div><div className="l">digital gap</div></div>
              <div className="stat fill ondark" style={{ '--c': 'var(--grape)' }}><div className="n">25 L</div><div className="l">emigrate / year</div></div>
            </div>
            <div className="cc-shots">
              <a className="browser" href="https://careerrcompassindia.netlify.app" {...OUT}><div className="bb"><i /><i /><i /></div>{pic('career-compass/site-home.webp', 'careercompass overview')}</a>
              <a className="browser" href="https://careerrcompassindia.netlify.app" {...OUT}><div className="bb"><i /><i /><i /></div>{pic('career-compass/site-find-your-path.webp', 'careercompass find your path')}</a>
            </div>
          </div>
        </div>
        <div className="reveal" style={{ '--i': 2 }}><Credits team="team merge conflicts · @ngo.aquaterra" tags={['career data', 'live web app', 'india']} /></div>
        <Hint i={2} next="scroll for quirk" />
      </section>

      {/* 03 QUIRK · arcade terminal */}
      <section id="quirk" className="chapter dark" data-team="" style={{ '--c': 'var(--pink)' }}>
        <div className="wrap cols" style={cols('1fr 1.05fr')}>
          <div style={{ minWidth: "0" }}>
            <Meta k="03 · hardware" t="team execution pending" />
            <h2 className="big2 reveal" style={{ '--i': 1, color: "var(--pink)" }}><span className="np glitch">QUIRK</span></h2>
            <p className="it tagline reveal" style={{ '--i': 2, color: "var(--cream)" }}>built by teenagers who got bored.</p>
            <p className="lead reveal" style={{ '--i': 3, marginTop: "14px" }}>a pressure pad, a score, an OLED screen small enough to lose. a desktop console for the restless and the ADHD-wired, more rewarding than a fidget toy and less greedy than a phone. five games run today. the enclosure is still a breadboard on a table.</p>
            <div className="pills reveal" style={{ '--i': 4, marginTop: "18px" }}>
              <a className="pill solid" href="https://quirkbyaq.vercel.app" {...OUT}>↗ quirkbyaq.vercel.app</a>
              <span className="pill still" style={{ borderStyle: "dashed" }}><span className="q-score">SCORE 1280</span></span>
            </div>
          </div>
          <div className="media reveal" style={{ '--i': 3 }}>
            <div className="q-crt"><div className="q-scan" />{pic('quirk/oled-test.webp', 'quirk pressure-sensing console')}</div>
            <div className="mono media-note">200×200mm board · fsr pad + oled + esp32</div>
          </div>
        </div>
        <div className="exhibit reveal" style={{ '--i': 1 }}>
          <div className="exhibit-h"><span className="eh-k">the build log · it's live</span><span className="eh-t">breadboard → browser</span></div>
          <div className="plates" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
            <figure className="plate">{pic('quirk/breadboard.webp', 'quirk breadboard')}<figcaption><span className="pc-k">hardware</span>the real board, still bare on the bench.</figcaption></figure>
            <figure className="plate">{pic('quirk/player-one.webp', 'quirk: player 1, 60 second 3pt contest')}<figcaption><span className="pc-k">on the oled</span>player 1, a 60 second 3pt contest.</figcaption></figure>
            <a className="plate" href="https://quirkbyaq.vercel.app" {...OUT}>{pic('quirk/site-meet-quirk.webp', 'meet quirk')}<figcaption><span className="pc-k">live site</span>meet quirk, the pressure-sensing console.</figcaption></a>
            <a className="plate" href="https://quirkbyaq.vercel.app" {...OUT}>{pic('quirk/site-play-now.webp', 'quirk games')}<figcaption><span className="pc-k">play now</span>five games, downloadable today.</figcaption></a>
          </div>
          <Credits team="team execution pending · @ngo.aquaterra" tags={['ESP32', 'FSR sensor', 'OLED', '5 games live']} />
        </div>
        <Hint i={3} next="scroll for wisdom woods" dark />
      </section>

      {/* 04 WISDOM WOODS · game HUD */}
      <section id="wisdom-woods" className="chapter" data-team="" style={{ '--c': 'var(--mint)' }}>
        <div className="wrap cols" style={cols('.85fr 1.15fr')}>
          <div className="media reveal" style={{ '--i': 2 }}>
            <div className="frame shadow-c ww-frame">{pic('wisdom-woods/poster.webp', 'wisdom woods app')}</div>
          </div>
          <div style={{ minWidth: "0" }}>
            <Meta k="04 · ed-game · classes 3–7" t="team alter ego" />
            <h2 className="big2 reveal" style={{ '--i': 1 }}><span className="np">WISDOM<br />WOODS</span></h2>
            <p className="it tagline reveal" style={{ '--i': 2, color: "var(--mint)", marginTop: "12px" }}>learning that forgets it's learning.</p>
            <p className="lead reveal" style={{ '--i': 3, marginTop: "12px" }}>a worksheet is a wall; a game is an open door. so the worksheet hides inside the game: vocabulary, logic and general knowledge, dressed as an expedition.</p>
            <div className="reveal" style={{ '--i': 4, marginTop: "18px", display: "flex", alignItems: "center", gap: "12px" }}>
              <div className="ww-xp"><b /></div>
              <span className="ww-badge">★ level up</span>
            </div>
            <div className="ww-cards reveal" style={{ '--i': 4 }}>
              {[['LVL 1', 'Vocab'], ['LVL 2', 'Logic'], ['LVL 3', 'World']].map(([l, w]) => <div key={l} className="ww-card"><div className="mono lvl">{l}</div><div className="what">{w}</div></div>)}
            </div>
            <div className="pills reveal" style={{ '--i': 4, marginTop: "20px" }}>
              <a className="pill solid" href={`${base}/wisdom-woods/demo`} {...OUT}>↗ play the demo</a>
              <a className="pill" href="https://www.instagram.com/wisdomwoods26" {...OUT}>◎ @wisdomwoods26</a>
            </div>
          </div>
        </div>
        <div className="exhibit reveal" style={{ '--i': 1 }}>
          <div className="exhibit-h"><span className="eh-k">inside the app</span><span className="eh-t">from the demo</span></div>
          <div className="plates" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <figure className="plate">{pic('wisdom-woods/app-enter.webp', 'wisdom woods: enter the woods', 'natural')}<figcaption><span className="pc-k">enter the woods</span>make an explorer, pick a guide.</figcaption></figure>
            <figure className="plate">{pic('wisdom-woods/app-question.webp', 'wisdom woods: a world explorer question', 'natural')}<figcaption><span className="pc-k">world explorer</span>one question, four answers, a score.</figcaption></figure>
          </div>
          <Credits team="team alter ego · @wisdomwoods26" tags={['ed-game', 'classes 3–7', 'gamified']} />
        </div>
        <Hint i={4} next="scroll for cirqle" />
      </section>

      {/* 05 CIRQLE · orbit loop */}
      <section id="cirqle" className="chapter" data-team="" style={{ '--c': 'var(--lemon)' }}>
        <div className="wrap cols" style={cols('1fr .9fr')}>
          <div style={{ minWidth: "0" }}>
            <Meta k="05 · rentals" t="team idea architects" />
            <h2 className="big2 reveal" style={{ '--i': 1 }}><span className="np">CIRQLE</span></h2>
            <p className="it tagline reveal" style={{ '--i': 2, color: "var(--tomato)", fontSize: web ? "32px" : undefined, marginTop: "12px" }}>borrow the drill. keep the money.</p>
            <p className="lead reveal" style={{ '--i': 3, marginTop: "14px" }}>you bought the drill, used it twice, and it's sat in a drawer for a decade. so has your neighbour's. cirqle turns that quiet waste into a loop: location-based whatsapp groups where people rent what they need and lend what they own.</p>
            <div className="pills reveal" style={{ '--i': 4 }}>
              <a className="pill solid" href="https://www.instagram.com/p/DZLEszYk031/" {...OUT}>◎ see it on instagram</a>
            </div>
          </div>
          <div className="media reveal" style={{ '--i': 3 }}>
            <div className="cq-orbit">
              <div className="ring" />
              <div className="spin">
                <div className="onode"><span style={{ background: "var(--card)" }}>rent</span></div>
                <div className="onode"><span style={{ background: "var(--pink)", color: "var(--cream)" }}>lend</span></div>
                <div className="onode"><span style={{ background: "var(--grape)", color: "var(--cream)" }}>repeat</span></div>
              </div>
              <div className="hub">{pic('cirqle/poster.webp', 'cirqle rentals')}</div>
            </div>
          </div>
        </div>
        <div className="reveal" style={{ '--i': 2 }}><Credits team="team idea architects · @ngo.aquaterra" tags={['rentals', 'whatsapp', 'circular']} /></div>
        <Hint i={5} next="scroll for hunar" />
      </section>

      {/* 06 HUNAR · thesis */}
      <section id="hunar" className="chapter dark" data-team="" style={{ '--c': 'var(--grape)' }}>
        <div className="wrap cols" style={cols('1.25fr .75fr')}>
          <div style={{ minWidth: "0" }}>
            <Meta k="06 · placement" t="team zero to deploy" />
            <div className="big2 reveal" style={{ '--i': 1, marginBottom: "10px" }}><span className="np" style={{ fontSize: web ? "58px" : "34px" }}>HUNAR</span></div>
            <h2 className="hn-claim">
              {claim[0].map((w, i) => <Fragment key={i}><span className="hn-word" style={{ transitionDelay: `${0.15 + i * 0.09}s` }}>{w}</span>{' '}</Fragment>)}
              <span className="x">{claim[1].map((w, i) => <Fragment key={i}>{i > 0 && ' '}<span className="hn-word" style={{ transitionDelay: `${0.15 + (claim[0].length + i) * 0.09}s` }}>{w}</span></Fragment>)}</span>
            </h2>
            <p className="lead reveal" style={{ '--i': 2, marginTop: "18px" }}>a qualified graduate finishes the course, holds the certificate, and still can't get seen. the break happens after the certificate, in a market that can't find them and can't verify they're real. hunar rebuilt the part everyone skips.</p>
            <div className="pills reveal" style={{ '--i': 3, marginTop: "20px" }}>
              <a className="pill solid" href="https://hunar-one.vercel.app" {...OUT}>↗ visit the project</a>
            </div>
          </div>
          <div className="media reveal" style={{ '--i': 2 }}>
            <div className="sectlabel" style={{ marginBottom: "14px" }}>where trust comes from, weighted</div>
            <div className="bars">
              {TRUST.map(([l, v, w]) => <div key={l} className="bar"><div className="brow"><span className="bl">{l}</span><span className="bv">{v}</span></div><div className="btrack"><div className="bfill" style={{ '--w': w }} /></div></div>)}
            </div>
            <a className="browser" href="https://hunar-one.vercel.app" {...OUT} style={{ marginTop: "26px" }}><div className="bb"><i /><i /><i /></div>{pic('hunar/site.webp', 'hunar: the placement network for India’s skilled workforce')}</a>
          </div>
        </div>
        <div className="reveal" style={{ '--i': 2 }}><Credits team="team zero to deploy · @ngo.aquaterra" tags={['placement', 'verification', 'live site']} /></div>
        <Hint i={6} next="scroll for photon" dark />
      </section>

      {/* 07 PHOTON · calm product */}
      <section id="photon" className="chapter dark" data-team="" style={{ '--c': 'var(--sky)' }}>
        <div className="wrap cols" style={cols('1fr 1fr')}>
          <div style={{ minWidth: "0" }}>
            <Meta k="07 · wearable" t="team 404 not found" />
            <h2 className="big2 reveal" style={{ '--i': 1 }}><span className="np">PHOTON</span></h2>
            <p className="it tagline reveal" style={{ '--i': 2, color: "var(--psky)", fontSize: web ? "42px" : "24px", marginTop: "16px" }}>no screen. no noise.</p>
            <p className="lead reveal" style={{ '--i': 3, marginTop: "16px" }}>every wearable screams for your attention. photon refuses to. a screen-free bracelet that reads your body through light and motion, then gets out of the way. technology you wear, not technology you serve.</p>
            <div className="ph-feats reveal" style={{ '--i': 4 }}>
              {['light-based sensing', 'motion tracking', 'screen-free'].map((f) => <span key={f} className="pill still">{f}</span>)}
            </div>
            <div className="pills reveal" style={{ '--i': 4, marginTop: "14px" }}><span className="pill still" style={{ opacity: ".7" }}>◷ no live link yet</span></div>
          </div>
          <div className="media reveal" style={{ '--i': 2 }}>
            <div className="ph-stage">
              <div className="ph-halo" />
              <div className="ph-prod">
                {[['band', 'photon wearable'], ['sheet-parts', 'photon detail'], ['sheet-design', 'photon on wrist'], ['sheet-lock', 'photon closeup']].map(([f, alt], i) => (
                  <img key={f} src={`${dir}/photon/${f}.webp`} alt={alt} width={SIZE[`photon/${f}.webp`][0]} height={SIZE[`photon/${f}.webp`][1]} className={`${i ? 'whole' : 'on'}`} loading="lazy" decoding="async" />
                ))}
              </div>
            </div>
            <div className="mono media-note" style={{ marginTop: "6px" }}>screen-free · light-based sensing · reads you, shows nothing</div>
          </div>
        </div>
        <div className="exhibit reveal" style={{ '--i': 1 }}>
          <div className="exhibit-h"><span className="eh-k">the object</span><span className="eh-t">prototype renders</span></div>
          <div className="plates" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
            <figure className="plate">{pic('photon/band.webp', 'photon wearable')}<figcaption><span className="pc-k">the band</span>slim, screen-free, all-day.</figcaption></figure>
            <figure className="plate">{pic('photon/sheet-parts.webp', 'photon detail', 'whole')}<figcaption><span className="pc-k">detail</span>the light-sensor node.</figcaption></figure>
            <figure className="plate">{pic('photon/sheet-design.webp', 'photon on wrist', 'whole')}<figcaption><span className="pc-k">on wrist</span>reads pulse and motion.</figcaption></figure>
            <figure className="plate">{pic('photon/sheet-lock.webp', 'photon closeup', 'whole')}<figcaption><span className="pc-k">closeup</span>minimal, premium, quiet.</figcaption></figure>
          </div>
          <Credits team="team 404-idea not found · @ngo.aquaterra" tags={['wearable', 'light sensor', 'screen-free']} />
        </div>
        <Hint i={7} next="scroll for the human manual" dark />
      </section>

      {/* 08 THE HUMAN MANUAL · card deck */}
      <section id="human-manual" className="chapter dark" data-team="" style={{ '--c': 'var(--pink)' }}>
        <div className="wrap cols" style={cols('1fr 1fr')}>
          <div style={{ minWidth: "0" }}>
            <Meta k="08 · teen psychology" t="team unfiltered minds" />
            <h2 className="big2 reveal" style={{ '--i': 1 }}><span className="np" style={{ fontSize: web ? "66px" : "34px" }}>THE HUMAN MANUAL</span></h2>
            <p className="it tagline reveal" style={{ '--i': 2, color: "var(--ppink)" }}>a thousand questions about you. no filters, no advice, no adults.</p>
            <p className="lead reveal" style={{ '--i': 3, marginTop: "14px" }}>unfiltered minds wrote it as a deck instead of a lecture: the questions you already ask yourself at 2am, sorted into suits you can actually name. pick your poison, draw a prompt, fill the blank honestly.</p>
            <div className="pills reveal" style={{ '--i': 4, marginTop: "20px" }}>
              <a className="pill solid" href="https://human-manual.vercel.app/" {...OUT}>↗ play it</a>
              <button className="pill" type="button" onClick={(e) => copyLink(e, `${location.origin}${base}/human-manual`)}>⧉ copy chapter link</button>
            </div>
          </div>
          <div className="media reveal" style={{ '--i': 2 }}>
            <div className="hand">
              {SUITS.map(([fr, fy, sc, g, n, name, sub]) => <div key={n} className="hcard" style={{ '--fr': fr, '--fy': fy, '--sc': `var(--${sc})` }}><span className="hg">{g}</span><span className="hn">{n}</span><span className="hnm">{name}</span><span className="hs">{sub}</span></div>)}
            </div>
            <div className="mono media-note reveal" style={{ '--i': 4, marginTop: "14px", letterSpacing: ".16em" }}>{web ? 'hover a card to pull it' : 'tap a card to pull it'} · 5 suits · 1000+ prompts</div>
          </div>
        </div>
        <div className="reveal" style={{ '--i': 2 }}><Credits team="team unfiltered minds · @unfilteredminds" tags={['teen psychology', 'card deck', '1000+ prompts']} /></div>
        <Hint i={8} next="scroll to finish" dark />
      </section>

      <Ticker light />
      <section className="chapter outro" style={{ '--c': 'var(--tomato)' }}>
        <div className="wrap">
          <div className="mono reveal" style={{ '--i': 0, fontSize: "12px", letterSpacing: ".26em", color: "var(--ink3)", marginBottom: "22px" }}>✦ end of the exhibition</div>
          <h2 className="disp reveal" style={{ '--i': 1 }}>THAT'S THE SHOW.</h2>
          <p className="lead reveal" style={{ '--i': 2, margin: "22px auto 0", maxWidth: "520px" }}>eight teams. one room in kolkata that got out of hand. the resources they used are open. go build the next one.</p>
          <div className="pills reveal" style={{ '--i': 3, justifyContent: "center", marginTop: "40px" }}>
            <button className="pill solid" type="button" style={{ '--c': 'var(--pmint)' }} onClick={() => scrollTo({ top: 0, behavior: behavior() })}>↑ back to the top</button>
            <a className="pill" href="https://www.instagram.com/ngo.aquaterra" {...OUT}>→ @ngo.aquaterra</a>
          </div>
        </div>
      </section>
    </>
  );
});

export default function LabsPage({ article: a, web }) {
  const main = useRef(null), base = articleLink(a);
  const navigate = useNavigate(), nav = useRef(navigate);
  nav.current = navigate;
  // a tab, a book or "walk the gallery": glide the chapter to the top of the window (its scroll-margin allows for the
  // sticky bars) and show its address, <article>/<id>, replaced in place (quiet: lib/scrollMemory.js doesn't scroll)
  const go = useCallback((e, id) => {
    e?.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: behavior() });
    nav.current(`${base}/${id}`, { replace: true, state: { quiet: true } });
  }, [base]);
  useEffect(() => { document.title = `Aquaterra — ${a.title}`; }, [a.title]);

  useEffect(() => { // web: snap to chapters
    if (!web || calm()) return undefined;
    document.documentElement.classList.add('labs-snap');
    return () => document.documentElement.classList.remove('labs-snap');
  }, [web]);

  useEffect(() => { // entrances, per-chapter moments, pausing, the counting numbers
    const root = main.current, still = calm();
    const sections = [...root.querySelectorAll('section.chapter')];
    const score = root.querySelector('.q-score').firstChild;
    const photos = [...root.querySelectorAll('.ph-prod img')];
    let fade = 0, raf = 0;
    const enter = (id) => {
      if (id === 'quirk' && !still) { // the score counts up to 1280
        cancelAnimationFrame(raf);
        const t0 = performance.now();
        const tick = (t) => { const k = Math.min(1, (t - t0) / 1100); score.data = `SCORE ${String(Math.round(1280 * (1 - (1 - k) ** 3))).padStart(4, '0')}`; if (k < 1) raf = requestAnimationFrame(tick); };
        raf = requestAnimationFrame(tick);
      }
      if (id === 'photon' && !still && !LITE && !fade) { // a slow crossfade through the object
        let i = photos.findIndex((p) => p.classList.contains('on'));
        fade = setInterval(() => { photos[i].classList.remove('on'); i = (i + 1) % photos.length; photos[i].classList.add('on'); }, 2600);
      }
    };
    const leave = (id) => { if (id === 'photon') { clearInterval(fade); fade = 0; } };
    let io;
    if (still) sections.forEach((s) => s.classList.add('in'));
    else {
      io = new IntersectionObserver((es) => es.forEach((e) => {
        const s = e.target, team = s.hasAttribute('data-team');
        if (e.isIntersecting) { s.classList.add('in'); enter(s.id); if (!team) io.unobserve(s); }
        else if (team) { s.classList.remove('in'); leave(s.id); }
      }), { threshold: [0, 0.12], rootMargin: '0px 0px -12% 0px' });
      sections.forEach((s) => io.observe(s));
    }
    // loops stop in anything scrolled well away
    const away = new IntersectionObserver((es) => es.forEach((e) => e.target.classList.toggle('off-screen', !e.isIntersecting)), { rootMargin: '200px 0px' });
    root.querySelectorAll('section.chapter, .marquee').forEach((s) => away.observe(s));
    // the dashboard's numbers count up once, the first time they're on screen
    const count = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      count.unobserve(e.target);
      const node = e.target.firstChild, end = node.data, m = end.match(/[0-9]+(?:\.[0-9]+)?/);
      if (!m || still) return;
      const num = parseFloat(m[0]), dec = m[0].includes('.') ? 1 : 0, pre = end.slice(0, m.index), suf = end.slice(m.index + m[0].length), t0 = performance.now();
      const tick = (t) => { const k = Math.min(1, (t - t0) / 900); node.data = k < 1 ? pre + (num * (1 - (1 - k) ** 3)).toFixed(dec) + suf : end; if (k < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    }), { threshold: 0.6 });
    root.querySelectorAll('.stat .n').forEach((n) => count.observe(n));
    return () => { io?.disconnect(); away.disconnect(); count.disconnect(); clearInterval(fade); cancelAnimationFrame(raf); };
  }, []);

  useEffect(() => { // spotlit names: a chapter's title is brightest across the middle of the window, dim far from it
    if (calm() || LITE) return undefined;
    const names = [...main.current.querySelectorAll('.np')];
    let raf = 0;
    const paint = () => {
      raf = 0;
      const h = innerHeight, boxes = names.map((n) => n.getBoundingClientRect()); // read everything, then write
      boxes.forEach((r, i) => {
        if (r.bottom < -200 || r.top > h + 200) return;
        names[i].style.opacity = (0.16 + 0.84 * smooth(1 - Math.abs(r.top + r.height / 2 - h / 2) / (h * 0.72))).toFixed(3);
      });
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(paint); };
    paint();
    addEventListener('scroll', on, { passive: true });
    addEventListener('resize', on);
    return () => { removeEventListener('scroll', on); removeEventListener('resize', on); cancelAnimationFrame(raf); };
  }, []);

  const page = (
    <div className={`labs ${web ? 'labs-web' : 'labs-phone'}`} style={{ width: web ? "1440px" : "390px" }}>
      {web ? <WebHeader /> : <PhoneHeader current="article" edge={TAGS[a.tag].color} />}
      <LabsBar main={main} base={base} go={go} />
      <main ref={main}><Gallery web={web} dir={articleFolder(a)} base={base} go={go} /></main>
      <BackToTop />
    </div>
  );
  return web ? <div className="web">{page}</div> : page;
}
