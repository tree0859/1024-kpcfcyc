import fs from "node:fs";
import assert from "node:assert/strict";
const root=new URL("./",import.meta.url);
const spec=JSON.parse(fs.readFileSync(new URL("no-post-revision/no-post-spec.json",root),"utf8"));
const r=(x,y,w,h,c="card")=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" class="${c}"/>`;
const l=(x,y,a,b,c="outline")=>`<line x1="${x}" y1="${y}" x2="${a}" y2="${b}" class="${c}"/>`;
const t=(x,y,s)=>`<text x="${x}" y="${y}">${s}</text>`;
const g=(x,y,k,s)=>`<g transform="translate(${x} ${y}) scale(${k})">${s}</g>`;
const arrow=(x,y,a,b)=>l(x,y,a,b,"arrow");
const frame=()=>r(2,2,389,5,"j1")+r(2,76,389,5,"j1")+r(2,7,5,69,"j2")+r(386,7,5,69,"j2");
const plan=(extra="")=>g(30,110,1.06,r(0,0,393,83,"card")+frame()+extra);
const stairHole=()=>r(36.2296875,8,52.809375,18.9714286,"cutout");
const ribs=()=>[108.075,171.9375,245.625,319.3125].map(x=>r(x-2,7.6,4,67.8,"j1")).join("");
const straps=()=>[61.40625,331.59375].flatMap(x=>[-9,76].map(y=>r(x-6.140625,y,12.28125,16,"strap"))).join("");
// Local edge section: B2 bottom y164 directly meets frame and lower wall top.
const section=(lift=0,band=false)=>r(65,164,16,96,"wall")+r(81,164,40,16,"j1")+
 g(0,-lift,1,r(65,132,165,32,"card")+(lift?"":r(65,70,16,62,"wall")))+
 (band?r(58,114,7,100,"strap"):"");
