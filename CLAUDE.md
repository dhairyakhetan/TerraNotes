# TerraNotes (Aquaterra's monthly digital magazine): guide for Claude

Vite + React 19 + React Router 8, static site on Vercel. No backend, no UI library, no CSS framework. Each monthly
edition has its own folder, `src/editions/<id>/`, with its look and content; site-wide content is in `src/data/`. Every
file starts with a comment saying what it does; read that before editing it.

## Integrating into AQ's website (for Claude in AQ's repo: start here)

You are in AQ's site repo (the one with `frontend/`), asked to bring TerraNotes in. The `handoff` branch of this repo
(`https://github.com/dhairyakhetan/TerraNotes`, public) is a cleaned, tested snapshot made for this. Integrating is
running this repo's export into AQ's `frontend/`: it writes three folders there and nothing else. Never copy files by
hand, and never edit those three folders in AQ's repo afterwards (the next export replaces them).

| In AQ's `frontend/` | Comes from (this repo) | The export |
|---|---|---|
| `src/terranotes/` | `src/` (all but `main.jsx`), `host.js` set to `{ base: '/terranotes', embedded: true }`, `react-router` renamed `react-router-dom`, + `embed/aq/README.md` as its README | replaces it whole |
| `public/terranotes/` (~13 MB) | `public/` (all but the own site's icons and manifest): fonts, covers, photos, link previews, the Wisdom Woods demo | adds and updates; never deletes AQ's own files there |
| `scripts/terranotes/` | `build/staticCopy.js`, `embed/aq/scripts/prerender.mjs`, `tools/make-link-previews.mjs` | replaces it whole |

**If your prompt says "replace the existing `*/terranotes`"** (or names one of the folders): that means these three
folders, and the export is how they're replaced. Don't copy this repo's folders over by hand: the layouts differ
(this repo's `src/` becomes `src/terranotes/`, `host.js` is rewritten, `react-router` is renamed). The export replaces
`src/terranotes/` and `scripts/terranotes/` whole; in `public/terranotes/` it adds and updates, then lists the files
it left alone: delete those too, unless something in AQ's own code uses one. A link like
`https://github.com/dhairyakhetan/TerraNotes/tree/handoff` means: clone this repo's `handoff` branch (step 1).

**Check before you trust this.** The owner wrote these notes from a copy of AQ's repo, and may have it wrong. Before
writing anything, look at AQ's repo as it is: where its frontend lives (`frontend/`?), whether `src/terranotes/` is
already there and what's in it, whether its `App.tsx`, `PublicLayout.tsx`, `routeModules.ts`, `vercel.json` and
prerender scripts do what the list below says, and which versions of `react`, `react-dom` and `react-router-dom` it has.
Where something differs, follow the repo, not these notes: adapt the steps, and tell the owner what was different and
what you did about it. If it differs in a way you can't safely work around, stop and ask.

**Steps** (from the root of AQ's repo):
1. `git clone -b handoff https://github.com/dhairyakhetan/TerraNotes.git ../terranotes-handoff` (outside AQ's repo:
   never commit it there). The export needs only Node 20+, no `npm install` in the clone.
2. `cd frontend && npm install matter-js@^0.20.0`. Buddy's Fling game loads it, and AQ's `package.json` doesn't have it:
   without it AQ's `vite build` stops with `failed to resolve import "matter-js"`. The rest the magazine needs is already
   in AQ's `frontend/package.json`: `react` and `react-dom` 19, `react-router-dom` 7.18+ (it uses
   `UNSAFE_createBrowserHistory`, `unstable_HistoryRouter`), `@vercel/analytics`.
3. `node ../terranotes-handoff/tools/export-aq.mjs . --dry` (from `frontend/`): it runs the AQ guard
   (`tools/check-embed.mjs`), then lists what it would add, change and remove. Then the same without `--dry`.
   From an older integration it removes files that no longer exist here: `TerraNotesApp.jsx`,
   `data/photos.js`, `data/team.js`, `data/words.js`, `shared/SnakeCard.jsx`, `scripts/terranotes/tools/make-card-covers.mjs`
   (each edition's content now lives in `src/terranotes/editions/<id>/`). That's expected.
4. `npm run build` in `frontend/` (AQ's whole chain). Tested on a copy of AQ's repo (October 2026): it passes, i.e. accent lint,
   `verify-routing`, `tsc -b`, `vite build`, the sitemap gate, the bundle budget (eager 666 KB of 683.6 KB; the lazy
   `TerraNotesRoot` chunk, ~275 KB, only prints a "worth splitting" note). If AQ's `scripts/check-bundle-budget.mjs` was
   raised to 705,000 bytes for an earlier export (the magazine's page animations used to load up front), set it back to
   700,000: they load with the magazine now (`lib/pageSwap.js`) and the prerender (34 Terra Notes pages, plus
   `llms.txt`).
5. Check it in a browser (`npm run dev`, or `npx vite preview` after the build), at 1440px and at 390px (emulate touch):
   `/terranotes` (October), `/terranotes/articles/whispers-in-the-weave`, `/terranotes/sep26` (September, its own look),
   `/terranotes/sep26/articles/exam-stress`, `/terranotes/sep26/articles/labs` (AQ Labs), `/terranotes/photos`,
   `/labs` (redirects into AQ Labs). AQ's nav and phone dock must sit over the top of every page, with the "← Back to
   home" pill just under the nav; no errors in the console from the magazine.
6. Commit only: `frontend/package.json` + `package-lock.json` (matter-js), `frontend/src/terranotes/`,
   `frontend/public/terranotes/`, `frontend/scripts/terranotes/`, and `frontend/public/sitemap.xml` (AQ's build rewrites
   it with the magazine's addresses). `git status` should show nothing else. Delete the clone.

**What AQ's own code already does for it** (it's in AQ's repo from the first integration; keep it, don't redo it. On a
repo that has none of it, these are what to add):
- `src/lib/routeModules.ts`: `terranotes: () => import('../terranotes/TerraNotesRoot.jsx')` (and `labs` → `terranotes`);
  `App.tsx`: `<Route path="/terranotes/*" element={<TerraNotesRoot />} />` (lazy).
- `App.tsx` `AppRouter`: the router's history is `createAnimatedHistory()` (`terranotes/lib/animatedHistory`), with
  `useTransitions={false}` while a TerraNotes page shows (`history.onShown` + `isTnPath`): the card flights need it.
  Its scroll-to-top skips `isTnPath()` pages (the magazine keeps its own scroll positions).
- `App.tsx` `LabsRedirect` and `vercel.json`: `/labs` and `/labs/<slug>` → `/terranotes/articles/labs[/<chapter>]`
  (the magazine then sends that on to the edition AQ Labs is in, `/terranotes/sep26/articles/labs`); `vercel.json` gives
  `/terranotes/editions/:id/articles/:slug/:chapter/demo/*` `X-Frame-Options: SAMEORIGIN` (the demo opens in a
  same-origin frame) and leaves it out of the site-wide `DENY`.
- `components/PublicLayout.tsx`: on `isTnPath()` pages it keeps AQ's nav and phone dock, adds no nav padding to `<main>`
  (the magazine leaves room itself), keeps `isBottomNavHidden()` false, and AQ keeps `--nav-h` on `:root` set to the
  nav's height (the magazine's "← Back to home" pill sits at `var(--nav-h) + 10px`). More in `src/shared/AqNavSlot.jsx`.
- `scripts/prerender-meta.mjs` writes `terraNotesPages()` and `terraNotesLlms()`, `scripts/generate-sitemap.mjs` adds
  `terraNotesSitemapPaths()` (all from `scripts/terranotes/prerender.mjs`); `scripts/verify-routing.mjs` checks the
  `/terranotes` routes and the demo's frame header.
- The `.d.ts` stubs beside `TerraNotesRoot.jsx`, `lib/animatedHistory.js` and `lib/base.js` are what `tsc` sees; the
  magazine itself is JavaScript and isn't linted or type-checked by AQ's tooling (this repo checks it).

How it draws inside AQ (shadow root, `/terranotes` prefix, looks as CSS variables on the shadow host) is in "Inside AQ's
website" below and in `embed/aq/README.md` (which becomes `src/terranotes/README.md` there). A later update is the same
steps, from `main` (or a new `handoff`), without step 2.

## How you work: clone, change, hand over a .patch

You usually have no push access here. The owner runs you in a chat, and gets your changes into the repo as a
`.patch` file. So, in every conversation:

1. **First thing, before answering anything about the code: get a fresh copy.** Never work from memory of the files,
   or from a copy made in an earlier conversation.
   ```bash
   git clone https://github.com/dhairyakhetan/TerraNotes.git && cd TerraNotes && npm install
   ```
   If the clone fails (no network, or the repo is private to you), ask the owner to upload the repo as a ZIP (GitHub →
   Code → Download ZIP), unzip it, then make it a git repo so a patch can be made from it:
   `git init -q && git add -A && git commit -qm "base"`. Patches from a ZIP base say so (see 4).
2. **Make the change** the owner asked for, by this file's rules (house rules, editions, the AQ rules, the design
   system). Read a file's header comment before editing it. Keep each change to what was asked.
   - **Do, don't ask.** The owner asking for something is the go-ahead, including a change to an older edition (the
     freeze below is about not changing one by accident). Where a detail is open, pick what fits the request and the
     design (both layouts, unless they named one; leave what they didn't mention as it is), do it, and say in one line
     what you picked. Ask only when the request can be read two ways that lead to clearly different results.
3. **Test it before handing it over.**
   - `npm run build` must pass (it runs `npm run check` first: the AQ guard).
   - If you can run a browser (`npx playwright`; `npm run preview` serves `dist/` on :4173), screenshot the pages you
     touched at 390px (touch) and 1440px, and check an older edition (`/sep26`) still looks the same. Look at the
     screenshots.
   - Can't run something? Say exactly what you didn't test. Never say "tested" for what you only read.
4. **Commit locally and make the patch.** One commit per change, with a clear message (what changed and why), then
   everything since the clone in one file:
   ```bash
   git add -A && git commit -qm "Short summary of the change"
   git format-patch --binary --stdout origin/main > terranotes-<what-it-does>.patch   # ZIP base: use the "base" commit instead of origin/main
   ```
   Later changes in the same conversation go on top as new commits; hand over a new patch with all of them, and say
   it **replaces** the earlier one (apply only the newest).
5. **Give the owner the `.patch` file**, a few lines on what changed and what you tested, a one-line commit message
   for it, and this (as it is, with the file name filled in). The owner applies it with `git apply` and commits it
   themselves:

   > **To apply:** in the TerraNotes folder, `git pull`, then `git apply terranotes-<what-it-does>.patch`.
   > If it says the patch doesn't apply, send me the error and I'll make a new one from a fresh copy.

   Patch files are hand-over only: never commit them to the repo.

## Commands

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # → dist/ (runs npm run check first: the AQ guard)
npm run preview  # serve dist/ on :4173
npm run check    # tools/check-embed.mjs: the mistakes that only break inside AQ's website (the build runs it first)
node tools/make-card-covers.mjs    # after adding an article / changing a cover: its WebP copies (cover-card.webp for cards, cover-page.webp for the article page)
node tools/make-link-previews.mjs   # after adding an article / changing a cover / a new edition: every link preview, in public/og/ (needs `npm i -D playwright`)
node tools/make-art.mjs [id]       # the covers from tools/art/<id>.mjs (team artwork in tools/art/<id>/); then make-card-covers (CHROMIUM=… for another Chromium)
node tools/check-fling-levels.mjs   # after adding / changing a Fling level (shared/buddy/flingLevels.js): plays each, checks it stands and can be cleared
npm run test:visual           # after a build: screenshots of key pages at 390 + 1440 vs tests/visual/screenshots/ (PW_CHROMIUM=… for another Chromium)
npm run test:visual:update    # after a change you meant: save new screenshots (commit them)
```

The one automated test is visual (`playwright.config.js`, `tests/visual/`, run on every push by `.github/workflows/visual.yml`):
the home page, an article and `/sep26` (+ one of its articles) at both widths, compared with saved screenshots; a
change you meant needs new ones: run the workflow by hand with "update" (it commits them). The saved screenshots are
CI's: another Chromium lays text out a few pixels differently, so a local `npm run test:visual` against them can fail
for that alone (save local ones with `test:visual:update` to compare before / after your own change, but don't commit them). Still verify changes in a real browser at **both** widths: 390px (phone layout, emulate
touch) and 1440px (web layout), and resize across 900px. Also check reduced motion, `?lite` (low-end mode) and `?intro` (forces the opening
animation). Automated browsers never get the intro.

## House rules (from the owner)

- **The console hello must never name anyone.**
- **Writers' article text is verbatim, typos included.** Never "fix" it.
- **Every edition keeps its look and content for good.** Once a newer edition is live, the older one's folder (`src/editions/<id>/`) is frozen: don't edit it as a side effect of other work, and don't change a shared component in a way that changes how it looks (see "Editions"). When the owner asks for a change to an older edition, make it: that's their call.
- **No new colours** outside the edition's look (`src/editions/<id>/look.js`), unless the owner supplies them. The AQ Labs project bars use colours they supplied.
- **Changes go to `main`.** Without push access (the usual case) that means a `.patch` for the owner (above); a session
  that can push commits straight to `main`, even when its setup names a branch to work on. Never make a branch unless the
  owner asks for one.
- **The `handoff` branch** is the snapshot AQ's Claude integrates from ("Integrating into AQ's website"). It moves only
  when the owner asks for a new handoff: then reset it to `main` once `main` builds and has been checked.

## Editions

TerraNotes comes out monthly, and each edition has its own look and content, kept for good: `/sep26` keeps September's
look after October is out.

- **One folder per edition**, `src/editions/<id>/` (the id comes from its month: `sep26`, `oct26`):
  - `look.js`: its colours and fonts, by role (`LOOK.colors`, `LOOK.fonts`). Fonts are self-hosted: a new one goes in `public/fonts/` with an `@font-face` in `styles/fontfaces.css` and its twin in `styles/document.css` (`fontsCss` is for a stylesheet the site doesn't serve itself, normally `''`).
  - `articles.js`: its `ARTICLES`, in order, and the `TAGS` they use. Their fields are explained at the top of `data/articles.js`.
  - `photos.js`, `words.js`, `team.js`: its photo wall, words game and team (`TEAMS`, `MEMBERS`).
  - `index.js`: gathers them, plus `INTRO` (the home intro card's lines).
  - Its files (covers, photos) are in `public/editions/<id>/`.
- **The list:** `EDITIONS` in `data/editions.js`, newest last; each folder is also registered in `src/editions/index.js`.
  - `draft: true` = still being made: not the latest, listed nowhere (edition picker, `/editions`, sitemap), but viewable at its own address (`/oct26`) with a "Draft · not live yet" tape.
  - Deleting the flag puts it live: it becomes the home page, and the previous edition moves under its id by itself.
- **A page's edition comes from its address** (`editionAt` in `lib/routes.js`): `/sep26…` is September's, everything else the latest's.
  - `App.jsx` puts that edition's look on the page and hands its content down. Components read it with `useEdition()` (`lib/edition.js`): `{ number, id, month, draft, look, tags, articles, photos, words, teams, members, intro }`.
  - Never import an edition's own files (`src/editions/<id>/…`) in a component. Another edition's data (an article's own edition, say): `editionData(n)` from `src/editions/index.js`.
- **Looks are CSS variables.** `lib/edition.js` sets every colour as `--<name>` and every font as `--font-<name>` on `<html>` (inside AQ's website: on the shadow host), plus `data-edition="<id>"`. So:
  - Shared components and CSS use `var(--ink)`, `var(--card)`…, never a hex colour. Fonts come from `FONT` (`var(--font-head)`…).
  - SVG colours go in `style` (`style={{ stroke: "var(--ink)" }}`), not in attributes: Safari may not read a variable there.
  - A canvas can't read CSS variables: it takes the values from `useEdition().look` (see `shared/buddy/BuddyGames.jsx`).
  - Overlays and glows are still `rgba(…)`. Give one a look value when a month needs it changed.
  - A new role (a colour that should differ from an existing one): add it to **every** edition's `look.js`, with the colour it had before in the older ones, so they stay the same. The build stops if any look misses a key, or uses a name the code already gives its own CSS variables (`TAKEN` in `src/editions/index.js`).
  - The build writes the latest edition's look into `index.html` (`vite.config.js`), so the first paint is already right.
- **More than a new look:** an edition can draw its own home page or article page. Keep a copy of the shared one in its folder, change it there, and register it in `src/editions/pages.js`.
  - October's covers all come from `tools/make-art.mjs` (`tools/art/<id>.mjs`) in one poster style (marigold frame, tag · writer, title): drawn ones, and the team's own artwork (kept as sent in `tools/art/<id>/<slug>.jpg`) laid in as a print with `print()` (`kit.mjs`). New team artwork goes there, not straight over `cover.jpg`.
  - Its own CSS goes in its folder too, scoped with `[data-edition="<id>"]` or its own class, with class names no other file uses.
- **Never change how a live or older edition looks** while making the next one. Check it: screenshot its pages at 390px and 1440px before and after your change; they must match.

## Inside AQ's website

The magazine also runs inside AQ's main website, at `/terranotes`, from this same code. Putting it there is AQ's job,
not part of the work here (`tools/export-aq.mjs` is their tool; don't run it unless the owner asks; the steps are in
"Integrating into AQ's website" at the top). Your job: keep every change working there too, by the rules below.

- **`src/host.js` is what differs:** AQ's copy says `{ base: '/terranotes', embedded: true }`. AQ-only behaviour checks
  `HOST.embedded` (the phone "call Buddy" button, no skip link of its own, AQ Labs running full width,
  and `shared/InsideAQ.jsx`: the editions card at the end of the home pages, a "← Back to home" pill under AQ's
  nav, and "Latest edition →" / "All editions" pills top right (`EditionPills`), standing in for the hidden header); AQ-only styles are rules that
  start with `:host`.
- **AQ's look on the own site too.** The own site is AQ's testing ground, so by default it shows the magazine as it
  sits inside AQ (`AQ_LOOK` in `src/host.js`): header hidden, a plain placeholder box where AQ's nav goes (`shared/AqNavSlot.jsx`, with the integration notes for AQ's Claude),
  the `shared/InsideAQ.jsx` pieces and the phone call button. `?aq=0` in the address shows the plain version (`?aq=1`
  back; remembered for the tab). AQ-look CSS keys on `html[data-tn-aq]` with a `:host([data-tn-aq])` twin.
- **It draws inside a shadow root** (`src/TerraNotesRoot.jsx`), under AQ's own nav and dock, above AQ's footer (the magazine has none of its own). AQ hides the
  magazine's header (`:host header.site-header{visibility:hidden}` in `styles/base.css`). So, in all code:
  - Router pieces come from `src/router.jsx` (it adds and strips the `/terranotes` prefix), never from `react-router`.
  - Elements the magazine drew are found with `byId` / `$` (`lib/dom.js`), never `document.getElementById` /
    `querySelector`. Pop-ups portal into `portalRoot()`. Outside-click checks use `e.composedPath().includes(el)`.
    Flags on `<html>` go through `flag()` (it sets them on the shadow host too).
  - File URLs written in code go through `withBase()` (`lib/base.js`). Paths in `src/editions/` and `src/data/` stay
    as they are: `src/editions/index.js` and `articleFolder()` turn them into real URLs.
  - CSS that styles the page from `<html>` needs a `:host(…)` twin (`html[data-tn-nav] .x, :host([data-tn-nav]) .x`),
    and `:root` variables are `:root,:host`.
  - What a shadow root can't hold (`@font-face`, `<html>` rules, `::view-transition-*`) also goes in
    `src/styles/document.css` (loaded only there).
  - The edition's look goes on the shadow host, never `<html>`: AQ's own CSS uses `--ink`, `--card` and `--pink` too.
  - `npm run build` runs `tools/check-embed.mjs` first and fails on any of these. A line that genuinely needs one (a
    document-level element) ends with the comment `embed-ok`.
- **What AQ's code uses from here** (keep these working): `TerraNotesRoot.jsx` (default export), `lib/base.js`
  `isTnPath`, `lib/animatedHistory.js` `createAnimatedHistory()` with `onShown()` (AQ loads these two with its first
  page, so keep them small: the page animations are `lib/pageSwap.js`, which `App.jsx` plugs in), and `embed/aq/scripts/prerender.mjs`
  (`terraNotesPages()`, `terraNotesLlms()`, `terraNotesSitemapPaths()`; it builds on `build/staticCopy.js`).
- **AQ-only files:** `src/TerraNotesRoot.jsx`, `src/styles/document.css`, the `.d.ts` stubs, and `embed/aq/` (the
  README for AQ's side and the prerender). The self-hosted fonts are shared: `public/fonts/`.

## Layout model

Two separate layouts, chosen by window width (`lib/layoutMode.js`, `useIsWeb()`), each a fixed artboard drawn with CSS
`zoom` so it fills the window at any size:

- **Below 900px: phone**, scaled to the window (`--phone-zoom`, ×0.8–×1.5; phones themselves are pinned to 390px, so ×1).
  `App.jsx` wraps the phone pages in `.phone`; the phone menu takes the zoom itself.
- **900px and up: web**, scaled to the window (`--web-zoom`, ×0.625 up to ×1.34 on big screens).
- **The switch** has a 24px buffer (web from 900, back to phone below 876) and waits for the resize to stop. Crossing it
  crossfades (a view transition, `html[data-tn-layout]`, `styles/motion.css`) and opens the other layout at the same
  section. While the window is resized, the reader's place is kept too.
- Maths with screen pixels (`getBoundingClientRect`, pointer positions) divides by `pageZoom()`; full-screen pop-ups
  divide `100vh` by the zoom (`styles/phone.css`, `styles/web.css`).

| | Phone (`src/phone/`) | Web (`src/web/`) |
|---|---|---|
| Width | **390px**, drawn at `--phone-zoom`. Phones and upright tablets are pinned to 390px by the viewport tag in `index.html` (inside AQ's website: `TerraNotesRoot.jsx`, while the magazine shows) | **1440px**, drawn at `--web-zoom` |
| Header | `PhoneHeader` (64px, sticky; the logo glides when the back link comes or goes) + slide-in `PhoneMenu` | `WebHeader` (80px, sticky, kept slim: logo + edition picker; inner pages: "← back to home" left, logo + picker centred, gliding over when that changes) |

- **Home pages are artboards.** Everything under the header is `position: absolute` at design coordinates (px).
  - Sections export their heights so the page grows with the data: `hangExtra(articles)` (PhoneHangingArticles) and `teamHeight(edition, layout)` (TeamSection).
  - When a section grows, move what's below it; don't reflow.
- **Article, editions and 404 pages** are in normal document flow.
- **Addresses follow the editions** (`data/editions.js`; each edition's id comes from its month, `sep26`):
  - latest edition: `/` and `/articles/<slug>`; older ones and drafts: `/<id>` (that edition's whole home page, in its own look) and `/<id>/articles/<slug>`.
  - Build links with `articleLink(a)` / `editionLink(n)` / `homeLink(n, section)`, never by hand. A new edition moves the old links by itself; either address of an article redirects to its current one (`App.jsx`).
- **Files follow the editions too:** `public/editions/<id>/` holds that edition's files, latest or not. Each article has a folder, `public/editions/<id>/articles/<slug>/`: `cover.jpg`, `cover-card.webp` and `cover-page.webp` (the WebP copies the cards and the article page use, made by the tool; link previews keep the JPEG) and any photos of its own (`articleFolder(a)`). Every link preview lives together in `public/og/` (`ogImage` in `data/editions.js`): `home.jpg` (the main page, `/` and `/editions`), `<id>.jpg` (an edition's home and section pages), `<id>-<slug>.jpg` (an article). The photo wall's pictures are in `public/editions/<id>/photos/`.
- **An article can have its own page** instead of the usual layout: `page: 'labs'` in its data and an entry in `PAGES` (`App.jsx`). It lives in `src/articles/<name>/`.
  - Its `body` is still what crawlers and AIs read.
  - It gets no card flight (no cover to land on; `flight()` in `lib/cardFlight.js`), just the crossfade.
  - `chapters`: its sections get addresses, `<article>/<id>` (element ids).
  - `demos`: `{ chapter: folder }`, a web app kept in its folder, opened in a new tab at `<article>/<chapter>/demo`. `pages/DemoPage.jsx` shows it full-window in a same-origin frame, with no footer, Buddy or opening animation. Its files stay as the team made them.
  - **AQ Labs** (`src/articles/labs/`, the "labs" article; teams and chapter ids in `data/labs.js`) is the AQ Labs team's own gallery site, ported. Its Wisdom Woods chapter opens the team's demo at `/articles/labs/wisdom-woods/demo` (files: `public/editions/sep26/articles/labs/wisdom-woods/demo/`). It keeps their look on purpose: their fonts (`public/fonts/`, JetBrains Mono, self-hosted too), their palette and rounded pills. Don't restyle it into the magazine's design.
    - Built from the AQ Labs design. Web: one long scroll (intro with a 3D bookshelf, then every chapter), sticky chapter tabs as a floating glass pill (as on AQ's website). Phone: one chapter at a time (the shelf is the start; `/articles/labs/<id>` opens a chapter as its own page, so Back returns to the shelf); search lives in the "view all projects" sheet.
    - Books sit in fixed hover slots (`.bslot`), so the pulled-out book never flickers. Karyaarth's stills open in the site's `PhotoViewer` (it takes `photos`, `title`, `label`, `count`).
  - Its CSS (`labs.css`) is scoped to `.labs`. Its class names must not match any in `src/styles/` (it had to rename `.intro` and `.orbit`). Its loops keep the motion rules below, inside `labs.css`: transform / opacity only, stopped by reduced motion, `.tn-lite`, `.off-screen` and `html[data-tn-nav]` (with their `:host` twins). It brings its own stylesheet (`labs.css?inline`, a `<style>` beside the page), so it loads with the gallery.
- **Shared components** (`src/shared/`) take a `web` prop (or `look`) and keep a `PHONE` / `WEB` table of positions and sizes. Change a value in the right table; don't fork the component.
- **The home page also answers at `/articles`, `/photos`, `/words` and `/members`** (an older edition's at `/sep26/photos`…) and scrolls to that section: element ids `articles`, `photos`, `words`, `members`. See `lib/routes.js` and `lib/scrollMemory.js`.
- **Each of Buddy's games has an address in every edition**, from `data/games.js` (`gameLink(id, n)`): `/games/<id>` (the latest's), `/sep26/games/<id>` (an older one's), `/games` opening the first: that edition's home page with the game open (`HomeRoute` in `App.jsx`). Tapping Buddy (a trick, then the games) opens them. Clearing Fling's last level shows a Winner screen and gives Buddy the winner's crown; all 150 stars give him a trophy; he keeps both for good on that device (`lib/buddyState.js` `useRewards`). Once level 50 is beaten, "Reset progress" (winner screen, level picker; it asks first) wipes the levels, stars and best scores; the crown and trophy stay. The games popup sizes each game to the window's height, so every button stays on screen. Every Fling level must be clearable with one Buddy (3 stars): `tools/check-fling-levels.mjs` checks it. While the popup is open over a home page the address follows it (and goes back on close); over an article it stays. A game link skips the opening animation. Their pages and link previews (`og/<edition id>-game-<id>.jpg`, `og/<edition id>-games.jpg`, on the edition's paper) are built like an article's.
- **Section addresses drop off by themselves.** Once you scroll a screen away from the section an address names (`/photos`, `/sep26/words`, `/articles/labs/photon`), `lib/scrollMemory.js` replaces it with the plain page (`/`, `/sep26`, `/articles/labs`) in place, with state `{ quiet: true }`, so nothing scrolls or remounts. `?by=` addresses stay.
  - To change the address from a page without scrolling, use `navigate(path, { replace: true, state: { quiet: true } })`.
  - The home page (`/:first?/:second?`) and an article with its chapters (`/articles/:slug/*`) are one route each, so the page survives the change.
- **Styling is inline** (`style={{ … }}` with string values like `"12px"`), matching the existing code.
  - CSS files only hold what inline styles can't: `:active` / `:hover`, keyframes, and shared classes.
  - Fonts come from `FONT` in `src/styles/fonts.js`. Never retype a font stack.

## Design system

The site is "notes pegged on a line": paper cards hanging from strings, with ink borders, hard shadows, tape and handwriting.

Each edition has a theme, a vibe for the whole page, not just colours: September 2026 is **"exam season"**, a school
notebook (`src/editions/sep26/`: `look.js` colours, `look.css` ruled paper with a red margin and punch holes on the pages
with `class="page-sheet"`; its home pages write on those lines: text straight on the paper carries `data-ruled` ("1"/"2": rules per
line) and `lib/ruled.js` `useRuledPage` sets each block's first baseline on a rule, clear of the margin, "Meet the team" via
`TEAM_FIT` in `sep26/ruled.js`, the ruling's numbers in `RULED` (`pages.js`); `Decor.jsx` doodles on the home pages: sticky note, coffee ring, star, paper plane, moving a little; `Diary.jsx`, a
Tom Riddle-style diary under "Meet the team" that writes random lines in a script font after you stay a while). October
2026 (the latest edition) is **"Pujo & Diwali"**, from the design team's brief: the same layout as September (intro card,
hanging articles, photo wall, words game, team), dressed for the festivals. Bright cream page, indigo ink, alta red,
marigold; Rozha One headings; `look.css` a ribbon border and an alpana dot pattern; `Decor.jsx` a marigold toran, a "Subho
Sharodiya!" tag, sparkles and falling petals, and on phones two hanging diyas. The rest is in `src/editions/oct26/festive/`,
each piece switched on for October only through `src/editions/pages.js`: the intro card leads with "TerraNotes" in big
letters (`LAYOUT` `introMast`), diyas hang from the web article wire between the cards (`Diya.jsx`, `HANGERS`), a faint
alta-red alpana border runs round the photo wall (`Alpana.jsx`, `WALL_DECOR`), the words game's cloud is dhunuchi smoke
and its A/B/C marks a dhunuchi, a lantern and a firework (`Dhunuchi.jsx`, `WORDS_ART`), two dhakis drum by the team
legend (`DhakPlayers.jsx`, `TEAM_NOTE`), and Buddy's games are re-dressed (`games.js`, `GAME_SKIN`; their names in
`data/games.js`): Snake is Durga Maa chasing demon faces with a marigold garland for a tail, Fling a bow and arrow at
demon faces. The illustrations' own colours are in its `look.js` `art`. Pujo, Diwali and festive-feeling words; the
writers' six articles (covers in one poster style: two frame the team's artwork, Aarav's poem has a pencil sketch of her eyes in a heart drawn straight on, three are drawn) and readers' photos on a black photo wall (20 of them, five hung at a time, picked at random: `lib/photoPick.js`). A new edition starts from a copy of the newest look and changes the values; its own CSS and
doodles are registered in `src/editions/pages.js` (`EDITION_CSS`, `DECOR`, `TEAM_NOTE` for a secret by the team legend: under it on web, beside it on phones; `HANGERS`, `WALL_DECOR`, `WORDS_ART` and `GAME_SKIN` to dress the article wire, the photo wall, the words game and Buddy's games; `LAYOUT` switches on newer layouts of the shared home sections per edition, so older ones keep theirs: copy the newest edition's entry).
Use the variables, nothing else (the look lists a few more, for the photo wall, dark panels and details).

**Palette:**

| Role | Variable | Sep 2026 |
|---|---|---|
| page | `--page` (outside the artboard: `--outside`) | `#F5F2E9` (`#E4E0D5`) |
| cards | `--card` (soft cream `--cream`) | `#FFFFFF` (`#FBF8F1`) |
| ink / borders | `--ink` | `#18213A` (navy-black ballpoint) |
| body text | `--text` | `#253048` |
| handwriting | `--hand` (deks `--dek`) | `#2349B8` blue ballpoint (`#344262`) |
| string / wire | `--string` / `--wire` | `#6E747D` / `#9AA0A9` (pencil) |
| accents | `--yellow`, `--red`, `--blue`, `--green`, `--purple`, `--pink`, `--mint` | highlighters and pens: `#FFD43B`, `#E5484D`, `#3D7BFD`, `#2E9E5B`, `#7B5CE6`, `#FF6FAE`, `#7FE0A6` |
| photo wall | panel `--wall`, amber shadow `--amber` | `#1C2740` (blackboard), `#FFD43B` |

Tag colours are in the edition's `TAGS` (`articles.js`) and team colours in its `TEAMS` (`team.js`).

**Type** (`FONT`, the look's `fonts`):

| Name | Sep 2026 | Use |
|---|---|---|
| `head` | Archivo Black | uppercase headings, titles, big numbers |
| `mono` | Space Mono | uppercase labels, meta lines and buttons, letter-spacing ~1–1.8px |
| `hand` | Caveat | handwritten notes, deks, captions, "you're here" |
| `serif` | Instrument Serif | "Photo wall", "TerraNotes", the intro headline |
| `body` | Figtree | UI text |
| `read` | Newsreader | article paragraphs |
| `script` | Pinyon Script | September's diary only |

**Shapes:**
- **Borders:** always `2px solid var(--ink)`; 1.5px on small bits.
- **Shadows:** hard, no blur: `Npx Npx 0 <colour>`, 3–4px on buttons, 6–12px on cards. The colour carries meaning: black by default, the tag or team colour, yellow for featured.
- **Tilt:** things sit slightly crooked, `rotate(±0.5–3deg)`.
- **Corners:** square, except pills (`borderRadius: 999px`), faces (circles), the photo wall panel and the AQ Labs project bars.
- **Hanging:** a 1.4px `var(--string)` string plus a coloured `<Clip>` (`shared/Tapes.jsx`) on the card's top edge.
- **Tapes:** yellow with an ink border: `<ByTape>` "by <writer>", `<FeaturedTape>` "★ featured", `<LatestTag>`.
- **Placeholders:** empty data shows a dashed placeholder (`ImageSlot`) or `[bracketed text]`. Keep that behaviour.

**Buttons.** Every tap target is ≥ 44px tall.

| Kind | Style |
|---|---|
| primary | `background: "var(--ink)", color: "var(--card)", border: "2px solid var(--ink)", boxShadow: "4px 4px 0 var(--yellow)"`, mono 700 11–12px uppercase, letter-spacing 1px, `minHeight: "44px", padding: "0 18px"` |
| secondary | `var(--card)` background, ink text, `boxShadow: "4px 4px 0 var(--ink)"` |
| icon | 44–48px square, white, `<CloseIcon>` / `<ChevronIcon>` from `shared/Icons.jsx` |

Behaviour classes:
- `className="press"`: on touch it drops into its shadow while pressed. Set the shadow colour in `"--c"`.
- `className="btn"`: on web it lifts on hover and drops on press.
- Use `"press btn"` for components shown on both layouts.

Links that leave the site use `target="_blank" rel="noreferrer"` and end with ↗.

**Cards.** Use `<ArticleCard>` for articles:
- `look`: `phone` (you pass the size), `web` (172×272, the line) or `webNext` (340×460).
- It handles clip, cover, tag pill, number, title fitting (`lib/fitTitle.js`), the featured tape and the flight memory.

Popups are white cards with a hard shadow and a clip:
- Open with `className="card-drop"`, close with `"card-lift"`.
- `usePresence(value, ms)` keeps it mounted while it animates out.
- Put a dim backdrop (`"fade-in"` / `"fade-out"`) behind it.

**Motion** (it must run on low-end phones):
- **Endless loops** go in `styles/loops.css`:
  - Animate **only `transform` / `opacity`**, never layout or paint properties.
  - Add every new loop class to the reduced-motion rule, the `.tn-lite` rule and the `html[data-tn-nav]` pause rule there.
  - Wrap a section in `usePauseOffscreen(ref)` so its loops stop when it's scrolled away.
- **Blocks below the fold rise in** the first time they scroll into view: `useReveal(ref, delay)` (`lib/reveal.js`, `.reveal` in `styles/motion.css`; a `.stagger` child's items follow one by one, `--i`). The home sections and the end cards use it.
- **One-shot animations** go in `styles/motion.css`. Entrances animate the `translate` / `rotate` / `scale` properties (not `transform`) so elements keep their tilt.
- **JS animation** must check `calm()` (reduced motion) from `lib/motion.js`. For per-frame work, run `requestAnimationFrame` only while something moves. `web/WebArticleLine.jsx` is the model.
- **`LITE`** (low-end devices: ≤2 GB memory, ≤2 cores, Data Saver, or `?lite`) stops every loop.
- **Page changes** go through `lib/animatedHistory.js` (animated by `lib/pageSwap.js`). A card link flies (`lib/cardFlight.js`); anything else crossfades.

## Where things are

```
index.html              meta / link-preview tags (%SITE_URL% filled at build), the latest look (%LOOK%), fonts, viewport switch,
                        no-JS notice
vite.config.js          plugins: React, %SITE_URL% + the latest edition's look, build/siteFiles.js
build/siteFiles.js      at build: an .html per article at its address (own title + preview image), each edition's home and section
                        pages, 404, sitemap, robots, llms.txt (drafts left out)
build/staticCopy.js     each page's text as plain HTML inside #root, for crawlers without JavaScript
tools/make-link-previews.mjs   every link preview (1200×630) into public/og/: the main page, each edition, each article, each game, on the edition's paper
tools/make-art.mjs + tools/art/   the covers and drawn pictures (an SVG kit, kit.mjs, a list per edition, team artwork in <id>/), rendered with the site fonts
tools/check-embed.mjs   the guard for AQ's website (see "Inside AQ's website")   tools/export-aq.mjs   writes the magazine into it
embed/aq/               AQ-only: README (for AQ's side), scripts/ (prerender.mjs)
src/host.js             where this copy runs (own site / AQ's website)
src/main.jsx            the own site's entry: router with the animated history, intro, lite class, console hello, CSS imports
src/TerraNotesRoot.jsx  AQ's entry: the shadow-root mount (+ styles/document.css, the .d.ts stubs)
src/router.jsx          every router piece the code uses (adds / strips AQ's /terranotes)
src/App.jsx             routes (phone vs web page per route, articles with their own page: PAGES, address redirects), the page's
                        edition (its look + useEdition()), skip link, scroll memory, error card, games popup (loaded on first use), draft tape
src/editions/           one folder per edition (see "Editions"): <id>/look.js, articles.js, photos.js, words.js, team.js, index.js
  index.js              the folders by id, ALL_ARTICLES, editionData(n), the build's checks
  pages.js              editions' own pages (OWN_PAGES), CSS (EDITION_CSS) and home doodles (DECOR)
src/data/               site-wide content (each file documents its fields at the top)
  site.js               site URL, Aquaterra website + Instagram, a line about Aquaterra
  games.js              Buddy's games: titles, how-to lines, link-preview text; gameLink (/games/<id>)
  articles.js           article fields + body block formats (top), ALL_ARTICLES, ARTICLES (latest edition), placeOf(), tagOf()
  editions.js           EDITIONS (newest last, drafts), LATEST, PUBLISHED, editionId, articleLink, editionLink, homeLink, articleFolder
  labs.js               the AQ Labs gallery's teams (chapter ids, labels, colours)
src/phone/              PhoneHome, PhoneHangingArticles (the strung-up cards), PhoneArticle, PhoneHeader, PhoneMenu
src/web/                WebHome, WebArticleLine (sideways wire), WebArticle, WebHeader, WebEditionPicker
src/pages/              EditionsPage (/editions: the latest big, back issues as tiles in their own colours, coming-up), NotFoundPage (404): both layouts in one file;
                        DemoPage (an article's demo app, full-window)
src/articles/labs/      LabsPage.jsx + labs.css: the AQ Labs gallery (the "labs" article's own page, both layouts)
src/shared/             used by both layouts:
  ArticleCard           the card (+ TagPill, TagRow)          ArticleBody   body blocks (numbered sections), FieldLog, EndMark, AuthorBox
  Reading               the article pages' progress bar + the web "in this piece" rail (lib/readProgress.js)
  TeamSection           "Meet the team" + profile card        PhotoWallSection, PhotoViewer, WordsGameSection
  HomeIntroCard         the home intro card                   AqNavSlot     placeholder for AQ's nav (AQ's look, own site)
  EndCards              the home pages' end: GameCard (Snake → Float → Fling) + EditionsCard (InsideAQ, with AQ's look)
  IntroNotebook         the opening animation (the address's edition: its cover, number, month)              ErrorBoundary crash card
  Tapes                 Clip, ByTape, FeaturedTape, LatestTag, DraftTape    Icons   Close, Chevron, Photo, Menu
  ImageSlot  Logo  BackHome                                    buddy/        Buddy (easter-egg ghost), Ghost, BuddyGames (Snake, Float,
                        Fling: Angry Birds style, matter-js physics loaded with its tab)
src/lib/                logic only, no JSX:
  base (BASE, withBase)   dom (byId, $, portalRoot, flag)   useDialogA11y
  edition (useEdition, applyLook)   layoutMode   routes   scrollMemory   animatedHistory + pageSwap (page-change animations)   cardFlight   motion (calm, LITE)   fitTitle
  byWriter (?by=)   teamLayout   photoShapes   useGallery   useWordsGame   usePresence   pauseOffscreen
  scrollLock   buddyState   introNotebook   consoleHello   format (pad2, firstName, instagramUrl, teamsOf)
  freshCode (a page from before a deploy reloads once when its lazy code is gone: wrap new React.lazy loaders in freshLoad)
src/styles/             fonts.js (FONT: the look's font variables) · fontfaces.css (the self-hosted fonts) · base.css (resets, press / focus states) · loops.css (endless animations)
                        motion.css (one-shot) · phone.css · web.css · intro.css · buddy.css
public/                 editions/<id>/ (articles/<slug>/: cover, preview, own photos · photos/: the photo wall)
                        brand/ (globe, wordmark) · team/ (faces, 400px WebP) · badges/ · fonts/ (every font, self-hosted: styles/fontfaces.css)
                        og/ (every link preview, made by tools/make-link-previews.mjs) · icons + site.webmanifest
```

## Common jobs

- **New article:**
  1. Add an entry to its edition's `ARTICLES` (`src/editions/<id>/articles.js`; fields at the top of `data/articles.js`) and put the cover in its folder: `public/editions/<id>/articles/<slug>/cover.jpg`.
  2. Run `node tools/make-card-covers.mjs` and `node tools/make-link-previews.mjs`, and commit what they write.
  - Both layouts pick it up. Phone cards past the sixth hang in pairs; the web line grows.
- **New edition** (e.g. November, `nov26`):
  1. Copy the newest folder in `src/editions/` to `src/editions/nov26/` and update its header comments; register its CSS, doodles and `LAYOUT` in `src/editions/pages.js` (copy the newest edition's entries), and add its line to `TAGLINE` in `tools/make-link-previews.mjs`.
  2. Register it in `src/editions/index.js`, and add `{ number: 3, month: 'November 2026', theme: '…', draft: true }` to `EDITIONS` (`theme`: its name on `/editions`).
  3. Fill it in: its articles, photo wall, words, team, `INTRO`, and its look (`look.js`: colours and fonts from the owner). Files go in `public/editions/nov26/`. Preview it at `/nov26` (both widths).
  4. Going live: delete `draft: true`. The previous edition moves to `/<its id>` with its own look; nothing else to change.
     Or schedule it: `live: 'YYYY-MM-DD'` in place of `draft: true` (e.g. the month's last day) and push it whenever it's ready:
     it stays a draft (its tape says when it goes live) until midnight India time that day, then goes live by itself, and
     `.github/workflows/go-live.yml` rebuilds the site that night (it needs the `VERCEL_DEPLOY_HOOK` secret; see the file).
- **New member:** add them to the edition's `MEMBERS` (`team.js`) with a square ~400px WebP in `public/team/`. The faces lay themselves out.
- **New block type in articles:**
  1. Render it in `shared/ArticleBody.jsx` (both sizes, `web` = ×1.25).
  2. Document it at the top of `data/articles.js`.
  3. Add its text to `build/staticCopy.js` and the `llms-full.txt` builder in `build/siteFiles.js`.
- **Restyle an edition:** change the values in its `look.js`. For a role that should split from another (say, a different string colour), add a new key to every edition's look (see "Editions"). For a whole new layout, give it its own pages (`src/editions/pages.js`).
- **Site address changes:** edit `SITE.url` in `data/site.js`. Nothing else hard-codes it.
