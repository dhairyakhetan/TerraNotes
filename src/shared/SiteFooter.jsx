import { useEffect, useRef, useState } from 'react';
import { FOOTER_VIDEO, ROSTER_COLORS, SITE } from '../data/site.js';
import { LITE, calm } from '../lib/motion.js';

// The footer on every page (mounted once in App.jsx, outside the routes, so its video survives navigation). It links
// nowhere, by design. Styles: styles/footer.css.
// 1. The orbit banner: "AQUATERRA" with 8 bubbles drifting round it, each showing one panel of the same video frame:
//    one <video> (FOOTER_VIDEO, a strip of 8 square panels) painted into 8 <canvas> at 15fps. The video only
//    downloads near the banner (or right away on phones and during the intro), only plays while the banner is on
//    screen, retries with backoff when a phone refuses autoplay, and falls back to waiting for the next tap.
//    Reduced motion or LITE (lib/motion.js): plain coloured bubbles, no video.
// 2. The bar: © line and SITE.footerNote.

// Bubble positions: % of the stage. Sizes: lg 10.4%, md 7.8%, sm 5.8% of the stage width.
const BUBBLES = [
  { size: 'lg', left: 10, top: 26 },
  { size: 'md', left: 26, top: 78 },
  { size: 'sm', left: 39, top: 8 },
  { size: 'sm', left: 56, top: 90 },
  { size: 'md', left: 69, top: 13 },
  { size: 'lg', left: 89, top: 29 },
  { size: 'md', left: 92, top: 75 },
  { size: 'sm', left: 7, top: 68 },
];
const SIZE = { lg: '10.4%', md: '7.8%', sm: '5.8%' };
const RETRY_MS = [1500, 4000, 10000];
const STALL_MS = 8000;        // asked to play but no frame by then: retry
const ACTIVATION = ['pointerup', 'touchend', 'click', 'keydown']; // events that count as a real tap/press
const FRAME_MS = 1000 / 15;   // decoration: 15fps is plenty
const BACKING = 160;          // canvas backing store per bubble

