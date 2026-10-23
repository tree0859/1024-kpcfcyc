"""No-post revision: same load-bearing planes, original four exterior straps."""
from pathlib import Path
import json
from PIL import Image, ImageDraw, ImageFont, PngImagePlugin

HERE=Path(__file__).resolve().parent
SOURCE=HERE.parent/"HK-104-39.3cm-尺寸核算.json"
old=json.loads(SOURCE.read_text(encoding="utf8"))
removed={p["id"]:p for p in old["parts"] if p["id"] in ("J3","J12","J13")}
removed_card=removed["J3"]["quantity"]*removed["J3"]["cardLayers"]
removed_total=removed_card+removed["J12"]["quantity"]+removed["J13"]["quantity"]
counts={
 "hardCardCuts":old["counts"]["hardCardCuts"]-removed_card,
 "hardCardFinished":old["counts"]["hardCardFinished"]-removed["J3"]["quantity"],
 "structuralCuts":old["counts"]["structuralCuts"]-removed_total,
 "withoutOptionalF11":old["counts"]["structuralCuts"]-removed_total-1,
}
assert counts=={"hardCardCuts":174,"hardCardFinished":65,"structuralCuts":663,"withoutOptionalF11":662}
spec={
 "version":"393-no-post-r1","date":"2026-10-23",
 "joint":"Direct flat bearing on retained J1/J2 frame and wall tops; four exterior hook-and-loop flaps.",
 "removed":["J3","J12","J13"],"noNewParts":True,
 "cancelledHoles":{"J1RodHoles":4,"B2SleeveHoles":4},
 "retained":{"B2":[393,83,4],"J1":[389,5,2],"J2":[69,5,2],
             "frameOuter":[389,79],"frameInner":[379,69],
             "J4WidthY":67.8,"J4HeightZ":11.053125,
             "straps":4,"hookLoopPairs":4},
 "counts":counts,"newBuildOnly":True,
 "jointPlaneZ":old["heights"]["joint"],
 "upperFloorTopZ":old["heights"]["upperFloorTop"],
 "minimumVerticalLiftMm":12,"physicalPrototype":False,
 "legacyTutorialRequiresPatch":True,
}
assert abs(spec["upperFloorTopZ"]-spec["jointPlaneZ"]-4)<1e-9
assert 12>spec["retained"]["J4HeightZ"]
assert (69-67.8)/2>0
(HERE/"no-post-spec.json").write_text(json.dumps(spec,ensure_ascii=False,indent=2)+"\n",encoding="utf8")

W,H=1800,1410
im=Image.new("RGB",(W,H),"white")
d=ImageDraw.Draw(im)
REG="/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc"
BOLD="/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc"
INK="#24333a";MUTED="#66747a";BLUE="#2f7893";PINK="#b94e86";GREY="#e1e4e6"
fontcache={}
def f(n,b=False):
 key=n,b
 if key not in fontcache:fontcache[key]=ImageFont.truetype(BOLD if b else REG,n,index=3)
 return fontcache[key]
def text(x,y,s,n=30,b=False,fill=INK,anchor="lt"):
 box=d.textbbox((x,y),s,font=f(n,b),anchor=anchor)
 assert min(box[:2])>=0 and box[2]<=W and box[3]<=H,(s,box)
 d.text((x,y),s,font=f(n,b),fill=fill,anchor=anchor)
def line(points,fill=INK,width=3):
 d.line(points,fill=fill,width=width)
def rect(x,y,w,h,fill,outline=None,width=2):
 d.rectangle((x,y,x+w,y+h),fill=fill,outline=outline,width=width)
def arrow(a,b):
 import math
 line([a,b],BLUE,4)
 angle=math.atan2(b[1]-a[1],b[0]-a[0])
 for k in (-.45,.45):
  line([b,(b[0]-17*math.cos(angle+k),b[1]-17*math.sin(angle+k))],BLUE,4)
def dash(a,b,fill=MUTED):
 x1,y1=a;x2,y2=b;dist=((x2-x1)**2+(y2-y1)**2)**.5
 for k in range(0,int(dist),18):
  t=min(k+10,dist)
  line([(x1+(x2-x1)*k/dist,y1+(y2-y1)*k/dist),
        (x1+(x2-x1)*t/dist,y1+(y2-y1)*t/dist)],fill,2)

text(65,35,"無柱簡易拆合：平放承托＋四條外側翻帶",49,True)
text(65,108,"取消木棒、套管和四塊J3；不用鑽定位孔，不新增零件。",33)
text(65,158,"俯視原理示意：四帶分開畫出，非1:1；車頭在左。",28,fill=MUTED)

