import { useEffect, useRef, useState } from 'react';
import { Link } from '../../../router.jsx';
import { cardCover, TagPill } from '../../../shared/ArticleCard.jsx';
import { ByTape } from '../../../shared/Tapes.jsx';
import { articleLink } from '../../../data/editions.js';
import { flight } from '../../../lib/cardFlight.js';
import { calm } from '../../../lib/motion.js';
import { FONT } from '../../../styles/fonts.js';

// November's twist on the articles (home.jsx): every article is an akash prodip, a sky lantern, hanging from a wire on
// strings of different lengths. The lanterns are dark until they come into view, then light up one after another (the
// shade over the cover fades, a halo of lamp light grows behind it) and sway. Under each hangs a paper tag with its
// number, tag, title, dek and reading time; the whole lantern is the link to the article. Web: one row of up to five
// (more: two rows), each row on its own wire; phones: two a row. Reduced motion: lit from the start, still.
const DROPS = { web: [40, 120, 70, 150, 90, 30, 110], phone: [20, 80] };

function Lantern({ web, a, i, c, drop, mine, lit, width }) {
  const h = Math.round(width * 1.22);
  return (
    <Link to={articleLink(a)} {...flight(a)} className={`nv-lantern${lit ? ' is-lit' : ''}`} aria-label={`${String(i + 1).padStart(2, '0')}: ${a.title}`} style={{ display: "block", width: `${width}px`, margin: "0 auto", textDecoration: "none", color: "var(--ink)" }}>
      <div style={{ width: "2px", height: `${drop}px`, margin: "0 auto", background: "var(--h-accent)", opacity: ".55" }} />
      <div className="nv-sway-loop" style={{ "--d": `${i * 0.6}s`, transformOrigin: "50% 0", position: "relative" }}>
        <div className="nv-halo" aria-hidden="true" style={{ position: "absolute", left: "-45%", right: "-45%", top: "-20%", height: `${h * 1.5}px`, background: "radial-gradient(closest-side, var(--h-glow), transparent)", pointerEvents: "none" }} />
        <div aria-hidden="true" style={{ position: "relative", height: `${web ? 16 : 12}px`, margin: `0 ${width * 0.14}px`, background: `var(--h-lantern${c})`, clipPath: "polygon(18% 0, 82% 0, 100% 100%, 0 100%)" }} />
        <div className="nv-body" style={{ position: "relative", height: `${h}px`, borderRadius: `${web ? 12 : 9}px`, overflow: "hidden", border: `${web ? 4 : 3}px solid var(--h-lantern${c})`, background: "var(--h-sky)" }}>
          {a.cover && <img src={cardCover(a.cover)} alt="" loading="lazy" decoding="async" style={{ position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover" }} />}
          <div aria-hidden="true" style={{ position: "absolute", inset: "0", backgroundImage: "linear-gradient(90deg, transparent 0 31%, var(--h-page) 31% 33%, transparent 33% 67%, var(--h-page) 67% 69%, transparent 69%)", opacity: ".35" }} />
          <div className="nv-shade" aria-hidden="true" style={{ position: "absolute", inset: "0", background: "var(--h-page)" }} />
          <span style={{ position: "absolute", left: "8px", top: "8px", padding: "2px 6px", background: "var(--h-page)", color: "var(--h-accent)", fontFamily: FONT.mono, fontWeight: "700", fontSize: web ? "12px" : "10px", letterSpacing: "1px" }}>{String(i + 1).padStart(2, '0')}</span>
        </div>
        <div aria-hidden="true" style={{ position: "relative", height: `${web ? 16 : 12}px`, margin: `0 ${width * 0.14}px`, background: `var(--h-lantern${c})`, clipPath: "polygon(0 0, 100% 0, 82% 100%, 18% 100%)" }} />
        <div aria-hidden="true" style={{ width: "3px", height: `${web ? 26 : 18}px`, margin: "0 auto", background: `var(--h-lantern${c})` }} />
        <div className="nv-tag" style={{ position: "relative", marginTop: "-6px", padding: web ? "14px 14px 12px" : "10px 9px 9px", background: "var(--h-paper)", border: "2px solid var(--ink)", boxShadow: `4px 4px 0 var(--h-lantern${c})`, transform: `rotate(${i % 2 ? 1.6 : -1.4}deg)` }}>
          {mine && <div style={{ position: "absolute", right: "-8px", top: "-14px" }}><ByTape name={a.author} /></div>}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "6px" }}>
            <TagPill a={a} size={web ? "9.5px" : "8.5px"} pad="2px 7px" lh="1.3" fit />
            {a.featured && <span style={{ fontFamily: FONT.mono, fontSize: web ? "10px" : "8.5px", color: "var(--hand)" }}>★</span>}
          </div>
          <div style={{ marginTop: "8px", fontFamily: FONT.head, fontWeight: "800", fontSize: web ? "21px" : "16px", lineHeight: "1.08", textWrap: "balance" }}>{a.title}</div>
          <div style={{ marginTop: "6px", fontFamily: FONT.script, fontSize: web ? "15.5px" : "13px", lineHeight: "1.25", color: "var(--hand)", textWrap: "pretty" }}>{a.dek}</div>
          <div style={{ marginTop: "8px", fontFamily: FONT.mono, fontSize: web ? "10px" : "8.5px", letterSpacing: "1px", color: "var(--muted)" }}>{`${a.readTime} MIN · READ →`}</div>
        </div>
      </div>
    </Link>
  );
}

export default function Lanterns({ web, list, isMine }) {
  const ref = useRef(null), [lit, setLit] = useState(() => new Set());
  const n = list.length, cols = web ? (n <= 5 ? n : Math.ceil(n / 2)) : 2;
  const rows = Array.from({ length: Math.ceil(n / cols) }, (_, r) => list.slice(r * cols, r * cols + cols));
  const colW = (web ? 1200 : 350) / cols, width = web ? Math.min(196, colW - 44) : 138;
  useEffect(() => {
    const els = [...ref.current.querySelectorAll('[data-lamp]')];
    if (calm() || typeof IntersectionObserver === 'undefined') { setLit(new Set(els.map((e) => e.dataset.lamp))); return undefined; }
    const timers = [];
    const io = new IntersectionObserver((seen) => seen.forEach((e) => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      const k = e.target.dataset.lamp;
      timers.push(setTimeout(() => setLit((s) => new Set(s).add(k)), (Number(e.target.dataset.col) || 0) * 260));
    }), { threshold: 0.35 });
    els.forEach((e) => io.observe(e));
    return () => { io.disconnect(); timers.forEach(clearTimeout); };
  }, [n]);
  return (
    <div ref={ref}>
      {rows.map((row, r) => (
        <div key={r} style={{ position: "relative", marginTop: r ? (web ? "60px" : "34px") : "0" }}>
          <svg aria-hidden="true" width="100%" height={web ? 40 : 24} viewBox={`0 0 100 ${web ? 40 : 24}`} preserveAspectRatio="none" style={{ position: "absolute", left: "0", top: "0", overflow: "visible" }}>
            <path d={`M0 0 Q50 ${web ? 40 : 22} 100 0`} fill="none" stroke="var(--h-accent)" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
          </svg>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, alignItems: "start" }}>
            {row.map((a, k) => {
              const i = r * cols + k, sag = web ? 40 : 22, x = (k + 0.5) / cols, wireY = sag * 2 * x * (1 - x) * 2 / 2;
              const drops = DROPS[web ? 'web' : 'phone'];
              return (
                <div key={a.slug} data-lamp={a.slug} data-col={k} style={{ paddingTop: `${Math.round(wireY)}px` }}>
                  <Lantern web={web} a={a} i={i} c={(i % 5) + 1} drop={drops[i % drops.length]} mine={isMine(a)} lit={lit.has(a.slug)} width={width} />
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
