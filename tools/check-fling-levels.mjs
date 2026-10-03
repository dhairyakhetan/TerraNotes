// Plays every Fling level (src/shared/buddy/flingLevels.js) to check it: it must stand still until hit, and 3 Buddies
// must be able to clear it (for each Buddy it tries 76 shots and keeps the best). The physics and knocks copy
// Fling.jsx: change one, change both. Run after adding or changing levels: node tools/check-fling-levels.mjs [n…]
import M from 'matter-js';
import { LEVELS } from '../src/shared/buddy/flingLevels.js';
const WW=1200, WH=540, GROUND=490, BASE=GROUND-30, SLING={x:160,y:BASE-92}, PULL=100, POWER=0.25, BR=17;
const HP={gremlin:1,glass:3,wood:8,stone:16};
function world(lv){
  const e=M.Engine.create({positionIterations:10,velocityIterations:8}); e.gravity.y=2;
  M.Composite.add(e.world, M.Bodies.rectangle(WW/2,GROUND+40,WW*3,80,{isStatic:true,label:'ground',friction:0.9}));
  const mound=M.Bodies.trapezoid(SLING.x,GROUND-15,320,GROUND-BASE,0.4,{isStatic:true,label:'ground',friction:0.9});
  M.Body.setPosition(mound,{x:SLING.x,y:mound.position.y+GROUND-mound.bounds.max.y}); M.Composite.add(e.world,mound);
  const bs=LEVELS[lv].map(([kind,x,y,w,h])=>{const b=kind==='gremlin'?M.Bodies.circle(x,y,w,{density:0.0012,friction:0.6,restitution:0.2,label:'gremlin'}):M.Bodies.rectangle(x,y,w,h,{density:kind==='glass'?0.0011:kind==='stone'?0.003:0.0016,friction:0.8,restitution:0.05,label:kind}); b.hp=HP[kind]; b.kind=kind; return b;});
  M.Composite.add(e.world,bs);
  const st={calm:0.8, broke:0};
  M.Events.on(e,'collisionStart',(ev)=>{ if(st.calm>0) return;
    for(const {bodyA:a,bodyB:b} of ev.pairs){ const hit=Math.hypot(a.velocity.x-b.velocity.x,a.velocity.y-b.velocity.y);
      for(const [x,o] of [[a,b],[b,a]]){ if(!x.kind||x.dead) continue;
        const blow=hit*(o.label==='buddy'?1.6:o.isStatic?0.8:1)*Math.sqrt(Math.max(o.mass,1)/2);
        if(blow<(x.kind==='gremlin'?2.6:3.2)) continue; x.hp-=blow/(x.kind==='gremlin'?2.6:3); if(x.hp<=0) brk(x);} } });
  const brk=(b)=>{b.dead=true; M.Composite.remove(e.world,b); st.broke++;};
  const step=()=>{ M.Engine.update(e,1000/60); st.calm=Math.max(0,st.calm-1/60); for(const b of bs) if(!b.dead&&b.position.y>WH+200) brk(b); };
  const grem=()=>bs.filter(b=>b.kind==='gremlin'&&!b.dead).length;
  const shoot=([ang,pw])=>{ const d=PULL*pw, p={x:SLING.x-Math.cos(ang)*d, y:SLING.y+Math.sin(ang)*d};
    const gh=M.Bodies.circle(p.x,p.y,BR,{density:0.004,friction:0.5,restitution:0.35,frictionAir:0.004,label:'buddy'}); M.Composite.add(e.world,gh);
    M.Body.setVelocity(gh,{x:(SLING.x-p.x)*POWER,y:(SLING.y-p.y)*POWER});
    for(let t=0;t<540;t++){ step(); const mv=M.Composite.allBodies(e.world).some(b=>!b.isStatic&&b.speed>0.3); const out=gh.position.x>WW+60||gh.position.x<-60; if((t>72&&!mv)||out) break; }
    M.Composite.remove(e.world,gh); };
  return {e,bs,st,step,grem,shoot};
}
const cands=[]; for(let a=-15;a<=75;a+=5) for(const pw of [0.55,0.7,0.85,1]) cands.push([a*Math.PI/180,pw]);
const pick = process.argv.slice(2).map((n) => Number(n) - 1);
let bad = 0;
for (const lv of pick.length ? pick : LEVELS.map((_, i) => i)) {
  const w=world(lv); const p0=w.bs.map(b=>({...b.position})); for(let t=0;t<600;t++) w.step();
  const moved=Math.max(...w.bs.map((b,i)=>b.dead?999:Math.hypot(b.position.x-p0[i].x,b.position.y-p0[i].y)));
  const n0=w.grem(); const shots=[]; let left=n0;
  for(let k=0;k<3&&left>0;k++){ let best=null;
    for(const c of cands){ const x=world(lv); for(let t=0;t<60;t++) x.step(); for(const s of shots) x.shoot(s); x.shoot(c); const g=x.grem(); const sc=g*1000-x.st.broke; if(!best||sc<best.sc) best={sc,c,g}; }
    shots.push(best.c); left=best.g; }
  const ok = moved < 20 && !w.st.broke && !left; if (!ok) bad++;
  console.log(`${ok ? 'ok ' : 'BAD'} level ${lv + 1}: ${n0} gremlins, ${w.st.broke ? `${w.st.broke} broke on its own` : `settles ${moved.toFixed(0)}px`}, ${left ? `${left} left after 3 Buddies` : `cleared with ${shots.length}`}`);
}
process.exit(bad ? 1 : 0);
