(()=>{
 const main=document.querySelector("main");
 if(!main||document.querySelector(".revision-notice"))return;
 const notice=document.createElement("section");
 notice.className="revision-notice no-print";
 notice.setAttribute("aria-labelledby","revision-notice-heading");
 notice.innerHTML='<h2 id="revision-notice-heading">最新無柱版：393 × 83毫米</h2><p>原框平放承托＋四條外側魔術貼翻帶；取消J3、木棒、套管及定位孔，保留框、U框、底肋與104席。新製作灰卡174片／65完成件、結構內裝663件含F11；地板4毫米、牆頂2毫米不變。高度倍率0.9825仍是工作假設，未經實物試製。</p><a class="revision-action" href="bus-tutorial-393.html">開始無柱版全車42步教程</a><p class="revision-archive">以下40厘米圖文保留作歷史參考，不是現行無柱尺寸及流程。原裁切紙樣不改，製作時略過柱管及定位孔；魔術貼只在外側，不墊高承托面。拆層先鬆四帶、托地板垂直提至少12毫米，再移開。</p>';
 const entry=document.createElement("p");
 entry.innerHTML='<a href="frame-tutorial-393.html">無柱承托框17步專篇</a>　／　<a href="checklist.html">無柱／樓梯50項清單</a>　／　<a href="revision-393.html">完整尺寸修正表</a>　／　<a href="passengers/HK-104_薄卡坐姿人仔_104個_A4橫向_300dpi.png">104個坐姿人仔列印圖</a>';
 notice.querySelector(".revision-action").after(entry);
 main.prepend(notice);
})();
