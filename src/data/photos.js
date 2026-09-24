// Photo wall on the home page and its "See every photo" viewer, in order (there are 5 spots).
//   photo: put the picture in public/photos/ and write its path, e.g. '/photos/terrace.jpg'
//   tint:  colour shown in its place until there is a photo
// Leave caption '' and the design's placeholder shows instead; with no place, the viewer just says "Highlight 01".

export const PHOTOS = [
  { photo: '/photos/notes-wall.jpg', caption: 'a whole wall of notes, pegged up to dry', place: '', tint: '#6F8468' },
  { photo: '/photos/mist.jpg', caption: 'clouds rolling down through the pines', place: '', tint: '#5E7F8C' },
  { photo: '/photos/sea.jpg', caption: 'the sky going pink over the water', place: '', tint: '#A7765A' },
  { photo: '', caption: '', place: '', tint: '#8A8F6A' },
  { photo: '', caption: '', place: '', tint: '#4F6B78' },
];
