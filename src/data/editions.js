// TerraNotes comes out once a month; each edition is its own folder, src/editions/<id>/ (its look, articles, photo
// wall, words and team), so every edition keeps its own look and content for good (see CLAUDE.md "New edition").
// Newest last. The newest one that isn't a draft is the "latest": the home page (/) shows it and its articles have
// clean links (/articles/<slug>). Every other edition lives under its id, made from its month ('September 2026' →
// 'sep26'): its home page is /sep26 (also /sep26/photos…) and its articles /sep26/articles/<slug>. That happens by
// itself the moment a newer edition goes live (old clean links redirect). Its files live in public/editions/<id>/.
//   draft: true = still being made: not the latest, not listed anywhere (edition picker, /editions, sitemap), but
//          viewable at its own address (/oct26) with a "draft" tape. Delete the flag to put it live.
export const EDITIONS = [
  { number: 1, month: 'September 2026' },
  { number: 2, month: 'October 2026', draft: true },
];

export const PUBLISHED = EDITIONS.filter((e) => !e.draft);
export const LATEST = PUBLISHED[PUBLISHED.length - 1].number;
export const editionOf = (n) => EDITIONS.find((e) => e.number === n);
export const isDraft = (n) => !!editionOf(n)?.draft;
export const editionName = (n) => `Edition ${String(n).padStart(2, '0')}`;
export const editionId = (n) => { const [m, y] = editionOf(n).month.split(' '); return m.slice(0, 3).toLowerCase() + y.slice(2); };
export const editionById = (id) => EDITIONS.find((e) => editionId(e.number) === id);
export const editionLink = (n) => (n === LATEST ? '/' : `/${editionId(n)}`);
// an edition's home page opened at a section ('articles', 'photos', 'words', 'members'): /photos, /sep26/photos
export const homeLink = (n, section) => (n === LATEST ? `/${section || ''}` : `/${editionId(n)}${section ? `/${section}` : ''}`);
export const articleLink = (a) => `${a.edition === LATEST ? '' : `/${editionId(a.edition)}`}/articles/${a.slug}`;
// an article's folder of files (cover.jpg, preview.jpg, its photos): public/editions/<id>/articles/<slug>/
export const articleFolder = (a) => `/editions/${editionId(a.edition)}/articles/${a.slug}`;
// the month a new edition is due, for the empty "previous editions" shelf
export const nextMonth = () => {
  const [m, y] = editionOf(LATEST).month.split(' ');
  const d = new Date(`${m} 1, ${y}`); d.setMonth(d.getMonth() + 1);
  return d.toLocaleString('en', { month: 'long', year: 'numeric' });
};
