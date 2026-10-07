document.getElementById("templates").innerHTML=window.liveryA3.map(p=>`<div class="paperwrap" id="${p.id}" data-side="${p.side}"><div class="paper"><svg xmlns="http://www.w3.org/2000/svg" width="404mm" height="281mm" viewBox="0 0 404 281" role="img" aria-label="${p.title}"><title>${p.title}</title>${p.svg}</svg></div></div>`).join("");
function update(){let n=0,last;document.querySelectorAll(".paperwrap").forEach(p=>{p.hidden=document.getElementById("side").value!=="all"&&p.dataset.side!==document.getElementById("side").value;p.classList.remove("last-visible");if(!p.hidden){n++;last=p;}});last?.classList.add("last-visible");document.getElementById("count").textContent=`顯示${n}張A3／共2張`;}
document.getElementById("side").addEventListener("change",update);
document.getElementById("window-mode").addEventListener("change",e=>document.documentElement.dataset.windowMode=e.target.value);
document.documentElement.dataset.theme=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";
document.getElementById("theme").addEventListener("click",()=>document.documentElement.dataset.theme=document.documentElement.dataset.theme==="dark"?"light":"dark");
document.getElementById("print").addEventListener("click",()=>window.print());
update();
