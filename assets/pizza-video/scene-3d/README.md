# FARO — 3D camera prototype

Open through an HTTP server, not by double-clicking the HTML file:

    python -m http.server 8765 --bind 127.0.0.1

When the server root is `assets/pizza-video`, open http://127.0.0.1:8765/scene-3d/.

This is the first working prototype of a new pizza presentation. It uses a real, static 3D pizza and a moving perspective camera. Scrolling moves the camera through a 200-degree orbit and gradually closer to the pizza. There are no photo crossfades, image sequence decoding, or live shadow-map renders. The final view stays close to the pizza.

- Three.js, GSAP and ScrollTrigger are bundled locally. No paid service or runtime API.
- The scene is downloaded once, shaders are compiled before the loader disappears, and only changed frames render.
- Canvas fills the viewport. Desktop pixel ratio is capped at 2, mobile at 1.5, with an additional pixel budget.
- Native scrolling is preserved; a short GSAP scrub smooths the camera. Wheel, touch or keyboard input cancels the optional preview playback.
- `prefers-reduced-motion` displays a static view with ordinary page scrolling.
- The original photographs are untouched. This is a new pizza with prosciutto and rocket rather than the earlier pepperoni photo.

## Quality limitation

The public scan available here has 1024×1024 original textures. A local 4× restore improves its presentation but does not recover genuine lost detail. This prototype verifies geometry, camera motion and scene performance; it is not yet a final asset for extreme advertising macro photography.

## Files

- `pizza-source.blend`: normalized editable Blender scene.
- `pizza.glb`: website model, about 10.5 MB.
- `pizza-scene-source.js`: editable scene and scroll animation.
- `pizza-scene.js`: bundled browser runtime.
- `model-info.json`: exact source and preparation metadata.
- `ATTRIBUTION.md`: license, author credit and modifications. Keep this credit when selling or distributing the demo.

To rebuild the browser bundle, from `../vendor-build`:

    node -e 'require("esbuild").buildSync({entryPoints:["../scene-3d/pizza-scene-source.js"],nodePaths:["./node_modules"],bundle:true,format:"esm",minify:true,outfile:"../scene-3d/pizza-scene.js"})'

Per-frame diagnostic summaries are available in the canvas `data-diagnostics` attribute. Render timing is JavaScript submission time; it is not a GPU timing measurement or a guarantee for other devices.
