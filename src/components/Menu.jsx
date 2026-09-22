import { Link } from 'react-router';
import SmartLink from './SmartLink.jsx';

// Full-screen menu, rendered inside each page's MenuSheet (which does the slide-in from the right).
// current: which stop gets the "you're here" note. On the home page the stops scroll within the page.
export default function Menu({ current = 'home', onClose }) {
  const home = current === 'home';
  const v = {
    close: () => { if (onClose) onClose(); },
    isHome: home,
    isArticles: current === 'articles',
    homeHref: home ? '#top' : '/',
    photosHref: home ? '#photos' : '/#photos',
    wordsHref: home ? '#words' : '/#words',
    membersHref: home ? '#members' : '/#members',
  };
  return (
    <nav aria-label="Main menu" style={{ position: "relative", width: "390px", height: "844px", overflow: "hidden", background: "#111111", color: "#F3EEE4", fontFamily: "'Figtree', system-ui, sans-serif" }}>
      {/* top bar */}
      <div style={{ position: "absolute", left: "18px", top: "16px" }}>
        <SmartLink href={v.homeHref} onClick={v.close} aria-label="Aquaterra — home" style={{ display: "flex", alignItems: "center", gap: "6px", minHeight: "44px", textDecoration: "none" }}>
          <img src="/logo.png" alt="" width="36" height="36" style={{ display: "block", width: "36px", height: "36px" }} />
          <span className="wordmark" style={{ fontFamily: "'Archivo Black', Impact, sans-serif", fontSize: "27px", lineHeight: "1", letterSpacing: "0.5px", textTransform: "uppercase" }}>Aquaterra</span>
        </SmartLink>
      </div>
      <button onClick={v.close} aria-label="Close menu" style={{ position: "absolute", right: "20px", top: "18px", width: "48px", height: "48px", background: "#FFFFFF", border: "2px solid #F3EEE4", boxShadow: "4px 4px 0 #F0442B", padding: "0", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#111111" strokeWidth="2.6" strokeLinecap="square">
          <path d="M3 3 L17 17" />
          <path d="M17 3 L3 17" />
        </svg>
      </button>
      <div style={{ position: "absolute", left: "20px", top: "94px", fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "1.6px", color: "#BDB6A6" }}>MENU · 05 STOPS</div>
      {/* wire + chain of strings */}
      <div style={{ position: "absolute", left: "0", top: "124px", width: "390px", height: "2px", background: "#8E7A5E" }} />
      <div style={{ position: "absolute", left: "190px", top: "126px", width: "1.4px", height: "24px", background: "#8E7A5E" }} />
      <div style={{ position: "absolute", left: "110px", top: "226px", width: "1.4px", height: "30px", background: "#8E7A5E" }} />
      <div style={{ position: "absolute", left: "270px", top: "332px", width: "1.4px", height: "30px", background: "#8E7A5E" }} />
      <div style={{ position: "absolute", left: "130px", top: "438px", width: "1.4px", height: "30px", background: "#8E7A5E" }} />
      <div style={{ position: "absolute", left: "250px", top: "544px", width: "1.4px", height: "30px", background: "#8E7A5E" }} />
      {/* 01 home */}
      <SmartLink href={v.homeHref} onClick={v.close} style={{ position: "absolute", left: "20px", top: "150px", width: "318px", height: "76px", boxSizing: "border-box", transform: "rotate(-1.5deg)", background: "#FFFFFF", border: "2px solid #F3EEE4", boxShadow: "6px 6px 0 #F0442B", padding: "0 16px", display: "flex", alignItems: "center", gap: "14px", textDecoration: "none", color: "#111111" }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px" }}>01</span>
        <span style={{ flexGrow: "1", fontFamily: "'Archivo Black', Impact, sans-serif", fontSize: "32px", lineHeight: "1", textTransform: "uppercase", letterSpacing: "-0.5px" }}>Home</span>
        <svg width="22" height="16" viewBox="0 0 22 16" fill="none" stroke="#111111" strokeWidth="2.4">
          <path d="M1 8 H19" />
          <path d="M13 2 L19 8 L13 14" />
        </svg>
      </SmartLink>
      {v.isHome && (
        <>
          <div style={{ position: "absolute", left: "290px", top: "216px", fontFamily: "'Caveat', cursive", fontSize: "19px", color: "#F0442B", transform: "rotate(-6deg)" }}>you're here</div>
        </>
      )}
      {/* 02 articles */}
      <Link onClick={v.close} style={{ position: "absolute", left: "50px", top: "256px", width: "318px", height: "76px", boxSizing: "border-box", transform: "rotate(1.2deg)", background: "#FFFFFF", border: "2px solid #F3EEE4", boxShadow: "6px 6px 0 #3DA5F4", padding: "0 16px", display: "flex", alignItems: "center", gap: "14px", textDecoration: "none", color: "#111111" }} to="/articles">
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px" }}>02</span>
        <span style={{ flexGrow: "1", fontFamily: "'Archivo Black', Impact, sans-serif", fontSize: "32px", lineHeight: "1", textTransform: "uppercase", letterSpacing: "-0.5px" }}>Articles</span>
        <svg width="22" height="16" viewBox="0 0 22 16" fill="none" stroke="#111111" strokeWidth="2.4">
          <path d="M1 8 H19" />
          <path d="M13 2 L19 8 L13 14" />
        </svg>
      </Link>
      {v.isArticles && (
        <>
          <div style={{ position: "absolute", left: "20px", top: "330px", fontFamily: "'Caveat', cursive", fontSize: "19px", color: "#3DA5F4", transform: "rotate(-6deg)" }}>you're here</div>
        </>
      )}
      {/* 03 photo wall */}
      <SmartLink href={v.photosHref} onClick={v.close} style={{ position: "absolute", left: "24px", top: "362px", width: "318px", height: "76px", boxSizing: "border-box", transform: "rotate(-0.8deg)", background: "#FFFFFF", border: "2px solid #F3EEE4", boxShadow: "6px 6px 0 #F7C21A", padding: "0 16px", display: "flex", alignItems: "center", gap: "14px", textDecoration: "none", color: "#111111" }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px" }}>03</span>
        <span style={{ flexGrow: "1", fontFamily: "'Archivo Black', Impact, sans-serif", fontSize: "32px", lineHeight: "1", textTransform: "uppercase", letterSpacing: "-0.5px" }}>Photo wall</span>
        <svg width="22" height="16" viewBox="0 0 22 16" fill="none" stroke="#111111" strokeWidth="2.4">
          <path d="M1 8 H19" />
          <path d="M13 2 L19 8 L13 14" />
        </svg>
      </SmartLink>
      {/* 04 words */}
      <SmartLink href={v.wordsHref} onClick={v.close} style={{ position: "absolute", left: "46px", top: "468px", width: "318px", height: "76px", boxSizing: "border-box", transform: "rotate(1.6deg)", background: "#FFFFFF", border: "2px solid #F3EEE4", boxShadow: "6px 6px 0 #7FC49B", padding: "0 16px", display: "flex", alignItems: "center", gap: "14px", textDecoration: "none", color: "#111111" }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px" }}>04</span>
        <span style={{ flexGrow: "1", fontFamily: "'Archivo Black', Impact, sans-serif", fontSize: "32px", lineHeight: "1", textTransform: "uppercase", letterSpacing: "-0.5px" }}>Words</span>
        <svg width="22" height="16" viewBox="0 0 22 16" fill="none" stroke="#111111" strokeWidth="2.4">
          <path d="M1 8 H19" />
          <path d="M13 2 L19 8 L13 14" />
        </svg>
      </SmartLink>
      {/* 05 members */}
      <SmartLink href={v.membersHref} onClick={v.close} style={{ position: "absolute", left: "22px", top: "574px", width: "318px", height: "76px", boxSizing: "border-box", transform: "rotate(-1.2deg)", background: "#FFFFFF", border: "2px solid #F3EEE4", boxShadow: "6px 6px 0 #EE4E8A", padding: "0 16px", display: "flex", alignItems: "center", gap: "14px", textDecoration: "none", color: "#111111" }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px" }}>05</span>
        <span style={{ flexGrow: "1", fontFamily: "'Archivo Black', Impact, sans-serif", fontSize: "32px", lineHeight: "1", textTransform: "uppercase", letterSpacing: "-0.5px" }}>Members</span>
        <svg width="22" height="16" viewBox="0 0 22 16" fill="none" stroke="#111111" strokeWidth="2.4">
          <path d="M1 8 H19" />
          <path d="M13 2 L19 8 L13 14" />
        </svg>
      </SmartLink>
      {/* bottom */}
      <div style={{ position: "absolute", left: "20px", top: "700px", width: "350px", height: "1.5px", background: "#3A3A36" }} />
      <div style={{ position: "absolute", left: "20px", top: "716px", width: "200px", fontFamily: "'Caveat', cursive", fontSize: "22px", lineHeight: "1.05", color: "#F7C21A", transform: "rotate(-2deg)" }}>notes from where the land meets the water.</div>
      <a href="#" style={{ position: "absolute", right: "20px", top: "712px", minHeight: "44px", display: "flex", alignItems: "center", gap: "6px", fontFamily: "'Space Mono', monospace", fontSize: "12px", textDecoration: "none", color: "#F3EEE4" }}>@ngo.aquaterra{" "}<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M2 10 L10 2" />
      <path d="M4 2 H10 V8" />
    </svg></a>
      <div style={{ position: "absolute", left: "20px", top: "796px", fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "1.4px", color: "#8E8A7A" }}>TERRANOTES · © {new Date().getFullYear()}</div>
    </nav>
  );
}
