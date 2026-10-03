import { defineConfig } from '@playwright/test';

// The visual regression test (tests/visual/): screenshots of key pages at both layouts, compared with the ones saved in
// tests/visual/screenshots/. It guards the rule that an older edition never changes look, and catches a fix at one
// width that breaks the other. Run after `npm run build`:
//   npm run test:visual            compare (fails on a difference; the report shows before / after / diff)
//   npm run test:visual:update     save new screenshots, after a change you meant (then commit them)
// It serves dist/ itself (vite preview). In CI it runs on every push (.github/workflows/visual.yml). Locally, a
// Chromium of another version can be named with PW_CHROMIUM=/path/to/chrome.
export default defineConfig({
  testDir: 'tests/visual',
  snapshotPathTemplate: '{testDir}/screenshots/{arg}{ext}',
  timeout: 90000,
  // 0.5% of a page's pixels may differ (font smoothing varies a little between Chromium versions); a changed colour,
  // size or position anywhere on a page is more than that
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.005, animations: 'disabled', caret: 'hide' } },
  use: {
    baseURL: 'http://localhost:4173',
    reducedMotion: 'reduce', // the site's loops and entrances stand still (lib/motion.js calm)
    launchOptions: process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {},
  },
  webServer: { command: 'npm run preview -- --port 4173 --strictPort', url: 'http://localhost:4173', reuseExistingServer: !process.env.CI },
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
});
