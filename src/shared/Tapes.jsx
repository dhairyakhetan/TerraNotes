import { FONT } from '../styles/fonts.js';
import { firstName } from '../lib/format.js';

// The bits stuck onto cards: the coloured clip a card hangs from, the yellow tapes, the "Latest" tag.

// The clip on a hanging card's top edge. Centred unless `left` (px) is given.
export const Clip = ({ color, w, h, top, left }) => (
  <div style={{ position: "absolute", left: left != null ? `${left}px` : "50%", top, marginLeft: left != null ? "0" : `-${w / 2}px`, width: `${w}px`, height: `${h}px`, background: color, border: "1.5px solid var(--ink)", boxSizing: "border-box", zIndex: "2" }} />
);

const TAPE = { position: "absolute", zIndex: "3", top: "-12px", background: "var(--yellow)", color: "var(--ink)", border: "1.5px solid var(--ink)", padding: "2px 10px", whiteSpace: "nowrap", boxShadow: "2px 2px 0 var(--ink)", pointerEvents: "none" };

// "by <first name> ✦": a writer's cards while their articles are listed first (/articles?by=…, lib/byWriter.js)
export const ByTape = ({ name }) => (
  <span className="tape-slap" style={{ ...TAPE, right: "-8px", fontFamily: FONT.hand, fontSize: "19px", lineHeight: "1.2", transform: "rotate(4deg)" }}>{`by ${firstName(name)} ✦`}</span>
);

// "★ featured": an article with featured: true (data/articles.js), on its cards and its cover
export const FeaturedTape = ({ style }) => (
  <span className="tape-slap" style={{ ...TAPE, left: "-10px", fontFamily: FONT.mono, fontWeight: "700", fontSize: "10px", letterSpacing: "1.2px", textTransform: "uppercase", lineHeight: "1.6", transform: "rotate(-5deg)", ...style }}>★ featured</span>
);

// "LATEST" next to the newest edition's name (edition picker, editions page)
export const LatestTag = ({ size = '9px' }) => (
  <span style={{ fontFamily: FONT.mono, fontWeight: "700", fontSize: size, letterSpacing: "1px", textTransform: "uppercase", background: "var(--yellow)", color: "var(--ink)", border: "1.5px solid var(--ink)", padding: "2px 6px", lineHeight: "1.2", whiteSpace: "nowrap" }}>Latest</span>
);

// "Draft · not live yet", fixed in a corner of every page of a draft edition (data/editions.js draft: true), so a
// preview is never mistaken for the live magazine
export const DraftTape = () => (
  <div role="note" style={{ ...TAPE, position: "fixed", top: "auto", left: "12px", bottom: "12px", zIndex: "90", fontFamily: FONT.mono, fontWeight: "700", fontSize: "11px", letterSpacing: "1.2px", textTransform: "uppercase", lineHeight: "1.6", transform: "rotate(-2deg)" }}>Draft · not live yet</div>
);
