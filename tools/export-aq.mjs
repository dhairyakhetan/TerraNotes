// Writes the magazine's three folders in AQ's main website (the dhairyakhetan/fah repo), from this repo:
//   <dest>/src/terranotes/      this repo's src/ (all but main.jsx, the own site's entry), with src/host.js saying
//                               "under /terranotes, embedded" and the router package named as AQ has it
//                               (react-router-dom), + embed/aq/README.md
//   <dest>/public/terranotes/   this repo's public/ (all but the own site's icons, manifest and footer video), +
//                               embed/aq/public/ (the self-hosted fonts); a demo's index.html gets the <base> tag AQ needs
//   <dest>/scripts/terranotes/  build/staticCopy.js (as staticCopy.mjs), embed/aq/scripts/ (prerender.mjs, tools/) and
//                               tools/make-link-previews.mjs, their imports pointed at src/terranotes/
// src/terranotes and scripts/terranotes are written from scratch (they're generated: nothing to keep there).
// public/terranotes only gains and updates files: AQ makes some there itself (cover-card.webp), so nothing is deleted;
// the files it has that this repo doesn't are listed at the end, to check.
//   node tools/export-aq.mjs                 → out/aq/ (and out/terranotes-for-aq.zip), to hand over
//   node tools/export-aq.mjs ../fah/frontend → straight into a checkout of AQ's site, then commit there
// See CLAUDE.md, "Inside AQ's website".
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const DEST = path.resolve(process.argv[2] || path.join(ROOT, 'out/aq'));
const BASE = '/terranotes';
const at = (...p) => path.join(DEST, ...p);
const files = (dir) => (fs.existsSync(dir) ? fs.readdirSync(dir, { recursive: true }).filter((f) => fs.statSync(path.join(dir, f)).isFile()) : []);
const write = (file, data) => { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, data); };

// the own site only: its entry and its home-screen icons / footer video (AQ has its own)
const SRC_SKIP = new Set(['main.jsx']);
const PUBLIC_SKIP = (f) => /^(apple-touch-icon\.png|icon-\d+\.png|site\.webmanifest|video\/)/.test(f);

// ---- src/terranotes
fs.rmSync(at('src/terranotes'), { recursive: true, force: true });
for (const f of files(path.join(ROOT, 'src'))) {
  if (SRC_SKIP.has(f)) continue;
  let text = fs.readFileSync(path.join(ROOT, 'src', f));
  if (f === 'host.js') {
    text = fs.readFileSync(path.join(ROOT, 'src', f), 'utf8').replace(/export const HOST = \{[^}]*\};/, `export const HOST = { base: '${BASE}', embedded: true };`);
    if (!text.includes(`base: '${BASE}'`)) throw new Error('src/host.js: could not set HOST for AQ');
  } else if (f === 'router.jsx' || f === 'lib/animatedHistory.js') {
    text = fs.readFileSync(path.join(ROOT, 'src', f), 'utf8').replaceAll("from 'react-router';", "from 'react-router-dom';");
  }
  write(at('src/terranotes', f), text);
}
write(at('src/terranotes/README.md'), fs.readFileSync(path.join(ROOT, 'embed/aq/README.md')));

// ---- public/terranotes (add and update only)
const pub = at('public/terranotes');
const ours = new Set();
for (const [dir, list] of [[path.join(ROOT, 'public'), files(path.join(ROOT, 'public'))], [path.join(ROOT, 'embed/aq/public'), files(path.join(ROOT, 'embed/aq/public'))]]) {
  for (const f of list) {
    if (dir.endsWith('/public') && dir === path.join(ROOT, 'public') && PUBLIC_SKIP(f)) continue;
    ours.add(f);
    let data = fs.readFileSync(path.join(dir, f));
    if (/(^|\/)demo\/index\.html$/.test(f)) { // AQ serves without trailing slashes: the demo's relative files need a <base>
      const html = data.toString('utf8');
      const tag = `<base href="${BASE}/${path.dirname(f)}/">`, eol = html.includes('\r\n') ? '\r\n' : '\n'; // the file's own line endings
      data = html.includes('<base ') ? html : html.replace(/<head>(\r?\n)?/i, (m) => `${m}<!-- AQ integration (tools/export-aq.mjs): AQ serves without trailing slashes, so relative paths need this -->${eol}${tag}${eol}`);
    }
    const out = path.join(pub, f);
    if (!fs.existsSync(out) || !fs.readFileSync(out).equals(Buffer.from(data))) write(out, data);
  }
}
const extra = files(pub).filter((f) => !ours.has(f) && !/cover-card\.webp$|preview-[0-9a-f]{8}\.jpg$/.test(f));

// ---- scripts/terranotes
fs.rmSync(at('scripts/terranotes'), { recursive: true, force: true });
const fromSrc = (text, up) => text.replaceAll("'../src/", `'${up}src/terranotes/`);
write(at('scripts/terranotes/staticCopy.mjs'), fromSrc(fs.readFileSync(path.join(ROOT, 'build/staticCopy.js'), 'utf8'), '../../'));
for (const f of files(path.join(ROOT, 'embed/aq/scripts'))) write(at('scripts/terranotes', f), fs.readFileSync(path.join(ROOT, 'embed/aq/scripts', f)));
write(at('scripts/terranotes/tools/make-link-previews.mjs'), fromSrc(fs.readFileSync(path.join(ROOT, 'tools/make-link-previews.mjs'), 'utf8'), '../../../')
  .replace("new URL(import.meta.url).pathname), '..');", "new URL(import.meta.url).pathname), '../../..');")
  .replace('node tools/make-link-previews.mjs', 'node scripts/terranotes/tools/make-link-previews.mjs'));

console.log(`Wrote ${DEST}/src/terranotes, public/terranotes and scripts/terranotes.`);
if (extra.length) console.log(`public/terranotes also has files this repo doesn't (left as they are):\n  ${extra.join('\n  ')}`);
if (!process.argv[2]) {
  const zip = path.join(ROOT, 'out/terranotes-for-aq.zip');
  fs.rmSync(zip, { force: true });
  try { execFileSync('zip', ['-qr', zip, 'src', 'public', 'scripts'], { cwd: DEST }); console.log(`Zipped: ${zip}`); } catch { /* no zip on this machine */ }
}
