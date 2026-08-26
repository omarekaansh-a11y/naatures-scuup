from pathlib import Path

from PIL import Image

root = Path("/home/ubuntu/naatures-scuup")
source = Path("/home/ubuntu/webdev-static-assets/naatures-scuup-logo-transparent.png")
public = root / "client" / "public"

logo = Image.open(source).convert("RGBA")
alpha_bbox = logo.getchannel("A").getbbox()
if alpha_bbox is None:
    raise RuntimeError("The company logo has no visible alpha content.")

cropped = logo.crop(alpha_bbox)
canvas_size = 512
safe_area = 456
scale = min(safe_area / cropped.width, safe_area / cropped.height)
resized = cropped.resize((round(cropped.width * scale), round(cropped.height * scale)), Image.Resampling.LANCZOS)

canvas = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
offset = ((canvas_size - resized.width) // 2, (canvas_size - resized.height) // 2)
canvas.alpha_composite(resized, offset)

canvas.save(public / "favicon.png", format="PNG", optimize=True)
canvas.resize((180, 180), Image.Resampling.LANCZOS).save(public / "apple-touch-icon.png", format="PNG", optimize=True)
canvas.save(public / "favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])

print(f"Created favicon assets from cropped logo bounds {alpha_bbox}.")
