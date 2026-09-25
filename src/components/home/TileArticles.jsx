import { useLayoutEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import Img from '../Img.jsx';
import { ARTICLES, TAGS } from '../../data/articles.js';
import { MEMBERS } from '../../data/team.js';
import { pad2 } from '../../lib/format.js';
import { ByTape, useByWriter } from '../../lib/byWriter.jsx';

// TEMPORARY: the phone's "tiles" view of the articles (switch in the header), to compare with the other two.
// Big rounded tiles in a sideways row, the next one peeking in; title panel over the picture, a like button under it.
// Tap a tile to open it; double-tap it to like it: a heart pops up where you tapped, rises, then drops into the like
// button. Likes are remembered on this device (they survive reloads).
const LIKES = 'aq-liked';
const likedSet = () => { try { return new Set(JSON.parse(localStorage.getItem(LIKES) || '[]')); } catch { return new Set(); } };
const keepLike = (slug, on) => { try { const s = likedSet(); if (on) s.add(slug); else s.delete(slug); localStorage.setItem(LIKES, JSON.stringify([...s])); } catch { /* private mode */ } };
const icon = { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" };

const HEART = "M12 20 C5 15 3 12 3 8.5 A4.5 4.5 0 0 1 12 6 A4.5 4.5 0 0 1 21 8.5 C21 12 19 15 12 20 Z";
const HEART_SIZE = 84;

function Tile({ a, mark }) {
  const [liked, setLikedState] = useState(() => likedSet().has(a.slug));
  const [fly, setFly] = useState(null); // the heart on its way: where it starts, and how far to the like button
  const nav = useNavigate();
  const wait = useRef(null), wrap = useRef(null), likeIcon = useRef(null), heart = useRef(null);
  const tag = TAGS[a.tag];
  const author = MEMBERS.find((m) => m.name === a.author);
  const to = `/articles/${a.slug}`;
  const setLiked = (on) => { setLikedState(on); keepLike(a.slug, on); };
  // one tap opens the article (after a moment, in case a second tap is coming); a double tap likes it
  const onTap = (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button > 0) return; // new tab etc. as usual
    e.preventDefault();
    if (e.detail === 0) { nav(to); return; } // keyboard Enter
    if (wait.current) { clearTimeout(wait.current); wait.current = null; likeFrom(e.clientX, e.clientY); return; }
    wait.current = setTimeout(() => { wait.current = null; nav(to); }, 260);
  };
  const likeFrom = (x, y) => {
    keepLike(a.slug, true); // saved straight away; the button fills when the heart lands
    const box = wrap.current.getBoundingClientRect(), icon = likeIcon.current.getBoundingClientRect();
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !wrap.current.animate) { setLikedState(true); return; }
    const sx = x - box.left, sy = y - box.top;
    setFly({ sx, sy, dx: icon.left + icon.width / 2 - box.left - sx, dy: icon.top + icon.height / 2 - box.top - sy, rise: Math.min(60, sy - 50), n: Date.now() });
  };
  useLayoutEffect(() => {
    if (!fly || !heart.current) return undefined;
    const { dx, dy, rise } = fly;
    const an = heart.current.animate([
      { transform: 'translate(0px, 0px) scale(0.2) rotate(-14deg)', opacity: 0, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
      { transform: 'translate(0px, 0px) scale(1.1) rotate(5deg)', opacity: 1, offset: 0.22, easing: 'cubic-bezier(0.2, 0.8, 0.3, 1)' },
      { transform: `translate(0px, ${-rise}px) scale(1) rotate(-4deg)`, opacity: 1, offset: 0.52, easing: 'cubic-bezier(0.6, 0, 0.9, 0.4)' },
      { transform: `translate(${dx}px, ${dy}px) scale(${22 / HEART_SIZE}) rotate(0deg)`, opacity: 1 },
    ], { duration: 1050, fill: 'forwards' });
    an.onfinish = () => { setLikedState(true); setFly(null); };
    return () => { an.onfinish = null; };
  }, [fly]);
  return (
    <div ref={wrap} style={{ position: "relative", flexShrink: "0", width: "328px", scrollSnapAlign: "start" }}>
      {fly && (
        <svg key={fly.n} ref={heart} width={HEART_SIZE} height={HEART_SIZE} viewBox="0 0 24 24" aria-hidden="true" style={{ position: "absolute", zIndex: "4", left: `${fly.sx - HEART_SIZE / 2}px`, top: `${fly.sy - HEART_SIZE / 2}px`, pointerEvents: "none", opacity: "0", filter: "drop-shadow(2px 3px 0 rgba(17,17,17,.35))" }}>
          <path d={HEART} fill="#F0442B" stroke="#111111" strokeWidth="1.2" strokeLinejoin="round" />
        </svg>
      )}
      <div style={{ position: "relative" }}>
        <Link className="tile" to={to} onClick={onTap} style={{ touchAction: "manipulation", position: "relative", display: "block", height: "430px", borderRadius: "22px", overflow: "hidden", border: "2px solid #111111", boxSizing: "border-box", textDecoration: "none" }}>
          <Img src={a.cover} alt={a.alt} box={{ height: "100%", border: "0" }} icon={24} font="12px" />
          <span style={{ position: "absolute", left: "12px", top: "12px", background: tag.color, color: tag.ink, fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "10.5px", letterSpacing: "1px", textTransform: "uppercase", padding: "5px 10px", borderRadius: "999px", border: "1.5px solid #111111" }}>{a.tag}</span>
          <span style={{ position: "absolute", right: "12px", top: "12px", background: "#FFFFFF", fontFamily: "'Space Mono', monospace", fontSize: "10.5px", letterSpacing: "1px", color: "#111111", padding: "5px 9px", borderRadius: "999px", border: "1.5px solid #111111" }}>{`${pad2(ARTICLES.indexOf(a) + 1)} / ${pad2(ARTICLES.length)}`}</span>
          <div style={{ position: "absolute", left: "10px", right: "10px", bottom: "10px", boxSizing: "border-box", padding: "14px 16px 16px", borderRadius: "16px", background: "#1E2723", color: "#FFFFFF", WebkitFontSmoothing: "antialiased" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "9px", fontSize: "15px", color: "#D9D4C7" }}>
              <span style={{ width: "26px", height: "26px", flexShrink: "0", borderRadius: "7px", overflow: "hidden", background: tag.color, color: tag.ink, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Archivo Black', Impact, sans-serif", fontSize: "13px" }}>
                {author && author.photo ? <img src={author.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (a.author || '?')[0]}
              </span>
              {(a.author || '[author]').toLowerCase()}
            </div>
            <div style={{ marginTop: "9px", fontSize: "22px", fontWeight: "600", lineHeight: "1.2", letterSpacing: "-0.2px" }}>{a.title.toLowerCase()}</div>
          </div>
        </Link>
        {mark && <ByTape name={mark} style={{ right: "18px", top: "-10px" }} />}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "20px", padding: "12px 6px 0", color: "#1E2723" }}>
        <button onClick={() => setLiked(!liked)} aria-label={liked ? 'Unlike' : 'Like'} aria-pressed={liked ? 'true' : 'false'} style={{ minHeight: "36px", padding: "0", border: "0", background: "transparent", display: "flex", alignItems: "center", gap: "6px", color: liked ? '#F0442B' : '#1E2723' }}>
          <span ref={likeIcon} style={{ display: "flex" }}><svg {...icon} key={liked ? 'on' : 'off'} className={liked ? 'icon-pop' : undefined} fill={liked ? 'currentColor' : 'none'}><path d={HEART} /></svg></span>
        </button>
        <span style={{ marginLeft: "auto", fontFamily: "'Space Mono', monospace", fontSize: "12px", letterSpacing: "1px", textTransform: "uppercase" }}>{`${a.readTime || '[x]'} min`}</span>
      </div>
    </div>
  );
}

export default function TileArticles() {
  const { by, isMine, list } = useByWriter(); // ?by=<writer>: their pieces first, taped
  return (
    <>
      {/* "Articles" label card, tied to the intro card's knot */}
      <div className="hang sway" style={{ position: "absolute", left: "20px", top: "312px", width: "150px", height: "196px", "--a": "1.79deg", "--d": "5.0s", animationDelay: "-0.4s" }}>
        <div className="string" style={{ position: "absolute", left: "74.3px", top: "0", width: "1.4px", height: "62px", background: "#5B3A1E" }} />
        <div className="flutter" style={{ position: "absolute", left: "0", top: "60px", width: "150px", height: "136px", "--r": "-2.5deg", transform: "rotate(-2.5deg)", animationDelay: "-1.1s" }}>
          <div style={{ position: "absolute", left: "50%", top: "-6px", marginLeft: "-12px", width: "24px", height: "9px", background: "#F0442B", border: "1.5px solid #111111", boxSizing: "border-box", zIndex: "2" }} />
          <div style={{ width: "100%", height: "100%", boxSizing: "border-box", background: "#111111", color: "#F3EEE4", padding: "16px", border: "2px solid #111111", boxShadow: "6px 6px 0 #F0442B", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <h2 style={{ margin: "0", fontFamily: "'Caveat', cursive", fontWeight: "700", fontSize: "46px", lineHeight: "0.9" }}>Articles</h2>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "1.4px", textTransform: "uppercase", color: "#CFC8B8" }}>{`${pad2(ARTICLES.length)} pieces`}</div>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: "196px", top: "420px", width: "170px", fontFamily: "'Caveat', cursive", fontSize: "22px", lineHeight: "1.05", color: "#5B3A1E", transform: "rotate(-4deg)" }}>swipe through them →</div>
      <div className="tiles" aria-label="All write-ups, swipe sideways" style={{ position: "absolute", left: "0", top: "540px", width: "390px", display: "flex", gap: "12px", overflowX: "auto", overflowY: "hidden", scrollSnapType: "x mandatory", scrollPaddingLeft: "16px", padding: "0 16px 8px", boxSizing: "border-box", scrollbarWidth: "none", overscrollBehaviorX: "contain" }}>
        {list.map((a) => <Tile key={a.slug} a={a} mark={isMine(a) ? by : undefined} />)}
        <span style={{ flexShrink: "0", width: "6px" }} />
      </div>
    </>
  );
}
