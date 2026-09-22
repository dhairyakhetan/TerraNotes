import React from 'react';
import { Link } from 'react-router';
import MenuSheet from '../components/MenuSheet.jsx';

/*
  AQUATERRA / TERRANOTES — MOBILE HOME (390px wide)
  Everything is absolutely positioned inside one 390px-wide root (#top); coordinates are page px from the
  top-left. Styles and animations: styles/home.css.

  STATE (all local to this screen):
    menuOpen  – full-screen menu is slid in
    team      – index into `teams` for the Members legend filter, null = show all
    member    – index of the member whose profile pop-up is open, null = closed
    gal       – index of the photo shown in the highlights overlay, null = closed
    wq, wpick, wscore, wdone – WORDS mini game: round, option tapped, score, finished
    dx, dragging – live swipe offset (px) and whether a finger is down on the overlay
  PROPS:
    motion    – false switches off sway/float animations (adds .no-motion to the root)
  `members` (below) holds name/role/team for each face m1…m8; face shadow colours in the markup match `teams`.
*/
export default class Home extends React.Component {
  state = {};

  componentDidMount() {
    document.title = 'Aquaterra';
  }

  openMenu = () => this.setState({ menuOpen: true });
  closeMenu = () => this.setState({ menuOpen: false });

  renderVals() {
    const st = this.state || {};
    const motion = this.props.motion ?? true;
    const teams = [{"label": "Editorial", "c": "#F0442B"}, {"label": "Visual", "c": "#3DA5F4"}, {"label": "Research", "c": "#1E7A4C"}, {"label": "Operations", "c": "#7B5CE6"}];
    // members: same order as the faces in the markup (m1…m8). `top` = the face's y inside the section, used to place the pop-up.
    const members = [{"name": "Ananya", "role": "Editorial lead", "team": 0, "top": 342.0}, {"name": "Sohom", "role": "Photography", "team": 1, "top": 482.0}, {"name": "Rehan", "role": "Field research", "team": 2, "top": 532.0}, {"name": "Ishita", "role": "Visual strategy", "team": 3, "top": 588.0}, {"name": "Mitali", "role": "Design", "team": 1, "top": 654.0}, {"name": "Tanvi", "role": "Interviews", "team": 2, "top": 747.0}, {"name": "Kabir", "role": "Outreach", "team": 3, "top": 848.0}, {"name": "Nishtha", "role": "Copy & voice", "team": 0, "top": 837.0}];
    const team = st.team == null ? null : st.team;
    const sel = st.member != null ? members[st.member] : null;
    const WORDS = ['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve'];
    const countWord = WORDS[members.length] || String(members.length);
    const vals = {
      countWord: countWord,
      countUpper: countWord.toUpperCase(),
      rootClass: motion ? 'page-home' : 'page-home no-motion',
      menuExpanded: st.menuOpen ? 'true' : 'false',
      openMenu: this.openMenu,
      popOpen: !!sel,
      closePop: () => this.setState({ member: null }),
      pop: sel ? { name: sel.name, role: sel.role, team: teams[sel.team].label, c: teams[sel.team].c, num: String(st.member + 1).padStart(2, '0'), top: Math.max(120, Math.min(sel.top - 60, 720)) } : { name: '', role: '', team: '', c: '#111111', num: '', top: 120 }
    };
    members.forEach((m, i) => {
      vals['m' + (i + 1)] = { op: team == null || team === m.team ? 1 : 0.18, open: () => this.setState({ member: i }) };
    });
    teams.forEach((t, k) => {
      const on = team === k;
      vals['l' + (k + 1)] = { bg: on ? '#111111' : 'transparent', fg: on ? '#FFFFFF' : '#111111', bd: on ? '#111111' : 'transparent', pressed: on ? 'true' : 'false', pick: () => this.setState({ team: on ? null : k }) };
    });

    // ---- photo highlights overlay ----------------------------------------
    const N = 5, W = 390;
    const EASE = 'cubic-bezier(0.32, 0.72, 0, 1)';
    const gi = st.gal;                                   // null = closed
    const dx = st.dx || 0;
    const dragging = !!st.dragging;
    const go = (k) => this.setState({ gal: Math.max(0, Math.min(N - 1, k)), dx: 0, dragging: false });
    const cur = gi == null ? 0 : gi;
    const prog = Math.max(-1, Math.min(1, -dx / W));     // drag progress toward the neighbour (−1…1)
    const nb = prog > 0 ? cur + 1 : cur - 1;
    const g = {
      isOpen: gi != null,
      num: String(cur + 1).padStart(2, '0'),
      close: () => this.setState({ gal: null, dx: 0, dragging: false }),
      tx: -cur * W + dx,
      tr: dragging ? 'none' : `transform 620ms ${EASE}, opacity 620ms ${EASE}`,
      dtr: dragging ? 'none' : `width 620ms ${EASE}, background-color 300ms ease`,
      prev: () => go(cur - 1), next: () => go(cur + 1),
      prevOff: cur === 0, nextOff: cur === N - 1,
      prevOp: cur === 0 ? 0.3 : 1, nextOp: cur === N - 1 ? 0.3 : 1,
      ts: (e) => { const t = e.touches && e.touches[0]; if (!t) return; this._gx = t.clientX; this._gt = Date.now(); this.setState({ dragging: true, dx: 0 }); },
      tm: (e) => {
        const t = e.touches && e.touches[0]; if (!t || this._gx == null) return;
        let d = t.clientX - this._gx;
        if ((cur === 0 && d > 0) || (cur === N - 1 && d < 0)) d *= 0.3;   // rubber band, no wrap
        this.setState({ dx: d });
      },
      te: () => {
        if (this._gx == null) return;
        const d = this.state.dx || 0, v = d / Math.max(1, Date.now() - this._gt);   // px per ms
        this._gx = null;
        if (d < -70 || (v < -0.45 && d < -12)) go(cur + 1);
        else if (d > 70 || (v > 0.45 && d > 12)) go(cur - 1);
        else this.setState({ dx: 0, dragging: false });
      }
    };
    for (let k = 0; k < N; k++) {
      const on = k === cur;
      const w = on ? 22 - 15 * Math.abs(prog) : (k === nb ? 7 + 15 * Math.abs(prog) : 7);
      g['open' + k] = () => this.setState({ gal: k, dx: 0, dragging: false });
      g['go' + k] = () => go(k);
      g['s' + k] = { sc: on ? 1 : 0.9, op: on ? 1 : 0.45, hid: on ? 'false' : 'true' };
      g['d' + k] = { w: w, bg: (on && Math.abs(prog) < 0.5) || (k === nb && Math.abs(prog) >= 0.5) ? '#F7C21A' : '#6B665C' };
      g['t' + k] = { cur: on ? 'true' : 'false', bd: on ? '#F7C21A' : '#3A3A36', sh: on ? '4px 4px 0 #E9A23B' : 'none', y: on ? -6 : 0, op: on ? 1 : 0.55 };
    }
    vals.g = g;

    // ---- WORDS mini game ----------------------------------------------------
    // Each round: the word, three options, index of the right one, and the real definition shown after a pick.
    const WORDS_GAME = [
      { word: 'Apricity', opts: ['the warmth of the sun in winter', 'a sour aftertaste from citrus', 'a fear of open water'], a: 0,
        def: 'Apricity (n.): the warmth of the sun in winter. Recorded in a 1623 dictionary, then almost never used again.' },
      { word: 'Gloaming', opts: ['a soft glow on wet stone', 'twilight; the fall of dusk', 'a slow-moving river fog'], a: 1,
        def: 'Gloaming (n.): twilight, the fall of dusk. Still alive in Scottish speech and old songs.' },
      { word: 'Respair', opts: ['to repair something twice', 'a spare pair of shoes', 'fresh hope after despair'], a: 2,
        def: 'Respair (n.): fresh hope; recovering from despair. Last seen in writing around the 1500s.' }
    ];
    const wq = st.wq || 0, wpick = st.wpick == null ? null : st.wpick, wscore = st.wscore || 0, wdone = !!st.wdone;
    const round = WORDS_GAME[Math.min(wq, WORDS_GAME.length - 1)];
    const wlast = wq >= WORDS_GAME.length - 1;
    const w = {
      total: String(WORDS_GAME.length).padStart(2, '0'),
      n: String(wq + 1).padStart(2, '0'),
      score: String(wscore).padStart(2, '0'),
      word: round.word,
      playing: !wdone,
      done: wdone,
      locked: wpick != null,
      revealed: wpick != null,
      verdict: wpick == null ? '' : (wpick === round.a ? 'Yes!' : 'Not quite.'),
      def: round.def,
      nextLabel: wlast ? 'Score' : 'Next word',
      next: () => wlast ? this.setState({ wdone: true }) : this.setState({ wq: wq + 1, wpick: null }),
      restart: () => this.setState({ wq: 0, wpick: null, wscore: 0, wdone: false }),
      message: wscore === WORDS_GAME.length ? 'all of them. you should be writing for us.' : (wscore === 0 ? 'zero. that\'s why we need to bring them back.' : 'not bad. now use one in a sentence today.')
    };
    round.opts.forEach((text, k) => {
      const right = k === round.a, picked = k === wpick, shown = wpick != null;
      w['o' + k] = {
        text: text,
        mark: shown ? (right ? '✓' : (picked ? '✗' : String.fromCharCode(65 + k))) : String.fromCharCode(65 + k),
        bg: shown && right ? '#F7C21A' : (shown && picked ? '#111111' : '#FFFFFF'),
        fg: shown && picked && !right ? '#FFFFFF' : '#111111',
        op: shown && !right && !picked ? 0.45 : 1,
        pick: () => { if (wpick != null) return; this.setState({ wpick: k, wscore: wscore + (k === round.a ? 1 : 0) }); }
      };
    });
    vals.w = w;

    return vals;
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
                <radialgradient id="glow">
                  <stop offset="0" stopColor="#FFC861" stopOpacity=".75" />
                  <stop offset="1" stopColor="#FFC861" stopOpacity="0" />
                </radialgradient>
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
            {/* "glow" annotation */}
            <div style={{ position: "absolute", left: "180px", top: "408px", display: "flex", flexDirection: "column", alignItems: "center", color: "#E9A23B" }}>
              <svg width="16" height="28" viewBox="0 0 16 28" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                <path d="M8 27 C6 18 10 10 8 2" />
                <path d="M3 7 L8 2 L13 7" />
              </svg>
              <div style={{ fontFamily: "'Caveat', cursive", fontSize: "20px", lineHeight: "1" }}>glow</div>
            </div>
            {/* opens the highlights overlay (no separate page) */}
            <button onClick={v.g.open0} style={{ position: "absolute", left: "22px", bottom: "16px", minHeight: "44px", padding: "0", background: "transparent", border: "0", color: "#F3EEE4", fontFamily: "'Figtree', system-ui, sans-serif", fontSize: "13px", letterSpacing: "1.4px", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ borderBottom: "1px solid #8E8A7A", paddingBottom: "3px" }}>See every photo</span>
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke="#F7C21A" strokeWidth="2">
                <path d="M1 6 H14" />
                <path d="M9 1 L14 6 L9 11" />
              </svg>
            </button>
          </section>
          {/* ============ WORDS WE SHOULD BRING BACK — mini game ============
          Three old words, one at a time. Tap the meaning you think is right: the right answer turns yellow (✓),
          a wrong pick turns black (✗), the real definition appears, then "next word". After the last word: score + play again.
          Words, options and definitions live in `WORDS_GAME` in renderVals() — add more rounds there, nothing else changes
          (the "/ 03" counters read the list length). State: wq (round), wpick (option tapped or null), wscore, wdone. */}
          <section id="words" style={{ position: "absolute", left: "0", top: "1830px", width: "390px", height: "650px" }}>
            <h2 style={{ position: "absolute", left: "20px", top: "18px", width: "260px", margin: "0", fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: "italic", fontWeight: "400", fontSize: "36px", lineHeight: "0.98", color: "#111111" }}>Words we should bring back.</h2>
            <div style={{ position: "absolute", right: "20px", top: "26px", textAlign: "right", fontFamily: "'Space Mono', monospace", fontSize: "9px", letterSpacing: "1.6px", lineHeight: "1.6", color: "#111111" }}>MINI GAME<br />SCORE {v.w.score} / {v.w.total}</div>
            {/* the word, on a cloud */}
            <div style={{ position: "absolute", left: "10px", top: "110px", width: "370px", height: "200px" }}>
              <svg width="370" height="200" viewBox="0 0 200 110" preserveAspectRatio="none" style={{ position: "absolute", left: "0", top: "0", overflow: "visible" }} aria-hidden="true">
                <path d="M26 104 H176 A24 24 0 0 0 178 56 A36 36 0 0 0 110 30 A30 30 0 0 0 56 42 A30 30 0 0 0 26 104 Z" fill="#111111" transform="translate(2.5 3)" />
                <path d="M26 104 H176 A24 24 0 0 0 178 56 A36 36 0 0 0 110 30 A30 30 0 0 0 56 42 A30 30 0 0 0 26 104 Z" fill="#FFFFFF" stroke="#111111" strokeWidth="2" vectorEffect="non-scaling-stroke" />
              </svg>
              <div style={{ position: "absolute", left: "0", top: "78px", width: "370px", textAlign: "center" }}>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "9.5px", letterSpacing: "1.6px", color: "#4A4A45" }}>WORD {v.w.n} / {v.w.total}</div>
                <div style={{ marginTop: "4px", fontFamily: "'Archivo Black', Impact, sans-serif", fontSize: "42px", lineHeight: "1", textTransform: "uppercase", letterSpacing: "-0.5px", color: "#111111" }}>{v.w.word}</div>
                <div style={{ marginTop: "4px", fontFamily: "'Caveat', cursive", fontSize: "20px", color: "#5B3A1E" }}>what do you think it means?</div>
              </div>
            </div>
            {/* options / result */}
            {v.w.playing && (
              <>
                <div style={{ position: "absolute", left: "20px", top: "330px", width: "350px", display: "flex", flexDirection: "column", gap: "12px" }}>
                  <button className="w-opt" onClick={v.w.o0.pick} disabled={v.w.locked} style={{ minHeight: "52px", width: "100%", boxSizing: "border-box", padding: "10px 14px", display: "flex", alignItems: "center", gap: "12px", textAlign: "left", background: v.w.o0.bg, color: v.w.o0.fg, border: "2px solid #111111", boxShadow: "4px 4px 0 #111111", opacity: v.w.o0.op, fontFamily: "'Figtree', system-ui, sans-serif", fontSize: "15px", fontWeight: "500", lineHeight: "1.25", transition: "background-color 220ms ease, opacity 220ms ease" }}>
                    <span style={{ width: "26px", height: "26px", flexShrink: "0", border: "2px solid currentColor", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "12px" }}>{v.w.o0.mark}</span>
                    <span style={{ flexGrow: "1" }}>{v.w.o0.text}</span>
                  </button>
                  <button className="w-opt" onClick={v.w.o1.pick} disabled={v.w.locked} style={{ minHeight: "52px", width: "100%", boxSizing: "border-box", padding: "10px 14px", display: "flex", alignItems: "center", gap: "12px", textAlign: "left", background: v.w.o1.bg, color: v.w.o1.fg, border: "2px solid #111111", boxShadow: "4px 4px 0 #111111", opacity: v.w.o1.op, fontFamily: "'Figtree', system-ui, sans-serif", fontSize: "15px", fontWeight: "500", lineHeight: "1.25", transition: "background-color 220ms ease, opacity 220ms ease" }}>
                    <span style={{ width: "26px", height: "26px", flexShrink: "0", border: "2px solid currentColor", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "12px" }}>{v.w.o1.mark}</span>
                    <span style={{ flexGrow: "1" }}>{v.w.o1.text}</span>
                  </button>
                  <button className="w-opt" onClick={v.w.o2.pick} disabled={v.w.locked} style={{ minHeight: "52px", width: "100%", boxSizing: "border-box", padding: "10px 14px", display: "flex", alignItems: "center", gap: "12px", textAlign: "left", background: v.w.o2.bg, color: v.w.o2.fg, border: "2px solid #111111", boxShadow: "4px 4px 0 #111111", opacity: v.w.o2.op, fontFamily: "'Figtree', system-ui, sans-serif", fontSize: "15px", fontWeight: "500", lineHeight: "1.25", transition: "background-color 220ms ease, opacity 220ms ease" }}>
                    <span style={{ width: "26px", height: "26px", flexShrink: "0", border: "2px solid currentColor", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "12px" }}>{v.w.o2.mark}</span>
                    <span style={{ flexGrow: "1" }}>{v.w.o2.text}</span>
                  </button>
                </div>
                {v.w.revealed && (
                  <>
                    <div className="w-reveal" style={{ position: "absolute", left: "20px", top: "534px", width: "350px", display: "flex", alignItems: "flex-start", gap: "12px" }}>
                      <p style={{ margin: "0", flexGrow: "1", fontSize: "13.5px", lineHeight: "1.45", color: "#1E2723" }}><strong style={{ fontWeight: "600" }}>{v.w.verdict}</strong>{" "}{v.w.def}</p>
                      <button onClick={v.w.next} style={{ minHeight: "44px", flexShrink: "0", padding: "0 14px", background: "#111111", color: "#FFFFFF", border: "2px solid #111111", boxShadow: "3px 3px 0 #F7C21A", fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase" }}>{v.w.nextLabel} →</button>
                    </div>
                  </>
                )}
              </>
            )}
            {v.w.done && (
              <>
                <div className="w-reveal" style={{ position: "absolute", left: "20px", top: "330px", width: "350px", boxSizing: "border-box", background: "#F7C21A", border: "2px solid #111111", boxShadow: "7px 7px 0 #111111", padding: "18px", transform: "rotate(-1.5deg)" }}>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "1.6px" }}>YOUR SCORE</div>
                  <div style={{ fontFamily: "'Archivo Black', Impact, sans-serif", fontSize: "64px", lineHeight: "1", color: "#111111" }}>{v.w.score} / {v.w.total}</div>
                  <div style={{ marginTop: "6px", fontFamily: "'Caveat', cursive", fontSize: "23px", lineHeight: "1.1", color: "#111111" }}>{v.w.message}</div>
                  <button onClick={v.w.restart} style={{ marginTop: "14px", minHeight: "44px", padding: "0 16px", background: "#111111", color: "#FFFFFF", border: "2px solid #111111", fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase" }}>Play again ↺</button>
                </div>
              </>
            )}
          </section>
          {/* ============ MEMBERS ("Meet the team") ============
          Title + intro copy + handwritten aside, a VERTICAL legend on the left (tap a team to filter, tap again to clear),
          eight faces linked by a dotted trail, then the "four chairs" note.
          • Each face: wrapper .flN (float animation) → round photo button (hard shadow = TEAM colour) + name/role label
            (the label has a paper background so the dotted trail passes behind it).
          • Faces are placed by CENTRE (see each comment); the dotted-trail segments go centre-to-centre, so if you move a face,
            update its two trail segments in the <svg> below too.
          • Member data (name, role, team) is ALSO in renderVals() (`members`) for the pop-up — keep both in sync,
            and update the counts in the legend chips. */}
          <section id="members" style={{ position: "absolute", left: "0", top: "2470px", width: "390px", height: "1240px" }}>
            <div style={{ position: "absolute", left: "20px", top: "0", width: "350px", height: "2px", background: "#111111" }} />
            <h2 style={{ position: "absolute", left: "18px", top: "22px", margin: "0", fontFamily: "'Archivo Black', Impact, sans-serif", fontWeight: "400", fontSize: "46px", lineHeight: "0.92", letterSpacing: "-1px", textTransform: "uppercase", color: "#111111" }}>Meet<br />the team</h2>
            <div style={{ position: "absolute", right: "20px", top: "30px", textAlign: "right", fontFamily: "'Space Mono', monospace", fontSize: "9px", letterSpacing: "1.6px", lineHeight: "1.6", color: "#111111" }}>{v.countUpper} OF US<br />TAP A FACE</div>
            <p style={{ position: "absolute", left: "20px", top: "136px", width: "340px", margin: "0", fontSize: "15px", lineHeight: "1.5", color: "#1E2723" }}>four desks, one terrace, {v.countWord} people who are all doing something else on a weekday. editorial writes it, visual shoots and lays it out, research keeps the numbers honest, operations makes sure a building says yes.</p>
            <div style={{ position: "absolute", left: "22px", top: "270px", width: "250px", fontFamily: "'Caveat', cursive", fontSize: "21px", lineHeight: "1.1", color: "#5B3A1E", transform: "rotate(-2deg)" }}>nobody here is a professional. that is the point.</div>
            {/* the dotted trail connecting the faces (order = CHAIN in the build notes: Ananya → Sohom → Rehan → Ishita → Tanvi → Mitali → Kabir → Nishtha).
             Each segment runs centre-to-centre with a small sag; the ends are hidden under the photos, so floating never detaches it. */}
            <svg width="390" height="1240" viewBox="0 0 390 1240" style={{ position: "absolute", left: "0", top: "0" }} aria-hidden="true" fill="none" stroke="#1E2723" strokeWidth="1.2" strokeDasharray="3 5" strokeLinecap="round" opacity=".5">
              <path d="M262 392 Q299 484 336 524 M336 524 Q270.5 577 205 578 M205 578 Q140.5 631 76 632 M76 632 Q131 738 186 792 M186 792 Q252 773 318 702 M318 702 Q309 823 300 892 M300 892 Q185 914 70 884" />
            </svg>
            {/* legend (vertical) */}
            <div style={{ position: "absolute", left: "16px", top: "340px", width: "142px", display: "flex", flexDirection: "column", gap: "4px" }}>
              <button className="legend-chip" onClick={v.l1.pick} aria-pressed={v.l1.pressed} style={{ minHeight: "32px", width: "100%", padding: "0 10px 0 6px", display: "flex", alignItems: "center", gap: "8px", background: v.l1.bg, color: v.l1.fg, border: `1.5px solid ${v.l1.bd}`, borderRadius: "999px", fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "9.5px", letterSpacing: "1.2px", textTransform: "uppercase", textAlign: "left" }}>
                <span style={{ width: "12px", height: "12px", flexShrink: "0", borderRadius: "50%", background: "#F0442B", border: "1.5px solid #111111", boxSizing: "border-box" }} />
                <span style={{ flexGrow: "1" }}>Editorial</span>
                <span>2</span>
              </button>
              <button className="legend-chip" onClick={v.l2.pick} aria-pressed={v.l2.pressed} style={{ minHeight: "32px", width: "100%", padding: "0 10px 0 6px", display: "flex", alignItems: "center", gap: "8px", background: v.l2.bg, color: v.l2.fg, border: `1.5px solid ${v.l2.bd}`, borderRadius: "999px", fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "9.5px", letterSpacing: "1.2px", textTransform: "uppercase", textAlign: "left" }}>
                <span style={{ width: "12px", height: "12px", flexShrink: "0", borderRadius: "50%", background: "#3DA5F4", border: "1.5px solid #111111", boxSizing: "border-box" }} />
                <span style={{ flexGrow: "1" }}>Visual</span>
                <span>2</span>
              </button>
              <button className="legend-chip" onClick={v.l3.pick} aria-pressed={v.l3.pressed} style={{ minHeight: "32px", width: "100%", padding: "0 10px 0 6px", display: "flex", alignItems: "center", gap: "8px", background: v.l3.bg, color: v.l3.fg, border: `1.5px solid ${v.l3.bd}`, borderRadius: "999px", fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "9.5px", letterSpacing: "1.2px", textTransform: "uppercase", textAlign: "left" }}>
                <span style={{ width: "12px", height: "12px", flexShrink: "0", borderRadius: "50%", background: "#1E7A4C", border: "1.5px solid #111111", boxSizing: "border-box" }} />
                <span style={{ flexGrow: "1" }}>Research</span>
                <span>2</span>
              </button>
              <button className="legend-chip" onClick={v.l4.pick} aria-pressed={v.l4.pressed} style={{ minHeight: "32px", width: "100%", padding: "0 10px 0 6px", display: "flex", alignItems: "center", gap: "8px", background: v.l4.bg, color: v.l4.fg, border: `1.5px solid ${v.l4.bd}`, borderRadius: "999px", fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "9.5px", letterSpacing: "1.2px", textTransform: "uppercase", textAlign: "left" }}>
                <span style={{ width: "12px", height: "12px", flexShrink: "0", borderRadius: "50%", background: "#7B5CE6", border: "1.5px solid #111111", boxSizing: "border-box" }} />
                <span style={{ flexGrow: "1" }}>Operations</span>
                <span>2</span>
              </button>
            </div>
            {/* 01 Ananya · Editorial lead · Editorial · centre (262,392) */}
            <div className="fl1" style={{ position: "absolute", left: "202px", top: "342px", width: "120px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", opacity: v.m1.op, transition: "opacity .25s" }}>
              <button className="bub" onClick={v.m1.open} aria-label="Ananya, Editorial lead — open profile" style={{ width: "100px", height: "100px", padding: "0", borderRadius: "50%", border: "2px solid #111111", background: "#F2F1ED", boxShadow: "6px 5px 0 #F0442B", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "3px", fontSize: "11px", color: "#444" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.6" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="16" rx="1" />
                  <circle cx="9" cy="10" r="2" />
                  <path d="M3 17 L9 13 L13 16 L16 13 L21 17" />
                </svg>
                <span>ananya</span>
              </button>
              <div style={{ textAlign: "center", lineHeight: "1.1", padding: "2px 6px", background: "#F3EEE4" }}>
                <div style={{ fontFamily: "'Archivo Black', Impact, sans-serif", fontSize: "14px", textTransform: "uppercase", color: "#111111" }}>Ananya</div>
                <div style={{ marginTop: "3px", fontFamily: "'Space Mono', monospace", fontSize: "8.5px", letterSpacing: "1px", textTransform: "uppercase", color: "#4A4A45" }}>Editorial lead</div>
              </div>
            </div>
            {/* 02 Sohom · Photography · Visual · centre (336,524) */}
            <div className="fl2" style={{ position: "absolute", left: "276px", top: "482px", width: "120px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", opacity: v.m2.op, transition: "opacity .25s" }}>
              <button className="bub" onClick={v.m2.open} aria-label="Sohom, Photography — open profile" style={{ width: "84px", height: "84px", padding: "0", borderRadius: "50%", border: "2px solid #111111", background: "#F2F1ED", boxShadow: "6px 5px 0 #3DA5F4", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "3px", fontSize: "11px", color: "#444" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.6" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="16" rx="1" />
                  <circle cx="9" cy="10" r="2" />
                  <path d="M3 17 L9 13 L13 16 L16 13 L21 17" />
                </svg>
                <span>sohom</span>
              </button>
              <div style={{ textAlign: "center", lineHeight: "1.1", padding: "2px 6px", background: "#F3EEE4" }}>
                <div style={{ fontFamily: "'Archivo Black', Impact, sans-serif", fontSize: "14px", textTransform: "uppercase", color: "#111111" }}>Sohom</div>
                <div style={{ marginTop: "3px", fontFamily: "'Space Mono', monospace", fontSize: "8.5px", letterSpacing: "1px", textTransform: "uppercase", color: "#4A4A45" }}>Photography</div>
              </div>
            </div>
            {/* 03 Rehan · Field research · Research · centre (205,578) */}
            <div className="fl3" style={{ position: "absolute", left: "145px", top: "532px", width: "120px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", opacity: v.m3.op, transition: "opacity .25s" }}>
              <button className="bub" onClick={v.m3.open} aria-label="Rehan, Field research — open profile" style={{ width: "92px", height: "92px", padding: "0", borderRadius: "50%", border: "2px solid #111111", background: "#F2F1ED", boxShadow: "6px 5px 0 #1E7A4C", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "3px", fontSize: "11px", color: "#444" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.6" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="16" rx="1" />
                  <circle cx="9" cy="10" r="2" />
                  <path d="M3 17 L9 13 L13 16 L16 13 L21 17" />
                </svg>
                <span>rehan</span>
              </button>
              <div style={{ textAlign: "center", lineHeight: "1.1", padding: "2px 6px", background: "#F3EEE4" }}>
                <div style={{ fontFamily: "'Archivo Black', Impact, sans-serif", fontSize: "14px", textTransform: "uppercase", color: "#111111" }}>Rehan</div>
                <div style={{ marginTop: "3px", fontFamily: "'Space Mono', monospace", fontSize: "8.5px", letterSpacing: "1px", textTransform: "uppercase", color: "#4A4A45" }}>Field research</div>
              </div>
            </div>
            {/* 04 Ishita · Visual strategy · Operations · centre (76,632) */}
            <div className="fl4" style={{ position: "absolute", left: "16px", top: "588px", width: "120px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", opacity: v.m4.op, transition: "opacity .25s" }}>
              <button className="bub" onClick={v.m4.open} aria-label="Ishita, Visual strategy — open profile" style={{ width: "88px", height: "88px", padding: "0", borderRadius: "50%", border: "2px solid #111111", background: "#F2F1ED", boxShadow: "6px 5px 0 #7B5CE6", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "3px", fontSize: "11px", color: "#444" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.6" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="16" rx="1" />
                  <circle cx="9" cy="10" r="2" />
                  <path d="M3 17 L9 13 L13 16 L16 13 L21 17" />
                </svg>
                <span>ishita</span>
              </button>
              <div style={{ textAlign: "center", lineHeight: "1.1", padding: "2px 6px", background: "#F3EEE4" }}>
                <div style={{ fontFamily: "'Archivo Black', Impact, sans-serif", fontSize: "14px", textTransform: "uppercase", color: "#111111" }}>Ishita</div>
                <div style={{ marginTop: "3px", fontFamily: "'Space Mono', monospace", fontSize: "8.5px", letterSpacing: "1px", textTransform: "uppercase", color: "#4A4A45" }}>Visual strategy</div>
              </div>
            </div>
            {/* 05 Mitali · Design · Visual · centre (318,702) */}
            <div className="fl5" style={{ position: "absolute", left: "258px", top: "654px", width: "120px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", opacity: v.m5.op, transition: "opacity .25s" }}>
              <button className="bub" onClick={v.m5.open} aria-label="Mitali, Design — open profile" style={{ width: "96px", height: "96px", padding: "0", borderRadius: "50%", border: "2px solid #111111", background: "#F2F1ED", boxShadow: "6px 5px 0 #3DA5F4", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "3px", fontSize: "11px", color: "#444" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.6" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="16" rx="1" />
                  <circle cx="9" cy="10" r="2" />
                  <path d="M3 17 L9 13 L13 16 L16 13 L21 17" />
                </svg>
                <span>mitali</span>
              </button>
              <div style={{ textAlign: "center", lineHeight: "1.1", padding: "2px 6px", background: "#F3EEE4" }}>
                <div style={{ fontFamily: "'Archivo Black', Impact, sans-serif", fontSize: "14px", textTransform: "uppercase", color: "#111111" }}>Mitali</div>
                <div style={{ marginTop: "3px", fontFamily: "'Space Mono', monospace", fontSize: "8.5px", letterSpacing: "1px", textTransform: "uppercase", color: "#4A4A45" }}>Design</div>
              </div>
            </div>
            {/* 06 Tanvi · Interviews · Research · centre (186,792) */}
            <div className="fl6" style={{ position: "absolute", left: "126px", top: "747px", width: "120px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", opacity: v.m6.op, transition: "opacity .25s" }}>
              <button className="bub" onClick={v.m6.open} aria-label="Tanvi, Interviews — open profile" style={{ width: "90px", height: "90px", padding: "0", borderRadius: "50%", border: "2px solid #111111", background: "#F2F1ED", boxShadow: "6px 5px 0 #1E7A4C", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "3px", fontSize: "11px", color: "#444" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.6" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="16" rx="1" />
                  <circle cx="9" cy="10" r="2" />
                  <path d="M3 17 L9 13 L13 16 L16 13 L21 17" />
                </svg>
                <span>tanvi</span>
              </button>
              <div style={{ textAlign: "center", lineHeight: "1.1", padding: "2px 6px", background: "#F3EEE4" }}>
                <div style={{ fontFamily: "'Archivo Black', Impact, sans-serif", fontSize: "14px", textTransform: "uppercase", color: "#111111" }}>Tanvi</div>
                <div style={{ marginTop: "3px", fontFamily: "'Space Mono', monospace", fontSize: "8.5px", letterSpacing: "1px", textTransform: "uppercase", color: "#4A4A45" }}>Interviews</div>
              </div>
            </div>
            {/* 07 Kabir · Outreach · Operations · centre (300,892) */}
            <div className="fl1" style={{ position: "absolute", left: "240px", top: "848px", width: "120px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", opacity: v.m7.op, transition: "opacity .25s" }}>
              <button className="bub" onClick={v.m7.open} aria-label="Kabir, Outreach — open profile" style={{ width: "88px", height: "88px", padding: "0", borderRadius: "50%", border: "2px solid #111111", background: "#F2F1ED", boxShadow: "6px 5px 0 #7B5CE6", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "3px", fontSize: "11px", color: "#444" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.6" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="16" rx="1" />
                  <circle cx="9" cy="10" r="2" />
                  <path d="M3 17 L9 13 L13 16 L16 13 L21 17" />
                </svg>
                <span>kabir</span>
              </button>
              <div style={{ textAlign: "center", lineHeight: "1.1", padding: "2px 6px", background: "#F3EEE4" }}>
                <div style={{ fontFamily: "'Archivo Black', Impact, sans-serif", fontSize: "14px", textTransform: "uppercase", color: "#111111" }}>Kabir</div>
                <div style={{ marginTop: "3px", fontFamily: "'Space Mono', monospace", fontSize: "8.5px", letterSpacing: "1px", textTransform: "uppercase", color: "#4A4A45" }}>Outreach</div>
              </div>
            </div>
            {/* 08 Nishtha · Copy & voice · Editorial · centre (70,884) */}
            <div className="fl2" style={{ position: "absolute", left: "10px", top: "837px", width: "120px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", opacity: v.m8.op, transition: "opacity .25s" }}>
              <button className="bub" onClick={v.m8.open} aria-label={"Nishtha, Copy & voice — open profile"} style={{ width: "94px", height: "94px", padding: "0", borderRadius: "50%", border: "2px solid #111111", background: "#F2F1ED", boxShadow: "6px 5px 0 #F0442B", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "3px", fontSize: "11px", color: "#444" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.6" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="16" rx="1" />
                  <circle cx="9" cy="10" r="2" />
                  <path d="M3 17 L9 13 L13 16 L16 13 L21 17" />
                </svg>
                <span>nishtha</span>
              </button>
              <div style={{ textAlign: "center", lineHeight: "1.1", padding: "2px 6px", background: "#F3EEE4" }}>
                <div style={{ fontFamily: "'Archivo Black', Impact, sans-serif", fontSize: "14px", textTransform: "uppercase", color: "#111111" }}>Nishtha</div>
                <div style={{ marginTop: "3px", fontFamily: "'Space Mono', monospace", fontSize: "8.5px", letterSpacing: "1px", textTransform: "uppercase", color: "#4A4A45" }}>{"Copy & voice"}</div>
              </div>
            </div>
            {/* fun note: "four chairs" — four taken, a dashed fifth for the reader. Swap copy freely. */}
            <div style={{ position: "absolute", left: "22px", top: "1000px", width: "330px", boxSizing: "border-box", background: "#F7C21A", border: "2px solid #111111", boxShadow: "8px 8px 0 #111111", padding: "18px 18px 16px", transform: "rotate(-2deg)" }}>
              <div style={{ position: "absolute", right: "-12px", top: "-16px", background: "#111111", color: "#F7C21A", fontFamily: "'Caveat', cursive", fontSize: "20px", padding: "2px 12px", transform: "rotate(6deg)" }}>psst.</div>
              <div style={{ fontFamily: "'Archivo Black', Impact, sans-serif", fontSize: "25px", lineHeight: "0.95", textTransform: "uppercase", color: "#111111" }}>We meet on<br />the terrace.</div>
              <div style={{ marginTop: "8px", fontFamily: "'Caveat', cursive", fontSize: "23px", lineHeight: "1.1", color: "#111111" }}>bring a chair — there are only four.</div>
              <div style={{ marginTop: "12px", display: "flex", alignItems: "flex-end", gap: "8px" }}>
                <svg width="34" height="40" viewBox="0 0 34 40" aria-hidden="true">
                  <g fill="none" stroke="#111111" strokeWidth="2.4" strokeLinecap="square">
                    <path d="M7 2 V22" />
                    <rect x="7" y="18" width="21" height="5" fill="#111111" />
                    <path d="M9 23 L6 38" />
                    <path d="M26 23 L29 38" />
                    <path d="M7 8 H13" />
                  </g>
                </svg>
                <svg width="34" height="40" viewBox="0 0 34 40" aria-hidden="true">
                  <g fill="none" stroke="#111111" strokeWidth="2.4" strokeLinecap="square">
                    <path d="M7 2 V22" />
                    <rect x="7" y="18" width="21" height="5" fill="#111111" />
                    <path d="M9 23 L6 38" />
                    <path d="M26 23 L29 38" />
                    <path d="M7 8 H13" />
                  </g>
                </svg>
                <svg width="34" height="40" viewBox="0 0 34 40" aria-hidden="true">
                  <g fill="none" stroke="#111111" strokeWidth="2.4" strokeLinecap="square">
                    <path d="M7 2 V22" />
                    <rect x="7" y="18" width="21" height="5" fill="#111111" />
                    <path d="M9 23 L6 38" />
                    <path d="M26 23 L29 38" />
                    <path d="M7 8 H13" />
                  </g>
                </svg>
                <svg width="34" height="40" viewBox="0 0 34 40" aria-hidden="true">
                  <g fill="none" stroke="#111111" strokeWidth="2.4" strokeLinecap="square">
                    <path d="M7 2 V22" />
                    <rect x="7" y="18" width="21" height="5" fill="#111111" />
                    <path d="M9 23 L6 38" />
                    <path d="M26 23 L29 38" />
                    <path d="M7 8 H13" />
                  </g>
                </svg>
                <div style={{ marginLeft: "6px", display: "flex", alignItems: "flex-end", gap: "4px" }}>
                  <svg width="34" height="40" viewBox="0 0 34 40" aria-hidden="true">
                    <g fill="none" stroke="#111111" strokeWidth="2.4" strokeLinecap="square" strokeDasharray="3 3">
                      <path d="M7 2 V22" />
                      <rect x="7" y="18" width="21" height="5" fill="none" />
                      <path d="M9 23 L6 38" />
                      <path d="M26 23 L29 38" />
                      <path d="M7 8 H13" />
                    </g>
                  </svg>
                  <span style={{ fontFamily: "'Caveat', cursive", fontSize: "19px", lineHeight: "1", transform: "rotate(-8deg)", paddingBottom: "20px" }}>yours?</span>
                </div>
              </div>
            </div>
            {/* profile pop-up (state: member); vertical position follows the tapped face (pop.top) */}
            {v.popOpen && (
              <>
                <button onClick={v.closePop} aria-label="Close profile" style={{ position: "absolute", left: "0", top: "0", width: "390px", height: "1240px", border: "0", padding: "0", background: "rgba(17,17,17,.55)" }} />
                <div role="dialog" aria-label="Member profile" style={{ position: "absolute", left: "28px", top: `${v.pop.top}px`, width: "334px", boxSizing: "border-box", background: "#FFFFFF", border: "2px solid #111111", boxShadow: `8px 8px 0 ${v.pop.c}`, padding: "18px", display: "flex", flexDirection: "column", gap: "12px", transform: "rotate(-1deg)" }}>
                  <div style={{ position: "absolute", left: "50%", top: "-7px", marginLeft: "-17px", width: "34px", height: "10px", background: v.pop.c, border: "1.5px solid #111111", boxSizing: "border-box" }} />
                  <button onClick={v.closePop} aria-label="Close profile" style={{ position: "absolute", right: "10px", top: "10px", width: "44px", height: "44px", background: "#FFFFFF", border: "2px solid #111111", boxShadow: "3px 3px 0 #111111", padding: "0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="#111111" strokeWidth="2.6" strokeLinecap="square">
                      <path d="M3 3 L17 17" />
                      <path d="M17 3 L3 17" />
                    </svg>
                  </button>
                  <div style={{ width: "96px", height: "96px", borderRadius: "50%", border: "2px solid #111111", background: "#F2F1ED", boxShadow: `6px 5px 0 ${v.pop.c}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.6" aria-hidden="true">
                      <rect x="3" y="4" width="18" height="16" rx="1" />
                      <circle cx="9" cy="10" r="2" />
                      <path d="M3 17 L9 13 L13 16 L16 13 L21 17" />
                    </svg>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ background: v.pop.c, color: "#FFFFFF", fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase", padding: "3px 9px", borderRadius: "999px", border: "1.5px solid #111111" }}>{v.pop.team}</span>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "1px" }}>{v.pop.num} / 08</span>
                  </div>
                  <div style={{ fontFamily: "'Archivo Black', Impact, sans-serif", fontSize: "30px", lineHeight: "0.95", textTransform: "uppercase", color: "#111111" }}>{v.pop.name}</div>
                  <div style={{ fontFamily: "'Caveat', cursive", fontSize: "20px", lineHeight: "1.1", color: "#5B3A1E" }}>{v.pop.role}</div>
                  <p style={{ margin: "0", fontSize: "14px", lineHeight: "1.5", color: "#333333" }}>[Two lines about them: where they work from, what they write or shoot, what they care about.]</p>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <a href="#" style={{ minHeight: "44px", flexGrow: "1", display: "flex", alignItems: "center", justifyContent: "center", background: "#111111", color: "#FFFFFF", border: "2px solid #111111", fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "11px", letterSpacing: "1px", textDecoration: "none" }}>THEIR ARTICLES</a>
                    <a href="#" style={{ minHeight: "44px", padding: "0 14px", display: "flex", alignItems: "center", background: "#FFFFFF", color: "#111111", border: "2px solid #111111", boxShadow: "3px 3px 0 #111111", fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "11px", letterSpacing: "1px", textDecoration: "none" }}>[@HANDLE] ↗</a>
                  </div>
                </div>
              </>
            )}
          </section>
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
        {/* ============ PHOTO HIGHLIGHTS OVERLAY ("See every photo") ============
          Full-screen, no separate page. Opens from "See every photo" (first photo) or by tapping any polaroid (that photo).
          • Track = one row of 5 slides, each 390px wide; it moves with transform: translateX(−index × 390 + drag).
            Easing cubic-bezier(0.32, 0.72, 0, 1) over 620ms (iOS-style ease-out). While a finger is down the track follows
            it 1:1 (no transition); release decides: past 70px or a quick flick → next/prev, otherwise springs back.
          • No wrapping: first/last arrows are disabled and dragging past the ends rubber-bands (×0.3 resistance).
          • Dots: the active dot is a 22px pill; while dragging, it shrinks and the neighbour grows in proportion.
          • Thumbnails (optional row): tap to jump; the current one lifts and gets the amber outline.
          • State lives in renderVals(): gal (index or null), dx (drag px), dragging (bool). */}
        {v.g.isOpen && (
          <>
            <div role="dialog" aria-label="Photo highlights" style={{ position: "fixed", left: "0", right: "0", top: "0", margin: "0 auto", width: "390px", height: "100vh", minHeight: "844px", zIndex: "90", background: "#111111", color: "#F3EEE4", overflow: "hidden" }}>
              <div style={{ position: "absolute", left: "20px", top: "24px", fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "32px", lineHeight: "1" }}>Photo wall</div>
              <div style={{ position: "absolute", left: "22px", top: "64px", fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "1.6px", color: "#BDB6A6" }}>HIGHLIGHTS ·{" "}<span style={{ color: "#F7C21A" }}>{v.g.num}</span>{" "}/ 05</div>
              <button onClick={v.g.close} aria-label="Close photos" style={{ position: "absolute", right: "20px", top: "18px", width: "48px", height: "48px", padding: "0", background: "#FFFFFF", border: "2px solid #F3EEE4", boxShadow: "4px 4px 0 #E9A23B", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="#111111" strokeWidth="2.6" strokeLinecap="square">
                  <path d="M3 3 L17 17" />
                  <path d="M17 3 L3 17" />
                </svg>
              </button>
              {/* viewport + sliding track */}
              <div onTouchStart={v.g.ts} onTouchMove={v.g.tm} onTouchEnd={v.g.te} onTouchCancel={v.g.te} style={{ position: "absolute", left: "0", top: "104px", width: "390px", height: "480px", overflow: "hidden", touchAction: "pan-y" }}>
                <div className="gal-track" style={{ display: "flex", width: "1950px", height: "100%", transform: `translate3d(${v.g.tx}px, 0, 0)`, transition: v.g.tr, willChange: "transform" }}>
                  <div className="gal-slide" style={{ width: "390px", flexShrink: "0", boxSizing: "border-box", padding: "18px 30px 0", transform: `scale(${v.g.s0.sc})`, opacity: v.g.s0.op, transition: v.g.tr }} aria-hidden={v.g.s0.hid}>
                    <figure style={{ position: "relative", margin: "0", transform: "rotate(-1.5deg)" }}>
                      <div style={{ position: "absolute", left: "50%", top: "-12px", marginLeft: "-8px", width: "16px", height: "26px", background: "#C9A57A", border: "1.5px solid #111111", boxSizing: "border-box", zIndex: "2" }} />
                      <div style={{ background: "#FFFFFF", border: "2px solid #111111", boxShadow: "7px 7px 0 #E9A23B", padding: "10px 10px 0" }}>
                        <div style={{ height: "330px", background: "#6F8468", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "#F3EEE4" }}>[photo 1]</div>
                        <figcaption style={{ padding: "10px 2px 12px" }}>
                          <div style={{ fontFamily: "'Caveat', cursive", fontSize: "22px", lineHeight: "1.1", color: "#111111" }}>[caption — what's happening here]</div>
                          <div style={{ marginTop: "4px", fontFamily: "'Space Mono', monospace", fontSize: "9.5px", letterSpacing: "1.2px", textTransform: "uppercase", color: "#6B665C" }}>Highlight 01 · [place]</div>
                        </figcaption>
                      </div>
                    </figure>
                  </div>
                  <div className="gal-slide" style={{ width: "390px", flexShrink: "0", boxSizing: "border-box", padding: "18px 30px 0", transform: `scale(${v.g.s1.sc})`, opacity: v.g.s1.op, transition: v.g.tr }} aria-hidden={v.g.s1.hid}>
                    <figure style={{ position: "relative", margin: "0", transform: "rotate(1.2deg)" }}>
                      <div style={{ position: "absolute", left: "50%", top: "-12px", marginLeft: "-8px", width: "16px", height: "26px", background: "#C9A57A", border: "1.5px solid #111111", boxSizing: "border-box", zIndex: "2" }} />
                      <div style={{ background: "#FFFFFF", border: "2px solid #111111", boxShadow: "7px 7px 0 #E9A23B", padding: "10px 10px 0" }}>
                        <div style={{ height: "330px", background: "#5E7F8C", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "#F3EEE4" }}>[photo 2]</div>
                        <figcaption style={{ padding: "10px 2px 12px" }}>
                          <div style={{ fontFamily: "'Caveat', cursive", fontSize: "22px", lineHeight: "1.1", color: "#111111" }}>[caption — what's happening here]</div>
                          <div style={{ marginTop: "4px", fontFamily: "'Space Mono', monospace", fontSize: "9.5px", letterSpacing: "1.2px", textTransform: "uppercase", color: "#6B665C" }}>Highlight 02 · [place]</div>
                        </figcaption>
                      </div>
                    </figure>
                  </div>
                  <div className="gal-slide" style={{ width: "390px", flexShrink: "0", boxSizing: "border-box", padding: "18px 30px 0", transform: `scale(${v.g.s2.sc})`, opacity: v.g.s2.op, transition: v.g.tr }} aria-hidden={v.g.s2.hid}>
                    <figure style={{ position: "relative", margin: "0", transform: "rotate(-0.8deg)" }}>
                      <div style={{ position: "absolute", left: "50%", top: "-12px", marginLeft: "-8px", width: "16px", height: "26px", background: "#C9A57A", border: "1.5px solid #111111", boxSizing: "border-box", zIndex: "2" }} />
                      <div style={{ background: "#FFFFFF", border: "2px solid #111111", boxShadow: "7px 7px 0 #E9A23B", padding: "10px 10px 0" }}>
                        <div style={{ height: "330px", background: "#A7765A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "#F3EEE4" }}>[photo 3]</div>
                        <figcaption style={{ padding: "10px 2px 12px" }}>
                          <div style={{ fontFamily: "'Caveat', cursive", fontSize: "22px", lineHeight: "1.1", color: "#111111" }}>[caption — what's happening here]</div>
                          <div style={{ marginTop: "4px", fontFamily: "'Space Mono', monospace", fontSize: "9.5px", letterSpacing: "1.2px", textTransform: "uppercase", color: "#6B665C" }}>Highlight 03 · [place]</div>
                        </figcaption>
                      </div>
                    </figure>
                  </div>
                  <div className="gal-slide" style={{ width: "390px", flexShrink: "0", boxSizing: "border-box", padding: "18px 30px 0", transform: `scale(${v.g.s3.sc})`, opacity: v.g.s3.op, transition: v.g.tr }} aria-hidden={v.g.s3.hid}>
                    <figure style={{ position: "relative", margin: "0", transform: "rotate(1.6deg)" }}>
                      <div style={{ position: "absolute", left: "50%", top: "-12px", marginLeft: "-8px", width: "16px", height: "26px", background: "#C9A57A", border: "1.5px solid #111111", boxSizing: "border-box", zIndex: "2" }} />
                      <div style={{ background: "#FFFFFF", border: "2px solid #111111", boxShadow: "7px 7px 0 #E9A23B", padding: "10px 10px 0" }}>
                        <div style={{ height: "330px", background: "#8A8F6A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "#F3EEE4" }}>[photo 4]</div>
                        <figcaption style={{ padding: "10px 2px 12px" }}>
                          <div style={{ fontFamily: "'Caveat', cursive", fontSize: "22px", lineHeight: "1.1", color: "#111111" }}>[caption — what's happening here]</div>
                          <div style={{ marginTop: "4px", fontFamily: "'Space Mono', monospace", fontSize: "9.5px", letterSpacing: "1.2px", textTransform: "uppercase", color: "#6B665C" }}>Highlight 04 · [place]</div>
                        </figcaption>
                      </div>
                    </figure>
                  </div>
                  <div className="gal-slide" style={{ width: "390px", flexShrink: "0", boxSizing: "border-box", padding: "18px 30px 0", transform: `scale(${v.g.s4.sc})`, opacity: v.g.s4.op, transition: v.g.tr }} aria-hidden={v.g.s4.hid}>
                    <figure style={{ position: "relative", margin: "0", transform: "rotate(-1.2deg)" }}>
                      <div style={{ position: "absolute", left: "50%", top: "-12px", marginLeft: "-8px", width: "16px", height: "26px", background: "#C9A57A", border: "1.5px solid #111111", boxSizing: "border-box", zIndex: "2" }} />
                      <div style={{ background: "#FFFFFF", border: "2px solid #111111", boxShadow: "7px 7px 0 #E9A23B", padding: "10px 10px 0" }}>
                        <div style={{ height: "330px", background: "#4F6B78", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "#F3EEE4" }}>[photo 5]</div>
                        <figcaption style={{ padding: "10px 2px 12px" }}>
                          <div style={{ fontFamily: "'Caveat', cursive", fontSize: "22px", lineHeight: "1.1", color: "#111111" }}>[caption — what's happening here]</div>
                          <div style={{ marginTop: "4px", fontFamily: "'Space Mono', monospace", fontSize: "9.5px", letterSpacing: "1.2px", textTransform: "uppercase", color: "#6B665C" }}>Highlight 05 · [place]</div>
                        </figcaption>
                      </div>
                    </figure>
                  </div>
                </div>
              </div>
              {/* arrows + morphing dots */}
              <div style={{ position: "absolute", left: "20px", top: "604px", width: "350px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <button onClick={v.g.prev} disabled={v.g.prevOff} aria-label="Previous photo" style={{ width: "48px", height: "48px", flexShrink: "0", padding: "0", background: "#FFFFFF", border: "2px solid #F3EEE4", boxShadow: "4px 4px 0 #E9A23B", display: "flex", alignItems: "center", justifyContent: "center", opacity: v.g.prevOp, transition: "opacity 200ms ease" }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#111111" strokeWidth="2.6" strokeLinecap="square">
                    <path d="M13 3 L6 10 L13 17" />
                  </svg>
                </button>
                <div aria-hidden="true" style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                  <span style={{ display: "block", height: "7px", width: `${v.g.d0.w}px`, borderRadius: "4px", background: v.g.d0.bg, transition: v.g.dtr }} />
                  <span style={{ display: "block", height: "7px", width: `${v.g.d1.w}px`, borderRadius: "4px", background: v.g.d1.bg, transition: v.g.dtr }} />
                  <span style={{ display: "block", height: "7px", width: `${v.g.d2.w}px`, borderRadius: "4px", background: v.g.d2.bg, transition: v.g.dtr }} />
                  <span style={{ display: "block", height: "7px", width: `${v.g.d3.w}px`, borderRadius: "4px", background: v.g.d3.bg, transition: v.g.dtr }} />
                  <span style={{ display: "block", height: "7px", width: `${v.g.d4.w}px`, borderRadius: "4px", background: v.g.d4.bg, transition: v.g.dtr }} />
                </div>
                <button onClick={v.g.next} disabled={v.g.nextOff} aria-label="Next photo" style={{ width: "48px", height: "48px", flexShrink: "0", padding: "0", background: "#FFFFFF", border: "2px solid #F3EEE4", boxShadow: "4px 4px 0 #E9A23B", display: "flex", alignItems: "center", justifyContent: "center", opacity: v.g.nextOp, transition: "opacity 200ms ease" }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#111111" strokeWidth="2.6" strokeLinecap="square">
                    <path d="M7 3 L14 10 L7 17" />
                  </svg>
                </button>
              </div>
              {/* thumbnails */}
              <div style={{ position: "absolute", left: "0", top: "690px", width: "390px", display: "flex", justifyContent: "center", gap: "10px" }}>
                <button onClick={v.g.go0} aria-label="Show photo 1" aria-current={v.g.t0.cur} style={{ width: "52px", height: "52px", padding: "3px", boxSizing: "border-box", background: "#FFFFFF", border: `2px solid ${v.g.t0.bd}`, boxShadow: v.g.t0.sh, transform: `translateY(${v.g.t0.y}px)`, opacity: v.g.t0.op, transition: "transform 420ms cubic-bezier(0.32, 0.72, 0, 1), opacity 420ms ease, border-color 200ms ease" }}>
                  <span style={{ display: "block", width: "100%", height: "100%", background: "#6F8468" }} />
                </button>
                <button onClick={v.g.go1} aria-label="Show photo 2" aria-current={v.g.t1.cur} style={{ width: "52px", height: "52px", padding: "3px", boxSizing: "border-box", background: "#FFFFFF", border: `2px solid ${v.g.t1.bd}`, boxShadow: v.g.t1.sh, transform: `translateY(${v.g.t1.y}px)`, opacity: v.g.t1.op, transition: "transform 420ms cubic-bezier(0.32, 0.72, 0, 1), opacity 420ms ease, border-color 200ms ease" }}>
                  <span style={{ display: "block", width: "100%", height: "100%", background: "#5E7F8C" }} />
                </button>
                <button onClick={v.g.go2} aria-label="Show photo 3" aria-current={v.g.t2.cur} style={{ width: "52px", height: "52px", padding: "3px", boxSizing: "border-box", background: "#FFFFFF", border: `2px solid ${v.g.t2.bd}`, boxShadow: v.g.t2.sh, transform: `translateY(${v.g.t2.y}px)`, opacity: v.g.t2.op, transition: "transform 420ms cubic-bezier(0.32, 0.72, 0, 1), opacity 420ms ease, border-color 200ms ease" }}>
                  <span style={{ display: "block", width: "100%", height: "100%", background: "#A7765A" }} />
                </button>
                <button onClick={v.g.go3} aria-label="Show photo 4" aria-current={v.g.t3.cur} style={{ width: "52px", height: "52px", padding: "3px", boxSizing: "border-box", background: "#FFFFFF", border: `2px solid ${v.g.t3.bd}`, boxShadow: v.g.t3.sh, transform: `translateY(${v.g.t3.y}px)`, opacity: v.g.t3.op, transition: "transform 420ms cubic-bezier(0.32, 0.72, 0, 1), opacity 420ms ease, border-color 200ms ease" }}>
                  <span style={{ display: "block", width: "100%", height: "100%", background: "#8A8F6A" }} />
                </button>
                <button onClick={v.g.go4} aria-label="Show photo 5" aria-current={v.g.t4.cur} style={{ width: "52px", height: "52px", padding: "3px", boxSizing: "border-box", background: "#FFFFFF", border: `2px solid ${v.g.t4.bd}`, boxShadow: v.g.t4.sh, transform: `translateY(${v.g.t4.y}px)`, opacity: v.g.t4.op, transition: "transform 420ms cubic-bezier(0.32, 0.72, 0, 1), opacity 420ms ease, border-color 200ms ease" }}>
                  <span style={{ display: "block", width: "100%", height: "100%", background: "#4F6B78" }} />
                </button>
              </div>
              <div style={{ position: "absolute", left: "0", top: "772px", width: "390px", textAlign: "center", fontFamily: "'Caveat', cursive", fontSize: "19px", color: "#8E8A7A" }}>swipe, or use the arrows</div>
            </div>
          </>
        )}
      </>
    );
  }
}
