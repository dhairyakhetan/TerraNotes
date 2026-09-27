
HIII KANISHK BHAIYAAAAA

# TerraNotes by Aquaterra

Aquaterra's monthly digital magazine: articles, a photo wall, a words game and the team.
Vite + React, deployed as a static site on Vercel. Live at https://terranotes-aq.vercel.app.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # → dist/
npm run preview  # serve the build
```

- **Content:** everything is in `src/data/`. Each file explains its fields at the top.
- **Code, design system and conventions:** see [`CLAUDE.md`](CLAUDE.md).

## Deploy

Import the repo in Vercel; it detects Vite. `vercel.json` adds the single-page-app rewrite, clean URLs (so
`/articles/<slug>`, or `/<edition>/articles/<slug>` for an older edition, serves that article's own HTML with its link
preview) and security and cache headers.
The site's address for link previews is `SITE.url` in `src/data/site.js`. To override it, set `SITE_URL` in the
Vercel project.
