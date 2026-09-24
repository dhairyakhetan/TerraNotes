// The team, in the order their faces appear on the home page. The faces lay themselves out, so add or remove freely.
//   photo:     put the picture in public/team/ and write its path, e.g. '/team/ananya.jpg'
//   team:      one of the keys in TEAMS, or a list for someone in two, e.g. ['design', 'writing'] (the first sets their colour;
//              their face fades between the two every so often, or with steady: true keeps the first unless the legend picks the other)
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
  { name: 'Aarav Agarwal', role: 'Head of department', team: 'heads', photo: '', bio: 'Hey, I’m Aarav! I’m in Class 11, studying commerce, and I’m into economics, geopolitics, and just exploring new stuff. Pretty chill otherwise :)', instagram: 'aaravagarwal2010' },
  { name: 'Sara Abedin', role: 'Writing team', team: 'writing', photo: '', bio: '', instagram: '' },
  { name: 'Anushka Paul', role: 'Design team', team: 'design', photo: '', bio: '', instagram: '' },
  { name: 'Dhairya Khetan', role: 'Tech team', team: 'tech', photo: '', bio: '', instagram: '' },
  { name: 'Pahal Sethi', role: 'Writing team', team: 'writing', photo: '', bio: 'Writing, Creating, and Romanticising the little things. Mentally somewhere in New York.', instagram: 'pahalsethi' },
  { name: 'Anoushka Chandak', role: 'Design & writing team', team: ['design', 'writing'], photo: '', bio: '', instagram: '' },
  { name: 'Hiya Khara', role: 'Head of department', team: 'heads', photo: '', bio: 'I live on Starbucks ;)', instagram: 'hiyakhara' },
  { name: 'Ahel Sarkar', role: 'Writing team', team: 'writing', photo: '', bio: '', instagram: '' },
  { name: 'Syeda Tashirun Nabi', role: 'Design team', team: 'design', photo: '', bio: 'Fueled by Diet Coke and questionable layout choices', instagram: 'tashirun.hq' },
  { name: 'Priyam Agarwal', role: 'Tech team', team: 'tech', photo: '', bio: 'Hey, I’m Priyam! I’m into tech, maths, and quant finance, and I like messing around with new ideas and building random stuff. Mostly just curious and figuring things out as I go :)', instagram: 'priyamagarwal3' },
  { name: 'Dhriti Agarwal', role: 'Writing team', team: 'writing', photo: '', bio: '', instagram: '' },
  { name: 'Divya Rathi', role: 'Design & writing team', team: ['design', 'writing'], photo: '', bio: '', instagram: '' },
  { name: 'Ashwika Tripathi', role: 'Head of department', team: ['heads', 'writing'], steady: true, photo: '', bio: '', instagram: '' },
  { name: 'Diti Shah', role: 'Writing team', team: 'writing', photo: '', bio: 'Hii…this is Diti Shah', instagram: '_ditishah' },
  { name: 'Ayushi Khemka', role: 'Design team', team: 'design', photo: '', bio: 'Designing my life one questionable decision at a time.', instagram: '' },
  { name: 'Bhavishya Agarwal', role: 'Tech team', team: 'tech', photo: '', bio: 'I like Claude', instagram: 'bhavishya.idk' },
  { name: 'Priyadarshini Hazra', role: 'Writing team', team: 'writing', photo: '', bio: 'Writing things I’d want to read myself.', instagram: 'pr1yadxrshini_' },
  { name: 'Rishavi Banerjee', role: 'Writing team', team: 'writing', photo: '', bio: 'Writer at heart, storyteller by nature, finding meaning in every word', instagram: 'the_awful_moon' },
];

// Every team someone is in, and the colour they wear (their first team's).
export const teamsOf = (m) => [].concat(m.team);
export const colorOf = (m) => TEAMS[teamsOf(m)[0]].color;
