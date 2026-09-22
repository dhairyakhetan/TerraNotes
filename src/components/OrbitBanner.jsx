import { useEffect, useRef, useState } from 'react';
import { FOOTER_VIDEO, ROSTER_COLORS } from '../data/site.js';

// Positions from the desk's markup: % of the stage. Sizes: lg 10.4%, md 7.8%, sm 5.8% of the stage width.
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
const FRAME_MS = 1000 / 15;   // decoration: 15fps is plenty
const BACKING = 160;          // canvas backing store per bubble

// AQUATERRA with eight bubbles drifting round it. Each bubble shows one panel of the same
// video frame: one <video>, eight <canvas>. Under reduced motion it's just the eight colours.
export default function OrbitBanner() {
  const stage = useRef(null);
  const video = useRef(null);
  const canvases = useRef([]);
  const [reduced] = useState(() => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches);

  useEffect(() => {
    if (reduced) return;
    const v = video.current;
    v.muted = true; // required, or autoplay is refused
    const ctxs = canvases.current.map((c) => c.getContext('2d'));
    let near = false, shown = !document.hidden;
    let raf = 0, last = 0, painting = false;
    let attempt = 0, retryTimer = 0, gen = 0, failedGen = -1, armed = false;

    const draw = (t) => {
      raf = requestAnimationFrame(draw);
      if (t - last < FRAME_MS) return;
      last = t;
      const pw = v.videoWidth / BUBBLES.length, h = v.videoHeight;
      if (!pw) return;
      ctxs.forEach((ctx, i) => ctx.drawImage(v, i * pw, 0, pw, h, 0, 0, BACKING, BACKING));
    };
    const startPaint = () => { if (!painting && v.readyState >= 2) { painting = true; raf = requestAnimationFrame(draw); } };
    const stopPaint = () => { painting = false; cancelAnimationFrame(raf); };
    const wanted = () => near && shown;

    const onPointer = () => { armed = false; if (wanted()) play(); };
    const fail = (g) => {
      if (g === failedGen) return; // a rejected play() and its error event are one failure
      failedGen = g;
      stopPaint();
      clearTimeout(retryTimer);
      if (attempt < RETRY_MS.length) {
        // after a media error play() alone keeps failing on the same element: reload first
        retryTimer = setTimeout(() => { if (wanted()) { v.load(); play(); } }, RETRY_MS[attempt++]);
      } else if (!armed) {
        // backoff spent (e.g. autoplay refused in Low Power Mode): wait for the reader's next tap
        armed = true;
        addEventListener('pointerdown', onPointer, { once: true });
      }
    };
    const play = () => {
      const mine = ++gen;
      v.play().catch(() => { if (mine === gen && wanted()) fail(mine); }); // ignore rejections from superseded plays
    };
    const stop = () => { gen++; clearTimeout(retryTimer); stopPaint(); v.pause(); };
    const update = () => { if (!wanted()) stop(); else if (v.paused) play(); else startPaint(); };

    const onPlaying = () => { attempt = 0; startPaint(); }; // only `playing` resets the attempts
    const onWaiting = () => stopPaint();                    // a stall holds the last frame
    const onError = () => { if (wanted()) fail(gen); };
    v.addEventListener('playing', onPlaying);
    v.addEventListener('waiting', onWaiting);
    v.addEventListener('error', onError);

    // fetch only when near the viewport; a fling can deliver several crossings, so read the last one
    const io = new IntersectionObserver((entries) => { near = entries[entries.length - 1].isIntersecting; update(); }, { rootMargin: '600px 0px' });
    io.observe(stage.current);
    const onVisibility = () => { shown = !document.hidden; update(); };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      removeEventListener('pointerdown', onPointer);
      v.removeEventListener('playing', onPlaying);
      v.removeEventListener('waiting', onWaiting);
      v.removeEventListener('error', onError);
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
      </div>
      {!reduced && <video ref={video} className="orbit-video" src={FOOTER_VIDEO.src} preload="none" muted loop playsInline aria-hidden="true" tabIndex={-1} />}
    </section>
  );
}
