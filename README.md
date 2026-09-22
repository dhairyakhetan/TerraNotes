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

## Where things live

- `src/pages/Home.jsx`: the home screen. Its interactive sections live in `src/components/home/`: the words game, the team section and the photo viewer.
- `src/data/words.js`: the "Words we should bring back" pool. Each game draws 5 at random; every word has a hint that fades in as a "psst." note after 16 seconds without an answer.
- `src/pages/Articles.jsx`: the all-articles index.
- `src/pages/Article.jsx` + `src/data/articles.js`: one template for all six articles; titles, tags, colours and intro copy are in the data file.
- `src/components/`: menu (slide-in sheet with swipe-to-close), header, footer.
- `src/styles/`: shared styles, logo wordmark, and each page's animations.
- `public/logo.png`: globe mark and favicon.

## Still placeholder copy

Bracketed text from the design is still waiting for real content: the intro blurb, article body copy,
authors, dates and read times, photos and captions, member bios, and the `@ngo.aquaterra` / `[@HANDLE]` links (currently `#`).
