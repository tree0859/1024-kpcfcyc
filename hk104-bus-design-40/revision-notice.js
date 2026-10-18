(()=>{
 const main=document.querySelector("main");
 if(!main||document.querySelector(".revision-notice"))return;
 const notice=document.createElement("section");
 notice.className="revision-notice no-print";
 notice.setAttribute("aria-labelledby","revision-notice-heading");
 notice.innerHTML='<h2 id="revision-notice-heading">最新實作修正：393 × 83毫米</h2><p>按已印出的B1重算所有零件，1毫米灰卡改用完整層數：地板4毫米、牆及車頂2毫米、接頭塊9毫米，共210片灰卡。高度暫按長度倍率0.9825計算；請先試件。</p><a class="revision-action" href="revision-393.html">查看39.3厘米完整尺寸修正表</a><p class="revision-archive">以下保留原40厘米圖文作歷史參考，不是393 × 83毫米的新尺寸。原裁切紙樣沒有改；新實作的孔位、梯高、承托及接頭以修正表為準，不再依舊避位圖削薄側牆。</p>';
 const entry=document.createElement("p");
 entry.innerHTML='<a href="checklist.html">四柱／樓梯更新清單（39.3厘米，含8步接頭小圖）</a>';
 notice.querySelector(".revision-action").after(entry);
 main.prepend(notice);
})();
