import fs from "node:fs";
import {stageFigures as oldFigures,data} from "./joint-stair-393.mjs";
const img=(n,title)=>`<figure class="part-figure"><img src="tutorial-393/step-${String(n).padStart(2,"0")}.svg" width="480" height="330" alt="${title}" loading="lazy"><figcaption><h3>${title}</h3><p>無柱版安裝示意，不是1:1紙樣。</p></figcaption></figure>`;
const stageFigures={...oldFigures,"stage-1":[img(1,"無柱版保留件與取消件")],"stage-2":[img(3,"無孔承托框"),img(9,"原底肋仍須避框")],"stage-3":[img(10,"對齊外邊再平放"),img(11,"承托面不墊貼"),img(13,"左右各兩條外側翻帶"),img(14,"自然落座才扣帶"),img(16,"鬆四帶後垂直提至少12毫米")]};
const {marked}=await import(process.env.MARKED_MODULE||"marked");
const name="HK-104-39.3cm-四柱接頭與樓梯組裝清單.md";
const md=fs.readFileSync(new URL(name,import.meta.url),"utf8");
const html=marked.parse(md.replace(/^# .*\n/,""),{gfm:true});
const blocks=html.split(/(?=<h2>)/),intro=blocks.shift();
const stages=blocks.map((body,i)=>{
 const heading=body.match(/^<h2>(.*?)<\/h2>/)?.[1];if(!heading)throw Error("Missing section");
 const id=`stage-${i+1}`;
 if(!stageFigures[id])throw Error("Missing figures "+id);
 const figs=`<div class="stage-figures">${stageFigures[id].join("")}</div><p class="figure-note">無柱版393 × 83毫米實作尺寸；安裝示意，非1:1紙樣。粉紅為外側翻帶，黑色為樓梯；舊紙樣須手工改有效尺寸，略過柱管及定位孔。</p>`;
 let content=body.replace("</h2>","</h2>"+figs);
 if(id==="stage-3")content=content.replace("<h2>",'<span id="four-post-guide" aria-hidden="true"></span><h2 id="no-post-guide">');
 return {id,heading,body:content};
});
const tasks=(md.match(/^- \[ \]/gm)||[]).length;
if(stages.length!==6||data.counts.hardCardCuts!==210||data.assembly.stairProfileOrder!=="rise-then-tread")throw Error("Unexpected revision data");
if(tasks<45)throw Error("Incomplete checklist");
const page=`<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>HK-104 39.3厘米：無柱承托與樓梯可勾選清單</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="style.css"><link rel="stylesheet" href="checklist.css"><link rel="stylesheet" href="checklist-393.css"></head>
<body class="focused-checklist"><a class="skip-link" href="#checklist-content">跳至組裝步驟</a>
<header class="no-print"><a class="brand" href="index.html"><span>HK–104<small>39.3厘米／無柱承托及樓梯</small></span></a><div class="tools"><button id="theme">明／暗</button><button id="print">列印更新清單</button></div></header>
<main><section class="check-intro"><div class="eyebrow">393 × 83 MM / NO-POST R1 / ${tasks} CHECKS</div><h1>無柱承托與樓梯。<br>平放扣帶，逐項試合。</h1>
${intro}<p class="check-links no-print"><a href="revision-393.html">全零件修正表</a><a href="${name}">本清單原文</a><a href="checklist-40-archive.html">原40厘米149項歷史清單</a></p><p class="no-print">勾選只保留本次開頁；重新整理會清除。列印包含所有項目，不受篩選影響，方向為A4橫向；本清單不是1:1裁切紙樣。</p></section>
<section class="progress-panel" aria-label="完成進度"><div class="progress-title"><b id="progress-text" aria-live="polite">完成0／${tasks}項</b><span id="progress-percent">0%</span></div><progress id="progress" value="0" max="${tasks}" aria-label="清單完成進度"></progress><div class="progress-controls no-print"><label for="task-filter">顯示項目</label><select id="task-filter"><option value="all">全部項目</option><option value="pending">未完成項目</option><option value="done">已完成項目</option></select><span id="visible-count"></span><button id="reset">清除勾選</button></div><p class="filter-note no-print">篩選只隱藏勾選項，尺寸表及安裝小圖仍會保留。</p><div id="reset-confirm" class="reset-confirm no-print" hidden><span>清除本頁全部完成標記？</span><button id="reset-yes">確認清除</button><button id="reset-no">取消</button></div></section>
<div class="check-layout" id="checklist-content"><aside class="stage-nav no-print"><h2>更新階段</h2><ol>${stages.map((s,i)=>`<li><a href="#${s.id}"><span class="stage-number">${String(i+1).padStart(2,"0")}</span><span>${s.heading}</span></a></li>`).join("")}</ol></aside><div class="check-content">${stages.map(s=>`<section class="check-stage" id="${s.id}">${s.body}</section>`).join("")}</div></div>
<footer><span>HK–104 / 39.3厘米無柱承托及樓梯</span><span>1毫米灰卡整層 · 原裁切紙樣不改 · 未經實物試製</span></footer></main><script src="checklist.js"></script></body></html>`;
fs.writeFileSync(new URL("checklist.html",import.meta.url),page);
console.log(JSON.stringify({file:"checklist.html",tasks,stages:stages.length,figures:Object.values(stageFigures).flat().length,jointSteps:stageFigures["stage-3"].length}));
