// October 2026's photo wall (its home page) and its "See every photo" viewer, in order (there are 8 spots).
//   photo: put the picture in public/editions/<edition id>/photos/ and write its path, e.g. '/editions/oct26/photos/terrace.jpg'
//   tint:  colour shown in its place until there is a photo
// Leave caption '' and the design's placeholder shows instead; with no place, the viewer just says "Highlight 01".
// The drawn ones (all but durga.webp) come from tools/art/oct26.mjs: swap in real photos at the same paths.

export const PHOTOS = [
  { photo: '/editions/oct26/photos/durga.webp', caption: 'Maa Durga', place: '', tint: '#FFB400' },
  { photo: '/editions/oct26/photos/pandal-gate.webp', caption: 'The gate, lit', place: 'Saptami night', tint: '#FF4F8B' },
  { photo: '/editions/oct26/photos/dhunuchi.webp', caption: 'Dhunuchi smoke', place: 'Navami', tint: '#FF7A2F' },
  { photo: '/editions/oct26/photos/queue.webp', caption: 'The queue', place: 'about 11 p.m.', tint: '#18C7B8' },
  { photo: '/editions/oct26/photos/kash.webp', caption: 'Kash flowers', place: 'the riverbank', tint: '#B6E04B' },
  { photo: '/editions/oct26/photos/phuchka.webp', caption: 'Phuchka, 2 a.m.', place: 'the corner stall', tint: '#FFB400' },
  { photo: '/editions/oct26/photos/kumartuli.webp', caption: 'Still clay', place: 'Kumartuli', tint: '#FF4F8B' },
  { photo: '/editions/oct26/photos/ghat.webp', caption: 'Dashami at the ghat', place: 'the Hooghly', tint: '#18C7B8' },
];
