// AQ's own navigation, which the magazine's header carries (shared/AQNav.jsx; web/WebHeader.jsx, phone/PhoneHeader.jsx):
// the magazine sits inside AQ's nav as its "terra notes" item, opened up into the magazine's own sections.
// These mirror AQ's AQNav.tsx (the laptop pill's links) and MobileMenuBar.tsx (the phone dock, PUBLIC_ITEMS) in the
// dhairyakhetan/fah repo. Paths are AQ's own; on the magazine's own site they lead to AQ's site (SITE.website + path),
// inside AQ's website they are AQ's routes.
//
// FOR CLAUDE IN AQ'S REPO: when AQ's nav changes (a link added, renamed, reordered), change it here too, then export.
// The signed-in variants (AQ's AUTH_ITEMS: feed / explore / alerts / teams, the HoD desk) are not here yet: see the
// 'aq-nav' event in shared/AQNav.jsx for how AQ's own code can take over those parts.
export const AQ_TOP = [ // laptop pill, before the magazine's own item
  { path: '/', label: 'home', icon: 'wave' },
  { path: '/projects', label: 'projects', icon: 'bolt' },
  { path: '/teams', label: 'teams', icon: 'flag' },
];

export const AQ_DOCK = [ // phone dock, in order; 'notes' is the magazine itself (it opens the magazine's menu)
  { path: '/', label: 'home', icon: 'home' },
  { path: '/projects', label: 'projects', icon: 'map' },
  { path: '/teams', label: 'teams', icon: 'user' },
  { path: '/blog', label: 'blog', icon: 'book' },
  { notes: true, label: 'notes', icon: 'news' },
  { path: '/about', label: 'about', icon: 'globe' },
];

// The placeholder actions on the right of AQ's bar. Each one fires the 'aq-nav' event; until AQ's code answers it,
// it opens `fallback` on AQ's site. See shared/AQNav.jsx.
export const AQ_ACTIONS = {
  search: { label: 'Search', fallback: '/' }, // AQ: its search overlay (AQNav.tsx, the Search button)
  account: { label: 'Log in', fallback: '/login' }, // AQ: "log in" signed out; the avatar + profile menu signed in
  menu: { label: 'Menu', fallback: '/links' }, // AQ: the ⋯ mega menu (laptop) / drawer (phone)
};
