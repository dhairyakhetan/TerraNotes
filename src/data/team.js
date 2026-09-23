// The team, in the order their faces appear on the home page. The faces lay themselves out, so add or remove freely.
//   photo:     put the picture in public/team/ and write its path, e.g. '/team/ananya.jpg'
//   team:      one of the keys in TEAMS, or a list for someone in two, e.g. ['design', 'writing'] (the first sets their colour)
//   bio:       2 lines for the pop-up when someone taps the face
//   instagram: handle without the @
// Leave a field '' and the design's placeholder shows instead.

export const TEAMS = {
  heads: { label: 'Heads', color: '#1E7A4C' },
  design: { label: 'Design', color: '#3DA5F4' },
  writing: { label: 'Writing', color: '#F0442B' },
  tech: { label: 'Tech', color: '#7B5CE6' },
};

export const MEMBERS = [
  { name: 'Aarav Agarwal', role: 'Head of department', team: 'heads', photo: '', bio: '', instagram: '' },
  { name: 'Hiya Khara', role: 'Head of department', team: 'heads', photo: '', bio: '', instagram: '' },
  { name: 'Ashwika Tripathi', role: 'Head of department', team: 'heads', photo: '', bio: '', instagram: '' },
  { name: 'Anoushka Chandak', role: 'Design & writing intern', team: ['design', 'writing'], photo: '', bio: '', instagram: '' },
  { name: 'Divya Rathi', role: 'Design & writing intern', team: ['design', 'writing'], photo: '', bio: '', instagram: '' },
  { name: 'Anushka Paul', role: 'Design intern', team: 'design', photo: '', bio: '', instagram: '' },
  { name: 'Syeda Tashirun Nabi', role: 'Design intern', team: 'design', photo: '', bio: '', instagram: '' },
  { name: 'Ayushi Khemka', role: 'Design intern', team: 'design', photo: '', bio: '', instagram: '' },
  { name: 'Sara Abedin', role: 'Writing intern', team: 'writing', photo: '', bio: '', instagram: '' },
  { name: 'Ahel Sarkar', role: 'Writing intern', team: 'writing', photo: '', bio: '', instagram: '' },
  { name: 'Pahal Sethi', role: 'Writing intern', team: 'writing', photo: '', bio: '', instagram: '' },
  { name: 'Dhriti Agarwal', role: 'Writing intern', team: 'writing', photo: '', bio: '', instagram: '' },
  { name: 'Diti Shah', role: 'Writing intern', team: 'writing', photo: '', bio: '', instagram: '' },
  { name: 'Priyadarshini Hazra', role: 'Writing intern', team: 'writing', photo: '', bio: '', instagram: '' },
  { name: 'Rishavi Banerjee', role: 'Writing intern', team: 'writing', photo: '', bio: '', instagram: '' },
  { name: 'Dhairya Khetan', role: 'Tech intern', team: 'tech', photo: '', bio: '', instagram: '' },
  { name: 'Priyam Agarwal', role: 'Tech intern', team: 'tech', photo: '', bio: '', instagram: '' },
  { name: 'Bhavishya Agarwal', role: 'Tech intern', team: 'tech', photo: '', bio: '', instagram: '' },
];

// Every team someone is in, and the colour they wear (their first team's).
export const teamsOf = (m) => [].concat(m.team);
export const colorOf = (m) => TEAMS[teamsOf(m)[0]].color;