# Exact plan coordinates, mm model. The floor is shown with the frame underneath projected onto it.
k=3.4;x0=125;y0=265
def planr(x,y,w,h,c):
 rect(x0+x*k,y0+y*k,w*k,h*k,c,INK,2)
planr(0,0,393,83,"#f9fafb")
planr(2,2,389,5,"#bed9e4")
planr(2,76,389,5,"#bed9e4")
planr(2,7,5,69,"#bed9e4")
planr(386,7,5,69,"#bed9e4")
for x in (61.40625,331.59375):
 for y in (-13,83-13):
  rect(x0+(x-6.140625)*k,y0+y*k,12.28125*k,26*k,"#efc9dc",PINK,3)
text(x0,222,"車頭端",28,True)
text(x0+393*k,222,"車尾端",28,True,anchor="rt")
text(780,330,"B2：393 × 83 × 厚4",40,True,anchor="mt")
text(780,393,"直接坐框頂；四角外邊對齊，不套柱。",31,anchor="mt")
text(1530,300,"J1/J2",30,True,BLUE)
text(1530,344,"框保留",30,True,BLUE)
text(1530,414,"粉紅：",29,True,PINK)
text(1530,455,"左2＋右2",29,True,PINK)
text(125,605,"先自然平放，再扣四帶；不是用鎖帶把歪板硬拉平。",33,True)

# Cropped transverse principle section: no new spacer or horizontal hook-and-loop.
text(70,705,"接縫剖面原理（省略內裝）",35,True)
sx=130;sy=935;q=8;ww=83*q
rect(sx,sy-32,ww,32,GREY,INK,3) # B2, four mm.
for x in (sx,sx+81*q):
 rect(x,sy-126,2*q,94,"#d8c49b",INK,2) # upper wall sits ON B2.
 rect(x,sy,2*q,130,"#d8c49b",INK,2) # lower wall top is joint plane.
rect(sx+2*q,sy,5*q,2*q,"#bed9e4",INK,2)
rect(sx+76*q,sy,5*q,2*q,"#bed9e4",INK,2)
for x in (sx-12,sx+ww+3):
 rect(x,sy-85,9,143,"#efc9dc",PINK,2)
text(sx+ww/2,sy-77,"B2底面",28,True,anchor="mt")
arrow((sx+ww/2,sy-37),(sx+ww/2,sy-3))
text(sx+ww/2,sy+43,"框頂直接接觸",28,True,anchor="mt")
text(70,1118,"魔術貼在外側直立面；承托面不夾魔術貼、不加海綿膠墊。",29,True)

text(980,705,"取消及保留",35,True)
text(980,768,"取消：J3 × 4、木棒 × 4、套管 × 4",28)
text(980,820,"保留：框、托座、底肋、四翻帶",30)
text(980,872,"J1不開棒孔；B2不開4個管孔。",29)
text(980,924,"灰卡新製作：174片／65完成件",29,True)
text(980,976,"結構及內裝：663件（含可選F11）",28)
text(980,1028,"已黏牢的木棒先別硬拔，需看實況。",28,True)
text(70,1198,"拆開：鬆開全部四帶，托上層地板垂直提至少12mm，再移開；搬整車要托下層底板。",30,True)
text(70,1252,"不再需要四孔同時對準，但底肋和U框仍須避框；有卡住或搖晃就提起檢查，不強壓。",28)
text(70,1304,"舊J1孔位圖及四柱安裝步驟對本版作廢。車身、104席、樓梯及原裁切紙樣不改。",28)
text(70,1356,"新機關未經實物試製或強度認證；高容錯是減少對孔要求，不代表任意偏放或可吊起整車。",25,fill=MUTED)
meta=PngImagePlugin.PngInfo()
meta.add_text("Title","HK-104 無柱簡易拆合示意：平放承托與四條外側翻帶")
meta.add_text("Author","Perplexity Computer")
meta.add_text("Warning","Not to scale; not physically prototyped. Retain load-bearing frame. No hook-and-loop between bearing surfaces.")
out=HERE/"HK-104_無柱簡易拆合示意_39.3厘米版.png"
im.save(out,pnginfo=meta,optimize=True)
print("PASS: unchanged joint/floor heights; cancel 36 card cuts + 4 rods + 4 sleeves; new totals 174/65/663; four exterior straps retained; lift12 > rib11.053125.")
print(out)
