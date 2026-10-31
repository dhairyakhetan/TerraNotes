import { chromium } from 'playwright';
const S = process.argv[2], B = 'https://www.ngoaquaterra.com';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined });
for (const [label, at] of [['now', null], ['17:44', '2026-10-31T17:44:00+05:30'], ['17:46', '2026-10-31T17:46:00+05:30'], ['18:01', '2026-10-31T18:01:00+05:30']]) for (const [w, h, touch] of [[390, 844, true], [1440, 900, false]]) {
  const c = await b.newContext({ viewport: { width: w, height: h }, hasTouch: touch, isMobile: touch });
  if (at) await c.addInitScript((t) => { const off = t - Date.now(); const N = Date.now; Date.now = () => N() + off; const D = Date; globalThis.Date = class extends D { constructor(...a) { super(...(a.length ? a : [D.now()])); } static now() { return D.now(); } }; }, Date.parse(at));
  const out = [];
  for (const path of ['/', '/terranotes', '/terranotes/oct26', '/terranotes/sep26', '/terranotes/articles/whispers-in-the-weave']) {
    const p = await c.newPage(); const errs = []; let reloads = 0;
    p.on('pageerror', (e) => errs.push(e.message.slice(0, 80)));
    p.on('framenavigated', (f) => { if (f === p.mainFrame()) reloads++; });
    await p.goto(B + path, { waitUntil: 'load', timeout: 60000 }); await p.waitForTimeout(4000);
    const i = await p.evaluate(() => { const hst = [...document.querySelectorAll('*')].find((e) => e.shadowRoot); const txt = document.body.innerText; const m = txt.match(/(out today[^\n]{0,40}|october issue is out[^\n]{0,30}|\d+\s*(h|hr|min|m)\b[^\n]{0,30})/i); return { at: location.pathname, ed: hst?.dataset.edition || '-', counter: m ? m[0].slice(0, 50) : '' }; });
    out.push(`${path}→${i.at}[${i.ed}]${i.counter ? ' «' + i.counter + '»' : ''}${reloads > 1 ? ' navs=' + reloads : ''}${errs.length ? ' ERR ' + errs[0] : ''}`);
    if (path === '/' && w === 1440) await p.screenshot({ path: `${S}/cd-${label.replace(':', '')}.png` });
    await p.close();
  }
  console.log(label, w, '\n   ' + out.join('\n   '));
  await c.close();
}
await b.close();
