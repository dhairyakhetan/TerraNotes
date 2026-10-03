// Integrating the magazine into AQ's main website (the dhairyakhetan/fah repo). Only for that job: see CLAUDE.md,
// "Integrating into AQ's website". It writes the magazine's three folders there, from this repo:
//   <frontend>/src/terranotes/      this repo's src/ (all but main.jsx, the own site's entry), with src/host.js saying
//                                   "under /terranotes, embedded" and the router package named as AQ has it
//                                   (react-router-dom), + embed/aq/README.md
//   <frontend>/public/terranotes/   this repo's public/ (all but the own site's icons and manifest), + embed/aq/public/
//                                   (the self-hosted fonts); a demo's index.html gets the <base> tag AQ needs
//   <frontend>/scripts/terranotes/  build/staticCopy.js (as staticCopy.mjs), embed/aq/scripts/ and
//                                   tools/make-link-previews.mjs, their imports pointed at src/terranotes/
// src/terranotes and scripts/terranotes are generated: replaced whole. public/terranotes only gains and updates files
// (AQ may keep files of its own there), and lists the ones this repo doesn't have.
//
//   node tools/export-aq.mjs <fah>/frontend            check, then write into a checkout of AQ's site
//   node tools/export-aq.mjs <fah>/frontend --dry      check and list what would change, write nothing
//   node tools/export-aq.mjs <fah>/frontend --verify   …then run AQ's typecheck (npx tsc -b) and routing check there
//   node tools/export-aq.mjs <fah>/frontend --patch    …and turn what changed in the three folders into one commit, as
//                                                      out/terranotes-for-aq.patch (git format-patch, made with a
//                                                      temporary index: the checkout's own index, branch and HEAD stay
//                                                      as they are), + out/terranotes-for-aq.md: how to hand it over
//                                                      (for the owner) and the prompt for Claude in fah (embed/aq/HANDOFF.md).
//                                                      Use a clean checkout of AQ's latest main. Combine with --verify.
//   node tools/export-aq.mjs                           → out/aq/ and out/terranotes-for-aq.zip, to hand over
// It first runs tools/check-embed.mjs and stops if that finds anything.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const args = process.argv.slice(2);
const DRY = args.includes('--dry'), VERIFY = args.includes('--verify'), PATCH = args.includes('--patch');
const target = args.find((a) => !a.startsWith('--'));
const DEST = path.resolve(target || path.join(ROOT, 'out/aq'));
const BASE = '/terranotes';
const FOLDERS = ['src/terranotes', 'public/terranotes', 'scripts/terranotes'];
const at = (...p) => path.join(DEST, ...p);
const files = (dir) => (fs.existsSync(dir) ? fs.readdirSync(dir, { recursive: true }).filter((f) => fs.statSync(path.join(dir, f)).isFile()) : []);
const fail = (msg) => { console.error(`export-aq: ${msg}`); process.exit(1); };

