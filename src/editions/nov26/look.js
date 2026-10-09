// November 2026's look, "Lights": warm diya-lit paper with night-blue ink, lamp-gold highlights and a diya-orange
// hand, and a soft serif with a bit of swagger for headings (Fraunces). Its own home page is night itself (`home`
// below). Every colour and font the site's shared pieces are drawn with, by role (see src/editions/oct26/look.js): the
// pages use them as CSS variables, so a value here restyles that role everywhere in this edition, and only in it.
// Every edition's look must have the same keys (src/editions/index.js).
export const LOOK = {
  colors: {
    page: '#FFF8EC', // the page: warm ivory
    outside: '#F3E6CC', // around the page; quiet fills
    card: '#FFFFFF', // cards; text on ink
    cream: '#FFF1D6', // soft cream cards
    ink: '#1B2559', // borders, text, hard shadows, dark fills: night blue
    text: '#25305F', // body text
    hand: '#B93A0B', // handwriting: diya orange, deep enough for small text on the ivory
    string: '#E8A33D', // the strings things hang from: lamp wick gold
    dek: '#4C5BB0', // deks
    wire: '#F2B65A', // the menu's wire; quiet handwritten notes
    yellow: '#FFC23D', // lamp gold: featured, primary buttons' shadow
    red: '#E5383B',
    blue: '#3A57E8',
    green: '#2F9E6E',
    purple: '#7B4FD6',
    pink: '#F06A9B',
    mint: '#3FC1B0',
    // the photo wall
    wall: '#141C44', // its panel: night
    amber: '#FFC23D',
    wallInk: '#FFFFFF',
    mutedDark: '#C9CFF2',
    peg: '#F4C27A',
    bulb: '#FFD66B',
    spark: '#FFF6D8',
    // dark panels (photo viewer, phone menu)
    labelDark: '#E3E6FA',
    ruleDark: '#5160B8',
    // quieter details
    muted: '#5A6394',
    grey: '#4F5888',
    bioText: '#25305F',
    introLabel: '#B93A0B',
    introText: '#3A4476',
    done: '#A8AFD3',
    rule: '#F0C77A',
    faint: '#EADFC8',
    edge: '#EBC98A',
    blank: '#F6E9CF',
    slotLine: '#E5C88E',
    slotInk: '#4F5888',
    slotDark: '#26306A',
    slotDarkLine: '#6C79C9',
    slotDarkInk: '#FFFFFF',
    snake: '#2F9E6E',
  },
  fonts: {
    head: "'Fraunces', 'Archivo Black', Georgia, serif", // headings, titles, big numbers
    mono: "'Space Mono', monospace",
    hand: "'Caveat', cursive",
    serif: "'Instrument Serif', Georgia, serif",
    body: "'Figtree', system-ui, sans-serif",
    read: "'Newsreader', Georgia, serif",
    script: "'Kalam', 'Caveat', cursive", // the home page's lantern tags and notes: a round Indian hand
  },
  fontsCss: '',
  // its own home page's colours (src/editions/season/SeasonHome.jsx: each becomes --h-<key> there)
  home: {
    page: '#0F1533', // the night
    sky: '#1E2866', // the sky near the horizon
    ink: '#FFF3D6', // headings on the night
    accent: '#FFC23D', // kickers: lamp gold
    aside: '#FFB27A', // handwritten asides: flame
    glow: '#FFC23D', // a lit lantern's light
    flame: '#FF8A2A',
    paper: '#FFF3D6', // lantern tags
    lantern1: '#E5383B',
    lantern2: '#FF8A2A',
    lantern3: '#F06A9B',
    lantern4: '#3FC1B0',
    lantern5: '#7B4FD6',
    star: '#FFF6D8',
  },
};
