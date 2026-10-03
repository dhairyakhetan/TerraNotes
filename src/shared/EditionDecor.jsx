import { DECOR } from '../editions/pages.js';
import { useEdition } from '../lib/edition.js';

// The page's edition's own doodles on the home page (src/editions/pages.js DECOR), if it has any.
export default function EditionDecor({ web }) {
  const Decor = DECOR[useEdition().id];
  return Decor ? <Decor web={web} /> : null;
}
