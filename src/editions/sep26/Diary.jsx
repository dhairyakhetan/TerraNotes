import { useEffect, useRef, useState } from 'react';
import { FONT } from '../../styles/fonts.js';

// September 2026's diary, under "Meet the team" (src/editions/pages.js TEAM_NOTE; shared/TeamSection.jsx places it:
// web under the legend, phone beside it). Like Tom Riddle's diary: stay on the section a while and a line writes
// itself out in a neat copperplate script (the look's script font), letter by letter, sits a moment, then sinks back
// into the page; another comes a little later, picked at random. Only while it's on screen: scrolling away wipes it
// and holds the clock. Reduced motion: lines appear and go without the writing. Fun only, so hidden from screen readers.
const LINES = [
  'Hello. Who are you?',
  'ayo wtf',
  "you've been here a while…",
  "stop scrolling, i'm talking",
  'psst. tap the ghost up top',
  'exam in 3 days and you’re here?',
  'i remember every face on this page',
  'this page is haunted, btw',
  'nice of you to stay',
  'bro. study.',
  'who let you in here',
  'do not tell the heads i said that',
  'the ink remembers.',
  'ok fine, you can stay',
];
const FIRST = 6000, GAP = [7000, 14000], HOLD = 3200, SINK = 1600, PER = 70; // ms; PER: one letter's stroke

export default function Diary({ style, size }) {
  const box = useRef(null);
  const [line, setLine] = useState(null); // { text, k, out }
  useEffect(() => {
    const el = box.current;
    let timer = 0, phase = 'wait', left = FIRST, since = 0, last = -1, k = 0;
    const gap = () => GAP[0] + Math.random() * (GAP[1] - GAP[0]);
    const wait = () => { phase = 'wait'; since = Date.now(); timer = setTimeout(write, left); };
    const write = () => {
      let i; do i = Math.floor(Math.random() * LINES.length); while (i === last); last = i;
      phase = 'show'; setLine({ text: LINES[i], k: k++, out: false });
      timer = setTimeout(() => {
        setLine((l) => l && { ...l, out: true });
        timer = setTimeout(() => { setLine(null); left = gap(); wait(); }, SINK);
      }, LINES[i].length * PER + 500 + HOLD);
    };
    const io = new IntersectionObserver(([e]) => {
      clearTimeout(timer);
      if (e.isIntersecting) { wait(); return; }
      if (phase === 'wait') left = Math.max(0, left - (Date.now() - since)); // the clock holds while it's away
      else { setLine(null); left = gap(); phase = 'wait'; }
    }, { threshold: 0.6 });
    io.observe(el);
    return () => { io.disconnect(); clearTimeout(timer); };
  }, []);
  return (
    <div ref={box} aria-hidden="true" style={{ position: "absolute", minHeight: `${Math.round(size * 2.6)}px`, fontFamily: FONT.script, fontSize: `${size}px`, lineHeight: "1.25", color: "var(--ink)", pointerEvents: "none", ...style }}>
      {line && (
        <span key={line.k} className={line.out ? 'diary-line diary-sink' : 'diary-line'}>
          {[...line.text].map((ch, i) => <span key={i} className="diary-ch" style={{ animationDelay: `${i * PER}ms` }}>{ch}</span>)}
        </span>
      )}
    </div>
  );
}
