import { SITE } from '../data/site.js';

// Ghost mascot.
const Ghost = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2.5c-4.4 0-7.5 3.3-7.5 7.6v10.7c0 .6.7.9 1.1.5l1.6-1.5 1.7 1.6c.3.3.8.3 1.1 0L12 19.8l2 1.6c.3.3.8.3 1.1 0l1.7-1.6 1.6 1.5c.4.4 1.1.1 1.1-.5V10.1c0-4.3-3.1-7.6-7.5-7.6z" fill="#8b5cf6" />
    <circle cx="9.3" cy="10.5" r="1.4" fill="#0a0a0a" />
    <circle cx="14.7" cy="10.5" r="1.4" fill="#0a0a0a" />
  </svg>
);

// The footer bar, directly under the orbit banner. Links nowhere, by design.
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-brand">
        <img src="/logo.png" alt="" width="32" height="32" />
        <span className="site-footer-word">AQUATERRA</span>
        <Ghost />
      </div>
      <p className="u-mono site-footer-l1">{`© ${new Date().getFullYear()} AQUATERRA · OPEN COMMUNITY, NO RIGHTS RESERVED.`}</p>
      <p className="u-mono site-footer-l2">{SITE.footerNote}</p>
    </footer>
  );
}
