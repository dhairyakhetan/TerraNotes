import React from 'react';
import { watchStaleCode } from './lib/freshCode.js';
import { createRoot } from 'react-dom/client';
import { unstable_HistoryRouter as HistoryRouter } from 'react-router';
import App, { loadLabs } from './App.jsx';
import IntroNotebook from './shared/IntroNotebook.jsx';
import { createAnimatedHistory } from './lib/animatedHistory.js';
import { introWanted } from './lib/introNotebook.js';
import { sayHello } from './lib/consoleHello.js';
import { LITE } from './lib/motion.js';
import { AQ_LOOK } from './host.js';
import './styles/base.css';
import './styles/loops.css';
import './styles/motion.css';
import './styles/phone.css';
import './styles/web.css';
import './styles/intro.css';
import './styles/buddy.css';

// Entry point (index.html loads it). Starts the React app inside a router whose history animates page changes
// (lib/animatedHistory.js; useTransitions off: the page swap must render at once, inside the transition), plays the
// opening notebook when it's due, marks low-end devices (<html class="tn-lite">, lib/motion.js), and prints the
// console hello.
sayHello();
watchStaleCode(); // after a deploy, a stale page reloads once instead of half-working (lib/freshCode.js)
if (LITE) document.documentElement.classList.add('tn-lite');
if (AQ_LOOK) document.documentElement.dataset.tnAq = ''; // AQ's look (src/host.js): the CSS keys on html[data-tn-aq]
const intro = introWanted(); // decided before anything draws (and before the router reads the address)

createRoot(document.getElementById('root')).render( // the own site's page: embed-ok
  <React.StrictMode>
    <HistoryRouter history={createAnimatedHistory()} useTransitions={false}>
      <App />
      {intro && <IntroNotebook />}
    </HistoryRouter>
  </React.StrictMode>
);
// fetch AQ Labs' page code once the first page is up, so opening it from a card doesn't wait on it
setTimeout(() => loadLabs().catch(() => {}), 2000);
