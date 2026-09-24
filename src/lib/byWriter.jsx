import { Link, useSearchParams } from 'react-router';
import { ARTICLES } from '../data/articles.js';
import { MEMBERS } from '../data/team.js';

const firstOf = (name) => name.split(' ')[0].toLowerCase();
// "Their articles" link for a writer: /articles?by=<first name>, e.g. /articles?by=diti
export const byLink = (name) => `/articles?by=${firstOf(name)}`;

// /articles?by=<first name> (the "Their articles" button on a writer's profile): their pieces first, marked.
// A full name (?by=Diti Shah) works too. `by` comes back as the full name.
export function useByWriter() {
  const [q] = useSearchParams();
  const key = (q.get('by') || '').trim().toLowerCase();
  const by = (key && [...MEMBERS.map((m) => m.name), ...ARTICLES.map((a) => a.author)].find((n) => n && (firstOf(n) === key || n.toLowerCase() === key))) || '';
  const isMine = (a) => !!by && a.author === by;
  const mine = ARTICLES.filter(isMine);
  return { by, mine, isMine, list: by ? [...mine, ...ARTICLES.filter((a) => !isMine(a))] : ARTICLES };
}

// The yellow "by <name>" tape stuck on a writer's cards.
export function ByTape({ name, style }) {
  return (
    <span className="tape-slap" style={{ position: "absolute", zIndex: "3", right: "-8px", top: "-12px", background: "#F7C21A", color: "#111111", border: "1.5px solid #111111", padding: "2px 10px", fontFamily: "'Caveat', cursive", fontSize: "19px", lineHeight: "1.2", transform: "rotate(4deg)", whiteSpace: "nowrap", boxShadow: "2px 2px 0 #111111", pointerEvents: "none", ...style }}>{`by ${name.split(' ')[0]} ✦`}</span>
  );
}

export const articlesBy = (name) => ARTICLES.filter((a) => a.author === name);

// Shown over a writer's profile card when "Their articles" is tapped but nothing of theirs is up yet.
export function NoArticlesYet({ name, leaving, onOk, onAll }) {
  const first = name.split(' ')[0];
  const btn = { minHeight: "44px", padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #111111", fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", textDecoration: "none", cursor: "pointer" };
  return (
    <div className={`no-cascade ${leaving ? 'fade-out' : 'fade-in'}`} style={{ position: "absolute", inset: "0", zIndex: "5", display: "flex", alignItems: "center", justifyContent: "center", padding: "18px", background: "rgba(243,238,228,.9)" }}>
      <div className={leaving ? undefined : 'note-swing'} role="alertdialog" aria-label={`${first} has no articles yet`} style={{ width: "100%", boxSizing: "border-box", background: "#FFFFFF", border: "2px solid #111111", boxShadow: "6px 6px 0 #F7C21A", padding: "18px", transform: "rotate(-1.5deg)" }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "10px", letterSpacing: "1.4px" }}>NOTHING ON THE LINE YET</div>
        <div style={{ margin: "8px 0 14px", fontFamily: "'Caveat', cursive", fontSize: "24px", lineHeight: "1.1", color: "#5B3A1E" }}>{`${first} hasn't hung up any articles yet. check back soon!`}</div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button className="press btn" onClick={onOk} autoFocus style={{ ...btn, background: "#111111", color: "#FFFFFF" }}>OK</button>
          <Link className="press btn" to="/articles" onClick={onAll} style={{ ...btn, flexGrow: "1", background: "#FFFFFF", color: "#111111" }}>View all articles</Link>
        </div>
      </div>
    </div>
  );
}
