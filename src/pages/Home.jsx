import React from 'react';
import { Link } from 'react-router';
import MenuSheet from '../components/MenuSheet.jsx';
import WordsGame from '../components/home/WordsGame.jsx';
import Members from '../components/home/Members.jsx';
import PhotoViewer from '../components/home/PhotoViewer.jsx';

/*
  AQUATERRA / TERRANOTES — MOBILE HOME (390px wide)
  Everything is absolutely positioned inside one 390px-wide root (#top); coordinates are page px from the
  top-left. Styles and animations: styles/home.css. The interactive sections are their own components
  (components/home/) so a tap there only redraws that section, not the whole page.

  STATE: menuOpen – full-screen menu is slid in; gal – photo the highlights viewer is open on, null = closed
  PROPS: motion – false switches off sway/float animations (adds .no-motion to the root)
*/
export default class Home extends React.Component {
  state = { menuOpen: false, gal: null };

  componentDidMount() {
    document.title = 'Aquaterra';
  }

  openMenu = () => this.setState({ menuOpen: true });
  closeMenu = () => this.setState({ menuOpen: false });

  renderVals() {
    const motion = this.props.motion ?? true;
    const g = {};
    for (let k = 0; k < 5; k++) g['open' + k] = () => this.setState({ gal: k });
    return {
      rootClass: motion ? 'page-home' : 'page-home no-motion',
      menuExpanded: this.state.menuOpen ? 'true' : 'false',
      openMenu: this.openMenu,
      g: g
    };
  }

