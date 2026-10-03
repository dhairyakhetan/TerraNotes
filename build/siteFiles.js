// Vite plugin (build only): after the app is bundled, writes the extra files a static host needs, all from src/data and
// src/editions (drafts are left out: their pages only exist in the app, at their own address):
// - an .html per article at its address (articles/<slug>.html, older editions <id>/articles/<slug>.html; also one per
//   chapter and demo of an own-page article, <article>/<chapter>.html and <article>/<chapter>/demo.html; served
//   without .html via cleanUrls in vercel.json): its own title, description, link-preview tags and its text
//   (build/staticCopy.js) for crawlers that don't run JavaScript;
// - every page's link-preview picture from public/og/ (src/data/editions.js ogImage: the main page's on / and
//   /editions, an edition's on its home page and sections, an article's on the article), copied to a content-hashed
//   name so chat apps don't keep showing an old picture;
// - index.html, articles.html, photos.html, words.html, members.html (the latest edition's home page and its sections),
//   the same for each older edition under its id (sep26.html, sep26/photos.html…), and editions.html, with their own
//   titles and text;
// - 404.html, robots.txt, sitemap.xml, feed.xml (RSS), llms.txt / llms-full.txt (the site and every article as plain text for AIs).
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { ALL_ARTICLES } from '../src/data/articles.js';
import { LATEST, PUBLISHED, articleLink, editionName, homeLink, isDraft, ogImage } from '../src/data/editions.js';
import { SITE } from '../src/data/site.js';
import { editionData } from '../src/editions/index.js';
import { articleHtml, editionsHtml, homeHtml, withContent } from './staticCopy.js';

const ARTICLES = ALL_ARTICLES.filter((a) => !isDraft(a.edition));

