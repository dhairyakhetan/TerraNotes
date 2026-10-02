import { PhotoIcon } from './Icons.jsx';

// A picture filling its slot (cropped to fit, top kept in view: covers put their titles there), or, with no src yet,
// the design's dashed placeholder showing `label`. box = the slot's size styles; dark = placeholder colours for dark
// cards; icon / font = placeholder icon and label sizes.
export default function ImageSlot({ src, alt, label = alt, box, dark, icon = 18, font = '11px' }) {
  if (src) return <img src={src} alt={alt} style={{ objectPosition: "50% 12%", ...box, display: "block", width: box.width || "100%", boxSizing: "border-box", objectFit: "cover" }} />;
  const ink = dark ? "var(--slotDarkInk)" : "var(--slotInk)";
  return (
    <div style={{ ...box, background: dark ? "var(--slotDark)" : "var(--blank)", border: `1.5px dashed ${dark ? "var(--slotDarkLine)" : "var(--slotLine)"}`, boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px", fontSize: font, color: ink }}>
      <PhotoIcon size={icon} color={ink} />
      <span>{label}</span>
    </div>
  );
}
