// TerraNotes comes out once a month; each edition is a set of articles (their `edition` in src/data/articles.js).
// Newest last. The newest is the "latest": it's what the home page and All articles show; older ones open at
// /editions/<number>. To start a new edition: add it here, then give its articles that edition number.
export const EDITIONS = [
  { number: 1, month: 'September 2026' },
];

export const LATEST = EDITIONS[EDITIONS.length - 1].number;
export const editionOf = (n) => EDITIONS.find((e) => e.number === n);
export const editionName = (n) => `Edition ${String(n).padStart(2, '0')}`;
export const editionLink = (n) => (n === LATEST ? '/' : `/editions/${n}`);
// the month a new edition is due, for the empty "previous editions" shelf
export const nextMonth = () => {
  const [m, y] = EDITIONS[EDITIONS.length - 1].month.split(' ');
  const d = new Date(`${m} 1, ${y}`); d.setMonth(d.getMonth() + 1);
  return d.toLocaleString('en', { month: 'long', year: 'numeric' });
};
