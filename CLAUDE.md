# TerraNotes (Aquaterra's monthly digital magazine): guide for Claude

Vite + React 19 + React Router 8, static site on Vercel. No backend, no UI library, no CSS framework. All content
lives in `src/data/`. Every file starts with a comment saying what it does; read that before editing it.

## Commands

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # → dist/ (also writes per-article HTML, sitemap, robots, 404, llms.txt: build/siteFiles.js)
npm run preview  # serve dist/ on :4173
node tools/make-link-previews.mjs   # after adding an article / changing a cover (needs `npm i -D playwright`)
```

There are no automated tests. Verify changes in a real browser at **both** widths: 390px (phone layout, emulate
touch) and 1440px (web layout). Also check reduced motion, `?lite` (low-end mode) and `?intro` (forces the opening
animation). Automated browsers never get the intro.

## House rules (from the owner)

- **The footer links nowhere.** It has no links, by design.
- **The console hello must never name anyone.**
- **Writers' article text is verbatim, typos included.** Never "fix" it.
- **No new colours** outside the palette below, unless the owner supplies them. The AQ Labs project bars use colours they supplied.
- **Commit to `main`** unless told otherwise.

## Layout model

Two separate layouts, chosen by window width (`lib/layoutMode.js`, `useIsWeb()`):

| | Phone (`src/phone/`) | Web (`src/web/`) |
|---|---|---|
| Width | fixed **390px**. Phones and upright tablets are pinned to it by the viewport tag in `index.html` | fixed **1440px**, drawn with CSS `zoom: var(--web-zoom)` to fit narrower windows (900px and up) |
| Header | `PhoneHeader` (64px, sticky) + slide-in `PhoneMenu` | `WebHeader` (80px, sticky; inner pages: "← back to home" left, logo + edition picker centred, gliding over when that changes) |

- **Home pages are artboards.** Everything under the header is `position: absolute` at design coordinates (px).
  - Sections export their heights so the page grows with the data: `HANG_EXTRA` (PhoneHangingArticles) and `TEAM_HEIGHT` (TeamSection).
  - When a section grows, move what's below it; don't reflow.
- **Article, editions and 404 pages** are in normal document flow.
- **Addresses follow the editions** (`data/editions.js`; each edition's id comes from its month, `sep26`):
  - latest edition: `/articles/<slug>`; older ones: `/<id>/articles/<slug>` and `/<id>` for the edition itself.
  - Build links with `articleLink(a)` / `editionLink(n)`, never by hand. A new edition moves the old links by itself; either address of an article redirects to its current one (`App.jsx`).
- **Files follow the editions too:** `public/editions/<id>/` holds that edition's files, latest or not. Each article has a folder, `public/editions/<id>/articles/<slug>/`: `cover.jpg`, `preview.jpg` (link preview, made by the tool) and any photos of its own (`articleFolder(a)`). The photo wall's pictures are in `public/editions/<id>/photos/`.
- **An article can have its own page** instead of the usual layout: `page: 'labs'` in its data and an entry in `PAGES` (`App.jsx`). It lives in `src/articles/<name>/`.
  - Its `body` is still what crawlers and AIs read.
  - It gets no card flight (no cover to land on; `flight()` in `lib/cardFlight.js`), just the crossfade.
  - **AQ Labs** (`src/articles/labs/`, the "labs" article) is the AQ Labs team's own gallery site, ported. It keeps their look on purpose: their fonts (`public/fonts/`, JetBrains Mono from Google Fonts), their palette and rounded pills. Don't restyle it into the magazine's design.
  - Its CSS (`labs.css`) is scoped to `.labs`. Its class names must not match any in `src/styles/` (it had to rename `.intro` and `.orbit`). Its loops keep the motion rules below, inside `labs.css`: transform / opacity only, stopped by reduced motion, `.lite`, `.off-screen` and `html[data-nav]`.
- **Shared components** (`src/shared/`) take a `web` prop (or `look`) and keep a `PHONE` / `WEB` table of positions and sizes. Change a value in the right table; don't fork the component.
- **The home page also answers at `/articles`, `/photos`, `/words` and `/members`** and scrolls to that section: element ids `articles`, `photos`, `words`, `members`. See `lib/routes.js` and `lib/scrollMemory.js`.
- **Styling is inline** (`style={{ … }}` with string values like `"12px"`), matching the existing code.
  - CSS files only hold what inline styles can't: `:active` / `:hover`, keyframes, and shared classes.
  - Fonts come from `FONT` in `src/styles/fonts.js`. Never retype a font stack.

## Design system

The site is "notes pegged on a line": paper cards hanging from strings, with ink borders, hard shadows, tape and handwriting.

**Palette** (use these, nothing else):

| Role | Colour |
|---|---|
| page | `#F3EEE4` (outside the artboard: `#E6E0D3`) |
| cards | `#FFFFFF` (soft cream `#FBF8F1`) |
| ink / borders | `#111111` |
| body text | `#1E2723` |
| handwriting | `#5B3A1E` (deks `#5B4630`) |
| string / wire | `#5B3A1E` / `#8E7A5E` |
| accents | yellow `#F7C21A`, red `#F0442B`, blue `#3DA5F4`, green `#1E7A4C`, purple `#7B5CE6`, pink `#EE4E8A`, mint `#7FC49B` |
| photo wall | panel `#1C2622`, amber shadow `#E9A23B` |

