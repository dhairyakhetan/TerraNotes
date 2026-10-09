// February 2027's look, "Letters": writing paper with aubergine ink, a rose-red hand and fountain-pen blue, and a
// soft, letter-heading serif for headings (DM Serif Display). Its own home page is Saraswati Puja's basanti yellow
// (`home` below). Every colour and font the site's shared pieces are drawn with, by role (see
// src/editions/oct26/look.js). Every edition's look must have the same keys (src/editions/index.js).
export const LOOK = {
  colors: {
    page: '#FFFBEF', // the page: writing paper
    outside: '#F6EBCB',
    card: '#FFFFFF',
    cream: '#FFF4D2',
    ink: '#3B1F4A', // borders, text, hard shadows, dark fills: aubergine
    text: '#3A2A44',
    hand: '#B8164F', // handwriting: rose red
    string: '#D9A400', // basanti thread
    dek: '#1F5FA8', // deks: fountain-pen blue
    wire: '#F0C64A',
    yellow: '#F5C518', // basanti: featured, primary buttons' shadow
    red: '#B3122E',
    blue: '#1F5FA8',
    green: '#2E8B57',
    purple: '#6A3D9A',
    pink: '#E8749A',
    mint: '#3FB5A0',
    // the photo wall
    wall: '#3B1F4A',
    amber: '#F5C518',
    wallInk: '#FFFFFF',
    mutedDark: '#E2D3EA',
    peg: '#EBC98A',
    bulb: '#FFE58A',
    spark: '#FFF8E0',
    // dark panels (photo viewer, phone menu)
    labelDark: '#EFE4F4',
    ruleDark: '#7A5A8C',
    // quieter details
    muted: '#6B5A73',
    grey: '#5E4E66',
    bioText: '#3A2A44',
    introLabel: '#B8164F',
    introText: '#4A3A55',
    done: '#BDAFC4',
    rule: '#F0C64A',
    faint: '#EFE4C8',
    edge: '#EBCB6A',
    blank: '#F7EBCB',
    slotLine: '#E6CB7E',
    slotInk: '#5E4E66',
    slotDark: '#4E2D60',
    slotDarkLine: '#9273A3',
    slotDarkInk: '#FFFFFF',
    snake: '#2E8B57',
  },
  fonts: {
    head: "'DM Serif Display', 'Archivo Black', Georgia, serif", // headings: a letter-heading serif
    mono: "'Space Mono', monospace",
    hand: "'Caveat', cursive",
    serif: "'Instrument Serif', Georgia, serif",
    body: "'Figtree', system-ui, sans-serif",
    read: "'Newsreader', Georgia, serif",
    script: "'Homemade Apple', 'Caveat', cursive", // the home page's addresses and sign-offs: a looping pen hand
  },
  fontsCss: '',
  // its own home page's colours (src/editions/season/SeasonHome.jsx: each becomes --h-<key> there)
  home: {
    page: '#F9D85E', // basanti yellow
    ink: '#3B1F4A', // headings
    accent: '#B3122E', // kickers: sealing-wax red
    aside: '#1F4F8A', // asides: fountain-pen blue
    paper: '#FFFBEF', // letters
    envelope: '#FFF6E2',
    pocket: '#F4E6C4', // the envelope's front pocket
    flap: '#EAD8AE',
    seal: '#B3122E',
    palash: '#E8501E', // palash flowers
    air1: '#B3122E', // airmail stripes
    air2: '#1F4F8A',
    stamp1: '#2E8B57',
    stamp2: '#6A3D9A',
    stamp3: '#E8749A',
  },
};
