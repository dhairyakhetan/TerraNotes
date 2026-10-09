import WordsGameSection from './WordsGameSection.jsx';

// The words game ("Words we should bring back", WordsGameSection.jsx) in a frame that flows with the page, for home
// pages whose parts flow one under another (October's annual, the newer editions' own homes) rather than sit on the
// shared pages' artboard. The section places itself on that artboard; an offset box moves it into the frame.
// SHARED_WORDS: where it places itself and its size, and how it's fitted into a page's column: its content spans
// x 70–1360 on web (10–380 on phones), wider than the column, so it's drawn a little smaller (scale) and shifted (left)
// to sit centred. Needs the edition's LAYOUT wordsRow (src/editions/pages.js) on web, as the sizes are that layout's.
// className: the frame's own class, for an edition's CSS to dress it (its background and border are set inline here:
// var(--card), a double ink rule).
const SHARED_WORDS = { web: { top: 1910, height: 600, scale: 0.88, left: -32, pad: 18 }, phone: { top: 1830, height: 650, scale: 0.92, left: -7, pad: 12 } };

export default function FramedWords({ web, className }) {
  const S = SHARED_WORDS[web ? 'web' : 'phone'];
  return (
    <div className={className} style={{ position: "relative", height: `${Math.round(S.height * S.scale) + S.pad}px`, background: "var(--card)", border: "3px double var(--ink)", overflow: "clip" }}>
      <div style={{ position: "absolute", left: `${S.left}px`, top: `${S.pad - 4}px`, width: web ? "1440px" : "390px", height: "0", transform: `scale(${S.scale})`, transformOrigin: "0 0" }}>
        <div style={{ position: "absolute", left: "0", top: `${-S.top}px`, width: "100%", height: "0" }}><WordsGameSection web={web} /></div>
      </div>
    </div>
  );
}
