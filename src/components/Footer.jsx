import { SITE } from '../data/site.js';

// The footer bar, directly under the orbit banner. Links nowhere, by design.
export default function Footer() {
  return (
    <footer className="site-footer">
      <p className="u-mono site-footer-l1">{`© ${new Date().getFullYear()} AQUATERRA · OPEN COMMUNITY, NO RIGHTS RESERVED.`}</p>
      <p className="u-mono site-footer-l2">{SITE.footerNote}</p>
    </footer>
  );
}
