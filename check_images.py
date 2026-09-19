import os
from PIL import Image

def scan_dir(d):
    for root, dirs, files in os.walk(d):
        for f in files:
            if f.lower().endswith(('.jpg', '.png', '.webp')):
                p = os.path.join(root, f)
                try:
                    with Image.open(p) as img:
                        print(f"{p}: {img.size}")
                except Exception as e:
                    pass

scan_dir('/home/Neelesh/Desktop/EatBit/public')
