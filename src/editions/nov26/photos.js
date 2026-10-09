// November 2026's photo wall (its home page) and its "See every photo" viewer, in order.
//   photo: put the picture in public/editions/<edition id>/photos/ and write its path, e.g. '/editions/nov26/photos/terrace.jpg'
//   tint:  colour shown in its place until there is a photo
// Leave caption '' and the design's placeholder shows instead; with no place, the viewer just says "Highlight 01".
// The drawn ones come from tools/art/nov26.mjs: swap in real photos at the same paths.

export const PHOTOS = [
  { photo: '/editions/nov26/photos/fireworks.webp', caption: 'The sky on Kali Puja', place: 'from a rooftop', tint: '#1E2866' },
  { photo: '/editions/nov26/photos/diyas.webp', caption: 'Diyas on the ledge', place: 'Diwali', tint: '#FFC23D' },
  { photo: '/editions/nov26/photos/akash-prodip.webp', caption: 'Akash prodip', place: 'at dusk', tint: '#E5383B' },
  { photo: '/editions/nov26/photos/phuljhari.webp', caption: 'Phuljhari', place: 'the courtyard', tint: '#F06A9B' },
  { photo: '/editions/nov26/photos/rangoli.webp', caption: 'Rangoli at the door', place: '', tint: '#3FC1B0' },
  { photo: '/editions/nov26/photos/bhai-phonta.webp', caption: 'Bhai Phonta plate', place: '', tint: '#FF8A2A' },
];