Tag colours are in `TAGS` (`data/articles.js`) and team colours in `TEAMS` (`data/team.js`).

**Type** (`FONT`):

| Name | Font | Use |
|---|---|---|
| `head` | Archivo Black | uppercase headings, titles, big numbers |
| `mono` | Space Mono | uppercase labels, meta lines and buttons, letter-spacing ~1–1.8px |
| `hand` | Caveat | handwritten notes, deks, captions, "you're here" |
| `serif` | Instrument Serif | "Photo wall", "TerraNotes", the intro headline |
| `body` | Figtree | UI text |
| `read` | Newsreader | article paragraphs |

**Shapes:**
- **Borders:** always `2px solid #111111`; 1.5px on small bits.
- **Shadows:** hard, no blur: `Npx Npx 0 <colour>`, 3–4px on buttons, 6–12px on cards. The colour carries meaning: black by default, the tag or team colour, yellow for featured.
- **Tilt:** things sit slightly crooked, `rotate(±0.5–3deg)`.
- **Corners:** square, except pills (`borderRadius: 999px`), faces (circles), the photo wall panel and the AQ Labs project bars.
- **Hanging:** a 1.4px `#5B3A1E` string plus a coloured `<Clip>` (`shared/Tapes.jsx`) on the card's top edge.
- **Tapes:** yellow with an ink border: `<ByTape>` "by <writer>", `<FeaturedTape>` "★ featured", `<LatestTag>`.
- **Placeholders:** empty data shows a dashed placeholder (`ImageSlot`) or `[bracketed text]`. Keep that behaviour.

**Buttons.** Every tap target is ≥ 44px tall.

| Kind | Style |
|---|---|
| primary | `background: "#111111", color: "#FFFFFF", border: "2px solid #111111", boxShadow: "4px 4px 0 #F7C21A"`, mono 700 11–12px uppercase, letter-spacing 1px, `minHeight: "44px", padding: "0 18px"` |
| secondary | white background, ink text, `boxShadow: "4px 4px 0 #111111"` |
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
  - Add every new loop class to the reduced-motion rule, the `.lite` rule and the `html[data-nav]` pause rule there.
  - Wrap a section in `usePauseOffscreen(ref)` so its loops stop when it's scrolled away.
- **One-shot animations** go in `styles/motion.css`. Entrances animate the `translate` / `rotate` / `scale` properties (not `transform`) so elements keep their tilt.
- **JS animation** must check `calm()` (reduced motion) from `lib/motion.js`. For per-frame work, run `requestAnimationFrame` only while something moves. `web/WebArticleLine.jsx` is the model.
- **`LITE`** (low-end devices: ≤2 GB memory, ≤2 cores, Data Saver, or `?lite`) stops every loop and the footer video.
- **Page changes** go through `lib/animatedHistory.js`. A card link flies (`lib/cardFlight.js`); anything else crossfades.

## Where things are

