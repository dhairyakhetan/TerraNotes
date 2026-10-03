// September 2026's notebook ruling, for everything here that writes on it. look.css draws it: the first line's tile
// starts `start` px down the page sheet, one line every `gap` px, and the red margin line stands `margin` px from the
// left (these numbers mirror look.css). Diary.jsx and "Meet the team" (TEAM_FIT below) both take them from here.
export const RULE = { web: { start: 128, gap: 32, margin: 104 }, phone: { start: 104, gap: 28, margin: 14 } };

// "Meet the team" written on that ruling: overrides for the PHONE / WEB tables in shared/TeamSection.jsx (merged one
// level deep, so a key here only changes the values it names). Text starts clear of the margin, every line height is
// the ruling's (or a whole number of rules), and shared/TeamSection.jsx drops each block's first baseline on a ruled
// line (lib/ruled.js, as the diary does), so the rest of its lines follow. Tops are where a block starts roughly: the
// fit moves it by less than half a rule. No ink divider over the section: the page's own lines do that job. The legend
// (as in every edition: web two by two, phone one column) puts a team every two rules (tap targets stay 44px). Only September reads this.
export const TEAM_FIT = {
  web: {
    rule: { display: 'none' },
    title: { left: '128px', top: '20px', lineHeight: '64px' },
    count: { top: '26px', lineHeight: '32px' },
    blurb: { left: '128px', top: '204px', lineHeight: '32px' },
    note: { left: '128px', top: '382px', lineHeight: '32px', transform: 'none' },
    legend: { left: '118px', top: '520px', gridAutoRows: '64px' },
    extra: { left: 128, top: 680, width: 430, size: 28 },
    face: { role: '10px', roleSpacing: '1.2px' }, // the type sizes September came out with (the shared ones grew later)
  },
  phone: {
    rule: { display: 'none' },
    title: { left: '28px', top: '22px', lineHeight: '56px' },
    blurb: { left: '28px', top: '146px', width: '334px', lineHeight: '28px' },
    note: { left: '28px', top: '324px', width: '330px', lineHeight: '28px', transform: 'none' },
    legend: { left: '20px', top: '394px', gridAutoRows: '56px' },
    extra: { left: 204, top: 400, width: 170, size: 21 },
    faces: { top: 700, rows: [[72, 196, 318], [134, 256]] },
    count: { fontSize: '9px', letterSpacing: '1.6px' }, chip: { fontSize: '9.5px', letterSpacing: '1.2px' }, face: { role: '8.5px', roleSpacing: '1px' }, // as September came out
  },
};
