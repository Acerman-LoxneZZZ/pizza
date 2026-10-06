# FARO — presentation website

Open through an HTTP server, not by double-clicking the HTML file:

    python -m http.server 8765 --bind 127.0.0.1

When the server root is `assets/pizza-video`, open http://127.0.0.1:8765/scene-3d/.

This is a complete presentation demo for a fictional pizzeria. It uses one static 3D pizza and a moving perspective camera. The scroll story includes a 200-degree orbit, two camera holds with clipped text entrances, and a final close view. Below it are a six-item illustrative menu, dietary filters, a local basket, a brand story and a closing section. The basket supports quantities, removal, persistence and a downloadable text summary. It does not send an order or accept payment.

- Three.js, GSAP and ScrollTrigger are bundled locally. No paid service or runtime API.
- The scene is downloaded once, shaders are compiled before the loader disappears, and only changed frames render.
- Canvas fills the viewport. Desktop pixel ratio is capped at 2, mobile at 1.5, with an additional pixel budget.
- Native scrolling is preserved; a short GSAP scrub smooths the camera. Wheel, touch or keyboard input cancels the optional preview playback.
- `prefers-reduced-motion` displays a static view with ordinary page scrolling.
- A warm highlight follows a fine pointer across the table through the floor shader. It adds no draw calls and does not move the pizza or change its materials. It is disabled below 700px and with reduced motion.
- All fonts and the studio still are served locally. No external font, image or API request is needed at runtime.
- The original photographs are untouched. This is a new pizza with prosciutto and rocket rather than the earlier pepperoni photo.

## Quality limitation

The public scan available here has 1024×1024 original textures. A local 4× restore improves its presentation but does not recover genuine lost detail. Extreme advertising macro photography remains beyond the texture's original detail, even though the website and menu interactions are ready for presentation.

## Files

- `pizza-source.blend`: normalized editable Blender scene.
- `pizza.glb`: website model, about 10.5 MB.
- `pizza-scene-source.js`: editable scene and scroll animation.
- `pizza-scene.js`: bundled browser runtime.
- `site.js`: navigation, menu filters and the demo basket.
- `style.css`: responsive typography, palette, layouts and motion states.
- `media/pizza-studio.png`: transparent Blender render of the same pizza, with embedded provenance.
- `render_presentation_still.py`: the reproducible studio-render setup.
- `fonts/`: self-hosted Latin/Cyrillic WOFF2 subsets and their SIL OFL notices.
- `model-info.json`: exact source and preparation metadata.
- `ATTRIBUTION.md`: license, author credit and modifications. Keep this credit when selling or distributing the demo.

To rebuild the browser bundle, from `../vendor-build`:

    node -e 'require("esbuild").buildSync({entryPoints:["../scene-3d/pizza-scene-source.js"],nodePaths:["./node_modules"],bundle:true,format:"esm",minify:true,outfile:"../scene-3d/pizza-scene.js"})'

Per-frame diagnostic summaries are available in the canvas `data-diagnostics` attribute. Render timing is JavaScript submission time; it is not a GPU timing measurement or a guarantee for other devices.

## Portable presentation

From the repository root, run `python assets/pizza-video/scene-3d/package_website.py`. This writes `assets/pizza-video/FARO-presentation.zip` with the website, model, fonts, attribution and bundled animation libraries. The archive excludes development tools and the editable Blender source, which remain in the repository. Run an HTTP server from the unpacked folder or upload both `scene-3d/` and `vendor/` to a static host.
