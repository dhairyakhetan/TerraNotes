# Aquaterra — Terranotes (mobile)

The Aquaterra mobile site, built with Vite + React and ready for Vercel.
It's a fixed 390px phone layout: phones scale it to fit, and wider screens centre it.

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
| `/articles` | All articles |
| `/articles/:slug` | One article (six slugs, from `src/data/articles.js`) |

## Editing content

All content lives in `src/data/`. Each file starts with a short note on its fields.
Leave a field `''` and the design's bracketed placeholder shows instead.

| File | What's in it |
|------|--------------|
| `src/data/site.js` | Home intro text, Instagram handle |
| `src/data/team.js` | Teams (legend colours) and members: name, role, team, photo, bio, Instagram |
| `src/data/articles.js` | Tags (colours) and articles: title, tag, cover, author, date, read time, body |
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

- `src/pages/`: Home, All articles, Article.
- `src/components/`: header, footer, menu, article card, image slot; `components/home/` has the home page sections.
- `src/styles/`: shared styles and each page's animations.
- `public/logo.png`: globe mark and favicon.
- The home page has 8 spots for team faces, 5 for photos and shows articles 01, 02, 03 and 05; the All articles page has 6 spots.
