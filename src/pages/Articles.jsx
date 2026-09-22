import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import PageHeader from '../components/PageHeader.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import MenuSheet from '../components/MenuSheet.jsx';

/*
  All Articles screen (mobile). Phone design, 390px wide: everything below the sticky header is
  absolutely positioned inside the root; coordinates are page px from the top-left.
  Everything on this page is static markup; the filter chips are visual only.
*/
export default function Articles() {
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => { document.title = 'Aquaterra — All articles'; }, []);

  return (
    <>
      <div className="page-articles" style={{ position: "relative", width: "390px", height: "2380px", margin: "0 auto", overflow: "clip", background: "#F3EEE4", fontFamily: "'Figtree', system-ui, sans-serif", color: "#111111" }}>
        <PageHeader backTo="/" backLabel="Back to home" menuOpen={menuOpen} onOpenMenu={() => setMenuOpen(true)} />
        {/* title block */}
        <div style={{ position: "absolute", left: "20px", top: "96px", fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "1.6px" }}>INDEX · 06 PIECES</div>
        <h1 style={{ position: "absolute", left: "18px", top: "116px", margin: "0", fontFamily: "'Archivo Black', Impact, sans-serif", fontWeight: "400", fontSize: "60px", lineHeight: "0.9", letterSpacing: "-1.5px", textTransform: "uppercase" }}>All<br />articles</h1>
        <div style={{ position: "absolute", left: "236px", top: "128px", width: "130px", fontFamily: "'Caveat', cursive", fontSize: "20px", lineHeight: "1.05", color: "#5B3A1E", transform: "rotate(-5deg)" }}>hung up to dry, one by one</div>
        {/* filters (static) */}
        <div style={{ position: "absolute", left: "18px", top: "256px", width: "356px", display: "flex", flexWrap: "wrap", gap: "10px 10px" }}>
          <button style={{ minHeight: "40px", padding: "0 12px", display: "flex", alignItems: "center", gap: "7px", background: "#111111", color: "#FFFFFF", border: "2px solid #111111", boxShadow: "3px 3px 0 #111111", fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase" }}>All</button>
          <button style={{ minHeight: "40px", padding: "0 12px", display: "flex", alignItems: "center", gap: "7px", background: "#FFFFFF", color: "#111111", border: "2px solid #111111", boxShadow: "3px 3px 0 #111111", fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase" }}><span style={{ width: "9px", height: "9px", background: "#F0442B", border: "1.5px solid #111111", boxSizing: "border-box" }} />Field notes</button>
          <button style={{ minHeight: "40px", padding: "0 12px", display: "flex", alignItems: "center", gap: "7px", background: "#FFFFFF", color: "#111111", border: "2px solid #111111", boxShadow: "3px 3px 0 #111111", fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase" }}><span style={{ width: "9px", height: "9px", background: "#3DA5F4", border: "1.5px solid #111111", boxSizing: "border-box" }} />Reportage</button>
          <button style={{ minHeight: "40px", padding: "0 12px", display: "flex", alignItems: "center", gap: "7px", background: "#FFFFFF", color: "#111111", border: "2px solid #111111", boxShadow: "3px 3px 0 #111111", fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase" }}><span style={{ width: "9px", height: "9px", background: "#1E7A4C", border: "1.5px solid #111111", boxSizing: "border-box" }} />Logbook</button>
          <button style={{ minHeight: "40px", padding: "0 12px", display: "flex", alignItems: "center", gap: "7px", background: "#FFFFFF", color: "#111111", border: "2px solid #111111", boxShadow: "3px 3px 0 #111111", fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase" }}><span style={{ width: "9px", height: "9px", background: "#7B5CE6", border: "1.5px solid #111111", boxSizing: "border-box" }} />Object study</button>
          <button style={{ minHeight: "40px", padding: "0 12px", display: "flex", alignItems: "center", gap: "7px", background: "#FFFFFF", color: "#111111", border: "2px solid #111111", boxShadow: "3px 3px 0 #111111", fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase" }}><span style={{ width: "9px", height: "9px", background: "#F7C21A", border: "1.5px solid #111111", boxSizing: "border-box" }} />Dispatch</button>
          <button style={{ minHeight: "40px", padding: "0 12px", display: "flex", alignItems: "center", gap: "7px", background: "#FFFFFF", color: "#111111", border: "2px solid #111111", boxShadow: "3px 3px 0 #111111", fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase" }}><span style={{ width: "9px", height: "9px", background: "#EE4E8A", border: "1.5px solid #111111", boxSizing: "border-box" }} />Essay</button>
        </div>
        {/* row 1: the wire + featured */}
        <div style={{ position: "absolute", left: "0", top: "430px", width: "390px", height: "2px", background: "#5B3A1E" }} />
        <div style={{ position: "absolute", left: "194px", top: "432px", width: "1.4px", height: "34px", background: "#5B3A1E" }} />
        <Link style={{ position: "absolute", left: "20px", top: "468px", width: "350px", height: "396px", transform: "rotate(-1deg)", display: "block", textDecoration: "none", color: "#111111" }} to="/articles/the-last-of-the-wetlands">
          <div style={{ position: "absolute", left: "50%", top: "-7px", marginLeft: "-15px", width: "30px", height: "9px", background: "#F0442B", border: "1.5px solid #111111", boxSizing: "border-box", zIndex: "2" }} />
          <article style={{ width: "100%", height: "100%", boxSizing: "border-box", background: "#FFFFFF", border: "2px solid #111111", boxShadow: "8px 8px 0 #111111", padding: "10px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ height: "200px", background: "#F2F1ED", border: "1.5px dashed #B9B5AA", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px", fontSize: "11px", color: "#444" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.6" aria-hidden="true">
                <rect x="3" y="4" width="18" height="16" rx="1" />
                <circle cx="9" cy="10" r="2" />
                <path d="M3 17 L9 13 L13 16 L16 13 L21 17" />
              </svg>
              <span>wetlands</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ background: "#F0442B", color: "#FFFFFF", fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase", padding: "3px 8px", borderRadius: "999px", lineHeight: "1.2" }}>Field notes</span>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "1px", color: "#111111" }}>01 / 06</span>
            </div>
            <h2 style={{ margin: "0", fontFamily: "'Archivo Black', Impact, sans-serif", fontWeight: "400", fontSize: "32px", lineHeight: "0.95", letterSpacing: "-0.3px", textTransform: "uppercase", color: "#111111" }}>The last of the wetlands</h2>
            <p style={{ margin: "0", fontFamily: "'Caveat', cursive", fontSize: "19px", lineHeight: "1.1", color: "#5B4630" }}>two dawns counting what's left of the city's marshes</p>
            <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase" }}>
              <span>[Author]</span>
              <span>[x] min read →</span>
            </div>
          </article>
        </Link>
        {/* row 2: second wire, two staggered */}
        <div style={{ position: "absolute", left: "0", top: "900px", width: "390px", height: "2px", background: "#5B3A1E" }} />
        <div style={{ position: "absolute", left: "112px", top: "902px", width: "1.4px", height: "32px", background: "#5B3A1E" }} />
        <div style={{ position: "absolute", left: "296px", top: "902px", width: "1.4px", height: "82px", background: "#5B3A1E" }} />
        <Link style={{ position: "absolute", left: "16px", top: "936px", width: "194px", height: "280px", transform: "rotate(-2deg)", display: "block", textDecoration: "none", color: "#111111" }} to="/articles/what-the-river-remembers">
          <div style={{ position: "absolute", left: "50%", top: "-6px", marginLeft: "-12px", width: "24px", height: "9px", background: "#3DA5F4", border: "1.5px solid #111111", boxSizing: "border-box", zIndex: "2" }} />
          <article style={{ width: "100%", height: "100%", boxSizing: "border-box", background: "#FFFFFF", border: "2px solid #111111", boxShadow: "6px 6px 0 #111111", padding: "8px", display: "flex", flexDirection: "column", gap: "7px", overflow: "hidden" }}>
            <div style={{ height: "112px", background: "#F2F1ED", border: "1.5px dashed #B9B5AA", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px", fontSize: "11px", color: "#444" }}>
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
            <h3 style={{ margin: "0", fontFamily: "'Archivo Black', Impact, sans-serif", fontWeight: "400", fontSize: "18px", lineHeight: "0.95", letterSpacing: "-0.3px", textTransform: "uppercase", color: "#111111" }}>What the river remembers</h3>
            <p style={{ margin: "0", fontFamily: "'Caveat', cursive", fontSize: "16px", lineHeight: "1.1", color: "#5B4630" }}>we tested the river with a borrowed meter. here's what it said.</p>
          </article>
        </Link>
        <Link style={{ position: "absolute", left: "216px", top: "986px", width: "158px", height: "262px", transform: "rotate(2.6deg)", display: "block", textDecoration: "none", color: "#111111" }} to="/articles/six-months-of-compost">
          <div style={{ position: "absolute", left: "50%", top: "-6px", marginLeft: "-12px", width: "24px", height: "9px", background: "#1E7A4C", border: "1.5px solid #111111", boxSizing: "border-box", zIndex: "2" }} />
          <article style={{ width: "100%", height: "100%", boxSizing: "border-box", background: "#FFFFFF", border: "2px solid #111111", boxShadow: "6px 6px 0 #111111", padding: "8px", display: "flex", flexDirection: "column", gap: "7px", overflow: "hidden" }}>
            <div style={{ height: "100px", background: "#F2F1ED", border: "1.5px dashed #B9B5AA", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px", fontSize: "11px", color: "#444" }}>
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
            <h3 style={{ margin: "0", fontFamily: "'Archivo Black', Impact, sans-serif", fontWeight: "400", fontSize: "15.5px", lineHeight: "0.95", letterSpacing: "-0.3px", textTransform: "uppercase", color: "#111111" }}>Six months of compost</h3>
            <p style={{ margin: "0", fontFamily: "'Caveat', cursive", fontSize: "15px", lineHeight: "1.1", color: "#5B4630" }}>one terrace bin, six months, a lot of trial and error</p>
          </article>
        </Link>
        {/* row 3: horizontal card, strung from both above */}
        <div style={{ position: "absolute", left: "110px", top: "1214px", width: "1.4px", height: "82px", background: "#5B3A1E" }} />
        <div style={{ position: "absolute", left: "292px", top: "1246px", width: "1.4px", height: "50px", background: "#5B3A1E" }} />
        <Link style={{ position: "absolute", left: "22px", top: "1296px", width: "346px", height: "190px", transform: "rotate(1deg)", display: "block", textDecoration: "none", color: "#111111" }} to="/articles/a-history-of-the-plastic-chair">
          <article style={{ width: "100%", height: "100%", boxSizing: "border-box", background: "#FFFFFF", border: "2px solid #111111", boxShadow: "7px 7px 0 #7B5CE6", padding: "8px", display: "flex", gap: "12px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "4px 0 0 4px", flexGrow: "1" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ background: "#7B5CE6", color: "#FFFFFF", fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "8.5px", letterSpacing: "1px", textTransform: "uppercase", padding: "3px 8px", borderRadius: "999px", lineHeight: "1.2" }}>Object study</span>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", letterSpacing: "1px", color: "#111111" }}>04 / 06</span>
              </div>
              <h3 style={{ margin: "0", fontFamily: "'Archivo Black', Impact, sans-serif", fontWeight: "400", fontSize: "21px", lineHeight: "0.95", letterSpacing: "-0.3px", textTransform: "uppercase", color: "#111111" }}>A history of the plastic chair</h3>
              <p style={{ margin: "0", fontFamily: "'Caveat', cursive", fontSize: "16px", lineHeight: "1.1", color: "#5B4630" }}>eleven chairs on one street, and what they say about the city</p>
            </div>
            <div style={{ width: "124px", flexShrink: "0", height: "170px", background: "#F2F1ED", border: "1.5px dashed #B9B5AA", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px", fontSize: "11px", color: "#444" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.6" aria-hidden="true">
                <rect x="3" y="4" width="18" height="16" rx="1" />
                <circle cx="9" cy="10" r="2" />
                <path d="M3 17 L9 13 L13 16 L16 13 L21 17" />
              </svg>
              <span>plastic chair</span>
            </div>
          </article>
        </Link>
        {/* row 4: inverted dispatch card */}
        <div style={{ position: "absolute", left: "200px", top: "1484px", width: "1.4px", height: "56px", background: "#5B3A1E" }} />
        <Link style={{ position: "absolute", left: "52px", top: "1540px", width: "310px", height: "330px", transform: "rotate(-1.8deg)", display: "block", textDecoration: "none", color: "#FFFFFF" }} to="/articles/kolkata-at-41-degrees">
          <div style={{ position: "absolute", left: "50%", top: "-7px", marginLeft: "-15px", width: "30px", height: "9px", background: "#F7C21A", border: "1.5px solid #111111", boxSizing: "border-box", zIndex: "2" }} />
          <article style={{ width: "100%", height: "100%", boxSizing: "border-box", background: "#111111", border: "2px solid #111111", boxShadow: "8px 8px 0 #F7C21A", padding: "10px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ height: "160px", background: "#262626", border: "1.5px dashed #5A5A5A", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px", fontSize: "11px", color: "#CFCFCF" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#CFCFCF" strokeWidth="1.6" aria-hidden="true">
                <rect x="3" y="4" width="18" height="16" rx="1" />
                <circle cx="9" cy="10" r="2" />
                <path d="M3 17 L9 13 L13 16 L16 13 L21 17" />
              </svg>
              <span>41 degrees</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ background: "#F7C21A", color: "#111111", fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "9.5px", letterSpacing: "1px", textTransform: "uppercase", padding: "3px 8px", borderRadius: "999px", lineHeight: "1.2" }}>Dispatch</span>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "1px", color: "#FFFFFF" }}>05 / 06</span>
            </div>
            <h3 style={{ margin: "0", fontFamily: "'Archivo Black', Impact, sans-serif", fontWeight: "400", fontSize: "28px", lineHeight: "0.95", letterSpacing: "-0.3px", textTransform: "uppercase", color: "#FFFFFF" }}>Kolkata at 41 degrees</h3>
            <p style={{ margin: "0", fontFamily: "'Caveat', cursive", fontSize: "18px", lineHeight: "1.1", color: "#F7C21A" }}>a heatwave bus ride, stop by stop: who gets shade, who doesn't</p>
          </article>
        </Link>
        {/* row 5: essay + margin note */}
        <div style={{ position: "absolute", left: "0", top: "1920px", width: "390px", height: "2px", background: "#5B3A1E" }} />
        <div style={{ position: "absolute", left: "128px", top: "1922px", width: "1.4px", height: "32px", background: "#5B3A1E" }} />
        <Link style={{ position: "absolute", left: "18px", top: "1956px", width: "226px", height: "300px", transform: "rotate(2deg)", display: "block", textDecoration: "none", color: "#111111" }} to="/articles/who-owns-the-roof">
          <div style={{ position: "absolute", left: "50%", top: "-6px", marginLeft: "-12px", width: "24px", height: "9px", background: "#EE4E8A", border: "1.5px solid #111111", boxSizing: "border-box", zIndex: "2" }} />
          <article style={{ width: "100%", height: "100%", boxSizing: "border-box", background: "#FFFFFF", border: "2px solid #111111", boxShadow: "6px 6px 0 #111111", padding: "8px", display: "flex", flexDirection: "column", gap: "7px", overflow: "hidden" }}>
            <div style={{ height: "130px", background: "#F2F1ED", border: "1.5px dashed #B9B5AA", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px", fontSize: "11px", color: "#444" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.6" aria-hidden="true">
                <rect x="3" y="4" width="18" height="16" rx="1" />
                <circle cx="9" cy="10" r="2" />
                <path d="M3 17 L9 13 L13 16 L16 13 L21 17" />
              </svg>
              <span>the roof</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ background: "#EE4E8A", color: "#111111", fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "8.5px", letterSpacing: "1px", textTransform: "uppercase", padding: "3px 8px", borderRadius: "999px", lineHeight: "1.2" }}>Essay</span>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "9px", letterSpacing: "1px", color: "#111111" }}>06 / 06</span>
            </div>
            <h3 style={{ margin: "0", fontFamily: "'Archivo Black', Impact, sans-serif", fontWeight: "400", fontSize: "21px", lineHeight: "0.95", letterSpacing: "-0.3px", textTransform: "uppercase", color: "#111111" }}>Who owns the roof?</h3>
            <p style={{ margin: "0", fontFamily: "'Caveat', cursive", fontSize: "17px", lineHeight: "1.1", color: "#5B4630" }}>we asked eleven buildings for their roofs. two said yes.</p>
          </article>
        </Link>
        <div style={{ position: "absolute", left: "262px", top: "2020px", width: "110px", fontFamily: "'Caveat', cursive", fontSize: "20px", lineHeight: "1.05", color: "#5B3A1E", transform: "rotate(4deg)" }}>that's all of them, for now.</div>
        <svg width="60" height="40" viewBox="0 0 60 40" style={{ position: "absolute", left: "272px", top: "2092px" }} fill="none" stroke="#5B3A1E" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
          <path d="M50 4 C40 30 20 34 6 24" />
          <path d="M12 18 L6 24 L14 28" />
        </svg>
        <SiteFooter top="2210px" />
      </div>
      <MenuSheet open={menuOpen} onClose={() => setMenuOpen(false)} current="articles" />
    </>
  );
}
