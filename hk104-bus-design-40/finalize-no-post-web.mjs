import fs from "node:fs";
// Version image URLs so a returning visitor cannot mix old cached pin diagrams
// with the new no-post instructions. Run after all HTML generators.
for(const name of ["bus-tutorial-393.html","frame-tutorial-393.html","checklist.html"]){
 const file=new URL(name,import.meta.url);
 const html=fs.readFileSync(file,"utf8").replace(/src="((?:bus-tutorial-393|tutorial-393)\/step-\d+\.svg)(?:\?v=[^"]*)?"/g,'src="$1?v=no-post-web-r1"');
 fs.writeFileSync(file,html);
}
console.log("Versioned current tutorial diagram URLs.");
