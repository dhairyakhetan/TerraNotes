// For AQ's website: did a TerraNotes edition go live in the last 90 minutes (src/terranotes/data/editions.js: its
// launch, by default 8 pm India time on the last day of its month)? Prints what and writes due=yes / no to
// $GITHUB_OUTPUT. AQ's .github/workflows/terranotes-go-live.yml (a copy of terranotes-go-live.yml beside this file)
// runs it every hour and rebuilds the site when one did, so its prerendered pages, link previews and sitemap catch up.
// Written by the TerraNotes repo (embed/aq/scripts/, copied here by tools/export-aq.mjs): edit it there.
import fs from 'node:fs';
import { EDITIONS, liveAt } from '../../src/terranotes/data/editions.js';

const now = Date.now(), due = EDITIONS.filter((e) => liveAt(e) <= now && liveAt(e) > now - 90 * 60e3).map((e) => e.month);
console.log(due.length ? `Just went live: ${due.join(', ')}` : 'Nothing went live in the last 90 minutes.');
if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `due=${due.length ? 'yes' : 'no'}\n`);
