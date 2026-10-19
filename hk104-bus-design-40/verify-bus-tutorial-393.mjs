import fs from "node:fs";
import assert from "node:assert/strict";
import {steps,layout} from "./build-bus-tutorial-393.mjs";
const read=p=>fs.readFileSync(new URL(p,import.meta.url),"utf8");
const d=JSON.parse(read("HK-104-39.3cm-尺寸核算.json"));
const manifest=JSON.parse(read("bus-tutorial-393/manifest.json"));
assert.equal(steps.length,42);
assert.equal(new Set(steps.map(s=>s.stage)).size,10);
const referenced=new Set(steps.flatMap(s=>s.ids));
assert.deepEqual(d.parts.filter(p=>!referenced.has(p.id)).map(p=>p.id),[]);
assert.deepEqual([...referenced].filter(id=>!d.parts.some(p=>p.id===id)),[]);
assert.equal(d.parts.length,73);
assert.equal(d.parts.reduce((n,p)=>n+(p.cardLayers?p.cardLayers*p.quantity:0),0),210);
assert.equal(d.parts.filter(p=>p.material==="桃紅色薄卡").reduce((n,p)=>n+p.quantity,0),318);
assert.equal(d.parts.filter(p=>p.material==="黑色薄卡").reduce((n,p)=>n+p.quantity,0),7);
assert.equal(d.parts.filter(p=>/^G\d+$/.test(p.id)).reduce((n,p)=>n+p.quantity,0),57);
assert.equal(layout.lower.length,40);
assert.equal(layout.upper.length,64);
const overlaps=(a,b)=>a[0]<b[0]+b[2]-1e-7&&a[0]+a[2]>b[0]+1e-7&&a[1]<b[1]+b[3]-1e-7&&a[1]+a[3]>b[1]+1e-7;
for(const [level,seats]of Object.entries(layout)){
 for(let i=0;i<seats.length;i++){
  const s=seats[i];assert(s[0]>=2&&s[1]>=2&&s[0]+s[2]<=391&&s[1]+s[3]<=81);
  for(let j=i+1;j<seats.length;j++)assert(!overlaps(s,seats[j]),`${level} seat collision`);
  assert(!overlaps(s,[2,33.7928571429,389,15.4142857142]),`${level} aisle blocked`);
  if(level==="upper"){
   assert(!overlaps(s,[d.hole.x,d.hole.y,d.hole.l,d.hole.w]),"stair hole blocked");
   for(const x of d.posts.xs)for(const y of d.posts.ys)assert(!overlaps(s,[x-2,y-2,4,4]),"seat against sleeve");
  }else assert(!overlaps(s,[373.35,8.89,15.97,65.21]),"rear box collision");
 }
}
for(const step of manifest.steps){
 assert(read(step.image).includes('viewBox="0 0 480 330"'));
 assert(read(step.image).includes(`<title id="title">${step.step}：`));
}
const html=read("bus-tutorial-393.html");
assert.equal((html.match(/class="tutorial-step"/g)||[]).length,42);
assert.equal((html.match(/<img /g)||[]).length,42);
assert.equal((html.match(/class="assembly-stage"/g)||[]).length,10);
assert.equal((html.match(/href="#bus-step-/g)||[]).length,42);
assert(read("HK-104-39.3cm-全車42步拼裝教程-文字版.md").includes("配圖42"));
console.log("PASS: 42 steps/images and 10 stages; all 73 part types covered; 64+40 seat footprints clear of aisle, holes, sleeves and rear box; counts 210/318/7/57. Numerical checks only, not physical validation.");
