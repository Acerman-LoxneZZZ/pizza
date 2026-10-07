"""Local studio render of the attributed Rigsters pizza scan with subtle material relief."""
import bpy
from pathlib import Path
from mathutils import Vector
HERE=Path(__file__).resolve().parent
OUT=HERE/"media"
OUT.mkdir(exist_ok=True)

def studio():
    scene=bpy.context.scene; scene.render.engine='CYCLES'; scene.cycles.samples=48; scene.cycles.use_denoising=True
    try:
        pref=bpy.context.preferences.addons['cycles'].preferences;pref.compute_device_type='OPTIX';pref.get_devices()
        for d in pref.devices:d.use=d.type!='CPU'
        scene.cycles.device='GPU'
    except Exception:pass
    scene.render.resolution_x=1400;scene.render.resolution_y=1400;scene.render.resolution_percentage=100
    scene.render.image_settings.file_format='PNG';scene.render.image_settings.color_mode='RGBA';scene.render.film_transparent=True
    scene.view_settings.view_transform='AgX';scene.view_settings.exposure=-.35
    w=bpy.data.worlds.new('Soft studio');w.use_nodes=True;w.node_tree.nodes['Background'].inputs[0].default_value=(.58,.55,.49,1);w.node_tree.nodes['Background'].inputs[1].default_value=.32;scene.world=w
    for name,pos,energy,size,color in [('Soft key',(-4,-5,8),950,4,(1,.86,.7)),('Edge',(4,3,6),450,3.5,(.9,.94,1))]:
        d=bpy.data.lights.new(name,'AREA');d.energy=energy;d.shape='DISK';d.size=size;d.color=color;o=bpy.data.objects.new(name,d);scene.collection.objects.link(o);o.location=pos;o.rotation_euler=(Vector((0,0,.2))-o.location).to_track_quat('-Z','Y').to_euler()
    bpy.ops.mesh.primitive_plane_add(size=200,location=(0,0,-.008));bpy.context.object.is_shadow_catcher=True
    d=bpy.data.cameras.new('Menu camera');o=bpy.data.objects.new('Menu camera',d);scene.collection.objects.link(o);o.location=(1.6,-5.5,9.7);o.rotation_euler=(Vector((0,0,.18))-o.location).to_track_quat('-Z','Y').to_euler();d.lens=48;scene.camera=o
    return scene

def render(name,scene):
    scene.render.filepath=str(OUT/(name+'.png'));bpy.ops.render.render(write_still=True);print('ASSET_READY',name,flush=True)

# The licensed main pizza retains its actual shape and topping positions.
bpy.ops.wm.open_mainfile(filepath=str(HERE/'pizza-source.blend'))
for o in list(bpy.context.scene.objects):
    if o.type!='MESH':bpy.data.objects.remove(o,do_unlink=True)
for m in bpy.data.materials:
    if m.use_nodes:
        p=m.node_tree.nodes.get('Principled BSDF')
        if p:
            p.inputs['Roughness'].default_value=.58
            image=next((n for n in m.node_tree.nodes if n.type=='TEX_IMAGE'),None)
            if image:
                b=m.node_tree.nodes.new('ShaderNodeBump');b.inputs['Strength'].default_value=.16;b.inputs['Distance'].default_value=.025
                m.node_tree.links.new(image.outputs['Color'],b.inputs['Height']);m.node_tree.links.new(b.outputs['Normal'],p.inputs['Normal'])
scene=studio();render('menu-prosciutto',scene)
