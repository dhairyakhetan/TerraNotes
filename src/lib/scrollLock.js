// Stops the page behind a full-screen sheet from scrolling (counted, so sheets can overlap).
let locks = 0;

export function lockScroll() {
  if (locks++ === 0) document.documentElement.style.overflow = 'hidden';
}

export function unlockScroll() {
  if (locks > 0 && --locks === 0) document.documentElement.style.overflow = '';
}
