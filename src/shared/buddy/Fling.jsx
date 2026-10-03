import { useEffect, useRef, useState } from 'react';
import { useEdition } from '../../lib/edition.js';
import { drawGhost } from './Ghost.jsx';
import { FONT } from '../../styles/fonts.js';
import { LEVELS } from './flingLevels.js';
import { CloseIcon } from '../Icons.jsx';

// Fling, the slingshot game in Buddy's games (BuddyGames.jsx), played like Angry Birds: drag Buddy back in the
// slingshot (the further, the harder), let go, and knock down towers of planks to pop the grumpy gremlins hiding in
// them. Three Buddies a level; a level is cleared when every gremlin is gone (each unused Buddy is a bonus), else it's
// a retry. Real physics (matter-js, fetched only when this tab opens): planks topple, slide and break when hit hard
// enough; a gremlin pops on a hard enough knock, from Buddy, a plank or a fall. Points: gremlin 5000, stone 800, wood
// 500, glass 300, unused Buddy 10000. No sleeping bodies: a plank left unheld falls. The world is 1200 × 540, drawn scaled into the canvas; the canvas only draws while
// the popup is open. Best score in localStorage ('aq-fling-best'), the furthest level reached too ('aq-fling-level'):
// the game starts there, and the level picker under the canvas lists every level up to it. The 50 levels: flingLevels.js.
// What tells you what to do: a banner at each level's start (how many gremlins to pop), a pulsing ring and "drag me"
// on Buddy while he waits (the pull starts anywhere on the canvas: the finger's travel pulls him back, so a thumb
// needn't reach the left edge), and, while you pull, the reach of the band, a dotted line of where he'll fly and a power
// meter; Buddies and gremlins left in the corner; a line after each turn ("missed: pull further", "2 gremlins left");
// buttons drawn on the cleared / out-of-Buddies cards; the cursor changes over Buddy; Restart level under the canvas.
const WW = 1200, WH = 540, GROUND = 490, BASE = GROUND - 30, SLING = { x: 160, y: BASE - 92 }, PULL = 100, POWER = 0.25, BR = 17;
// the slingshot stands on a mound at the left (BASE is its top), the gremlins' forts far out at the right, like Angry Birds
const HP = { gremlin: 1, glass: 3, wood: 8, stone: 16 }, PTS = { gremlin: 5000, glass: 300, wood: 500, stone: 800 };
const best = () => { try { return Number(localStorage.getItem('aq-fling-best')) || 0; } catch { return 0; } };
const keep = (v) => { try { localStorage.setItem('aq-fling-best', String(v)); } catch { /* private mode */ } };
// how far you've got: the furthest level open to play (the picker lists them)
const reached = () => { try { return Math.min(LEVELS.length - 1, Number(localStorage.getItem('aq-fling-level')) || 0); } catch { return 0; } };
// stars per level (1 for clearing it, +1 for each Buddy left, up to 3), one digit a level
const starsOf = () => { try { return (localStorage.getItem('aq-fling-stars') || '').padEnd(LEVELS.length, '0').split('').map(Number); } catch { return LEVELS.map(() => 0); } };
const keepStars = (a) => { try { localStorage.setItem('aq-fling-stars', a.join('')); } catch { /* private mode */ } };
const reach = (v) => { try { localStorage.setItem('aq-fling-level', String(v)); } catch { /* private mode */ } };

