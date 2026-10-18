import fs from "node:fs";
export const data=JSON.parse(fs.readFileSync(new URL("HK-104-39.3cm-尺寸核算.json",import.meta.url),"utf8"));
const {basis,stair,hole,stairPos,posts}=data;
const rect=(x,y,w,h,c="paper")=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" class="${c}"/>`;
const line=(x,y,a,b,c="edge")=>`<line x1="${x}" y1="${y}" x2="${a}" y2="${b}" class="${c}"/>`;
const text=(x,y,s,c="label")=>`<text x="${x}" y="${y}" class="${c}">${s}</text>`;
const poly=(p,c="part")=>`<polygon points="${p.map(a=>a.join(",")).join(" ")}" class="${c}"/>`;
const group=(x,y,s,k=1)=>`<g transform="translate(${x} ${y}) scale(${k})">${s}</g>`;
const arrow=(x,y,a,b)=>line(x,y,a,b,"move")+poly([[a,b],[a-7,b+(b<y?10:-10)],[a+7,b+(b<y?10:-10)]],"arrowhead");
const f=n=>n.toFixed(2);
function figure(title,body,caption,parts){
 return `<figure class="part-figure" data-parts="${parts}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 280" role="img" aria-label="${title}"><title>${title}</title>${body}</svg><figcaption><h3>${title}</h3><p>${caption}</p></figcaption></figure>`;
}
const frame=()=>rect(2,2,389,5,"support")+rect(2,76,389,5,"support")+rect(2,7,5,69,"support")+rect(386,7,5,69,"support");
const points=()=>posts.xs.map(x=>posts.ys.map(y=>`<circle cx="${x}" cy="${y}" r="3" class="pin"/>`).join("")).join("");
function floorPlan(){
 return text(24,34,"393 × 83；前端x0在左")+group(28,86,rect(0,0,basis.length,basis.width)+frame()+points(),.86)
  +text(24,198,"x：12.28125／388")+text(24,227,"y：5／78")+text(24,255,"J1／J2頂面 z80.40625","muted");
}
function blocksPlan(){
 let s=text(24,34,"J3前／後塊：孔位不同");
 for(const [x,label,offset]of [[26,"前塊",6.140625],[220,"後塊",9.28125]]){
  s+=text(x,72,label)+rect(x,92,12.28125*12,6*12,"part");
  s+=`<circle cx="${x+offset*12}" cy="128" r="15" class="hole"/>`;
  s+=text(x,204,`距前邊 ${f(offset)}`)+text(x,235,offset>8?"距後邊 3":"長向居中","muted");
 }
 return s;
}
function lowerJoint(withPin=true){
 const k=8,cx=130;
 let s=rect(60,126,59.6,16,"support")+rect(140.4,126,69.6,16,"support");
 s+=rect(cx-12.28125*k/2,142,12.28125*k,72,"part")+rect(119.6,142,20.8,56,"hole");
 if(withPin)s+=rect(120,86,20,112,"pin");
 return s;
}
function upperJoint(lift=0){
 return group(0,-lift,rect(50,94,63.6,32)+rect(146.4,94,83.6,32)
  +rect(114,76,4.8,50,"tube")+rect(141.2,76,4.8,50,"tube"));
}
const section=(lift=0)=>lowerJoint()+upperJoint(lift);
const sectionLabels=()=>text(250,93,"管長6.25")+text(250,123,"B2厚4")+text(250,151,"框厚2")+text(250,192,"J3高9");

