const R=(x,y,w,h,c="cut")=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" class="${c}"/>`;
const L=(a,b,c,d,k="cut")=>`<line x1="${a}" y1="${b}" x2="${c}" y2="${d}" class="${k}"/>`;
const T=(x,y,s,k="",anchor="start")=>`<text x="${x}" y="${y}" class="${k}" text-anchor="${anchor}">${s}</text>`;
const C=(x,y,r,k="cut")=>`<circle cx="${x}" cy="${y}" r="${r}" class="${k}"/>`;
const P=(pts,k="cut")=>`<polygon points="${pts.map(p=>p.join(",")).join(" ")}" class="${k}"/>`;
const D=(x,y,w,label)=>L(x,y,x+w,y,"dim")+L(x,y-1,x,y+1,"dim")+L(x+w,y-1,x+w,y+1,"dim")+T(x+w/2,y-2,label,"small","middle");
const G=(x,y,s)=>`<g transform="translate(${x} ${y})">${s}</g>`;
const pages=[],parts=[];
function part(id,name,size,raw,finished,material){parts.push({id,name,size,raw,finished,material});}
function pg(group,title,sub,body,ids=[]){
const n=pages.length+1;
let ruler="";for(let i=0;i<10;i++)ruler+=`<rect x="${10+i*10}" y="182" width="10" height="2" fill="${i%2?"#fff":"#222"}" stroke="#222" stroke-width=".15"/>`;
ruler+=T(10,179,"0")+T(110,179,"100 mm","","end")+R(119,176,10,10)+T(136,181,"方格10×10；列印100%，實測後才裁。","small")+T(265,184,`P${String(n).padStart(2,"0")}`,"small","end");
pages.push({group,title,ids,n,body:`${T(7,9,title,"head")}${T(7,17,sub,"small")}${body}${ruler}`});
}
function marks(x,y,len=2){return L(x-len,y,x+len,y,"guide")+L(x,y-len,x,y+len,"guide");}
function tiled(group,id,name,len,h,raw,finished,material,inside="",note=""){
part(id,name,`${len}×${h}`,raw,finished,material);
for(let i=0;i<Math.ceil((len-10)/250);i++){
const start=i*250, end=Math.min(start+260,len), w=end-start;
let lines="";
if(start>0)lines+=L(0,-2,0,h+2,"guide")+L(10,-2,10,h+2,"guide");
if(end<len)lines+=L(250,-2,250,h+2,"guide")+L(260,-2,260,h+2,"guide");
const uid=`tile-${id}-${i}`;
const clipped=`<defs><clipPath id="${uid}"><rect x="0" y="-2" width="${w}" height="${h+4}"/></clipPath></defs><g clip-path="url(#${uid})">${G(-start,0,R(0,0,len,h)+inside)}</g>`;
let s=G(10,29,clipped+lines);
s+=D(10,26,w,`本頁x=${start}–${end}；整件長${len}`)+T(10,Math.min(174,29+h+8),note||"先拼紙樣再描整件；分頁邊界／重疊導線不是硬卡裁線。","small");
if(start>0)s+=G(10,29+h/2,marks(5,0));
if(end<len)s+=G(10,29+h/2,marks(255,0));
pg(group,`${id} ${name} · 拼頁${i+1}/${Math.ceil((len-10)/250)}`,`高／寬${h}mm｜裁片${raw}｜完成${finished}｜${material}｜相鄰頁重疊10mm`,s,[id]);
}
}
function plate(x,y,id,name,w,h,extra="",note=""){
return T(x,y-9,`${id} ${name}`)+T(x,y-3,`${w}×${h} mm`,"small")+G(x,y,R(0,0,w,h)+extra)+D(x,y+h+6,w,String(w))+ (note?T(x,y+h+13,note,"small"):"");
}
const cuts=[];
// Floors: all upper laminate layers share the hole positions.
tiled("body","B1","下層地板",640,140,"4","1／厚6","灰卡1.5×4層");
let upper=R(59,10,86,32,"window");
for(const x of [20,620])for(const y of [5,135])upper+=C(x,y,3.15,"guide")+marks(x,y,2);
upper+=T(150,23,"梯孔86×32；靠右側")+T(150,34,"孔x59–145、y10–42")+T(150,49,"4管孔先只畫中心")+T(150,60,"Ø6.3僅供外徑6套管試做");
tiled("body","B2","上層地板",640,140,"4","1／厚6","灰卡1.5×4層",upper,"梯孔實線裁掉；管孔虛圓先試管外徑再開，不能直接猜直徑。");
function lowerWall(left){
let a=R(65,25,79,50,"window");
for(let r=0;r<8;r++)a+=R(160+55*r,25,48,50,"window");
a+=R(600,25,28,50,"window");
a+=left?R(12,20,40,80,"window"):R(12,25,40,50,"window");
a+=T(175,89,"窗48×50，起點160＋55r")+T(350,89,"h由牆底量；上方為牆頂");
return a;
}
tiled("body","B3","下層左側牆／前門洞",640,100,"2","1／厚3","灰卡1.5×2層",lowerWall(true),"左側前門洞40×80：x12–52，由底邊開口；其他窗口皆裁空。");
tiled("body","B4","下層右側牆／司機窗",640,100,"2","1／厚3","灰卡1.5×2層",lowerWall(false),"右側前窗40×50；兩層卡先裁窗口，透明片夾在兩層之間。");
let uw=R(12,18,130,48,"window");
for(let r=0;r<15;r++)uw+=R(150+32*r,18,26,48,"window");
uw+=T(155,80,"窗26×48；起點150＋32r；窗柱6");
tiled("body","B5","上層側牆／左右同版",640,86,"4","2／各厚3","灰卡1.5×2層×2側",uw);
tiled("body","B10","可取下車頂",640,140,"2","1／厚3","灰卡1.5×2層");
const endPanels=[];
for(const [id,name,h,opening]of [
["B6","下層前牆",100,R(15,24,104,52,"window")],
["B7","下層後牆",100,R(25,32,84,35,"ref")+T(30,52,"貼格柵，不開洞")],
["B8","上層前牆",86,R(15,18,104,48,"window")],
["B9","上層後牆",86,R(23,22,88,40,"window")]
]){
part(id,name,`134×${h}`,"2","1／厚3","灰卡1.5×2");
endPanels.push({id,name,h,opening});
}
for(let i=0;i<2;i++){
const a=endPanels.slice(i*2,i*2+2);
const s=a.map((p,j)=>G(15+j*135,29,T(0,-5,`${p.id} ${p.name} 134×${p.h}`)+`<g transform="translate(0 134) rotate(-90)">${R(0,0,134,p.h)+p.opening}</g>`)+D(15+j*135,170,p.h,`原高${p.h}／裁2`)).join("");
pg("body",`${a[0].id}／${a[1].id} ${i?"上":"下"}層前後端牆`,`兩件各裁2片疊成厚3；為排版旋轉90°，沒有縮放。原寬134。`,s,a.map(p=>p.id));
}
part("B11","活動門片","39×79","2","1／厚約3","灰卡1.5×2");
part("B12","下層支腳底片","20×20","64（4腳×16）","4／高24","灰卡1.5×16層");
pg("body","B11／B12 活動門與底腳","門開向車身外側；支腳高度量成品調整，底面與輪底同高。",plate(15,39,"B11","門片",39,79,R(6,20,27,45,"window"),"窗27×45；鉸鏈用布膠帶")+plate(100,39,"B12","支腳母片",20,20,"","每腳16片，成高24"),["B11","B12"]);
// Full-height original joints, with no paper-corner simplification.
part("J1","側承托條","640×8","4","2／各厚3","灰卡1.5×2層×2側");
part("R1","車頂定位裙邊長條","628×8","2","2","薄卡");
for(let i=0;i<3;i++){
const start=i*250;
let s="";
for(const [j,p]of [["J1","側承托640×8，灰卡裁4"],["R1","車頂長裙邊628×8，薄卡裁2"]].entries()){
const len=j?628:640,w=Math.min(260,len-start),uid=`strip-${p[0]}-${i}`,yy=38+j*55;
s+=T(10,yy-7,`${p[0]} ${p[1]}；本頁x=${start}–${start+w}`)+
`<defs><clipPath id="${uid}"><rect x="0" y="-2" width="${w}" height="12"/></clipPath></defs>`+
G(10,yy,`<g clip-path="url(#${uid})">${G(-start,0,R(0,0,len,8))}</g>`+
(i?L(10,-2,10,10,"guide")+marks(5,4):"")+
(i<2?L(250,-2,250,10,"guide")+marks(255,4):""));
}
s+=T(10,151,"共3頁：相鄰重疊10。先拼完整長條母版，紙樣分頁線不是硬卡切線。","small");
pg("body joint",`J1／R1 兩種長條拼頁${i+1}/3`,"每一條全長都要拼三頁；不可把628裙邊當成640承托條。",s,["J1","R1"]);
}
for(const a of [
["J2","端承托條",124,8,"4","2／各厚3","灰卡1.5×2"],
["J4","上層底橫肋",122,18,"16","4／各厚6","灰卡1.5×4"],
["J5","梯孔U框兩側",10,32,"4","2／各厚3","灰卡1.5×2"],
["J6","梯孔U框左邊",106,10,"2","1／厚3","灰卡1.5×2"]
])part(a[0],a[1],`${a[2]}×${a[3]}`,a[4],a[5],a[6]);
part("R2","車頂裙邊短條","128×8","2","2","薄卡");
pg("body joint","J2／J4／R2 短承托、横肋與短裙邊","J2裁4片，J4裁16片；灰卡1.5mm。R2薄卡裁2條。",plate(15,40,"J2","端承托",124,8,"","完成2條、厚3")+plate(15,100,"J4","橫肋",122,18,"","完成4條、厚6")+plate(15,145,"R2","短裙邊",128,8,"","薄卡裁2"),["J2","J4","R2"]);
let us=R(49,10,10,32)+R(145,10,10,32)+R(49,42,106,10)+R(59,10,86,32,"guide");
pg("joint","J5／J6 梯孔底三邊U形補強","只黏上層底；不設y0–10的右側條，避免撞下層承托框。",plate(15,40,"J5","前／後側條",10,32,"","裁4片，完成2條")+plate(65,40,"J6","左側横條",106,10,"","裁2片，完成1條")+G(40,98,us)+T(90,164,"裝配示意：x49–155、y10–52；右側開口","small"),["J5","J6"]);
part("J3","插柱補強塊層片","20×10；成塊20高","52–56；實測疊層","4塊／約20×10×20","灰卡1.5，頂z130");
part("J7","承托L形托座","20×28＝20竪面＋8橫面","12","12","薄卡");
part("J8","托座三角撐","直角邊20×8","24","24","灰卡1.5");
part("J9","橫肋角撐","直角邊18×18","8","8","灰卡1.5");
pg("joint","J3／J7／J8／J9 接頭補強母片","J3上部約18深盲孔、底部留實；J7兩側各5、前後各1，須試黏承重。",
plate(15,40,"J3","層片",20,10,C(10,5,2.1,"guide")+marks(10,5),"4.2孔僅試做；底層不開孔")+
plate(110,40,"J7","L托座",20,28,R(0,0,20,20,"glue")+L(0,20,20,20,"fold"),"20黏牆，8承托橫條")+
G(15,112,T(0,-8,"J8 托座三角撐 20×8")+P([[0,0],[8,0],[0,20]]))+G(112,112,T(0,-8,"J9 橫肋三角撐 18×18")+P([[0,0],[18,0],[0,18]]))+
T(15,154,"三角撐用膠帶／白膠固定；J3以實際厚度疊約20高，不能只憑層數。","small"),["J3","J7","J8","J9"]);
part("J10","纖維鎖帶","20×50；反摺13","4","4／垂直37","纖維膠帶");
part("J11","魔術貼","20×15","8單面＝4配對","4組","4鉤面＋4毛面");
part("J12","定位木棒","Ø約4×長26","4","4；埋18露8","木棒，不裁卡代替");
part("J13","定位套管","外Ø約6／內Ø4.5–5×長10","4","4","飲管，先試插");
pg("joint","J10–J13 鎖帶及管／棒切長","木棒及飲管要實物切長；尺寸母線不是卡紙棒。先試1接頭。",
plate(15,39,"J10","鎖帶",20,50,R(0,0,20,15,"glue")+L(0,15,20,15,"guide")+L(0,37,20,37,"fold"),"上15固定；末13反摺")+
plate(85,39,"J11","魔術貼",20,15,"","4鉤面＋4毛面")+
G(155,39,T(0,-9,"J12 棒長26")+R(0,0,26,4,"guide")+L(18,0,18,4,"guide")+D(0,12,26,"26")+T(0,23,"埋18／露8","small"))+
G(155,103,T(0,-9,"J13 管長10")+R(0,0,10,6,"guide")+D(0,13,10,"10")+T(0,25,"按實物外徑開地板孔","small")),["J10","J11","J12","J13"]);
// Roof skirts share the correctly sized long-strip and short-strip pages above.
// Seats: one master per type, not 52 copies.
for(const [id,n,w,h,raw,finish,mat]of [
["S1","雙人座面背板",47,55,"52","52","薄卡"],
["S2","雙人Z座底",47,40,"52","52","薄卡"],
["S3","雙人座側板",26,21,"104","104","薄卡"],
["S4","雙人座背板角撐",6,6,"104","104","薄／硬卡"],
["D1","司機座面背板",22,55,"1","1","薄卡"],
["D2","司機Z座底",22,40,"1","1","薄卡"],
["D3","司機座側板",26,21,"2","2","薄卡"],
["D4","司機背板角撐",6,6,"2","2","薄／硬卡"]
])part(id,n,`${w}×${h}${id.endsWith("4")?"直角三角":""}`,raw,finish,mat);
const seatFace=(w)=>R(0,50,w,5,"glue")+L(0,26,w,26,"fold")+L(0,50,w,50,"fold")+(w===47?L(22,0,22,50,"guide")+L(25,0,25,50,"guide"):"");
const zbase=(w)=>R(0,0,w,12,"glue")+R(0,28,w,12,"glue")+L(0,12,w,12,"fold")+L(0,28,w,28,"fold");
pg("seat","S1–S4 雙人座原尺寸母版","上層32模組＋下層20模組；S1／S2各52，S3／S4各104。司機另見下一頁。",
plate(15,39,"S1","座面背板",47,55,seatFace(47),"26座面／24背板／5補強")+
plate(98,39,"S2","Z座底",47,40,zbase(47),"12上翼／16支承／12底翼")+
plate(190,39,"S3","側板",26,21,R(0,16,26,5,"glue")+L(0,16,26,16,"fold"),"16高／5底翼")+
G(190,119,T(0,-8,"S4 三角角撐6×6")+P([[0,0],[6,0],[0,6]]))+
T(15,151,"中間22／3／22為分席參考，不剪開；先做1模組確認座面高16、總高40。","small"),["S1","S2","S3","S4"]);
pg("seat","D1–D4 司機單人椅母版","司機椅另計1席，不佔上層64／下層40。",
plate(15,39,"D1","單人背板",22,55,seatFace(22),"26座面／24背板／5補強")+
plate(89,39,"D2","Z座底",22,40,zbase(22),"12＋16＋12")+
plate(161,39,"D3","側板",26,21,R(0,16,26,5,"glue")+L(0,16,26,16,"fold"),"2片")+
G(161,119,T(0,-8,"D4 三角6×6，2片")+P([[0,0],[6,0],[0,6]])),["D1","D2","D3","D4"]);
part("T1","樓梯鋸齒側板","外接84×106，12級","2","2","薄／硬卡");
part("T2","12級風琴踏步","26×190","1","1；梯84×26×106","薄卡");
let stairPts=[[0,0]];for(let n=0;n<12;n++)stairPts.push([(n+1)*7,n*106/12],[(n+1)*7,(n+1)*106/12]);stairPts.push([0,106]);
let wind="";
for(let n=0;n<12;n++){const p=n*(106/12+7);wind+=L(p+106/12,0,p+106/12,26,"fold");if(n<11)wind+=L(p+106/12+7,0,p+106/12+7,26,"fold");}
pg("stair","T1／T2 12級立體樓梯","T1剪2片相同側板；T2从梯腳起豎106÷12、踏7交替摺，總長190。",
G(15,31,T(0,-5,"T1 側板1／2")+P(stairPts))+G(117,31,T(0,-5,"T1 側板2／2")+P(stairPts))+
G(15,147,T(0,-5,"T2 190×26：交替內／外摺，按側板對合")+R(0,0,190,26)+wind),["T1","T2"]);
for(const a of [
["T3","下層梯斜扶手",135.3,"2"],["T4","下層梯立柱",25,"8"],["T5","上層孔長欄杆",86,"2"],["T6","上層孔短欄杆",32,"1"],["T7","上層圍欄立柱",25,"6"],["F6","方向盤短柱",12,"1"],["F7","一般扶手柱",60,"16"]
])part(a[0],a[1],`幼管Ø約2×長${a[2]}`,a[3],a[3],"幼飲管／紙卷，切長圖");
part("T8","樓梯底固定L翼","26×10＝5＋5","4","4","薄卡，只黏下層");
let rails="";
for(const [i,a]of [["T3",135.3,"2"],["T4",25,"8"],["T5",86,"2"],["T6",32,"1"],["T7",25,"6"],["F6",12,"1"],["F7",60,"16"]].entries()){
const xx=i<4?15:165, yy=37+(i<4?i:i-4)*32;
rails+=T(xx,yy-5,`${a[0]} 長${a[1]} ×${a[2]}根`)+R(xx,yy,a[1],2,"guide")+D(xx,yy+9,a[1],String(a[1]));
}
rails+=plate(165,141,"T8","梯底L翼",26,10,R(0,0,26,5,"glue")+L(0,5,26,5,"fold"),"4片；不黏上層");
pg("stair","T3–T8／F6–F7 扶手、欄杆及短柱切長","幼管約Ø2；斜欄長約135.3＝√(84²＋106²)。扶手只固定所屬樓層。",rails,["T3","T4","T5","T6","T7","T8","F6","F7"]);
// Closed thin-card box nets: four side faces, two lids, three top/bottom gluing flaps.
function boxNet(w,d,h){
const xs=[0,w,w+d,2*w+d,2*(w+d)], widths=[w,d,w,d],g=5,f=4,total=2*(w+d);
let s=R(total,0,g,h,"glue");
for(let i=1;i<4;i++)s+=R(xs[i],-f,widths[i],f,"glue")+R(xs[i],h,widths[i],f,"glue");
const pts=[[0,-d],[w,-d],[w,-f],[total,-f],[total,0],[total+g,0],[total+g,h],[total,h],[total,h+f],[w,h+f],[w,h+d],[0,h+d]];
s+=P(pts);
for(let i=0;i<4;i++)s+=L(xs[i],0,xs[i]+widths[i],0,"fold")+L(xs[i],h,xs[i]+widths[i],h,"fold");
for(let i=1;i<5;i++)s+=L(xs[i],0,xs[i],h,"fold");
for(let i=1;i<4;i++)s+=L(xs[i],-f,xs[i],0)+L(xs[i],h,xs[i],h+f);
for(let i=0;i<4;i++)s+=T(xs[i]+widths[i]/2,h/2,`${widths[i]}×${h}`,"small","middle");
return {s,width:total+g,height:h+2*d};
}
for(const a of [
["F1","收費器",14,16,28],["F2","後設備箱",110,26,35],["F3","司機儀表台",28,10,10]
]){
const [id,name,w,d,h]=a,net=boxNet(w,d,h);
part(id,name,`展開${net.width}×${net.height}；成${w}×${d}×${h}`,"1","1","薄卡；含5接縫翼");
if(net.width<=257)pg("facility",`${id} ${name}立體盒展開`,`成品${w}×${d}×${h}；灰區黏合翼，紅虛線摺。薄卡紙厚會帶來細微誤差。`,G(15,35+d,net.s)+D(15,35+net.height+6,net.width,`展開寬${net.width}`)+T(15,Math.min(166,35+net.height+18),"先摺四側，再黏側接縫；最後黏上／下蓋。","small"),[id]);
else for(let i=0;i<2;i++){
const start=i*240,end=Math.min(start+250,net.width),uid=`box-${id}-${i}`;
pg("facility",`${id} ${name}展開拼頁${i+1}/2`,`全展開${net.width}×${net.height}；紙樣x=${start}–${end}，相鄰重疊10。完成${w}×${d}×${h}。`,
`<defs><clipPath id="${uid}"><rect x="0" y="${-d}" width="${end-start}" height="${net.height}"/></clipPath></defs>`+
G(15,35+d,`<g clip-path="url(#${uid})">${G(-start,0,net.s)}</g>`+L(i?10:240,-d,i?10:240,h+d,"guide")+marks(i?5:245,h/2))+
T(15,146,"先拼成一張完整紙樣，再描一整片薄卡；拼頁線不是成盒摺線。","small"),[id]);
}
}
part("F4","輪椅靠板","30×40＝35板＋5底翼","1","1／高35","薄卡");
part("F5","方向盤圓片","Ø12","2","1／疊2片","薄卡");
part("F8","落車鐘貼片","Ø5","16","16","紅紙");
part("F9","滅火筒卷片","21.9×18；圓周18.9＋3黏邊","1","1／約Ø6×18","薄紅紙");
part("F10","滅火筒蓋","Ø6","2","2","薄卡");
part("F11","輪椅區定位貼片","60×46","1可選","1／地面標誌","薄紙；不佔席");
pg("facility","F4／F5／F8–F11 內部小件與圓片","圓片是切形，不是孔；標誌可手畫。F9薄卡卷筒有紙厚誤差，先試卷。",
plate(15,39,"F4","靠板",30,40,R(0,35,30,5,"glue")+L(0,35,30,35,"fold"),"35高／5底翼")+
G(86,39,T(0,-9,"F5 方向盤Ø12，裁2")+C(6,6,6)+T(0,29,"F8 鐘Ø5，裁16")+C(2.5,43,2.5))+
plate(179,39,"F9","筒卷片",21.9,18,R(18.9,0,3,18,"glue")+L(18.9,0,18.9,18,"guide"),"F10 Ø6蓋，2片")+C(184,83,3)+C(198,83,3)+
plate(15,108,"F11","輪椅區",60,46,"","薄紙可選；不是新增座位"),["F4","F5","F8","F9","F10","F11"]);
// Transparent window master sizes include 5mm gluing border.
const glasses=[
["G1","下層前區窗",79,50,2],["G2","下層中區窗",48,50,16,3.5,3.5],["G3","下層尾窗",28,50,2,3.5,5],["G4","司機側窗",40,50,1],
["G5","上層前區窗",130,48,2],["G6","上層主區窗",26,48,30,3,3],
["G7","下層前擋風",104,52,1],["G8","上層前擋風",104,48,1],["G9","上層後窗",88,40,1],["G10","活動門窗",27,45,1]
];
for(const a of glasses){const [id,name,w,h,n,l=5,r=5]=a;part(id,name,`${w+l+r}×${h+10}；窗${w}×${h}`,String(n),String(n),`透明片；左${l}右${r}上／下5`);}
function glass(x,y,a){const [id,name,w,h,n,l=5,r=5]=a;return plate(x,y,id,name,w+l+r,h+10,R(l,5,w,h,"guide"),`裁${n}；內虛線不剪；左${l}右${r}`);}
pg("glass","G1／G2 下層前區與中區窗透明片","外線裁，內窗虛線不裁；G2左右各3.5，上／下5，避免相鄰片疊厚。",glass(15,39,glasses[0])+glass(122,39,glasses[1]),["G1","G2"]);
pg("glass","G3／G4 下層尾窗與司機窗透明片","G3左3.5、右5；G4四邊5。透明片只剪外線。",glass(15,39,glasses[2])+glass(122,39,glasses[3]),["G3","G4"]);
pg("glass","G5／G6 上層側窗透明片","G5四邊5；G6左右各3，上／下5，對應6寬窗柱，不疊厚。",glass(15,39,glasses[4])+glass(184,39,glasses[5]),["G5","G6"]);
pg("glass","G7／G8 前擋風透明片","下層114×62一片；上層114×58一片；外實線裁、內虛線不裁。",glass(12,39,glasses[6])+glass(148,39,glasses[7]),["G7","G8"]);
pg("glass","G9／G10 後窗與活動門透明片","G10要夾在門片之間；門的硬卡窗27×45，透明片37×55。",glass(15,39,glasses[8])+glass(161,39,glasses[9]),["G9","G10"]);
// Wheels, decals, lights and number signs.
for(const a of [
["W1","固定輪灰卡",40,24,6,"灰卡1.5×4"],["W2","輪心彩紙",16,6,6,"薄彩紙"]
])part(a[0],a[1],`Ø${a[2]}`,String(a[3]),String(a[4]),a[5]);
pg("decor","W1／W2 六個固定輪母版","W1裁24片疊成6輪、各厚6；輪心彩紙薄貼，不加厚硬卡凸出。",
G(15,43,T(0,-9,"W1 Ø40，灰卡24片")+C(20,20,20)+marks(20,20,3))+G(136,43,T(0,-9,"W2 Ø16，彩紙6片")+C(8,8,8))+
T(15,121,"輪中心：x140、500、560，左右各3，離地20；不做車軸或內部輪拱。","small"),["W1","W2"]);
const decor=[
["O1","前路線牌",90,12,1],["O2","側路線牌",60,12,2],["O3","車牌",30,10,2],["O4","頭燈",22,8,2],["O5","尾燈",8,16,2],["O6","外後格柵",84,35,1],["O7","設備箱格柵",110,28,1]
];for(const a of decor)part(a[0],a[1],`${a[2]}×${a[3]}`,String(a[4]),String(a[4]),"薄彩紙／貼片");
pg("decor","O1–O5 路線牌、車牌及燈片","字樣自行填；示範路線不是實際路線資訊。",plate(15,39,"O1","前牌",90,12,"","裁1")+plate(155,39,"O2","側牌",60,12,"","裁2")+plate(15,106,"O3","車牌",30,10,"","裁2")+plate(96,106,"O4","頭燈",22,8,"","裁2")+plate(178,106,"O5","尾燈",8,16,"","裁2"),["O1","O2","O3","O4","O5"]);
pg("decor","O6／O7 散熱格柵貼片","剪黑色薄紙，畫横線或貼細條；不切成穿透車牆的洞。",plate(15,39,"O6","外後格柵",84,35,"","裁1")+plate(145,39,"O7","尾箱格柵",110,28,"","裁1"),["O6","O7"]);
// Consistency metadata used for checking the pack.
window.cutPack={parts,pages:pages.map(({group,title,ids,n})=>({group,title,ids,n})),stair:{run:84,rise:106,steps:12,unfolded:190},tiling:{length:640,starts:[0,250,500],width:260,overlap:10}};
document.getElementById("parts").innerHTML=parts.map(a=>`<tr><td>${a.id}</td><td>${a.name}</td><td>${a.size}</td><td>${a.raw}</td><td>${a.finished}／${a.material}</td></tr>`).join("");
document.getElementById("templates").innerHTML=pages.map(p=>`<div class="paperwrap" data-group="${p.group}" data-page="${p.n}" data-parts="${p.ids.join(",")}"><div class="paper"><svg xmlns="http://www.w3.org/2000/svg" width="277mm" height="190mm" viewBox="0 0 277 190" role="img" aria-label="${p.title}"><title>${p.title}</title>${p.body}</svg></div></div>`).join("");
function update(){const f=document.getElementById("filter").value;let n=0,last;document.querySelectorAll(".paperwrap").forEach(p=>{p.classList.remove("last-visible");p.hidden=f!=="all"&&!p.dataset.group.split(" ").includes(f);if(!p.hidden){n++;last=p;}});if(last)last.classList.add("last-visible");document.getElementById("count").textContent=`顯示${n}頁／共${pages.length}頁 · ${parts.length}種裁片及切長圖`;}
document.getElementById("filter").addEventListener("change",update);
document.documentElement.dataset.theme=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";
document.getElementById("theme").addEventListener("click",()=>document.documentElement.dataset.theme=document.documentElement.dataset.theme==="dark"?"light":"dark");
document.getElementById("print").addEventListener("click",()=>window.print());update();
