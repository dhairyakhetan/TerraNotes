import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import Ghost from './Ghost.jsx';
import { callBuddy, openGames, useBuddy } from '../../lib/buddy.js';
import '../../styles/buddy.css';

// Buddy: a little ghost. Called from a hidden button in the web header's corner (he ropes down) or from the phone
// menu's "click me" (he moves into a hut by the intro). He stays for the rest of the visit (sessionStorage).
// Tap him: he does a trick and asks if you want to play (Snake or Float, see Games.jsx).
const TRICKS = ['spin', 'boing', 'flip', 'melt', 'boo', 'wobble'];
const MONO = { fontFamily: "'Space Mono', monospace", fontWeight: "700", letterSpacing: "1.2px", textTransform: "uppercase" };

function TapGhost({ size, bubbleStyle }) {
  const [trick, setTrick] = useState(null);
  const [ask, setAsk] = useState(false);
  const box = useRef(null);
  const last = useRef(null);
  useEffect(() => {
    if (!ask) return undefined;
    const out = (e) => { if (!box.current?.contains(e.target)) setAsk(false); };
    const esc = (e) => { if (e.key === 'Escape') setAsk(false); };
    addEventListener('pointerdown', out); addEventListener('keydown', esc);
    return () => { removeEventListener('pointerdown', out); removeEventListener('keydown', esc); };
  }, [ask]);
  const tap = () => {
    let t; do t = TRICKS[Math.floor(Math.random() * TRICKS.length)]; while (t === last.current);
    last.current = t;
    setTrick(null); requestAnimationFrame(() => setTrick(t)); // restart even if it's mid-trick
    setAsk((a) => !a);
  };
  const play = (g) => { setAsk(false); openGames(g); };
  return (
    <div ref={box} style={{ position: "relative" }}>
      <button className="buddy-ghost" onClick={tap} aria-label="Buddy the ghost: tap him" aria-expanded={ask ? 'true' : 'false'}>
        <span className={trick ? `buddy-trick buddy-${trick}` : 'buddy-trick'} onAnimationEnd={() => setTrick(null)}>
          <Ghost size={size} face={trick === 'boo' ? 'boo' : 'happy'} />
        </span>
      </button>
      {ask && (
        <div className="card-drop buddy-bubble" style={{ position: "absolute", zIndex: "8", width: "164px", boxSizing: "border-box", background: "#FFFFFF", border: "2px solid #111111", boxShadow: "4px 4px 0 #7B5CE6", padding: "8px 10px 10px", ...bubbleStyle }}>
          <div style={{ fontFamily: "'Caveat', cursive", fontSize: "22px", lineHeight: "1", color: "#111111" }}>wanna play?</div>
          <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
            {[['snake', 'Snake'], ['float', 'Float']].map(([g, label]) => (
              <button key={g} className="press" onClick={() => play(g)} style={{ "--c": "#111111", ...MONO, flex: "1", fontSize: "10px", minHeight: "36px", padding: "0", background: g === 'snake' ? '#7FC49B' : '#3DA5F4', color: "#111111", border: "2px solid #111111", boxShadow: "2px 2px 0 #111111" }}>{label}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Web home, top right, under the Website / Instagram buttons.
export function WebBuddy() {
  const { here, fresh } = useBuddy();
  return (
    <>
      {!here && (
        <div style={{ position: "absolute", left: "1250px", top: "92px", width: "140px", height: "30px", zIndex: "6" }}>
          <button className="buddy-call" onClick={callBuddy} aria-label="Call buddy?" style={{ position: "absolute", right: "0", top: "0" }}>
            <Ghost size={16} />
          </button>
          <span className="buddy-call-label" aria-hidden="true">Call buddy?</span>
        </div>
      )}
      {here && (
        <div className={fresh ? 'buddy-rope buddy-arrive' : 'buddy-rope'} style={{ position: "absolute", left: "1296px", top: "80px", width: "64px", zIndex: "6" }}>
          <div className="buddy-swing">
            <div className="buddy-line" style={{ marginLeft: "31px", width: "2px", height: "108px", background: "#8E7A5E" }} />
            <div className="buddy-hang">
              <TapGhost size={64} bubbleStyle={{ right: "0", top: "84px" }} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Phone home: his hut, next to the intro card.
export function HutBuddy() {
  const { here, fresh } = useBuddy();
  if (!here) return null;
  return (
    <div className={fresh ? 'buddy-hut card-drop' : 'buddy-hut'} style={{ position: "absolute", left: "284px", top: "196px", width: "92px", height: "96px", zIndex: "5" }}>
      <svg width="92" height="96" viewBox="0 0 92 96" aria-hidden="true" style={{ position: "absolute", left: "0", top: "0" }}>
        <rect x="12" y="40" width="68" height="52" fill="#FBF8F1" stroke="#111111" strokeWidth="2.5" />
        <path d="M34 92 V64 a12 12 0 0 1 24 0 V92 Z" fill="#1E2723" stroke="#111111" strokeWidth="2.5" />
        <path d="M4 44 L46 8 L88 44 Z" fill="#F0442B" stroke="#111111" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M20 46 h8 v8 h-8 Z" fill="#F7C21A" stroke="#111111" strokeWidth="2" />
        <path d="M64 18 v-10 h8 v17" fill="#8E7A5E" stroke="#111111" strokeWidth="2" />
        <path d="M0 94 H92" stroke="#111111" strokeWidth="2.5" />
      </svg>
      <div className={fresh ? 'buddy-bob buddy-float-in' : 'buddy-bob'} style={{ position: "absolute", left: "30px", top: "46px" }}>
        <TapGhost size={34} bubbleStyle={{ right: "-6px", top: "50px" }} />
      </div>
      <div style={{ position: "absolute", right: "-4px", top: "-20px", fontFamily: "'Caveat', cursive", fontSize: "17px", color: "#5B3A1E", transform: "rotate(6deg)", whiteSpace: "nowrap", pointerEvents: "none" }}>tap him</div>
    </div>
  );
}

// Phone menu, under the logo: "click me". Calls him, closes the menu and heads home to the hut.
export function MenuCall({ onClose }) {
  const nav = useNavigate();
  const { pathname } = useLocation();
  const go = () => {
    callBuddy();
    onClose?.();
    if (pathname !== '/') nav('/');
    setTimeout(() => scrollTo({ top: 0, behavior: 'smooth' }), 60);
  };
  return (
    <button className="buddy-menu-call" onClick={go} aria-label="Call buddy the ghost">
      <Ghost size={20} />
      <span>click me</span>
    </button>
  );
}
