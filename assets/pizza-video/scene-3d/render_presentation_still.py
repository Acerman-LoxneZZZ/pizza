"""Render the existing licensed model as a locally produced presentation asset."""
from pathlib import Path
import bpy
from mathutils import Vector

HERE = Path(__file__).resolve().parent
bpy.ops.wm.open_mainfile(filepath=str(HERE / 'pizza-source.blend'))
scene = bpy.context.scene
scene.render.engine = 'CYCLES'
scene.cycles.samples = 48
scene.cycles.use_denoising = True
prefs = bpy.context.preferences.addons['cycles'].preferences
try:
    prefs.compute_device_type = 'OPTIX'
    prefs.get_devices()
    for device in prefs.devices:
        device.use = device.type != 'CPU'
    scene.cycles.device = 'GPU'
except Exception:
    scene.cycles.device = 'CPU'
scene.render.resolution_x = 1600
scene.render.resolution_y = 1600
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = 'PNG'
scene.render.image_settings.color_mode = 'RGBA'
scene.render.film_transparent = True
scene.render.filepath = str(HERE / 'media/pizza-studio.png')
scene.view_settings.view_transform = 'AgX'
scene.view_settings.exposure = -.25
world = bpy.data.worlds.new('Faro studio')
world.use_nodes = True
world.node_tree.nodes['Background'].inputs[0].default_value = (.62,.60,.55,1)
world.node_tree.nodes['Background'].inputs[1].default_value = .45
scene.world = world
def area(name, location, energy, size, color):
    data = bpy.data.lights.new(name, 'AREA')
    data.energy = energy
    data.shape = 'DISK'
    data.size = size
    data.color = color
    obj = bpy.data.objects.new(name, data)
    scene.collection.objects.link(obj)
    obj.location = location
    obj.rotation_euler = (Vector((0,0,.2)) - obj.location).to_track_quat('-Z','Y').to_euler()
area('Large soft key', (-4,-5,8), 850, 5, (1,.87,.73))
area('Soft edge', (4,3,6), 550, 4, (.9,.94,1))
bpy.ops.mesh.primitive_plane_add(size=200, location=(0,0,-.008))
floor = bpy.context.object
floor.is_shadow_catcher = True
material = bpy.data.materials.new('Matte studio floor')
material.diffuse_color = (.3,.3,.28,1)
floor.data.materials.append(material)
camera_data = bpy.data.cameras.new('Presentation still')
camera = bpy.data.objects.new('Presentation still', camera_data)
scene.collection.objects.link(camera)
camera.location = (2.2,-6.5,8.6)
camera.rotation_euler = (Vector((0,0,.15)) - camera.location).to_track_quat('-Z','Y').to_euler()
camera_data.lens = 45
scene.camera = camera
bpy.ops.render.render(write_still=True)
print('Presentation still rendered', scene.render.filepath, flush=True)
