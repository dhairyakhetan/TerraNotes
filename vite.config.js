import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';
import { ARTICLES } from './src/data/articles.js';

// Link previews need absolute URLs. On Vercel this is the production domain; locally it stays relative.
const host = process.env.SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) || '';

const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const setMeta = (html, attr, name, value) => html.replace(new RegExp(`(<meta ${attr}="${name}" content=")[^"]*(")`), `$1${esc(value)}$2`);

// At build: one page per article (articles/<slug>.html, served at /articles/<slug>) so shared links preview that
// article's own title and line; plus sitemap.xml and robots.txt. The app itself is the same on every page.
const pages = () => ({
  name: 'article-pages',
  apply: 'build',
  writeBundle({ dir }) {
    const out = (name, text) => { fs.mkdirSync(path.dirname(path.join(dir, name)), { recursive: true }); fs.writeFileSync(path.join(dir, name), text); };
    const base = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
    for (const a of ARTICLES) {
      const url = `${host}/articles/${a.slug}`;
      const desc = `${a.dek}${a.author ? ` — by ${a.author}` : ''}`;
      let html = base.replace(/<title>[^<]*<\/title>/, `<title>${esc(`Aquaterra — ${a.title}`)}</title>`);
      html = setMeta(html, 'name', 'description', desc);
      html = setMeta(html, 'property', 'og:type', 'article');
      html = setMeta(html, 'property', 'og:title', a.title);
      html = setMeta(html, 'property', 'og:description', desc);
      html = setMeta(html, 'property', 'og:url', url);
      if (a.cover) { html = setMeta(html, 'property', 'og:image', host + a.cover); html = setMeta(html, 'name', 'twitter:image', host + a.cover); }
      html = html.replace('</title>', `</title>\n    <link rel="canonical" href="${esc(url)}" />`);
      out(`articles/${a.slug}.html`, html);
    }
    const paths = ['/', '/articles', ...ARTICLES.map((a) => `/articles/${a.slug}`)];
    if (host) {
      const urls = paths.map((p) => `  <url><loc>${host}${p}</loc></url>`).join('\n');
      out('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
    }
    // backstop: if a path ever misses the rewrite, the host's 404 is the app too (it shows the lost page)
    let lost = base.replace(/<title>[^<]*<\/title>/, '<title>Aquaterra — not found</title>');
    lost = lost.replace('</title>', '</title>\n    <meta name="robots" content="noindex" />');
    out('404.html', lost);
    out('robots.txt', `User-agent: *\nAllow: /\n${host ? `Sitemap: ${host}/sitemap.xml\n` : ''}`);
  },
});

export default defineConfig({
  plugins: [react(), { name: 'site-url', transformIndexHtml: (html) => html.replaceAll('%SITE_URL%', host) }, pages()],
});
