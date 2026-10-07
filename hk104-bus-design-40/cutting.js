const basePack=window.pack40,livery=window.livery40||{parts:[],pages:[]};
const pack={...basePack,parts:[...basePack.parts,...livery.parts],pages:[...basePack.pages,...livery.pages]};
document.documentElement.dataset.windowMode="cut";
if(livery.pages.length){
 const option=document.createElement("option");option.value="livery";option.textContent="外觀彩印外皮 P38–P49";document.getElementById("filter").append(option);
 const label=document.createElement("label");label.htmlFor="window-mode";label.textContent="外皮車窗";
 const mode=document.createElement("select");mode.id="window-mode";mode.innerHTML='<option value="cut">透明窗裁空</option><option value="printed">保留印刷窗（不剪）</option>';
 mode.addEventListener("change",()=>document.documentElement.dataset.windowMode=mode.value);
 document.querySelector(".cut-toolbar").append(label,mode);
 document.querySelector(".cut-intro>p").textContent="37頁結構母版／73種零件，另加入上傳外觀圖的12頁彩印外皮／13種貼片，共49頁。原結構幾何不變；外觀按模型窗洞重排，並非原圖直接縮放。";
 const note=document.createElement("div");note.className="note";note.innerHTML='<b>外觀彩印：P38–P49，請在分類選「外觀彩印外皮」。</b>預設白色窗區裁空；也可選保留印刷窗。上下層、車頂及門片分開貼。原圖無車頂，深綠車頂是可選補件；圖中雙門外觀沒有新增自動門機關。<p><a href="HK-104-40cm-外觀彩印裁紙樣.md">外皮尺寸及貼法</a>　／　<a href="HK-104-40cm-材料清單與總數量.md">最新1毫米硬卡材料清單</a></p><img class="livery-reference" src="livery-preview.svg" alt="按模型窗洞對位的外觀四視預覽，不是1比1裁切圖"><details><summary>查看用戶原始外觀圖（不是1:1紙樣）</summary><img class="livery-reference" src="livery-assets/reference.png" alt="用戶提供的巴士左右前後外觀圖"></details>';
 document.querySelector(".cut-intro").append(note);
 document.querySelector("footer span:last-child").textContent="49頁：37結構＋12外皮／86種；未實物試製，先核對尺再試貼";
}
document.getElementById("parts").innerHTML=pack.parts.map(p=>`<tr><td>${p.id}</td><td>${p.name}</td><td>${p.size}</td><td>${p.raw}</td><td>${p.finished}／${p.material}</td></tr>`).join("");
document.getElementById("templates").innerHTML=pack.pages.map(p=>`<div class="paperwrap" data-group="${p.group}" data-page="${p.n}" data-parts="${p.ids.join(",")}"><div class="paper"><svg xmlns="http://www.w3.org/2000/svg" width="277mm" height="190mm" viewBox="0 0 277 190" role="img" aria-label="${p.title}"><title>${p.title}</title>${p.svg}</svg></div></div>`).join("");
document.querySelectorAll(".paperwrap").forEach(p=>p.id=`cut-P${String(p.dataset.page).padStart(2,"0")}`);
function update(){const f=document.getElementById("filter").value;let n=0,last;document.querySelectorAll(".paperwrap").forEach(p=>{p.classList.remove("last-visible");p.hidden=f!=="all"&&!p.dataset.group.split(" ").includes(f);if(!p.hidden){n++;last=p;}});if(last)last.classList.add("last-visible");document.getElementById("count").textContent=`顯示${n}頁／共${pack.pages.length}頁 · ${basePack.parts.length}結構＋${livery.parts.length}外皮／貼片`;}
document.getElementById("filter").addEventListener("change",update);
document.documentElement.dataset.theme=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";
document.getElementById("theme").addEventListener("click",()=>document.documentElement.dataset.theme=document.documentElement.dataset.theme==="dark"?"light":"dark");
document.getElementById("print").addEventListener("click",()=>window.print());update();
const checklistLink=document.createElement("a");
checklistLink.href="checklist.html";
checklistLink.textContent="裁剪與組裝順序";
document.querySelector(".cut-toolbar").append(checklistLink);
function scrollToPaper(){
 const id=location.hash.slice(1);if(!/^cut-P\d{2}$/.test(id))return;
 const target=document.getElementById(id);if(!target)return;
 if(target.hidden){document.getElementById("filter").value="all";update();}
 target.scrollIntoView({block:"start",behavior:"instant"});
}
document.fonts.ready.then(scrollToPaper);
const a3Link=document.createElement("a");a3Link.href="livery-a3.html";a3Link.textContent="A3整張側面（免拼頁）";document.querySelector(".cut-toolbar").append(a3Link);
window.addEventListener("hashchange",scrollToPaper);
