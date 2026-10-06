import { useRef } from 'react';
import { Link } from '../../../router.jsx';
import ImageSlot from '../../../shared/ImageSlot.jsx';
import { cardCover, TagPill } from '../../../shared/ArticleCard.jsx';
import { ByTape, FeaturedTape } from '../../../shared/Tapes.jsx';
import { tagOf } from '../../../data/articles.js';
import { articleLink } from '../../../data/editions.js';
import { flight } from '../../../lib/cardFlight.js';
import { useByWriter } from '../../../lib/byWriter.js';
import { useReveal } from '../../../lib/reveal.js';
import { usePauseOffscreen } from '../../../lib/pauseOffscreen.js';
import { pad2 } from '../../../lib/format.js';
import { FONT } from '../../../styles/fonts.js';

// The articles on October's pandal home page (PandalHome.jsx): a route of pandals to hop between. Each article is a
// pandal, a roof in its tag's colour over a card with its cover, "STOP 01", tag, title and dek, standing on a dotted
// road that winds from the gate past every stop to a last, dashed "next pandal: coming soon". Web: three to a row,
// the road snaking left to right then back; phone: one at a time, left and right of a road down the page. The
// section grows with the articles (mapHeight). Tapping a pandal opens its article (its cover flies out of the card:
// lib/cardFlight.js, then the curtain parts: Curtain.jsx). ?by=<writer> puts their pieces first, taped.
const M = {
  web: { title: { left: 80, top: 40 }, tSize: "76px", cols: [270, 720, 1170], first: 210, rowH: 610, w: 330, roof: 100, img: 188, tName: "25px", dek: "21px", wobble: 40, out: 230, road: 30, mark: 24, start: [96, 196] },
  phone: { title: { left: 20, top: 24 }, tSize: "42px", first: 170, rowH: 480, xs: [18, 102], w: 270, roof: 80, img: 140, tName: "21px", dek: "18px", out: 0, road: 22, mark: 18, start: [36, 132] },
};
export const mapHeight = (n, web) => (web ? M.web.first + Math.ceil((n + 1) / 3) * M.web.rowH + 20 : M.phone.first + (n + 1) * M.phone.rowH + 10);

// where each stop's pandal stands (its left / top in the section) and the point on the road under it
function spots(count, web) {
  const L = M[web ? 'web' : 'phone'];
  return Array.from({ length: count }, (_, i) => {
    if (web) {
      const row = Math.floor(i / 3), col = row % 2 ? 2 - (i % 3) : i % 3, cx = L.cols[col];
      const top = L.first + row * L.rowH + (col === 1 ? L.wobble : 0);
      return { left: cx - L.w / 2, top, x: cx, y: top + L.roof + 440, row };
    }
    const left = L.xs[i % 2], top = L.first + i * L.rowH;
    return { left, top, x: left + L.w / 2, y: top + L.roof + 340, row: i };
  });
}

// the road through every point: gentle sags along a row, a wide bend out to the side between rows
function road(points, web) {
  const L = M[web ? 'web' : 'phone'];
  let d = `M${points[0][0]} ${points[0][1]}`;
  for (let i = 1; i < points.length; i++) {
    const [px, py] = points[i - 1], [qx, qy] = points[i];
    if (!web) { d += ` C${px} ${py + 70} ${qx} ${qy - 120} ${qx} ${qy}`; continue; }
    if (i === 1) { d += ` C${px} ${py + 260} ${qx - 260} ${qy} ${qx} ${qy}`; continue; } // from the start, down and across to the first stop
    if (Math.abs(qy - py) < 120) d += ` Q${(px + qx) / 2} ${Math.max(py, qy) + 60} ${qx} ${qy}`;
    else { const o = qx > 720 ? L.out : -L.out; d += ` C${px + o} ${py + 40} ${qx + o} ${qy - 80} ${qx} ${qy}`; }
  }
  return d;
}

