import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { SITE } from './src/data/site.js';
import siteFiles from './build/siteFiles.js';

// Vite + React. The site's own address (data/site.js; env SITE_URL overrides it) fills %SITE_URL% in index.html,
// because link previews need absolute URLs; build/siteFiles.js writes the per-page HTML, sitemap and llms.txt.
const host = (process.env.SITE_URL || SITE.url).replace(/\/$/, '');

export default defineConfig({
  plugins: [react(), { name: 'site-url', transformIndexHtml: (html) => html.replaceAll('%SITE_URL%', host) }, siteFiles(host)],
});
