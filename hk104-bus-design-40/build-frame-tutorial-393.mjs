import fs from "node:fs";
import assert from "node:assert/strict";
const source="https://tree0859.github.io/1024-kpcfcyc/hk104-bus-design-40/checklist.html?v=2106cda";
const rect=(x,y,w,h,c="card")=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" class="${c}"/>`;
const line=(x,y,a,b,c="outline")=>`<line x1="${x}" y1="${y}" x2="${a}" y2="${b}" class="${c}"/>`;
const label=(x,y,s,c="label")=>`<text x="${x}" y="${y}" class="${c}">${s}</text>`;
const circle=(x,y,r,c="hole")=>`<circle cx="${x}" cy="${y}" r="${r}" class="${c}"/>`;
const arrow=(x,y,a,b)=>line(x,y,a,b,"arrow");
const g=(x,y,k,s)=>`<g transform="translate(${x} ${y}) scale(${k})">${s}</g>`;
const frame=()=>rect(2,2,389,5,"j1")+rect(2,76,389,5,"j1")+rect(2,7,5,69,"j2")+rect(386,7,5,69,"j2");
const plan=(pins=false,wall=false)=>g(30,112,1.06,(wall?rect(0,0,393,83,"wall")+rect(2,2,389,79,"cutout"):"")+frame()+
 (pins?[12.28125,388].flatMap(x=>[5,78].map(y=>circle(x,y,2.4,"pin"))).join(""):""));
