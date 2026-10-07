# FARO

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The owner presents and may sell a fictional pizzeria website. Visitors explore the pizza and browse a demonstration menu. The user explicitly delegated composition, content and interaction decisions.

## Product Purpose

Expand the existing working 3D prototype into a complete, presentable restaurant concept with a distinctive design, a menu, usable demo interactions and a paced scroll story.

The expanded presentation adds six individual menu illustrations, 30/40 cm size selection with separate basket variants, an optional camera inspection dialog with drag and keyboard/button controls, and three preparation images. Brand, colors, sizes and menu data are editable in site-config.js. A portable archive, continuous-camera teaser and free GitHub Pages publication make it shareable.

## Capabilities and Constraints

Use free tools and services. Preserve the original photographs. Preserve the real static pizza model and move the camera around it to reveal the other side. No photo crossfades or cuts as a substitute for the orbit. The user explicitly requests camera holds and text entrances during scrolling. Keep ordinary scrolling, keyboard access and reduced motion.

The project already uses static HTML/CSS, Three.js, GSAP and ScrollTrigger. The GitHub destination is Acerman-LoxneZZZ/pizza. No real restaurant, contact details, ordering backend, payment service or booking system has been supplied. Menu names and prices are authored demonstration data, clearly identified as such. Do not invent reviews, ratings, awards or real business addresses.

## Brand Commitments

FARO is the existing fictional concept. Expand its recognizable wordmark, food focus, charcoal scene and warm accent. The user asks for a crafted design rather than generic AI templates, and delegates the rest.

## Evidence on Hand

The licensed Rigsters pizza scan, normalized Blender source, restored texture and bundled runtime are in assets/pizza-video/scene-3d. The scan's genuine diffuse resolution is 1024×1024. Local restoration is not a new high-resolution scan. Existing desktop and mobile emulation showed near-60fps camera movement; this is not a claim about physical phones.

The browser model uses Meshopt geometry compression and WebP textures, reducing transfer from 10,502,924 to 3,552,568 bytes without changing texture dimensions. GPU texture memory is not compressed by this transfer optimization. The current menu is a coherent set of six generated cutout illustrations, using the owner's unchanged pepperoni original as reference. Exact prompts/origins are retained; third-party preparation photo credits remain in photo-info.json and credits.html.

The menu preview appears and changes only after an explicit dish-name click. Keep its desktop sticky stage stable; on narrow screens bring the selected preview into view. Preparation photography cycles every five seconds while visible, with pause/resume, manual selection and reduced-motion support.

## Product Principles

- Food and camera motion carry the presentation.
- Camera pauses give visitors time to read.
- Menu browsing works independently of the 3D scene.
- Every visible control has a useful, honest action.
- Presentation data must not imply real orders or transactions.
