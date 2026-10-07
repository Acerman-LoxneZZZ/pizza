# Project instructions

For frontend and scroll-animation work, use the project-installed skills:

- `.agents/skills/gsap-core/SKILL.md`
- `.agents/skills/gsap-scrolltrigger/SKILL.md`
- `.agents/skills/gsap-performance/SKILL.md`
- `.agents/skills/ui-ux-pro-max/SKILL.md`

Read the relevant skill before applying it. Use the remaining official GSAP skills when the task calls for their topic.

The user requires free tools and services. Keep the selected pizza source photographs intact. The user now authorizes a new real 3D pizza and explicitly requests a continuous camera approach and orbit that reveals the other side. Do not substitute image crossfades or cuts for camera motion. The project is a fictional demo website intended for sale.

The legacy preview is `assets/pizza-video/scroll-camera.html`. The active FARO presentation website is `assets/pizza-video/scene-3d/index.html`, served at `http://127.0.0.1:8765/scene-3d/`. Use full-viewport rendering, one preloaded scene, bounded device pixel ratio, and reduced motion. Preserve attribution for all third-party model assets. The menu and basket are explicitly illustrative: do not imply real payment or order transmission. Preserve the two camera holds and disable pointer-responsive floor lighting on narrow screens and with reduced motion.

Client-editable content lives in `scene-3d/site-config.js`. The runtime model is `pizza-web.glb`; keep `pizza.glb` and the Blender source as editable originals. Rebuild compression with `vendor-build/optimize-assets.mjs`. Camera exploration reuses the main canvas: OrbitControls must disconnect outside its modal so touch scrolling works normally. Keep menu size variants separate in the local basket. Preserve photo-info.json, credits.html and license/provenance notices. GitHub Pages publishes the portable static package through `.github/workflows/pages.yml`.