// a pandal's roof: a base band, two tiers, a spire with a little flag, bulbs along the edges and a marigold fringe
function Roof({ w, h, color, dashed }) {
  const s = dashed ? { fill: "none", stroke: "var(--muted)", strokeWidth: "2", strokeDasharray: "6 6" } : null;
  const ink = (fill) => s || { fill, stroke: "var(--ink)", strokeWidth: "2.2", strokeLinejoin: "round" };
  const band = h * 0.22, base = h - band, beads = [];
  for (let x = 12; x < w - 6; x += 18) beads.push(x);
  return (
    <svg width={w} height={h + 10} viewBox={`0 0 ${w} ${h + 10}`} aria-hidden="true" style={{ display: "block", overflow: "visible" }}>
      <polygon points={`4,${base} ${w / 2},${h * 0.12} ${w - 4},${base}`} style={ink(color)} />
      <polygon points={`${w * 0.2},${base} ${w / 2},${h * 0.42} ${w * 0.8},${base}`} style={ink("var(--yellow)")} />
      <path d={`M${w / 2} ${h * 0.12} V0`} style={s || { stroke: "var(--ink)", strokeWidth: "2.2" }} />
      {!dashed && <path d={`M${w / 2} 0 l18 5 l-18 5 Z`} style={ink("var(--green)")} />}
      <rect x="0" y={base} width={w} height={band} style={ink(color)} />
      {!dashed && beads.map((x, i) => <circle key={x} cx={x} cy={h + 1} r="6" style={{ fill: i % 3 === 1 ? "var(--red)" : "var(--yellow)", stroke: "var(--ink)", strokeWidth: "1.2" }} />)}
      {!dashed && [0.25, 0.5, 0.75].map((k) => <circle key={k} cx={4 + (w / 2 - 4) * k} cy={base - (base - h * 0.12) * k - 4} r="3.6" style={{ fill: "var(--bulb)", stroke: "var(--ink)", strokeWidth: "1" }} />)}
      {!dashed && [0.25, 0.5, 0.75].map((k) => <circle key={`r${k}`} cx={w - 4 - (w / 2 - 4) * k} cy={base - (base - h * 0.12) * k - 4} r="3.6" style={{ fill: "var(--bulb)", stroke: "var(--ink)", strokeWidth: "1" }} />)}
    </svg>
  );
}

