import { useRef } from 'react';
import BoardTeams from '../../../shared/Board.jsx';
import { useEdition } from '../../../lib/edition.js';
import { useReveal } from '../../../lib/reveal.js';
import { Folio, Head, pagesOf } from './parts.jsx';

// The annual's editorial board (AnnualHome.jsx): the team printed as a magazine's credits page (shared/Board.jsx), under
// its folio and heading. Element id "members" (/members).
export default function Board({ web }) {
  const { members, articles } = useEdition(), P = pagesOf(articles.length), ref = useRef(null);
  useReveal(ref);
  return (
    <section ref={ref} id="members" aria-label="Editorial board" style={{ marginTop: web ? "110px" : "64px" }}>
      <Folio web={web} page={P.board} label="editorial board" />
      <Head web={web} kicker={`SAMPADAKMANDALI · ${members.length} OF US`} title="Editorial board" aside="the people who made this issue. tap anyone" />
      <BoardTeams web={web} />
    </section>
  );
}
