// September 2026's notebook ruling, for everything here that writes on it. look.css draws it: the first line's tile
// starts `start` px down the page sheet, one line every `gap` px, and the red margin line stands `margin` px from the
// left (these numbers mirror look.css). Diary.jsx and "Meet the team" (TEAM_FIT below) both take them from here.
export const RULE = { web: { start: 128, gap: 48, margin: 104 }, phone: { start: 104, gap: 40, margin: 14 } };

// "Meet the team" written on that ruling: overrides for the PHONE / WEB tables in shared/TeamSection.jsx (merged one
// level deep, so a key here only changes the values it names). Text starts clear of the margin, and every line height
// is the ruling's (or two of it), so once shared/TeamSection.jsx drops each block's first baseline on a ruled line
// (lib/ruled.js, as the diary does) the rest of its lines follow. Tops are where a block starts roughly: the fit moves
// it by less than half a line. Only September's section reads this; other editions keep the shared tables.
export const TEAM_FIT = {
  web: {
    title: { left: '128px', top: '27px', lineHeight: '96px' },
    count: { top: '23px', lineHeight: '48px' },
    blurb: { left: '128px', top: '213px', lineHeight: '48px' },
    note: { left: '128px', top: '498px', lineHeight: '48px', transform: 'none' },
    legend: { left: '118px', top: '647px', gap: '0px' },
    chip: { minHeight: '48px' },
    extra: { top: 870, under: false },
  },
  phone: {
    title: { left: '28px', top: '22px', lineHeight: '40px' },
    blurb: { left: '28px', top: '110px', width: '334px', lineHeight: '40px' },
    note: { left: '28px', top: '350px', lineHeight: '40px', transform: 'none' },
    legend: { left: '20px', top: '470px', gap: '0px' },
    chip: { minHeight: '40px' },
    extra: { top: 470 },
    faces: { top: 660 },
  },
};
