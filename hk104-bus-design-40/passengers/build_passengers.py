"""One physical coordinate model, millimetres; PNG is the printable deliverable."""
from pathlib import Path
import json
from PIL import Image, ImageDraw, ImageFont, PngImagePlugin

HERE = Path(__file__).resolve().parent
OUT = HERE / "HK-104_薄卡坐姿人仔_104個_A4橫向_300dpi.png"
DPI = 300
RENDER_DPI = 600
S = RENDER_DPI / 25.4
PAGE = (297, 210)
WIDTH, LENGTH, HIP, KNEE = 8, 47, 22, 38
THIGH, SHIN = KNEE-HIP, LENGTH-KNEE
COLS, ROWS = 26, 4
X0, Y0, ROW_PITCH = 10, 8, 49
SEAT_WIDTH, SEAT_DEPTH, SEAT_HEIGHT = 13.042857142857, 15.965625, 9.825
UPPER_HEADROOM = 52.809375
FONT = "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc"
BOLD = "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc"
INK, GREY, PINK, BLUE = "#222222", "#777777", "#ce5a95", "#165a79"
SHIRTS = ("#c6e4e9", "#e6d7ad", "#dacde9", "#d4e1c6")
HAIRS = ("#343434", "#594032", "#2c3038", "#635445")
im = Image.new("RGB", (round(PAGE[0]*S), round(PAGE[1]*S)), "white")
d = ImageDraw.Draw(im)
text_bounds = []

def xy(x, y):
    return x*S, y*S

def font(pt=9, bold=False):
    return ImageFont.truetype(BOLD if bold else FONT, round(pt*RENDER_DPI/72), index=3)

def text(x, y, value, pt=9, bold=False, fill=INK):
    f = font(pt, bold)
    b = d.textbbox(xy(x, y), value, font=f, anchor="lt")
    assert b[0] >= 0 and b[2] <= im.width and b[1] >= 0 and b[3] <= im.height, (value, b)
    text_bounds.append((value, [v/S for v in b]))
    d.text(xy(x,y), value, font=f, fill=fill, anchor="lt")

def rect(x,y,w,h,fill=None,outline=None,stroke=.14):
    d.rectangle((x*S,y*S,(x+w)*S,(y+h)*S), fill=fill, outline=outline,
                width=max(1,round(stroke*S)))

def line(points,fill=INK,width=.16):
    d.line([xy(*p) for p in points], fill=fill, width=max(1,round(width*S)), joint="curve")

def ellipse(x,y,w,h,fill):
    d.ellipse((x*S,y*S,(x+w)*S,(y+h)*S),fill=fill)

def dash(x1,y,x2):
    x=x1
    while x<x2:
        line([(x,y),(min(x+.85,x2),y)],width=.16)
        x+=1.45

def passenger(x,y,n):
    # The ONLY cut outline is an 8 × 47 rectangle. All internal marks are illustration.
    rect(x,y,WIDTH,6,fill="#f2d5b9")
    rect(x,y,WIDTH,1.15,fill=HAIRS[n%4])
    rect(x,y+1.15,.45,1.4,fill=HAIRS[n%4])
    rect(x+7.55,y+1.15,.45,1.4,fill=HAIRS[n%4])
    ellipse(x+2.15,y+2.6,.42,.42,INK)
    ellipse(x+5.43,y+2.6,.42,.42,INK)
    line([(x+3.1,y+4.3),(x+3.55,y+4.55),(x+4.45,y+4.55),(x+4.9,y+4.3)],width=.10)
    rect(x,y+6,WIDTH,HIP-6,fill=SHIRTS[n%4])
    # Neck, collar, arms and hands are printed, never separately cut.
    rect(x+3.15,y+6,1.7,1.15,fill="#f2d5b9")
    line([(x+2.7,y+7.2),(x+4,y+8),(x+5.3,y+7.2)],fill=GREY,width=.10)
    line([(x+1.55,y+9.3),(x+1.55,y+18.5),(x+2.15,y+19.4)],fill=GREY,width=.10)
    line([(x+6.45,y+9.3),(x+6.45,y+18.5),(x+5.85,y+19.4)],fill=GREY,width=.10)
    ellipse(x+1.7,y+19,.95,1.1,"#f2d5b9")
    ellipse(x+5.35,y+19,.95,1.1,"#f2d5b9")
    rect(x,y+HIP,WIDTH,LENGTH-HIP,fill="#d7dbe0")
    line([(x+4,y+HIP+1),(x+4,y+LENGTH-.4)],fill="#8d949c",width=.10)
    rect(x+.5,y+LENGTH-2.1,3.1,2.1,fill="#454954")
    rect(x+4.4,y+LENGTH-2.1,3.1,2.1,fill="#454954")

for row in range(ROWS):
    y=Y0+row*ROW_PITCH
    for col in range(COLS):
        passenger(X0+col*WIDTH,y,row*COLS+col)
    # Common straight cut lines make batch cutting easier.
    rect(X0,y,COLS*WIDTH,LENGTH,outline=INK,stroke=.17)
    for col in range(1,COLS):
        x=X0+col*WIDTH
        line([(x,y),(x,y+LENGTH)],width=.15)
    dash(X0,y+HIP,X0+COLS*WIDTH)
    dash(X0,y+KNEE,X0+COLS*WIDTH)

