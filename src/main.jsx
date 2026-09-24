import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
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

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      {intro && <Intro />}
    </BrowserRouter>
  </React.StrictMode>
);
