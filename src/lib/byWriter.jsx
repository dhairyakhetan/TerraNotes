import { useSearchParams } from 'react-router';
import { ARTICLES } from '../data/articles.js';

// /articles?by=<name> (the "Their articles" button on a writer's profile): their pieces first, marked.
export function useByWriter() {
  const [q] = useSearchParams();
  const by = q.get('by') || '';
  const isMine = (a) => !!by && a.author === by;
  const mine = ARTICLES.filter(isMine);
  return { by, mine, isMine, list: by ? [...mine, ...ARTICLES.filter((a) => !isMine(a))] : ARTICLES };
}

// The yellow "by <name>" tape stuck on a writer's cards.
export function ByTape({ name, style }) {
  return (
    <span style={{ position: "absolute", zIndex: "3", right: "-8px", top: "-12px", background: "#F7C21A", color: "#111111", border: "1.5px solid #111111", padding: "2px 10px", fontFamily: "'Caveat', cursive", fontSize: "19px", lineHeight: "1.2", transform: "rotate(4deg)", whiteSpace: "nowrap", boxShadow: "2px 2px 0 #111111", pointerEvents: "none", ...style }}>{`by ${name.split(' ')[0]} ✦`}</span>
  );
}
