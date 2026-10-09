import { useEdition } from '../../lib/edition.js';
import { PhotoIcon } from '../../shared/Icons.jsx';
import { FONT } from '../../styles/fonts.js';

// The newer editions' photos (SeasonHome.jsx): the edition's photo wall (photos.js) as a grid of prints, the first big
// (web: two columns and two rows of four, or of three when that fills every row; phones: the full width), the rest
// after it; when the last row isn't full, its prints stretch to share it. Each print is a button (.ss-print, plus the month's printClass for its frame: a
// polaroid, a gilt frame, a stamp…) holding the picture (.ss-pic) and its caption (.ss-cap); tapping one opens the
// photo viewer at it. A photo still to come shows its tint and "[photo]".
export default function PhotoWall({ web, onOpen, printClass = '' }) {
  const { photos } = useEdition(), n = photos.length;
  // web: four columns, or three when that fills every row (six photos); the first print takes 4 cells (phones: 2)
  const cols = web ? ((n + 3) % 3 === 0 && (n + 3) % 4 ? 3 : 4) : 2;
  const left = ((web ? 4 : 2) + n - 1) % cols; // prints in a last row that isn't full
  // a last row that isn't full: its prints share it, the spare columns going to the last ones
  const spanOf = (i) => { const k = i - (n - left); return k < 0 ? 1 : 1 + Math.floor((cols - left) / left) + (k >= left - ((cols - left) % left) ? 1 : 0); };
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gridAutoRows: web ? "250px" : "170px", gap: web ? "34px 30px" : "22px 16px" }}>
      {photos.map((p, i) => {
        const span = i === 0 ? { gridColumn: "span 2", gridRow: web ? "span 2" : "span 1" } : left && spanOf(i) > 1 ? { gridColumn: `span ${spanOf(i)}` } : null;
        return (
          <button key={i} type="button" className={`press btn ss-print ${printClass}`} onClick={() => onOpen(i)} aria-label={`Open photo ${i + 1}${p.caption ? `: ${p.caption}` : ''}`} style={{ "--c": "var(--ink)", position: "relative", display: "flex", flexDirection: "column", minWidth: "0", padding: "0", font: "inherit", cursor: "pointer", textAlign: "left", ...span }}>
            <span className="ss-pic" style={{ position: "relative", flexGrow: "1", minHeight: "0", background: p.tint, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {p.photo
                ? <img src={p.photo} alt={p.caption} loading={i ? 'lazy' : 'eager'} decoding="async" style={{ position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover" }} />
                : <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", fontFamily: FONT.mono, fontSize: "11px", color: "var(--wallInk)" }}><PhotoIcon size={20} color="var(--wallInk)" />[photo]</span>}
            </span>
            <span className="ss-cap" style={{ display: "block", flexShrink: "0", fontFamily: FONT.hand, fontSize: web ? (i ? "21px" : "26px") : "17px", lineHeight: "1.1", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {p.caption || '[caption]'}{p.place && (web || !i) ? <span style={{ opacity: ".75" }}>{`, ${p.place}`}</span> : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}