function Stop({ a, i, at, web, mine }) {
  const L = M[web ? 'web' : 'phone'], ref = useRef(null), color = tagOf(a).color;
  useReveal(ref, web ? (i % 3) * 110 : 0);
  return (
    <div ref={ref} style={{ position: "absolute", left: `${at.left}px`, top: `${at.top}px`, width: `${L.w}px` }}>
      <Link to={articleLink(a)} {...flight(a)} className="press btn" aria-label={`Stop ${i + 1}: ${a.title}`} style={{ "--c": color, position: "relative", display: "block", textDecoration: "none", color: "var(--ink)", transform: `rotate(${i % 2 ? 0.8 : -0.8}deg)` }}>
        <Roof w={L.w} h={L.roof} color={color} />
        <article style={{ position: "relative", marginTop: "-4px", boxSizing: "border-box", background: "var(--card)", border: "2px solid var(--ink)", boxShadow: `${web ? 8 : 6}px ${web ? 8 : 6}px 0 ${a.featured ? "var(--yellow)" : color}`, padding: web ? "12px" : "10px", display: "flex", flexDirection: "column", gap: web ? "10px" : "8px" }}>
          {mine && <ByTape name={a.author} />}
          {a.featured && <FeaturedTape />}
          <ImageSlot src={cardCover(a.cover)} fallback={a.cover} alt={a.alt} first={i < 6} box={{ height: `${L.img}px` }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
            <span style={{ fontFamily: FONT.mono, fontWeight: "700", fontSize: web ? "11px" : "10px", letterSpacing: "1.4px" }}>{`STOP ${pad2(i + 1)}`}</span>
            <TagPill a={a} size={web ? "10px" : "9px"} pad="3px 9px" lh="1.3" fit />
          </div>
          <h3 style={{ margin: "0", fontFamily: FONT.head, fontWeight: "400", fontSize: L.tName, lineHeight: "calc(1.08 * var(--head-lead, 1))", textTransform: "uppercase", display: "-webkit-box", WebkitLineClamp: "3", WebkitBoxOrient: "vertical", overflow: "hidden" }}>{a.title}</h3>
          <p style={{ margin: "0", fontFamily: FONT.hand, fontSize: L.dek, lineHeight: "1.05", color: "var(--dek)", display: "-webkit-box", WebkitLineClamp: "2", WebkitBoxOrient: "vertical", overflow: "hidden" }}>{a.dek}</p>
          <span style={{ fontFamily: FONT.mono, fontSize: web ? "10.5px" : "9.5px", letterSpacing: "1.2px", color: "var(--muted)", textTransform: "uppercase" }}>{`${a.readTime ? `${a.readTime} min read · ` : ''}step inside →`}</span>
        </article>
      </Link>
    </div>
  );
}

// the last stop: a pandal still being built
function Soon({ at, web }) {
  const L = M[web ? 'web' : 'phone'];
  return (
    <div aria-label="More stops coming soon" style={{ position: "absolute", left: `${at.left}px`, top: `${at.top}px`, width: `${L.w}px`, transform: "rotate(1deg)" }}>
      <Roof w={L.w} h={L.roof} dashed />
      <div style={{ marginTop: "-4px", boxSizing: "border-box", height: web ? "380px" : "290px", border: "2px dashed var(--muted)", background: "var(--blank)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", padding: "20px", textAlign: "center" }}>
        <span style={{ fontFamily: FONT.mono, fontSize: web ? "12px" : "10.5px", letterSpacing: "1.4px", color: "var(--slotInk)" }}>[NEXT PANDAL: COMING SOON]</span>
        <span style={{ fontFamily: FONT.hand, fontSize: web ? "24px" : "20px", lineHeight: "1.1", color: "var(--hand)" }}>more stops as the writers file them</span>
      </div>
    </div>
  );
}

export default function PandalMap({ web, top }) {
  const L = M[web ? 'web' : 'phone'], { by, isMine, list } = useByWriter();
  const at = spots(list.length + 1, web), self = useRef(null);
  usePauseOffscreen(self);
  const marks = at.map((s) => [s.x, s.y]);
  const w = web ? 1440 : 390, h = mapHeight(list.length, web);
  return (
    <section ref={self} id="articles" aria-label="Pandal hopping: the articles" style={{ position: "absolute", left: "0", top: `${top}px`, width: `${w}px`, height: `${h}px` }}>
      <h2 style={{ position: "absolute", left: `${L.title.left}px`, top: `${L.title.top}px`, margin: "0", fontFamily: FONT.head, fontWeight: "400", fontSize: L.tSize, lineHeight: "1", textTransform: "uppercase", color: "var(--ink)" }}>Pandal hopping</h2>
      <div style={{ position: "absolute", left: `${L.title.left + (web ? 4 : 2)}px`, top: `${L.title.top + (web ? 92 : 52)}px`, fontFamily: FONT.mono, fontSize: web ? "12px" : "10px", letterSpacing: "1.6px", color: "var(--ink)" }}>{`THE ROUTE · ${list.length} ${list.length === 1 ? 'STOP' : 'STOPS'}${by ? ` · ${by.toUpperCase()}'S FIRST` : ''}`}</div>
      <div style={{ position: "absolute", left: web ? "800px" : "168px", top: web ? "60px" : "100px", width: web ? "360px" : "200px", fontFamily: FONT.hand, fontSize: web ? "28px" : "19px", lineHeight: "1.05", color: "var(--hand)", transform: "rotate(-3deg)" }}>every pandal is a piece. follow the road ↓</div>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true" style={{ position: "absolute", left: "0", top: "0", pointerEvents: "none", overflow: "visible" }}>
        <path d={road([L.start, ...marks], web)} style={{ fill: "none", stroke: "var(--outside)", strokeWidth: L.road, strokeLinecap: "round" }} />
        <path d={road([L.start, ...marks], web)} style={{ fill: "none", stroke: "var(--ink)", strokeWidth: "2.4", strokeDasharray: "1 12", strokeLinecap: "round" }} />
        {/* where you start: the gate */}
        <circle cx={L.start[0]} cy={L.start[1]} r={L.mark * 0.7} style={{ fill: "var(--red)", stroke: "var(--ink)", strokeWidth: "2" }} />
        {marks.map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={L.mark} style={{ fill: i < list.length ? "var(--yellow)" : "var(--card)", stroke: i < list.length ? "var(--ink)" : "var(--muted)", strokeWidth: "2", strokeDasharray: i < list.length ? undefined : "4 4" }} />
            <text x={x} y={y + L.mark * 0.36} textAnchor="middle" style={{ fontFamily: FONT.mono, fontWeight: "700", fontSize: `${L.mark * 0.95}px`, fill: "var(--ink)" }}>{i < list.length ? i + 1 : '…'}</text>
          </g>
        ))}
      </svg>
      <div style={{ position: "absolute", left: `${L.start[0] + (web ? 26 : 18)}px`, top: `${L.start[1] - (web ? 12 : 10)}px`, fontFamily: FONT.hand, fontSize: web ? "22px" : "17px", color: "var(--hand)", whiteSpace: "nowrap" }}>you’re here</div>
      {list.map((a, i) => <Stop key={a.slug} a={a} i={i} at={at[i]} web={web} mine={isMine(a)} />)}
      <Soon at={at[list.length]} web={web} />
    </section>
  );
}
