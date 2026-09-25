import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { ALL_ARTICLES as ARTICLES } from './src/data/articles.js'; // every edition's
import { SITE } from './src/data/site.js';
import { articleHtml, pageHtml, withContent } from './build/static-html.js';

// Link previews (WhatsApp, Instagram, iMessage…) need absolute URLs: the site's address from data/site.js
// (SITE_URL in the environment overrides it).
const host = (process.env.SITE_URL || SITE.url).replace(/\/$/, '');

const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const setMeta = (html, attr, name, value) => html.replace(new RegExp(`(<meta ${attr}="${name}" content=")[^"]*(")`), `$1${esc(value)}$2`);

// At build: one page per article (articles/<slug>.html, served at /articles/<slug>) so shared links preview that
// article's own title and line; plus sitemap.xml, robots.txt, and llms.txt / llms-full.txt (the site and its
// articles as plain text, for AI assistants). The app itself is the same on every page.
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
      // link preview: its wide card from tools/make-og.mjs (public/og/<slug>.jpg, 1200x630); else the cover itself
      // (?v=<content hash>: a changed picture gets a new address, so WhatsApp & co. don't keep showing the old one)
      const ogFile = `public/og/${a.slug}.jpg`;
      const og = fs.existsSync(ogFile) ? `/og/${a.slug}.jpg?v=${crypto.createHash('md5').update(fs.readFileSync(ogFile)).digest('hex').slice(0, 8)}` : a.cover;
      if (og) {
        html = setMeta(html, 'property', 'og:image', host + og);
        html = setMeta(html, 'name', 'twitter:image', host + og);
        if (og === a.cover) { html = html.replace(/\s*<meta property="og:image:width"[^>]*>/, '').replace(/\s*<meta property="og:image:height"[^>]*>/, ''); } // its real size isn't 1200x630
        html = html.replace('<meta property="og:image:height"', `<meta property="og:image:alt" content="${esc(a.alt || a.title)}" />\n    <meta property="og:image:height"`);
      }
      html = html.replace('</title>', `</title>\n    <link rel="canonical" href="${esc(url)}" />`);
      out(`articles/${a.slug}.html`, withContent(html, articleHtml(a))); // readable without JavaScript too
    }
    // the other pages, each with its own title and its content in the HTML (served at /photos etc. by cleanUrls)
    const TITLES = { '/': '', '/articles': 'All articles', '/photos': 'Photo wall', '/words': 'Words we should bring back', '/members': 'Meet the team', '/editions': 'Editions' };
    for (const [p, name] of Object.entries(TITLES)) {
      let html = name ? base.replace(/<title>[^<]*<\/title>/, `<title>${esc(`Aquaterra — ${name}`)}</title>`) : base;
      if (name) html = setMeta(html, 'property', 'og:title', `${name} · TerraNotes`);
      html = setMeta(html, 'property', 'og:url', `${host}${p}`);
      out(p === '/' ? 'index.html' : `${p.slice(1)}.html`, withContent(html, pageHtml[p]()));
    }
    const paths = ['/', '/articles', '/photos', '/words', '/members', '/editions', ...ARTICLES.map((a) => `/articles/${a.slug}`)];
    if (host) {
      const urls = paths.map((p) => `  <url><loc>${host}${p}</loc></url>`).join('\n');
      out('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
    }
    // backstop: if a path ever misses the rewrite, the host's 404 is the app too (it shows the lost page)
    let lost = base.replace(/<title>[^<]*<\/title>/, '<title>Aquaterra — not found</title>');
    lost = lost.replace('</title>', '</title>\n    <meta name="robots" content="noindex" />');
    out('404.html', lost);
    out('robots.txt', [
      '# TerraNotes by Aquaterra: every page is open to crawlers.',
      '# A plain-text guide to the site and its articles, for AI assistants: /llms.txt (full text: /llms-full.txt)',
      'User-agent: *',
      'Allow: /',
      ...(host ? ['', `Sitemap: ${host}/sitemap.xml`] : []),
      '',
    ].join('\n'));

    // llms.txt (llmstxt.org): what the site is and where everything is; llms-full.txt: every article in full
    const url = (p) => `${host}${p}`;
    const line = (a) => `${a.dek}${a.author ? ` (by ${a.author}` : ' ('}${a.date ? `${a.author ? ', ' : ''}${a.date}` : ''}, ${a.readTime} min read)`;
    const intro = [
      '# TerraNotes by Aquaterra',
      '',
      `> ${SITE.intro} Notes from where the land meets the water.`,
      '',
      'TerraNotes is the digital magazine of Aquaterra, a community in Kolkata (est. 2021). It comes out once a month and is written, photographed and designed by its members. Each article has its own page; the home page also holds the photo wall, a words mini game and the team.',
      '',
    ];
    const list = ARTICLES.map((a) => `- [${a.title}](${url(`/articles/${a.slug}`)}): ${line(a)}`);
    out('llms.txt', [
      ...intro,
      '## Articles',
      '',
      ...list,
      '',
      '## Pages',
      '',
      `- [Home](${url('/')}): the latest articles, photo wall, words game and team`,
      `- [All articles](${url('/articles')}): every article; add ?by=<first name> for one writer's pieces first (e.g. ?by=diti)`,
      `- [Photo wall](${url('/photos')}): photos from the community, with captions`,
      `- [Words we should bring back](${url('/words')}): a mini game about forgotten words`,
      `- [Meet the team](${url('/members')}): the heads, design, writing and tech teams`,
      `- [Editions](${url('/editions')}): every monthly edition; the latest is on the home page`,
      '',
      '## Optional',
      '',
      `- [Full text of every article](${url('/llms-full.txt')})`,
      ...(host ? [`- [Sitemap](${url('/sitemap.xml')})`] : []),
      '',
    ].join('\n'));
    const full = ARTICLES.map((a) => [
      `## ${a.title}`,
      '',
      `${url(`/articles/${a.slug}`)} · ${a.tag} · ${line(a)}`,
      '',
      ...a.body.flatMap((b) => (typeof b === 'string' ? [b, ''] : b.h2 ? [`### ${b.h2}`, ''] : [])),
    ].join('\n'));
    out('llms-full.txt', [...intro, ...full].join('\n'));
  },
});

export default defineConfig({
  plugins: [react(), { name: 'site-url', transformIndexHtml: (html) => html.replaceAll('%SITE_URL%', host) }, pages()],
});
