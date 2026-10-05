const rect=(x,y,w,h,c="outline",r=0)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" class="${c}" rx="${r}"/>`;
const line=(a,b,c,d,cl="hair")=>`<line x1="${a}" y1="${b}" x2="${c}" y2="${d}" class="${cl}"/>`;
const text=(x,y,t,c="",anchor="start")=>`<text x="${x}" y="${y}" class="${c}" text-anchor="${anchor}">${t}</text>`;
const circle=(x,y,r,c)=>`<circle cx="${x}" cy="${y}" r="${r}" class="${c}"/>`;
const dim=(a,b,c,d,t)=>line(a,b,c,d)+line(a-3,b-3,a+3,b+3)+line(c-3,d-3,c+3,d+3)+text((a+c)/2,(b+d)/2-7,t,"dim","middle");
const mount=(id,w,h,s,t)=>document.getElementById(id).innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${t}"><title>${t}</title>${s}</svg>`;
let e=text(40,27,"A01 / 64厘米完整車身 · 左側視圖","label")+text(40,47,"車頭在左 · 左側活動前門 · 外貼固定輪 · 全部標註為mm","muted");
e+=`<g transform="translate(60 65)">`+rect(0,0,640,201,"bodyfill")+rect(0,0,640,3,"paper")+rect(0,89,640,6,"paper")+rect(0,195,640,6,"paper")+line(0,95,640,95,"dash")+rect(12,115,40,80,"paper")+line(32,115,32,195);
e+=rect(65,120,79,50,"seat");for(let r=0;r<8;r++)e+=rect(160+55*r,120,48,50,"seat");e+=rect(600,120,28,50,"seat")+rect(12,21,130,48,"seat");for(let r=0;r<15;r++)e+=rect(150+32*r,21,26,48,"seat");
for(const x of [140,500,560])e+=circle(x,205,20,"facility")+circle(x,205,8,"paper");
for(const x of [100,540])e+=rect(x-10,73,20,37,"paper")+rect(x-9,95,18,15,"stair");
e+=text(320,85,"接合面 z=130","dim","middle")+text(320,189,"HK–104  完整硬卡紙模型","dim","middle")+line(-10,225,650,225)+dim(0,248,640,248,"640 車長")+dim(680,0,680,225,"225")+text(680,248,"車高","dim","middle")+line(0,225,0,253)+line(640,201,640,253)+`</g>`;
mount("elevation",800,343,e,"64厘米巴士左側視圖，車長640、車高225，上下地板及活動前門");
let ends=text(40,27,"A02 / 前、後端視圖","label");
for(const [i,title]of ["前端","後端"].entries()){
ends+=`<g transform="translate(${110+i*365} 53)">`+rect(0,0,140,201,"bodyfill")+rect(0,0,140,3,"paper")+rect(0,89,140,6,"paper")+rect(0,195,140,6,"paper")+rect(i?26:18,i?25:21,i?88:104,i?40:48,"seat");
if(!i){ends+=rect(18,119,104,52,"seat")+rect(25,5,90,12,"paper")+text(70,16,"104 示範線","dim","middle")+rect(8,182,22,8,"paper")+rect(110,182,22,8,"paper");}
else{ends+=rect(28,127,84,35,"facility");for(let r=0;r<5;r++)ends+=line(32,132+r*6,108,132+r*6);ends+=rect(10,174,8,16,"stair")+rect(122,174,8,16,"stair");}
ends+=rect(55,185,30,10,"paper")+rect(-6,185,6,40,"facility")+rect(140,185,6,40,"facility")+line(-15,225,155,225)+dim(0,245,140,245,"140 車身寬")+dim(-6,274,146,274,"152 含外貼輪")+text(70,307,title,"label","middle")+`</g>`;
}
ends+=text(40,393,"側牆厚3 → 嵌入端牆寬134；輪片每側厚6 → 車身140之外，最大總寬152。","muted");
mount("ends",800,417,ends,"巴士前後端視圖，車身寬140、含外貼轮最大寬152");
const ys=[10,35,85,110];
const drawSeat=(x,y,n,p=false)=>rect(x,y,26,22,p?"priority":"seat",2)+line(x+23,y+2,x+23,y+20,"outline")+text(x+11,y+15,n,"","middle");
function plan(upper){
let s=text(40,27,upper?"B01 / 上層64座與樓梯孔":"C01 / 下層40座與完整內部設施","label")+text(40,47,"車頭 ←　上方＝車身右側　下方＝車身左側　／　粗線＝椅背；座位向車頭","muted");
s+=`<g transform="translate(60 93)">`+rect(0,0,640,140,"outline")+rect(3,3,634,134,"paper")+rect(3,57,634,26,"aisle")+line(3,57,637,57)+line(3,83,637,83);
for(const x of [20,620])for(const y of [5,135])s+=circle(x,y,3,"pin");
let count=0;
if(upper){
s+=rect(31,10,28,73,"stair")+rect(59,10,86,32,"stair");for(let r=0;r<12;r++)s+=line(60+7*r,12,60+7*r,38);
s+=line(139,26,64,26,"dash")+text(45,71,"平台","","middle");
for(const x of [40,80])for(const y of [85,110])s+=drawSeat(x,y,++count);
for(let r=0;r<15;r++)for(const y of ys)s+=drawSeat(150+32*r,y,++count);
s+=line(59,6,145,6,"outline")+line(59,46,145,46,"outline")+line(148,10,148,42,"outline")+text(59,-16,"梯孔86 × 32","dim")+text(290,-16,"主區15排 × 4＝60","dim")+text(72,165,"前左4座","dim","middle")+text(420,165,"主區60座；合計64","dim","middle");
}else{
s+=rect(10,10,42,42,"facility")+circle(25,22,6,"paper")+rect(30,30,18,18,"paper")+rect(60,12,84,26,"stair")+rect(144,10,22,73,"stair");
for(let r=0;r<12;r++)s+=line(60+7*r,12,60+7*r,38);
s+=line(139,26,64,26,"dash")+rect(12,85,40,52,"facility")+rect(58,88,14,16,"facility")+rect(82,86,60,46,"facility")+rect(608,15,26,110,"facility")+line(12,140,52,140,"dash")+text(32,115,"入口","","middle")+text(112,107,"輪椅","","middle")+text(112,123,"區","","middle");
for(let r=0;r<10;r++)for(const y of ys)s+=drawSeat(170+45*r,y,++count,r===0);
s+=text(10,-15,"司機位（另計）","dim")+line(30,-10,30,10)+text(67,-34,"固定梯84 × 26","dim")+line(105,-28,105,12)+text(300,-15,"10排 × 4＝40","dim")+text(28,165,"門40寬","dim","middle")+text(70,187,"收費器14 × 16","dim")+line(66,107,66,170)+text(415,165,"末排後緣601；尾箱由608起","dim","middle")+text(621,75,"箱","dim","middle");
}
s+=dim(0,216,640,216,"640")+dim(680,0,680,140,"140")+line(0,140,0,221)+line(640,140,640,221)+`</g>`+text(40,343,"每座22寬 × 26深；座面高16、總高40；通道26。圖內編號對應"+(upper?"U01–U64":"L01–L40")+"。","muted");
mount(upper?"upper-plan":"lower-plan",800,367,s,upper?"上層64座完整俯視，前左4座與主區15排四座":"下層40座完整俯視，司機位、入口、收費器、立體樓梯及輪椅區");
document.getElementById(upper?"upper-plan":"lower-plan").dataset.seats=count;
}
plan(true);plan(false);
let ex=text(40,27,"D01 / 完整分層爆炸示意（分離高度為示意）","label");
ex+=`<g transform="translate(62 50)">`+rect(0,0,550,10,"bodyfill")+text(579,11,"可取車頂","label")+rect(0,55,550,82,"bodyfill")+rect(0,137,550,8,"paper")+rect(11,74,110,43,"seat");
for(let r=0;r<15;r++)ex+=rect(129+r*27.5,74,22,43,"seat");
for(const x of [138,241,344,447])ex+=rect(x,145,7,16,"facility");
for(const x of [17,533])ex+=rect(x-3,131,6,14,"stair")+line(x,169,x,222,"dash");
for(const x of [86,464])ex+=rect(x-9,121,18,40,"paper")+line(x,174,x,217,"dash");
ex+=text(579,100,"上層64座","label")+text(579,124,"地板＋4條底肋","dim")+rect(0,222,550,88,"bodyfill")+rect(0,310,550,7,"paper")+rect(10,240,35,70,"paper")+rect(56,241,67,43,"seat");
for(let r=0;r<8;r++)ex+=rect(138+r*47.3,241,41,43,"seat");
for(const x of [17,533])ex+=rect(x-2,212,4,10,"pin");
for(const x of [86,464])ex+=rect(x-9,225,18,13,"stair");
ex+=text(579,265,"下層40座","label")+text(579,289,"頂框＋4根柱","dim")+text(275,195,"鬆4帶 → 均勻垂直提至少10 → 分開","dim","middle")+text(275,347,"近、遠側共4柱／4管／4帶；上層底肋需放在20高墊塊上。","muted","middle")+`</g>`;
mount("exploded",840,419,ex,"完整車頂、上層模組、下層模組拆合爆炸示意，四條底肋與四柱四帶");
let j=text(40,27,"D02 / 木棒與套管接頭剖面（放大，橫向比例為示意）","label");
// Vertical dimension scale is 9 screen units per mm.
j+=`<g transform="translate(58 65)">`+rect(0,103,286,27,"facility")+rect(0,130,65,153,"bodyfill")+rect(65,103,143,180,"facility")+rect(0,49,286,54,"paper")+rect(106,13,8,90,"stair")+rect(164,13,8,90,"stair")+rect(114,13,50,90,"paper")+rect(121,31,36,234,"pin");
j+=line(-12,103,303,103,"dash")+text(321,108,"接合面 z=130","label")+line(172,13,301,13)+text(321,18,"管長10：地板6＋上露4","label")+line(157,31,301,31)+text(321,47,"柱露8，管內留2餘量","label")+line(286,70,301,70)+text(321,76,"上層地板完成厚6","label")+line(286,125,301,125)+text(321,143,"8寬承托框，負責承重","label")+line(208,189,301,189)+text(321,194,"補強塊20×10×20","label")+line(157,265,301,265)+text(321,268,"木棒埋18；全長26","label")+text(321,309,"柱徑約4；管內徑約4.5–5","dim")+`</g>`;
j+=text(40,415,"4點（x,y）：(20,5)、(620,5)、(20,135)、(620,135)。管內不進膠，補強塊底z=110避開前門。","muted");
mount("connector",840,439,j,"完整四點木棒接頭剖面，竹棒埋18露8，套管10，地板6与補強塊");
let sp=text(40,27,"E01 / 52個完整雙人座模組展開","label");
sp+=`<g transform="translate(60 66) scale(2.4)">`+rect(0,0,47,55,"paper")+rect(0,0,47,26,"seat")+rect(0,26,47,24,"seat")+rect(0,50,47,5,"stair")+line(0,26,47,26,"dash")+line(0,50,47,50,"dash")+line(22,0,22,50)+line(25,0,25,50)+`</g>`;
sp+=text(191,100,"座面26深")+text(191,158,"背板24高")+text(191,194,"反摺補強5")+dim(60,217,173,217,"47 = 22 + 3 + 22")+text(60,242,"座面＋背板：47×55","dim");
sp+=`<g transform="translate(397 66) scale(2.4)">`+rect(0,0,47,40,"paper")+rect(0,0,47,12,"stair")+rect(0,12,47,16,"facility")+rect(0,28,47,12,"stair")+line(0,12,47,12,"dash")+line(0,28,47,28,"dash")+`</g>`;
sp+=text(530,95,"上翼12")+text(530,127,"前支承16")+text(530,157,"落地翼12")+text(397,189,"Z座底：47×40","dim")+text(397,216,"每模組另加2片26×21側板","dim")+text(397,238,"側板包括5底翼；背板加角撐","dim");
sp+=line(60,316,731,316)+rect(653,277,62,4,"seat")+rect(711,222,4,59,"seat")+line(653,281,653,316,"outline")+line(715,281,715,316,"outline")+text(485,275,"座面離地16","dim")+text(485,299,"總高40","dim")+text(60,285,"虛線＝摺線；全部尺寸mm","label")+text(60,344,"上層32＋下層20雙人模組＝104席。完整座椅有座底，不採用直接平貼地板的L形座。","muted");
mount("seat-pattern",840,369,sp,"完整雙人座47乘55背板座面，47乘40Z座底及側板紙樣");
let st=text(40,27,"E02 / 12級立體樓梯與上下層平台側剖","label");st+=`<g transform="translate(80 73)">`;
const Q=1.65;let path="M 0 0";for(let n=0;n<12;n++)path+=` H ${(n+1)*7*Q} V ${(n+1)*106/12*Q}`;path+=" H 0 Z";
st+=`<path d="${path}" class="stair"/>`+rect(-46,-10,46,10,"paper")+rect(-46,106*Q,218,10,"paper")+dim(0,106*Q+38,84*Q,106*Q+38,"總進深84")+dim(190,0,190,106*Q,"總升高106")+text(-46,-23,"上層地板頂 z=136","dim")+text(-46,106*Q+70,"下層地板頂 z=30","dim");
st+=text(250,11,"12級：每級進深7，升高約8.83","label")+text(250,48,"梯身84×26；上層孔86×32","label")+text(250,89,"前高後低，梯身只黏下層")+text(250,119,"梯頂z=136，穿入上層孔")+text(250,149,"扶手每層獨立固定，不黏跨層")+text(250,192,"風琴條：26寬 × 190長","label")+text(250,221,"每次106÷12豎面＋7踏面，重複12次","dim")+`</g>`+text(40,357,"按總高106等分，避免逐級累加四捨五入誤差。孔前後各留1、左右各留3；不是畫線斜面。","muted");
mount("stair-pattern",840,381,st,"十二級立體樓梯總高106、進深84、寬26，上層孔86乘32");
let f=text(40,27,"E03 / 完整內部設施（小件各自放大，比例各異）","label");
const cells=[
["司機台／方向盤",rect(25,38,90,35,"facility")+circle(65,29,20,"paper")+line(65,48,65,66,"outline")+text(65,35,"12","dim","middle")+dim(25,95,115,95,"台寬28")+text(10,131,"台深10；司機椅另計","dim")],
["收費器／八達通",rect(38,25,48,96,"facility")+rect(48,37,28,20,"paper")+rect(48,72,28,7,"paper")+dim(38,144,86,144,"寬14")+dim(111,25,111,121,"高28")+text(10,174,"深16；入口後側立體紙盒","dim")],
["輪椅靠板／裝飾帶",rect(24,23,80,88,"facility")+line(24,69,104,84,"dash")+dim(24,138,104,138,"寬30")+dim(130,23,130,111,"高35")+text(10,172,"輪椅展示區60×46，不佔席","dim")],
["扶手與落車鐘",rect(62,17,8,115,"facility")+circle(66,62,9,"pin")+dim(110,17,110,132,"高55–60")+text(10,159,"飲管柱；落車鐘直徑4–6","dim")+text(10,181,"勿堵26寬主通道，不跨接兩層","dim")],
["後設備箱",rect(22,49,145,42,"facility")+rect(22,35,145,14,"paper")+dim(22,116,167,116,"横跨車寬110")+text(10,152,"高35、長向深26；黑紙格柵","dim")+text(10,175,"下層x=608–634，避開末排","dim")],
["路線牌／滅火筒",rect(12,27,176,29,"paper")+text(100,47,"104 示範線","label","middle")+rect(32,86,17,51,"stair",4)+line(40,80,40,86,"outline")+text(65,108,"前牌90×12","dim")+text(65,132,"筒直徑6×高18","dim")+text(10,172,"非電子元件或真正消防設備","dim")]
];for(let i=0;i<cells.length;i++)f+=`<g transform="translate(${40+(i%3)*263} ${68+Math.floor(i/3)*228})">`+text(0,0,cells[i][0],"label")+cells[i][1]+`</g>`;
mount("facilities-detail",840,539,f,"完整方向盤、司機台、收費器、輪椅靠板、扶手、設備箱及路線牌尺寸");
document.documentElement.dataset.theme=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";
document.getElementById("theme").addEventListener("click",()=>document.documentElement.dataset.theme=document.documentElement.dataset.theme==="dark"?"light":"dark");
document.getElementById("print").addEventListener("click",()=>window.print());
const cutLink=document.createElement("a");
cutLink.href="cutting.html";cutLink.textContent="1:1裁切紙樣";
document.querySelector("nav").prepend(cutLink);
const cutIntro=document.createElement("p");
cutIntro.className="closing";
cutIntro.innerHTML='需要直接裁剪：<a href="cutting.html">打開64厘米完整裁切母版</a>，選分類並以A4橫向100%列印。先核對100mm校準尺；640mm長件要拼三頁紙樣，組裝圖本身不是1:1。';
document.querySelector(".hero").append(cutIntro);
document.querySelector("#upper .grid article:last-child p").textContent="x=59–145、y=10–42，86×32；比84×26梯身前後各多1、左右各多3。孔前平台長28；底面改三邊U形補強，避開下層承托條，詳細裁片見J5／J6。";
