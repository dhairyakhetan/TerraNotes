import { useRef } from 'react';
import { fitWord, useWordsGame } from '../lib/useWordsGame.js';

const CLOUD = 'M26 104 H176 A24 24 0 0 0 178 56 A36 36 0 0 0 110 30 A30 30 0 0 0 56 42 A30 30 0 0 0 26 104 Z';

// the answer they picked shakes if wrong; the right one bounces
const mood = (o) => (o.mark === '✓' ? 'w-right' : o.mark === '✗' ? 'w-wrong' : '');
// "Words we should bring back", web layout (logic: lib/useWordsGame.js). The word on a cloud, three meanings beside it.
export default function WebWords() {
  const ref = useRef(null);
  const w = useWordsGame(ref);
  const option = (o) => (
    <button className={`w-opt btn ${mood(o)}`} onClick={o.pick} disabled={w.locked} style={{ minHeight: "68px", width: "100%", boxSizing: "border-box", padding: "12px 20px", display: "flex", alignItems: "center", gap: "16px", textAlign: "left", background: o.bg, color: o.fg, border: "2px solid #111111", boxShadow: "5px 5px 0 #111111", opacity: o.op, fontFamily: "'Figtree', system-ui, sans-serif", fontSize: "19px", fontWeight: "500", lineHeight: "1.25", transition: "background-color 120ms ease, opacity 120ms ease, translate 160ms ease" }}>
      <span style={{ width: "34px", height: "34px", flexShrink: "0", border: "2px solid currentColor", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "14px" }}>{o.mark}</span>
      <span style={{ flexGrow: "1" }}>{o.text}</span>
    </button>
  );

  return (
    <section id="words" ref={ref} style={{ position: "absolute", left: "0", top: "1910px", width: "1440px", height: "600px" }}>
      <h2 style={{ position: "absolute", left: "80px", top: "20px", width: "560px", margin: "0", fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: "italic", fontWeight: "400", fontSize: "68px", lineHeight: "0.95", color: "#111111" }}>Words we should bring back.</h2>
      <div style={{ position: "absolute", left: "84px", top: "172px", fontFamily: "'Space Mono', monospace", fontSize: "12px", letterSpacing: "1.8px" }}>{`MINI GAME · SCORE ${w.score} / ${w.total}`}</div>
      <div style={{ position: "absolute", left: "50px", top: "230px", width: "620px", height: "320px" }}>
        <svg width="620" height="320" viewBox="0 0 200 110" preserveAspectRatio="none" style={{ position: "absolute", left: "0", top: "0", overflow: "visible" }} aria-hidden="true">
          <path d={CLOUD} fill="#111111" transform="translate(2.5 3)" />
          <path d={CLOUD} fill="#FFFFFF" stroke="#111111" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        </svg>
        <div style={{ position: "absolute", left: "0", top: "128px", width: "620px", textAlign: "center" }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", letterSpacing: "1.8px", color: "#4A4A45" }}>{`WORD ${w.n} / ${w.total}`}</div>
          <div key={w.word} className="word-pop" style={{ marginTop: "6px", fontFamily: "'Archivo Black', Impact, sans-serif", fontSize: fitWord(w.word, 68, 500), lineHeight: "1", textTransform: "uppercase", letterSpacing: "-1px", color: "#111111" }}>{w.word}</div>
          <div style={{ marginTop: "6px", fontFamily: "'Caveat', cursive", fontSize: "26px", color: "#5B3A1E" }}>what do you think it means?</div>
        </div>
      </div>
      {w.playing && (
        <>
          <div key={w.word} className="w-in" style={{ position: "absolute", left: "760px", top: "110px", width: "600px", display: "flex", flexDirection: "column", gap: "18px" }}>
            {option(w.o0)}
            {option(w.o1)}
            {option(w.o2)}
          </div>
          {/* "psst." hint; the reveal line replaces it once they answer */}
          {w.showHint && (
            <div className="w-hint" role="status" style={{ position: "absolute", left: "790px", top: "414px", width: "440px", boxSizing: "border-box", background: "#FFFFFF", border: "2px solid #111111", boxShadow: "6px 6px 0 #F7C21A", padding: "14px 20px 12px 22px", transform: "rotate(-1.5deg)" }}>
              <div style={{ position: "absolute", left: "-14px", top: "-19px", background: "#111111", color: "#F7C21A", fontFamily: "'Caveat', cursive", fontSize: "23px", padding: "2px 14px", transform: "rotate(-6deg)" }}>psst.</div>
              <div style={{ fontFamily: "'Caveat', cursive", fontSize: "26px", lineHeight: "1.1", color: "#111111" }}>{w.hint}</div>
            </div>
          )}
          {w.revealed && (
            <div className="w-reveal" style={{ position: "absolute", left: "760px", top: "400px", width: "600px", display: "flex", alignItems: "flex-start", gap: "20px" }}>
              <p style={{ margin: "0", flexGrow: "1", fontSize: "16px", lineHeight: "1.5", color: "#1E2723" }}><strong style={{ fontWeight: "600" }}>{w.verdict}</strong>{" "}{w.def}</p>
              <button className="btn" onClick={w.next} style={{ minHeight: "48px", flexShrink: "0", padding: "0 18px", background: "#111111", color: "#FFFFFF", border: "2px solid #111111", boxShadow: "4px 4px 0 #F7C21A", fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "12px", letterSpacing: "1px", textTransform: "uppercase" }}>{`${w.nextLabel} →`}</button>
            </div>
          )}
        </>
      )}
      {w.done && (
        <div className="w-reveal" style={{ position: "absolute", left: "780px", top: "120px", width: "520px", boxSizing: "border-box", background: "#F7C21A", border: "2px solid #111111", boxShadow: "9px 9px 0 #111111", padding: "28px", transform: "rotate(-1.5deg)" }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "12px", letterSpacing: "1.8px" }}>YOUR SCORE</div>
          <div style={{ fontFamily: "'Archivo Black', Impact, sans-serif", fontSize: "96px", lineHeight: "1", color: "#111111" }}>{`${w.score} / ${w.total}`}</div>
          <div style={{ marginTop: "8px", fontFamily: "'Caveat', cursive", fontSize: "30px", lineHeight: "1.1", color: "#111111" }}>{w.message}</div>
          <button className="btn" onClick={w.restart} style={{ marginTop: "18px", minHeight: "48px", padding: "0 20px", background: "#111111", color: "#FFFFFF", border: "2px solid #111111", fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "12px", letterSpacing: "1px", textTransform: "uppercase" }}>Play again ↺</button>
        </div>
      )}
    </section>
  );
}
