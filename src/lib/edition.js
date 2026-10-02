import { createContext, useContext } from 'react';
import { LATEST, editionName } from '../data/editions.js';
import { editionData } from '../editions/index.js';

// The edition the page on screen belongs to (App.jsx picks it from the address, lib/routes.js editionAt): its look,
// articles, photo wall, words and team (src/editions/index.js). Components read it with useEdition().
export const EditionContext = createContext(editionData(LATEST));
export const useEdition = () => useContext(EditionContext);

// Puts an edition's look (src/editions/<id>/look.js) on the page as CSS variables: --<colour> (var(--ink)) and
// --font-<name> (var(--font-head)), on <html> so popups placed in <body> get them too; also <html data-edition="sep26">
// for an edition's own CSS to hang off. Loads the look's extra fonts stylesheet once, and sets the browser bar colour
// to its page colour.
export function applyLook({ id, look }, el = document.documentElement) {
  el.dataset.edition = id;
  for (const [k, v] of Object.entries(look.colors)) el.style.setProperty(`--${k}`, v);
  for (const [k, v] of Object.entries(look.fonts)) el.style.setProperty(`--font-${k}`, v);
  if (look.fontsCss && !document.querySelector(`link[href="${look.fontsCss}"]`)) {
    document.head.append(Object.assign(document.createElement('link'), { rel: 'stylesheet', href: look.fontsCss }));
  }
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', look.colors.page);
}


// A home page's tab title: the latest edition's is plain "Aquaterra"
export const homeTitle = (e) => (e.number === LATEST ? 'Aquaterra' : `Aquaterra — ${editionName(e.number)} · ${e.month}`);
