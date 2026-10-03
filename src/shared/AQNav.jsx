import { useOutsideNavigate } from '../router.jsx';
import { AQ_ACTIONS } from '../data/aqNav.js';
import { SITE } from '../data/site.js';
import { HOST } from '../host.js';
import { withBase } from '../lib/base.js';
import { FONT } from '../styles/fonts.js';

// The pieces of AQ's nav that the magazine's header carries (web/WebHeader.jsx: the laptop pill; phone/PhoneHeader.jsx:
// the top pill + the bottom dock). Links and actions are listed in data/aqNav.js.
//
// FOR CLAUDE IN AQ'S REPO (dhairyakhetan/fah): this header now replaces AQ's own bars on /terranotes pages.
//   1. Hide AQ's bars there: in components/PublicLayout.tsx, don't render <AQNav> or <MobileMenuBar> when
//      isTnPath(pathname) (it already imports isTnPath from terranotes/lib/base).
//   2. Make the placeholder buttons real: each one fires a window event, 'aq-nav', detail { action, el }, with action
//      'search' | 'account' | 'menu' and el the button pressed. Listen for it (e.g. in PublicLayout), call
//      e.preventDefault() and open AQ's own search / login or profile menu / mega menu (the code is in AQNav.tsx).
//      Unanswered (the magazine's own site), the button just opens that page on AQ's site.
//   3. Signed-in state (avatar instead of "log in", unread dot, HoD desk): not drawn here yet. Simplest: render AQ's
//      own avatar button into the slot <span data-aq-slot="account"> with a portal, or tell the magazine's owner
//      what you need and it gets a prop here.
// Don't edit this file in AQ's repo: change it in the TerraNotes repo and export (src/terranotes/README.md).

// a link to one of AQ's own pages: AQ's route inside AQ's website, AQ's site from the magazine's own
export function AqLink({ path, children, ...rest }) {
  const go = useOutsideNavigate();
  if (!HOST.embedded) return <a href={SITE.website + path} {...rest}>{children}</a>;
  const click = (e) => {
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button > 0) return;
    e.preventDefault();
    go(path);
  };
  return <a href={path} onClick={click} {...rest}>{children}</a>;
}

// one of AQ's placeholder actions (search, log in, menu): see the note at the top
export function AqAction({ action, children, ...rest }) {
  const { label, fallback } = AQ_ACTIONS[action];
  const press = (e) => {
    const ask = new CustomEvent('aq-nav', { cancelable: true, detail: { action, el: e.currentTarget } });
    if (dispatchEvent(ask)) location.assign(HOST.embedded ? fallback : SITE.website + fallback); // nobody answered
  };
  return <span data-aq-slot={action} style={{ display: "contents" }}><button type="button" aria-label={label} onClick={press} {...rest}>{children}</button></span>;
}

export const AqGlobe = ({ size }) => <img src={withBase('/brand/aquaterra-globe.webp')} alt="" width={size} height={size} style={{ display: "block", width: `${size}px`, height: `${size}px` }} />;

// AQ's look for its pills: white, ink edge, fully round
export const PILL = { background: "var(--card)", border: "2px solid var(--ink)", borderRadius: "999px", boxShadow: "4px 4px 0 var(--ink)" };
export const AQ_LABEL = { fontFamily: FONT.mono, fontWeight: "700", fontSize: "12px", letterSpacing: "1.2px", textTransform: "uppercase", color: "var(--ink)", textDecoration: "none" };

// line icons for AQ's bars (outline, like AQ's heroicons), in currentColor
const line = (size, d) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" }}>{d}</svg>;
export const AQ_ICONS = {
  search: (s = 18) => line(s, <><circle cx="11" cy="11" r="7" /><path d="M21 21 L16.6 16.6" /></>),
  dots: (s = 18) => line(s, <><circle cx="5" cy="12" r="1.2" /><circle cx="12" cy="12" r="1.2" /><circle cx="19" cy="12" r="1.2" /></>),
  home: (s = 20) => line(s, <><path d="M3 11 L12 3.5 L21 11" /><path d="M5.5 9.5 V20 H18.5 V9.5" /><path d="M10 20 V14 H14 V20" /></>),
  map: (s = 20) => line(s, <><path d="M9 4 L3 6.5 V20 L9 17.5 L15 20 L21 17.5 V4 L15 6.5 Z" /><path d="M9 4 V17.5" /><path d="M15 6.5 V20" /></>),
  user: (s = 20) => line(s, <><circle cx="12" cy="8" r="4" /><path d="M4.5 20.5 C5.5 16 8.5 14 12 14 C15.5 14 18.5 16 19.5 20.5" /></>),
  book: (s = 20) => line(s, <><path d="M12 6.5 C10 5 7 4.5 3.5 5 V19 C7 18.5 10 19 12 20.5 C14 19 17 18.5 20.5 19 V5 C17 4.5 14 5 12 6.5 Z" /><path d="M12 6.5 V20.5" /></>),
  news: (s = 20) => line(s, <><path d="M4 5 H17 V19 H6 A2 2 0 0 1 4 17 Z" /><path d="M17 9 H20 V17 A2 2 0 0 1 18 19 H17" /><path d="M7.5 9 H13.5" /><path d="M7.5 12.5 H13.5" /><path d="M7.5 16 H11" /></>),
  globe: (s = 20) => line(s, <><circle cx="12" cy="12" r="9" /><path d="M3 12 H21" /><path d="M12 3 C9 6 9 18 12 21 C15 18 15 6 12 3" /></>),
};
