// Site-wide settings and copy, the same in every edition (an edition's own content is in src/editions/<id>/): the one
// place for the site's own address and its outside links.
// Leave a text field '' and the design's placeholder shows instead.
export const SITE = {
  instagram: 'ngo.aquaterra', // Aquaterra's handle, without the @ (web header, phone menu; the footer links nowhere)
  url: 'https://terranotes-aq.vercel.app', // this site's address: link previews, sitemap, llms.txt (env SITE_URL overrides it at build)
  website: 'https://ngoaquaterra.com', // Aquaterra's main site (llms.txt)
  footerNote: 'Kolkata · est. 2021 · 1,300+ members', // second footer line (also llms.txt)
};

// Footer banner video (shared/SiteFooter.jsx): a strip of 8 square panels side by side (8:1, e.g. 2560×320, H.264, no
// audio, under 3 MB), one per bubble. Replace the file in place and update `description` to match the new footage.
export const FOOTER_VIDEO = {
  src: '/video/footer-bubbles.mp4',
  description: 'Students and kids from AquaTerra drives waving hello',
};

// The footer bubbles' colours (shown before the video plays, and instead of it with reduced motion / LITE): Aquaterra's
// eight team colours, in roster order.
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
