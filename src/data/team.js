// The team, in the order their faces appear on the home page. The faces lay themselves out, so add or remove freely.
//   photo:     put the picture in public/team/ and write its path, e.g. '/team/ananya.jpg'
//   team:      one of the keys in TEAMS, or a list for someone in two, e.g. ['design', 'writing'] (the first sets their colour)
//   bio:       2 lines for the pop-up when someone taps the face
//   instagram: handle without the @
// Leave a field '' and the design's placeholder shows instead.

// label: the legend and profile tag. made: what the team made, shown on its members' profiles (writers get "their articles" instead).
export const TEAMS = {
  heads: { label: 'Heads', color: '#1E7A4C', made: 'keep everyone on track' },
  design: { label: 'Design team', color: '#3DA5F4', made: 'made the layout and style of this website, along with its other design elements' },
  writing: { label: 'Writing team', color: '#F0442B', made: 'writes the articles' },
  tech: { label: 'Tech team', color: '#7B5CE6', made: 'made this website' },
};

// Mixed on purpose: the order sets where each face sits, so teams end up spread around the section.
export const MEMBERS = [
  { name: 'Aarav Agarwal', role: 'Head of department', team: 'heads', photo: '', bio: '', instagram: '' },
  { name: 'Sara Abedin', role: 'Writing team', team: 'writing', photo: '', bio: '', instagram: '' },
  { name: 'Anushka Paul', role: 'Design team', team: 'design', photo: '', bio: '', instagram: '' },
  { name: 'Dhairya Khetan', role: 'Tech team', team: 'tech', photo: '', bio: '', instagram: '' },
  { name: 'Pahal Sethi', role: 'Writing team', team: 'writing', photo: '', bio: '', instagram: '' },
  { name: 'Anoushka Chandak', role: 'Design & writing team', team: ['design', 'writing'], photo: '', bio: '', instagram: '' },
  { name: 'Hiya Khara', role: 'Head of department', team: 'heads', photo: '', bio: '', instagram: '' },
  { name: 'Ahel Sarkar', role: 'Writing team', team: 'writing', photo: '', bio: '', instagram: '' },
  { name: 'Syeda Tashirun Nabi', role: 'Design team', team: 'design', photo: '', bio: '', instagram: '' },
  { name: 'Priyam Agarwal', role: 'Tech team', team: 'tech', photo: '', bio: '', instagram: '' },
  { name: 'Dhriti Agarwal', role: 'Writing team', team: 'writing', photo: '', bio: '', instagram: '' },
  { name: 'Divya Rathi', role: 'Design & writing team', team: ['design', 'writing'], photo: '', bio: '', instagram: '' },
  { name: 'Ashwika Tripathi', role: 'Head of department', team: 'heads', photo: '', bio: '', instagram: '' },
  { name: 'Diti Shah', role: 'Writing team', team: 'writing', photo: '', bio: '', instagram: '' },
  { name: 'Ayushi Khemka', role: 'Design team', team: 'design', photo: '', bio: '', instagram: '' },
  { name: 'Bhavishya Agarwal', role: 'Tech team', team: 'tech', photo: '', bio: '', instagram: '' },
  { name: 'Priyadarshini Hazra', role: 'Writing team', team: 'writing', photo: '', bio: '', instagram: '' },
  { name: 'Rishavi Banerjee', role: 'Writing team', team: 'writing', photo: '', bio: '', instagram: '' },
];

// Every team someone is in, and the colour they wear (their first team's).
export const teamsOf = (m) => [].concat(m.team);
export const colorOf = (m) => TEAMS[teamsOf(m)[0]].color;
