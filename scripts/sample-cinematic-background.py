from collections import Counter
from pathlib import Path

from PIL import Image


def sample_edge_pixels(image_path: str) -> None:
    image = Image.open(image_path).convert("RGB")
    width, height = image.size
    coordinates = [
        (2, 2),
        (width - 3, 2),
        (2, height - 3),
        (width - 3, height - 3),
        (width // 2, 2),
        (width // 2, height - 3),
        (0, height // 2),
        (64, height // 2),
        (128, height // 2),
        (129, height // 2),
        (130, height // 2),
        (160, height // 2),
    ]
    samples = [image.getpixel(point) for point in coordinates]
    print({"path": image_path, "size": image.size, "samples": samples, "most_common": Counter(samples).most_common(3)})


sample_edge_pixels("/home/ubuntu/cinematic-story-variety.png")
sample_edge_pixels("/home/ubuntu/cinematic-story-parlour.png")
