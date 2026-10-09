// The guard against the mistakes that only show inside AQ's website (where the magazine draws in a shadow root, under
// /terranotes: CLAUDE.md "Inside AQ's website"). `npm run build` runs it first, and fails if it finds any:
//   - asking `document` for something the magazine drew (document.getElementById / querySelector): use byId / $ (lib/dom.js)
//   - a pop-up portalled into document.body: use portalRoot() (lib/dom.js)
//   - an outside-click check with e.target (inside a shadow root it's the host): use e.composedPath().includes(el)
//   - importing the router package outside router.jsx (the /terranotes prefix lives there)
//   - a file path written as a literal ('/brand/…', '/editions/…') outside the data, not wrapped in withBase()
//   - a fixed colour in shared code (colours come from the edition's look: var(--ink)…)
//   - CSS that keys on <html> to style the page (html[data-…] .x, html.x .y) without a :host(…) twin, or :root without
//     :host; and the old names (.lite, data-nav)
// A line that really needs one of these (a document-level element, say) ends with the comment: embed-ok
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const SRC = path.join(ROOT, 'src');
const all = fs.readdirSync(SRC, { recursive: true }).filter((f) => fs.statSync(path.join(SRC, f)).isFile());
const problems = [];
const report = (f, n, why, line) => problems.push(`src/${f}:${n}  ${why}\n    ${line.trim().slice(0, 140)}`);

const ROUTER_OK = new Set(['router.jsx', 'lib/animatedHistory.js', 'main.jsx']);
const COLOURS_OK = (f) => /^(editions|data|articles\/labs)\//.test(f) || f === 'lib/consoleHello.js';
const PATHS_OK = (f) => /^(editions|data)\//.test(f);
const ASSET = /(['"`])\/(brand|team|badges|editions|fonts|video|og)\//g;

for (const f of all.filter((x) => /\.(jsx?|mjs)$/.test(x))) {
  fs.readFileSync(path.join(SRC, f), 'utf8').split('\n').forEach((line, i) => {
    const n = i + 1;
    if (/embed-ok/.test(line)) return;
    const code = line.replace(/\/\/.*$/, '');
    if (/^\s*(\/\/|\*)/.test(line)) return; // comments
    if (/document\.(getElementById|querySelector|querySelectorAll)\(/.test(code)) report(f, n, 'asks document for an element: byId / $ from lib/dom.js', line);
    if (/createPortal\([\s\S]*document\.body/.test(code)) report(f, n, 'portal into document.body: portalRoot() from lib/dom.js', line);
    if (/contains\(\s*(e|ev|event)\.target\s*\)/.test(code)) report(f, n, 'outside-click check with e.target: e.composedPath().includes(el)', line);
    if (/from\s+['"]react-router(-dom)?['"]/.test(code) && !ROUTER_OK.has(f)) report(f, n, "router import: take it from router.jsx", line);
    if (/dataset\.nav\b|classList\.add\('lite'\)/.test(code)) report(f, n, "old flag name: data-tn-nav / tn-lite (lib/dom.js flag())", line);
    if (!COLOURS_OK(f) && /#[0-9A-Fa-f]{6}\b|['"]#[0-9A-Fa-f]{3}['"]/.test(code)) report(f, n, 'fixed colour: use the look (var(--ink)…, src/editions/<id>/look.js)', line);
    if (!PATHS_OK(f)) for (const m of code.matchAll(ASSET)) if (!/withBase\($/.test(code.slice(0, m.index))) report(f, n, 'file path literal: wrap it in withBase() (lib/base.js)', line);
  });
}

for (const f of all.filter((x) => x.endsWith('.css') && x !== 'styles/document.css')) {
  const css = fs.readFileSync(path.join(SRC, f), 'utf8').replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, ' '));
  for (const m of css.matchAll(/([^{}]+)\{/g)) {
    const sel = m[1].trim(), n = css.slice(0, m.index).split('\n').length + (m[1].match(/^\s*/)[0].split('\n').length - 1);
    if (!sel || sel.startsWith('@')) continue;
    const parts = sel.split(',').map((s) => s.trim());
    if (parts.some((p) => p === ':root') && !parts.some((p) => p === ':host')) report(f, n, ':root without :host (inside AQ the variables live on the shadow host)', sel);
    if (parts.some((p) => /^html[.[][^ ]*\s+\S/.test(p)) && !parts.some((p) => p.startsWith(':host('))) report(f, n, 'styles the page from <html> without a :host(…) twin', sel);
    if (parts.some((p) => /(^|\s)\.lite\b|\[data-nav\]/.test(p))) report(f, n, 'old flag name: .tn-lite / [data-tn-nav]', sel);
  }
}

if (problems.length) {
  console.error(`check-embed: ${problems.length} problem(s) that would break the magazine inside AQ's website:\n\n${problems.join('\n')}\n\n(CLAUDE.md, "Inside AQ's website". A line that really needs it ends with the comment: embed-ok)`);
  process.exitCode = 1; // (not process.exit: that can cut a long report short)
} else console.log('check-embed: ok');
