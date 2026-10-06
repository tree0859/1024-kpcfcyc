const inputs=[...document.querySelectorAll('.check-stage input[type="checkbox"]')];
for(const [i,input]of inputs.entries()){
 input.disabled=false;input.id=`task-${i+1}`;
 const li=input.closest("li");li.classList.add("task-item");
 const holder=document.createElement("span"),label=document.createElement("label");
 input.remove();while(li.firstChild)holder.append(li.firstChild);
 label.htmlFor=input.id;label.append(input,holder);li.append(label);
}
document.querySelectorAll(".check-stage table").forEach(table=>{const wrap=document.createElement("div");wrap.className="table-scroll";table.before(wrap);wrap.append(table);});
const stages=[...document.querySelectorAll(".check-stage")];
for(const stage of stages){const badge=document.createElement("span");badge.className="stage-progress";stage.querySelector("h2").append(badge);}
function update(){
 const done=inputs.filter(i=>i.checked).length,total=inputs.length,f=document.getElementById("task-filter").value;
 document.getElementById("progress-text").textContent=`完成${done}／${total}項`;
 document.getElementById("progress-percent").textContent=`${Math.round(done/total*100)}%`;
 document.getElementById("progress").value=done;document.getElementById("progress").max=total;
 let visible=0;
 for(const input of inputs){const li=input.closest("li"),hide=f==="pending"?input.checked:f==="done"?!input.checked:false;li.classList.toggle("is-done",input.checked);li.classList.toggle("task-hidden",hide);if(!hide)visible++;}
 document.getElementById("visible-count").textContent=`顯示${visible}項`;
 for(const stage of stages){const list=[...stage.querySelectorAll('input[type="checkbox"]')];stage.querySelector(".stage-progress").textContent=list.length?`${list.filter(i=>i.checked).length}／${list.length}項`:"提醒";}
}
inputs.forEach(i=>i.addEventListener("change",update));
document.getElementById("task-filter").addEventListener("change",update);
document.getElementById("reset").addEventListener("click",()=>{document.getElementById("reset-confirm").hidden=false;document.getElementById("reset-no").focus();});
document.getElementById("reset-no").addEventListener("click",()=>{document.getElementById("reset-confirm").hidden=true;document.getElementById("reset").focus();});
document.getElementById("reset-yes").addEventListener("click",()=>{inputs.forEach(i=>i.checked=false);update();document.getElementById("reset-confirm").hidden=true;document.getElementById("reset").focus();});
document.documentElement.dataset.theme=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";
document.getElementById("theme").addEventListener("click",()=>document.documentElement.dataset.theme=document.documentElement.dataset.theme==="dark"?"light":"dark");
document.getElementById("print").addEventListener("click",()=>window.print());
update();
