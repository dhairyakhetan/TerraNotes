// October 2026's photo wall (its home page) and its "See every photo" viewer, in order (there are 5 spots).
//   photo: put the picture in public/editions/<edition id>/photos/ and write its path, e.g. '/editions/oct26/photos/terrace.jpg'
//   tint:  colour shown in its place until there is a photo
// Leave caption '' and the design's placeholder shows instead; with no place, the viewer just says "Highlight 01".

export const PHOTOS = [
  { photo: '', caption: '', place: '', tint: '#FF4F8B' },
  { photo: '/editions/oct26/photos/durga.webp', caption: 'Maa Durga', place: '', tint: '#FFB400' },
  { photo: '', caption: '', place: '', tint: '#18C7B8' },
  { photo: '', caption: '', place: '', tint: '#FF7A2F' },
  { photo: '', caption: '', place: '', tint: '#B6E04B' },
];
