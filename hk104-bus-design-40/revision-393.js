const root=document.documentElement;
root.dataset.theme=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";
document.getElementById("theme").addEventListener("click",()=>{
 root.dataset.theme=root.dataset.theme==="dark"?"light":"dark";
});
document.getElementById("print").addEventListener("click",()=>window.print());
