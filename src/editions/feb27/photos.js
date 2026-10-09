// February 2027's photo wall (its home page) and its "See every photo" viewer, in order.
//   photo: put the picture in public/editions/<edition id>/photos/ and write its path, e.g. '/editions/feb27/photos/terrace.jpg'
//   tint:  colour shown in its place until there is a photo
// Leave caption '' and the design's placeholder shows instead; with no place, the viewer just says "Highlight 01".
// The drawn ones come from tools/art/feb27.mjs: swap in real photos at the same paths.

export const PHOTOS = [
  { photo: '/editions/feb27/photos/basanti.webp', caption: 'Basanti, everywhere', place: 'Saraswati Puja', tint: '#F5C518' },
  { photo: '/editions/feb27/photos/palash.webp', caption: 'Palash in bloom', place: '', tint: '#E8501E' },
  { photo: '/editions/feb27/photos/pillar-box.webp', caption: 'The red pillar box', place: 'our corner', tint: '#B3122E' },
  { photo: '/editions/feb27/photos/slate.webp', caption: 'Hate khori', place: 'a first letter', tint: '#2E8B57' },
  { photo: '/editions/feb27/photos/exam-desk.webp', caption: 'Board week', place: '', tint: '#1F5FA8' },
  { photo: '/editions/feb27/photos/hearts.webp', caption: '14 February', place: '', tint: '#E8749A' },
];
