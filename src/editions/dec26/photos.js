// December 2026's photo wall (its home page) and its "See every photo" viewer, in order.
//   photo: put the picture in public/editions/<edition id>/photos/ and write its path, e.g. '/editions/dec26/photos/terrace.jpg'
//   tint:  colour shown in its place until there is a photo
// Leave caption '' and the design's placeholder shows instead; with no place, the viewer just says "Highlight 01".
// The drawn ones come from tools/art/dec26.mjs: swap in real photos at the same paths.

export const PHOTOS = [
  { photo: '/editions/dec26/photos/park-street.webp', caption: 'Park Street, lit', place: '24 December', tint: '#4A1020' },
  { photo: '/editions/dec26/photos/cake-box.webp', caption: 'One plum cake, please', place: 'New Market', tint: '#B5651D' },
  { photo: '/editions/dec26/photos/bow-barracks.webp', caption: 'Stars on every balcony', place: 'Bow Barracks', tint: '#C8102E' },
  { photo: '/editions/dec26/photos/candles.webp', caption: 'Midnight mass', place: '', tint: '#F2C14E' },
  { photo: '/editions/dec26/photos/tram.webp', caption: 'The last tram', place: 'Esplanade', tint: '#2B5DA8' },
  { photo: '/editions/dec26/photos/oranges.webp', caption: 'Kamala lebu season', place: 'the corner stall', tint: '#E86A92' },
  { photo: '/editions/dec26/photos/midnight.webp', caption: '12:00, 1 January', place: 'the Maidan', tint: '#1E7F55' },
];
