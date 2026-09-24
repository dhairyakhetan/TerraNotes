import React from 'react';
import Menu from './Menu.jsx';
import { lockScroll, unlockScroll } from '../lib/scrollLock.js';

const EASE = 'cubic-bezier(0.32, 0.72, 0, 1)';

// Slides the menu in from the right; swipe right to close. `open` / `onClose` belong to the page.
export default class MenuSheet extends React.Component {
  state = { mdx: 0, mdrag: false };

  componentDidUpdate(prev) {
    if (this.props.open && !prev.open) lockScroll();
    if (!this.props.open && prev.open) unlockScroll();
  }

  componentWillUnmount() {
    if (this.props.open) unlockScroll();
  }

  close = () => {
    this.setState({ mdx: 0, mdrag: false });
    this.props.onClose();
  };

  ts = (e) => {
    const t = e.touches && e.touches[0];
    if (!this.props.open || !t) return;
    this._mx = t.clientX; this._my = t.clientY; this._mt = Date.now(); this._ml = null;
  };

  tm = (e) => {
    const t = e.touches && e.touches[0]; if (this._mx == null || !t) return;
    const dx = t.clientX - this._mx, dy = t.clientY - this._my;
    if (this._ml == null) { if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return; this._ml = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'; }
    if (this._ml !== 'x') return;
    this.setState({ mdrag: true, mdx: dx > 0 ? dx : dx * 0.15 });
  };

  te = () => {
    if (this._mx == null) return; this._mx = null;
    const dd = this.state.mdx || 0, v = dd / Math.max(1, Date.now() - this._mt);
    if (dd > 110 || (v > 0.5 && dd > 20)) this.close();
    else if (this.state.mdrag) this.setState({ mdx: 0, mdrag: false });
  };

  render() {
    const { open, current, edge = '#F0442B' } = this.props;
    const d = this.state.mdx || 0, drag = this.state.mdrag;
    return (
      <div
        className={open ? 'menu-sheet is-open' : 'menu-sheet'}
        aria-hidden={open ? 'false' : 'true'}
        onTouchStart={this.ts}
        onTouchMove={this.tm}
        onTouchEnd={this.te}
        onTouchCancel={this.te}
        style={{
          position: 'fixed', left: '0', right: '0', top: '0', margin: '0 auto', width: '390px', zIndex: '100',
          background: '#111111', boxShadow: `-12px 0 0 ${edge}`,
          transform: `translate3d(${open ? d + 'px' : 'calc(100% + 16px)'}, 0, 0)`,
          visibility: open ? 'visible' : 'hidden',
          transition: drag ? 'none' : (open ? `transform 360ms ${EASE}, visibility 0s` : `transform 300ms ${EASE}, visibility 0s linear 300ms`),
          willChange: 'transform',
        }}
      >
        <Menu open={this.props.open} current={current} onClose={this.close} />
      </div>
    );
  }
}
