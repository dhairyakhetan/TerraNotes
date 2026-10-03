import { test, expect } from '@playwright/test';

// Key pages at both layouts (390px phone with touch, 1440px web), whole-page screenshots. Each page is made
// repeatable first: Math.random is seeded (the words game's order, Buddy's tricks), the fonts and every lazy image are
// in (the page is scrolled through once), and the few things that come and go on a timer are masked (Buddy, the
// diary's writing). The latest edition's pages, and an older edition's (/sep26), which must never change.
const PAGES = {
  home: '/',
  article: '/articles/pandal-hopping-field-guide',
  'sep26-home': '/sep26',
  'sep26-article': '/sep26/articles/exam-stress',
};
const LAYOUTS = {
  phone: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 },
  web: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
};

const seedRandom = () => {
  let s = 20261001;
  Math.random = () => { // mulberry32
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

for (const [layout, device] of Object.entries(LAYOUTS)) {
  test.describe(layout, () => {
    test.use(device);
    for (const [name, path] of Object.entries(PAGES)) {
      test(name, async ({ page }) => {
        await page.addInitScript(seedRandom);
        await page.goto(path, { waitUntil: 'networkidle' });
        await page.evaluate(async () => {
          await document.fonts.ready;
          for (let y = 0; y < document.documentElement.scrollHeight; y += 600) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
          scrollTo(0, 0);
          // every picture, including lazy ones off to the side (the web article line scrolls sideways): fetch now, wait for all
          const imgs = [...document.images];
          imgs.forEach((img) => { img.loading = 'eager'; });
          await Promise.race([Promise.all(imgs.map((img) => (img.complete ? null : new Promise((r) => { img.onload = img.onerror = r; })))), new Promise((r) => setTimeout(r, 15000))]);
        });
        await page.waitForTimeout(400);
        await expect(page).toHaveScreenshot(`${layout}-${name}.png`, {
          fullPage: true,
          mask: [page.locator('.buddy-call, .buddy-ghost, .buddy-bubble, .diary-line')],
        });
      });
    }
  });
}
