import { useSearchParams } from 'react-router';
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

// The yellow "★ featured" tape on a highlighted article's cards (featured: true in data/articles.js).
export function FeaturedTape({ style }) {
  return (
    <span className="tape-slap" style={{ position: "absolute", zIndex: "3", left: "-10px", top: "-12px", background: "#F7C21A", color: "#111111", border: "1.5px solid #111111", padding: "2px 10px", fontFamily: "'Space Mono', monospace", fontWeight: "700", fontSize: "10px", letterSpacing: "1.2px", textTransform: "uppercase", lineHeight: "1.6", transform: "rotate(-5deg)", whiteSpace: "nowrap", boxShadow: "2px 2px 0 #111111", pointerEvents: "none", ...style }}>★ featured</span>
  );
}