export default function Fling({ W, H }) {
  const { colors: K, fonts: F } = useEdition().look; // a canvas can't read CSS variables: the values themselves
  const cv = useRef(null);
  const [score, setScore] = useState(0), [top, setTop] = useState(best), [failed, setFailed] = useState(false);
  const restart = useRef(null), jump = useRef(null);
  const [lv, setLv] = useState(reached), [open, setOpen] = useState(reached), [stars, setStars] = useState(starsOf), [pick, setPick] = useState(false);
  useEffect(() => {
    let raf = 0, gone = false, cleanup = () => {};
    import('matter-js').then(({ default: M }) => {
      if (gone) return;
      const c = cv.current, dpr = Math.min(window.devicePixelRatio || 1, 3);
      c.width = Math.round(W * dpr); c.height = Math.round(H * dpr);
      const g = c.getContext('2d'), k = W / WW; // world → canvas
      const T = WH - H / k; // the top of what the canvas shows (a tall canvas shows sky above the world's top)
      const u = (px) => Math.round(px * Math.min(2.4, Math.max(1, 0.62 / k))); // the drawn text and guides: bigger on a small canvas, so they stay readable
      g.setTransform(dpr * k, 0, 0, dpr * k, 0, (H / k - WH) * dpr * k); // the world's floor sits at the canvas's bottom
      const engine = M.Engine.create({ positionIterations: 10, velocityIterations: 8 });
      engine.gravity.y = 2; // twice matter's default: Buddy arcs and drops, not flies flat
      let s; // the game's state
      const s0 = {}; // what stays across levels (the mound's outline)
      const total = { pts: 0 };
      const add = (n, x, y) => { total.pts += n; setScore(total.pts); s.pops.push({ x, y, text: String(n), life: 1 }); };

      const build = (lv) => {
        M.Composite.clear(engine.world, false);
        M.Composite.add(engine.world, M.Bodies.rectangle(WW / 2, GROUND + 40, WW * 3, 80, { isStatic: true, label: 'ground', friction: 0.9 }));
        const mound = M.Bodies.trapezoid(SLING.x, GROUND - 15, 320, GROUND - BASE, 0.4, { isStatic: true, label: 'ground', friction: 0.9 });
        M.Body.setPosition(mound, { x: SLING.x, y: mound.position.y + GROUND - mound.bounds.max.y });
        M.Composite.add(engine.world, mound); s0.mound = mound.vertices;
        const things = LEVELS[lv].map(([kind, x, y, w, h]) => {
          const b = kind === 'gremlin'
            ? M.Bodies.circle(x, y, w, { density: 0.0012, friction: 0.6, restitution: 0.2, label: 'gremlin' })
            : M.Bodies.rectangle(x, y, w, h, { density: kind === 'glass' ? 0.0011 : kind === 'stone' ? 0.003 : 0.0016, friction: 0.8, restitution: 0.05, label: kind });
          b.hp = HP[kind]; b.kind = kind; b.r = kind === 'gremlin' ? w : 0;
          return b;
        });
        M.Composite.add(engine.world, things);
        s = { lv, birds: 3, broke: 0, state: 'aim', ghost: null, pull: null, trail: [], since: 0, calm: 0.8, pops: [], bits: [], t: 0, banner: 2.2, note: null, hit: 0, grabbed: s?.grabbed || false, start: total.pts };
        setFailed(false); setLv(lv);
      };
      build(reached());

      // knocks: a hard enough hit breaks a plank or pops a gremlin (not while a fresh level settles)
      M.Events.on(engine, 'collisionStart', (ev) => {
        if (s.calm > 0) return;
        for (const { bodyA: a, bodyB: b } of ev.pairs) {
          const hit = Math.hypot(a.velocity.x - b.velocity.x, a.velocity.y - b.velocity.y);
          for (const [x, o] of [[a, b], [b, a]]) {
            if (!x.kind || x.dead) continue;
            const blow = hit * (o.label === 'buddy' ? 1.6 : o.isStatic ? 0.8 : 1) * Math.sqrt(Math.max(o.mass, 1) / 2);
            if (blow < (x.kind === 'gremlin' ? 2.6 : 3.2)) continue;
            x.hp -= blow / (x.kind === 'gremlin' ? 2.6 : 3);
            if (x.hp <= 0) breakUp(x);
          }
        }
      });
      const breakUp = (b) => {
        b.dead = true;
        M.Composite.remove(engine.world, b);
        const { x, y } = b.position;
        add(PTS[b.kind], x, y - 20);
        if (b.kind === 'gremlin') s.hit++; else s.broke++;
        for (let i = 0; i < 8; i++) s.bits.push({ x, y, vx: (Math.random() - 0.5) * 260, vy: -Math.random() * 260, life: 1, kind: b.kind });
      };
      const gremlins = () => M.Composite.allBodies(engine.world).filter((b) => b.kind === 'gremlin' && !b.dead);

      const launch = () => {
        const p = s.pull; s.pull = null;
        if (!p || Math.hypot(p.x - SLING.x, p.y - SLING.y) < 12) return; // a tap, not a pull
        const ghost = M.Bodies.circle(p.x, p.y, BR, { density: 0.004, friction: 0.5, restitution: 0.35, frictionAir: 0.004, label: 'buddy' });
        M.Composite.add(engine.world, ghost);
        M.Body.setVelocity(ghost, { x: (SLING.x - p.x) * POWER, y: (SLING.y - p.y) * POWER });
        s.ghost = ghost; s.birds--; s.state = 'flying'; s.since = 0; s.trail = []; s.hit = 0; s.broke = 0; s.grabbed = true; s.note = null;
      };
      // a turn ends when everything has (nearly) stopped, Buddy has left the world, or 9 s have passed
      const settle = (dt) => {
        s.since += dt;
        const moving = M.Composite.allBodies(engine.world).some((b) => !b.isStatic && b.speed > 0.3);
        const out = s.ghost && (s.ghost.position.x > WW + 60 || s.ghost.position.x < -60);
        if ((s.since > 1.2 && !moving) || out || s.since > 9) {
          if (s.ghost) { M.Composite.remove(engine.world, s.ghost); s.ghost = null; }
          if (!gremlins().length) { // cleared: unused Buddies count
            for (let i = 0; i < s.birds; i++) add(10000, SLING.x + i * 30, SLING.y - 60);
            s.state = 'clear'; s.stars = 1 + Math.min(2, s.birds);
            { const a = starsOf(); if (s.stars > a[s.lv]) { a[s.lv] = s.stars; keepStars(a); setStars(a); } }
            if (s.lv + 1 < LEVELS.length && s.lv + 1 > reached()) { reach(s.lv + 1); setOpen(s.lv + 1); }
            if (total.pts > best()) { keep(total.pts); setTop(total.pts); }
          } else if (s.birds > 0) {
            const n = gremlins().length;
            s.state = 'aim';
            s.note = { text: s.hit ? `nice! ${n} gremlin${n === 1 ? '' : 's'} left` : s.broke ? `close! ${n} gremlin${n === 1 ? '' : 's'} left` : 'missed: aim with the dots, pull further', life: 2.6 };
          }
          else { s.state = 'failed'; setFailed(true); if (total.pts > best()) { keep(total.pts); setTop(total.pts); } }
        }
      };

      // drawing (world units)
      const ink = (w = 2.5) => { g.strokeStyle = K.ink; g.lineWidth = w; g.lineJoin = 'round'; };
      const drawBody = (b) => {
        if (b.kind === 'gremlin') {
          const { x, y } = b.position, r = b.r;
          g.save(); g.translate(x, y); g.rotate(b.angle);
          g.fillStyle = K.green; ink(); g.beginPath(); g.arc(0, 0, r, 0, Math.PI * 2); g.fill(); g.stroke();
          g.fillStyle = K.card; for (const sx of [-1, 1]) { g.beginPath(); g.arc(sx * r * 0.36, -r * 0.18, r * 0.26, 0, Math.PI * 2); g.fill(); }
          g.fillStyle = K.ink; for (const sx of [-1, 1]) { g.beginPath(); g.arc(sx * r * 0.32, -r * 0.14, r * 0.12, 0, Math.PI * 2); g.fill(); }
          ink(2); g.beginPath(); g.moveTo(-r * 0.6, -r * 0.55); g.lineTo(-r * 0.12, -r * 0.4); g.moveTo(r * 0.6, -r * 0.55); g.lineTo(r * 0.12, -r * 0.4); g.stroke(); // grumpy brows
          g.beginPath(); g.arc(0, r * 0.5, r * 0.25, Math.PI * 1.15, Math.PI * 1.85); g.stroke(); // frown
          g.restore();
          return;
        }
        const v = b.vertices;
        g.beginPath(); g.moveTo(v[0].x, v[0].y); for (let i = 1; i < v.length; i++) g.lineTo(v[i].x, v[i].y); g.closePath();
        if (b.kind === 'glass') { g.fillStyle = K.cream; g.globalAlpha = 0.85; g.fill(); g.globalAlpha = 1; g.strokeStyle = K.blue; g.lineWidth = 2.5; g.stroke(); }
        else if (b.kind === 'stone') { g.fillStyle = K.muted; g.fill(); ink(); g.stroke(); }
        else { g.fillStyle = K.peg; g.fill(); ink(); g.stroke(); }
        if (b.hp < HP[b.kind]) { // cracked
          const { x, y } = b.position; g.save(); g.translate(x, y); g.rotate(b.angle); ink(1.4); g.beginPath(); g.moveTo(-6, -8); g.lineTo(2, 0); g.lineTo(-3, 8); g.stroke(); g.restore();
        }
      };
      const drawSling = (front) => {
        const bx = SLING.x, by = SLING.y;
        if (!front) { // back post and band
          g.fillStyle = K.peg; ink(); g.beginPath(); g.moveTo(bx - 6, BASE); g.lineTo(bx - 4, by + 40); g.lineTo(bx + 14, by - 4); g.lineTo(bx + 20, by); g.lineTo(bx + 6, by + 44); g.lineTo(bx + 8, BASE); g.closePath(); g.fill(); g.stroke();
        }
        const hold = s.pull || (s.state === 'aim' ? SLING : null);
        if (hold) { g.strokeStyle = K.ink; g.lineWidth = 5; g.beginPath(); g.moveTo(front ? bx - 10 : bx + 16, by); g.lineTo(hold.x, hold.y); g.stroke(); }
        if (front) { g.fillStyle = K.peg; ink(); g.beginPath(); g.moveTo(bx - 2, by + 44); g.lineTo(bx - 16, by); g.lineTo(bx - 8, by - 4); g.lineTo(bx + 4, by + 38); g.closePath(); g.fill(); g.stroke(); }
      };
      // where Buddy will fly from a pull: the same steps as the physics (gravity 2 × 0.001 a ms², 60 steps a second,
      // air friction 0.004), dotted until it lands or leaves the world
      const flight = (p) => {
        let x = p.x, y = p.y, vx = (SLING.x - p.x) * POWER, vy = (SLING.y - p.y) * POWER;
        const dots = [];
        for (let i = 1; i < 150; i++) {
          vx *= 0.996; vy = vy * 0.996 + 0.5556; x += vx; y += vy;
          if (i % 4 === 0) dots.push([x, y]);
          if (y > GROUND - 4 || x > WW + 20) break;
        }
        return dots;
      };
      const button = (text, y, fill = K.yellow) => { // a drawn button (the whole card takes the tap)
        g.font = `700 ${u(22)}px ${F.mono}`; const w = g.measureText(text).width + 56, x = WW / 2 - w / 2;
        const bh = u(52);
        g.fillStyle = K.ink; g.fillRect(x + 5, y + 5, w, bh);
        g.fillStyle = fill; g.fillRect(x, y, w, bh); g.strokeStyle = K.ink; g.lineWidth = 3; g.strokeRect(x, y, w, bh);
        g.fillStyle = K.ink; g.textAlign = 'center'; g.fillText(text, WW / 2, y + bh * 0.65);
      };
      const label = (lines, cta) => {
        g.fillStyle = 'rgba(17,17,17,.6)'; g.fillRect(-400, -400, WW + 800, WH + 800);
        g.textAlign = 'center'; g.fillStyle = K.page;
        lines.forEach(([text, font, y]) => { g.font = font; g.fillText(text, WW / 2, WH / 2 + u(y)); });
        button(cta, WH / 2 + u(56));
      };
      const starRow = (y, n) => { // 3 stars, n of them filled
        for (let i = 0; i < 3; i++) {
          const cx = WW / 2 + (i - 1) * u(58), cy = y + (i === 1 ? -u(8) : 0), R = u(24);
          g.beginPath(); for (let j = 0; j < 10; j++) { const a = -Math.PI / 2 + j * Math.PI / 5, r = j % 2 ? R * 0.45 : R; g.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); } g.closePath();
          g.fillStyle = i < n ? K.yellow : 'rgba(255,255,255,.15)'; g.fill(); g.strokeStyle = K.ink; g.lineWidth = 3; g.stroke();
        }
      };
      const hud = () => { // Buddies and gremlins left, top right
        const n = gremlins().length;
        g.textAlign = 'right'; g.font = `700 ${u(17)}px ${F.mono}`; g.fillStyle = K.ink;
        g.fillText(`× ${n}`, WW - 18, T + u(31));
        const gx = WW - 18 - g.measureText(`× ${n}`).width - u(18);
        g.fillStyle = K.green; ink(2); g.beginPath(); g.arc(gx, T + u(25), u(10), 0, Math.PI * 2); g.fill(); g.stroke();
        const bx = gx - u(40), left = s.birds;
        g.fillStyle = K.ink; g.fillText(`× ${left}`, bx, T + u(31));
        drawGhost(g, bx - g.measureText(`× ${left}`).width - u(16), T + u(24), u(10), K, { t: s.t, look: [1, 0] });
      };
      const power = (p) => { // in the ground band: how hard
        const f = Math.min(1, Math.hypot(p.x - SLING.x, p.y - SLING.y) / PULL);
        const x0 = u(110) + 40, y0 = GROUND + 12, w = 300, bar = Math.min(26, u(16));
        g.fillStyle = K.page; g.font = `700 ${u(15)}px ${F.mono}`; g.textAlign = 'right'; g.fillText('POWER', x0 - 12, y0 + bar * 0.8);
        g.fillStyle = 'rgba(255,255,255,.18)'; g.fillRect(x0, y0, w, bar);
        g.fillStyle = f > 0.85 ? K.red : f > 0.5 ? K.yellow : K.green; g.fillRect(x0, y0, w * f, bar);
        g.strokeStyle = K.page; g.lineWidth = 2; g.strokeRect(x0, y0, w, bar);
        g.fillStyle = K.page; g.textAlign = 'left'; g.fillText(`${Math.round(f * 100)}%`, x0 + w + 12, y0 + bar * 0.8);
      };
      const draw = () => {
        const sky = g.createLinearGradient(0, -200, 0, WH); sky.addColorStop(0, K.page); sky.addColorStop(1, K.outside);
        g.fillStyle = sky; g.fillRect(-400, -400, WW + 800, WH + 800);
        g.fillStyle = K.green; g.globalAlpha = 0.35; g.fillRect(-400, GROUND, WW + 800, 8); g.globalAlpha = 1;
        g.fillStyle = K.text; g.fillRect(-400, GROUND + 8, WW + 800, 400);
        if (s0.mound) { const v = s0.mound; g.fillStyle = K.green; g.globalAlpha = 0.35; g.beginPath(); g.moveTo(v[0].x, v[0].y); for (const q of v) g.lineTo(q.x, q.y); g.closePath(); g.fill(); g.globalAlpha = 1; }
        // the last shot's path, in dots
        g.fillStyle = K.ink; s.trail.forEach((p, i) => { if (i % 2) return; g.globalAlpha = 0.35; g.beginPath(); g.arc(p.x, p.y, 3, 0, Math.PI * 2); g.fill(); }); g.globalAlpha = 1;
        if (s.state === 'aim') { // the band's reach, and while pulling, where he'll fly
          g.strokeStyle = K.ink; g.globalAlpha = s.pull ? 0.35 : 0.15; g.lineWidth = 1.5; g.setLineDash([5, 7]);
          g.beginPath(); g.arc(SLING.x, SLING.y, PULL, 0, Math.PI * 2); g.stroke(); g.setLineDash([]); g.globalAlpha = 1;
          if (s.pull && Math.hypot(s.pull.x - SLING.x, s.pull.y - SLING.y) > 12) {
            flight(s.pull).forEach(([x, y], i, all) => { g.globalAlpha = 0.85 - (i / all.length) * 0.6; g.fillStyle = K.hand; g.beginPath(); g.arc(x, y, 4.5 - (i / all.length) * 2, 0, Math.PI * 2); g.fill(); });
            g.globalAlpha = 1;
          }
        }
        drawSling(false);
        for (const b of M.Composite.allBodies(engine.world)) if (b.kind) drawBody(b);
        // Buddy: in the pouch, pulled back, or flying
        const at = s.ghost ? s.ghost.position : s.pull || (s.state === 'aim' ? SLING : null);
        if (at) drawGhost(g, at.x, at.y - BR * 0.2, BR, K, { t: s.t, tilt: s.ghost ? s.ghost.angle * 0.3 : 0, look: [1, 0], face: s.ghost && s.ghost.speed > 6 ? 'boo' : 'happy' });
        drawSling(true);
        if (s.state === 'aim' && !s.pull && s.calm <= 0) { // "grab me": a pulsing ring, and the first time a word too
          const pulse = (Math.sin(s.t * 4) + 1) / 2;
          g.strokeStyle = K.hand; g.lineWidth = 3; g.globalAlpha = 0.45 + pulse * 0.5;
          g.beginPath(); g.arc(SLING.x, SLING.y - 4, BR + 10 + pulse * 6, 0, Math.PI * 2); g.stroke(); g.globalAlpha = 1;
          if (!s.grabbed) {
            const text = '← drag back from anywhere, then let go', x = SLING.x + 44;
            g.font = `700 ${u(28)}px ${F.hand}`; const fit = Math.min(1, (WW - 20 - x) / g.measureText(text).width); // shrunk to fit a small canvas
            g.fillStyle = K.hand; g.font = `700 ${Math.round(u(28) * fit)}px ${F.hand}`; g.textAlign = 'left';
            g.fillText(text, x, SLING.y - 52 - pulse * 4);
          }
        }
        if (s.finger && Math.hypot(s.finger.p.x - SLING.x, s.finger.p.y - SLING.y) > PULL * 1.3) { // dragging away from Buddy: show the finger's pull
          const { a, p: q } = s.finger; g.globalAlpha = 0.45; g.strokeStyle = K.ink; g.lineWidth = 2; g.setLineDash([6, 6]);
          g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(q.x, q.y); g.stroke(); g.setLineDash([]);
          g.beginPath(); g.arc(a.x, a.y, u(10), 0, Math.PI * 2); g.stroke(); g.fillStyle = K.ink; g.beginPath(); g.arc(q.x, q.y, u(7), 0, Math.PI * 2); g.fill(); g.globalAlpha = 1;
        }
        if (s.pull) power(s.pull);
        // Buddies still waiting
        for (let i = 0; i < Math.max(0, s.birds - (s.state === 'aim' ? 1 : 0)); i++) drawGhost(g, SLING.x - 50 - i * 34, BASE - 13, 12, K, { t: s.t + i, look: [1, 0] });
        // bits and points
        s.bits.forEach((p) => { g.globalAlpha = Math.max(0, p.life); g.fillStyle = p.kind === 'gremlin' ? K.green : p.kind === 'glass' ? K.blue : p.kind === 'stone' ? K.muted : K.peg; g.fillRect(p.x - 3, p.y - 3, 6, 6); });
        g.globalAlpha = 1;
        g.textAlign = 'center';
        s.pops.forEach((p) => { g.globalAlpha = Math.max(0, p.life); g.fillStyle = K.ink; g.font = `700 ${u(22)}px ${F.mono}`; g.fillText(p.text, p.x, p.y - (1 - p.life) * 40); });
        g.globalAlpha = 1;
        g.textAlign = 'left'; g.fillStyle = K.ink; g.font = `700 ${u(18)}px ${F.mono}`; g.fillText(`LEVEL ${s.lv + 1}/${LEVELS.length}`, 18, T + u(30));
        hud();
        if (s.banner > 0 && s.state === 'aim') { // the level's goal
          const n = gremlins().length, a = Math.min(1, s.banner / 0.5);
          g.globalAlpha = a; g.fillStyle = K.ink; const by = T + u(56); g.fillRect(WW / 2 - u(230), by, u(460), u(92));
          g.textAlign = 'center'; g.fillStyle = K.yellow; g.font = `700 ${u(30)}px ${F.mono}`; g.fillText(`LEVEL ${s.lv + 1}`, WW / 2, by + u(40));
          g.fillStyle = K.page; g.font = `700 ${u(26)}px ${F.hand}`; g.fillText(`pop all ${n} gremlins with ${s.birds} Buddies`, WW / 2, by + u(74));
          g.globalAlpha = 1;
        }
        if (s.note && s.state === 'aim') { // how the last turn went
          g.globalAlpha = Math.min(1, s.note.life); g.textAlign = 'center'; g.fillStyle = K.hand; g.font = `700 ${u(30)}px ${F.hand}`;
          g.fillText(s.note.text, WW / 2, T + u(190)); g.globalAlpha = 1;
        }
        if (s.state === 'clear') { label([[s.lv + 1 < LEVELS.length ? 'LEVEL CLEARED!' : 'EVERY GREMLIN GONE!', `700 ${u(40)}px ${F.mono}`, -40], [`+${total.pts - s.start} this level${s.birds ? ` · ${s.birds} Buddy bonus` : ''}`, `600 ${u(30)}px ${F.hand}`, 4]], s.lv + 1 < LEVELS.length ? 'NEXT LEVEL →' : 'PLAY AGAIN ↺'); starRow(WH / 2 - u(118), s.stars); }
        if (s.state === 'failed') { const n = gremlins().length; label([['OUT OF BUDDIES', `700 ${u(40)}px ${F.mono}`, -40], [`${n} gremlin${n === 1 ? '' : 's'} still standing`, `600 ${u(30)}px ${F.hand}`, 4]], 'TRY AGAIN ↺'); }
      };

      let last = performance.now(), acc = 0;
      const loop = (now) => {
        raf = requestAnimationFrame(loop);
        const dt = Math.min(0.05, (now - last) / 1000); last = now; s.t += dt; s.calm = Math.max(0, s.calm - dt); s.banner -= s.grabbed || s.lv ? dt : dt * 0.5;
        if (s.note) { s.note.life -= dt; if (s.note.life <= 0) s.note = null; }
        acc += dt;
        while (acc >= 1 / 60) { M.Engine.update(engine, 1000 / 60); acc -= 1 / 60; }
        for (const b of M.Composite.allBodies(engine.world)) if (b.kind && !b.dead && b.position.y > WH + 200) breakUp(b); // fell off the world
        if (s.ghost) { s.trail.push({ x: s.ghost.position.x, y: s.ghost.position.y }); if (s.trail.length > 400) s.trail.shift(); }
        if (s.state === 'flying') settle(dt);
        s.bits.forEach((p) => { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 700 * dt; p.life -= dt * 1.6; });
        s.bits = s.bits.filter((p) => p.life > 0);
        s.pops.forEach((p) => { p.life -= dt * 0.9; });
        s.pops = s.pops.filter((p) => p.life > 0);
        draw();
      };
      raf = requestAnimationFrame(loop);

      // pointer → world (the canvas may be zoomed with the page: measure it)
      const world = (e) => { const r = c.getBoundingClientRect(); const wx = ((e.clientX - r.left) / r.width) * W / k, wy = ((e.clientY - r.top) / r.height) * H / k - (H / k - WH); return { x: wx, y: wy }; };
      const aimAt = (p) => { const dx = p.x - SLING.x, dy = p.y - SLING.y, d = Math.hypot(dx, dy), m = Math.min(1, PULL / (d || 1)); return { x: SLING.x + dx * m, y: SLING.y + dy * m }; };
      let dragging = false;
      const span = Math.max(PULL, 90 / k); // a full pull: at least 90 screen px of finger travel
      let anchor = null;
      const down = (e) => {
        e.preventDefault();
        if (s.state === 'clear') { const next = s.lv + 1 < LEVELS.length ? s.lv + 1 : 0; if (!next) { total.pts = 0; setScore(0); } build(next); return; }
        if (s.state === 'failed') { build(s.lv); return; }
        if (s.state !== 'aim' || s.calm > 0) return;
        const p = world(e);
        // anywhere on the canvas: the finger's travel from here pulls Buddy back
        dragging = true; anchor = p; c.setPointerCapture?.(e.pointerId); s.pull = { ...SLING }; s.finger = { a: p, p }; c.style.cursor = 'grabbing';
      };
      const move = (e) => {
        if (dragging) {
          const q = world(e), f = PULL / span;
          s.pull = aimAt({ x: SLING.x + (q.x - anchor.x) * f, y: SLING.y + (q.y - anchor.y) * f }); s.finger = { a: anchor, p: q };
          s.banner = Math.min(s.banner, 0.3); return;
        }
        c.style.cursor = s.state === 'clear' || s.state === 'failed' ? 'pointer' : s.state === 'aim' ? 'grab' : 'default';
      };
      const up = () => { if (!dragging) return; dragging = false; s.finger = null; launch(); };
      jump.current = (n) => { total.pts = 0; setScore(0); s.finger = null; dragging = false; build(n); };
      restart.current = () => { total.pts = s.start; setScore(total.pts); build(s.lv); };
      c.addEventListener('pointerdown', down); c.addEventListener('pointermove', move); c.addEventListener('pointerup', up); c.addEventListener('pointercancel', up);
      cleanup = () => { c.removeEventListener('pointerdown', down); c.removeEventListener('pointermove', move); c.removeEventListener('pointerup', up); c.removeEventListener('pointercancel', up); M.Engine.clear(engine); };
    }).catch(() => { /* the physics didn't arrive: the canvas stays empty */ });
    return () => { gone = true; cancelAnimationFrame(raf); cleanup(); };
  }, [W, H]);
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: FONT.mono, fontWeight: "700", letterSpacing: "1.2px", textTransform: "uppercase", fontSize: "10.5px", margin: "0 0 8px" }}>
        <span>{`${score} points`}</span><span style={{ color: "var(--muted)" }}>{`best ${top}`}</span>
      </div>
      <canvas ref={cv} role="img" aria-label={failed ? 'Fling: out of Buddies, tap to retry' : 'Fling: drag back anywhere on the game and let go to fling Buddy at the towers'} style={{ display: pick ? "none" : "block", width: `${W}px`, height: `${H}px`, border: "2px solid var(--ink)", touchAction: "none", cursor: "default", background: "var(--page)" }} />
      {pick && <LevelGrid W={W} H={H} lv={lv} open={open} stars={stars} onPick={(n) => { setPick(false); jump.current?.(n); }} onClose={() => setPick(false)} />}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: W < 400 ? "8px" : "12px", marginTop: "12px" }}>
        <button type="button" className="press btn" aria-label="Previous level" disabled={lv <= 0} onClick={() => jump.current?.(lv - 1)} style={{ ...BTN, width: "44px", padding: "0", opacity: lv <= 0 ? 0.35 : 1 }}>‹</button>
        <button type="button" className="press btn" aria-label="Pick a level" aria-expanded={pick ? 'true' : 'false'} onClick={() => setPick((v) => !v)} style={{ ...BTN, "--c": "var(--yellow)", background: pick ? "var(--ink)" : "var(--card)", color: pick ? "var(--card)" : "var(--ink)", boxShadow: "3px 3px 0 var(--yellow)", padding: "0 14px", minWidth: W < 400 ? "116px" : "150px" }}>{`Level ${lv + 1}/${LEVELS.length}`} <span aria-hidden="true">{pick ? '▴' : '▾'}</span></button>
        <button type="button" className="press btn" aria-label="Next level" disabled={lv >= open} onClick={() => jump.current?.(lv + 1)} style={{ ...BTN, width: "44px", padding: "0", opacity: lv >= open ? 0.35 : 1 }}>›</button>
        <button type="button" className="press btn" aria-label="Restart level" onClick={() => { setPick(false); restart.current?.(); }} style={{ ...BTN, padding: W < 400 ? "0" : "0 14px", width: W < 400 ? "44px" : "auto" }}>{W < 400 ? '↺' : '↺ Restart'}</button>
      </div>
      <p style={{ margin: "10px 0 0", textAlign: "center", fontFamily: FONT.hand, fontSize: W < 400 ? "18px" : "20px", lineHeight: "1.1", color: "var(--hand)" }}>{W < 400 ? 'drag back anywhere · follow the dots · let go' : 'drag back from anywhere on the game · the dots show where he’ll fly · let go'}</p>
    </>
  );
}

