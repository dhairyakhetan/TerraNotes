import { Link, useLocation, useNavigate } from 'react-router';

// "Back to home" links. If this page was opened from the home page, going back is a real Back (you land where you
// were, scrolled to the same spot); otherwise (opened from a shared link, after a reload…) it opens the home page.
const from = {}; // location key → the path it was opened from (App's ScrollManager notes it on every link)
export const noteFrom = (key, path) => { from[key] = path; };
const HOME = /^\/(articles|photos|words|members)?$/;

export function BackHome({ children, onClick, ...rest }) {
  const { key } = useLocation();
  const nav = useNavigate();
  const back = (e) => {
    onClick?.(e);
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button > 0) return;
    if (from[key] && HOME.test(from[key])) { e.preventDefault(); nav(-1); }
  };
  return <Link to="/" onClick={back} {...rest}>{children}</Link>;
}
