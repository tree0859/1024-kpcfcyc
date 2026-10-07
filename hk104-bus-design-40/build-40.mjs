import fs from "node:fs";
import vm from "node:vm";
const Q=.625, f=n=>String(Number((n*Q).toFixed(5)));
const esc=s=>String(s).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
let src=fs.readFileSync(new URL("./source-64-cutting.js",import.meta.url),"utf8");
src=src.replace(/,135\.3,/g,`,${Math.hypot(84,106)},`);
// Capture the original, unpaginated bodies. Neither the old page ruler nor its labels are scaled.
src=src.replace(/function pg\(group,title,sub,body,ids=\[\]\)\{[\s\S]*?\n\}\nfunction marks/,`function pg(group,title,sub,body,ids=[]){pages.push({group,title,sub,body,ids});}\nfunction marks`);
src=src.replace(/function tiled\(group,id,name,len,h,raw,finished,material,inside="",note=""\)\{[\s\S]*?\n\}\nfunction plate/,`function tiled(group,id,name,len,h,raw,finished,material,inside="",note=""){part(id,name,len+"×"+h,raw,finished,material);pages.push({group,title:id+" "+name,ids:[id],tile:{id,name,len,h,inside,note}});}\nfunction plate`);
src=src.slice(0,src.indexOf("// Consistency metadata"));
src+="\nwindow.original={parts,pages,boxNet};";
const window={};vm.runInNewContext(src,{window});
const base=window.original;
const scaleSize=s=>s.replace(/\d+(?:\.\d+)?/g,(n,offset)=>s.slice(offset+n.length).startsWith("級")?n:f(Number(n)));
const finish=s=>s.replace(/(?:約)?\d+(?:\.\d+)?×\d+(?:\.\d+)?(?:×\d+(?:\.\d+)?)?/g,m=>scaleSize(m))
 .replace(/(厚|高|垂直|埋|露)(約?)(\d+(?:\.\d+)?)/g,(_,a,b,n)=>a+b+f(Number(n)));
