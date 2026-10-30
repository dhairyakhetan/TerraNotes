// Did an edition go live in the last 90 minutes (data/editions.js: its launch)? Prints what and writes due=yes / no to
// $GITHUB_OUTPUT, for .github/workflows/go-live.yml, which runs it every hour and rebuilds the site when one did.
// (AQ's website runs its own copy, embed/aq/scripts/go-live-due.mjs.)
import fs from 'node:fs';
import { EDITIONS, liveAt } from '../src/data/editions.js';

const now = Date.now(), due = EDITIONS.filter((e) => liveAt(e) <= now && liveAt(e) > now - 90 * 60e3).map((e) => e.month);
console.log(due.length ? `Just went live: ${due.join(', ')}` : 'Nothing went live in the last 90 minutes.');
if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `due=${due.length ? 'yes' : 'no'}\n`);
