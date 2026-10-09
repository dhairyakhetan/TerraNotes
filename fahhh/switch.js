// The fahhh switch. true: the whole site is just the fahhh page (fahhh/index.html): every address shows it, with its
// own title and link preview (fahhh/og.png), and none of the magazine is built. false: the magazine, as normal.
// Flip it here and push, or, without touching code, set the environment variable FAHHH to 1 (on) or 0 (off) in Vercel
// (Project → Settings → Environment Variables) and redeploy: the variable wins over this line.
// Read at build time by tools/build.mjs (npm run build).
export const FAHHH = false;
