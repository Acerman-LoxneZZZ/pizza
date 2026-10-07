# FARO — presentation website

Run an HTTP server from `assets/pizza-video` and open http://127.0.0.1:8765/scene-3d/:

    python -m http.server 8765 --bind 127.0.0.1

This is a complete presentation demo for a fictional pizzeria. One static pizza and a moving perspective camera produce the continuous 200-degree scroll orbit, two reading holds and a final close view. Below are six illustrative menu items, dietary filters, individual images, native detail dialogs with 30/40 cm choices, a local demo basket, a three-step preparation story and a closing section. There is no order transmission or payment.

## Presentation features

- Optional camera exploration after the final hold: drag, wheel/pinch, arrow/zoom/reset buttons and keyboard alternatives. Closing restores the exact scroll-camera position. OrbitControls disconnect outside the dialog so native touch scrolling remains available.
- Basket sizes are separate variants; quantities, removal, validated persistence and a downloadable text summary include the selected size and price.
- `site-config.js` holds the brand, page metadata, palette, sizes, prices, recipes and local image paths. Price multipliers round to the nearest 10 roubles.
- All six menu illustrations use the same isolated studio composition, camera, crust silhouette, lighting and 1254×1254 format. They were created with the built-in image generator, using the owner's selected pepperoni as the master reference. Only toppings change. PNG sources and exact prompts are in `media/menu-session/`; the browser uses quality-94 WebP derivatives with alpha.
- The menu preview starts empty and changes only on a dish-name click. Hover, keyboard focus, filters and quick-add do not change it. A fixed-size sticky stage keeps the selected pizza stable on desktop; on narrow screens an explicit choice scrolls to its preview. Click the preview or “Выбрать размер” to open details.
- Preparation photos cycle every five seconds while the gallery is visible. Pause/resume and direct selection remain available. Manual selection pauses autoplay; leaving the viewport, a hidden tab or reduced motion stops it.
- Three.js, MeshoptDecoder, GSAP and ScrollTrigger are bundled locally. No paid runtime/API service.
- The browser model is 3,552,568 bytes, down from 10,502,924 bytes. WebP textures and Meshopt geometry compression preserve texture dimensions; GPU texture memory is not compressed.
- A local WebP poster shows immediately, shaders compile before readiness, and only changed frames render. Canvas fills the viewport; DPR is capped at 2 desktop/1.5 narrow screens plus a pixel budget.
- Native scrolling is preserved. A short scrub smooths the camera; wheel, touch or keyboard input cancels optional story playback. Reduced motion uses a static scene and ordinary scrolling.
- A subtle warm highlight follows a fine pointer on the floor, adding no draw calls. It is disabled at 700px and below, with reduced motion, and during manual inspection.
- Fonts, photos and runtime are self-hosted; there are no external image/font/API requests during use.

## Quality boundary

The Rigsters scan has a genuine 1024×1024 original diffuse texture. The locally restored 4096×4096 derivative improves presentation but is an upscale, not a new 4K scan or recovered lost detail. Lighting/material refinements and lower transfer weight do not change that limit. Measurements on the local desktop browser are not physical-phone performance guarantees. The original selected photographs are untouched.

## Important files

- `site-config.js`: client-editable content.
- `pizza-source.blend`, `pizza.glb`: editable normalized scan and original export.
- `pizza-web.glb`: compressed browser model.
- `pizza-scene-source.js`, `pizza-scene.js`: scene source and built runtime.
- `site.js`, `style.css`: native interactions and responsive design.
- `media/menu-session/`: matching menu illustrations, PNG originals, WebP delivery assets, provenance sidecars and `prompts.json`.
- `media/*.webp`: preparation/poster derivatives. Retired mixed menu source records remain in photo-info.json; unused derivatives have been removed, cached original photographs remain intact.
- `media/FARO-teaser.mp4`: 8-second 1600×900, 24fps continuous camera teaser. This is a separate portfolio asset; the website uses the interactive scene.
- `photo-info.json`, `credits.html`, `ATTRIBUTION.md`: image/model sources, authors, licenses and changes.
- `fonts/`, `THREE-LICENSE.txt`, `MESHOPTIMIZER-LICENSE.txt`: redistribution notices.
- `render_menu_assets.py`, `render_portfolio.py`: reproducible local Blender renders of the licensed scan.
- `build_credits.py`: regenerate current source credits without losing retired provenance.

Keep attribution and license notices when selling or distributing the demo. Replace demo recipes/photos with the client's own material for a real restaurant.

## Build and delivery

From `../vendor-build`, after `npm ci`:

    node optimize-assets.mjs
    node -e 'require("esbuild").buildSync({entryPoints:["../scene-3d/pizza-scene-source.js"],nodePaths:["./node_modules"],bundle:true,format:"esm",minify:true,outfile:"../scene-3d/pizza-scene.js"})'

From the repository root, run `python assets/pizza-video/scene-3d/package_website.py`. The portable ZIP includes the reviewed website, compressed model, local fonts/images, license/provenance notices and teaser. Development tools, Blender source and intermediate video frames remain outside the package. Run an HTTP server from the unpacked folder, or publish both `scene-3d/` and `vendor/` to a static host.

The GitHub Pages workflow packages this same static build on pushes to main. The repository is https://github.com/Acerman-LoxneZZZ/pizza . Per-frame summaries are in canvas `data-diagnostics`; rendering timings measure JavaScript submission, not GPU work.