  render() {
    const v = this.renderVals();
    return (
      <>
        <div id="top" className={v.rootClass} style={{ position: "relative", width: "390px", height: "3910px", margin: "0 auto", overflow: "clip", background: "#F3EEE4", fontFamily: "'Figtree', system-ui, sans-serif", color: "#1E2723" }}>
          {/* STICKY HEADER — the only in-flow element of the page (everything else is absolutely positioned), so
             position: sticky pins it to the top while scrolling. It needs the root to use overflow: clip (NOT hidden),
             otherwise sticky silently stops working. Logo = globe mark + AQUATERRA block wordmark (.wordmark in styles/global.css). */}
          <header className="site-header" style={{ position: "sticky", top: "0", zIndex: "50", width: "390px", height: "64px", boxSizing: "border-box", padding: "0 10px 0 16px", background: "#F3EEE4", borderBottom: "2px solid #111111", display: "flex", alignItems: "center", gap: "4px" }}>
            <Link aria-label="Aquaterra — home" style={{ display: "flex", alignItems: "center", gap: "6px", minHeight: "44px", textDecoration: "none" }} to="/">
              <img src="/logo.png" alt="" width="38" height="38" style={{ display: "block", width: "38px", height: "38px" }} />
              <span className="wordmark" style={{ fontFamily: "'Archivo Black', Impact, sans-serif", fontSize: "30px", lineHeight: "1", letterSpacing: "0.5px", textTransform: "uppercase" }}>Aquaterra</span>
            </Link>
            <span style={{ flexGrow: "1" }} />
            <button onClick={v.openMenu} aria-label="Open menu" aria-expanded={v.menuExpanded} style={{ width: "44px", height: "44px", flexShrink: "0", border: "0", background: "transparent", padding: "0", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="26" height="18" viewBox="0 0 26 18" fill="none" stroke="#1E2723" strokeWidth="1.8" strokeLinecap="round">
                <path d="M2 5 C9 3 17 6 24 4" />
                <path d="M8 13 C13 12 19 14 24 12" />
              </svg>
            </button>
          </header>
          {/* ============ INTRODUCTION ============ */}
          <section style={{ position: "absolute", left: "20px", top: "118px", width: "250px", transform: "rotate(-1deg)", zIndex: "3" }}>
            <div style={{ position: "absolute", left: "7px", top: "7px", width: "250px", height: "200px", background: "#111111" }} />
            <div style={{ position: "relative", width: "250px", height: "200px", boxSizing: "border-box", padding: "18px 20px", background: "#FFFFFF", border: "2px solid #111111", display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ fontFamily: "'Caveat', cursive", fontSize: "24px", lineHeight: "1", color: "#4B6647" }}>Introduction</div>
              <h1 style={{ margin: "0", fontFamily: "'Instrument Serif', Georgia, serif", fontWeight: "400", fontSize: "27px", lineHeight: "1.08" }}>Notes from where the land meets the water.</h1>
              <p style={{ margin: "0", fontSize: "13px", lineHeight: "1.5", color: "#4A524D" }}>[Two or three lines introducing Aquaterra and what Terranotes is for.]</p>
            </div>
            {/* anchor knot: the "Articles" chain is tied here (page x≈95) */}
            <div style={{ position: "absolute", left: "68px", top: "194px", width: "14px", height: "14px", boxSizing: "border-box", borderRadius: "50%", background: "#F0442B", border: "2px solid #111111" }} />
          </section>
          {/* ============ ARTICLES — hanging photographs ============
          STRUCTURE (read before editing):
          • Two chains. Chain A: INTRODUCTION (static anchor) → "Articles" label card → Card 02.
            Chain B: Card 01 (single long string that comes in from above the screen) → Card 03.
            Card 05 (wide) hangs from BOTH card 02 and card 03 — see its own comment.
          • Each hanging item is a ".hang" wrapper = ".string" + ".flutter" (the card box). A child item is placed INSIDE its
            parent's ".flutter" box, so it moves with its parent and its string always stays attached. Child coordinates
            (anchor x/y) are therefore relative to the parent card's top-left corner, not to the page.
          • Resting page positions: label 20,372 · card01 196,348 · card02 26,540 · card03 212,640 · card05 28,908.
          • Motion: ".sway" = pendulum around the string anchor (--a angle, --d duration); ".flutter" = small wobble of the card
            around its clip (--r = resting tilt). Keyframes are in styles/home.css under "HANGING ARTICLES".
          • The intro box sits above the strings (z-index 3); its small knot marks where Chain A is tied on. */}
          {/* Card 05 (wide) — hangs from BOTH card 02 (string at page x=150) and card 03 (page x=290).
             It is a top-level item painted BEFORE the chains, so the tops of its two strings slide BEHIND the bottoms of
             card 02 (y≈780) and card 03 (y≈880): when those cards sway, the strings never show a gap.
             Card top y=908. To move it, keep the string heights = 908 − string top. */}
          <div className="hang sway" style={{ position: "absolute", left: "28px", top: "760px", width: "334px", height: "344px", "--a": "0.35deg", "--d": "6.4s", animationDelay: "-2.6s" }}>
            <div className="string" style={{ position: "absolute", left: "121.3px", top: "0", width: "1.4px", height: "150px", background: "#5B3A1E" }} />
            <div className="string" style={{ position: "absolute", left: "261.3px", top: "100px", width: "1.4px", height: "50px", background: "#5B3A1E" }} />
            <Link className="card" style={{ position: "absolute", left: "0", top: "148px", width: "334px", height: "196px", display: "block", textDecoration: "none", color: "#111111" }} to="/articles/kolkata-at-41-degrees">
              <div style={{ position: "absolute", left: "110px", top: "-6px", marginLeft: "0", width: "24px", height: "9px", background: "#F7C21A", border: "1.5px solid #111111", boxSizing: "border-box", zIndex: "2" }} />
              <div style={{ position: "absolute", left: "250px", top: "-6px", marginLeft: "0", width: "24px", height: "9px", background: "#F7C21A", border: "1.5px solid #111111", boxSizing: "border-box", zIndex: "2" }} />
              <article style={{ width: "100%", height: "100%", boxSizing: "border-box", background: "#FFFFFF", border: "2px solid #111111", boxShadow: "7px 7px 0 #111111", padding: "8px", display: "flex", gap: "12px" }}>
                <div style={{ width: "122px", flexShrink: "0", height: "176px", background: "#F2F1ED", border: "1.5px dashed #B9B5AA", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px", fontSize: "11px", color: "#444" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.6" aria-hidden="true">
                    <rect x="3" y="4" width="18" height="16" rx="1" />
                    <circle cx="9" cy="10" r="2" />
                    <path d="M3 17 L9 13 L13 16 L16 13 L21 17" />
                  </svg>
                  <span>41 degrees</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", paddingTop: "4px", flexGrow: "1" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ background: "#F7C21A", color: "#111111", fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "8.5px", letterSpacing: "1px", textTransform: "uppercase", padding: "3px 8px", borderRadius: "999px", lineHeight: "1.2" }}>Dispatch</span>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", letterSpacing: "1px", color: "#111111" }}>05 / 06</span>
                  </div>
                  <h3 style={{ margin: "0", fontFamily: "'Archivo Black', Impact, sans-serif", fontWeight: "400", fontSize: "22px", lineHeight: "0.95", letterSpacing: "-0.3px", textTransform: "uppercase", color: "#111111" }}>Kolkata at 41 degrees</h3>
                  <p style={{ margin: "0", fontFamily: "'Caveat', cursive", fontSize: "16px", lineHeight: "1.1", color: "#5B4630" }}>a heatwave bus ride, stop by stop: who gets shade, who doesn't</p>
                </div>
              </article>
            </Link>
          </div>
          {/* Label card 'Articles' hangs from the INTRODUCTION (the anchor) — anchor (95, 312) in parent coords · string 60px · card 150x136 · tilt -2.5deg relative to parent */}
          <div className="hang sway" style={{ position: "absolute", left: "20px", top: "312px", width: "150px", height: "196px", "--a": "1.79deg", "--d": "5.0s", animationDelay: "-0.4s" }}>
            <div className="string" style={{ position: "absolute", left: "74.3px", top: "0", width: "1.4px", height: "62px", background: "#5B3A1E" }} />
            <div className="flutter" style={{ position: "absolute", left: "0", top: "60px", width: "150px", height: "136px", "--r": "-2.5deg", transform: "rotate(-2.5deg)", animationDelay: "-1.1s" }}>
              <div className="label-card" style={{ position: "absolute", left: "0", top: "0", width: "150px", height: "136px", display: "block", textDecoration: "none", color: "#111111" }}>
                <div style={{ position: "absolute", left: "50%", top: "-6px", marginLeft: "-12px", width: "24px", height: "9px", background: "#F0442B", border: "1.5px solid #111111", boxSizing: "border-box", zIndex: "2" }} />
                <div style={{ width: "100%", height: "100%", boxSizing: "border-box", background: "#111111", color: "#F3EEE4", padding: "16px", border: "2px solid #111111", boxShadow: "6px 6px 0 #F0442B", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <h2 style={{ margin: "0", fontFamily: "'Caveat', cursive", fontWeight: "700", fontSize: "46px", lineHeight: "0.9" }}>Articles</h2>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "1.4px", textTransform: "uppercase", color: "#CFC8B8" }}>06 pieces</div>
                </div>
              </div>
              {/* Card 02 hangs from the label card — anchor (94, 136) in parent coords · string 32px · card 176x240 · tilt 0.9deg relative to parent */}
              <div className="hang sway" style={{ position: "absolute", left: "6px", top: "136px", width: "176px", height: "272px", "--a": "1.51deg", "--d": "5.8s", animationDelay: "-3.4s" }}>
                <div className="string" style={{ position: "absolute", left: "87.3px", top: "0", width: "1.4px", height: "34px", background: "#5B3A1E" }} />
                <div className="flutter" style={{ position: "absolute", left: "0", top: "32px", width: "176px", height: "240px", "--r": "0.9deg", transform: "rotate(0.9deg)", animationDelay: "-4.1s" }}>
                  <Link className="card" style={{ position: "absolute", left: "0", top: "0", width: "176px", height: "240px", display: "block", textDecoration: "none", color: "#111111" }} to="/articles/what-the-river-remembers">
                    <div style={{ position: "absolute", left: "50%", top: "-6px", marginLeft: "-12px", width: "24px", height: "9px", background: "#3DA5F4", border: "1.5px solid #111111", boxSizing: "border-box", zIndex: "2" }} />
                    <article style={{ width: "100%", height: "100%", boxSizing: "border-box", background: "#FFFFFF", border: "2px solid #111111", boxShadow: "6px 6px 0 #111111", padding: "8px", display: "flex", flexDirection: "column", gap: "7px", overflow: "hidden" }}>
                      <div style={{ height: "92px", background: "#F2F1ED", border: "1.5px dashed #B9B5AA", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px", fontSize: "11px", color: "#444" }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.6" aria-hidden="true">
                          <rect x="3" y="4" width="18" height="16" rx="1" />
                          <circle cx="9" cy="10" r="2" />
                          <path d="M3 17 L9 13 L13 16 L16 13 L21 17" />
                        </svg>
                        <span>the river</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ background: "#3DA5F4", color: "#111111", fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "8.5px", letterSpacing: "1px", textTransform: "uppercase", padding: "3px 8px", borderRadius: "999px", lineHeight: "1.2" }}>Reportage</span>
                        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", letterSpacing: "1px", color: "#111111" }}>02 / 06</span>
                      </div>
                      <h3 style={{ margin: "0", fontFamily: "'Archivo Black', Impact, sans-serif", fontWeight: "400", fontSize: "15.5px", lineHeight: "0.95", letterSpacing: "-0.3px", textTransform: "uppercase", color: "#111111" }}>What the river remembers</h3>
                      <p style={{ margin: "0", fontFamily: "'Caveat', cursive", fontSize: "15px", lineHeight: "1.1", color: "#5B4630" }}>we tested the river with a borrowed meter. here's what it said.</p>
                    </article>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          {/* Card 01 — the ONE string that enters from above the screen — anchor (284, -60) in parent coords · string 408px · card 176x240 · tilt 1.8deg relative to parent */}
          <div className="hang sway" style={{ position: "absolute", left: "196px", top: "-60px", width: "176px", height: "648px", "--a": "0.76deg", "--d": "6.0s", animationDelay: "-2.0s" }}>
            <div className="string" style={{ position: "absolute", left: "87.3px", top: "0", width: "1.4px", height: "410px", background: "#5B3A1E" }} />
            <div className="flutter" style={{ position: "absolute", left: "0", top: "408px", width: "176px", height: "240px", "--r": "1.8deg", transform: "rotate(1.8deg)", animationDelay: "-2.7s" }}>
              <Link className="card" style={{ position: "absolute", left: "0", top: "0", width: "176px", height: "240px", display: "block", textDecoration: "none", color: "#111111" }} to="/articles/the-last-of-the-wetlands">
                <div style={{ position: "absolute", left: "50%", top: "-6px", marginLeft: "-12px", width: "24px", height: "9px", background: "#F0442B", border: "1.5px solid #111111", boxSizing: "border-box", zIndex: "2" }} />
                <article style={{ width: "100%", height: "100%", boxSizing: "border-box", background: "#FFFFFF", border: "2px solid #111111", boxShadow: "6px 6px 0 #111111", padding: "8px", display: "flex", flexDirection: "column", gap: "7px", overflow: "hidden" }}>
                  <div style={{ height: "92px", background: "#F2F1ED", border: "1.5px dashed #B9B5AA", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px", fontSize: "11px", color: "#444" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.6" aria-hidden="true">
                      <rect x="3" y="4" width="18" height="16" rx="1" />
                      <circle cx="9" cy="10" r="2" />
                      <path d="M3 17 L9 13 L13 16 L16 13 L21 17" />
                    </svg>
                    <span>wetlands</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ background: "#F0442B", color: "#FFFFFF", fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "8.5px", letterSpacing: "1px", textTransform: "uppercase", padding: "3px 8px", borderRadius: "999px", lineHeight: "1.2" }}>Field notes</span>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", letterSpacing: "1px", color: "#111111" }}>01 / 06</span>
                  </div>
                  <h3 style={{ margin: "0", fontFamily: "'Archivo Black', Impact, sans-serif", fontWeight: "400", fontSize: "16px", lineHeight: "0.95", letterSpacing: "-0.3px", textTransform: "uppercase", color: "#111111" }}>The last of the wetlands</h3>
                  <p style={{ margin: "0", fontFamily: "'Caveat', cursive", fontSize: "15px", lineHeight: "1.1", color: "#5B4630" }}>two dawns counting what's left of the city's marshes</p>
                </article>
              </Link>
              {/* Card 03 hangs from card 01 — anchor (99, 240) in parent coords · string 52px · card 166x240 · tilt 0.6deg relative to parent */}
              <div className="hang sway" style={{ position: "absolute", left: "16px", top: "240px", width: "166px", height: "292px", "--a": "1.33deg", "--d": "5.4s", animationDelay: "-1.1s" }}>
                <div className="string" style={{ position: "absolute", left: "82.3px", top: "0", width: "1.4px", height: "54px", background: "#5B3A1E" }} />
                <div className="flutter" style={{ position: "absolute", left: "0", top: "52px", width: "166px", height: "240px", "--r": "0.6deg", transform: "rotate(0.6deg)", animationDelay: "-1.8s" }}>
                  <Link className="card" style={{ position: "absolute", left: "0", top: "0", width: "166px", height: "240px", display: "block", textDecoration: "none", color: "#111111" }} to="/articles/six-months-of-compost">
                    <div style={{ position: "absolute", left: "50%", top: "-6px", marginLeft: "-12px", width: "24px", height: "9px", background: "#1E7A4C", border: "1.5px solid #111111", boxSizing: "border-box", zIndex: "2" }} />
                    <article style={{ width: "100%", height: "100%", boxSizing: "border-box", background: "#FFFFFF", border: "2px solid #111111", boxShadow: "6px 6px 0 #111111", padding: "8px", display: "flex", flexDirection: "column", gap: "7px", overflow: "hidden" }}>
                      <div style={{ height: "92px", background: "#F2F1ED", border: "1.5px dashed #B9B5AA", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px", fontSize: "11px", color: "#444" }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.6" aria-hidden="true">
                          <rect x="3" y="4" width="18" height="16" rx="1" />
                          <circle cx="9" cy="10" r="2" />
                          <path d="M3 17 L9 13 L13 16 L16 13 L21 17" />
                        </svg>
                        <span>compost</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ background: "#1E7A4C", color: "#FFFFFF", fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "8.5px", letterSpacing: "1px", textTransform: "uppercase", padding: "3px 8px", borderRadius: "999px", lineHeight: "1.2" }}>Logbook</span>
                        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", letterSpacing: "1px", color: "#111111" }}>03 / 06</span>
                      </div>
                      <h3 style={{ margin: "0", fontFamily: "'Archivo Black', Impact, sans-serif", fontWeight: "400", fontSize: "15px", lineHeight: "0.95", letterSpacing: "-0.3px", textTransform: "uppercase", color: "#111111" }}>Six months of compost</h3>
                      <p style={{ margin: "0", fontFamily: "'Caveat', cursive", fontSize: "15px", lineHeight: "1.1", color: "#5B4630" }}>one terrace bin, six months, a lot of trial and error</p>
                    </article>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <Link style={{ position: "absolute", right: "22px", top: "1122px", fontFamily: "'Caveat', cursive", fontSize: "22px", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px", minHeight: "44px" }} to="/articles">all articles{" "}<svg width="30" height="12" viewBox="0 0 30 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
          <path d="M1 7 C10 4 18 8 28 6" />
          <path d="M23 2 L28 6 L23 10" />
        </svg></Link>
          {/* ============ PHOTO WALL / FAIRY LIGHTS ============ */}
          <section id="photos" style={{ position: "absolute", left: "10px", top: "1190px", width: "370px", height: "600px", background: "#1C2622", borderRadius: "28px", overflow: "hidden" }}>
            <div style={{ position: "absolute", left: "22px", top: "24px", fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "30px", color: "#F3EEE4", lineHeight: "1" }}>Photo wall</div>
            <div style={{ position: "absolute", left: "190px", top: "30px", fontFamily: "'Caveat', cursive", fontSize: "20px", color: "#E9A23B", transform: "rotate(-4deg)" }}>moments, strung up</div>
            <svg width="370" height="600" viewBox="10 0 370 600" style={{ position: "absolute", left: "0", top: "0" }} aria-hidden="true">
              <defs>
                <radialGradient id="glow">
                  <stop offset="0" stopColor="#FFC861" stopOpacity=".75" />
                  <stop offset="1" stopColor="#FFC861" stopOpacity="0" />
                </radialGradient>
              </defs>
              <g stroke="#8E8A7A" strokeWidth="1.2" fill="none">
                <path d="M-10 90 Q95 170 200 100 Q300 40 400 120" />
                <path d="M-10 330 Q120 420 250 360 Q330 320 400 370" />
              </g>
              {/* bulbs: each <g class="bulb"> = soft glow + bright core. fk1–fk4 flicker at different, uneven intervals.
             .spark = 4-point glints that pop briefly on a few bulbs (see "PHOTO WALL" in styles/home.css). */}
              <g className="bulb fk1">
                <circle cx="25" cy="112.5" r="15" fill="url(#glow)" />
                <circle cx="25" cy="112.5" r="3.6" fill="#FFE6AE" />
              </g>
              <g className="bulb ">
                <circle cx="95" cy="132.5" r="15" fill="url(#glow)" />
                <circle cx="95" cy="132.5" r="3.6" fill="#FFE6AE" />
              </g>
              <g className="bulb fk2">
                <circle cx="130" cy="130" r="15" fill="url(#glow)" />
                <circle cx="130" cy="130" r="3.6" fill="#FFE6AE" />
              </g>
              <g className="bulb ">
                <circle cx="165" cy="119" r="15" fill="url(#glow)" />
                <circle cx="165" cy="119" r="3.6" fill="#FFE6AE" />
              </g>
              <g className="bulb fk3">
                <circle cx="233" cy="84" r="15" fill="url(#glow)" />
                <circle cx="233" cy="84" r="3.6" fill="#FFE6AE" />
              </g>
              <g className="bulb ">
                <circle cx="266" cy="76" r="15" fill="url(#glow)" />
                <circle cx="266" cy="76" r="3.6" fill="#FFE6AE" />
              </g>
              <g className="bulb fk4">
                <circle cx="333" cy="82" r="15" fill="url(#glow)" />
                <circle cx="333" cy="82" r="3.6" fill="#FFE6AE" />
              </g>
              <g className="bulb ">
                <circle cx="366" cy="97" r="15" fill="url(#glow)" />
                <circle cx="366" cy="97" r="3.6" fill="#FFE6AE" />
              </g>
              <g className="bulb fk2">
                <circle cx="33" cy="356" r="15" fill="url(#glow)" />
                <circle cx="33" cy="356" r="3.6" fill="#FFE6AE" />
              </g>
              <g className="bulb fk1">
                <circle cx="77" cy="373" r="15" fill="url(#glow)" />
                <circle cx="77" cy="373" r="3.6" fill="#FFE6AE" />
              </g>
              <g className="bulb ">
                <circle cx="163" cy="383" r="15" fill="url(#glow)" />
                <circle cx="163" cy="383" r="3.6" fill="#FFE6AE" />
              </g>
              <g className="bulb fk3">
                <circle cx="207" cy="376" r="19" fill="url(#glow)" />
                <circle cx="207" cy="376" r="4.2" fill="#FFE6AE" />
              </g>
              <g className="bulb ">
                <circle cx="276" cy="349" r="15" fill="url(#glow)" />
                <circle cx="276" cy="349" r="3.6" fill="#FFE6AE" />
              </g>
              <g className="bulb fk4">
                <circle cx="352" cy="347" r="15" fill="url(#glow)" />
                <circle cx="352" cy="347" r="3.6" fill="#FFE6AE" />
              </g>
              <g className="bulb ">
                <circle cx="376" cy="356" r="15" fill="url(#glow)" />
                <circle cx="376" cy="356" r="3.6" fill="#FFE6AE" />
              </g>
              <g transform="translate(130 130)">
                <path className="spark sp1" d="M0 -9 L1.6 -1.6 L9 0 L1.6 1.6 L0 9 L-1.6 1.6 L-9 0 L-1.6 -1.6 Z" fill="#FFF4D6" />
              </g>
              <g transform="translate(266 76)">
                <path className="spark sp2" d="M0 -8 L1.6 -1.6 L8 0 L1.6 1.6 L0 8 L-1.6 1.6 L-8 0 L-1.6 -1.6 Z" fill="#FFF4D6" />
              </g>
              <g transform="translate(207 376)">
                <path className="spark sp3" d="M0 -11 L1.6 -1.6 L11 0 L1.6 1.6 L0 11 L-1.6 1.6 L-11 0 L-1.6 -1.6 Z" fill="#FFF4D6" />
              </g>
              <g transform="translate(352 347)">
                <path className="spark sp1 sp-late" d="M0 -8 L1.6 -1.6 L8 0 L1.6 1.6 L0 8 L-1.6 1.6 L-8 0 L-1.6 -1.6 Z" fill="#FFF4D6" />
              </g>
              <g transform="translate(25 112.5)">
                <path className="spark sp2 sp-late" d="M0 -7 L1.6 -1.6 L7 0 L1.6 1.6 L0 7 L-1.6 1.6 L-7 0 L-1.6 -1.6 Z" fill="#FFF4D6" />
              </g>
            </svg>
            {/* polaroids (positions relative to panel; panel x = page x - 10).
             .twist = every ~10–14s a photo turns on its peg (3D, around the clip) and a light .glint crosses the print. */}
            <figure className="twist" style={{ position: "absolute", left: "2px", top: "134px", width: "116px", margin: "0", "--r": "-5deg", transform: "rotate(-5deg)", transformOrigin: "50% 0", animationDuration: "11s", animationDelay: "-2s" }}>
              <div style={{ position: "absolute", left: "53px", top: "-10px", width: "9px", height: "18px", background: "#C9A57A", borderRadius: "2px" }} />
              <div style={{ background: "#FFFFFF", padding: "7px 7px 0", border: "2px solid #111111", boxShadow: "5px 5px 0 #E9A23B" }}>
                <div style={{ position: "relative", overflow: "hidden", height: "96px", background: "#6F8468", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", color: "#EDE9DD" }}>[photo]<div className="glint" style={{ animationDuration: "11s", animationDelay: "-2s" }} /></div>
                <figcaption style={{ fontFamily: "'Caveat', cursive", fontSize: "16px", padding: "4px 0 6px", textAlign: "center" }}>[caption]</figcaption>
              </div>
              <button className="ph-open" onClick={v.g.open0} aria-label="Open photo 1 of 5" style={{ position: "absolute", left: "0", top: "0", width: "100%", height: "100%", padding: "0", background: "transparent", border: "0" }} />
            </figure>
            <figure className="twist" style={{ position: "absolute", left: "132px", top: "104px", width: "116px", margin: "0", "--r": "3.5deg", transform: "rotate(3.5deg)", transformOrigin: "50% 0", animationDuration: "13s", animationDelay: "-7s" }}>
              <div style={{ position: "absolute", left: "53px", top: "-10px", width: "9px", height: "18px", background: "#C9A57A", borderRadius: "2px" }} />
              <div style={{ background: "#FFFFFF", padding: "7px 7px 0", border: "2px solid #111111", boxShadow: "5px 5px 0 #E9A23B" }}>
                <div style={{ position: "relative", overflow: "hidden", height: "96px", background: "#5E7F8C", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", color: "#EDE9DD" }}>[photo]<div className="glint" style={{ animationDuration: "13s", animationDelay: "-7s" }} /></div>
                <figcaption style={{ fontFamily: "'Caveat', cursive", fontSize: "16px", padding: "4px 0 6px", textAlign: "center" }}>[caption]</figcaption>
              </div>
              <button className="ph-open" onClick={v.g.open1} aria-label="Open photo 2 of 5" style={{ position: "absolute", left: "0", top: "0", width: "100%", height: "100%", padding: "0", background: "transparent", border: "0" }} />
            </figure>
            <figure className="twist" style={{ position: "absolute", left: "250px", top: "82px", width: "116px", margin: "0", "--r": "-2.5deg", transform: "rotate(-2.5deg)", transformOrigin: "50% 0", animationDuration: "12s", animationDelay: "-4.5s" }}>
              <div style={{ position: "absolute", left: "53px", top: "-10px", width: "9px", height: "18px", background: "#C9A57A", borderRadius: "2px" }} />
              <div style={{ background: "#FFFFFF", padding: "7px 7px 0", border: "2px solid #111111", boxShadow: "5px 5px 0 #E9A23B" }}>
                <div style={{ position: "relative", overflow: "hidden", height: "96px", background: "#A7765A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", color: "#F3EEE4" }}>[photo]<div className="glint" style={{ animationDuration: "12s", animationDelay: "-4.5s" }} /></div>
                <figcaption style={{ fontFamily: "'Caveat', cursive", fontSize: "16px", padding: "4px 0 6px", textAlign: "center" }}>[caption]</figcaption>
              </div>
              <button className="ph-open" onClick={v.g.open2} aria-label="Open photo 3 of 5" style={{ position: "absolute", left: "0", top: "0", width: "100%", height: "100%", padding: "0", background: "transparent", border: "0" }} />
            </figure>
            <figure className="twist" style={{ position: "absolute", left: "50px", top: "388px", width: "128px", margin: "0", "--r": "3deg", transform: "rotate(3deg)", transformOrigin: "50% 0", animationDuration: "14s", animationDelay: "-10s" }}>
              <div style={{ position: "absolute", left: "59px", top: "-10px", width: "9px", height: "18px", background: "#C9A57A", borderRadius: "2px" }} />
              <div style={{ background: "#FFFFFF", padding: "7px 7px 0", border: "2px solid #111111", boxShadow: "5px 5px 0 #E9A23B" }}>
                <div style={{ position: "relative", overflow: "hidden", height: "108px", background: "#8A8F6A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", color: "#F3EEE4" }}>[photo]<div className="glint" style={{ animationDuration: "14s", animationDelay: "-10s" }} /></div>
                <figcaption style={{ fontFamily: "'Caveat', cursive", fontSize: "16px", padding: "4px 0 6px", textAlign: "center" }}>[caption]</figcaption>
              </div>
              <button className="ph-open" onClick={v.g.open3} aria-label="Open photo 4 of 5" style={{ position: "absolute", left: "0", top: "0", width: "100%", height: "100%", padding: "0", background: "transparent", border: "0" }} />
            </figure>
            <figure className="twist" style={{ position: "absolute", left: "234px", top: "348px", width: "120px", margin: "0", "--r": "-4deg", transform: "rotate(-4deg)", transformOrigin: "50% 0", animationDuration: "10.5s", animationDelay: "-0.5s" }}>
              <div style={{ position: "absolute", left: "55px", top: "-10px", width: "9px", height: "18px", background: "#C9A57A", borderRadius: "2px" }} />
              <div style={{ background: "#FFFFFF", padding: "7px 7px 0", border: "2px solid #111111", boxShadow: "5px 5px 0 #E9A23B" }}>
                <div style={{ position: "relative", overflow: "hidden", height: "100px", background: "#4F6B78", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", color: "#EDE9DD" }}>[photo]<div className="glint" style={{ animationDuration: "10.5s", animationDelay: "-0.5s" }} /></div>
                <figcaption style={{ fontFamily: "'Caveat', cursive", fontSize: "16px", padding: "4px 0 6px", textAlign: "center" }}>[caption]</figcaption>
              </div>
              <button className="ph-open" onClick={v.g.open4} aria-label="Open photo 5 of 5" style={{ position: "absolute", left: "0", top: "0", width: "100%", height: "100%", padding: "0", background: "transparent", border: "0" }} />
            </figure>
            {/* opens the highlights overlay (no separate page) */}
            <button onClick={v.g.open0} style={{ position: "absolute", left: "22px", bottom: "16px", minHeight: "44px", padding: "0", background: "transparent", border: "0", color: "#F3EEE4", fontFamily: "'Figtree', system-ui, sans-serif", fontSize: "13px", letterSpacing: "1.4px", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ borderBottom: "1px solid #8E8A7A", paddingBottom: "3px" }}>See every photo</span>
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke="#F7C21A" strokeWidth="2">
                <path d="M1 6 H14" />
                <path d="M9 1 L14 6 L9 11" />
              </svg>
            </button>
          </section>
          {/* ============ WORDS WE SHOULD BRING BACK — mini game (components/home/WordsGame.jsx) ============ */}
          <WordsGame />
          {/* ============ MEMBERS ("Meet the team") (components/home/Members.jsx) ============ */}
          <Members />
          {/* ============ FOOTER ============ */}
          <footer style={{ position: "absolute", left: "0", top: "3720px", width: "390px", height: "190px", boxSizing: "border-box", padding: "26px 24px 0", borderTop: "1.5px solid #1E2723", display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <a href="#top" aria-label="Aquaterra — home" style={{ display: "flex", alignItems: "center", gap: "6px", minHeight: "44px", textDecoration: "none" }}>
                <img src="/logo.png" alt="" width="32" height="32" style={{ display: "block", width: "32px", height: "32px" }} />
                <span className="wordmark" style={{ fontFamily: "'Archivo Black', Impact, sans-serif", fontSize: "25px", lineHeight: "1", letterSpacing: "0.5px", textTransform: "uppercase" }}>Aquaterra</span>
              </a>
              <a href="#" style={{ fontSize: "13px", textDecoration: "none", padding: "12px 0" }}>@ngo.aquaterra</a>
            </div>
            <nav style={{ display: "flex", flexWrap: "wrap", gap: "4px 18px", fontSize: "14px" }}>
              <Link to="/articles" style={{ textDecoration: "none", padding: "10px 0" }}>Articles</Link>
              <a href="#photos" style={{ textDecoration: "none", padding: "10px 0" }}>Photos</a>
              <a href="#words" style={{ textDecoration: "none", padding: "10px 0" }}>Words</a>
              <a href="#members" style={{ textDecoration: "none", padding: "10px 0" }}>Members</a>
            </nav>
            <div style={{ fontSize: "12px", color: "#4A524D" }}>Terranotes · © {new Date().getFullYear()}</div>
          </footer>
        </div>
        <MenuSheet open={!!this.state.menuOpen} onClose={this.closeMenu} current="home" />
        {/* PHOTO HIGHLIGHTS OVERLAY ("See every photo"): components/home/PhotoViewer.jsx */}
        {this.state.gal != null && <PhotoViewer start={this.state.gal} onClose={() => this.setState({ gal: null })} />}
      </>
    );
  }
}
