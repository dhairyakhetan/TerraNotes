import { useRef } from 'react';
import { fitWord, useWordsGame } from '../../lib/useWordsGame.js';

// "Words we should bring back" mini game, phone layout (logic: lib/useWordsGame.js, words: src/data/words.js).
export default function WordsGame() {
  const ref = useRef(null);
  const v = { w: useWordsGame(ref) };
  v.w.wordSize = fitWord(v.w.word, 42, 300);

  return (
    <section id="words" ref={ref} style={{ position: "absolute", left: "0", top: "1830px", width: "390px", height: "650px" }}>
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
          <div style={{ marginTop: "4px", fontFamily: "'Archivo Black', Impact, sans-serif", fontSize: v.w.wordSize, lineHeight: "1", textTransform: "uppercase", letterSpacing: "-0.5px", color: "#111111" }}>{v.w.word}</div>
          <div style={{ marginTop: "4px", fontFamily: "'Caveat', cursive", fontSize: "20px", color: "#5B3A1E" }}>what do you think it means?</div>
        </div>
      </div>
      {/* options / result */}
      {v.w.playing && (
        <>
          <div style={{ position: "absolute", left: "20px", top: "330px", width: "350px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <button className="w-opt" onClick={v.w.o0.pick} disabled={v.w.locked} style={{ minHeight: "52px", width: "100%", boxSizing: "border-box", padding: "10px 14px", display: "flex", alignItems: "center", gap: "12px", textAlign: "left", background: v.w.o0.bg, color: v.w.o0.fg, border: "2px solid #111111", boxShadow: "4px 4px 0 #111111", opacity: v.w.o0.op, fontFamily: "'Figtree', system-ui, sans-serif", fontSize: "15px", fontWeight: "500", lineHeight: "1.25", transition: "background-color 120ms ease, opacity 120ms ease" }}>
              <span style={{ width: "26px", height: "26px", flexShrink: "0", border: "2px solid currentColor", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "12px" }}>{v.w.o0.mark}</span>
              <span style={{ flexGrow: "1" }}>{v.w.o0.text}</span>
            </button>
            <button className="w-opt" onClick={v.w.o1.pick} disabled={v.w.locked} style={{ minHeight: "52px", width: "100%", boxSizing: "border-box", padding: "10px 14px", display: "flex", alignItems: "center", gap: "12px", textAlign: "left", background: v.w.o1.bg, color: v.w.o1.fg, border: "2px solid #111111", boxShadow: "4px 4px 0 #111111", opacity: v.w.o1.op, fontFamily: "'Figtree', system-ui, sans-serif", fontSize: "15px", fontWeight: "500", lineHeight: "1.25", transition: "background-color 120ms ease, opacity 120ms ease" }}>
              <span style={{ width: "26px", height: "26px", flexShrink: "0", border: "2px solid currentColor", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "12px" }}>{v.w.o1.mark}</span>
              <span style={{ flexGrow: "1" }}>{v.w.o1.text}</span>
            </button>
            <button className="w-opt" onClick={v.w.o2.pick} disabled={v.w.locked} style={{ minHeight: "52px", width: "100%", boxSizing: "border-box", padding: "10px 14px", display: "flex", alignItems: "center", gap: "12px", textAlign: "left", background: v.w.o2.bg, color: v.w.o2.fg, border: "2px solid #111111", boxShadow: "4px 4px 0 #111111", opacity: v.w.o2.op, fontFamily: "'Figtree', system-ui, sans-serif", fontSize: "15px", fontWeight: "500", lineHeight: "1.25", transition: "background-color 120ms ease, opacity 120ms ease" }}>
              <span style={{ width: "26px", height: "26px", flexShrink: "0", border: "2px solid currentColor", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "12px" }}>{v.w.o2.mark}</span>
              <span style={{ flexGrow: "1" }}>{v.w.o2.text}</span>
            </button>
          </div>
          {/* "psst." hint; the reveal line replaces it once they answer */}
          {v.w.showHint && (
            <div className="w-hint" role="status" style={{ position: "absolute", left: "34px", top: "550px", width: "300px", boxSizing: "border-box", background: "#FFFFFF", border: "2px solid #111111", boxShadow: "5px 5px 0 #F7C21A", padding: "12px 16px 10px 18px", transform: "rotate(-1.5deg)" }}>
              <div style={{ position: "absolute", left: "-12px", top: "-17px", background: "#111111", color: "#F7C21A", fontFamily: "'Caveat', cursive", fontSize: "20px", padding: "2px 12px", transform: "rotate(-6deg)" }}>psst.</div>
              <div style={{ fontFamily: "'Caveat', cursive", fontSize: "21px", lineHeight: "1.1", color: "#111111" }}>{v.w.hint}</div>
            </div>
          )}
          {v.w.revealed && (
            <>
              <div className="w-reveal" style={{ position: "absolute", left: "20px", top: "534px", width: "350px", display: "flex", alignItems: "flex-start", gap: "12px" }}>
                <p style={{ margin: "0", flexGrow: "1", fontSize: "13.5px", lineHeight: "1.45", color: "#1E2723" }}><strong style={{ fontWeight: "600" }}>{v.w.verdict}</strong>{" "}{v.w.def}</p>
                <button className="press" onClick={v.w.next} style={{ "--c": "#F7C21A", minHeight: "44px", flexShrink: "0", padding: "0 14px", background: "#111111", color: "#FFFFFF", border: "2px solid #111111", boxShadow: "3px 3px 0 #F7C21A", fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase" }}>{v.w.nextLabel} →</button>
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
  );
}