function OrbitBanner() {
  const stage = useRef(null);
  const video = useRef(null);
  const canvases = useRef([]);
  const [reduced] = useState(() => calm() || LITE);

  useEffect(() => {
    if (reduced) return;
    const v = video.current;
    v.muted = true; // required, or autoplay is refused
    const ctxs = canvases.current.map((c) => c.getContext('2d'));
    let seen = false, shown = !document.hidden, loaded = false;
    let raf = 0, last = 0, painting = false;
    let attempt = 0, retryTimer = 0, stallTimer = 0, gen = 0, failedGen = -1, armed = false;

    const draw = (t) => {
      raf = requestAnimationFrame(draw);
      if (t - last < FRAME_MS) return;
      last = t;
      const pw = v.videoWidth / BUBBLES.length, h = v.videoHeight;
      if (!pw) return;
      ctxs.forEach((ctx, i) => ctx.drawImage(v, i * pw, 0, pw, h, 0, 0, BACKING, BACKING));
    };
    const startPaint = () => { if (!painting && v.readyState >= 2) { clearTimeout(stallTimer); painting = true; raf = requestAnimationFrame(draw); } };
    const stopPaint = () => { painting = false; cancelAnimationFrame(raf); };
    // play only while the banner is actually on screen: phones (iOS) pause muted video that isn't visible
    const wanted = () => seen && shown;

    // no frame within STALL_MS of asking (slow or dropped connection, a stuck decoder): count it as a failure
    const watch = (g) => { clearTimeout(stallTimer); stallTimer = setTimeout(() => { if (g === gen && wanted() && !painting) fail(g); }, STALL_MS); };
    // autoplay refused (e.g. Low Power Mode): phones only allow a start inside a real tap, which ends on finger-up
    const onActivate = () => { disarm(); attempt = 0; if (wanted()) { v.load(); play(); } };
    const arm = () => { if (!armed) { armed = true; ACTIVATION.forEach((t) => addEventListener(t, onActivate, { passive: true })); } };
    const disarm = () => { armed = false; ACTIVATION.forEach((t) => removeEventListener(t, onActivate)); };
    const fail = (g) => {
      if (g === failedGen) return; // a rejected play() and its error event are one failure
      failedGen = g;
      stopPaint();
      clearTimeout(retryTimer); clearTimeout(stallTimer);
      if (attempt < RETRY_MS.length) {
        // after a media error play() alone keeps failing on the same element: reload first
        retryTimer = setTimeout(() => { if (wanted()) { v.load(); play(); } }, RETRY_MS[attempt++]);
      } else arm(); // backoff spent: wait for the reader's next tap
    };
    const play = () => {
      const mine = ++gen;
      watch(mine);
      v.play().catch(() => { if (mine === gen && wanted()) fail(mine); }); // ignore rejections from superseded plays
    };
    const stop = () => { gen++; clearTimeout(retryTimer); clearTimeout(stallTimer); stopPaint(); v.pause(); };
    const update = () => { if (!wanted()) stop(); else if (v.paused) play(); else startPaint(); };

    const onPlaying = () => { attempt = 0; disarm(); startPaint(); }; // only `playing` resets the attempts
    const onWaiting = () => { stopPaint(); watch(gen); };              // a stall holds the last frame
    const onError = () => { if (wanted()) fail(gen); };
    const onPause = () => { if (wanted() && !v.ended) fail(gen); };     // paused by the browser, not by us: go again
    v.addEventListener('playing', onPlaying);
    v.addEventListener('waiting', onWaiting);
    v.addEventListener('error', onError);
    v.addEventListener('pause', onPause);

    // start downloading a little before the banner arrives, so it's ready when it does
    const near = new IntersectionObserver((entries) => {
      if (!loaded && entries[entries.length - 1].isIntersecting) { loaded = true; v.preload = 'auto'; v.load(); }
    }, { rootMargin: '600px 0px' });
    near.observe(stage.current);
    // while the opening notebook plays (components/Intro.jsx), and always on phones, fetch it straight away instead
    const early = () => { if (!loaded) { loaded = true; v.preload = 'auto'; v.load(); } };
    if (window.aqIntro || document.documentElement.dataset.layout === 'phone') early();
    addEventListener('aq-intro', early);
    // a fling can deliver several crossings, so read the last one
    const onScreen = new IntersectionObserver((entries) => { seen = entries[entries.length - 1].isIntersecting; update(); });
    onScreen.observe(stage.current);
    const onVisibility = () => { shown = !document.hidden; update(); };
    document.addEventListener('visibilitychange', onVisibility);
    addEventListener('pageshow', onVisibility); // back/forward cache restores

    return () => {
      near.disconnect(); onScreen.disconnect(); removeEventListener('aq-intro', early);
      document.removeEventListener('visibilitychange', onVisibility);
      removeEventListener('pageshow', onVisibility);
      disarm();
      v.removeEventListener('playing', onPlaying);
      v.removeEventListener('waiting', onWaiting);
      v.removeEventListener('error', onError);
      v.removeEventListener('pause', onPause);
      stop();
    };
  }, [reduced]);

  return (
    <section className="orbit">
      <div className="orbit-stage" ref={stage}>
        <div className="orbit-word" aria-hidden="true">AQUATERRA</div>
        <div className="orbit-ring" role="img" aria-label={FOOTER_VIDEO.description}>
          {BUBBLES.map((b, i) => (
            <span key={i} className="orbit-bubble" style={{ left: `${b.left}%`, top: `${b.top}%`, width: SIZE[b.size], background: ROSTER_COLORS[i], animationDelay: `${i * 0.7}s`, animationDuration: `${9 + (i % 4) * 1.6}s` }}>
              {!reduced && <canvas ref={(el) => { canvases.current[i] = el; }} width={BACKING} height={BACKING} />}
            </span>
          ))}
        </div>
        {/* inside the stage, so it's on screen exactly when the bubbles are */}
        {!reduced && <video ref={video} className="orbit-video" src={FOOTER_VIDEO.src} preload="none" muted loop playsInline aria-hidden="true" tabIndex={-1} />}
      </div>
    </section>
  );
}

export default function SiteFooter() {
  return (
    <>
      <OrbitBanner />
      <footer className="site-footer">
        <p className="u-mono site-footer-l1">{`© ${new Date().getFullYear()} AQUATERRA · OPEN COMMUNITY, NO RIGHTS RESERVED.`}</p>
        <p className="u-mono site-footer-l2">{SITE.footerNote}</p>
      </footer>
    </>
  );
}
