import { useEffect, useState } from 'react';
import { PHOTOS } from '../data/photos.js';

// Each wall photo's shape (width / height), once it has loaded; null until then. The wall's frames follow it,
// kept between `min` and `max` so a very tall or wide photo can't run into its neighbours.
export function usePhotoShapes(min, max) {
  const [shapes, setShapes] = useState(() => PHOTOS.map(() => null));
  useEffect(() => {
    let live = true;
    PHOTOS.forEach((p, i) => {
      if (!p.photo) return;
      const img = new Image();
      img.onload = () => live && img.naturalHeight && setShapes((s) => s.map((v, k) => (k === i ? Math.min(max, Math.max(min, img.naturalWidth / img.naturalHeight)) : v)));
      img.src = p.photo;
    });
    return () => { live = false; };
  }, [min, max]);
  return shapes;
}

// A wall photo's frame (px): the photo at its own shape, no wider than maxW and no taller than maxH. A very tall one
// keeps at least minW of width (a sliver of it is cropped then). Without a shape yet, the whole maxW × maxH box.
export function fitFrame(shape, maxW, maxH, minW) {
  if (!shape) return { w: maxW, h: maxH };
  const w = Math.max(minW, Math.min(maxW, maxH * shape));
  return { w: Math.round(w), h: Math.round(Math.min(maxH, w / shape)) };
}