const BTN = { "--c": "var(--ink)", flexShrink: "0", fontFamily: FONT.mono, fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase", fontSize: "12px", minHeight: "44px", background: "var(--card)", color: "var(--ink)", border: "2px solid var(--ink)", boxShadow: "3px 3px 0 var(--ink)", cursor: "pointer" };

// the level picker: every level as a tile, in the canvas's place while open. Played ones show their stars, the
// current one is inked, the next one to beat has a yellow shadow, the rest are locked (dashed).
function LevelGrid({ W, H, lv, open, stars, onPick, onClose }) {
  const cols = W < 400 ? 6 : 10, total = stars.reduce((a, b) => a + b, 0);
  return (
    <div className="card-drop" role="dialog" aria-label="Pick a level" style={{ boxSizing: "border-box", width: `${W}px`, minHeight: `${H}px`, border: "2px solid var(--ink)", background: "var(--card)", padding: W < 400 ? "12px" : "18px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
        <span style={{ fontFamily: FONT.head, fontSize: W < 400 ? "18px" : "22px", textTransform: "uppercase", color: "var(--ink)" }}>Pick a level</span>
        <span style={{ flexGrow: "1", display: "flex", alignItems: "center", gap: "6px", fontFamily: FONT.mono, fontWeight: "700", fontSize: "11px", letterSpacing: "1px", color: "var(--muted)" }}><Stars n={1} of={1} size={13} />{`${total}/${LEVELS.length * 3}`}</span>
        <button type="button" className="press btn" aria-label="Back to the game" onClick={onClose} style={{ ...BTN, width: "44px", padding: "0" }}><CloseIcon size={14} weight={2.8} /></button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: W < 400 ? "6px" : "10px" }}>
        {LEVELS.map((_, i) => {
          const locked = i > open, here = i === lv, next = i === open && !stars[i];
          return (
            <button key={i} type="button" className={locked ? undefined : 'press btn'} disabled={locked} onClick={() => onPick(i)} aria-label={locked ? `Level ${i + 1}, locked` : `Level ${i + 1}${stars[i] ? `, ${stars[i]} of 3 stars` : ''}`} aria-current={here ? 'true' : undefined}
              style={{ "--c": next ? "var(--yellow)" : "var(--ink)", minHeight: W < 400 ? "48px" : "60px", padding: "4px 0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "2px", fontFamily: FONT.mono, fontWeight: "700", fontSize: W < 400 ? "14px" : "16px", cursor: locked ? "default" : "pointer",
                background: here ? "var(--ink)" : locked ? "transparent" : "var(--card)", color: here ? "var(--yellow)" : locked ? "var(--muted)" : "var(--ink)",
                border: locked ? "1.5px dashed var(--muted)" : "2px solid var(--ink)", boxShadow: locked ? "none" : `3px 3px 0 ${next ? "var(--yellow)" : "var(--ink)"}`, opacity: locked ? 0.6 : 1 }}>
              <span>{i + 1}</span>
              {!locked && <Stars n={stars[i]} size={W < 400 ? 9 : 12} on={here} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// n of 3 (or `of`) little drawn stars, filled yellow; empty ones are outlines
const STAR = 'M6 0.6 L7.6 4.1 L11.4 4.4 L8.5 6.9 L9.4 10.6 L6 8.6 L2.6 10.6 L3.5 6.9 L0.6 4.4 L4.4 4.1 Z';
function Stars({ n, of = 3, size = 11, on = false }) {
  return (
    <span aria-hidden="true" style={{ display: "inline-flex", gap: "1px" }}>
      {Array.from({ length: of }, (_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 12 12"><path d={STAR} style={{ fill: i < n ? "var(--yellow)" : "none", stroke: on ? "var(--yellow)" : "var(--ink)", strokeWidth: 1.1, strokeLinejoin: "round" }} /></svg>
      ))}
    </span>
  );
}
