// October 2026's look, "Pujo", in bright festival colours: a sunny cream page, royal-indigo ink (borders, text, hard
// shadows), hibiscus-pink handwriting, marigold strings and lights, a vivid violet photo wall, and a festive poster serif
// for headings (Rozha One). Everything is bright on purpose: no browns, no near-black. The ribbon borders, alpana dots
// and the toran of marigolds are in look.css and Decor.jsx. Every colour and font the site's shared pieces are drawn
// with, by role: the pages use them as CSS variables (var(--ink), var(--font-head): lib/edition.js puts them on the
// page), so a value here restyles that role everywhere in this edition, and only in this edition. Every edition's look
// must have the same keys (src/editions/index.js).
export const LOOK = {
  colors: {
    // the palette (CLAUDE.md)
    page: '#FFFBEE', // the page: sunny cream; light text on the bright panels
    outside: '#FFEFC2', // around the page: butter yellow; quiet fills
    card: '#FFFFFF', // cards; text on ink
    cream: '#FFF4CF', // soft cream cards
    ink: '#26268F', // borders, text, hard shadows, dark fills: royal indigo
    text: '#33368F', // body text
    hand: '#E8115F', // handwriting: hibiscus pink
    string: '#FF9F1C', // the strings things hang from: saffron
    dek: '#5256D6', // deks (the line under a title)
    wire: '#FFB84D', // the menu's wire; quiet handwritten notes
    yellow: '#FFC914', // marigold: featured, primary buttons' shadow
    red: '#F0214A', // hibiscus red, the ribbon border
    blue: '#2F6BFF', // royal blue
    green: '#12B76A', // leaf green
    purple: '#9B5CFF',
    pink: '#FF5FA2', // lotus pink
    mint: '#3DDCC4', // aqua mint
    // the photo wall
    wall: '#5B50F0', // its panel: vivid violet
    amber: '#FFC914', // its prints' shadows and tagline: marigold lights
    wallInk: '#FFFFFF', // "[photo]" on an empty print
    mutedDark: '#D9D6FF', // its strings; small print on dark panels (photo viewer, phone menu)
    peg: '#FFD27A', // wooden pegs
    bulb: '#FFE066', // fairy-light bulbs
    spark: '#FFFBE0', // sparkles
    // dark panels (photo viewer, phone menu)
    labelDark: '#E4E2FF', // labels on dark
    ruleDark: '#7C73F5', // lines on dark
    // quieter details
    muted: '#6F76B5', // quiet grey text
    grey: '#4E55A0', // secondary text (the words game's "/ say it /")
    bioText: '#33368F', // a member's bio on their profile card
    introLabel: '#E8115F', // "Introduction" on the home intro card
    introText: '#41469A', // the home intro card's lines
    done: '#A9AEDD', // a ticked checklist item
    rule: '#FFD95C', // thin rules: gold thread
    faint: '#EDE6C8', // faint marks
    edge: '#FFD966', // the home page's edge against the outside
    blank: '#FFF3C4', // an empty photo or face
    slotLine: '#F0CB6B', // an empty picture's dashed edge
    slotInk: '#4E55A0', // an empty picture's label and icon
    slotDark: '#3F3FD0', // the same on dark cards
    slotDarkLine: '#8C85FF',
    slotDarkInk: '#FFFFFF',
    snake: '#12B76A', // the games card's pixel snake (shared/GameCard.jsx)
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
