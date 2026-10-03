// October 2026's look, "Pujo": Durga Puja in Kolkata. The cream-white and alta red of a laal-paar saree, deep maroon
// ink, sindoor-red handwriting, marigold strings and lights, gold thread for rules, a pandal-at-night photo wall, and a
// festive poster serif for headings (Rozha One). The saree border, alpana and the toran of marigolds are in look.css and
// Decor.jsx. Every colour and font the site's shared pieces are drawn with, by role: the pages use them as CSS variables
// (var(--ink), var(--font-head): lib/edition.js puts them on the page), so a value here restyles that role everywhere in
// this edition, and only in this edition. Every edition's look must have the same keys (src/editions/index.js).
export const LOOK = {
  colors: {
    // the palette (CLAUDE.md)
    page: '#FBF4E6', // the page: the cream-white of a laal-paar saree; light text on dark panels
    outside: '#EBDCC3', // around the page; quiet fills
    card: '#FFFDF7', // cards; text on ink
    cream: '#FFF6E3', // soft cream cards
    ink: '#3A0B0E', // borders, text, hard shadows, dark fills: deep maroon
    text: '#40171A', // body text
    hand: '#B3122B', // handwriting: sindoor red
    string: '#E39B12', // the strings things hang from: marigold
    dek: '#7A2A1E', // deks (the line under a title)
    wire: '#C98B2E', // the menu's wire; quiet handwritten notes
    yellow: '#F4B400', // marigold: featured, primary buttons' shadow
    red: '#C8102E', // alta red, the saree's border
    blue: '#1F6F8B', // peacock teal
    green: '#3E7D2C', // banana leaf
    purple: '#7A2E8E',
    pink: '#E35D8C', // lotus pink
    mint: '#9CC56B', // young paddy green
    // the photo wall
    wall: '#3B0A10', // its panel: a pandal at night
    amber: '#F4B400', // its prints' shadows and tagline: marigold lights
    wallInk: '#EDE9DD', // "[photo]" on an empty print
    mutedDark: '#8E8A7A', // its strings; small print on dark panels (photo viewer, phone menu)
    peg: '#C9A57A', // wooden pegs
    bulb: '#FFD27A', // fairy-light bulbs
    spark: '#FFF4D6', // sparkles
    // dark panels (photo viewer, phone menu)
    labelDark: '#BDB6A6', // labels on dark
    ruleDark: '#3A3A36', // lines on dark
    // quieter details
    muted: '#6B665C', // quiet grey text
    grey: '#4A4A45', // secondary text (the words game's "/ say it /")
    bioText: '#333333', // a member's bio on their profile card
    introLabel: '#4B6647', // "Introduction" on the home intro card
    introText: '#4A524D', // the home intro card's lines
    done: '#8A8478', // a ticked checklist item
    rule: '#E8CFA6', // thin rules: gold thread
    faint: '#CFC8B8', // faint marks
    edge: '#D9B98A', // the home page's edge against the outside
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
    head: "'Rozha One', 'Archivo Black', Georgia, serif", // headings, titles, big numbers (always uppercase): a festive poster serif
    mono: "'Space Mono', monospace", // labels, meta lines, buttons (uppercase, letter-spaced)
    hand: "'Caveat', cursive", // handwritten notes, deks, captions
    serif: "'Instrument Serif', Georgia, serif", // "Photo wall", "TerraNotes", the intro headline
    body: "'Figtree', system-ui, sans-serif", // UI body text
    read: "'Newsreader', Georgia, serif", // article paragraphs
    script: "'Pinyon Script', 'Snell Roundhand', cursive", // a neat copperplate script (not used this month)
  },
  // a stylesheet for fonts index.html doesn't load already (e.g. a Google Fonts link), or ''
  fontsCss: 'https://fonts.googleapis.com/css2?family=Rozha+One&display=swap',
};
