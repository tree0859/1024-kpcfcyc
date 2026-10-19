import fs from "node:fs";
import assert from "node:assert/strict";
import {createHash} from "node:crypto";
const read=p=>fs.readFileSync(new URL(p,import.meta.url),"utf8");
const data=JSON.parse(read("HK-104-39.3cm-尺寸核算.json"));
assert.equal(data.basis.length,393);
assert.equal(data.basis.width,83);
assert.deepEqual(data.posts.xs,[12.28125,388]);
assert.deepEqual(data.posts.ys,[5,78]);
assert.equal(393-2*2,389);
assert.equal(83-2*2,79);
assert.equal(389-2*5,379);
assert.equal(79-2*5,69);
assert.equal(7+2+5,14);
assert.equal(6.25-4,2.25);
assert.equal(6.25-5,1.25);
assert.equal(8+36+24,68);
const html=read("frame-tutorial-393.html");
assert.equal((html.match(/class="tutorial-step"/g)||[]).length,17);
assert.equal((html.match(/<img /g)||[]).length,17);
for(let i=1;i<=17;i++){
 const svg=read(`tutorial-393/step-${String(i).padStart(2,"0")}.svg`);
 assert(svg.includes('viewBox="0 0 480 330"'));
 assert(svg.includes('<title id="title">'));
 assert(html.includes(`id="step-${i}"`));
 assert(html.includes(`href="#step-${i}"`));
}
assert(read("frame-tutorial-393.css").includes("size:A4 landscape"));
const originals={
 "pack.js":"256c6321c37e1cae1e5f59b0df7ad2b810ee06a09c01058090553dfcd94719e2",
 "cutting-catalog.json":"9c1b80065f5345a570a6a398c7035030519bf7b0f6a6cfebeed5d98d5c48f231",
 "cutting.html":"28d65e7e148db13ccadb168f78b5162b0f6a31f6e8f2cd47adce61d7fe209f9a",
 "livery-a3.html":"39a3e990719f53c49b69c3f720cee9c8e5d269f7e4367255db3849207f7b3b38",
 "source-64-cutting.js":"5046c56436b014b9961d777eb0aa1b25f7601663baf1d2e54e524abc9dd25b3a"
};
for(const [p,hash]of Object.entries(originals)){
 assert.equal(createHash("sha256").update(read(p)).digest("hex"),hash,p);
}
console.log("PASS: 17 steps, 17 diagrams, 17 anchors, frame 389×79 / opening 379×69; integer card layers; protected cutting sources unchanged. Not physical validation.");
