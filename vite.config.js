import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { LATEST, PUBLISHED, editionName, homeHeadline } from './src/data/editions.js';
import { SITE } from './src/data/site.js';
import { editionData } from './src/editions/index.js';
import siteFiles from './build/siteFiles.js';

// Vite + React. The site's own address (data/site.js; env SITE_URL overrides it) fills %SITE_URL% in index.html,
// because link previews need absolute URLs; build/siteFiles.js writes the per-page HTML, sitemap and llms.txt.
// The latest edition's look (src/editions/<id>/look.js) fills %LOOK% (its colours and fonts as CSS variables, so the
// page is drawn in them before the app starts; then lib/edition.js puts on the look of the page's own edition),
// %THEME_COLOR% (the browser bar) and %LOOK_FONTS% (its extra fonts stylesheet, if any); %HOME_TITLE% / %HOME_DESC% the
// main page's title and description, naming the current issue.
const host = (process.env.SITE_URL || SITE.url).replace(/\/$/, '');
const look = editionData(LATEST).look;
const vars = [...Object.entries(look.colors).map(([k, v]) => `--${k}:${v}`), ...Object.entries(look.fonts).map(([k, v]) => `--font-${k}:${v}`)].join(';');
// the main page's title and description name the current issue (the per-page copies, build/siteFiles.js, start from these)
const latest = PUBLISHED.find((e) => e.number === LATEST), attr = (t) => t.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
const homeDesc = `${editionData(LATEST).intro} ${editionName(LATEST)} · ${latest.month} · TerraNotes by Aquaterra, notes from where the land meets the water.`;
const fill = (html) => html.replaceAll('%SITE_URL%', host).replaceAll('%HOME_TITLE%', attr(homeHeadline())).replaceAll('%HOME_DESC%', attr(homeDesc)).replace('%LOOK%', `:root{${vars}}`).replace('%THEME_COLOR%', look.colors.page)
  .replace('%LOOK_FONTS%', look.fontsCss ? `<link href="${look.fontsCss}" rel="stylesheet" />` : '');

export default defineConfig({
  plugins: [react(), { name: 'site-url', transformIndexHtml: { order: 'pre', handler: fill } }, siteFiles(host)],
});
