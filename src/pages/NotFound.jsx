import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';
import PageHeader from '../components/PageHeader.jsx';
import MenuSheet from '../components/MenuSheet.jsx';
import WebHeader from '../web/WebHeader.jsx';

const NOTES = [
  "this peg's empty.",
  'the wind got this one.',
  'nothing hanging here.',
  'someone borrowed this page.',
];

// The 404 itself: an empty peg on the wire, and the "404" card lying on the ground under it. Tap the card to hang it back up.
function Lost() {
  const { pathname } = useLocation();
  const [hung, setHung] = useState(false);
  const [note] = useState(() => NOTES[Math.floor(Math.random() * NOTES.length)]);
  return (
    <div style={{ width: "350px", margin: "0 auto" }}>
      <div style={{ position: "relative", height: "420px" }}>
        {/* the wire, and the peg the card fell off */}
        <div style={{ position: "absolute", left: "-20px", top: "24px", width: "390px", height: "2px", background: "#5B3A1E" }} />
        <div style={{ position: "absolute", left: "161px", top: "19px", width: "28px", height: "10px", background: "#F0442B", border: "1.5px solid #111111", boxSizing: "border-box", zIndex: "2" }} />
        <div className="sway" style={{ position: "absolute", left: "174px", top: "28px", width: "2px", height: "34px", "--a": "9deg", "--d": "2.6s", opacity: hung ? 0 : 1, transition: "opacity .2s" }}>
          {/* the snapped string */}
          <svg width="2" height="34" viewBox="0 0 2 34" aria-hidden="true" style={{ display: "block" }}><path d="M1 0 V26 L0 30 M1 26 L2 33" stroke="#5B3A1E" strokeWidth="1.4" fill="none" /></svg>
        </div>
        <div style={{ position: "absolute", left: "198px", top: "40px", width: "150px", fontFamily: "'Caveat', cursive", fontSize: "23px", lineHeight: "1.05", color: "#5B3A1E", transform: "rotate(-5deg)", opacity: hung ? 0 : 1, transition: "opacity .3s" }}>{note}</div>

        {/* the card: on the ground, or back on its peg */}
        <button onClick={() => setHung(!hung)} aria-label={hung ? 'Drop the card' : 'Hang the card back up'} aria-pressed={hung ? 'true' : 'false'} style={{ position: "absolute", left: "95px", top: "29px", width: "160px", height: "210px", padding: "0", border: "0", background: "transparent", transformOrigin: "50% 0", transform: hung ? "none" : "translate(-46px, 146px) rotate(-14deg)", transition: hung ? "transform 700ms cubic-bezier(0.34, 1.56, 0.64, 1)" : "transform 480ms cubic-bezier(0.55, 0, 0.9, 0.45)", zIndex: "1" }}>
          <div className={hung ? 'sway' : undefined} style={{ width: "100%", height: "100%", "--a": "1.6deg", "--d": "3.4s" }}>
            <div style={{ width: "100%", height: "100%", boxSizing: "border-box", background: "#FFFFFF", border: "2px solid #111111", boxShadow: "7px 7px 0 #111111", padding: "14px", display: "flex", flexDirection: "column", justifyContent: "space-between", textAlign: "left" }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "1.4px", color: "#111111" }}>NOT ON THE LINE</span>
              <span style={{ fontFamily: "'Archivo Black', Impact, sans-serif", fontSize: "62px", lineHeight: "0.9", letterSpacing: "-2px", color: "#111111" }}>404</span>
              <span style={{ fontFamily: "'Caveat', cursive", fontSize: "20px", lineHeight: "1.05", color: "#5B3A1E" }}>{hung ? 'there. much better.' : '(tap to hang it back up)'}</span>
            </div>
          </div>
        </button>
        {/* the ground it landed on */}
        <div style={{ position: "absolute", left: "10px", top: "400px", width: "330px", height: "2px", background: "#111111", opacity: ".15" }} />
      </div>

      <h1 style={{ margin: "14px 0 0", fontFamily: "'Archivo Black', Impact, sans-serif", fontWeight: "400", fontSize: "27px", lineHeight: "0.95", textTransform: "uppercase", color: "#111111" }}>Blown off the line.</h1>
      <p style={{ margin: "12px 0 0", fontSize: "15px", lineHeight: "1.5", color: "#1E2723" }}>
        Nothing hangs at <code style={{ fontFamily: "'Space Mono', monospace", fontSize: "13px", background: "#E6E0D3", padding: "1px 5px", wordBreak: "break-all" }}>{pathname}</code>. The wind might have taken it, or it was never pinned up in the first place.
      </p>
      <div style={{ marginTop: "20px", display: "flex", gap: "12px" }}>
        <Link className="press btn" to="/" style={{ "--c": "#F7C21A", minHeight: "44px", padding: "0 18px", display: "flex", alignItems: "center", background: "#111111", color: "#FFFFFF", border: "2px solid #111111", boxShadow: "4px 4px 0 #F7C21A", fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", textDecoration: "none" }}>Take me home</Link>
        <Link className="press btn" to="/articles" style={{ "--c": "#111111", minHeight: "44px", padding: "0 18px", display: "flex", alignItems: "center", background: "#FFFFFF", color: "#111111", border: "2px solid #111111", boxShadow: "4px 4px 0 #111111", fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", textDecoration: "none" }}>See the write-ups</Link>
      </div>
    </div>
  );
}

// 404 page, phone or web layout. Search engines are told not to index it.
export default function NotFound({ web }) {
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    document.title = 'Aquaterra — not found';
    const robots = document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex';
    document.head.appendChild(robots);
    return () => robots.remove();
  }, []);

  if (web) {
    return (
      <div className="web">
        <div style={{ position: "relative", width: "1440px", margin: "0 auto", overflow: "clip", background: "#F3EEE4", color: "#111111", paddingBottom: "90px" }}>
          <WebHeader />
          <div style={{ zoom: "1.35", paddingTop: "40px" }}><Lost /></div>
        </div>
      </div>
    );
  }
  return (
    <>
      <div style={{ position: "relative", width: "390px", margin: "0 auto", overflow: "clip", background: "#F3EEE4", color: "#111111", paddingBottom: "60px" }}>
        <PageHeader backTo="/" backLabel="Back to home" menuOpen={menuOpen} onOpenMenu={() => setMenuOpen(true)} />
        <div style={{ paddingTop: "36px" }}><Lost /></div>
      </div>
      <MenuSheet open={menuOpen} onClose={() => setMenuOpen(false)} current="lost" />
    </>
  );
}
