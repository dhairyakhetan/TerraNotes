import { useEffect, useRef, useState } from 'react';
import { ARTICLES } from '../data/articles.js';
import { PHOTOS } from '../data/photos.js';
import { introSeen } from '../lib/intro.js';
import '../styles/intro.css';

// The opening: a notebook slides in spinning, lands in the middle, opens on the AQUATERRA logo, "TerraNotes" is
// written in, and a CERTIFIED stamp thumps onto the page. The site loads underneath the whole time (and the covers
// and photos are fetched meanwhile), so it's ready when the notebook lifts away. Timings live in styles/intro.css.
const PLAY = 4300, REDUCED = 1800, LEAVE = 450;

export default function Intro() {
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);
  const skip = useRef(null);

  const leave = () => setLeaving(true);

  useEffect(() => {
    introSeen();
    window.aqIntro = true; // the footer video starts downloading now too (OrbitBanner)
    dispatchEvent(new Event('aq-intro'));
    // fetch what the pages will need while the notebook plays
    for (const src of ['/logo.png', ...ARTICLES.map((a) => a.cover), ...PHOTOS.map((p) => p.photo)].filter(Boolean)) {
      const img = new Image();
      img.src = src;
    }
    const root = document.documentElement, was = root.style.overflow;
    root.style.overflow = 'hidden'; // no scrolling the page behind it
    skip.current?.focus({ preventScroll: true });
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const t = setTimeout(leave, still ? REDUCED : PLAY);
    const onKey = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); leave(); } };
    addEventListener('keydown', onKey);
    return () => { clearTimeout(t); removeEventListener('keydown', onKey); root.style.overflow = was; };
  }, []);

  useEffect(() => {
    if (!leaving) return undefined;
    document.documentElement.style.overflow = '';
    const t = setTimeout(() => setGone(true), LEAVE);
    return () => clearTimeout(t);
  }, [leaving]);

  if (gone) return null;
  return (
    <div className={leaving ? 'intro intro-out' : 'intro'}>
      {/* rough edges and specks for the stamp's ink */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <filter id="aq-ink" x="-5%" y="-10%" width="110%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.4" result="rough" />
          <feComponentTransfer in="noise" result="specks"><feFuncA type="discrete" tableValues="0 0 0 0 0 0 0 0.9" /></feComponentTransfer>
          <feComposite in="rough" in2="specks" operator="out" />
        </filter>
      </svg>
      <div className="intro-stage" aria-hidden="true">
        <div className="nb">
          <div className="nb-thump">
            <div className="nb-book">
              {/* the first page, under the cover */}
              <div className="nb-page nb-right">
                <div className="nb-name">TerraNotes</div>
                <div className="nb-line">notes from where the land meets the water</div>
                <div className="nb-stamp">
                  <div className="nb-stamp-in">
                    <div className="nb-stamp-small">Aquaterra · Issue one</div>
                    <div className="nb-stamp-big">Certified</div>
                    <div className="nb-stamp-small">Field approved</div>
                  </div>
                </div>
              </div>
              {/* the cover: its outside, then (once it swings past halfway) its inside with the logo */}
              <div className="nb-cover">
                <div className="nb-face nb-front">
                  <img src="/logo.png" alt="" className="nb-front-logo" />
                  <div className="nb-label">TerraNotes<span>issue 01</span></div>
                </div>
                <div className="nb-face nb-back">
                  <img src="/logo.png" alt="" className="nb-logo" />
                  <div className="nb-word"><span className="wordmark nb-wordmark">Aquaterra</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button ref={skip} className="intro-skip" onClick={leave}>Skip loading <span aria-hidden="true">→</span></button>
    </div>
  );
}