const mk=(title,parts,action,check,caution,drawing)=>({title,parts,action,check,caution,drawing});
export const steps=[
 mk("辨認無柱版保留件","J1 J2 B2 J10 J11",
 "取消J3接頭塊、J12木棒及J13套管。保留原承托框、托座、上層底肋和四條外側魔術貼翻帶，不新增定位件。",
 "這是上下層拆合專篇，不是全車教程；下層空殼須先做好。",
 "新方案不需定位孔，也不是自動對正的卡榫；圖非1:1紙樣。",
 t(28,38,"保留框、地板及四條翻帶")+plan(straps())+t(28,254,"取消：J3／J12／J13")+t(28,291,"不加新件；不鑽定位孔")),
 mk("把8片框條疊成2毫米","J1 J2",
 "J1裁389 × 5毫米共4片；J2裁69 × 5共4片。同尺寸兩片薄膠疊合壓乾，完成2條J1及2條J2。",
 "每條名義厚2毫米，邊緣齊平；灰卡單層1毫米。",
 "不開棒孔，不把四條框全部疊在一起。",
 t(28,38,"每條：兩片1毫米灰卡")+r(50,85,280,10)+r(50,126,280,10)+arrow(190,154,190,196)+r(50,226,280,20,"j1")+t(28,290,"J1四片＋J2四片＝8裁片")),
 mk("同平面排J1／J2承托框","J1 J2",
 "兩條J2夾在兩條J1端部之間，端部對接，不疊角；在平面及車廂內乾放核對後再固定。",
 "框外389 × 79，內空379 × 69毫米，四邊均厚2。",
 "不是393 × 83毫米的車身外框；不能切錯長邊。",
 t(28,38,"J2夾J1之間；角位不搭疊")+plan()+t(28,254,"外389 × 79；內379 × 69")+t(28,291,"藍J1長框；橙J2短框")),
 mk("做12個L托座及24片角撐","J7 J8",
 "J7側托座10片12.28125 × 17.28125；端托座2片11.8571429 × 17.28125。長向距12.28125摺，留5毫米托翼。每座配兩片J8，直角邊12.28125及5。",
 "J7為薄卡；J8每片單層1毫米灰卡。托翼在上，貼牆面向下。",
 "先試放避門窗，三角撐在托翼下，不能疊到框頂。",
 t(28,38,"J7薄卡摺L；J8兩側各一")+r(45,72,100,173)+l(45,195,145,195,"guide")+t(53,137,"12.28")+t(78,229,"5")+
 l(290,80,290,224)+l(290,80,340,80)+`<polygon points="290,80 340,80 290,203" class="j1"/>`+t(240,270,"翼向內，黏面向下")),
 mk("標承托面與托翼高度","J7 J8 J1 J2",
 "從地面z0量，框頂與牆頂z80.40625，框底z78.40625。J7托翼頂面對框底，直立面向下貼牆，J8在翼下支承。",
 "左右各5托座、前後各1。建議側中心x49.13、127.73、206.33、284.93、358.61；端面y41.5。",
 "遇門窗須移到完整牆面；z不是由下層地板面量。",
 t(28,38,"局部剖面：框頂＝牆頂")+r(65,96,20,150,"wall")+r(85,96,80,20,"j1")+l(85,116,135,116,"glue")+
 ` <polygon points="85,118 135,118 85,240" class="card"/>`+t(215,104,"頂80.40625")+t(215,151,"底78.40625")+t(28,290,"托翼頂在框底，不能墊框頂")),
 mk("固定平整承托框","J1 J2 J7 J8",
 "J1放x2–391、y2–7及76–81；J2放x2–7及386–391、y7–76。先乾放，再薄黏到托座及完整牆內側。",
 "框和牆頂同高，不翹角；四邊外緣內縮2毫米。",
 "承托框不可隨四柱一起取消，也不用厚膠堆填高度。",
 t(28,38,"四條無孔框，固定在托座上")+plan()+t(28,254,"框頂z80.40625，四角同高")+t(28,291,"J3、棒、管全部不安裝")),
 mk("停止鑽定位孔，檢查舊件","J1 B2",
 "新製作J1不開棒孔、B2不開四個管孔。若已開孔而未裝柱管，可留孔乾合；J3已黏而木棒未黏，可留塊不用。",
 "孔周沒有裂、起層或明顯變軟；不需為遮孔在承托面加厚。",
 "木棒已黏牢或管／膠凸出承托面，先停下看實況，不能強拔、撬框或硬壓。",
 t(28,38,"新件不鑽孔；舊件先查狀態")+r(40,100,370,16,"j1")+t(28,167,"J1保留完整平面")+t(28,227,"已黏木棒：不要硬拔")+t(28,284,"先確認實物，再決定修整")),
 mk("B2只開樓梯孔","B2 J5 J6",
 "B2仍393 × 83 × 厚4。樓梯孔x36.2296875–89.0390625、y8–26.9714286。保留原三邊U框，不加第四邊。",
 "J5兩片及J6一片各疊2層；U框只黏B2底，不跨層。",
 "樓梯孔仍要裁；取消的是四個定位套管孔，不是全部開孔。",
 t(28,38,"B2：只裁原樓梯孔")+g(30,110,1.06,r(0,0,393,83)+stairHole())+t(28,254,"孔52.81 × 18.97；起點y8")+t(28,291,"保留底面三邊U框")),
 mk("保留四根豎肋及角撐","J4 J9",
 "J4沿Y長67.8、沿Z高11.053125、沿X厚4。中心x108.075、171.9375、245.625、319.3125；跨y7.6–75.4。每肋兩片J9，避框及U框。",
 "原底肋位置不變；框內空Y69，兩側名義間隙約0.6毫米。",
 "無柱不是任意偏放；不能刪肋求鬆，也不能歪放硬壓。",
 t(28,38,"底面投影：四根豎肋不改")+g(30,110,1.06,r(0,0,393,83)+ribs()+stairHole())+t(28,254,"肋高11.053125；名義側隙0.6")+t(28,291,"保留U框及J9，仍需對齊")),
 mk("對齊外邊，垂直平放","B2 J1 J2",
 "先把四翻帶全部打開，雙手托上層地板，對齊前後外緣及四角，再垂直放到框和牆頂。",
 "不用四孔同時對準，B2底直接坐承托面；不靠樓梯、座椅或扶手承重。",
 "這是目測對齊，不是自動扣正；一角卡住就提起查干涉。",
 t(28,38,"局部剖面：對齊後垂直放下")+section(46)+arrow(260,104,260,161)+t(291,129,"向下")+t(28,290,"先坐平，不急著扣帶")),
 mk("四角坐平，承托面不墊貼","B2 J1 J2",
 "輕按四角確認無明顯搖晃。若框、U框、底肋、凸膠或翹板相撞，整層提起查明後再放。",
 "B2底直接接觸框頂與牆頂，沒有魔術貼厚度造成的層高變化。",
 "不能用翻帶把歪板拉平；不要墊海綿膠或水平魔術貼。",
 t(28,38,"局部剖面：B2底直接接觸框")+section()+t(268,144,"B2厚4")+t(268,188,"框厚2")+t(28,290,"接觸面無墊貼，層高不變")),
 mk("裁四條翻帶及四對魔術貼","J10 J11",
 "J10裁4條12.28125 × 31.01875，末端反摺7.9828125。J11每面12.28125 × 9.2109375，裁4鉤及4毛，配成4對。",
 "反摺後垂直帶長23.0359375；這些是原件，無須新增材料。",
 "不是8對；帶不能兩端永久黏在兩層。",
 t(28,38,"J10四條；J11四鉤＋四毛")+r(65,70,76,190,"strap")+l(65,211,141,211,"guide")+r(83,112,40,58,"j1")+
 t(230,107,"反摺7.98")+t(230,161,"成長23.04")+t(28,298,"每面魔術貼12.28 × 9.21")),
 mk("外側左右各兩條乾貼","J10 J11",
 "兩側均沿x61.40625及331.59375放翻帶。上端固定上層，下端配下層外側魔術貼；先乾貼，外皮乾透後才正式固定。",
 "上固定面約z85.02–94.23；下面約z71.20–80.41。遇窗或裝飾須先找可牢固黏貼的完整外側面。",
 "只跨外側直立面，絕不夾在J1/J2頂與B2底之間。",
 t(28,38,"俯視：左右各2條，非平墊")+plan(straps())+t(28,254,"x61.41與331.59，兩側相同")+t(28,291,"粉紅只示帶位置，不是墊片")),
 mk("先自然落座，再扣對角四帶","J10 J11 B2",
 "坐平後先輕扣一組對角翻帶，再扣另一組，只按合魔術貼，不扯歪上層。最後複查四角。",
 "四帶限制鬆脫及滑移，承托仍靠框與牆頂；不是可提整車的承重吊帶。",
 "搬整車必須托下層底板，不抓車頂或上層懸吊下層。",
 t(28,38,"局部外側剖面：自然落座才扣")+section(0,true)+t(270,120,"外側帶")+t(270,180,"水平面無貼")+t(28,290,"先對角，後其餘；不要拉歪")),
 mk("帶齊內裝做干涉複驗","B2 J4 T1",
 "帶齊牆、104席、樓梯及扶手，再試合。確認樓梯頂能自由穿孔，U框及底肋不撞框，門及可取車頂可動。",
 "樓梯只固定下層，上層孔邊欄杆只固定B2；無跨層的膠、紙或扶手。",
 "任何頂撞先提起排查，不靠更緊的帶遮掩；方案尚未實物試製。",
 t(28,38,"整層複驗，四角不可搖晃")+plan(ribs()+stairHole())+t(28,254,"框／底肋／樓梯各自避位")+t(28,291,"扶手及外皮不能跨層黏死")),
 mk("鬆四帶，垂直提至少12毫米","B2 J10 J11",
 "解開全部4條翻帶，雙手托上層地板，先垂直提至少12毫米，清掉11.053125毫米底肋，再水平移開。",
 "提起的是地板，不是車頂、窗框或扶手；不能未清底肋就側移。",
 "不沿用舊提7毫米的脫柱量，不逐角扭拔。",
 t(28,38,"局部剖面：先垂直提，再移開")+section(65)+arrow(260,166,260,90)+t(295,102,"至少12")+t(28,290,"先鬆全部四帶，雙手托地板")),
 mk("試拆與分層保存","B2 J4 J10 J11",
 "建議帶齊組件試拆20次，逐次看框、牆、翻帶黏底有否鬆、裂或翹。取下上層放至少12毫米高邊緣墊塊，避開底肋。",
 "膠層及檯面誤差大時用更高整毫米墊塊；新製作全車灰卡174片，結構內裝663件含F11。",
 "20次只是基本試作，不是耐久或強度認證；不倒轉、不載重。",
 t(28,38,"上層邊緣墊高，避開底肋")+r(60,110,350,20)+r(70,130,30,96,"j2")+r(370,130,30,96,"j2")+r(222,130,18,88,"j1")+
 l(40,227,430,227)+t(28,278,"邊墊至少12，底肋不碰檯")+t(28,310,"20次試拆 ≠ 強度認證"))
];
assert.equal(steps.length,17);
assert.equal(spec.minimumVerticalLiftMm,12);
assert.equal(5+69+5,79);
const styles=`svg{background:#fffdf7;color:#202a2c;font-family:'Noto Sans TC',sans-serif}text{font-size:19px;fill:#202a2c;font-weight:600}.card{fill:#eeece6;stroke:#515b5f;stroke-width:1.2}.wall{fill:#d4c494;stroke:#777468;stroke-width:1.2}.cutout{fill:#fffdf7;stroke:#515b5f;stroke-dasharray:3 2}.j1{fill:#b9d6e9;stroke:#215c86;stroke-width:1.4}.j2{fill:#f4d3ab;stroke:#97521a;stroke-width:1.4}.strap{fill:#edcadb;stroke:#a33e70;stroke-width:1.4}.outline{stroke:#515b5f;stroke-width:1.5;fill:none}.guide{stroke:#515b5f;stroke-width:1.2;stroke-dasharray:5 5;fill:none}.glue{stroke:#b12626;stroke-width:3;fill:none}.arrow{stroke:#25643c;stroke-width:3;fill:none;marker-end:url(#arr)}`;
fs.mkdirSync(new URL("tutorial-393/",root),{recursive:true});
const images=steps.map((s,i)=>{
 const name=`tutorial-393/step-${String(i+1).padStart(2,"0")}.svg`;
 fs.writeFileSync(new URL(name,root),`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 330" role="img" aria-labelledby="title desc"><title id="title">${i+1}：${s.title}</title><desc id="desc">${s.action} ${s.check}</desc><style>${styles}</style><defs><marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#25643c"/></marker></defs>${s.drawing}</svg>`);
 return name;
});
const toc=steps.map((s,i)=>`<a href="#step-${i+1}"><span>${String(i+1).padStart(2,"0")}</span>${s.title}</a>`).join("");
const body=steps.map((s,i)=>`<section class="tutorial-step" id="step-${i+1}"><div class="step-text"><p class="step-count">步驟 ${String(i+1).padStart(2,"0")} / 17 · ${s.parts}</p><h2>${s.title}</h2><p>${s.action}</p><p class="check"><strong>完成後檢查：</strong>${s.check}</p><p class="caution"><strong>注意：</strong>${s.caution}</p></div><figure><img src="${images[i]}" width="480" height="330" alt="無柱步驟${i+1}：${s.title}" ${i?'loading="lazy"':""}><figcaption>圖 ${String(i+1).padStart(2,"0")} · 安裝示意，非1:1紙樣；局部比例放大。</figcaption></figure></section>`).join("");
fs.writeFileSync(new URL("frame-tutorial-393.html",root),`<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>HK-104 39.3厘米｜無柱承托框17步教程</title><meta name="description" content="取消四柱、套管及定位孔，保留承托框與四條外側魔術貼翻帶；17步無柱拆合安裝圖。"><link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet"><link href="tutorial-base-393.css" rel="stylesheet"><link href="frame-tutorial-393.css" rel="stylesheet"></head><body><a class="skip" href="#steps">跳至拼裝步驟</a><header><a href="index.html">HK–104 ／ 無柱接合</a><button id="tutorial-print" type="button">列印圖文教程</button></header><main><section class="intro"><p class="eyebrow">393 × 83 MM · NO-POST R1 · 17 STEPS</p><h1>無柱承托框<br>平放、扣帶、自由拆合</h1><p class="lead">17步，17張新圖。取消木棒、套管與定位孔，保留J1/J2框及四條外側翻帶，不新增零件。</p><p>本篇只教上下層拆合，車身104席、樓梯及高度不變。高度倍率0.9825仍是工作假設，未經實物試製；無柱不是自動定位，仍須乾合避開底肋。</p><nav class="related"><a href="bus-tutorial-393.html">全車42步無柱教程</a><a href="checklist.html">無柱／樓梯清單</a><a href="revision-393.html">全部零件尺寸</a><a href="no-post-revision/HK-104-39.3cm-無柱拆合修訂.md">無柱修訂原文</a></nav></section><details class="contents"><summary>備料、圖例與17步目錄</summary><p class="legend">藍：J1長框；橙：J2短框；粉紅：外側翻帶。水平承托面不夾魔術貼；不以翻帶拉平歪框。</p><p class="scope">本篇框及托座：框8片灰卡＋J8共24片＝32片1毫米灰卡；另J7薄卡12片，不含B2及底肋等其餘全車件。全車新製作灰卡174片／65完成件，結構內裝663件含可選F11，不含外皮及人仔。</p><nav aria-label="教程步驟">${toc}</nav></details><article id="steps">${body}</article><footer><p>2026-10-23 無柱版。原網址保留，四柱步驟已由本教程取代；原裁切紙樣及PDF不改。已黏牢木棒先確認實況，不可強拔。</p><a href="bus-tutorial-393.html">返回全車42步教程</a></footer></main><script>document.getElementById('tutorial-print').addEventListener('click',()=>window.print())</script></body></html>`);
fs.writeFileSync(new URL("tutorial-393/manifest.json",root),JSON.stringify({version:spec.version,steps:steps.map((s,i)=>({step:i+1,title:s.title,parts:s.parts.split(" "),image:images[i]}))},null,2));
console.log("Built no-post frame: 17 steps / 17 diagrams.");