function stairProfile(){
 const pts=[[0,0]];
 for(let k=0;k<12;k++)pts.push([k*stair.tread,(k+1)*stair.riser],[(k+1)*stair.tread,(k+1)*stair.riser]);
 pts.push([stair.run,0]);
 // Foot at right, head at left; preserve the material BELOW the treads.
 const drawn=pts.map(([u,v])=>[344-u*4.5,224-v*2.35]);
 return text(24,34,"T1 ×2：先升、後踏")+poly(drawn,"stair-black")
  +line(28,224,367,224,"guide")+text(24,67,"前／梯頂")+text(249,258,"梯腳／後")
  +text(24,177,"65.41")+text(125,258,"進深51.58")
  +text(24,110,"12級","muted");
}
function stairNet(){
 let s=text(24,34,"T2：15.41 × 116.99")+text(24,70,"由左邊梯腳起，先升後踏");
 const k=2.8,x=35,y=100;
 s+=rect(x,y,stair.unfolded*k,stair.width*k,"stair-black");
 for(let n=0;n<12;n++){
  const riseAt=(n*(stair.riser+stair.tread)+stair.riser)*k;
  s+=line(x+riseAt,y,x+riseAt,y+stair.width*k,"light-fold");
  if(n<11){const treadAt=(n+1)*(stair.riser+stair.tread)*k;s+=line(x+treadAt,y,x+treadAt,y+stair.width*k,"light-fold");}
 }
 return s+text(24,194,"23條摺線；末端不再摺")+text(24,225,"每升5.450520833")+text(24,254,"每踏4.2984375");
}
function stairPlan(){
 let s=rect(25,0,90,2,"part")+rect(25,2,90,5,"support")
  +rect(hole.x,hole.y,hole.l,hole.w,"hole");
 s+=rect(30.0890625,8,6.140625,hole.w,"support")+rect(hole.x+hole.l,8,6.140625,hole.w,"support")
  +rect(30.0890625,8+hole.w,65.090625,5.9285714,"support")
  +rect(stairPos.x,stairPos.y,stair.run,stair.width,"stair-black")
  +rect(106.075,7.6,4,32.4,"support");
 s=group(-62,80,s,3.5);
 return text(24,34,"梯孔及U框局部俯視")+text(24,67,"右牆／側承托 y0–7","muted")+s
  +text(24,247,"孔起y8；梯身起y9.7786");
}
function stand(){
 return text(24,34,"邊緣墊塊至少12高")+rect(40,80,310,14)+rect(58,94,30,96,"support")
  +rect(302,94,30,96,"support")+rect(135,94,16,11.053125*8,"part")+rect(237,94,16,11.053125*8,"part")
  +line(24,190,376,190,"guide")+text(24,234,"豎裝肋高11.053125")+text(24,260,"墊塊避開肋；不靠肋承托","muted");
}
export const jointFigures=[
 figure("共用四個新中心",floorPlan(),"以車頭及右側外緣為共同基準。紅點是中心，不是孔徑；B2翻面後仍按共同俯視座標轉印。","B2 J1 J2 J3 J12 J13"),
 figure("疊9層：上7孔、下2實",text(24,34,"J3：12.28125 × 6 × 9")+rect(132,72,98,126,"part")+rect(170,72,22,98,"hole")
  +line(132,170,230,170,"fold")+text(250,115,"上7開孔")+text(250,191,"下2封底")+text(24,245,"塊頂貼框底，不與框同高"),
  "每塊9片1毫米灰卡。由塊頂量孔深7，由框頂量合計9；底2層封底。前後塊孔偏置不同，詳見定位圖及清單。","J3 J1 J2"),
 figure("木棒：7＋2＋5＝14",text(24,34,"J12：Ø約2.5，長14")+lowerJoint()+text(250,91,"露出5")+text(250,141,"穿框2")+text(250,189,"入塊7")
  +text(24,255,"棒底標7及9，分別對應塊／框頂"),
  "棒底端入J3深7，穿過2毫米框後外露5。只薄黏入塊段；外露段、管內無膠。","J3 J12 J1"),
 figure("管穿4毫米B2，上露2.25",text(24,34,"J13：內Ø2.8／外Ø4")+upperJoint()+text(250,92,"上露2.25")+text(250,125,"藏入4")
  +text(24,204,"管長6.25；底端齊B2底")+text(24,240,"B2試孔Ø4.1，緊才微修"),
  "四段套管均長6.25。先按實物配Ø4.1左右的孔；不要把管底凸出B2下方。完整上層側牆不用削薄。","B2 J13 B5"),
 figure("四管同時對位乾合",text(24,34,"保持水平，不逐角硬壓")+section(40)+arrow(330,70,330,125)
  +text(24,255,"落座面是框頂與牆頂"),
  "四棒同時入四管，自然落座。帶上完整側牆及後排椅核對空隙；有頂撞先提起排查，不能靠鎖帶拉合。","B2 J1 J2 J3 J12 J13 B5"),
 figure("取下B2，只黏管外",text(24,34,"膠只在套管外與B2之間")+section()+line(113,98,113,121,"glue")+line(147,98,147,121,"glue")
  +text(250,92,"管內無膠")+text(250,155,"棒不黏管")+text(24,255,"紅色棒是零件，紅短線才是膠"),
  "乾合標記管高後取下B2固定管外。避免膠流入管口或跨到下層；按膠水指引乾透再試合。","B2 J13 J12"),
 figure("落座剖面：棒尖留1.25",text(24,34,"6.25管長－5插入＝1.25")+section()+sectionLabels()+text(24,255,"B2底＝框頂；J3頂＝框底"),
  "圖中1.25是管內軸向餘量，不是上下層之間的空隙。B2必須落在框及牆頂；J3位於框下，不能把塊與框畫成重疊的實體。","B2 J1 J3 J12 J13"),
 figure("解四帶，垂直提至少7",text(24,34,"雙手托底，不抓車頂")+section(60)+arrow(330,123,330,62)+text(24,255,"四棒離管後再移開上層"),
  "先解開全部4帶，均勻垂直提至少7。上層改放至少12毫米高邊緣墊塊；完整組件反覆試拆20次。","B2 J10 J11 J12 J13")
];
export const stageFigures={
 "stage-1":[figure("完整層數，不磨小數厚度",text(24,34,"1毫米灰卡 × 完整層數")
  +rect(35,89,145,32,"paper")+rect(35,121,145,16,"support")+rect(35,137,145,72,"part")
  +text(215,112,"地板4層")+text(215,139,"承托2層")+text(215,187,"接頭塊9層")+text(24,254,"三種零件示意；不是一起黏死"),
  "B1／B2各4毫米，承托框2毫米，J3高9毫米；灰卡厚度用完整1毫米層數，平面長闊及孔位仍可有小數。","B1 B2 J1 J2 J3")],
 "stage-2":[figure("內嵌承托與新中心",floorPlan(),"J1兩條389×5，J2兩條69×5；均厚2。四柱向內並向後改位，不再按舊B5避位加工。","J1 J2 B2"),figure("後塊孔不能居中",blocksPlan(),"前塊孔距前短邊6.140625，後塊孔距前短邊9.28125、距後短邊3；寬向均距近側3。","J3 J12")],
 "stage-3":jointFigures,
 "stage-4":[figure("兩片黑色側板對合",stairProfile(),"12次先升、後踏；保留階梯下方材料。局部u由右側梯腳朝左側梯頂，與T2次序相同；圖不是1:1紙樣。","T1 T2"),figure("風琴條的23條摺線",stairNet(),"兩種長度交替內外摺。第12次踏完就是紙條末端，不再增加摺線；T8另做，不從淨長扣掉。","T1 T2 T8")],
 "stage-5":[figure("梯孔向內移，U框三邊",stairPlan(),"黑色為梯身平面，灰色為U框／側承托及右方第一橫肋局部。梯孔y8起，框y2–7，右側不補第4條。","B2 J1 J4 J5 J6 T1"),figure("上下扶手各屬一層",stairProfile()+line(108,47,344,202,"move"),"T3斜扶手長83.2982766，共2段；T4下層柱8段。T5–T7只固定上層，欄杆不跨拆合縫，出口不封死。","T3 T4 T5 T6 T7")],
 "stage-6":[figure("收納時不壓底肋",stand(),"J4豎裝：沿Y長67.8、沿Z高11.053125、沿X厚4。12毫米邊緣墊塊名義多約0.95毫米，膠層及檯面誤差大時再提高。","B2 J4")]
};
