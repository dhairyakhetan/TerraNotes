import { useState } from 'react';
import { SITE } from '../data/site.js';
import { instagramUrl } from '../lib/format.js';
import { withBase } from '../lib/base.js';
import { track } from '../lib/analytics.js';
import { Clip } from './Tapes.jsx';
import { FONT } from '../styles/fonts.js';

// The end of an article page (both layouts, under the "words by" box): pass it on, and hear about the next issue.
// - Share: the phone's own share sheet (navigator.share); where there is none, the link is copied instead.
// - WhatsApp: a message with the title and the link, ready to send.
// - Follow: the WhatsApp channel (SITE.whatsapp, shown only once it is set), Instagram, and the RSS feed (/feed.xml,
//   written at build: build/siteFiles.js).
// The link is the page's own address, so inside AQ's website it shares AQ's.
const MONO = { fontFamily: FONT.mono, fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase" };

export default function PassItOn({ a, web }) {
  const [copied, setCopied] = useState(false);
  const link = () => `${location.origin}${location.pathname}`;
  const share = async () => {
    const url = link();
    if (navigator.share) {
      try { await navigator.share({ title: a.title, text: a.dek, url }); track('Shared', { article: a.slug, method: 'share sheet' }); } catch { /* closed: fine */ }
      return;
    }
    try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2200); track('Shared', { article: a.slug, method: 'copy link' }); } catch { /* no clipboard: fine */ }
  };
  const btn = { "--c": "var(--ink)", ...MONO, fontSize: web ? "12px" : "11px", minHeight: "44px", padding: "0 16px", display: "inline-flex", alignItems: "center", gap: "8px", border: "2px solid var(--ink)", textDecoration: "none", cursor: "pointer", boxSizing: "border-box" };
  const follow = [
    SITE.whatsapp && ['WhatsApp channel', SITE.whatsapp, 'whatsapp'],
    SITE.instagram && ['Instagram', instagramUrl(SITE.instagram), 'instagram'],
    ['RSS feed', withBase('/feed.xml'), 'rss'],
  ].filter(Boolean);
  return (
    <section aria-label="Share this piece" style={{ position: "relative", ...(web ? { marginTop: "26px" } : { margin: "26px 0 0 -4px", width: "350px" }), boxSizing: "border-box", background: "var(--card)", border: "2px solid var(--ink)", boxShadow: `${web ? 7 : 6}px ${web ? 7 : 6}px 0 var(--yellow)`, padding: web ? "24px 22px 20px" : "20px 16px 16px", transform: "rotate(0.5deg)" }}>
      <Clip color="var(--red)" w={30} h={9} top="-6px" />
      <div style={{ display: "flex", alignItems: "baseline", flexWrap: "wrap", columnGap: "12px", rowGap: "2px" }}>
        <h2 style={{ margin: "0", fontFamily: FONT.head, fontWeight: "400", fontSize: web ? "26px" : "22px", lineHeight: "1", textTransform: "uppercase", color: "var(--ink)", whiteSpace: "nowrap" }}>Pass it on</h2>
        <span style={{ fontFamily: FONT.hand, fontSize: web ? "22px" : "19px", color: "var(--hand)", whiteSpace: "nowrap" }}>someone you know needs this one</span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: web ? "16px" : "14px" }}>
        <button type="button" className="press btn" onClick={share} style={{ ...btn, background: "var(--ink)", color: "var(--card)", boxShadow: "4px 4px 0 var(--yellow)", "--c": "var(--yellow)" }}>{copied ? 'Link copied ✓' : 'Share ↗'}</button>
        <a className="press btn" href={`https://wa.me/?text=${encodeURIComponent(`${a.title} — ${typeof location === 'undefined' ? '' : link()}`)}`} target="_blank" rel="noreferrer" onClick={() => track('Shared', { article: a.slug, method: 'whatsapp' })} style={{ ...btn, background: "var(--card)", color: "var(--ink)", boxShadow: "4px 4px 0 var(--ink)" }}>WhatsApp ↗</a>
      </div>
      <div style={{ marginTop: web ? "20px" : "18px", paddingTop: web ? "14px" : "12px", borderTop: "1.5px dashed var(--ink)" }}>
        <div style={{ ...MONO, fontWeight: "400", fontSize: web ? "11px" : "10px", letterSpacing: "1.4px", color: "var(--muted)" }}>A new issue every month · follow along</div>
        <div style={{ display: "flex", flexWrap: "wrap", columnGap: "18px", rowGap: "0", marginTop: "4px" }}>
          {follow.map(([label, href, channel]) => (
            <a key={channel} href={href} {...(channel === 'rss' ? {} : { target: "_blank", rel: "noreferrer" })} onClick={() => track('Follow', { channel })} style={{ display: "inline-flex", alignItems: "center", minHeight: "44px", fontFamily: FONT.hand, fontSize: web ? "22px" : "20px", color: "var(--hand)", textDecoration: "underline", textUnderlineOffset: "3px" }}>{channel === 'rss' ? label : `${label} ↗`}</a>
          ))}
        </div>
      </div>
    </section>
  );
}
