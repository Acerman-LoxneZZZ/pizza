"""Normalize the licensed scan in Blender and save the editable source + glTF."""
import bpy
import json
from pathlib import Path
from mathutils import Vector

HERE = Path(__file__).resolve().parent
CACHE = Path.home() / '.cache/codex-pizza-video/model-candidates'
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=str(CACHE / 'rigsters-pizza.glb'))
for obj in list(bpy.data.objects):
    if obj.type == 'MESH' and 'pizza' not in obj.name.lower():
        bpy.data.objects.remove(obj, do_unlink=True)
objects = [obj for obj in bpy.context.scene.objects if obj.type == 'MESH']
for obj in objects:
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    world = obj.matrix_world.copy()
    obj.parent = None
    obj.matrix_world = world
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    obj.select_set(False)
points = [obj.matrix_world @ Vector(p) for obj in objects for p in obj.bound_box]
lo = Vector([min(p[i] for p in points) for i in range(3)])
hi = Vector([max(p[i] for p in points) for i in range(3)])
scale = 6 / max(hi.x - lo.x, hi.y - lo.y)
center = Vector(((lo.x + hi.x) / 2, (lo.y + hi.y) / 2, lo.z))
for obj in objects:
    for vertex in obj.data.vertices:
        vertex.co = (vertex.co - center) * scale
    for mat in obj.data.materials:
        if not mat or not mat.use_nodes:
            continue
        bsdf = next((n for n in mat.node_tree.nodes if n.type == 'BSDF_PRINCIPLED'), None)
        if bsdf:
            base_input = bsdf.inputs['Base Color']
            if base_input.is_linked:
                image_node = base_input.links[0].from_node
                if image_node.type == 'TEX_IMAGE':
                    image_node.image = bpy.data.images.load(str(CACHE / 'rigsters-prepared/diffuse-4k.jpg'))
                    image_node.image.pack()
            bsdf.inputs['Metallic'].default_value = 0
    obj.name = 'Faro_Pizza_Scan'
    obj.select_set(True)
HERE.mkdir(exist_ok=True)
bpy.ops.wm.save_as_mainfile(filepath=str(HERE / 'pizza-source.blend'))
bpy.ops.export_scene.gltf(filepath=str(HERE / 'pizza.glb'), export_format='GLB',
                          use_selection=True, export_image_format='AUTO',
                          export_yup=True, export_extras=True)
(HERE / 'model-info.json').write_text(json.dumps({
    'source': 'https://sketchfab.com/3d-models/pizza-40d50989fec1460f8838b608d999ccd0',
    'author': 'Rigsters', 'license': 'CC BY 4.0',
    'originalDiffuse': [1024, 1024], 'restoredDiffuse': [4096, 4096],
    'restoration': 'Real-ESRGAN x4plus blended 40% with Lanczos-resampled original',
    'changes': 'Removed serving board, centered and scaled the scan; diffuse restoration.',
    'originalBoundsBlender': {'min': list(lo), 'max': list(hi)},
    'normalizationScale': scale,
    'triangles': sum(len(obj.data.polygons) for obj in objects)
}, indent=2), encoding='utf-8')
print('Prepared pizza', [list(obj.dimensions) for obj in objects], flush=True)
