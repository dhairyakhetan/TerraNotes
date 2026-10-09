// January 2027's photo wall (its home page) and its "See every photo" viewer, in order.
//   photo: put the picture in public/editions/<edition id>/photos/ and write its path, e.g. '/editions/jan27/photos/terrace.jpg'
//   tint:  colour shown in its place until there is a photo
// Leave caption '' and the design's placeholder shows instead; with no place, the viewer just says "Highlight 01".
// The drawn ones come from tools/art/jan27.mjs: swap in real photos at the same paths.

export const PHOTOS = [
  { photo: '/editions/jan27/photos/aisles.webp', caption: 'Lane 4, 5 p.m.', place: 'the Book Fair', tint: '#C0392B' },
  { photo: '/editions/jan27/photos/stack.webp', caption: 'The bag, by evening', place: '', tint: '#2D6A8E' },
  { photo: '/editions/jan27/photos/little-mags.webp', caption: 'Little magazines', place: '', tint: '#E0A526' },
  { photo: '/editions/jan27/photos/fog.webp', caption: 'Kuasha on the Maidan', place: '7 a.m.', tint: '#3C8D5A' },
  { photo: '/editions/jan27/photos/pithe.webp', caption: 'Pithe for Poush', place: '', tint: '#D96C8A' },
  { photo: '/editions/jan27/photos/parade.webp', caption: '26 January', place: 'Red Road', tint: '#6B4C9A' },
];
