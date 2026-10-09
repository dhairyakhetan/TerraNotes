// December 2026's look, "Park Street": cream paper with pine-green ink, holly-red handwriting and tinsel gold, and a
// fat-faced display serif for headings (Abril Fatface), like the old signboards on Park Street. Its own home page is
// the street at night, in wine red (`home` below). Every colour and font the site's shared pieces are drawn with, by
// role (see src/editions/oct26/look.js). Every edition's look must have the same keys (src/editions/index.js).
export const LOOK = {
  colors: {
    page: '#FFF9F0', // the page: cream
    outside: '#F4E8D8',
    card: '#FFFFFF',
    cream: '#FFF2DC',
    ink: '#14382C', // borders, text, hard shadows, dark fills: pine
    text: '#1F3D33',
    hand: '#B0122C', // handwriting: holly red
    string: '#C9A227', // tinsel
    dek: '#2E6B57',
    wire: '#E2C26A',
    yellow: '#F2C14E', // tinsel gold: featured, primary buttons' shadow
    red: '#C8102E',
    blue: '#2B5DA8',
    green: '#1E7F55',
    purple: '#7A3E9D',
    pink: '#E86A92',
    mint: '#4FBFA5',
    // the photo wall
    wall: '#3A0D17', // wine
    amber: '#F2C14E',
    wallInk: '#FFFFFF',
    mutedDark: '#EBCFD4',
    peg: '#E8C58A',
    bulb: '#FFE08A',
    spark: '#FFF7E0',
    // dark panels (photo viewer, phone menu)
    labelDark: '#F6E3E6',
    ruleDark: '#8C3A4A',
    // quieter details
    muted: '#55706A',
    grey: '#4A645D',
    bioText: '#1F3D33',
    introLabel: '#B0122C',
    introText: '#2E4F45',
    done: '#A9BFB7',
    rule: '#E8C877',
    faint: '#EBDDC8',
    edge: '#E5C98F',
    blank: '#F5E8D2',
    slotLine: '#E0C690',
    slotInk: '#4A645D',
    slotDark: '#4E1522',
    slotDarkLine: '#A0505F',
    slotDarkInk: '#FFFFFF',
    snake: '#1E7F55',
  },
  fonts: {
    head: "'Abril Fatface', 'Archivo Black', Georgia, serif", // headings: a fat-faced signboard serif
    mono: "'Space Mono', monospace",
    hand: "'Caveat', cursive",
    serif: "'Instrument Serif', Georgia, serif",
    body: "'Figtree', system-ui, sans-serif",
    read: "'Newsreader', Georgia, serif",
    script: "'Satisfy', 'Caveat', cursive", // the home page's neon script, like a café's sign
  },
  fontsCss: '',
  // its own home page's colours (src/editions/season/SeasonHome.jsx: each becomes --h-<key> there)
  home: {
    page: '#2B0A12', // the street at night: wine
    sky: '#4A1020',
    ink: '#FFF2DC', // headings on the wine
    accent: '#F2C14E', // kickers: tinsel gold
    aside: '#FF9FB4', // asides: neon pink
    board: '#14382C', // the advent calendar's board: pine
    paper: '#FFF2DC',
    door1: '#C8102E',
    door2: '#1E7F55',
    door3: '#B5651D',
    door4: '#2B5DA8',
    door5: '#C2477A',
    door6: '#7A3E9D',
    door7: '#0F6E6E',
    bulb1: '#FFE08A',
    bulb2: '#FF6B6B',
    bulb3: '#7EE0C3',
    bulb4: '#8FB8FF',
  },
};
