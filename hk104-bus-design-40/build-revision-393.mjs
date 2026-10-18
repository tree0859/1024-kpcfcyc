import fs from "node:fs";
const {marked}=await import(process.env.MARKED_MODULE||"marked");
const mdName="HK-104-39.3cm-尺寸修正與整毫米疊層表.md";
const jsonName="HK-104-39.3cm-尺寸核算.json";
const md=fs.readFileSync(new URL(mdName,import.meta.url),"utf8");
const data=JSON.parse(fs.readFileSync(new URL(jsonName,import.meta.url),"utf8"));
if(data.parts.length!==73||data.counts.hardCardCuts!==210)throw Error("Incorrect revision data");
const esc=s=>s.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
let body=marked.parse(md.replace(/^# .*\n/,""),{gfm:true});
const toc=[];let n=0;
body=body.replace(/<h2>(.*?)<\/h2>/g,(_,label)=>{
 const id=`revision-section-${++n}`;
 toc.push(`<li><a href="#${id}">${esc(label)}</a></li>`);
 return `<h2 id="${id}">${label}</h2>`;
});
body=body.replace(/<table>/g,'<div class="revision-table" tabindex="0" role="region" aria-label="可橫向捲動的尺寸表"><table>').replace(/<\/table>/g,"</table></div>");
const html=`<!doctype html>
<html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>HK-104 39.3厘米實作版：全零件尺寸修正</title>
<meta name="description" content="以B1實測393×83毫米重算73種零件、104座、12級樓梯及四柱接頭；1毫米灰卡採完整層數。原40厘米裁切紙樣保留不改，製作前先核對本表及試件。">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="style.css"><link rel="stylesheet" href="revision-393.css"><script src="revision-393.js" defer></script></head>
<body class="revision-page"><a class="revision-skip" href="#revision-content">跳至完整尺寸表</a>
<header><a class="brand" href="index.html"><span>HK–104<small>返回原40厘米圖冊／保留紙樣</small></span></a><div class="tools"><button id="theme" type="button">明／暗</button><button id="print" type="button">列印尺寸表</button></div></header>
<main>
<section class="revision-intro"><div class="eyebrow">393 × 83 MM / 1 MM GREY CARD</div><h1>39.3厘米實作版。<br>全零件尺寸修正與整毫米疊層表。</h1>
<p>以實際B1地板為基準，修正後續部件的長闊、整層卡厚及配合位置。本頁是手工量度用尺寸表，不是1:1裁切紙樣；原A4／A3紙樣及PDF不改。</p>
<div class="revision-facts"><p><strong>393 × 83</strong><br>地板長 × 闊，毫米</p><p><strong>64 + 40</strong><br>乘客席；司機另計</p><p><strong>210</strong><br>1毫米灰卡裁片／69個完成件</p></div>
<p>高度暫取長度倍率0.9825，車闊倍率為0.948571；地板4毫米、牆及頂2毫米，接頭塊9毫米。整車計算總高約139.22毫米，未經實物試製，先做試件及乾合。</p>
<div class="revision-links"><a href="checklist.html">四柱／樓梯更新清單</a><a href="${mdName}">原文尺寸表（Markdown）</a><a href="${jsonName}">尺寸核算資料（JSON）</a><a href="cutting.html">原40厘米紙樣（須手動改線）</a></div></section>
<div class="revision-layout"><aside class="revision-toc" aria-label="尺寸表章節"><h2>章節索引</h2><ol>${toc.join("")}</ol></aside><article class="revision-content" id="revision-content">${body}</article></div>
</main><footer><span>HK–104 / 39.3厘米實作修正</span><span>原40厘米紙樣保留 · 尺寸均為毫米 · 先試件再批量裁</span></footer></body></html>`;
fs.writeFileSync(new URL("revision-393.html",import.meta.url),html);
console.log(`Built revision-393.html: ${n} sections, ${data.parts.length} part types.`);
