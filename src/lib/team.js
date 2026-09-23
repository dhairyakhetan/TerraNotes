import { useEffect, useRef, useState } from 'react';
import { MEMBERS, TEAMS, colorOf, teamsOf } from '../data/team.js';

// One dotted link per team through its members' faces, nearest face next, so people who work together are joined.
// spots[i] = where MEMBERS[i]'s face centre is ({ cx, cy }). bend = how much each link curves.
export function teamLinks(spots, bend = 24) {
  return Object.keys(TEAMS).map((team) => {
    const left = MEMBERS.map((m, i) => i).filter((i) => teamsOf(MEMBERS[i]).includes(team));
    if (left.length < 2) return { team, d: '' };
    left.sort((a, b) => spots[a].cx + spots[a].cy - spots[b].cx - spots[b].cy); // start top-left
    const path = [left.shift()];
    while (left.length) {
      const p = spots[path[path.length - 1]];
      left.sort((a, b) => Math.hypot(spots[a].cx - p.cx, spots[a].cy - p.cy) - Math.hypot(spots[b].cx - p.cx, spots[b].cy - p.cy));
      path.push(left.shift());
    }
    const d = path.slice(1).map((j, k) => {
      const a = spots[path[k]], b = spots[j];
      return `M${a.cx} ${a.cy} Q${(a.cx + b.cx) / 2 + bend} ${(a.cy + b.cy) / 2 + bend} ${b.cx} ${b.cy}`;
    }).join(' ');
    return { team, d };
  });
}

const HOLD = 35000; // someone in two teams wears each colour this long, then fades to the other

// Colour of each face's ring. People in two teams alternate slowly between their teams' colours;
// picking one of their teams in the legend switches them to it (quickly), clearing it eases them back.
export function useFaceColors(filter) {
  const [phase, setPhase] = useState(0);
  const mode = useRef('fast'); // what changed last: the timer (fade slowly) or the legend (switch quickly)
  const lastFilter = useRef(filter);
  if (lastFilter.current !== filter) { lastFilter.current = filter; mode.current = 'fast'; }
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => { mode.current = 'slow'; setPhase((p) => p + 1); }, HOLD);
    return () => clearInterval(t);
  }, []);
  const colorFor = (m) => {
    const ts = teamsOf(m);
    if (ts.length < 2) return colorOf(m);
    return TEAMS[ts.includes(filter) ? filter : ts[phase % ts.length]].color;
  };
  return { colorFor, fade: mode.current === 'slow' ? '3s' : '0.8s' };
}
