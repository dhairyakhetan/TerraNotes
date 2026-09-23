import { useEffect, useRef, useState } from 'react';
import { WORDS } from '../data/words.js';
import { pad2 } from './format.js';

const ROUNDS = 5;           // words per game, drawn at random from WORDS
const HINT_DELAY = 16000;   // ms a word sits unanswered (on screen) before the "psst." hint fades in

const shuffle = (xs) => {
  const a = xs.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
};
// a fresh set of rounds, avoiding the words from the game just played
const draw = (prev = []) => shuffle(WORDS.filter((w) => !prev.includes(w))).slice(0, ROUNDS);

// Font size that keeps a word inside its cloud (Archivo Black caps run ~0.66em wide).
export const fitWord = (word, max, width) => `${Math.min(max, Math.floor(width / (word.length * 0.66)))}px`;

// "Words we should bring back" game state, shared by the phone and web layouts.
// `section` = ref to the game's section: the hint clock only starts once it's on screen.
export function useWordsGame(section) {
  const [s, setS] = useState(() => ({ rounds: draw(), wq: 0, wpick: null, wscore: 0, wdone: false, hint: false }));
  const timer = useRef(0);
  const armHint = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setS((p) => ({ ...p, hint: true })), HINT_DELAY);
  };

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      armHint();
    }, { threshold: 0.4 });
    io.observe(section.current);
    return () => { io.disconnect(); clearTimeout(timer.current); };
  }, []);

  const { rounds, wq, wpick, wscore, wdone, hint } = s;
  const round = rounds[wq];
  const last = wq >= rounds.length - 1;
  const w = {
    total: pad2(rounds.length),
    n: pad2(wq + 1),
    score: pad2(wscore),
    word: round.word,
    playing: !wdone,
    done: wdone,
    locked: wpick != null,
    revealed: wpick != null,
    hint: round.hint,
    showHint: hint && wpick == null && !wdone,
    verdict: wpick == null ? '' : (wpick === round.answer ? 'Yes!' : 'Not quite.'),
    def: round.meaning,
    nextLabel: last ? 'Score' : 'Next word',
    next: () => {
      if (last) { setS({ ...s, wdone: true }); return; }
      setS({ ...s, wq: wq + 1, wpick: null, hint: false });
      armHint();
    },
    restart: () => {
      setS((p) => ({ rounds: draw(p.rounds), wq: 0, wpick: null, wscore: 0, wdone: false, hint: false }));
      armHint();
    },
    message: wscore === rounds.length ? 'all of them. you should be writing for us.' : (wscore === 0 ? 'zero. that\'s why we need to bring them back.' : 'not bad. now use one in a sentence today.'),
  };
  round.options.forEach((text, k) => {
    const right = k === round.answer, picked = k === wpick, shown = wpick != null;
    w['o' + k] = {
      text,
      mark: shown ? (right ? '✓' : (picked ? '✗' : String.fromCharCode(65 + k))) : String.fromCharCode(65 + k),
      bg: shown && right ? '#F7C21A' : (shown && picked ? '#111111' : '#FFFFFF'),
      fg: shown && picked && !right ? '#FFFFFF' : '#111111',
      op: shown && !right && !picked ? 0.45 : 1,
      pick: () => {
        if (wpick != null) return;
        clearTimeout(timer.current);
        setS({ ...s, wpick: k, wscore: wscore + (right ? 1 : 0) });
      },
    };
  });
  return w;
}
