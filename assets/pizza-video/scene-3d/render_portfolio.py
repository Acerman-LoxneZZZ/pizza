"""Render a short continuous 3D camera teaser, using only local Blender/FFmpeg.
Licensed Pizza scan by Rigsters / CC BY 4.0; same static pizza throughout.
"""
import bpy, math
from pathlib import Path
from mathutils import Vector
HERE=Path(__file__).resolve().parent
OUT=HERE/'portfolio-frames';OUT.mkdir(exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=str(HERE/'pizza-source.blend'))
scene=bpy.context.scene;scene.render.engine='BLENDER_EEVEE_NEXT'
if hasattr(scene.eevee,'taa_render_samples'):scene.eevee.taa_render_samples=16
scene.render.resolution_x=1600;scene.render.resolution_y=900;scene.render.resolution_percentage=100
scene.render.image_settings.file_format='PNG';scene.render.image_settings.color_mode='RGB';scene.render.film_transparent=False
scene.view_settings.view_transform='AgX';scene.view_settings.exposure=-.4
world=bpy.data.worlds.new('Charcoal studio');world.use_nodes=True
world.node_tree.nodes['Background'].inputs[0].default_value=(.15,.15,.13,1);world.node_tree.nodes['Background'].inputs[1].default_value=.5;scene.world=world
for name,pos,power,size,color in [('Key',(-4,-5,8),1100,5,(1,.88,.74)),('Rim',(4,3,6),450,4,(.9,.94,1))]:
 d=bpy.data.lights.new(name,'AREA');d.energy=power;d.shape='DISK';d.size=size;d.color=color;o=bpy.data.objects.new(name,d);scene.collection.objects.link(o);o.location=pos;o.rotation_euler=(Vector((0,0,.2))-o.location).to_track_quat('-Z','Y').to_euler()
bpy.ops.mesh.primitive_plane_add(size=200,location=(0,0,-.006));m=bpy.data.materials.new('Graphite');m.diffuse_color=(.035,.038,.029,1);bpy.context.object.data.materials.append(m)
d=bpy.data.cameras.new('Teaser');o=bpy.data.objects.new('Teaser',d);scene.collection.objects.link(o);d.lens=48;scene.camera=o
for i in range(192):
 p=i/191;q=p*p*(3-2*p);a=math.radians(20+200*q);e=math.radians(38+20*math.sin(p*math.pi));distance=12-5*q
 o.location=(math.sin(a)*math.cos(e)*distance,math.cos(a)*math.cos(e)*distance,math.sin(e)*distance+.2)
 o.rotation_euler=(Vector((0,0,.2))-o.location).to_track_quat('-Z','Y').to_euler()
 scene.render.filepath=str(OUT/f'{i:04d}.png');bpy.ops.render.render(write_still=True)
 if i%24==0:print('TEASER_FRAME',i,flush=True)
print('TEASER_READY 192 frames / 8 seconds / 1600x900',flush=True)
