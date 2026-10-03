# TerraNotes → AQ's website: patch {{DATE}}

`terranotes-for-aq.patch` updates the magazine inside AQ's website (`dhairyakhetan/fah`, at `/terranotes`) to
TerraNotes `{{SOURCE}}`. It was made by `node tools/export-aq.mjs <fah>/frontend --patch` against fah commit
`{{BASE}}`, and only touches AQ's three generated folders:
`frontend/src/terranotes/`, `frontend/public/terranotes/`, `frontend/scripts/terranotes/` ({{COUNTS}}).

---

## For you (the owner)

1. Download `terranotes-for-aq.patch` (and this file, if you like).
2. Open Claude Code on **AQ's repo**, `dhairyakhetan/fah` (claude.ai/code or your own machine), not on TerraNotes.
3. In a new message, **attach the `.patch` file** and paste the prompt below (everything inside the box).
4. Claude applies it on a new branch, runs AQ's checks and build, looks at the pages and reports back. Have a look
   yourself on its preview (Vercel builds the branch), then merge the PR it opens (or tell it to push to `main`).
5. If Claude says the patch didn't apply or a check failed: don't let it fix the magazine inside fah. Bring what it
   says back to the TerraNotes session; the fix goes in TerraNotes and you get a new patch.

## The prompt for Claude in fah

```text
Attached is terranotes-for-aq.patch: an update of the TerraNotes magazine (frontend/src/terranotes,
frontend/public/terranotes, frontend/scripts/terranotes), exported from the TerraNotes repo. Those three folders are
generated: never edit them by hand, and don't change any other file for this. Please:

1. Start from an up-to-date main: `git checkout main && git pull`, then a new branch `terranotes-{{DATE}}`.
2. Apply it, keeping its commit: `git am --3way <path to the patch>`.
   - It was made against fah commit {{BASE}}. If main has moved, --3way handles it.
   - If it stops on a conflict, it can only be inside those three folders; take the patch's version there
     (`git checkout --theirs -- <the conflicted paths>`, `git add` them, `git am --continue`).
   - If it still can't apply, stop: `git am --abort`, and tell me what it said. Don't hand-edit anything.
3. Check that the commit only touches the three folders: `git show --stat HEAD`.
4. In frontend/: install if needed (`npm ci`), then `npx tsc -b`, `node scripts/verify-routing.mjs` and
   `npm run build` (the whole chain, prerender included). All must pass.
5. `npm run dev` and look at /terranotes, /terranotes/sep26, an article and /terranotes/articles/labs at 1440px and
   390px wide (phone: emulate touch). AQ's own nav and phone dock must be on top, the magazine under them, no console
   errors. frontend/src/terranotes/README.md explains how the magazine sits inside AQ; the top of
   frontend/src/terranotes/shared/AqNavSlot.jsx lists what AQ's own code has to keep doing for it (keep it so).
6. Push the branch and open a PR to main titled "TerraNotes: {{DATE}} update". In the PR body, list what you checked.
   If anything failed, don't patch the magazine here: tell me exactly what failed (command + output) and stop.
```
