# Aquaterra — Terranotes

The Aquaterra site, built with Vite + React and ready for Vercel. It has two layouts:

- **Phone** (`src/pages/`): a fixed 390px layout. Phones, and tablets held upright, scale it to fit.
- **Web** (`src/web/`): a 1440px layout for windows 900px wide and up, and tablets turned sideways.
  Narrower windows get it scaled down to fit; wider ones centre it.

Both read the same data files, so an edit shows up in both.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
npm run preview  # serve the build locally
```

## Deploy on Vercel

Import the repo in Vercel. It detects Vite on its own; `vercel.json` sets the build and adds the SPA
rewrite so links like `/articles/who-owns-the-roof` work on refresh.

## Routes

| Path | Page |
|------|------|
| `/` | Home: intro, hanging articles, photo wall, words game, team |
| `/articles` | All articles (on web: jumps to the article line on the home page) |
| `/articles/:slug` | One article (six slugs, from `src/data/articles.js`) |

## Editing content

All content lives in `src/data/`. Each file starts with a short note on its fields.
Leave a field `''` and the design's bracketed placeholder shows instead.

| File | What's in it |
|------|--------------|
| `src/data/site.js` | Home intro text, Instagram handle |
| `src/data/team.js` | Teams (legend colours) and members: name, role, team, photo, bio, Instagram |
| `src/data/articles.js` | Tags (colours) and articles: title, tag, cover, author, date, read time, body. `COMING_SOON`: the notes on the empty pegs after the articles (web only) |
| `src/data/photos.js` | Photo wall and "See every photo" viewer |
| `src/data/words.js` | "Words we should bring back" game |

## Footer and link previews

- The footer (orbit banner + bar) is mounted once in `src/App.jsx`, outside the pages. It links nowhere, by design.
- Banner video: `public/footer-vid.mp4`, a strip of 8 square panels side by side (8:1, e.g. 2560×320, H.264, no audio, under 3 MB), one panel per bubble.
  Replace it in place (same name) and update `FOOTER_VIDEO.description` in `src/data/site.js` to match the new footage.
- Footer second line and the 8 bubble colours: `src/data/site.js`.
- Link preview image: `public/opengraph.jpg` (1200×630). On Vercel the preview tags get the production domain automatically;
  set `SITE_URL` (e.g. `https://example.com`) in the Vercel project if you use a custom domain.

## Adding images

Put the file in the right folder under `public/`, then write its path (starting with `/`) in the data file:

| Picture | Folder | Example path | Field |
|---------|--------|--------------|-------|
| Team member | `public/team/` | `/team/ananya.jpg` | `photo` in `src/data/team.js` |
| Photo wall | `public/photos/` | `/photos/terrace.jpg` | `photo` in `src/data/photos.js` |
| Article cover or in-article photo | `public/articles/` | `/articles/wetlands.jpg` | `cover` or a `photo` block in `src/data/articles.js` |

Pictures are cropped to fill their frame, so any shape works. Square images suit the round team faces.
Keep files under about 500 KB (JPG or WebP) so the site stays fast.

## Code layout

- `src/pages/`: phone pages: Home, All articles, Article.
- `src/web/`: web pages and sections, plus `web.css` (hover states, scaling).
- `src/components/`: header, footer, menu, article card, image slot; `components/home/` has the phone home page sections.
- `src/lib/`: shared logic: the words game, which layout to show (`layout.js`), scroll lock.
- `src/styles/`: shared styles and each page's animations.
- `public/logo.png`: globe mark and favicon.
- The phone home page has 8 spots for team faces, 5 for photos and shows articles 01, 02, 03 and 05; the All articles page has 6 spots.
  Spots without an article yet show the dotted "on the line soon" cards (`COMING_SOON`).
- The web home page has the same 8 faces and 5 photos. Its article line holds every article followed by the `COMING_SOON` pegs, and grows with the lists.
