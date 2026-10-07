import fs from "node:fs";
import {stageFigures,jointGuide} from "./stage-diagrams.mjs";
const {marked}=await import(process.env.MARKED_MODULE||"marked");
const md=fs.readFileSync(new URL("./HK-104-40cm-裁剪與組裝順序清單.md",import.meta.url),"utf8");
const html=marked.parse(md.replace(/^# .*\n/,""),{gfm:true});
const blocks=html.split(/(?=<h2>)/),intro=blocks.shift(),stages=[];
const escape=s=>s.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll('"',"&quot;");
for(const [i,b]of blocks.entries()){
 const heading=b.match(/^<h2>(.*?)<\/h2>/)?.[1];if(!heading)throw Error("Missing stage heading");
 stages.push({id:`stage-${i+1}`,heading,body:b.replace(/^<h2>(.*?)<\/h2>/,`<h2>${heading}</h2>`)});
}
const taskCount=(md.match(/^- \[ \]/gm)||[]).length;
for(const s of stages){
 if(!stageFigures[s.id]?.length)throw Error("Missing stage diagrams: "+s.id);
 const figures=`<div class="stage-figures" aria-label="本階段零件小圖">${stageFigures[s.id].join("")}</div><p class="figure-note">小圖只作零件識別及組裝示意，不是1:1紙樣。紅線／淡紅黏翼示黏接，圓點按圖說識別定位或固定點，綠箭示取放方向；裁切尺寸以原尺寸紙樣為準。</p>`;
 s.body=s.body.replace("</h2>","</h2>"+figures);
 if(s.id==="stage-3")s.body=s.body.replace("</div><p class=\"figure-note\">","</div><p class=\"no-print\"><a href=\"#four-post-guide\">打開四柱接頭的8步安裝圖</a></p><p class=\"figure-note\">");
 if(s.id==="stage-6")s.body=s.body.replace(figures,figures+jointGuide);
 if(s.id==="stage-8")s.body=s.body.replace(figures,figures+'<p class="figure-note">外觀圖另有P38–P49彩印外皮：<a href="cutting.html#cut-P38">打開A4外觀裁紙樣</a>，或用<a href="livery-a3.html">A3整張側面版（左右各一張）</a>取代P38–P45；仍印P46–P49，沿條不重複裁。先選透明窗裁空或保留印刷窗，外皮分層貼，不封住拆合縫；門外皮不代表新增自動門機關。最新備料見<a href="HK-104-40cm-材料清單與總數量.md">材料清單</a>。</p>');
}
const page=`<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>HK-104 40厘米版可勾選裁剪與組裝清單</title><link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet"><link rel="stylesheet" href="style.css"><link rel="stylesheet" href="checklist.css"></head>
<body><header class="no-print"><a class="brand" href="index.html"><svg viewBox="0 0 36 36" width="36" height="36" aria-label="HK-104"><path d="M5 5h26v24H5zM5 16h26M9 9h7v4H9zM20 9h7v4h-7zM9 20h7v5H9zM20 20h7v5h-7z" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="10" cy="31" r="3" fill="currentColor"/><circle cx="26" cy="31" r="3" fill="currentColor"/></svg><span>HK–104 <small>40厘米／裁剪與組裝清單</small></span></a><div class="tools"><button id="theme">明／暗</button><button id="print">列印清單</button></div></header>
<main><section class="check-intro"><div class="eyebrow">40cm / HANDMADE WORKFLOW / ${taskCount} CHECKS</div><h1>照次序製作。<br>逐項勾選。</h1>${intro}<div class="note no-print">勾選進度只保留在本次開啟的頁面，重新整理或關閉會清除。可列印清單保留完成紀錄；列印會包含所有項目，不受篩選影響。</div><p class="check-links no-print"><a href="index.html">返回40厘米組裝圖冊</a><a href="cutting.html">打開1:1裁切紙樣</a><a href="HK-104-40cm-裁剪與組裝順序清單.md">原始文件清單</a></p></section>
<section class="progress-panel" aria-label="完成進度"><div class="progress-title"><b id="progress-text" aria-live="polite">完成0／${taskCount}項</b><span id="progress-percent">0%</span></div><progress id="progress" value="0" max="${taskCount}" aria-label="清單完成進度"></progress><div class="progress-controls no-print"><label for="task-filter">顯示項目</label><select id="task-filter"><option value="all">全部項目</option><option value="pending">未完成項目</option><option value="done">已完成項目</option></select><span id="visible-count"></span><button id="reset">清除勾選</button></div><p class="filter-note no-print">篩選只隱藏勾選項；尺寸表、組裝說明及提醒仍會保留。</p><div id="reset-confirm" class="reset-confirm no-print" hidden><span>要清除本頁所有完成標記嗎？</span><button id="reset-yes">確認清除</button><button id="reset-no">取消</button></div></section>
<div class="check-layout"><aside class="stage-nav no-print"><h2>製作階段</h2><ol>${stages.map((s,i)=>`<li><a href="#${s.id}"><span class="stage-number">${String(i+1).padStart(2,"0")}</span><span>${s.heading}</span></a></li>`).join("")}</ol></aside><div class="check-content">${stages.map(s=>`<section class="check-stage" id="${s.id}">${s.body}</section>`).join("")}</div></div><footer><span>HK–104 / 40厘米預覽專用 · 不混用64厘米紙樣</span><span>先試件，再批量裁；未經實物試製</span></footer></main><script src="checklist.js"></script></body></html>`;
if(stages.length!==11||taskCount!==149)throw Error("Checklist coverage changed: update expected counts");
fs.writeFileSync(new URL("./checklist.html",import.meta.url),page);
console.log(JSON.stringify({stages:stages.length,tasks:taskCount,diagrams:Object.values(stageFigures).flat().length,jointSteps:8,file:"checklist.html"}));
