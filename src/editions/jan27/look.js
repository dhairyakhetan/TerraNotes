// January 2027's look, "Boi Mela": old book paper with ink-blue text, brick-red handwriting and a few bright cloth
// bindings, and a heavy, bookish serif for headings (Playfair Display). Its own home page is a stall at the fair, on
// kraft paper (`home` below). Every colour and font the site's shared pieces are drawn with, by role (see
// src/editions/oct26/look.js). Every edition's look must have the same keys (src/editions/index.js).
export const LOOK = {
  colors: {
    page: '#FBF5E6', // the page: old book paper
    outside: '#EFE3C8',
    card: '#FFFFFF',
    cream: '#FFF3D6',
    ink: '#1D2B36', // borders, text, hard shadows, dark fills: ink
    text: '#26323C',
    hand: '#A3372B', // handwriting: brick red
    string: '#B88A3E', // twine
    dek: '#3E6C7A',
    wire: '#D9B36B',
    yellow: '#F0B429', // price-tag yellow: featured, primary buttons' shadow
    red: '#C0392B',
    blue: '#2D6A8E',
    green: '#3C8D5A',
    purple: '#6B4C9A',
    pink: '#D96C8A',
    mint: '#4BAA9C',
    // the photo wall
    wall: '#2E4A3F', // stall canvas green
    amber: '#F0B429',
    wallInk: '#FFFFFF',
    mutedDark: '#D6E2DB',
    peg: '#E3C28A',
    bulb: '#FFE08A',
    spark: '#FFF7E0',
    // dark panels (photo viewer, phone menu)
    labelDark: '#E4EDE8',
    ruleDark: '#5E7F72',
    // quieter details
    muted: '#5B6670',
    grey: '#4F5A63',
    bioText: '#26323C',
    introLabel: '#A3372B',
    introText: '#36434D',
    done: '#AEB7BE',
    rule: '#E2C98E',
    faint: '#EBDFC6',
    edge: '#E2C98E',
    blank: '#F3E8CF',
    slotLine: '#DCC390',
    slotInk: '#4F5A63',
    slotDark: '#3B5A4E',
    slotDarkLine: '#7FA294',
    slotDarkInk: '#FFFFFF',
    snake: '#3C8D5A',
  },
  fonts: {
    head: "'Playfair Display', 'Archivo Black', Georgia, serif", // headings: a heavy book-jacket serif
    mono: "'Space Mono', monospace",
    hand: "'Caveat', cursive",
    serif: "'Instrument Serif', Georgia, serif",
    body: "'Figtree', system-ui, sans-serif",
    read: "'Newsreader', Georgia, serif",
    script: "'Patrick Hand', 'Caveat', cursive", // the home page's price tags and stall signs: a felt-pen hand
  },
  fontsCss: '',
  // its own home page's colours (src/editions/season/SeasonHome.jsx: each becomes --h-<key> there)
  home: {
    page: '#F1E4C6', // kraft paper
    ink: '#1D2B36', // headings
    accent: '#A3372B', // kickers: brick red
    aside: '#2D6A8E', // asides: fountain-pen blue
    awning: '#C0392B', // the stall's striped awning
    canvas: '#FBF5E6',
    wood: '#8A5A3B', // the shelf
    woodTop: '#B07A50',
    paper: '#FFFBF0', // an open book's pages
    tag: '#F0B429', // price tags
    book1: '#C0392B',
    book2: '#2D6A8E',
    book3: '#3C8D5A',
    book4: '#E0A526',
    book5: '#6B4C9A',
    book6: '#1D2B36',
    book7: '#D96C8A',
    flag1: '#C0392B',
    flag2: '#F0B429',
    flag3: '#2D6A8E',
    flag4: '#3C8D5A',
  },
};
