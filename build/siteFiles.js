// Vite plugin (build only): after the app is bundled, writes the extra files a static host needs, all from src/data:
// - an .html per article at its address (articles/<slug>.html, older editions <id>/articles/<slug>.html; served
//   without .html via cleanUrls in vercel.json): its own title, description, link-preview tags (image: preview.jpg in
//   the article's folder, public/editions/<id>/articles/<slug>/, copied to a content-hashed name so chat apps don't
//   keep showing an old picture) and its text (build/staticCopy.js) for crawlers that don't run JavaScript;
// - photos.html, words.html, members.html, editions.html, articles.html, index.html with their own titles and text;
// - 404.html, robots.txt, sitemap.xml, llms.txt / llms-full.txt (the site and every article as plain text for AIs).
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { ALL_ARTICLES as ARTICLES } from '../src/data/articles.js';
import { articleFolder, articleLink } from '../src/data/editions.js';
import { SITE } from '../src/data/site.js';
import { articleHtml, pageHtml, withContent } from './staticCopy.js';

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

      for (const a of ARTICLES) {
        const desc = `${a.dek}${a.author ? ` — by ${a.author}` : ''}`;
        let html = setTitle(base, `Aquaterra — ${a.title}`);
        html = setMeta(html, 'name', 'description', desc);
        html = setMeta(html, 'property', 'og:type', 'article');
        html = setMeta(html, 'property', 'og:title', a.title);
        html = setMeta(html, 'property', 'og:description', desc);
        html = setMeta(html, 'property', 'og:url', url(articleLink(a)));
        let og = a.cover; // no preview picture made yet: the cover itself
        const made = `public${articleFolder(a)}/preview.jpg`;
        if (fs.existsSync(made)) {
          const buf = fs.readFileSync(made);
          og = `${articleFolder(a)}/preview-${crypto.createHash('md5').update(buf).digest('hex').slice(0, 8)}.jpg`;
          out(og.slice(1), buf);
        }
        if (og) {
          for (const [attr, name] of [['property', 'og:image'], ['property', 'og:image:secure_url'], ['name', 'twitter:image']]) html = setMeta(html, attr, name, url(og));
          if (og === a.cover) html = html.replace(/\s*<meta property="og:image:(width|height)"[^>]*>/g, ''); // a cover isn't 1200×630
          html = html.replace('<meta property="og:image:type"', `<meta property="og:image:alt" content="${esc(a.alt || a.title)}" />\n    <meta property="og:image:type"`);
        }
        html = html.replace('</title>', `</title>\n    <link rel="canonical" href="${esc(url(articleLink(a)))}" />`);
        out(`${articleLink(a).slice(1)}.html`, withContent(html, articleHtml(a)));
      }

      const TITLES = { '/': '', '/articles': 'All articles', '/photos': 'Photo wall', '/words': 'Words we should bring back', '/members': 'Meet the team', '/editions': 'Editions' };
      for (const [p, name] of Object.entries(TITLES)) {
        let html = name ? setMeta(setTitle(base, `Aquaterra — ${name}`), 'property', 'og:title', `${name} · TerraNotes`) : base;
        html = setMeta(html, 'property', 'og:url', url(p));
        out(p === '/' ? 'index.html' : `${p.slice(1)}.html`, withContent(html, pageHtml[p]()));
      }

      out('404.html', setTitle(base, 'Aquaterra — not found').replace('</title>', '</title>\n    <meta name="robots" content="noindex" />'));
      const paths = [...Object.keys(TITLES), ...ARTICLES.map(articleLink)];
      out('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map((p) => `  <url><loc>${url(p)}</loc></url>`).join('\n')}\n</urlset>\n`);
      out('robots.txt', ['# TerraNotes by Aquaterra: every page is open to crawlers.', '# A plain-text guide to the site and its articles, for AI assistants: /llms.txt (full text: /llms-full.txt)', 'User-agent: *', 'Allow: /', '', `Sitemap: ${url('/sitemap.xml')}`, ''].join('\n'));

      // llms.txt (llmstxt.org): what the site is and where everything is; llms-full.txt: every article in full
      const line = (a) => `${a.dek}${a.author ? ` (by ${a.author}` : ' ('}${a.date ? `${a.author ? ', ' : ''}${a.date}` : ''}, ${a.readTime} min read)`;
      const intro = ['# TerraNotes by Aquaterra', '', `> ${SITE.intro} Notes from where the land meets the water.`, '',
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
