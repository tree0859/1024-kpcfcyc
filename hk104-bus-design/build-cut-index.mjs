import fs from "node:fs";
import vm from "node:vm";
const nodes=new Map();
const get=id=>{if(!nodes.has(id))nodes.set(id,{innerHTML:"",textContent:"",value:"all",addEventListener(){}});return nodes.get(id);};
const document={getElementById:get,querySelectorAll:()=>[],documentElement:{dataset:{}}};
const window={matchMedia:()=>({matches:false}),print(){}};
vm.runInNewContext(fs.readFileSync(new URL("./cutting.js",import.meta.url),"utf8"),{document,window});
const {parts,pages}=window.cutPack;
const ids=parts.map(p=>p.id);
if(new Set(ids).size!==ids.length)throw Error("Duplicate part ID");
for(const id of ids)if(!pages.some(p=>p.ids.includes(id)))throw Error("Missing pattern "+id);
let md=`# HK-104 64厘米完整裁切紙樣索引\n\n此版對應長640、車身寬140、高225毫米的完整手作方案。上層64座、下層40座，司機椅另計；不採用25厘米或簡化版。配套網頁含${pages.length}頁A4橫向原尺寸母版，覆蓋${parts.length}種裁片與管／棒切長圖。\n\n## 如何使用\n\n1. 打開圖冊的「1:1裁切紙樣」，按分類選頁，不必列印每個重複座椅。\n2. 列印選A4、橫向、100%／實際大小，關閉配合頁面及頁首頁尾。每頁SVG設計尺寸277×190毫米，加四邊10毫米列印邊距。\n3. 用尺核對每頁100毫米校準尺及10×10毫米方格；兩個都準，才直接沿圖剪。瀏覽器與打印機可能縮放，不能只相信設定。\n4. 長件紙樣分3頁：x0–260、250–510、500–640；相鄰重疊10。重合十字及外形線，先黏成完整紙樣，再描到長硬卡上。這不是要求把硬卡切成3段。\n5. 每種重複零件使用母版描畫；「裁片數」包含硬卡疊層，與完成件數不同。\n6. 黑實線裁；紅虛線摺；綠點線是孔心、分席、拼頁或定位參考，不一定要剪；灰區是黏合翼。透明片只剪外線，內虛線窗框不剪。\n7. 木棒、飲管、魔術貼和膠帶按原料切長／切形，不能用紙片替代。孔徑須按實際管徑試做，Ø6.3只供外徑6的套管參考。\n8. 先試一個座椅、接頭及樓梯，確認紙厚、盒摺合及拆合。細紙盒展開按薄卡設計，成品會有紙厚誤差；不屬經實物驗證的工程模板。\n\n## 裁片表\n\n灰卡按1.5毫米計：地板4層6厚、牆與車頂2層3厚、橫肋4層6厚。孔／窗洞請先裁再疊，窗片夾兩層之間。\n\n|編號|零件|平面尺寸 mm|原料裁片／數量|完成數／材料|紙樣頁|\n|---|---|---|---|---|---|\n`;
for(const p of parts){const nums=pages.filter(a=>a.ids.includes(p.id)).map(a=>`P${String(a.n).padStart(2,"0")}`).join("、");md+=`|${p.id}|${p.name}|${p.size}|${p.raw}|${p.finished}／${p.material}|${nums}|\n`;}
md+=`\n## 紙樣頁索引\n\n`;
for(const p of pages)md+=`- **P${String(p.n).padStart(2,"0")}**：${p.title}。\n`;
md+=`\n## 本次補足與碰撞修正\n\n- **J5／J6三邊U形梯孔底框**：前後各10×32×3，左側106×10×3，不設靠右車牆y0–10的第4邊。原四邊框會與下層y0–8承托條在同高度重疊，不能照原完整四邊環做。\n- **T8樓梯底固定翼**：4片26×10，5＋5摺成L，固定梯身與下層地板，不跨接上層。\n- **B11活動門窗**：門39×79，開27×45窗，配G10透明片37×55；門以布膠帶鉸接向外開。\n- **F3儀表台**：原28×10平面補足10高，成28×10×10薄卡盒。\n- **J3補強塊**：層片20×10，4塊各疊約20高；原料1.5時約52–56片，須按膠層實測。柱埋18，底部留實卡，不能把每一層全打穿。\n- **G2／G3／G6窄窗柱透明片**：G2左右各留3.5，G3左3.5右5，G6左右各3，上下皆5。這樣相鄰透明片不疊厚；其餘通常四邊各5，按各母版裁。\n- **扶手與小件數**：一般柱60長16根，梯欄及上層圍欄分層固定。先試放靠牆或座椅角位，不能堵主通道，不能跨層綁線。\n\n此裁切版仍是原64厘米完整方案，以上是把原來未展開的小件補成可裁片，以及避免接合碰撞的修正，不是簡化成平貼座椅或畫線樓梯。\n`;
fs.writeFileSync(new URL("./HK-104-裁切索引.md",import.meta.url),md);
fs.writeFileSync(new URL("./cutting-catalog.json",import.meta.url),JSON.stringify({parts,pages},null,2));
console.log(JSON.stringify({pages:pages.length,parts:parts.length,coverage:"all part IDs have patterns"}));
