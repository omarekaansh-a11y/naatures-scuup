from pathlib import Path
from PIL import Image

SOURCE = Path("/home/ubuntu/webdev-static-assets/naatures-scuup-logo-transparent.png")
OUTPUT = Path("/home/ubuntu/naatures-scuup/client/public")

logo = Image.open(SOURCE).convert("RGBA")
alpha = logo.getchannel("A")
bounds = alpha.getbbox()
if bounds is None:
    raise RuntimeError("The header-logo source does not contain visible pixels.")

left, top, right, bottom = bounds
width, height = right - left, bottom - top
padding = round(max(width, height) * 0.07)
cropped = logo.crop((max(0, left - padding), max(0, top - padding), min(logo.width, right + padding), min(logo.height, bottom + padding)))

def render_icon(size: int) -> Image.Image:
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    target_width = round(size * 0.92)
    target_height = round(cropped.height * target_width / cropped.width)
    if target_height > round(size * 0.86):
        target_height = round(size * 0.86)
        target_width = round(cropped.width * target_height / cropped.height)
    scaled = cropped.resize((target_width, target_height), Image.Resampling.LANCZOS)
    canvas.alpha_composite(scaled, ((size - target_width) // 2, (size - target_height) // 2))
    return canvas

master = render_icon(512)
master.save(OUTPUT / "favicon.png", format="PNG", optimize=True)
render_icon(180).save(OUTPUT / "apple-touch-icon.png", format="PNG", optimize=True)
master.save(OUTPUT / "favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])

print("Generated favicon.png, favicon.ico, and apple-touch-icon.png from the header-logo source.")
