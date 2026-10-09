// npm run build. Builds the site the fahhh switch asks for (fahhh/switch.js; env FAHHH=1 / 0 overrides it):
//   off: the magazine, as always: the AQ guard (tools/check-embed.mjs), then vite build (pages, sitemap, previews…)
//   on:  only the fahhh page: dist/ gets fahhh/index.html (its %SITE_URL% filled, like the magazine's index.html) and
//        its link preview, fahhh/og.png. vercel.json sends every other address to /, so every address shows it.
import { spawnSync } from 'node:child_process';
import { copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { FAHHH } from '../fahhh/switch.js';
import { SITE } from '../src/data/site.js';

const env = process.env.FAHHH;
const on = env === undefined || env === '' ? FAHHH : !/^(0|false|off|no)$/i.test(env);

if (on) {
  const host = (process.env.SITE_URL || SITE.url).replace(/\/$/, '');
  rmSync('dist', { recursive: true, force: true });
  mkdirSync('dist');
  writeFileSync('dist/index.html', readFileSync('fahhh/index.html', 'utf8').replaceAll('%SITE_URL%', host));
  copyFileSync('fahhh/og.png', 'dist/og.png');
  writeFileSync('dist/robots.txt', 'User-agent: *\nAllow: /\n');
  console.log(`fahhh is on: built only the fahhh page (${host})`);
} else {
  const run = (cmd, args) => { const r = spawnSync(cmd, args, { stdio: 'inherit', shell: process.platform === 'win32' }); if (r.status !== 0) process.exit(r.status ?? 1); };
  run('node', ['tools/check-embed.mjs']);
  run('npx', ['vite', 'build']);
}