const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const setMeta = (html, attr, name, value) => html.replace(new RegExp(`(<meta ${attr}="${name}" content=")[^"]*(")`), `$1${esc(value)}$2`);
const setTitle = (html, title) => html.replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`);

export default function siteFiles(host) {
  return {
    name: 'site-files',
    apply: 'build',
    writeBundle({ dir }) {
      const out = (name, text) => { fs.mkdirSync(path.dirname(path.join(dir, name)), { recursive: true }); fs.writeFileSync(path.join(dir, name), text); };
      const base = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
      const url = (p) => `${host}${p}`;
      // a link-preview picture (a URL under public/) copied to a content-hashed name; null when it hasn't been made
      const hashed = new Map();
      const og = (p) => {
        if (!hashed.has(p)) {
          const file = `public${p}`;
          if (!fs.existsSync(file)) hashed.set(p, null);
          else { const buf = fs.readFileSync(file), name = p.replace(/\.jpg$/, `-${crypto.createHash('md5').update(buf).digest('hex').slice(0, 8)}.jpg`); out(name.slice(1), buf); hashed.set(p, name); }
        }
        return hashed.get(p);
      };
      const withImage = (html, p, alt) => {
        let h = html;
        for (const [attr, name] of [['property', 'og:image'], ['property', 'og:image:secure_url'], ['name', 'twitter:image']]) h = setMeta(h, attr, name, url(p));
        return alt ? h.replace('<meta property="og:image:type"', `<meta property="og:image:alt" content="${esc(alt)}" />\n    <meta property="og:image:type"`) : h;
      };
      const home = og(ogImage.home()), withHome = (html) => (home ? withImage(html, home, 'TerraNotes by Aquaterra') : html);

      for (const a of ARTICLES) {
        const desc = `${a.dek}${a.author ? ` — by ${a.author}` : ''}`;
        let html = setTitle(base, `Aquaterra — ${a.title}`);
        html = setMeta(html, 'name', 'description', desc);
        html = setMeta(html, 'property', 'og:type', 'article');
        html = setMeta(html, 'property', 'og:title', a.title);
        html = setMeta(html, 'property', 'og:description', desc);
        html = setMeta(html, 'property', 'og:url', url(articleLink(a)));
        const pic = og(ogImage.article(a)) || a.cover; // no preview picture made yet: the cover itself
        if (pic) {
          html = withImage(html, pic, a.alt || a.title);
          if (pic === a.cover) html = html.replace(/\s*<meta property="og:image:(width|height)"[^>]*>/g, ''); // a cover isn't 1200×630
        }
        html = html.replace('</title>', `</title>\n    <link rel="canonical" href="${esc(url(articleLink(a)))}" />`);
        out(`${articleLink(a).slice(1)}.html`, withContent(html, articleHtml(a)));
        // its chapters (<article>/<id>) share its page; a demo (<article>/<chapter>/demo) gets its own title
        for (const c of a.chapters || []) out(`${articleLink(a).slice(1)}/${c}.html`, withContent(setMeta(html, 'property', 'og:url', url(`${articleLink(a)}/${c}`)), articleHtml(a)));
        for (const c of Object.keys(a.demos || {})) {
          const name = `${c.replace(/-/g, ' ').replace(/\b\w/g, (x) => x.toUpperCase())} · demo`;
          out(`${articleLink(a).slice(1)}/${c}/demo.html`, setMeta(setMeta(setTitle(html, name), 'property', 'og:title', name), 'property', 'og:url', url(`${articleLink(a)}/${c}/demo`)));
        }
      }

      // each edition's home page and its sections (an older edition's: under its id, its edition in the title)
      const TITLES = { '': '', articles: 'All articles', photos: 'Photo wall', words: 'Words we should bring back', members: 'Meet the team' };
      const pages = [];
      for (const e of [...PUBLISHED].reverse()) { // newest first
        const old = e.number !== LATEST && `${editionName(e.number)} · ${e.month}`;
        for (const [section, name] of Object.entries(TITLES)) {
          const p = homeLink(e.number, section), title = [name, old].filter(Boolean).join(' · ');
          let html = title ? setMeta(setTitle(base, `Aquaterra — ${title}`), 'property', 'og:title', `${title} · TerraNotes`) : base;
          html = setMeta(html, 'property', 'og:url', url(p));
          // the main page shows the magazine; an edition's other pages show that edition
          const pic = p === '/' ? null : og(ogImage.edition(e.number));
          html = pic ? withImage(html, pic, `TerraNotes ${editionName(e.number)} · ${e.month}`) : withHome(html);
          out(p === '/' ? 'index.html' : `${p.slice(1)}.html`, withContent(html, homeHtml[section](editionData(e.number))));
          if (e.number === LATEST || !section) pages.push(p); // the sitemap: the latest's sections, an older edition's home
        }
      }
      out('editions.html', withContent(withHome(setMeta(setMeta(setTitle(base, 'Aquaterra — Editions'), 'property', 'og:title', 'Editions · TerraNotes'), 'property', 'og:url', url('/editions'))), editionsHtml()));

      out('404.html', setTitle(withHome(base), 'Aquaterra — not found').replace('</title>', '</title>\n    <meta name="robots" content="noindex" />'));
      const paths = [...pages, '/editions', ...ARTICLES.map(articleLink)];
      out('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map((p) => `  <url><loc>${url(p)}</loc></url>`).join('\n')}\n</urlset>\n`);
      // feed.xml: an RSS feed of every published article, newest issue first, so readers (and apps) hear of a new one
      const monthOf = (n) => PUBLISHED.find((e) => e.number === n)?.month;
      const items = [...ARTICLES].sort((x, y) => y.edition - x.edition).map((a) => {
        const when = new Date(`1 ${monthOf(a.edition)} 00:00 UTC`);
        return ['    <item>', `      <title>${esc(a.title)}</title>`, `      <link>${url(articleLink(a))}</link>`, `      <guid isPermaLink="true">${url(articleLink(a))}</guid>`,
          `      <description>${esc(a.dek)}</description>`, a.author ? `      <dc:creator>${esc(a.author)}</dc:creator>` : null, `      <category>${esc(a.tag)}</category>`,
          Number.isNaN(when.getTime()) ? null : `      <pubDate>${when.toUTCString()}</pubDate>`, '    </item>'].filter(Boolean).join('\n');
      });
      out('feed.xml', ['<?xml version="1.0" encoding="UTF-8"?>', '<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">', '  <channel>',
        '    <title>TerraNotes by Aquaterra</title>', `    <link>${url('/')}</link>`, `    <atom:link href="${url('/feed.xml')}" rel="self" type="application/rss+xml" />`,
        '    <description>Aquaterra\'s monthly magazine: notes from where the land meets the water.</description>', '    <language>en</language>', ...items, '  </channel>', '</rss>', ''].join('\n'));
      out('robots.txt', ['# TerraNotes by Aquaterra: every page is open to crawlers.', '# A plain-text guide to the site and its articles, for AI assistants: /llms.txt (full text: /llms-full.txt)', 'User-agent: *', 'Allow: /', '', `Sitemap: ${url('/sitemap.xml')}`, ''].join('\n'));

      // llms.txt (llmstxt.org): what the site is and where everything is; llms-full.txt: every article in full
      const line = (a) => `${a.dek}${a.author ? ` (by ${a.author}` : ' ('}${a.date ? `${a.author ? ', ' : ''}${a.date}` : ''}, ${a.readTime} min read)`;
      const intro = ['# TerraNotes by Aquaterra', '', `> ${editionData(LATEST).intro} Notes from where the land meets the water.`, '',
        `TerraNotes is the monthly digital magazine of Aquaterra (${SITE.footerNote}; main site: ${SITE.website}). It is written, photographed and designed by its members. Each article has its own page; the home page also holds the photo wall, a words mini game and the team.`, ''];
      out('llms.txt', [...intro, '## Articles', '', ...ARTICLES.map((a) => `- [${a.title}](${url(articleLink(a))}): ${line(a)}`), '', '## Pages', '',
        `- [Home](${url('/')}): the latest articles, photo wall, words game and team`,
        `- [All articles](${url('/articles')}): every article; add ?by=<first name> for one writer's pieces first (e.g. ?by=diti)`,
        `- [Photo wall](${url('/photos')}): photos from the community, with captions`,
        `- [Words we should bring back](${url('/words')}): a mini game about forgotten words`,
        `- [Meet the team](${url('/members')}): the heads, design, writing and tech teams`,
        `- [Editions](${url('/editions')}): every monthly edition; the latest is on the home page`,
        '', '## Optional', '', `- [Full text of every article](${url('/llms-full.txt')})`, `- [Sitemap](${url('/sitemap.xml')})`, ''].join('\n'));
      const text = (b) => (typeof b === 'string' ? [b, ''] : b.h2 ? [`### ${b.h2}`, ''] : b.projects ? [...b.projects.map((x) => `- ${x.name}: ${x.what} (${x.meta})`), ''] : []);
      out('llms-full.txt', [...intro, ...ARTICLES.map((a) => [`## ${a.title}`, '', `${url(articleLink(a))} · ${a.tag} · ${line(a)}`, '', ...a.body.flatMap(text)].join('\n'))].join('\n'));
    },
  };
}