// ---- 0. checks before anything is written
const guard = spawnSync(process.execPath, [path.join(ROOT, 'tools/check-embed.mjs')], { stdio: 'inherit' });
if (guard.status !== 0) fail('tools/check-embed.mjs found problems (above). Fix them first: they would break the magazine inside AQ.');
if (target) {
  const looks = ['package.json', 'src/App.tsx', 'src/components/PublicLayout.tsx'].every((f) => fs.existsSync(at(f)));
  if (!looks) fail(`${DEST} doesn't look like AQ's frontend/ folder (no package.json, src/App.tsx, src/components/PublicLayout.tsx). Pass <fah checkout>/frontend.`);
}
if (PATCH && (!target || DRY)) fail('--patch needs a checkout of AQ\'s site (<fah>/frontend), and writes: no --dry.');
const git = (gitArgs, opts = {}) => execFileSync('git', gitArgs, { cwd: opts.cwd || DEST, env: { ...process.env, ...opts.env }, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
if (PATCH) try { git(['rev-parse', 'HEAD']); } catch { fail(`${DEST} is not inside a git checkout with a commit: --patch diffs against its HEAD.`); }

// ---- 1. what the three folders should hold: published path → contents
const SRC_SKIP = new Set(['main.jsx']); // the own site's entry
const PUBLIC_SKIP = (f) => /^(apple-touch-icon\.png|icon-\d+\.png|site\.webmanifest)$/.test(f); // the own site's icons
const want = new Map(); // relative to DEST
for (const f of files(path.join(ROOT, 'src'))) {
  if (SRC_SKIP.has(f)) continue;
  let text = fs.readFileSync(path.join(ROOT, 'src', f));
  if (f === 'host.js') {
    text = text.toString('utf8').replace(/export const HOST = \{[^}]*\};/, `export const HOST = { base: '${BASE}', embedded: true };`);
    if (!text.includes(`base: '${BASE}'`)) fail('src/host.js: could not set HOST for AQ');
  } else if (f === 'router.jsx' || f === 'lib/animatedHistory.js') {
    text = text.toString('utf8').replaceAll("from 'react-router';", "from 'react-router-dom';");
  }
  want.set(path.join('src/terranotes', f), text);
}
want.set('src/terranotes/README.md', fs.readFileSync(path.join(ROOT, 'embed/aq/README.md')));
for (const [dir, skip] of [[path.join(ROOT, 'public'), PUBLIC_SKIP], [path.join(ROOT, 'embed/aq/public'), () => false]]) {
  for (const f of files(dir)) {
    if (skip(f)) continue;
    let data = fs.readFileSync(path.join(dir, f));
    if (/(^|\/)demo\/index\.html$/.test(f)) { // AQ serves without trailing slashes: the demo's relative files need a <base>
      const html = data.toString('utf8');
      const tag = `<base href="${BASE}/${path.dirname(f)}/">`, eol = html.includes('\r\n') ? '\r\n' : '\n'; // the file's own line endings
      data = html.includes('<base ') ? html : html.replace(/<head>(\r?\n)?/i, (m) => `${m}<!-- AQ integration (tools/export-aq.mjs): AQ serves without trailing slashes, so relative paths need this -->${eol}${tag}${eol}`);
    }
    want.set(path.join('public/terranotes', f), data);
  }
}
const fromSrc = (text, up) => text.replaceAll("'../src/", `'${up}src/terranotes/`);
want.set('scripts/terranotes/staticCopy.mjs', fromSrc(fs.readFileSync(path.join(ROOT, 'build/staticCopy.js'), 'utf8'), '../../'));
for (const f of files(path.join(ROOT, 'embed/aq/scripts'))) want.set(path.join('scripts/terranotes', f), fs.readFileSync(path.join(ROOT, 'embed/aq/scripts', f)));
want.set('scripts/terranotes/tools/make-link-previews.mjs', fromSrc(fs.readFileSync(path.join(ROOT, 'tools/make-link-previews.mjs'), 'utf8'), '../../../')
  .replace("new URL(import.meta.url).pathname), '..');", "new URL(import.meta.url).pathname), '../../..');")
  .replace('node tools/make-link-previews.mjs', 'node scripts/terranotes/tools/make-link-previews.mjs'));

// ---- 2. compare with what's there
const added = [], changed = [], removed = [], kept = [];
for (const [rel, data] of want) {
  const out = at(rel);
  if (!fs.existsSync(out)) added.push(rel);
  else if (!fs.readFileSync(out).equals(Buffer.from(data))) changed.push(rel);
}
for (const folder of FOLDERS) for (const f of files(at(folder))) {
  const rel = path.join(folder, f);
  if (want.has(rel)) continue;
  (folder === 'public/terranotes' ? kept : removed).push(rel); // src / scripts are replaced whole; public keeps AQ's own
}
const list = (title, xs) => xs.length && console.log(`${title} (${xs.length}):\n  ${xs.slice(0, 40).join('\n  ')}${xs.length > 40 ? `\n  … and ${xs.length - 40} more` : ''}`);

if (DRY) {
  console.log(`export-aq --dry → ${DEST} (nothing written)`);
  list('would add', added); list('would change', changed); list('would remove', removed); list('would leave (public/terranotes files this repo doesn\'t have)', kept);
  if (!added.length && !changed.length && !removed.length) console.log('Already up to date.');
  process.exit(0);
}

// ---- 3. write
for (const folder of ['src/terranotes', 'scripts/terranotes']) fs.rmSync(at(folder), { recursive: true, force: true });
for (const [rel, data] of want) {
  const out = at(rel);
  if (rel.startsWith('public/') && !added.includes(rel) && !changed.includes(rel)) continue;
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, data);
}
console.log(`export-aq → ${DEST}: ${added.length} added, ${changed.length} changed, ${removed.length} removed.`);
list('changed', changed); list('removed', removed);
list('left as they are (public/terranotes files this repo doesn\'t have: delete them in AQ\'s repo if they\'re stale)', kept);

if (!target) {
  const zip = path.join(ROOT, 'out/terranotes-for-aq.zip');
  fs.rmSync(zip, { force: true });
  try { execFileSync('zip', ['-qr', zip, 'src', 'public', 'scripts'], { cwd: DEST }); console.log(`Zipped: ${zip}`); } catch { console.log('(no zip command here: hand over out/aq/ as it is)'); }
  process.exit(0);
}