```
index.html              meta / link-preview tags (%SITE_URL% filled at build), fonts, viewport switch, no-JS notice
vite.config.js          plugins: React, %SITE_URL%, build/siteFiles.js
build/siteFiles.js      at build: an .html per article at its address (own title + preview image), section pages, 404, sitemap, robots, llms.txt
build/staticCopy.js     each page's text as plain HTML inside #root, for crawlers without JavaScript
tools/make-link-previews.mjs   preview.jpg in each article's folder (1200×630 link preview)
src/main.jsx            entry: router with the animated history, intro, lite class, console hello, all CSS imports (labs.css last)
src/App.jsx             routes (phone vs web page per route, articles with their own page: PAGES, address redirects), skip link,
                        scroll memory, error card, footer, games popup
src/data/               ALL content (each file documents its fields at the top)
  site.js               site URL, Aquaterra website + Instagram, intro line, footer note, footer video, bubble colours
  articles.js           TAGS, ALL_ARTICLES (body block formats at the top), ARTICLES (latest edition), placeOf()
  editions.js           EDITIONS (newest last), LATEST, editionId, articleLink, editionLink, articleFolder
  team.js               TEAMS, MEMBERS (photo, bio, instagram, credit, crown, badge)
  photos.js  words.js   photo wall; words game
src/phone/              PhoneHome, PhoneHangingArticles (the strung-up cards), PhoneArticle, PhoneHeader, PhoneMenu
src/web/                WebHome, WebArticleLine (sideways wire), WebArticle, WebHeader, WebEditionPicker
src/pages/              EditionsPage (/editions, /<id> e.g. /sep26), NotFoundPage (404): both layouts in one file
src/articles/labs/      LabsPage.jsx + labs.css: the AQ Labs gallery (the "labs" article's own page, both layouts)
src/shared/             used by both layouts:
  ArticleCard           the card (+ TagPill, TagRow)          ArticleBody   body blocks, FieldLog, AuthorBox
  TeamSection           "Meet the team" + profile card        PhotoWallSection, PhotoViewer, WordsGameSection
  HomeIntroCard         the home intro card                   SiteFooter    orbit banner (video bubbles) + footer bar
  IntroNotebook         the opening animation                 ErrorBoundary crash card
  Tapes                 Clip, ByTape, FeaturedTape, LatestTag  Icons         Globe, Instagram, Close, Chevron, Photo, Menu
  ImageSlot  Logo  BackHome                                    buddy/        Buddy (easter-egg ghost), Ghost, BuddyGames
src/lib/                logic only, no JSX:
  layoutMode   routes   scrollMemory   animatedHistory   cardFlight   motion (calm, LITE)   fitTitle
  byWriter (?by=)   teamLayout   photoShapes   useGallery   useWordsGame   usePresence   pauseOffscreen
  scrollLock   buddyState   introNotebook   consoleHello   format (pad2, firstName, instagramUrl)
src/styles/             fonts.js (FONT) · base.css (resets, press / focus states) · loops.css (endless animations)
                        motion.css (one-shot) · phone.css · web.css · footer.css · intro.css · buddy.css
public/                 editions/<id>/ (articles/<slug>/: cover, preview, own photos · photos/: the photo wall)
                        brand/ (globe, wordmark) · team/ (faces, 400px WebP) · badges/ · fonts/ (AQ Labs' own fonts)
                        video/footer-bubbles.mp4 · og/home.jpg (home link preview, made by hand) · icons + site.webmanifest
```

## Common jobs

- **New article:**
  1. Add an entry to `ALL_ARTICLES` (fields at the top of `data/articles.js`) and put the cover in its folder: `public/editions/<id>/articles/<slug>/cover.jpg`.
  2. Run `node tools/make-link-previews.mjs`.
  - Both layouts pick it up. Phone cards past the sixth hang in pairs; the web line grows.
- **New edition:** add it to `EDITIONS`, then set its articles' `edition` and put their files in `public/editions/<new id>/`. The previous edition's links move under its id by themselves; nothing else to change.
- **New member:** add them to `MEMBERS` with a square ~400px WebP in `public/team/`. The faces lay themselves out.
- **New block type in articles:**
  1. Render it in `shared/ArticleBody.jsx` (both sizes, `web` = ×1.25).
  2. Document it at the top of `data/articles.js`.
  3. Add its text to `build/staticCopy.js` and the `llms-full.txt` builder in `build/siteFiles.js`.
- **Site address changes:** edit `SITE.url` in `data/site.js`. Nothing else hard-codes it.
