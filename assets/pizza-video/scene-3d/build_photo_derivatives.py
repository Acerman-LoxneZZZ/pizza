"""Build stock-photo WebP derivatives. Originals and current menu session are untouched."""
from pathlib import Path
import json, sys, runpy
HERE=Path(__file__).resolve().parent
sys.path.insert(0,str(HERE.parents[2]/'.video-tools'))
from PIL import Image
CACHE=Path.home()/'.cache/codex-pizza-video/faro-photos'
records=json.loads((HERE/'photo-info.json').read_text(encoding='utf-8'))
for row in records:
    if 'imageUrl' not in row or not row.get('active', False):
        continue
    image=Image.open(CACHE/(row['name']+'.jpg'));image.thumbnail((1600,1600))
    exif=image.getexif();exif[270]=row['source']+'; '+row['changes'];exif[33432]=row['author']+' / '+row['license']+' / '+row['licenseUrl']
    image.save(HERE/'media'/(row['name']+'.webp'),quality=94,method=6,exif=exif)
runpy.run_path(str(HERE/'build_credits.py'),run_name='__main__')
print('Built stock-photo derivatives; generated menu session unchanged.')
