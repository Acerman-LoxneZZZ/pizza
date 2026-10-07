"""Download verified freely licensed food photographs for this demo only.
Originals remain in a local cache; WebP derivatives retain EXIF provenance.
"""
import re, html, json, urllib.request, sys
from pathlib import Path
HERE=Path(__file__).resolve().parent
CACHE=Path.home()/'.cache/codex-pizza-video/faro-photos';CACHE.mkdir(parents=True,exist_ok=True)
photos=[
 ('menu-margherita','Ivan Torres','https://unsplash.com/photos/cheese-pizza-with-tomatoes-and-rosemary-MQUqbmszGGM','Unsplash License','https://unsplash.com/license'),
 ('menu-mushroom','ABHISHEK HAJARE','https://unsplash.com/photos/pizza-on-brown-wooden-round-tray-m5NJnJuhtJk','Unsplash License','https://unsplash.com/license'),
 ('menu-salsiccia','Shoeib Abolhassani','https://unsplash.com/photos/slices-of-pepperoni-and-sausage-pizza-on-a-wooden-board-LvszvdtNyB8','Unsplash License','https://unsplash.com/license'),
 ('menu-four-cheese','www.snack-nieuws.nl','https://commons.wikimedia.org/wiki/File:Pizza_-_quattro_formaggi_(34436873120).jpg','CC BY 2.0','https://creativecommons.org/licenses/by/2.0/'),
 ('prep-dough','Cohen Berg','https://unsplash.com/photos/person-shaping-pizza-dough-bWj1bG2hcZE','Unsplash License','https://unsplash.com/license'),
 ('prep-oven','Adhitya Sibikumar','https://unsplash.com/photos/chef-working-at-a-pizza-oven-in-a-restaurant-kitchen-n0YLKNwgbpI','Unsplash License','https://unsplash.com/license'),
]
records=[]
existing=json.loads((HERE/'photo-info.json').read_text(encoding='utf-8')) if (HERE/'photo-info.json').exists() else []
verified_urls={
 'menu-margherita':'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=max&w=1800&q=95',
 'menu-mushroom':'https://images.unsplash.com/photo-1604917877934-07d8d248d396?auto=format&fit=max&w=1800&q=95',
 'menu-salsiccia':'https://images.unsplash.com/photo-1778449015894-98ec9db8b134?auto=format&fit=max&w=1800&q=95',
 'menu-four-cheese':'https://upload.wikimedia.org/wikipedia/commons/d/d6/Pizza_-_quattro_formaggi_%2834436873120%29.jpg',
 'prep-dough':'https://images.unsplash.com/photo-1787005241125-25d65a8a9a14?auto=format&fit=max&w=1800&q=95',
 'prep-oven':'https://images.unsplash.com/photo-1771574206309-eda78f8afd03?auto=format&fit=max&w=1800&q=95',
}
for name,author,page,license,url in photos:
 image_url=verified_urls[name]
 file=CACHE/(name+'.jpg')
 if not file.exists():
  data=urllib.request.urlopen(urllib.request.Request(image_url,headers={'User-Agent':'FARO-demo-asset-preparation/1.0'}),timeout=50).read();file.write_bytes(data)
 else:data=file.read_bytes()
 records.append(dict(name=name,author=author,source=page,imageUrl=image_url,license=license,licenseUrl=url,active=name.startswith('prep-'),changes='Resize/WebP conversion; displayed crop. Illustrative stock image, not the actual FARO dish.'))
 print('PHOTO_READY',name,len(data),flush=True)
records.extend(row for row in existing if row.get('kind')=='generated-menu')
(HERE/'photo-info.json').write_text(json.dumps(records,ensure_ascii=False,indent=2),encoding='utf-8')
