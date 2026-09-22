// The team, in the order their faces appear on the home page (there are 8 spots).
//   photo:     put the picture in public/team/ and write its path, e.g. '/team/ananya.jpg'
//   team:      one of the keys in TEAMS
//   bio:       2 lines for the pop-up when someone taps the face
//   instagram: handle without the @
// Leave a field '' and the design's placeholder shows instead.

export const TEAMS = {
  editorial: { label: 'Editorial', color: '#F0442B' },
  visual: { label: 'Visual', color: '#3DA5F4' },
  research: { label: 'Research', color: '#1E7A4C' },
  operations: { label: 'Operations', color: '#7B5CE6' },
};

export const MEMBERS = [
  { name: 'Ananya', role: 'Editorial lead', team: 'editorial', photo: '', bio: '', instagram: '' },
  { name: 'Sohom', role: 'Photography', team: 'visual', photo: '', bio: '', instagram: '' },
  { name: 'Rehan', role: 'Field research', team: 'research', photo: '', bio: '', instagram: '' },
  { name: 'Ishita', role: 'Visual strategy', team: 'operations', photo: '', bio: '', instagram: '' },
  { name: 'Mitali', role: 'Design', team: 'visual', photo: '', bio: '', instagram: '' },
  { name: 'Tanvi', role: 'Interviews', team: 'research', photo: '', bio: '', instagram: '' },
  { name: 'Kabir', role: 'Outreach', team: 'operations', photo: '', bio: '', instagram: '' },
  { name: 'Nishtha', role: 'Copy & voice', team: 'editorial', photo: '', bio: '', instagram: '' },
];
