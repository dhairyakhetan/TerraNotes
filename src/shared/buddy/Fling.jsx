import { useEffect, useRef, useState } from 'react';
import { useEdition } from '../../lib/edition.js';
import { drawGhost } from './Ghost.jsx';
import { FONT } from '../../styles/fonts.js';

// Fling, the slingshot game in Buddy's games (BuddyGames.jsx), played like Angry Birds: drag Buddy back in the
// slingshot (the further, the harder), let go, and knock down towers of planks to pop the grumpy gremlins hiding in
// them. Three Buddies a level; a level is cleared when every gremlin is gone (each unused Buddy is a bonus), else it's
// a retry. Real physics (matter-js, fetched only when this tab opens): planks topple, slide and break when hit hard
// enough; a gremlin pops on a hard enough knock, from Buddy, a plank or a fall. Points: gremlin 5000, plank 500
// (glass 300), unused Buddy 10000. The world is 900 × 500, drawn scaled into the canvas; the canvas only draws while
// the popup is open. Best score in localStorage ('aq-fling-best').
// What tells you what to do: a banner at each level's start (how many gremlins to pop), a pulsing ring and "drag me"
// on Buddy while he waits, and, while you pull, the reach of the band, a dotted line of where he'll fly and a power
// meter; Buddies and gremlins left in the corner; a line after each turn ("missed: pull further", "2 gremlins left");
// buttons drawn on the cleared / out-of-Buddies cards; the cursor changes over Buddy; Restart level under the canvas.
const WW = 900, WH = 500, GROUND = 460, SLING = { x: 150, y: 368 }, PULL = 92, POWER = 0.25, BR = 17;
// levels: [kind, x, y (centre), w, h] for planks ('wood' / 'glass'), [ 'gremlin', x, y, r ]
const LEVELS = [
  [ // a hut: two posts, a roof, a gremlin inside and one on top
    ['wood', 650, 400, 20, 120], ['wood', 770, 400, 20, 120], ['wood', 710, 330, 170, 20], ['gremlin', 710, 440, 18],
    ['glass', 710, 290, 20, 60], ['gremlin', 710, 240, 16],
  ],
  [ // two towers and a bridge
    ['wood', 610, 410, 20, 100], ['wood', 670, 410, 20, 100], ['wood', 640, 350, 90, 20], ['gremlin', 640, 440, 16],
    ['wood', 770, 400, 20, 120], ['wood', 840, 400, 20, 120], ['wood', 805, 330, 100, 20], ['gremlin', 805, 440, 16],
    ['glass', 720, 320, 220, 16], ['glass', 650, 290, 20, 44], ['glass', 790, 290, 20, 44], ['gremlin', 720, 290, 18],
  ],
  [ // a castle: glass below, wood above, three gremlins
    ['glass', 610, 420, 20, 80], ['glass', 690, 420, 20, 80], ['glass', 770, 420, 20, 80], ['glass', 850, 420, 20, 80],
    ['wood', 650, 370, 100, 20], ['wood', 810, 370, 100, 20], ['wood', 730, 370, 60, 20],
    ['gremlin', 650, 442, 15], ['gremlin', 810, 442, 15],
    ['wood', 670, 320, 20, 80], ['wood', 790, 320, 20, 80], ['wood', 730, 270, 160, 20], ['gremlin', 730, 345, 17],
    ['glass', 730, 230, 20, 60],
  ],
];
const best = () => { try { return Number(localStorage.getItem('aq-fling-best')) || 0; } catch { return 0; } };
const keep = (v) => { try { localStorage.setItem('aq-fling-best', String(v)); } catch { /* private mode */ } };

