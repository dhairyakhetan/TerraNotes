import { webZoom } from './layout.js';

// Card → article "fly": the tapped card's on-screen box, handed to the article page that opens next.
// (lib/pageTransition.js remembers it for any card link; web cards also do it themselves.)
let last = null;

export const rememberBox = (r) => { last = { x: r.left, y: r.top, w: r.width, t: Date.now() }; };
export const rememberCard = (e) => rememberBox(e.currentTarget.getBoundingClientRect());

// The box, once, if the card was tapped in the last 4 seconds.
export const takeCard = () => {
  const f = last;
  last = null;
  return f && Date.now() - f.t < 4000 ? f : null;
};

// The tapped card's box → the cover: it starts where the card was, lifts into place, then drops onto its wire.
// direct: straight into place with one small settle (phone: the lift-and-drop there read as landing twice).
export const flyFrom = (el, f, direct = false) => {
  el.getAnimations().forEach((an) => an.cancel()); // instead of the usual drop-in
  const r = el.getBoundingClientRect();
  if (!r.width) return;
  const z = webZoom(), s = f.w / r.width, dx = (f.x - r.left) / z, dy = (f.y - r.top) / z;
  el.style.transformOrigin = '0 0';
  if (direct) {
    el.animate([
      { transform: `translate(${dx}px, ${dy}px) scale(${s}) rotate(-2deg)`, easing: 'cubic-bezier(0.25, 0.8, 0.3, 1)' },
      { transform: 'translate(0px, 4px) rotate(0.6deg)', offset: 0.8, easing: 'ease-in-out' },
      { transform: 'translate(0px, 0px) rotate(0deg)' },
    ], { duration: 620 });
    return;
  }
  el.animate([
    { transform: `translate(${dx}px, ${dy}px) scale(${s}) rotate(-2deg)`, easing: 'cubic-bezier(0.32, 0.72, 0, 1)' },
    { transform: 'translate(0px, -46px) scale(1) rotate(-3deg)', easing: 'cubic-bezier(0.55, 0, 0.9, 0.45)', offset: 0.5 },
    { transform: 'translate(0px, 8px) rotate(1.6deg)', easing: 'ease-out', offset: 0.72 },
    { transform: 'translate(0px, -3px) rotate(-0.8deg)', easing: 'ease-in-out', offset: 0.87 },
    { transform: 'translate(0px, 0px) rotate(0deg)' },
  ], { duration: 900 });
};

// On an article page: fly the hero in from the tapped card, if there was one (else its usual drop-in plays).
export const flyInFromCard = (el, direct = false) => {
  const f = takeCard();
  if (f && el?.animate && !matchMedia('(prefers-reduced-motion: reduce)').matches) flyFrom(el, f, direct);
};
