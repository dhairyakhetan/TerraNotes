// Stops the page behind a full-screen sheet from scrolling. Counted, so overlapping sheets are fine.
let locks = 0;

export function lockScroll() {
  if (locks++ === 0) document.documentElement.style.overflow = 'hidden';
}

export function unlockScroll() {
  if (locks > 0 && --locks === 0) document.documentElement.style.overflow = '';
}
