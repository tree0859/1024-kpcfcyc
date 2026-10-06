const pack=window.pack40;
document.getElementById("parts").innerHTML=pack.parts.map(p=>`<tr><td>${p.id}</td><td>${p.name}</td><td>${p.size}</td><td>${p.raw}</td><td>${p.finished}／${p.material}</td></tr>`).join("");
document.getElementById("templates").innerHTML=pack.pages.map(p=>`<div class="paperwrap" data-group="${p.group}" data-page="${p.n}" data-parts="${p.ids.join(",")}"><div class="paper"><svg xmlns="http://www.w3.org/2000/svg" width="277mm" height="190mm" viewBox="0 0 277 190" role="img" aria-label="${p.title}"><title>${p.title}</title>${p.svg}</svg></div></div>`).join("");
document.querySelectorAll(".paperwrap").forEach(p=>p.id=`cut-P${String(p.dataset.page).padStart(2,"0")}`);
function update(){const f=document.getElementById("filter").value;let n=0,last;document.querySelectorAll(".paperwrap").forEach(p=>{p.classList.remove("last-visible");p.hidden=f!=="all"&&!p.dataset.group.split(" ").includes(f);if(!p.hidden){n++;last=p;}});if(last)last.classList.add("last-visible");document.getElementById("count").textContent=`顯示${n}頁／共${pack.pages.length}頁 · ${pack.parts.length}種裁片及切長圖`;}
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
window.addEventListener("hashchange",scrollToPaper);
