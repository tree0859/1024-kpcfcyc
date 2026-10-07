"""Crop the user's artwork; no synthetic repainting of text or faces."""
from pathlib import Path
from PIL import Image
import sys

root = Path(__file__).resolve().parent / "livery-assets"
root.mkdir(exist_ok=True)
source = Image.open(sys.argv[1]).convert("RGB")
if source.size != (1536, 1024):
    raise ValueError("Crop coordinates require the supplied 1536×1024 artwork")
source.save(root / "reference.png", optimize=True)
crops = {
    "banner-left": (367, 94, 1096, 146),
    "banner-right": (439, 427, 1100, 482),
    "front-route": (413, 744, 606, 782),
    "front-bottom": (401, 879, 615, 944),
    "front-light-left": (410, 885, 448, 923),
    "front-light-right": (569, 885, 607, 923),
    "plate": (482, 921, 535, 938),
    "rear-route": (990, 735, 1047, 768),
    "rear-grille": (921, 793, 1117, 841),
    "rear-bottom": (912, 847, 1127, 944),
    "door": (246, 148, 335, 294),
    "window": (269, 38, 340, 84),
    "wheel": (357, 234, 440, 317),
}
for name, box in crops.items():
    source.crop(box).save(root / f"{name}.png", optimize=True)
print(f"Saved reference and {len(crops)} original-image crops")
