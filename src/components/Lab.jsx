import { pad2 } from '../lib/format.js';

// AQ Labs pieces, shared by the phone (components/home/Labs.jsx) and web (web/WebLabs.jsx) sections.

// Little line drawings, one per project (drawn in the card band's ink colour).
const ICONS = {
  film: <><rect x="3" y="7" width="13" height="11" rx="2" /><path d="M16 11 L21 8 V17 L16 14" /><circle cx="7.5" cy="12.5" r="1.6" /></>,
  compass: <><circle cx="12" cy="12" r="9" /><path d="M15.5 8.5 L13.2 13.2 L8.5 15.5 L10.8 10.8 Z" /></>,
  gamepad: <><rect x="2.5" y="7" width="19" height="11" rx="4" /><path d="M7 10.5 V14.5 M5 12.5 H9" /><circle cx="15.5" cy="11.5" r="0.9" /><circle cx="17.8" cy="13.8" r="0.9" /></>,
  tree: <><path d="M12 21 V14" /><path d="M12 3 L6 11 H9 L5 16 H19 L15 11 H18 Z" /></>,
  loop: <><path d="M20 12 A8 8 0 0 1 6.3 17.7" /><path d="M4 12 A8 8 0 0 1 17.7 6.3" /><path d="M17.7 2.8 V6.3 H14.2" /><path d="M6.3 21.2 V17.7 H9.8" /></>,
  badge: <><path d="M12 3 L19 6 V11.5 C19 16 15.8 19.4 12 21 C8.2 19.4 5 16 5 11.5 V6 Z" /><path d="M8.8 12.2 L11.2 14.6 L15.4 9.8" /></>,
  light: <><circle cx="12" cy="12" r="4" /><path d="M12 2.5 V5 M12 19 V21.5 M2.5 12 H5 M19 12 H21.5 M5.3 5.3 L7 7 M17 17 L18.7 18.7 M5.3 18.7 L7 17 M17 7 L18.7 5.3" /></>,
  cards: <><rect x="7" y="3.5" width="12" height="15" rx="2" transform="rotate(8 13 11)" /><rect x="4.5" y="5.5" width="12" height="15" rx="2" /></>,
};
export const LabIcon = ({ name, size = 28, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ICONS[name]}</svg>
);

// One project, pinned up like a tag: coloured band with its drawing and number, then its name, kind and what it is.
// z = sizes: { w, band, name, what, icon }
export function LabCard({ p, i, z, tilt = 0, style }) {
  return (
    <article className="lab-card" style={{ position: "relative", width: `${z.w}px`, boxSizing: "border-box", background: "#FFFFFF", border: "2px solid #111111", boxShadow: `6px 6px 0 ${p.color}`, transform: `rotate(${tilt}deg)`, ...style }}>
      <span aria-hidden="true" style={{ position: "absolute", left: "50%", top: "-8px", width: "14px", height: "14px", marginLeft: "-7px", borderRadius: "50%", background: "#111111", border: "2px solid #F3EEE4", zIndex: "2" }} />
      <div style={{ height: `${z.band}px`, background: p.color, borderBottom: "2px solid #111111", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px" }}>
        <LabIcon name={p.icon} size={z.icon} color={p.ink} />
        <span style={{ fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "11px", letterSpacing: "1px", color: p.ink }}>{pad2(i + 1)}</span>
      </div>
      <div style={{ padding: "10px 12px 13px" }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "9.5px", letterSpacing: "1.3px", textTransform: "uppercase", color: "#6B665C" }}>{p.kind}</div>
        <h3 style={{ margin: "4px 0 0", fontFamily: "'Archivo Black', Impact, sans-serif", fontWeight: "400", fontSize: `${z.name}px`, lineHeight: "1", color: "#111111" }}>{p.name}</h3>
        <p style={{ margin: "7px 0 0", fontSize: `${z.what}px`, lineHeight: "1.4", color: "#1E2723" }}>{p.what}</p>
      </div>
    </article>
  );
}
