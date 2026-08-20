"""Prepare the public Zomato menu sheets for local, column-aware OCR."""
from pathlib import Path
from PIL import Image, ImageEnhance, ImageOps

source = Path("/home/ubuntu/naatures-scuup/price-data/zomato-sheets")
target = Path("/home/ubuntu/naatures-scuup/price-data/zomato-ocr-crops")
target.mkdir(parents=True, exist_ok=True)

ids = [
    "ce3fbb03583e82719cf759c32bc162ee", "2f8f02c5a60778a4d08e7413dc8a8d14",
    "4b996fc72e82e3695993735262b28340", "54c91c25ab694d478e3d4ebcdbe8368d",
    "6243bba9f6c3d6b4058a66d9d18c7752", "927a7e387198569dca04b579d812b589",
    "fe46467ee46fa3d4d74bbda3015c28f1", "0faff00ce6026fa8eb2fcbfce3be2bd6",
]

for sheet_id in ids:
    image = Image.open(source / f"{sheet_id}.jpg").convert("L")
    width, height = image.size
    for column, box in (("left", (0, 0, width // 2, height)), ("right", (width // 2, 0, width, height))):
        crop = image.crop(box).resize((width * 2, height * 4), Image.Resampling.LANCZOS)
        crop = ImageEnhance.Contrast(crop).enhance(1.8)
        crop = ImageOps.autocontrast(crop)
        crop.save(target / f"{sheet_id}-{column}.png")
