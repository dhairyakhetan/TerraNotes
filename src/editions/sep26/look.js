// September 2026's look: every colour and font the site's shared pieces are drawn with, by role. The pages use them as
// CSS variables (var(--ink), var(--font-head): lib/edition.js puts them on the page), so changing a value here restyles
// that role everywhere in this edition, and only in this edition. A new edition starts from a copy of this file.
// Every edition's look must have the same keys (src/editions/index.js stops the build otherwise).
export const LOOK = {
  colors: {
    // the palette (CLAUDE.md)
    page: '#F3EEE4', // the page; light text on dark panels
    outside: '#E6E0D3', // around the page; quiet fills
    card: '#FFFFFF', // cards; text on ink
    cream: '#FBF8F1', // soft cream cards
    ink: '#111111', // borders, text, hard shadows, dark fills
    text: '#1E2723', // body text
    hand: '#5B3A1E', // handwriting
    string: '#5B3A1E', // the strings and wires things hang from
    dek: '#5B4630', // deks (the line under a title)
    wire: '#8E7A5E', // the menu's wire; quiet handwritten notes
    yellow: '#F7C21A', // accents: featured, primary buttons' shadow
    red: '#F0442B',
    blue: '#3DA5F4',
    green: '#1E7A4C',
    purple: '#7B5CE6',
    pink: '#EE4E8A',
    mint: '#7FC49B',
    // the photo wall
    wall: '#1C2622', // its panel
    amber: '#E9A23B', // its prints' shadows and tagline
    wallInk: '#EDE9DD', // "[photo]" on an empty print
    mutedDark: '#8E8A7A', // its strings; small print on dark panels (photo viewer, phone menu)
    peg: '#C9A57A', // wooden pegs
    bulb: '#FFE6AE', // fairy-light bulbs
    spark: '#FFF4D6', // sparkles
    // dark panels (photo viewer, phone menu)
    labelDark: '#BDB6A6', // labels on dark
    ruleDark: '#3A3A36', // lines on dark
    // the footer band
    footer: '#0A0A0A',
    footerInk: '#F4EFE0',
    // quieter details
    muted: '#6B665C', // quiet grey text
    grey: '#4A4A45', // secondary text (the words game's "/ say it /")
    bioText: '#333333', // a member's bio on their profile card
    introLabel: '#4B6647', // "Introduction" on the home intro card
    introText: '#4A524D', // the home intro card's lines
    done: '#8A8478', // a ticked checklist item
    rule: '#D9D1BF', // thin rules
    faint: '#CFC8B8', // faint marks
    edge: '#D6CFBF', // the home page's edge against the outside
    blank: '#F2F1ED', // an empty photo or face
    slotLine: '#B9B5AA', // an empty picture's dashed edge
    slotInk: '#444', // an empty picture's label and icon
    slotDark: '#262626', // the same on dark cards
    slotDarkLine: '#5A5A5A',
    slotDarkInk: '#CFCFCF',
    snake: '#4E9C74', // the games card's pixel snake (shared/GameCard.jsx)
  },
  // font stacks (index.html loads these from Google Fonts)
  fonts: {
    head: "'Archivo Black', Impact, sans-serif", // headings, titles, big numbers (always uppercase)
    mono: "'Space Mono', monospace", // labels, meta lines, buttons (uppercase, letter-spaced)
    hand: "'Caveat', cursive", // handwritten notes, deks, captions
    serif: "'Instrument Serif', Georgia, serif", // "Photo wall", "TerraNotes", the intro headline
    body: "'Figtree', system-ui, sans-serif", // UI body text
    read: "'Newsreader', Georgia, serif", // article paragraphs
  },
  // a stylesheet for fonts index.html doesn't load already (e.g. a Google Fonts link), or ''
  fontsCss: '',
};
