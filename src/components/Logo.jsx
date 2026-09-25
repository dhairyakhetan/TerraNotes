// Globe + the AQUATERRA wordmark (the real logo's lettering, /wordmark.webp) with "TerraNotes" underneath.
// Sizes in px (word = the lettering's height, roughly); dark = cream text for the menu.
export default function Logo({ globe, word, sub, dark }) {
  return (
    <>
      <img src="/logo.png" alt="" width={globe} height={globe} style={{ display: "block", width: `${globe}px`, height: `${globe}px` }} />
      <span style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
        <img className={dark ? 'wordmark-img on-dark' : 'wordmark-img'} src="/wordmark.webp" alt="Aquaterra" width={Math.round(word * 6.65)} height={word} style={{ display: "block", height: `${word}px`, width: "auto" }} />
        <span style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: "italic", fontSize: `${sub}px`, lineHeight: "1", color: dark ? "#F3EEE4" : "#1E2723" }}>TerraNotes</span>
      </span>
    </>
  );
}
