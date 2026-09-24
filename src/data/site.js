// Site-wide copy. Leave a field '' and the design's placeholder shows instead.
export const SITE = {
  // 2–3 lines under "Notes from where the land meets the water." on the home page (the phone card fits 3, no more)
  intro: 'TerraNotes is Aquaterra’s monthly magazine: stories, research, fashion, photos and art.',
  instagram: 'ngo.aquaterra', // handle without the @ (menu only; the footer links nowhere)
  footerNote: 'Kolkata · est. 2021 · 1,300+ members', // second footer line
};

// Footer banner video: a strip of 8 square panels side by side (8:1, e.g. 2560×320), one per bubble.
// Replace the file in place (same name) and update `description` to match the new footage.
export const FOOTER_VIDEO = {
  src: '/footer-vid.mp4',
  description: 'Students and kids from AquaTerra drives waving hello',
};

// The eight team colours, in roster order: one per banner bubble. Approximate; check against the parent site.
export const ROSTER_COLORS = [
  '#1b7a4b', // welfare
  '#8b5cf6', // social
  '#0e8c8c', // collabs
  '#f5c518', // shikshaq
  '#ff3d8b', // hr
  '#3aa0f0', // events
  '#ff4a2b', // ventures
  '#000000', // crftd
];
