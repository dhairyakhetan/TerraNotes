// "Under Aquaterra": AQ Labs, Aquaterra's student build program (the home page's last section, before the footer).
// The words are from the AQ Labs write-up, split into the intro, one card per project and the closing line.
//   kind:  the small label on the card        color / ink: the card's band and the colour on it
//   icon:  one of the drawings in components/LabIcon.jsx (film, compass, gamepad, tree, loop, badge, light, cards)

export const LABS = {
  name: 'AQ Labs',
  intro: [
    "AQ Labs is AquaTerra's student build program, a space where teenagers pick a problem they actually care about and ship something real in a matter of weeks, not just a slide deck.",
    'It runs like a small, self-directed studio: teams choose their own idea, build it end to end, and put it in front of real users.',
  ],
  shipped: 'Under this program, eight teams have shipped eight very different projects:',
  closing: 'Each project is a live, working build, and AQ Labs exists to prove that',
  quote: "students don't need permission to build things that matter, they just need a room and six weeks.",
  stats: [['8', 'teams'], ['8', 'projects shipped'], ['6', 'weeks']],
  projects: [
    { name: 'Karyaarth', what: 'a documentary series on the local vendors and workers most people walk past every day', kind: 'Documentary', icon: 'film', color: '#F0442B', ink: '#FFFFFF' },
    { name: 'CareerCompass', what: "a data-driven tool that maps India's skill gaps against student choices", kind: 'Data tool', icon: 'compass', color: '#3DA5F4', ink: '#111111' },
    { name: 'QUIRK', what: 'a hand-soldered pressure-sensing desktop game console', kind: 'Hardware', icon: 'gamepad', color: '#F7C21A', ink: '#111111' },
    { name: 'wisdom woods', what: 'a gamified learning app for classes 3 to 7', kind: 'Learning app', icon: 'tree', color: '#1E7A4C', ink: '#FFFFFF' },
    { name: 'Cirqle Rentals', what: 'a WhatsApp-based community rental network', kind: 'Community', icon: 'loop', color: '#7B5CE6', ink: '#FFFFFF' },
    { name: 'hunar', what: 'a placement-first take on vocational trust and verification', kind: 'Platform', icon: 'badge', color: '#EE4E8A', ink: '#111111' },
    { name: 'Photon', what: 'a screen-free light-sensing wearable', kind: 'Wearable', icon: 'light', color: '#7FC49B', ink: '#111111' },
    { name: 'The Human Manual', what: 'a card-deck style app of teen psychology prompts', kind: 'App', icon: 'cards', color: '#5B3A1E', ink: '#FFFFFF' },
  ],
};
