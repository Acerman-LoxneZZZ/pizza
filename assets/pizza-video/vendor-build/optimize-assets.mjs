import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dedup, prune, meshopt, textureCompress } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';
import sharp from 'sharp';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const directory = new URL('../scene-3d/', import.meta.url);
await MeshoptEncoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder,
});
const doc = await io.read(fileURLToPath(new URL('pizza.glb', directory)));
await doc.transform(dedup(), prune(), textureCompress({ encoder: sharp, targetFormat: 'webp', quality: 92, effort: 6 }), meshopt({ encoder: MeshoptEncoder, level: 'high' }));
const result = await io.writeBinary(doc);
await fs.writeFile(new URL('pizza-web.glb', directory), result);
console.log(JSON.stringify({ originalBytes: (await fs.stat(new URL('pizza.glb', directory))).size, webBytes: result.length, textures: doc.getRoot().listTextures().map(t => ({ name: t.getName(), mime: t.getMimeType(), size: t.getSize() })) }));
// Source PNGs keep their provenance. Shipping WebPs carry EXIF origin metadata.
for (const file of await fs.readdir(new URL('media/', directory))) {
  if (!file.endsWith('.png')) continue;
  const origin = file.startsWith('menu-prosciutto') || file==='pizza-studio.png'
    ? 'Local Blender render of modified Pizza scan by Rigsters, CC BY 4.0. https://sketchfab.com/3d-models/pizza-40d50989fec1460f8838b608d999ccd0'
    : 'Local Blender/Cycles render of authored procedural illustrative food geometry. Source: render_menu_assets.py. No remote generator.';
  await sharp(fileURLToPath(new URL('media/'+file, directory))).webp({ quality: 92, effort: 6 }).withExif({ IFD0: { ImageDescription: origin, Copyright: file.startsWith('menu-prosciutto') || file==='pizza-studio.png' ? 'Rigsters / CC BY 4.0; modifications and local render.' : 'FARO demonstration asset; authored procedural render.' }}).toFile(fileURLToPath(new URL('media/'+file.replace('.png','.webp'), directory)));
}
