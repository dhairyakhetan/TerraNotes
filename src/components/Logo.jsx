// Globe + AQUATERRA wordmark with "TerraNotes" underneath. Sizes in px; dark = cream text for the menu.
export default function Logo({ globe, word, sub, dark }) {
  return (
    <>
      <img src="/logo.png" alt="" width={globe} height={globe} style={{ display: "block", width: `${globe}px`, height: `${globe}px` }} />
      <span style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
        <span className="wordmark" style={{ fontFamily: "'Archivo Black', Impact, sans-serif", fontSize: `${word}px`, lineHeight: "1", letterSpacing: "0.5px", textTransform: "uppercase" }}>Aquaterra</span>
        <span style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: "italic", fontSize: `${sub}px`, lineHeight: "1", color: dark ? "#F3EEE4" : "#1E2723" }}>TerraNotes</span>
      </span>
    </>
  );
}
