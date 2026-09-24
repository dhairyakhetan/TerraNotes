// Small editorial pieces that sit inside an article (see src/data/articles.js), each one riffing on the piece's idea
// rather than repeating its words. `web` draws them a size up for the web reading column.
//   { numbers: [['label', 'value'], …], title }   a yellow tally card
//   { checklist: [['item', done], …], title }      a to-do note, ticked or not
//   { loop: ['step', …], title }                    steps that go round and round
//   { then: [['then', 'now'], …], title, labels }   a two-column then / now card
const MONO = { fontFamily: "'Space Mono', monospace", letterSpacing: "1px", textTransform: "uppercase" };
const HEAD = { fontFamily: "'Archivo Black', Impact, sans-serif", textTransform: "uppercase", lineHeight: "1" };

export const isExtra = (b) => !!(b.numbers || b.checklist || b.loop || b.then);

export default function Extra({ b, tag, web }) {
  const z = web ? 1.25 : 1, px = (n) => `${Math.round(n * z)}px`;
  if (b.numbers) {
    return (
      <aside style={{ boxSizing: "border-box", width: px(300), marginLeft: web ? "60px" : "22px", transform: "rotate(1.2deg)", background: "#F7C21A", border: "2px solid #111111", boxShadow: "6px 6px 0 #111111", padding: `${px(14)} ${px(16)}`, display: "flex", flexDirection: "column", gap: px(8) }}>
        <div style={{ ...HEAD, fontSize: px(18) }}>{b.title}</div>
        {b.numbers.map(([label, value], i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "12px", borderTop: "1.5px solid #111111", paddingTop: px(6) }}>
            <span style={{ ...MONO, fontSize: px(10.5) }}>{label}</span>
            <span style={{ fontFamily: "'Caveat', cursive", fontSize: px(22), lineHeight: "1", textAlign: "right" }}>{value}</span>
          </div>
        ))}
      </aside>
    );
  }
  if (b.checklist) {
    return (
      <aside style={{ position: "relative", boxSizing: "border-box", width: px(290), marginLeft: web ? "40px" : "14px", transform: "rotate(-1.5deg)", background: "#FFFFFF", border: "2px solid #111111", boxShadow: `6px 6px 0 ${tag.color}`, padding: `${px(18)} ${px(18)} ${px(14)}` }}>
        <div style={{ position: "absolute", left: "50%", top: "-8px", marginLeft: "-22px", width: "44px", height: "14px", background: tag.color, opacity: ".85", transform: "rotate(-3deg)" }} />
        <div style={{ ...MONO, fontSize: px(10), marginBottom: px(8) }}>{b.title}</div>
        {b.checklist.map(([item, done], i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: px(10), padding: `${px(3)} 0` }}>
            <span style={{ flexShrink: "0", width: px(16), height: px(16), marginTop: px(4), boxSizing: "border-box", border: "2px solid #111111", display: "flex", alignItems: "center", justifyContent: "center", fontSize: px(13), lineHeight: "1", fontWeight: "700" }}>{done ? '✓' : ''}</span>
            <span style={{ fontFamily: "'Caveat', cursive", fontSize: px(22), lineHeight: "1.1", color: done ? "#8A8478" : "#111111", textDecoration: done ? "line-through" : "none" }}>{item}</span>
          </div>
        ))}
      </aside>
    );
  }
  if (b.loop) {
    const arrow = <span aria-hidden="true" style={{ fontFamily: "'Space Mono', monospace", fontSize: px(14), color: tag.color }}>→</span>;
    return (
      <aside style={{ boxSizing: "border-box", margin: web ? "8px -60px" : "4px 0", transform: "rotate(-0.8deg)", background: "#111111", color: "#F3EEE4", border: "2px solid #111111", boxShadow: `7px 7px 0 ${tag.color}`, padding: `${px(18)} ${px(18)}` }}>
        <div style={{ ...HEAD, fontSize: px(18), color: tag.color, marginBottom: px(12) }}>{b.title}</div>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: `${px(8)} ${px(8)}` }}>
          {b.loop.map((step, i) => (
            <span key={i} style={{ display: "contents" }}>
              <span style={{ ...MONO, fontSize: px(10.5), lineHeight: "1.3", padding: `${px(5)} ${px(9)}`, border: "1.5px solid #F3EEE4", borderRadius: "999px" }}>{step}</span>
              {arrow}
            </span>
          ))}
          <span style={{ fontFamily: "'Caveat', cursive", fontSize: px(22), lineHeight: "1", color: tag.color }}>↺ and again</span>
        </div>
      </aside>
    );
  }
  if (b.then) {
    const [left, right] = b.labels || ['then', 'now'];
    const cell = { padding: `${px(8)} ${px(12)}`, borderTop: "1.5px solid #111111" };
    return (
      <aside style={{ boxSizing: "border-box", margin: web ? "8px -40px" : "4px 0", transform: "rotate(0.8deg)", background: "#FFFFFF", border: "2px solid #111111", boxShadow: "7px 7px 0 #111111" }}>
        <div style={{ ...HEAD, fontSize: px(18), padding: `${px(14)} ${px(12)} ${px(10)}` }}>{b.title}</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
          <div style={{ ...cell, ...MONO, fontSize: px(10), background: tag.color, color: tag.ink, borderRight: "1.5px solid #111111" }}>{left}</div>
          <div style={{ ...cell, ...MONO, fontSize: px(10), background: "#111111", color: "#F3EEE4" }}>{right}</div>
          {b.then.map(([a, c], i) => [
            <div key={`a${i}`} style={{ ...cell, borderRight: "1.5px solid #111111", fontFamily: "'Caveat', cursive", fontSize: px(20), lineHeight: "1.1", color: "#5B3A1E" }}>{a}</div>,
            <div key={`b${i}`} style={{ ...cell, fontFamily: "'Figtree', system-ui, sans-serif", fontSize: px(14), lineHeight: "1.35", color: "#111111" }}>{c}</div>,
          ])}
        </div>
      </aside>
    );
  }
  return null;
}
