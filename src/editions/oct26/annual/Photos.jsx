import { useRef } from 'react';
import { useEdition } from '../../../lib/edition.js';
import { useReveal } from '../../../lib/reveal.js';
import { PhotoIcon } from '../../../shared/Icons.jsx';
import { FONT } from '../../../styles/fonts.js';
import { Folio, Head, pagesOf } from './parts.jsx';

// The annual's photo page (AnnualHome.jsx): the edition's photo wall (photos.js) printed like a magazine's picture
// page: the first photo big, the rest in a grid beside it (phones: under it, two across), each in a white mat with a
// "Fig. 1" caption under it in italics. A photo still to come shows its tint and "[photo]" (the placeholder). Tapping
// one opens the photo viewer at it (shared/PhotoViewer.jsx, opened by AnnualHome). Element id "photos" (/photos).
function Print({ web, p, i, big, onOpen }) {
  const h = big ? (web ? 470 : 250) : web ? 186 : 120;
  return (
    <figure style={{ margin: "0", transform: `rotate(${big ? -0.6 : [0.8, -1, 0.6, -0.7][i % 4]}deg)` }}>
      <button type="button" className="press btn an-print" onClick={() => onOpen(i)} aria-label={`Open photo ${i + 1}${p.caption ? `: ${p.caption}` : ''}`} style={{ "--c": "var(--ink)", display: "block", width: "100%", padding: web ? (big ? "12px" : "8px") : "6px", background: "var(--card)", border: "2px solid var(--ink)", boxShadow: `${big ? 8 : 5}px ${big ? 8 : 5}px 0 var(--ink)`, cursor: "pointer" }}>
        <div style={{ position: "relative", height: `${h}px`, background: p.tint, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {p.photo
            ? <img src={p.photo} alt={p.caption} loading={big ? 'eager' : 'lazy'} decoding="async" style={{ position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover" }} />
            : <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", fontFamily: FONT.mono, fontSize: "11px", color: "var(--wallInk)" }}><PhotoIcon size={20} color="var(--wallInk)" />[photo]</span>}
        </div>
      </button>
      <figcaption style={{ marginTop: big ? "12px" : "8px", fontFamily: FONT.serif, fontStyle: "italic", fontSize: web ? (big ? "22px" : "17px") : "15px", lineHeight: "1.2", color: "var(--ink)" }}>
        <span style={{ fontFamily: FONT.mono, fontStyle: "normal", fontSize: web ? "11px" : "9.5px", letterSpacing: "1.2px", color: "var(--red)" }}>{`FIG. ${i + 1}  `}</span>
        {p.caption || '[caption]'}{p.place ? `, ${p.place}` : ''}
      </figcaption>
    </figure>
  );
}

export default function Photos({ web, onOpen }) {
  const ref = useRef(null), { photos, articles } = useEdition(), P = pagesOf(articles.length);
  useReveal(ref);
  const [first, ...rest] = photos;
  return (
    <section ref={ref} id="photos" aria-label="Photographs" style={{ marginTop: web ? "110px" : "64px" }}>
      <Folio web={web} page={P.photos} label="photographs" />
      <Head web={web} kicker="CHHOBI · PICTURES" title="Photographs" aside="pujo, in pictures. tap one to see it big" />
      {first && (
        <div style={{ display: "grid", gridTemplateColumns: web ? "1.25fr 1fr" : "1fr", gap: web ? "44px" : "26px", alignItems: "start" }}>
          <Print web={web} p={first} i={0} big onOpen={onOpen} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: web ? "28px 30px" : "20px 16px" }}>
            {rest.map((p, k) => <Print key={k} web={web} p={p} i={k + 1} onOpen={onOpen} />)}
          </div>
        </div>
      )}
    </section>
  );
}
