"""Generate the monochrome bitmap brand assets from public/brand/identity-original.jpg.

Requires Pillow (python -m pip install pillow). Run from the project root.
"""
from pathlib import Path
import random

from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parents[1]
BRAND = ROOT / "public" / "brand"
BRAND.mkdir(parents=True, exist_ok=True)


def eye_icon(size: int) -> Image.Image:
    image = Image.new("RGBA", (size, size), "black")
    draw = ImageDraw.Draw(image)
    radius_x, radius_y = size * 0.14, size * 0.18
    for center_x in (size * 0.34, size * 0.66):
        box = (center_x - radius_x, size * .5 - radius_y, center_x + radius_x, size * .5 + radius_y)
        draw.ellipse(box, fill="white")
        draw.ellipse((box[0] - 1, box[1] - 1, box[2] + 1, box[3] + 1), outline="#d8d8d8", width=max(1, size // 64))
    return image


for size, filename in ((180, "apple-touch-icon.png"), (192, "icon-192.png"), (512, "icon-512.png")):
    eye_icon(size).save(BRAND / filename, optimize=True)

eye_icon(64).save(BRAND / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])

source = Image.open(BRAND / "identity-original.jpg").convert("RGB")
cover = ImageOps.fit(source, (1200, 630), method=Image.Resampling.LANCZOS, centering=(.5, .46)).convert("RGBA")
overlay = Image.new("RGBA", cover.size, (0, 0, 0, 28))
ImageDraw.Draw(overlay).rectangle((0, 480, 1200, 630), fill=(0, 0, 0, 165))
cover = Image.alpha_composite(cover, overlay).convert("RGB")
font_path = Path("C:/Windows/Fonts/arialbd.ttf")
font = ImageFont.truetype(str(font_path), 82) if font_path.exists() else ImageFont.load_default()
draw = ImageDraw.Draw(cover)
draw.text((72, 504), "Raider", font=font, fill="white", stroke_width=1, stroke_fill="black")
cover.save(BRAND / "og-default.png", optimize=True)

# Seeded grayscale noise tile for a reproducible subtle film-grain layer.
rng = random.Random(713)
noise = Image.new("L", (256, 256))
noise.putdata([rng.randrange(256) for _ in range(256 * 256)])
noise.save(BRAND / "grain.png", optimize=True)

print("Generated favicon.ico, apple/icon PNGs, og-default.png, and grain.png")
