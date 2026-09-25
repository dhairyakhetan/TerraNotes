import React from 'react';
import { createRoot } from 'react-dom/client';
import { unstable_HistoryRouter as HistoryRouter } from 'react-router';
import { createAnimatedHistory } from './lib/pageTransition.js';
import App from './App.jsx';
import Intro from './components/Intro.jsx';
import { introWanted } from './lib/intro.js';
import { sayHello } from './lib/hello.js';
import './styles/global.css';
import './styles/home.css';
import './styles/articles.css';
import './styles/article.css';
import './styles/footer.css';
import './web/web.css';
import './styles/motion.css';

sayHello();
const intro = introWanted(); // decided before anything draws (and before the router reads the address)
const history = createAnimatedHistory(); // page changes animate (lib/pageTransition.js)

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* useTransitions off: the page swap has to render at once, inside the view transition */}
    <HistoryRouter history={history} useTransitions={false}>
      <App />
      {intro && <Intro />}
    </HistoryRouter>
  </React.StrictMode>
);
