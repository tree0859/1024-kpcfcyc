document.documentElement.dataset.theme=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";
document.getElementById("theme").addEventListener("click",()=>document.documentElement.dataset.theme=document.documentElement.dataset.theme==="dark"?"light":"dark");
document.getElementById("print").addEventListener("click",()=>window.print());
const pngLink=document.createElement("a");pngLink.href="HK-104-40cm-側牆內面避位加工圖.png";pngLink.textContent="查看PNG放大圖";
document.querySelector(".relief-intro>p:nth-of-type(2)").append(document.createTextNode("　／　"),pngLink);
