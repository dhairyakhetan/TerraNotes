// Card → article "fly": the tapped card's on-screen box, handed to the article page that opens next.
let last = null;

export const rememberCard = (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  last = { x: r.left, y: r.top, w: r.width, t: Date.now() };
};

// The box, once, if the card was tapped in the last 4 seconds.
export const takeCard = () => {
  const f = last;
  last = null;
  return f && Date.now() - f.t < 4000 ? f : null;
};
