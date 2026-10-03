// Where this copy of TerraNotes runs. The magazine has two homes with the same code:
//   - its own site (this repo's build: index.html + main.jsx), at the root of its own address;
//   - AQ's main website, drawn inside a shadow root under /terranotes (embed/aq/, CLAUDE.md "Inside AQ's website").
// This file is what differs between them: `node tools/export-aq.mjs` writes AQ's version (and names the router package
// as AQ has it, react-router-dom, in router.jsx and lib/animatedHistory.js).
//   base:     the path the magazine lives under ('' = the site's root; AQ: '/terranotes'): lib/base.js
//   embedded: drawn inside another site's page (AQ, with its own nav, footer and skip link): no skip link, footer or
//             console hello of its own, and the AQ-only touches (styles with :host, the phone call button)
export const HOST = { base: '', embedded: false };