P=228
text(P,8,"HK-104",15,True)
text(P,16,"薄卡坐姿人仔",14,True)
text(P,26,"104個｜A4橫向",10,True)
text(P,33,"每人一件，只摺兩下。")
line([(P,40),(P+9,40)],width=.17)
text(P+11,38,"剪外框",9)
dash(P+30,40,P+39)
text(P+41,38,"摺",9)
text(P,46,"1 先壓虛線，再剪整行。")
text(P,52,"2 沿直線分成26個長方形。")
text(P,58,"3 上身摺起，膝部反向摺下。")
text(P,64,"頭向上，雙腿在座位前垂下。")
text(P,70,"手腳只印不剪，人仔不用膠。")
text(P,81,"側視放大示意",10,True)

# Side view from exactly the same model; only line thickness is exaggerated.
q=1.2
hx,hy=237,116
floor_y=hy+SEAT_HEIGHT*q
line([(P,floor_y),(286,floor_y)],fill="#acacac",width=.15)
line([(hx-.75,hy-14.7375*q),(hx-.75,hy+.35),(hx+SEAT_DEPTH*q,hy+.35)],
     fill=PINK,width=.65)
line([(hx+SEAT_DEPTH*q-1,hy+.5),(hx+SEAT_DEPTH*q-1,floor_y)],fill=PINK,width=.45)
line([(hx-1,hy+.5),(hx-1,floor_y)],fill=PINK,width=.45)
line([(hx,hy-HIP*q),(hx,hy),(hx+THIGH*q,hy),(hx+THIGH*q,hy+SHIN*q)],
     fill=BLUE,width=.55)
text(262,91,"面向車頭",9)
line([(265,100),(282,100)],width=.20)
line([(282,100),(280,99)],width=.20)
line([(282,100),(280,101)],width=.20)
text(P,136,"座面以上22；人仔闊8mm。")
text(P,142,"展開8 × 47；大腿長16mm。")
text(P,148,"頭頂至臀線22、膝線38mm。")
text(P,154,"小腿9mm，不用再摺腳掌。")
text(P,160,"先靠椅背坐好，再檢查腿位。")
text(P,170,"100% 實際大小",11,True)
text(P,177,"不要選「符合頁面／縮放」。")
text(P+16,183,"50mm",9,True)
line([(P+1,190),(P+51,190)],width=.20)
for tick in range(0,51,10):
    line([(P+1+tick,188.8),(P+1+tick,191.2)],width=.18)
text(P,194,"量校準線，先試1個再批量。")
text(P,200,"用薄卡，不用1mm灰硬卡。")

# Model and print checks; no physical-prototype claim.
assert COLS*ROWS == 104
assert WIDTH < SEAT_WIDTH
assert abs(THIGH-SEAT_DEPTH) < .05
assert 0 < SEAT_HEIGHT-SHIN < 1
assert HIP < UPPER_HEADROOM
assert Y0+(ROWS-1)*ROW_PITCH+LENGTH == 202
assert X0+COLS*WIDTH == 218
assert all(b[0] >= P-.1 and b[2] <= 287 for _,b in text_bounds)
target=(round(PAGE[0]*DPI/25.4),round(PAGE[1]*DPI/25.4))
im=im.resize(target,Image.Resampling.LANCZOS)
metadata=PngImagePlugin.PngInfo()
metadata.add_text("Title","HK-104 薄卡坐姿人仔：104個A4橫向列印圖")
metadata.add_text("Author","Perplexity Computer")
metadata.add_text("Instructions","A4 landscape; print at 100% actual size; verify the 50mm calibration line.")
metadata.add_text("Design","104 figures, each 8x47mm; folds 22 and 38mm from top; 1 piece, 2 folds; not physically prototyped.")
im.save(OUT,dpi=(DPI,DPI),pnginfo=metadata,optimize=True)
spec={
    "page_mm":PAGE,"png_pixels":target,"dpi":DPI,"count":COLS*ROWS,
    "grid":{"columns":COLS,"rows":ROWS,"origin_mm":[X0,Y0],"row_pitch_mm":ROW_PITCH},
    "figure_mm":{"width":WIDTH,"flat_length":LENGTH,"folds_from_top":[HIP,KNEE],
                 "above_seat":HIP,"thigh":THIGH,"shin":SHIN},
    "reference_seat_mm":{"width":SEAT_WIDTH,"depth":SEAT_DEPTH,"height":SEAT_HEIGHT},
    "nominal_clearance_mm":{"per_side":(SEAT_WIDTH-WIDTH)/2,
                            "below_shin":SEAT_HEIGHT-SHIN,
                            "above_head_upper_deck":UPPER_HEADROOM-HIP},
    "note":"Printed rectangular cutouts, not a realistic human proportion or physical fit certification.",
    "physical_prototype":False,
}
(HERE/"passenger-spec.json").write_text(json.dumps(spec,ensure_ascii=False,indent=2)+"\n",encoding="utf8")
print(f"PASS: {COLS*ROWS} figures; each {WIDTH}x{LENGTH}mm; folds {HIP}/{KNEE}mm; PNG {target}, 300dpi.")
print(f"Nominal seat side margin {(SEAT_WIDTH-WIDTH)/2:.3f}mm; below shin {SEAT_HEIGHT-SHIN:.3f}mm.")
print(OUT)