export default function Fling({ W, H }) {
  const { colors: K, fonts: F } = useEdition().look; // a canvas can't read CSS variables: the values themselves
  const cv = useRef(null);
  const [score, setScore] = useState(0), [top, setTop] = useState(best), [failed, setFailed] = useState(false);
  const restart = useRef(null);
  useEffect(() => {
    let raf = 0, gone = false, cleanup = () => {};
    import('matter-js').then(({ default: M }) => {
      if (gone) return;
      const c = cv.current, dpr = Math.min(window.devicePixelRatio || 1, 3);
      c.width = Math.round(W * dpr); c.height = Math.round(H * dpr);
      const g = c.getContext('2d'), k = W / WW; // world → canvas
      const T = WH - H / k; // the top of what the canvas shows (a tall canvas shows sky above the world's top)
      const u = (px) => Math.round(px * Math.min(1.8, Math.max(1, 0.62 / k))); // the drawn text and guides: bigger on a small canvas, so they stay readable
      g.setTransform(dpr * k, 0, 0, dpr * k, 0, (H / k - WH) * dpr * k); // the world's floor sits at the canvas's bottom
      const engine = M.Engine.create({ positionIterations: 10, velocityIterations: 8, enableSleeping: true });
      engine.gravity.y = 2; // twice matter's default: Buddy arcs and drops, not flies flat
      let s; // the game's state
      const total = { pts: 0 };
      const add = (n, x, y) => { total.pts += n; setScore(total.pts); s.pops.push({ x, y, text: String(n), life: 1 }); };

      const build = (lv) => {
        M.Composite.clear(engine.world, false);
        M.Composite.add(engine.world, M.Bodies.rectangle(WW / 2, GROUND + 40, WW * 3, 80, { isStatic: true, label: 'ground', friction: 0.9 }));
        const things = LEVELS[lv].map(([kind, x, y, w, h]) => {
          const b = kind === 'gremlin'
            ? M.Bodies.circle(x, y, w, { density: 0.0012, friction: 0.6, restitution: 0.2, label: 'gremlin' })
            : M.Bodies.rectangle(x, y, w, h, { density: kind === 'glass' ? 0.0011 : 0.0016, friction: 0.8, restitution: 0.05, label: kind });
          b.hp = kind === 'gremlin' ? 1 : kind === 'glass' ? 3 : 8; b.kind = kind; b.r = kind === 'gremlin' ? w : 0;
          return b;
        });
        M.Composite.add(engine.world, things);
        s = { lv, birds: 3, state: 'aim', ghost: null, pull: null, trail: [], since: 0, calm: 0.8, pops: [], bits: [], t: 0, banner: 2.2, note: null, hit: 0, grabbed: s?.grabbed || false, start: total.pts };
        setFailed(false);
      };
      build(0);

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
        add(b.kind === 'gremlin' ? 5000 : b.kind === 'glass' ? 300 : 500, x, y - 20);
        if (b.kind === 'gremlin') s.hit++;
        for (let i = 0; i < 8; i++) s.bits.push({ x, y, vx: (Math.random() - 0.5) * 260, vy: -Math.random() * 260, life: 1, kind: b.kind });
      };
      const gremlins = () => M.Composite.allBodies(engine.world).filter((b) => b.kind === 'gremlin' && !b.dead);

      const launch = () => {
        const p = s.pull; s.pull = null;
        if (!p || Math.hypot(p.x - SLING.x, p.y - SLING.y) < 12) return; // a tap, not a pull
        const ghost = M.Bodies.circle(p.x, p.y, BR, { density: 0.004, friction: 0.5, restitution: 0.35, frictionAir: 0.004, label: 'buddy' });
        M.Composite.add(engine.world, ghost);
        M.Body.setVelocity(ghost, { x: (SLING.x - p.x) * POWER, y: (SLING.y - p.y) * POWER });
        s.ghost = ghost; s.birds--; s.state = 'flying'; s.since = 0; s.trail = []; s.hit = 0; s.grabbed = true; s.note = null;
      };
      // a turn ends when everything has (nearly) stopped, Buddy has left the world, or 9 s have passed
      const settle = (dt) => {
        s.since += dt;
        const moving = M.Composite.allBodies(engine.world).some((b) => !b.isStatic && !b.isSleeping && b.speed > 0.25);
        const out = s.ghost && (s.ghost.position.x > WW + 60 || s.ghost.position.x < -60);
        if ((s.since > 1.2 && !moving) || out || s.since > 9) {
          if (s.ghost) { M.Composite.remove(engine.world, s.ghost); s.ghost = null; }
          if (!gremlins().length) { // cleared: unused Buddies count
            for (let i = 0; i < s.birds; i++) add(10000, SLING.x + i * 30, SLING.y - 60);
            s.state = 'clear';
            if (total.pts > best()) { keep(total.pts); setTop(total.pts); }
          } else if (s.birds > 0) {
            const n = gremlins().length;
            s.state = 'aim';
            s.note = { text: s.hit ? `nice! ${n} gremlin${n === 1 ? '' : 's'} left` : 'missed: aim with the dots, pull further', life: 2.6 };
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
        else { g.fillStyle = K.peg; g.fill(); ink(); g.stroke(); }
        if (b.hp < (b.kind === 'glass' ? 3 : 8)) { // cracked
          const { x, y } = b.position; g.save(); g.translate(x, y); g.rotate(b.angle); ink(1.4); g.beginPath(); g.moveTo(-6, -8); g.lineTo(2, 0); g.lineTo(-3, 8); g.stroke(); g.restore();
        }
      };
      const drawSling = (front) => {
        const bx = SLING.x, by = SLING.y;
        if (!front) { // back post and band
          g.fillStyle = K.peg; ink(); g.beginPath(); g.moveTo(bx - 6, GROUND); g.lineTo(bx - 4, by + 40); g.lineTo(bx + 14, by - 4); g.lineTo(bx + 20, by); g.lineTo(bx + 6, by + 44); g.lineTo(bx + 8, GROUND); g.closePath(); g.fill(); g.stroke();
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
            g.fillStyle = K.hand; g.font = `700 ${u(28)}px ${F.hand}`; g.textAlign = 'left';
            g.fillText('← drag me back, then let go', SLING.x + 44, SLING.y - 52 - pulse * 4);
          }
        }
        if (s.pull) power(s.pull);
        // Buddies still waiting
        for (let i = 0; i < Math.max(0, s.birds - (s.state === 'aim' ? 1 : 0)); i++) drawGhost(g, SLING.x - 50 - i * 34, GROUND - 16, 12, K, { t: s.t + i, look: [1, 0] });
        // bits and points
        s.bits.forEach((p) => { g.globalAlpha = Math.max(0, p.life); g.fillStyle = p.kind === 'gremlin' ? K.green : p.kind === 'glass' ? K.blue : K.peg; g.fillRect(p.x - 3, p.y - 3, 6, 6); });
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
        if (s.state === 'clear') label([[s.lv + 1 < LEVELS.length ? 'LEVEL CLEARED!' : 'EVERY GREMLIN GONE!', `700 ${u(40)}px ${F.mono}`, -40], [`+${total.pts - s.start} this level${s.birds ? ` · ${s.birds} Buddy bonus` : ''}`, `600 ${u(30)}px ${F.hand}`, 4]], s.lv + 1 < LEVELS.length ? 'NEXT LEVEL →' : 'PLAY AGAIN ↺');
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
      const down = (e) => {
        e.preventDefault();
        if (s.state === 'clear') { const next = s.lv + 1 < LEVELS.length ? s.lv + 1 : 0; if (!next) { total.pts = 0; setScore(0); } build(next); return; }
        if (s.state === 'failed') { build(s.lv); return; }
        if (s.state !== 'aim' || s.calm > 0) return;
        const p = world(e);
        if (Math.hypot(p.x - SLING.x, p.y - SLING.y) > 90) return; // grab Buddy (generously)
        dragging = true; c.setPointerCapture?.(e.pointerId); s.pull = aimAt(p); c.style.cursor = 'grabbing';
      };
      const move = (e) => {
        if (dragging) { s.pull = aimAt(world(e)); s.banner = Math.min(s.banner, 0.3); return; }
        const p = world(e);
        c.style.cursor = s.state === 'clear' || s.state === 'failed' ? 'pointer' : s.state === 'aim' && Math.hypot(p.x - SLING.x, p.y - SLING.y) < 90 ? 'grab' : 'default';
      };
      const up = () => { if (!dragging) return; dragging = false; launch(); };
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
      <canvas ref={cv} role="img" aria-label={failed ? 'Fling: out of Buddies, tap to retry' : 'Fling: drag Buddy back in the slingshot and let go to knock the towers down'} style={{ display: "block", width: `${W}px`, height: `${H}px`, border: "2px solid var(--ink)", touchAction: "none", cursor: "default", background: "var(--page)" }} />
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "10px" }}>
        <span style={{ flexGrow: "1", fontFamily: FONT.hand, fontSize: W < 400 ? "18px" : "20px", lineHeight: "1.1", color: "var(--hand)" }}>{W < 400 ? 'pull back · follow the dots · let go' : 'pull Buddy back · the dots show where he’ll fly · let go'}</span>
        <button type="button" className="press btn" onClick={() => restart.current?.()} style={{ "--c": "var(--ink)", flexShrink: "0", fontFamily: FONT.mono, fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase", fontSize: "11px", minHeight: "44px", padding: "0 14px", background: "var(--card)", color: "var(--ink)", border: "2px solid var(--ink)", boxShadow: "3px 3px 0 var(--ink)", cursor: "pointer" }}>↺ Restart level</button>
      </div>
    </>
  );
}
