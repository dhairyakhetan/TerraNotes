import { useId } from 'react';
import { FONT } from '../../../styles/fonts.js';

// February's small drawn pieces (home.jsx): a postmark (a double ring with the town, month and a number round it, and
// wavy cancel lines), a palash flower, and a wax seal.
export function Postmark({ size, label = 'KOLKATA · FEB 2027', no = '', style }) {
  const arc = `pm${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  return (
    <svg aria-hidden="true" width={size * 2.2} height={size} viewBox="0 0 220 100" style={{ overflow: "visible", ...style }}>
      <circle cx="50" cy="50" r="44" fill="none" stroke="var(--h-ink)" strokeWidth="3" opacity=".75" />
      <circle cx="50" cy="50" r="30" fill="none" stroke="var(--h-ink)" strokeWidth="1.5" opacity=".75" />
      <path id={arc} d="M14 50 A36 36 0 1 1 86 50" fill="none" />
      <text fontFamily="Space Mono, monospace" fontSize="10" letterSpacing="1" fill="var(--h-ink)" opacity=".8"><textPath href={`#${arc}`} startOffset="50%" textAnchor="middle">{label}</textPath></text>
      <text x="50" y="56" textAnchor="middle" fontFamily="Space Mono, monospace" fontWeight="700" fontSize="16" fill="var(--h-ink)" opacity=".8">{no}</text>
      {[38, 50, 62].map((y) => <path key={y} d={`M100 ${y} q15 -8 30 0 t30 0 t30 0 t30 0`} fill="none" stroke="var(--h-ink)" strokeWidth="3" opacity=".6" />)}
    </svg>
  );
}

export const Palash = ({ size, style, className }) => (
  <svg aria-hidden="true" className={className} width={size} height={size} viewBox="-50 -50 100 100" style={style}>
    {[0, 72, 144, 216, 288].map((a) => <path key={a} transform={`rotate(${a})`} d="M0 -6 C14 -22 10 -44 0 -46 C-6 -40 -10 -24 0 -6 Z" fill="var(--h-palash)" />)}
    <circle r="7" fill="var(--h-ink)" />
  </svg>
);

export function Seal({ size, text = 'TN', className }) {
  return (
    <span aria-hidden="true" className={className} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: `${size}px`, height: `${size}px`, borderRadius: "46% 54% 50% 48% / 52% 46% 54% 48%", background: "var(--h-seal)", boxShadow: `inset 0 0 0 ${Math.round(size / 9)}px color-mix(in srgb, var(--h-seal) 70%, var(--h-ink)), 2px 3px 0 color-mix(in srgb, var(--h-ink) 40%, transparent)`, color: "var(--h-paper)", fontFamily: FONT.head, fontSize: `${Math.round(size * 0.36)}px`, lineHeight: "1" }}>{text}</span>
  );
}
