// A picture, or the design's dashed placeholder (icon + label) until there is one.
// box = the slot's size styles; dark = placeholder colours for dark cards.
export default function Img({ src, alt, label = alt, box, dark }) {
  if (src) return <img src={src} alt={alt} style={{ ...box, display: "block", width: box.width || "100%", boxSizing: "border-box", objectFit: "cover" }} />;
  const ink = dark ? "#CFCFCF" : "#444";
  return (
    <div style={{ ...box, background: dark ? "#262626" : "#F2F1ED", border: `1.5px dashed ${dark ? "#5A5A5A" : "#B9B5AA"}`, boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px", fontSize: "11px", color: ink }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={ink} strokeWidth="1.6" aria-hidden="true">
        <rect x="3" y="4" width="18" height="16" rx="1" />
        <circle cx="9" cy="10" r="2" />
        <path d="M3 17 L9 13 L13 16 L16 13 L21 17" />
      </svg>
      <span>{label}</span>
    </div>
  );
}
