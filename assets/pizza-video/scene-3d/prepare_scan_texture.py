"""Prepare a locally restored diffuse texture. Original scan stays untouched."""
import io
import json
import struct
import subprocess
from pathlib import Path
from PIL import Image

CACHE = Path.home() / '.cache/codex-pizza-video'
SOURCE = CACHE / 'model-candidates/rigsters-pizza.glb'
WORK = CACHE / 'model-candidates/rigsters-prepared'
WORK.mkdir(exist_ok=True)
data = SOURCE.read_bytes()
json_length, _ = struct.unpack_from('<II', data, 12)
gltf = json.loads(data[20:20 + json_length])
bin_offset = 20 + json_length + 8
view = gltf['bufferViews'][gltf['images'][1]['bufferView']]
start = bin_offset + view.get('byteOffset', 0)
source_texture = WORK / 'diffuse-original.png'
Image.open(io.BytesIO(data[start:start + view['byteLength']])).convert('RGB').save(source_texture)
restored_texture = WORK / 'diffuse-restored.png'
exe = CACHE / 'realesrgan/realesrgan-ncnn-vulkan.exe'
if not restored_texture.exists():
    subprocess.run([str(exe), '-i', str(source_texture), '-o', str(restored_texture),
                    '-n', 'realesrgan-x4plus', '-m', str(exe.parent / 'models'),
                    '-s', '4', '-t', '256', '-g', '0', '-j', '1:1:2'], check=True)
with Image.open(source_texture) as original, Image.open(restored_texture) as restored:
    # Keep most of the actual photographic data; restoration supplies only part
    # of the high-frequency appearance and is not claimed to recover real detail.
    native = original.resize(restored.size, Image.Resampling.LANCZOS)
    Image.blend(native, restored.convert('RGB'), .4).save(WORK / 'diffuse-4k.jpg', quality=96, subsampling=0)
print('Diffuse prepared:', WORK / 'diffuse-4k.jpg', flush=True)
