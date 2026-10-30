import { withBase } from '../lib/base.js';

// TerraNotes comes out once a month; each edition is its own folder, src/editions/<id>/ (its look, articles, photo
// wall, words and team), so every edition keeps its own look and content for good (see CLAUDE.md "New edition").
// Newest last. The newest one that isn't a draft is the "latest" (or the one marked home: true): the home page (/)
// shows it and its articles have clean links (/articles/<slug>). Every other edition lives under its id, made from its month ('September 2026' →
// 'sep26'): its home page is /sep26 (also /sep26/photos…) and its articles /sep26/articles/<slug>. That happens by
// itself the moment a newer edition goes live (old clean links redirect). Its files live in public/editions/<id>/.
//   theme: the issue's name, shown on /editions (pages/EditionsPage.jsx)
//   home:  true = this one is the home page even though newer ones are live (they live under their ids, like older
//          ones). Delete it to let the newest take the home page again.
//   draft: true = still being made: not the latest, not listed anywhere (edition picker, /editions, sitemap), but
//          viewable at its own address (/oct26) with a "draft" tape. Delete the flag to put it live.
//   live:  'YYYY-MM-DD HH:MM' (or just 'YYYY-MM-DD': midnight), India time = when it goes live by itself, e.g.
//          '2026-10-31 20:00'. Until then it's a draft, as above (the edition before it stays the home page), its tape
//          saying when it goes live; so a finished edition can be pushed early. Each reader's page checks the time
//          when it loads, and .github/workflows/go-live.yml rebuilds the site within the hour (link previews,
//          sitemap, the home page's title).

const EDITION_LIST = [
  { number: 1, month: 'September 2026', theme: 'Exam season' },
  { number: 2, month: 'October 2026', theme: 'Pujo & Diwali', live: '2026-10-31 20:00' },
];

// an edition's `live` moment (India time, UTC+5:30) as a time; an edition without one is live already
export const liveAt = (e) => {
  if (!e.live) return 0;
  const [day, time = '00:00'] = e.live.trim().split(/[ T]+/);
  const t = Date.parse(`${day}T${time}:00+05:30`);
  if (Number.isNaN(t)) throw new Error(`data/editions.js: ${e.month} has live: '${e.live}', which isn't 'YYYY-MM-DD HH:MM'`);
  return t;
};
// an edition whose day hasn't come is a draft until it does (`until`: the day, for its tape)
export const EDITIONS = EDITION_LIST.map((e) => (liveAt(e) > Date.now() ? { ...e, draft: true, until: e.live } : e));

export const PUBLISHED = EDITIONS.filter((e) => !e.draft);
export const LATEST = (PUBLISHED.find((e) => e.home) || PUBLISHED[PUBLISHED.length - 1]).number;
export const editionOf = (n) => EDITIONS.find((e) => e.number === n);
export const isDraft = (n) => !!editionOf(n)?.draft;
export const editionName = (n) => `Edition ${String(n).padStart(2, '0')}`;
// the main page's title (tab, search results, link previews): it names the issue that's on it
export const homeHeadline = () => `TerraNotes · ${PUBLISHED.find((e) => e.number === LATEST).month} issue · Aquaterra`;
export const editionId = (n) => { const [m, y] = editionOf(n).month.split(' '); return m.slice(0, 3).toLowerCase() + y.slice(2); };
export const editionById = (id) => EDITIONS.find((e) => editionId(e.number) === id);
export const editionLink = (n) => (n === LATEST ? '/' : `/${editionId(n)}`);
// an edition's home page opened at a section ('articles', 'photos', 'words', 'members'): /photos, /sep26/photos
export const homeLink = (n, section) => (n === LATEST ? `/${section || ''}` : `/${editionId(n)}${section ? `/${section}` : ''}`);
export const articleLink = (a) => `${a.edition === LATEST ? '' : `/${editionId(a.edition)}`}/articles/${a.slug}`;
// an article's folder of files (cover.jpg, cover-card.webp, its photos): public/editions/<id>/articles/<slug>/, as a URL
// (inside AQ's website under its /terranotes: lib/base.js)
export const articleFolder = (a) => withBase(`/editions/${editionId(a.edition)}/articles/${a.slug}`);
// the link-preview pictures (1200×630, made by tools/make-link-previews.mjs), all kept together in public/og/: the main
// page's (home.jpg), each edition's (sep26.jpg) and each article's (sep26-labs.jpg), as URLs (inside AQ: under /terranotes)
export const ogImage = {
  home: () => withBase('/og/home.jpg'),
  edition: (n) => withBase(`/og/${editionId(n)}.jpg`),
  article: (a) => withBase(`/og/${editionId(a.edition)}-${a.slug}.jpg`),
  games: (n) => withBase(`/og/${editionId(n)}-games.jpg`), // an edition's /games: Buddy's three games on its paper
  game: (id, n) => withBase(`/og/${editionId(n)}-game-${id}.jpg`), // its /games/snake, /games/float, /games/fling
};