// ---- 4. in a checkout of AQ's site: optional checks there, then what to do next (or the patch)
if (VERIFY) {
  for (const [name, cmd, cmdArgs] of [['typecheck', 'npx', ['tsc', '-b']], ['routing check', process.execPath, ['scripts/verify-routing.mjs']]]) {
    if (cmdArgs[0].endsWith('.mjs') && !fs.existsSync(at(cmdArgs[0]))) continue;
    const r = spawnSync(cmd, cmdArgs, { cwd: DEST, stdio: 'inherit' });
    console.log(`AQ ${name}: ${r.status === 0 ? 'ok' : 'FAILED (above)'}`);
    if (r.status !== 0) process.exitCode = 1;
  }
}
if (PATCH) {
  if (process.exitCode) fail('AQ\'s checks failed (above): no patch made.');
  const top = git(['rev-parse', '--show-toplevel']), folders = FOLDERS.map((f) => path.relative(top, at(f)));
  const index = path.join(ROOT, 'out', `.patch-index-${process.pid}`), env = { GIT_INDEX_FILE: index };
  fs.mkdirSync(path.join(ROOT, 'out'), { recursive: true });
  try {
    git(['read-tree', 'HEAD'], { cwd: top, env });
    git(['add', '-A', '--', ...folders], { cwd: top, env });
    const tree = git(['write-tree'], { cwd: top, env }), base = git(['rev-parse', 'HEAD'], { cwd: top });
    if (tree === git(['rev-parse', 'HEAD^{tree}'], { cwd: top })) { console.log('No changes against AQ\'s HEAD: no patch needed.'); process.exit(0); }
    const stat = git(['diff', '--shortstat', base, tree, '--', ...folders], { cwd: top });
    let source = 'working tree'; try { source = git(['rev-parse', '--short', 'HEAD'], { cwd: ROOT }) + (git(['status', '--porcelain'], { cwd: ROOT }) ? ' + uncommitted changes' : ''); } catch {}
    const date = new Date().toISOString().slice(0, 10);
    const who = (k) => { try { return git(['config', k], { cwd: top }); } catch { return ''; } };
    const id = who('user.email') ? {} : { GIT_AUTHOR_NAME: 'TerraNotes export', GIT_AUTHOR_EMAIL: 'terranotes-export@users.noreply.github.com', GIT_COMMITTER_NAME: 'TerraNotes export', GIT_COMMITTER_EMAIL: 'terranotes-export@users.noreply.github.com' };
    const msg = `TerraNotes: ${date} update (export of TerraNotes ${source})\n\nGenerated by the TerraNotes repo's tools/export-aq.mjs: only frontend/{src,public,scripts}/terranotes.\nDon't edit these folders by hand; changes go in the TerraNotes repo.\n\n${stat}\n`;
    const commit = git(['commit-tree', tree, '-p', base, '-m', msg], { cwd: top, env: id });
    const patch = execFileSync('git', ['format-patch', '-1', '--binary', '--stdout', commit], { cwd: top, maxBuffer: 1 << 30 });
    const out = path.join(ROOT, 'out/terranotes-for-aq.patch'), how = path.join(ROOT, 'out/terranotes-for-aq.md');
    fs.writeFileSync(out, patch);
    fs.writeFileSync(how, fs.readFileSync(path.join(ROOT, 'embed/aq/HANDOFF.md'), 'utf8')
      .replaceAll('{{DATE}}', date).replaceAll('{{SOURCE}}', source).replaceAll('{{BASE}}', base.slice(0, 12)).replaceAll('{{COUNTS}}', stat));
    console.log(`Patch: ${out} (${(patch.length / 1048576).toFixed(1)} MB; against fah ${base.slice(0, 12)}; ${stat})\nHand-over notes + the prompt for Claude in fah: ${how}`);
    console.log(`The files are also written in ${DEST}; to leave that checkout clean: git -C ${top} checkout -- ${folders.join(' ')} && git -C ${top} clean -fdq -- ${folders.join(' ')}`);
  } finally { fs.rmSync(index, { force: true }); }
  process.exit(0);
}
console.log(`Next, in ${DEST}:
  git status -- ${FOLDERS.join(' ')}     (only these three folders should have changed)
  npm run dev → /terranotes and an article, at 1440px and 390px
  npm run build                                       (AQ's full chain, prerender included)
  commit the three folders together; never edit them by hand there`);
