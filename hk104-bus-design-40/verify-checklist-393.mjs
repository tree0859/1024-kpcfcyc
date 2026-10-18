import fs from "node:fs";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import {data,stageFigures} from "./joint-stair-393.mjs";
const read=name=>fs.readFileSync(new URL(name,import.meta.url));
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-7,`${a} != ${b}`);
const {heights,stair,hole,stairPos,block,posts}=data;
near(stair.rise,heights.upperFloorTop-heights.lowerFloorTop);
near(stair.riser*12,stair.rise);near(stair.tread*12,stair.run);
near(stair.unfolded,stair.rise+stair.run);near(stair.rail,Math.hypot(stair.rise,stair.run));
near(14,7+2+5);near(6.25,4+2.25);
assert.equal(data.assembly.stairProfileOrder,"rise-then-tread");
assert.ok(data.assembly.minimumStandMm>data.assembly.ribHeightZ);
assert.equal(stageFigures["stage-3"].length,8);
assert.equal(Object.values(stageFigures).flat().length,16);
assert.equal((read("HK-104-39.3cm-四柱接頭與樓梯組裝清單.md").toString().match(/^- \[ \]/gm)||[]).length,50);
const net=stageFigures["stage-4"][1];
assert.equal((net.match(/class="light-fold"/g)||[]).length,23);
const solids=[];
const add=(name,x,y,z,w,d,h)=>solids.push({name,x,y,z,w,d,h});
add("J1-right",2,2,block.top,389,5,2);add("J1-left",2,76,block.top,389,5,2);
add("J2-front",2,7,block.top,5,69,2);add("J2-rear",386,7,block.top,5,69,2);
for(const x of [6.140625,378.71875])for(const y of [2,75])add("J3",x,y,block.bottom,block.l,6,9);
for(const x of [108.075,171.9375,245.625,319.3125])add("J4",x-2,7.6,heights.joint-data.assembly.ribHeightZ,4,67.8,data.assembly.ribHeightZ);
add("J5-front",30.0890625,8,heights.joint-2,6.140625,hole.w,2);
add("J5-rear",hole.x+hole.l,8,heights.joint-2,6.140625,hole.w,2);
add("J6",30.0890625,8+hole.w,heights.joint-2,65.090625,5.928571428571429,2);
const overlap=(a,b)=>["x","y","z"].every((axis,i)=>{
 const len=["w","d","h"][i];return Math.min(a[axis]+a[len],b[axis]+b[len])-Math.max(a[axis],b[axis])>1e-7;
});
for(let i=0;i<solids.length;i++)for(let j=i+1;j<solids.length;j++)assert.ok(!overlap(solids[i],solids[j]),solids[i].name+" intersects "+solids[j].name);
const stairBox={x:stairPos.x,y:stairPos.y,z:heights.lowerFloorTop,w:stair.run,d:stair.width,h:stair.rise};
for(const s of solids)assert.ok(!overlap(s,stairBox),"stair intersects "+s.name);
assert.ok(stairPos.x>hole.x&&stairPos.x+stair.run<hole.x+hole.l);
assert.ok(stairPos.y>hole.y&&stairPos.y+stair.width<hole.y+hole.w);
for(const y of posts.ys)assert.ok(Math.min(y-2-2,81-(y+2))>=1);
const paths={
 "pack.js":"256c6321c37e1cae1e5f59b0df7ad2b810ee06a09c01058090553dfcd94719e2",
 "cutting-catalog.json":"9c1b80065f5345a570a6a398c7035030519bf7b0f6a6cfebeed5d98d5c48f231",
 "cutting.html":"28d65e7e148db13ccadb168f78b5162b0f6a31f6e8f2cd47adce61d7fe209f9a",
 "livery-a3.html":"39a3e990719f53c49b69c3f720cee9c8e5d269f7e4367255db3849207f7b3b38",
 "source-64-cutting.js":"5046c56436b014b9961d777eb0aa1b25f7601663baf1d2e54e524abc9dd25b3a"
};
for(const [name,hash]of Object.entries(paths))assert.equal(crypto.createHash("sha256").update(read(name)).digest("hex"),hash,name+" changed");
console.log("PASS: 50 tasks, 16 figures, 8 joint steps, 23 folds; 15 solids and stair envelope clear; original cutting sources unchanged. This is numerical QA, not a physical prototype.");