const part40=base.parts.map(p=>({...p,size:scaleSize(p.size),finished:finish(p.finished),material:p.material.replace(/1\.5/g,"0.9375").replace(/頂z130/,"頂z81.25")}));
const lookup=new Map(part40.map(p=>[p.id,p]));
for(const p of part40){
 if(p.id.startsWith("G"))p.material=p.material.replace(/(左|右|下)(\d+(?:\.\d+)?)/g,(_,a,n)=>a+f(Number(n)));
 if(p.id==="F1"||p.id==="F2"||p.id==="F3")p.material="薄卡；含3.125接縫翼";
 if(p.id==="J12")p.material="約Ø2.5木棒；圓鈍端；先試插";
 if(p.id==="J13"){p.size="外Ø4／內Ø2.8×長6.25";p.material="套管內Ø2.8、外Ø4；B2先試Ø4.1孔，緊才修至約4.2";}
 if(["T3","T4","T5","T6","T7","F6","F7"].includes(p.id)){p.size=p.size.replace("Ø約1.25","外Ø1.5");p.material="外徑1.5幼管／紙卷管；原切長；先乾合，與J13分開";}
}
const txt=(x,y,s,k="small")=>`<text x="${x}" y="${y}" class="${k}">${esc(s)}</text>`;
const rect=(x,y,w,h,k="cut")=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" class="${k}"/>`;
const line=(a,b,c,d,k="guide")=>`<line x1="${a}" y1="${b}" x2="${c}" y2="${d}" class="${k}"/>`;
const cross=(x,y)=>line(x-2,y,x+2,y)+line(x,y-2,x,y+2);
// Only part IDs remain on shapes. All dimensional text is rebuilt from scaled metadata.
function clean(body){
 return body.replace(/<text\b([^>]*)>([\s\S]*?)<\/text>/g,(_,attrs,t)=>{
  const m=t.match(/^([A-Z]\d+)(?=\s|$)/);return m&&lookup.has(m[1])?`<text${attrs.replace(/\sclass="[^"]*"/g,"")} class="shape-id">${m[1]}</text>`:"";
 });
}
const notes={
 B1:["成品地板400×87.5，目標完成厚3.75。","側牆厚1.875；先壓平乾透，再定位黏牆。"],
 B2:["4管孔先試Ø4.1，緊才修至約4.2；管內Ø2.8／外Ø4。","中心x12.5／387.5、y3.125／84.375；梯孔53.75×20位置不變。"],
 B3:["前門洞x7.5–32.5，25×50，由牆底開口。","前區窗49.375×31.25；主窗30×31.25，x100+34.375r，r=0–7。"],
 B4:["司機側窗25×31.25，x7.5、h15.625；其他窗與左側相同。","尾窗x375，17.5×31.25；h均由牆底量。"],
 B5:["底邊綠框只作內面避位：每處闊4.2×高3、凹深約0.9；不可剪穿。","每側x中心12.5及387.5，共4處；窗洞及牆外尺寸不變。"],
 B10:["可取下車頂400×87.5，目標厚1.875。","R1長裙邊392.5×5，R2短裙邊80×5，先試合才黏。"],
 B6:["端牆為排版旋轉90°，並非再縮放；前窗65×32.5。","前窗原向x9.375、h15；B7後格柵52.5×21.875只是貼片，不開洞。"],
 B8:["端牆為排版旋轉90°；前窗65×30，x9.375、h11.25。","後窗55×25，x14.375、h13.75；端牆寬83.75。"],
 B11:["門窗16.875×28.125，距門左3.75、底12.5；鉸接向外開。","B12每腳目標15高；層數只是0.9375卡的基準，須實測。"],
 J1:["兩種長條各拼2頁，相鄰重疊10；切硬卡時是一整條。","J1目標厚1.875；R1是薄卡裙邊，不能混用。"],
 J2:["J2厚1.875、J4厚3.75；R2用薄卡。","承托條與橫肋的黏合位置另見組裝圖冊。"],
 J5:["三邊U框：前／後各6.25×20；左側66.25×6.25。","位置x30.625–96.875、y6.25–32.5；右側不加第4邊，以免撞承托條。"],
 J3:["補強塊12.5×6.25×12.5；柱埋11.25，底部留實卡。","J3虛孔Ø2.625僅參考；按實際木棒試孔，不要鑽穿底層。"],
 J10:["鎖帶12.5×31.25：上9.375固定，末8.125反摺，垂直23.125。","棒長16.25，埋11.25露5；管長6.25，地板3.75＋上露2.5。"],
 S1:["S1：16.25座面＋15背板＋3.125補強；分席13.75／1.875／13.75。","S2：7.5上翼＋10支承＋7.5底翼；S3：10高＋3.125黏合翼。"],
 D1:["D1：16.25座面＋15背板＋3.125補強；D2：7.5＋10＋7.5。","D3：10高＋3.125底翼，兩片；司機椅不算入104個乘客席。"],
 T1:["12級：升高66.25÷12≈5.520833，踏深4.375，梯闊16.25。","T2：總展開118.75×16.25；交替內／外摺。按總高等分，勿累加取整。"],
 T3:["幼管外Ø1.5（不是內徑）；原切長與數量不變，斜扶手84.529950。","先表面黏接試裝；若改插孔先試Ø1.6，埋深另算；扶手不跨接兩層。"],
 F1:["灰區是黏合翼；接縫翼3.125，蓋翼2.5。","先摺四側，再黏側接縫，最後黏上下蓋；薄卡紙厚須試件補償。"],
 F2:["設備箱展開一整片173.125×54.375；本版毋須拼頁。","成盒寬68.75、深16.25、高21.875；下層x380–396.25。"],
 F3:["成盒17.5×6.25×6.25；接縫翼3.125，蓋翼2.5。","薄卡厚度會改變實際成盒外尺寸，先試摺再描多件。"],
 F4:["F9筒卷：圓周約11.8125＋1.875黏邊；兩小圓為F10筒蓋。","F4：21.875高＋3.125底翼；F11是輪椅區地面標誌，不是座位。"],
 G1:["透明片只剪外線，內窗虛線不剪。","G1四邊3.125；G2左右2.1875、上下3.125。"],
 G3:["透明片只剪外線；G3左2.1875、右3.125、上下3.125。","G4四邊3.125；同一窄窗柱相鄰片不要重疊加厚。"],
 G5:["透明片只剪外線；G5四邊3.125。","G6左右1.875、上下3.125，對應3.75寬窗柱。"],
 G7:["透明片四邊3.125；只剪外線，內窗不剪。","先量車牆實際窗口再黏；兩層卡夾透明片會略增厚。"],
 G9:["透明片四邊3.125；G10夾在門片內，門硬卡窗16.875×28.125。","窗口內線只作定位，不裁透明片。"],
 W1:["輪Ø25，目標厚3.75，6個固定輪；輪心Ø10薄貼。","輪中心x87.5、312.5、350，左右各3，離地12.5；不做轉動車軸。"],
 O1:["全部是薄紙外觀貼片，文字自填。","沿外線裁；不把燈片或路線牌切成穿透車牆的洞。"],
 O6:["薄黑紙格柵，畫橫線或貼細條。","是裝飾貼片，不把車牆切空。"]
};
// The slanted railing in the 64cm catalog was rounded; regenerate its exact proportional length.
lookup.get("T3").size="幼管外Ø1.5×長84.529950（可取84.53）";
const pages=[];
function add(group,title,ids,body,extra=[]){
 const n=pages.length+1, ps=ids.map(id=>lookup.get(id));
 let footer="";
 for(let i=0;i<10;i++)footer+=`<rect x="${10+i*10}" y="183" width="10" height="2" fill="${i%2?"white":"#222"}" stroke="#222" stroke-width=".15"/>`;
 footer+=txt(10,180,"0")+txt(94,180,"100 mm")+rect(119,177,10,10)+txt(137,183,"方格10×10；此頁已縮好，請列印100%。")+txt(255,186,`P${String(n).padStart(2,"0")}`);
 let rows=txt(7,132,"零件尺寸mm／基準裁片數（尺寸已乘0.625；數量不變）");
 for(let i=0;i<ps.length;i++)rows+=txt(7,139+i*5,`${ps[i].id} ${ps[i].name}：${ps[i].size} ｜裁${ps[i].raw}`);
 const note=extra.length?extra:(notes[ids[0]]||["按下方尺寸表裁片；材料及裝配公差見組裝圖冊。"]);
 let instruction=note.map((t,i)=>txt(7,22+i*5,t)).join("");
 const svg=`${txt(7,9,`40cm / ${title}`,"head")}${txt(7,16,"原版62.5% · 黑實線裁／紅虛線摺／綠點線定位 · 此版不能與64cm裁片混用")}${instruction}${body}${rows}${footer}`;
 pages.push({n,group,title,ids,svg});
}
for(const p of base.pages){
 if(p.tile){
  const a=p.tile,len=a.len*Q,h=a.h*Q;
  for(let i=0;i<2;i++){
   const start=i*250,end=Math.min(start+260,len),w=end-start,uid=`40-${a.id}-${i}`;
   let inside=clean(a.inside);
   if(a.id==="B2")inside=inside.replaceAll('r="3.15"','r="3.28"'); // Ø4.1mm after ×.625
   if(a.id==="B5")for(const x of [12.5,387.5])inside+=rect((x-2.1)/Q,0,4.2/Q,3/Q,"guide");
   let body=`<defs><clipPath id="${uid}">${rect(0,-1.25,w,h+2.5)}</clipPath></defs><g transform="translate(10 37)"><g clip-path="url(#${uid})"><g transform="translate(${-start} 0) scale(.625)">${rect(0,0,a.len,a.h)}${inside}</g></g>`;
   if(i)body+=line(0,-1.25,0,h+1.25)+line(10,-1.25,10,h+1.25)+cross(5,h/2);
   if(!i)body+=line(250,-1.25,250,h+1.25)+line(260,-1.25,260,h+1.25)+cross(255,h/2);
   body+=`</g>`;
   add(p.group,`${a.id} ${a.name} 拼頁${i+1}/2`,p.ids,body,[
    `本頁x${start}–${end}；整件${len}×${h}，與相鄰頁重疊10，對齊十字再拼紙樣。`,
    ...(notes[a.id]||[]).slice(0,1)
   ]);
  }
 }else if(p.ids.join(",")==="J1,R1"){
  if(p.title.endsWith("1/3"))for(let i=0;i<2;i++){
   let body="";
   for(const [j,id] of ["J1","R1"].entries()){
    const len=id==="J1"?400:392.5,start=i*250,w=Math.min(260,len-start),yy=43+j*36,uid=`strip40-${id}-${i}`;
    body+=txt(10,yy-5,`${id} 本頁x${start}–${start+w}`)+`<defs><clipPath id="${uid}">${rect(0,-2,w,9)}</clipPath></defs><g transform="translate(10 ${yy})"><g clip-path="url(#${uid})">${rect(-start,0,len,5)}</g>`;
    body+=i?line(10,-2,10,7)+cross(5,2.5):line(250,-2,250,7)+cross(255,2.5);
    body+="</g>";
   }
   add(p.group,`J1／R1 長條拼頁${i+1}/2`,p.ids,body);
  }
 }else if(p.ids[0]==="F2"){
  if(p.title.endsWith("1/2"))add(p.group,"F2 後設備箱完整展開",p.ids,`<g transform="translate(10 55) scale(.625)">${clean(base.boxNet(110,26,35).s)}</g>`);
 }else{
  let body=clean(p.body);
  if(p.ids.includes("J13"))body=body.replace('width="10" height="6"','width="10" height="6.4"');
  if(p.ids.includes("T3"))body=body.replaceAll('height="2" class="guide"','height="2.4" class="guide"');
  add(p.group,p.title,p.ids,`<g class="scaled-shapes" transform="translate(0 20) scale(.625)">${body}</g>`);
 }
}
const pack={version:"40cm",factor:Q,dimensions:{length:400,width:87.5,height:140.625,wheelWidth:95},parts:part40,pages,tiling:{length:400,starts:[0,250],width:260,overlap:10},stair:{rise:66.25,run:52.5,width:16.25,steps:12,unfolded:118.75}};
if(pages.length!==37||part40.length!==73)throw Error("Unexpected page or part count");
if(new Set(part40.map(p=>p.id)).size!==73)throw Error("Duplicate part");
for(const p of part40)if(!pages.some(a=>a.ids.includes(p.id)))throw Error("Missing "+p.id);
fs.writeFileSync(new URL("./pack.js",import.meta.url),"window.pack40="+JSON.stringify(pack)+";\n");
fs.writeFileSync(new URL("./cutting-catalog.json",import.meta.url),JSON.stringify(pack,null,2));
let md=`# HK-104 40厘米比例版裁切索引\n\n這是64厘米完整方案另存的40厘米比例版，不取代64厘米原版。縮放係數40÷64＝0.625；車身400×87.5×140.625毫米，加外貼輪最大闊95毫米。上層64席、下層40席，司機另計；12級樓梯及拆合機關保留。37頁A4橫向紙樣，73種零件及管／棒切長圖。\n\n## 列印與材料\n\n- **列印100%**：此版圖形已縮小，不要再設62.5%。A4橫向、實際大小，關閉配合頁面及頁首頁尾。先量100毫米校準尺及10毫米方格。\n- **拼頁**：400長件分2頁，範圍x0–260及250–400，相鄰重疊10。對齊十字後先拼紙樣，再描整塊卡；不是把硬卡切成兩段。拼頁排版和10毫米重疊是列印設定，不是模型尺寸，不需按0.625縮小。\n- **厚度目標**：地板與輪3.75、牆與車頂1.875。表內疊層裁片數是以每層0.9375卡為理論基準，不是要求購買此特定厚度。實際材料按完成厚度疊合、量度及修整，層數與備料必須重新計算。\n- **不直接用原版1.5卡**：照原層數會變成地板6、牆3，已非同比例版，端牆嵌入寬與梯高需重設。此版不提供這個改厚方案。\n- **薄卡與窗片**：座椅及小盒宜試用約180–250gsm薄卡，透明片約0.1–0.2毫米；克重不等於厚度，先做1座及1盒驗證。\n- **定位件**：木棒約Ø2.5、長16.25，埋11.25露5；套管長6.25，目標內Ø2.8、外Ø4。孔只按實物配對後裁，原尺寸不能當作保證公差。\n- **小黏邊**：最小常用黏翼3.125，建議薄白膠配鑷子壓合；不要以厚泡棉膠增加尺寸。所有接頭先做試件，未經實物驗證。\n\n## 全部零件尺寸\n\n所有尺寸毫米；裁片數保留原版的理論疊層數。若改用其他厚度，以完成件數及目標厚度重算，不能盲剪表內疊層數。\n\n|編號|零件|40cm平面尺寸mm|基準裁片數|完成數／材料|頁碼|\n|---|---|---|---|---|---|\n`;
for(const p of part40)md+=`|${p.id}|${p.name}|${p.size}|${p.raw}|${p.finished}／${p.material}|${pages.filter(a=>a.ids.includes(p.id)).map(a=>"P"+String(a.n).padStart(2,"0")).join("、")}|\n`;
md+="\n## 頁碼索引\n\n";for(const p of pages)md+=`- **P${String(p.n).padStart(2,"0")}**：${p.title}。\n`;
md+="\n## 縮放邊界與製作公差\n\n原版每一個幾何長度、開孔、位置、座椅摺線、黏翼及管棒長度均乘0.625，座位和零件數量不變。校準尺、A4頁面、字體及線寬不縮小，以便讀取與列印。T3斜扶手從梯高、進深重新計算精確長84.529950，可手作取84.53；其他尺寸保留數學比例，不保證人手可達小數精度。建議平面畫線先取約0.1毫米，但四柱配合、窗柱厚度、端牆嵌入、梯孔及疊層高度必須實測試合，不能把每級梯高各自取整累加。\n";
md+="\n## 2026年10月8日套管配合更新\n\nJ13內Ø2.8、外Ø4、長6.25毫米，共4段；本項是按實際材料調整，不再用原理論外徑。P03／P04 B2定位虛圓已改Ø4.1，先試孔，緊才逐少修至約4.2。J3木棒盲孔仍先試Ø2.625；四柱中心不變。P21管長母線的外徑高度改4毫米。\n\nP09／P10 B5底邊新增綠色內面避位框，每側x中心12.5及387.5、每處闊4.2×高3毫米，凹深約0.9，共4處。這是內面局部凹位，不能沿框剪穿整塊牆；外面及外皮完整保留。管上露2.5且外Ø4會進入原側牆內面約0.75，先帶兩側牆乾合試避位，再正式黏牆。孔徑與凹位是試件起點，不是保證公差；不削薄套管、不改柱中心、不硬壓。裁片數及37頁結構紙樣總數不變；使用1毫米硬卡的226裁片以最新材料清單為準，不依原理論0.9375層數盲裁。\n";
md+="\n## 幼管外徑1.5毫米更新\n\nT3–T7、F6及F7統一採外徑1.5毫米幼管／紙卷管，不是內徑。P25管段母線高度更新至1.5毫米，長度和正式數量不變：36段總長1122.8099毫米，備至少1.5米，或200毫米長8根（1.6米），先排切。\n\n原中心位置不變，一對欄杆間淨空比原Ø1.25方案少0.25毫米，先試樓梯、轉角、座椅及通道是否頂住；不要把欄杆移入通道或跨拆合縫。按原表面黏接方案可先保留切長；若自行改成插孔固定，先試Ø1.6孔，按實際外徑微修，並另算埋入長度及確認地板不鑽穿，不能把原切長當作已包含新埋深。J13定位套管仍內Ø2.8、外Ø4、長6.25，與幼管分開採購。此為材料適配，不重縮巴士，尚未實物驗證。\n";
fs.writeFileSync(new URL("./HK-104-40cm-裁切索引.md",import.meta.url),md);
console.log(JSON.stringify({pages:pages.length,parts:part40.length,factor:Q}));
