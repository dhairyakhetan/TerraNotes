import React from 'react';
import { createRoot } from 'react-dom/client';
import { unstable_HistoryRouter as HistoryRouter } from 'react-router';
import App from './App.jsx';
import IntroNotebook from './shared/IntroNotebook.jsx';
import { createAnimatedHistory } from './lib/animatedHistory.js';
import { introWanted } from './lib/introNotebook.js';
import { sayHello } from './lib/consoleHello.js';
import { LITE } from './lib/motion.js';
import './styles/base.css';
import './styles/loops.css';
import './styles/motion.css';
import './styles/phone.css';
import './styles/web.css';
import './styles/footer.css';
import './styles/intro.css';
import './styles/buddy.css';
import './articles/labs/labs.css'; // last: its scoped rules must win over web.css's generic ones

// Entry point (index.html loads it). Starts the React app inside a router whose history animates page changes
// (lib/animatedHistory.js; useTransitions off: the page swap must render at once, inside the transition), plays the
// opening notebook when it's due, marks low-end devices (<html class="lite">, lib/motion.js), and prints the
// console hello.
sayHello();
if (LITE) document.documentElement.classList.add('lite');
const intro = introWanted(); // decided before anything draws (and before the router reads the address)

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HistoryRouter history={createAnimatedHistory()} useTransitions={false}>
      <App />
      {intro && <IntroNotebook />}
    </HistoryRouter>
  </React.StrictMode>
);
