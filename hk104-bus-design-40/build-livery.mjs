import fs from "node:fs";
const root=new URL("./",import.meta.url);
const cream="#f7e4b8",red="#e21b1a",green="#004d35";
const esc=s=>String(s).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll('"',"&quot;");
const rect=(x,y,w,h,fill="none",stroke="none",sw=.2)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
const text=(x,y,s,cl="small")=>`<text x="${x}" y="${y}" class="${cl}">${esc(s)}</text>`;
const line=(a,b,c,d)=>`<line x1="${a}" y1="${b}" x2="${c}" y2="${d}" class="guide"/>`;
const images=new Map();
function img(name,x,y,w,h,fit="none"){
 if(!images.has(name))images.set(name,"data:image/png;base64,"+fs.readFileSync(new URL(`livery-assets/${name}.png`,root)).toString("base64"));
 return `<image href="${images.get(name)}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="${fit}"/>`;
}
let uid=0;
function windowArt(x,y,w,h){
 return `<g class="livery-window">${img("window",x,y,w,h)}${rect(x,y,w,h,"none","#111",.22)}</g><rect class="livery-window-cut" x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="#111" stroke-width=".26"/>`;
}
function windows(side,upper){
 const list=upper?[[7.5,11.25,81.25,30],...Array.from({length:15},(_,i)=>[93.75+20*i,11.25,16.25,30])]:[[40.625,15.625,49.375,31.25],...Array.from({length:8},(_,i)=>[100+34.375*i,15.625,30,31.25]),[375,15.625,17.5,31.25]];
 if(!upper&&side==="right")list.push([7.5,15.625,25,31.25]);
 return list.map(([x,y,w,h])=>windowArt(side==="right"?400-x-w:x,y,w,h)).join("");
}
function panel(side,upper){
 const h=upper?53.75:62.5;
 let s=rect(0,0,400,h,cream);
 if(upper)s+=rect(0,0,400,2,green);
 else{
  s+=rect(0,46.875,400,15.625,red);
  for(const x of [110,160,210,260,310,360])s+=line(x,48,x,61);
  s+=rect(55,.75,285,13.9,"#c7e4f6")+img(`banner-${side}`,55,.75,285,13.9,"xMidYMid meet");
  const back=side==="left"?384:4;
  s+=img("rear-grille",back,49,12,11);
  if(side==="left")s+=rect(7.5,12.5,25,50,"#fff","#111",.26)+text(9,60,"門洞");
 }
 s+=windows(side,upper)+rect(0,0,400,h,"none","#111",.26);
 return s;
}
function end(front,upper){
 const w=83.75,h=upper?53.75:62.5;
 let s=rect(0,0,w,h,cream);
 if(upper){
  s+=rect(0,0,w,2,green);
  s+=front?windowArt(9.375,11.25,65,30):windowArt(14.375,13.75,55,25);
  if(!front)s+=img("rear-route",32,42.5,19.75,8.5,"xMidYMid meet");
 }else if(front){
  s+=rect(7,1.5,69.75,11.75,"#1d241f")+img("front-route",7,1.5,69.75,11.75,"xMidYMid meet");
  s+=rect(0,47.5,w,12.5,red)+rect(0,60,w,2.5,cream)+img("front-light-left",7,50,7,7,"xMidYMid meet")+img("front-light-right",69.75,50,7,7,"xMidYMid meet")+img("plate",31.875,58.75,20,3.75,"xMidYMid meet");
  s+=windowArt(9.375,15,65,32.5);
 }else{
  s+=img("rear-grille",15.625,6,52.5,21.875)+img("rear-bottom",0,29.5,w,33);
 }
 return s+rect(0,0,w,h,"none","#111",.26);
}
const parts=[
 ["L1","下層左側外皮","400×62.5","1","B3；車頭在左"],
 ["L2","下層右側外皮","400×62.5","1","B4；外側看車頭在右"],
 ["L3","上層左側外皮","400×53.75","1","B5；車頭在左"],
 ["L4","上層右側外皮","400×53.75","1","B5；外側看車頭在右"],
 ["L5","下層前端外皮","83.75×62.5","1","B6；路線牌保留原圖"],
 ["L6","下層後端外皮","83.75×62.5","1","B7；格柵只印，不開洞"],
 ["L7","上層前端外皮","83.75×53.75","1","B8；窗洞按B8"],
 ["L8","上層後端外皮","83.75×53.75","1","B9；918牌保留原圖"],
 ["L9","活動門外皮","24.375×49.375","1","B11；只包門外，不新增機關"],
 ["L10","可選深綠車頂外皮","400×87.5","1可選","B10；原圖未提供車頂，純色補件"],
 ["L11","上層左地板外沿貼條","400×3.75","1","B2外沿；不跨兩層"],
 ["L12","上層右地板外沿貼條","400×3.75","1","B2外沿；不跨兩層"],
 ["L13","可選輪面彩印貼片","Ø25","6可選","W1外面；由原圖輪胎裁取"]
].map(([id,name,size,raw,note])=>({id,name,size,raw,finished:raw,material:"彩印薄紙；"+note}));
const pages=[];
function ruler(n){
 let s=text(10,174,"100 mm校準尺：印好先量；A4橫向／100%／關閉頁首頁尾");
 for(let i=0;i<10;i++)s+=rect(10+i*10,177,10,2,i%2?"white":"#222","#222",.1);
 return s+rect(124,174,10,10,"none","#222",.2)+text(140,180,"10×10 mm")+text(251,186,`P${n}`);
}
function add(title,ids,body,notes){
 const n=38+pages.length;
 const svg=text(7,8,`40cm / 外觀彩印 / ${title}`,"head")+text(7,15,"薄紙外皮；不是硬卡母版。外框黑線裁，窗洞按選擇模式；拼頁先對十字。")+notes.map((s,i)=>text(7,22+i*5,s)).join("")+body+ruler(n);
 pages.push({n,group:"livery",title,ids,svg});
}
function tile(id,name,w,h,body,notes=[]){
 for(let k=0;k<2;k++){
  const start=250*k,end=Math.min(w,start+260),clip=`lv${++uid}`;
  let s=`<defs><clipPath id="${clip}">${rect(0,0,end-start,h)}</clipPath></defs><g transform="translate(10 39)"><g clip-path="url(#${clip})"><g transform="translate(${-start} 0)">${body}</g></g>`;
  const xs=k?[0,10]:[250,260];
  for(const x of xs)s+=line(x,-2,x,h+2);
  s+=line((k?5:255)-2,h/2,(k?5:255)+2,h/2)+line(k?5:255,h/2-2,k?5:255,h/2+2)+"</g>";
  add(`${id} ${name} 拼頁${k+1}/2`,[id],s,[`全件${w}×${h}mm；本頁x${start}–${end}，重疊10mm。拼成完整外皮，不重複貼兩片。`,...notes]);
 }
}
tile("L1","下層左側",400,62.5,panel("left",false),["車頭在左；門洞25×50裁空。不要把門外皮黏回車牆。"]);
tile("L2","下層右側",400,62.5,panel("right",false),["外側看車頭在右；窗洞以B4鏡像對位，文字沒有翻鏡。"]);
tile("L3","上層左側",400,53.75,panel("left",true),["車頭在左；下沿齊上層牆，不跨接下層。"]);
tile("L4","上層右側",400,53.75,panel("right",true),["外側看車頭在右；原圖窗列已按模型窗洞重排。"]);
let ends="";
for(const [i,id]of ["L5","L6","L7","L8"].entries()){
 const x=10+(i%2)*100,y=42+Math.floor(i/2)*75;
 ends+=text(x,y-3,`${id} ${parts.find(p=>p.id===id).name}`)+`<g transform="translate(${x} ${y})">${end(i%2===0,i<2?false:true)}</g>`;
}
add("L5–L8 前後端分層外皮",["L5","L6","L7","L8"],ends,["下層83.75×62.5；上層83.75×53.75。窗洞裁空，格柵不剪洞。"]);
let small=text(10,35,"L9 活動門；1片")+`<g transform="translate(10 40)">${img("door",0,0,24.375,49.375)}${windowArt(3.75,12.5,16.875,28.125)}${rect(0,0,24.375,49.375,"none","#111",.26)}</g>`;
small+=text(50,40,"門仍是原B11單片手動鉸接；不是自動門紙樣。")+text(50,47,"窗16.875×28.125；不得黏死門縫或加厚到不能開門。")+text(10,110,"L13 可選輪面：6片Ø25；用於6個固定輪外側");
for(let i=0;i<6;i++){
 const cx=24+i*40,cy=132,clip=`wheel${i}`;
 small+=`<defs><clipPath id="${clip}"><circle cx="${cx}" cy="${cy}" r="12.5"/></clipPath></defs><g clip-path="url(#${clip})">${img("wheel",cx-12.5,cy-12.5,25,25)}</g><circle cx="${cx}" cy="${cy}" r="12.5" fill="none" stroke="#111" stroke-width=".25"/>`;
}
add("L9 門片及L13輪面",["L9","L13"],small,["門外皮與車牆分開；灰卡輪目標厚度及數量不變，貼紙厚度另計。"]);
for(let k=0;k<2;k++){
 const start=k*250,w=Math.min(260,400-start),clip=`roof${k}`;
 let body=`<defs><clipPath id="${clip}">${rect(0,0,w,87.5)}</clipPath></defs><g transform="translate(10 39)"><g clip-path="url(#${clip})">${rect(-start,0,400,87.5,green,"#111",.26)}</g>`;
 for(const x of k?[0,10]:[250,260])body+=line(x,-2,x,89.5);
 body+=line((k?5:255)-2,43.75,(k?5:255)+2,43.75)+line(k?5:255,41.75,k?5:255,45.75)+"</g>";
 for(const [j,id]of ["L11","L12"].entries()){
  const y=140+j*13,clip2=`edge${k}-${j}`;
  body+=text(10,y-2,`${id} 外沿條 400×3.75；x${start}–${start+w}`)+`<defs><clipPath id="${clip2}">${rect(0,0,w,3.75)}</clipPath></defs><g transform="translate(10 ${y})"><g clip-path="url(#${clip2})">${rect(-start,0,400,3.75,cream,"#111",.26)}</g>${line(k?10:250,-1,k?10:250,4.75)}</g>`;
 }
 add(`L10深綠車頂及L11／L12沿條 拼頁${k+1}/2`,["L10","L11","L12"],body,[`車頂全件400×87.5；本頁x${start}–${start+w}。屋頂圖未提供，本頁為可選純色補件。`]);
}
if(pages.length!==12||parts.length!==13)throw Error("Wrong livery coverage");
fs.writeFileSync(new URL("livery-pack.js",root),"window.livery40="+JSON.stringify({parts,pages,source:"user-upload",adapted:true})+";\n");
let preview=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 355" role="img" aria-label="外觀圖按模型窗洞重排的四視預覽"><style>text{font:12px sans-serif;fill:#222}.livery-window-cut{display:none}.guide{stroke:#a71414;stroke-width:.2;fill:none}</style><rect width="900" height="355" fill="#fff"/><text x="20" y="20">按模型孔位重排的外觀預覽（不是1:1）；文字圖像取自上傳圖，門機關仍是原方案。</text>`;
for(const [i,side]of ["left","right"].entries()){
 preview+=`<g transform="translate(${20+450*i} 35)">${panel(side,true)}${rect(0,53.75,400,3.75,cream)}<g transform="translate(0 57.5)">${panel(side,false)}</g>`;
 if(side==="left")preview+=img("door",7.8125,70.3125,24.375,49.375);
 for(const xx of [87.5,312.5,350]){
  const x=side==="left"?xx:400-xx,clip=`pv-${side}-${xx}`;
  preview+=`<defs><clipPath id="${clip}"><circle cx="${x}" cy="125" r="12.5"/></clipPath></defs><g clip-path="url(#${clip})">${img("wheel",x-12.5,112.5,25,25)}</g>`;
 }
 preview+=`</g><text x="${20+450*i}" y="185">${side==="left"?"左側：車頭在左":"右側：車頭在右；文字不翻鏡"}</text>`;
}
for(let i=0;i<2;i++)preview+=`<g transform="translate(${245+220*i} 215)">${end(i===0,true)}${rect(0,53.75,83.75,3.75,cream)}<g transform="translate(0 57.5)">${end(i===0,false)}</g></g><text x="${245+220*i}" y="349">${i===0?"前端":"後端"}</text>`;
preview+="</svg>";
fs.writeFileSync(new URL("livery-preview.svg",root),preview);
const a3pages=["left","right"].map((side,i)=>{
 const upper=i?"L4":"L3",lower=i?"L2":"L1",edge=i?"L12":"L11",name=i?"右側":"左側";
 let svg=text(8,10,`HK–104 / 40厘米 / A3整張${name}外皮`,"head")
 +text(8,18,`外側看車頭在${i?"右":"左"}；全長400mm，不拼頁、不翻鏡文字。薄紙彩印，不是硬卡母版。`)
 +text(8,25,"A3橫向／100%實際大小／關閉配合頁面及頁首頁尾；先量100mm尺。")
 +text(2,36,`${upper} 上層${name} 400×53.75mm；獨立裁貼`)
 +`<g transform="translate(2 40)">${panel(side,true)}</g>`
 +text(2,103,`${edge} 上層地板外沿條 400×3.75mm；只貼B2側面`)
 +rect(2,107,400,3.75,cream,"#111",.26)
 +text(2,118,`${lower} 下層${name} 400×62.5mm；獨立裁貼`)
 +`<g transform="translate(2 121)">${panel(side,false)}</g>`
 +text(8,199,"裁貼：先驗尺 → 沿外框裁3件 → 窗洞與硬卡乾放對位 → 分層薄膠貼合。")
 +text(8,206,i?"右側沒有門洞；窗洞依B4鏡像對位，廣告與文字不翻鏡。":"左側門洞25×50mm始終剪空；L9門外皮另印P47，不能黏死門縫。")
 +text(8,213,"預設白色窗區剪空露出G透明片；不開洞展示才選「保留印刷窗」。")
 +text(8,220,"不可跨上下層拆合縫；本頁外皮不含包邊，先試貼再修剪；未經實物試製。")
 +text(8,232,"這2張A3取代A4 P38–P45；不是額外增加側面件。")
 +text(8,239,"仍需A4 P46前後端、P47門／輪、P48–P49車頂；沿條已有，不重複裁L11／L12。")
 +text(8,246,"原37頁結構紙樣不變。全套外皮：2張A3＋4張A4；車頂及輪面為可選件。")
 +text(12,258,"100 mm校準尺");
 for(let j=0;j<10;j++)svg+=rect(12+j*10,263,10,2,j%2?"white":"#222","#222",.1);
 svg+=rect(128,257,10,10,"none","#222",.2)+text(144,264,"10×10 mm")
 +text(8,276,"圖像取自用戶上傳圖；窗列按模型孔位重排。")+text(370,276,i?"A3-R":"A3-L");
 return {id:i?"A3-R":"A3-L",side,title:`A3整張${name}外皮`,ids:[upper,edge,lower],svg};
});
fs.writeFileSync(new URL("livery-a3-pack.js",root),"window.liveryA3="+JSON.stringify(a3pages)+";\n");
let md="# HK-104 40厘米版外觀彩印裁紙樣\n\n使用用戶提供的巴士四視外觀圖，保留天國之路廣告、人物及路線文字的原始圖像，按現有40厘米結構窗洞重排外皮。不是把原圖整張直接縮成40厘米，也沒有新增自動門機關。原圖窗列與模型不同，本版以模型孔位為準，純色區按原圖配色補足。\n\n## 列印\n\n原37頁結構紙樣不變；新增P38–P49共12頁，13種外皮／貼片。A4橫向、100%實際大小、關閉配合頁面及頁首頁尾；先量100毫米尺和10毫米方格。長件兩頁重疊10毫米，先拼紙樣再貼，不能把重疊圖案再貼一次。外框尺寸不含另加包邊，先按實物試貼再修剪。\n\n## 窗洞模式\n\n預設「透明窗裁空」：白色窗區沿黑線剪掉，露出G透明片。可切換「保留印刷窗」作不開洞展示；這會遮住內部，不能與透明窗方案混用。兩種模式都保持原幾何尺寸；門洞始終剪空。\n\n## 全部外皮\n\n|編號|名稱|尺寸mm|數量|貼附位置|\n|---|---|---|---|---|\n";
for(const p of parts)md+=`|${p.id}|${p.name}|${p.size}|${p.raw}|${p.material.replace("彩印薄紙；","")}|\n`;
md+="\n## 頁碼\n\n"+pages.map(p=>`- **P${p.n}**：${p.title}。`).join("\n");
md+="\n\n## 圖像與材料限制\n\n原圖沒有車頂視圖，所以L10只是補充深綠純色，並非原圖屋頂；可不使用。圖中雙門外觀不代表模型已有自動或折疊門，本版L9仍對應原B11單片活動門。原件是點陣PNG，保留原圖字樣而未重造文字或人物；近看印刷清晰度受原圖解析度限制。\n\n外皮用薄白紙彩印，先試約80–120gsm，不能用1毫米硬卡做印刷外皮。新增12張A4可作完整外皮母版；含試印備約14張。結構37頁加外皮12頁，共49頁。若先貼卡其色紙，印刷外皮覆蓋位置不要再重複整面疊厚，不能把彩印墨色當作有色紙購買量。\n\n上下層、車頂及門片分開貼；所有接合面、套管、承托頂、門縫及鎖帶避開厚紙／厚膠。L11／L12只貼B2側面，不跨拆合縫；窗洞先對位裁空，切勿把已裝的G透明片一起切破。先乾放全件，再少量薄膠貼合，未經實物試貼驗證。\n";
md+="\n## A3整張側面替代方案\n\n另開 `livery-a3.html`，左右各1張A3橫向，100%實際大小。A3-L含L3、L11、L1；A3-R含L4、L12、L2，全部400毫米長件不用拼頁，上下層仍分開裁貼。紙面420×297毫米，列印邊界8毫米，圖面404×281毫米，側片兩端各留2毫米，裁線不貼列印邊界。\n\n兩張A3取代A4 P38–P45共8張；仍印P46–P49共4張A4。P48–P49上的L11／L12若已從A3裁好便不重複裁。外皮正式用紙2張A3＋4張A4，建議備A3三張＋A4五張（各含1張試印）。只印所選側面時先用分類選左／右；列印全套先選左右兩側。不要把A3和A4頁混在同一列印工作。原37頁結構紙樣、13種外皮及所有零件數量不變。\n";
fs.writeFileSync(new URL("HK-104-40cm-外觀彩印裁紙樣.md",root),md);
console.log({pages:pages.length,parts:parts.length,first:38,last:49});