function lower(pin=true){
 return rect(60,126,59.6,16,"j1")+rect(140.4,126,69.6,16,"j1")+
 rect(80.875,142,98.25,72,"block")+rect(119.6,142,20.8,56,"hole")+
 (pin?rect(120,86,20,112,"pin"):"");
}
function upper(lift=0){
 return g(0,-lift,1,rect(50,94,63.6,32,"card")+rect(146.4,94,83.6,32,"card")+
 rect(114,76,4.8,50,"tube")+rect(141.2,76,4.8,50,"tube"));
}
const section=lift=>lower()+upper(lift);
const styles=`
svg{background:#fffdf7;color:#202a2c;font-family:'Noto Sans TC',sans-serif}
.label{font-size:20px;fill:#202a2c;font-weight:600}
.small{font-size:18px;fill:#202a2c}
.card{fill:#eeece6;stroke:#515b5f;stroke-width:1.2}
.wall{fill:#e5e1d7;stroke:#777468;stroke-width:1.2}
.cutout{fill:#fffdf7}
.j1{fill:#b9d6e9;stroke:#215c86;stroke-width:1.5}
.j2{fill:#f4d3ab;stroke:#97521a;stroke-width:1.5}
.block{fill:#b9bec0;stroke:#414b50;stroke-width:1.5}
.pin{fill:#368453;stroke:#154628;stroke-width:1.2}
.tube{fill:#ffdda0;stroke:#8a5e15;stroke-width:1.2}
.hole{fill:#fffdf7;stroke:#414b50;stroke-width:1.2}
.glue{stroke:#b12626;stroke-width:4;fill:none}
.outline{stroke:#515b5f;stroke-width:1.4;fill:none}
.guide{stroke:#515b5f;stroke-width:1.2;stroke-dasharray:5 5;fill:none}
.arrow{stroke:#25643c;stroke-width:3;fill:none;marker-end:url(#arr)}
`;
const steps=[
 {title:"先分清楚：框、接頭塊及地板",parts:"J1、J2、J3、B2",
  action:"把零件分袋：J1左右長條、J2前後短條合成承托框；J3是框下面的四個接頭塊；B2是可以取走的上層地板。",
  check:"本教程只教四柱承托框及上下層接合，不是整架巴士或樓梯的完整教程；先完成並校正下層空殼。",
  caution:"示意顏色只用來辨認零件，不是實物配色。所有步驟圖均不是1:1裁切紙樣。",
  drawing:label(28,38,"J1 藍：兩條長框")+rect(28,65,424,12,"j1")+rect(28,91,424,12,"j1")+
   label(28,146,"J2 橙：前後短框")+rect(50,165,12,78,"j2")+rect(178,165,12,78,"j2")+
   label(270,146,"J3 灰：四接頭塊")+rect(288,170,56,35,"block")+rect(364,170,56,35,"block")+rect(288,222,56,35,"block")+rect(364,222,56,35,"block")+
   label(28,302,"B2＝上層地板；不是承托框")},
 {title:"裁8片長短條，分別疊成2毫米",parts:"J1 ×2、J2 ×2",
  action:"用1毫米灰卡裁J1：389 × 5共4片；J2：69 × 5共4片。同尺寸兩片疊成一條，壓平待乾，完成2條J1及2條J2。",
  check:"每條名義厚度都是2毫米，邊緣齊平；不要把四條框全部疊在一起。",
  caution:"膠層會增加實際厚度；先薄塗、試疊。刀具及鑽孔工具需由有經驗者協助。",
  drawing:label(28,38,"每條各用兩片1毫米灰卡")+rect(44,65,270,10,"card")+rect(44,108,270,10,"card")+label(334,78,"1毫米")+label(334,121,"1毫米")+
   arrow(170,135,170,181)+rect(44,208,270,10,"j1")+rect(44,218,270,10,"j1")+label(334,226,"2毫米")+
   label(28,277,"J1：4裁片 → 2條")+label(28,308,"J2：4裁片 → 2條")},
 {title:"平放排成框，短條夾在長條之間",parts:"J1、J2",
  action:"在平面上排兩條J1；把兩條J2放在兩端，夾在J1之間。四條上表面同高，端部對接，不疊角。",
  check:"框的外廓為389 × 79，內空為379 × 69毫米；這不是393 × 83毫米的車身外廓。",
  caution:"先在車廂上乾放核對，不要離開車身基準就把歪框黏死；長邊不能切成393毫米。",
  drawing:label(28,38,"同一平面；角位對接，不搭疊")+label(213,88,"J1")+plan()+label(213,244,"J1")+
   label(28,284,"J2在兩端；完成外廓389 × 79")+label(28,313,"內空379 × 69；四條名義厚2")},
 {title:"製作12個L托座及24片三角撐",parts:"J7 ×12、J8 ×24",
  action:"J7側面托座10片：12.28 × 17.28；端面托座2片：11.86 × 17.28毫米。沿17.28方向距起點12.28處壓摺，餘下5毫米向內摺成水平托翼；每座配兩片J8三角撐。",
  check:"J8每片為1毫米灰卡，直角邊12.28及5毫米；兩片放在托座兩側，水平翼在上、直立黏面向下。",
  caution:"這裏的12.28等為平面尺寸顯示值，不是小數疊厚；全部托座先試放，避免窗洞和門洞。",
  drawing:label(28,38,"J7壓摺；每座配2片J8")+rect(45,74,110,173,"card")+line(45,197,155,197,"guide")+
   label(54,142,"12.28")+label(77,229,"5")+label(28,281,"平面展開")+
   line(312,82,312,221)+line(312,82,363,82)+`<polygon points="312,82 363,82 312,205" class="block"/>`+
   label(262,59,"側視：托翼向內")+label(270,257,"J8兩側各1片")+label(270,288,"翼在上、面向下")},
 {title:"在下層標出框頂及框底高度",parts:"下層空殼、J7、J8",
  action:"以地面z0為基準，標框頂z80.40625、框底z78.40625毫米；兩者相差2毫米。J7水平托翼的上表面對齊框底，直立黏面貼在牆內側向下延伸。",
  check:"左右各5個托座，建議x49.13、127.73、206.33、284.93、358.61；車頭及車尾各1個，y41.50。共12個，每座配2片J8。",
  caution:"z高度從地面量，不是從下層地板面量。實際位置遇窗洞或裝飾時，先評估黏接支承，不能貼在空洞上。",
  drawing:label(28,36,"側剖面：托翼頂對齊框底")+rect(100,76,20,170,"wall")+rect(120,76,80,20,"j1")+
   line(120,96,170,96,"glue")+line(120,96,120,219,"glue")+`<polygon points="120,98 170,98 120,219" class="block"/>`+
   line(207,76,449,76,"guide")+line(207,96,449,96,"guide")+label(242,65,"框頂80.40625")+label(242,128,"框底78.40625")+
   label(242,190,"J8三角撐在翼下")+label(242,225,"J7黏牆面向下")+label(28,300,"示意放大；兩側三角撐只畫一片")},
 {title:"把J1、J2固定在托座上",parts:"J1、J2、J7、J8",
  action:"先把整個框放進車廂：J1佔x2–391，y2–7及76–81；J2佔x2–7及386–391，y7–76毫米。確認端部吻合，再把框固定在托座及牆內側。",
  check:"框頂與兩側牆頂、前後牆頂齊平；框與車身外緣四邊相距2毫米，沒有一角翹高。",
  caution:"框負責承托上層，不是靠木棒懸吊；四個框角不得疊厚，也不要用厚膠堆填高低差。",
  drawing:label(28,38,"俯視：框內嵌牆內，不壓牆頂")+plan(false,true)+
   label(28,251,"車身393 × 83；四邊牆厚2")+label(28,285,"框頂＝牆頂，同一接合面")+label(28,314,"黏托座與牆內側；先保持平整")},
 {title:"用同一基準標四個中心",parts:"承托框、B2",
  action:"始終用「車頭在左、右側外緣在上」的共同俯視圖。四孔中心是前右(12.28125,5)、前左(12.28125,78)、後右(388,5)、後左(388,78)。把同一中心轉印到框及B2。",
  check:"x從車身車頭外緣量，y從車身右側外緣量；不是從承托框內緣量。B2翻面量度時須轉回共同方向核對。",
  caution:"後中心距車尾5毫米，前中心距車頭12.28125毫米，前後不是對稱孔位；不要沿用舊紙樣的孔心。",
  drawing:label(28,38,"共同俯視：車頭←　→車尾")+label(28,86,"前x12.28125")+label(310,86,"後x388")+plan(true,true)+
   label(28,252,"上邊：右側，孔y5")+label(28,285,"下邊：左側，孔y78")+label(28,315,"綠孔心示意放大；不是孔徑")},
 {title:"分前後J3：後塊孔不能置中",parts:"J3的36片裁片",
  action:"裁36片12.28125 × 6毫米的1毫米灰卡，分成4組，每組9片。前兩組孔心距前短邊6.140625；後兩組距前短邊9.28125、距後短邊3毫米。",
  check:"所有孔心在6毫米寬方向置中，即距兩側長邊均3毫米。每組先只在上方7片開約Ø2.6試孔，下方2片保持實心。",
  caution:"四組都保持車頭在左、車尾在右；不能把後塊翻轉後，仍從錯誤一端量9.28。",
  drawing:label(28,38,"四塊同方向：車頭←　→車尾")+label(28,86,"前塊 ×2")+label(266,86,"後塊 ×2")+
   rect(28,112,180,88,"block")+circle(118,156,19)+rect(266,112,180,88,"block")+circle(402,156,19)+
   label(28,239,"距前6.140625")+label(266,239,"距前9.28125")+label(266,273,"距後3")+label(28,308,"各塊長12.28125、闊6；孔寬向居中")},
 {title:"每塊疊9層：上7有孔、底2封住",parts:"J3 ×4",
  action:"每組先把7片有孔灰卡同軸疊合，再加2片實心灰卡做底，形成塊頂深7毫米的盲孔。薄塗膠、壓平，避免膠塞孔。",
  check:"完成塊高9毫米；由塊頂到孔底7毫米，孔底下面還有2毫米實卡，不是9毫米通孔。",
  caution:"前後孔位不同，疊合時用各自組內的孔定位；不要把前塊裁片混入後塊。",
  drawing:label(28,38,"J3側剖面：7毫米孔＋2毫米底")+
   rect(85,83,150,126,"block")+rect(144,83,32,98,"hole")+
   Array.from({length:8},(_,i)=>i<6?line(85,97+i*14,144,97+i*14,"guide")+line(176,97+i*14,235,97+i*14,"guide"):line(85,97+i*14,235,97+i*14,"guide")).join("")+
   label(270,113,"上7層開孔")+label(270,187,"下2層實心")+label(28,257,"四塊各9片，共36片灰卡")+label(28,291,"孔深由塊頂量7，不鑽穿")},
 {title:"四塊J3黏在框底，不與框重疊",parts:"J3、J1",
  action:"承托框先開約Ø2.6木棒試孔。J3孔朝上，逐塊貼在框的底面，孔心與框孔同軸；先用無膠的試棒檢查，再固定J3並移走試棒待乾。",
  check:"J3頂z78.40625、底z69.40625毫米；從框頂量盲孔總深9＝框2＋入塊7。前門洞頂約z68.125，仍須檢查實際門位。",
  caution:"J3不是疊在框頂，也不是與框佔同一高度；門洞名義空隙只有約1.28毫米，膠塊、包邊不可頂住。",
  drawing:label(28,38,"J3頂貼框底；孔朝上")+lower(false)+line(81,142,119,142,"glue")+line(141,142,179,142,"glue")+
   label(262,118,"框厚2")+label(262,163,"J3高9")+label(262,207,"塊底封2")+label(28,269,"膠在塊頂接觸面，不流入孔")+label(28,303,"由框頂至孔底：2＋7＝9")},
 {title:"木棒裁14毫米，按7＋2＋5裝入",parts:"J12 ×4、J3",
  action:"裁4根Ø約2.5、長14毫米的木棒，修平端部並輕磨倒刺。每根由底端標7及9毫米；入塊7、穿框2，框頂以上露5毫米。",
  check:"7毫米標記對J3塊頂，9毫米標記對框頂；四根外露高度相同。先試一組，合格再做其餘三組。",
  caution:"只在入J3固定段薄上膠；框頂以上5毫米及套管內不能有膠，木棒不能與上層黏死。",
  drawing:label(28,38,"J12：Ø約2.5 × 長14")+lower()+
   label(260,95,"框上露5")+label(260,139,"穿框2")+label(260,185,"入塊7")+label(28,270,"木棒由底端標7及9毫米")+label(28,304,"綠色＝木棒；外露段不上膠")},
 {title:"B2開套管孔，套管底齊地板底",parts:"B2、J13 ×4",
  action:"B2須為393 × 83、4層1毫米灰卡。依相同四中心先試開Ø4.1孔；套管內Ø2.8、外Ø4，每段長6.25毫米，共4段。",
  check:"套管穿過4毫米厚B2，底端齊B2底面，上端露2.25毫米；試孔太緊才逐少修至約4.2，先不黏管。",
  caution:"套管長仍是6.25，不是木棒長14；管底若向下凸出，B2就不能落在承托框上。",
  drawing:label(28,38,"J13穿B2；底端齊平")+upper()+
   label(260,85,"上露2.25")+label(260,125,"B2厚4")+line(45,126,240,126,"guide")+
   label(28,208,"套管：內Ø2.8／外Ø4")+label(28,245,"管長6.25；四段先不黏")+label(28,287,"下面不能凸出B2底面")},
 {title:"四棒同時對四管，水平乾合",parts:"下層四柱、B2及四套管",
  action:"讓四根木棒同時對準四個套管，B2保持水平往下放，自然落在框頂與牆頂；先不鎖帶、不上膠，任何一角卡住就整塊提起檢查。",
  check:"帶上完整2毫米上層側牆及最後排椅試位：套管與側牆名義留1毫米，後管與末排椅後緣名義留2.825毫米。",
  caution:"上層牆及座椅這時只是乾放核對，不提早永久固定；不用鎖帶強拉，不用舊版削薄側牆方法。",
  drawing:label(28,38,"四角同時下放；圖為單角剖面")+g(0,45,1,section(42))+arrow(250,95,250,171)+
   label(282,100,"保持水平")+label(282,145,"不可硬壓")+label(28,290,"四管都對中，B2自然平落")+label(28,320,"先乾合；遇卡住就提起重查")},
 {title:"標管高後，取下B2才黏管外",parts:"B2、J13",
  action:"乾合合格後記下各管高度，垂直取下B2。只在套管外壁與B2孔壁之間薄上膠，保持管底齊平，按膠水說明待乾。",
  check:"四管平行、開口暢通，管內及木棒外露段都無膠；B2沒有和下層框或木棒黏在一起。",
  caution:"不要讓整車合住時灌膠，避免膠流入管內、跨到下層或把上下兩層黏死。",
  drawing:label(28,38,"取下的B2：只黏套管外壁")+upper()+line(112,99,112,121,"glue")+line(148,99,148,121,"glue")+
   label(260,89,"管內無膠")+label(260,131,"管外薄黏")+label(28,217,"紅短線＝上膠處")+label(28,254,"下層不要留在旁邊一起灌膠")+label(28,291,"固定後按膠水指引乾透")},
 {title:"確認接合面沒有刻意留縫",parts:"B2、承托框、四柱接頭",
  action:"乾透後再次平放上層。B2底面應接觸承托框與牆頂，木棒在管內插入5毫米，管頂比木棒尖高1.25毫米。",
  check:"1.25毫米是套管內部的軸向餘量，不是上下兩層車身之間的間隙；承重位置是框及牆頂，木棒只作定位。",
  caution:"四角不平時先查管底是否凸出、棒長是否不一、孔位是否偏，不能把四角用膠墊或鎖帶拉到平。",
  drawing:label(28,38,"落座剖面：B2底接觸框頂")+section(0)+
   label(260,83,"管頂餘1.25")+label(260,118,"B2厚4")+label(260,152,"框厚2")+label(260,198,"J3高9")+label(28,274,"6.25管長－5插入＝1.25")+label(28,307,"不是車身兩層之間留1.25縫")},
 {title:"鬆四帶，垂直提至少7毫米",parts:"完整接頭、J10/J11鎖帶",
  action:"先解開全部4條鎖帶，雙手托住上層兩端底部，均勻垂直提至少7毫米；四棒完全離管後，才把上層水平移開。",
  check:"若上層已裝11.053125毫米高的豎肋，取下後放在至少12毫米高的邊緣墊塊上，避開底肋；有膠層或檯面誤差則用更高墊塊。",
  caution:"不抓車頂提整車、不逐角扭拔；樓梯及斜扶手只固定下層，上層孔邊欄杆只固定上層，不能跨縫黏住。",
  drawing:label(28,38,"先鬆4帶，再均勻垂直提起")+g(0,45,1,section(58))+arrow(252,190,252,108)+
   label(285,110,"至少提7")+label(285,155,"再水平移開")+label(28,290,"雙手托底，不抓車頂")+label(28,320,"收納墊邊緣至少12高，避開底肋")},
 {title:"反覆20次試拆，才繼續永久內裝",parts:"整個接頭組件",
  action:"以完整牆板、末排椅及樓梯乾放核對干涉，反覆試拆20次。每次檢查四角是否自然平落、管有否鬆、棒有否倒刺、框及塊有否裂；合格後才永久固定後續內裝，再帶齊組件複驗。",
  check:"試件合格才批量製作；成功拆合不等於完成強度驗證。這是未經實物試製的計算方案，高度跟長度倍率0.9825仍是工作假設。",
  caution:"原A4/A3裁切紙樣及PDF不修改；新外框與新孔位須按393 × 83毫米實作尺寸另行量度，不混用40厘米歷史數字。",
  drawing:label(28,38,"每次檢查四角，不靠硬壓合上")+plan(true,true)+
   label(28,249,"20次：平落／無卡／無裂／管不鬆")+label(28,284,"合格後才做永久內裝")+label(28,314,"本教程只涵蓋承托框與拆層接頭")}
];
assert.equal(steps.length,17);
assert.equal(5+69+5,79);
assert.equal(389-5-5,379);
assert.equal(7+2+5,14);
assert.equal(6.25-4,2.25);
assert.equal(6.25-5,1.25);
fs.mkdirSync(new URL("tutorial-393/",import.meta.url),{recursive:true});
const svgFiles=steps.map((s,i)=>{
 const file=`tutorial-393/step-${String(i+1).padStart(2,"0")}.svg`;
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 330" role="img" aria-labelledby="title desc"><title id="title">${i+1}：${s.title}</title><desc id="desc">${s.action} ${s.check}</desc><style>${styles}</style><defs><marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#25643c"/></marker></defs>${s.drawing}</svg>`;
 fs.writeFileSync(new URL(file,import.meta.url),svg);
 return file;
});
const toc=steps.map((s,i)=>`<a href="#step-${i+1}"><span>${String(i+1).padStart(2,"0")}</span>${s.title}</a>`).join("");
const sections=steps.map((s,i)=>`<section class="tutorial-step" id="step-${i+1}">
 <div class="step-text"><p class="step-count">步驟 ${String(i+1).padStart(2,"0")} / 17 · ${s.parts}</p><h2>${s.title}</h2>
 <p>${s.action} <a class="ref" href="${source}" target="_blank" rel="noopener noreferrer">〔尺寸依據〕</a></p>
 <p class="check"><strong>完成後檢查：</strong>${s.check} <a class="ref" href="${source}" target="_blank" rel="noopener noreferrer">〔依據〕</a></p>
 <p class="caution"><strong>不要做錯：</strong>${s.caution}</p></div>
 <figure><img src="${svgFiles[i]}" width="480" height="330" alt="步驟${i+1}：${s.title}；${s.parts}" ${i?"loading=\"lazy\"":""}><figcaption>圖 ${String(i+1).padStart(2,"0")} · 安裝示意，不是1:1裁切紙樣；厚度及局部空隙有放大。</figcaption></figure></section>`).join("");
const html=`<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>HK-104 39.3厘米｜四柱承托框逐步拼裝教程</title><meta name="description" content="17步及17張步驟圖，按393 × 83毫米及1毫米灰卡，從J1、J2承托框到四柱、套管與拆層驗收。"><link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet"><link href="tutorial-base-393.css" rel="stylesheet"><link href="frame-tutorial-393.css" rel="stylesheet"></head><body>
 <a class="skip" href="#steps">跳至拼裝步驟</a><header><a href="index.html">HK–104 ／ 39.3厘米實作</a><button id="tutorial-print" type="button">列印圖文教程</button></header>
 <main><section class="intro"><p class="eyebrow">393 × 83 MM · 1 MM GREY CARD</p><h1>四柱承托框<br>逐步拼裝教程</h1><p class="lead">由J1、J2開始，逐件組成可拆的上下層接頭。17步，每步一張圖；先乾合，再黏膠。</p><p>本篇聚焦你剛才問的「四柱的框」及接頭，不包括全車座椅、車身或樓梯的完整製作。下層空殼須先完成；高度縮放仍屬工作假設，方案未經實物試製，先做一組試件。</p>
 <nav class="related" aria-label="相關頁面"><a href="bus-tutorial-393.html">全車42步拼裝教程</a><a href="checklist.html">四柱／樓梯50項清單</a><a href="revision-393.html">全部零件尺寸</a></nav></section>
 <details class="contents"><summary>先看備料、圖例與17步目錄</summary>
 <p class="legend">辨認圖色：<span class="key j1">J1長框</span><span class="key j2">J2短框</span><span class="key j3">J3接頭塊</span><span class="key pin">木棒</span><span class="key tube">套管</span>；紅短線表示膠，綠箭表示移動。尺寸全部以毫米計，小數是平面量度，不是灰卡疊厚。</p>
 <p class="scope">核心備料：承托框8片灰卡、J3共36片、J8共24片，合共68片1毫米灰卡；另備J7薄卡12片、木棒4根、套管4段。這不是全車材料總數，也未包括B2地板4片、其他車殼及4條鎖帶。</p>
 <nav aria-label="教程步驟">${toc}</nav></details><article id="steps">${sections}</article>
 <footer><p>設計依據：39.3厘米四柱接頭與樓梯組裝清單；本篇補充拆分工序與辨認圖，不更改既有尺寸或原紙樣。</p><a href="${source}" target="_blank" rel="noopener noreferrer">公開版本依據</a><p class="source-url">${source}</p><p>HK-104 · 手工紙卡模型 · 2026-10-19 · 圖文由Perplexity Computer整理</p></footer></main><script>document.getElementById('tutorial-print').addEventListener('click',()=>window.print());</script></body></html>`;
fs.writeFileSync(new URL("frame-tutorial-393.html",import.meta.url),html);
// QA inventory: 17 images; readable labels at 375px; no overflow; all sections;
// table of contents and anchors; print all steps; links to checklist and revision;
// first and last step, local and hosted navigation; no missing assets/JS errors.
console.log(`Built ${steps.length} steps and ${svgFiles.length} diagrams.`);
