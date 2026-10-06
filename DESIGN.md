---
name: FARO
description: A charcoal, warm paper and tomato system for a fictional pizzeria presentation.
colors:
  ink: "#191b16"
  paper: "#f1ede2"
  tomato: "#e66744"
  muted: "#c5c2b5"
  tomato-on-paper: "#ac4028"
  inset-paper: "#deddd0"
  action-hover: "#3c4233"
typography:
  display:
    fontFamily: "Literata, Georgia, serif"
    fontSize: "clamp(48px, 5.5vw, 88px)"
    fontWeight: 450
    lineHeight: 1.08
    letterSpacing: "-.035em"
  scene-headline:
    fontFamily: "Literata, Georgia, serif"
    fontSize: "clamp(44px, 4.5vw, 72px)"
    fontWeight: 450
    lineHeight: 1.08
    letterSpacing: "-.035em"
  menu-headline:
    fontFamily: "Literata, Georgia, serif"
    fontSize: "clamp(48px, 5.8vw, 90px)"
    fontWeight: 450
    lineHeight: 1.08
    letterSpacing: "-.035em"
  about-headline:
    fontFamily: "Literata, Georgia, serif"
    fontSize: "clamp(40px, 3.8vw, 62px)"
    fontWeight: 450
    lineHeight: 1.08
    letterSpacing: "-.035em"
  closing-headline:
    fontFamily: "Literata, Georgia, serif"
    fontSize: "clamp(48px, 6vw, 92px)"
    fontWeight: 450
    lineHeight: 1.08
    letterSpacing: "-.035em"
  title:
    fontFamily: "Literata, Georgia, serif"
    fontSize: "25px"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "-.02em"
  dialog-title:
    fontFamily: "Literata, Georgia, serif"
    fontSize: "35px"
    fontWeight: 450
    lineHeight: 1.08
    letterSpacing: "-.035em"
  body:
    fontFamily: "Golos, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.75
  scene-body:
    fontFamily: "Golos, Arial, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.7
  menu-body:
    fontFamily: "Golos, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Golos, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 400
  caption:
    fontFamily: "Golos, Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 400
  wordmark:
    fontFamily: "Golos, Arial, sans-serif"
    fontSize: "36px"
    fontWeight: 850
    lineHeight: .82
    letterSpacing: "-.03em"
  wordmark-tagline:
    fontFamily: "Golos, Arial, sans-serif"
    fontSize: "11px"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: ".16em"
rounded:
  sharp: "0"
  circle: "50%"
spacing:
  compact: "8px"
  small: "12px"
  control: "16px"
  regular: "24px"
  panel: "32px"
  generous: "40px"
  gutter: "clamp(24px, 4.2vw, 80px)"
components:
  link-action:
    typography: "{typography.label}"
    padding: "10px 0"
  add-button:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.circle}"
    size: "48px"
  add-button-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.circle}"
    size: "48px"
  signature-add:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    padding: "8px 0 8px 16px"
  save-selection:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.sharp}"
    padding: "18px 22px"
    width: "100%"
  save-selection-hover:
    backgroundColor: "{colors.action-hover}"
    textColor: "{colors.paper}"
  menu-filter:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    padding: "8px 0"
  quantity-button:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.circle}"
    size: "44px"
  quantity-button-hover:
    backgroundColor: "{colors.inset-paper}"
  menu-row:
    backgroundColor: "{colors.tomato}"
    textColor: "{colors.ink}"
    padding: "25px 0"
  navigation:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    height: "98px"
  cart-panel:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sharp}"
    width: "min(520px, 100%)"
    height: "100%"
---

# Design System: FARO

## Overview

**Creative North Star: "FARO's shared table"**

FARO presents food as the centre of an evening together. Its established world combines a charcoal stage, warm paper, a tomato field, large literary headings and compact practical controls. The tone is warm and direct; space around the food and text supplies the confidence.

The built surface uses generous asymmetry, open menu rows and a single physical pizza model. Motion approaches and orbits that model, pausing for text. Below the scene, flat colour fields and a locally rendered still carry the same identity. This is the documented incumbent system, extracted from the finished presentation rather than a replacement direction.

**Key Characteristics:**

- Large Literata headings with italic emphasis; Golos for useful details and controls.
- Charcoal, warm paper and tomato surfaces with context-specific text contrast.
- Sharp containers, thin rules and circular icon controls.
- Real camera movement, two interior reading holds and clipped text entrances.
- An explicitly fictional menu and a local demonstration basket.

## Colors

The palette moves from a dark food stage to a saturated menu and a quiet paper story.

The sidecar's derived OKLCH strips are panel previews, not additional shipped palette tokens. The frontmatter owns the seven observed colour values.

### Primary

- **Tomato:** The menu field, emphasis within dark headings, scene progress and occupied basket count.
- **Tomato on paper:** The darker emphasis used in the paper story and the empty basket. Preserve this context-specific substitution.

### Neutral

- **Charcoal ink:** The page stage, navigation background and save action; also the text on tomato and paper.
- **Warm paper:** Main text on charcoal, the about section and the basket panel.
- **Warm muted:** Supporting scene copy, lower scene controls, replay and credits on charcoal.
- **Inset paper:** The cropped still's light table surface and quantity hover state.
- **Action hover:** The save action's lighter charcoal hover state.

### Named Rules

**The Field Contrast Rule.** Use warm paper and warm muted on charcoal; use charcoal on tomato and paper. Paper emphasis uses the darker tomato variant. Keep the scene's protective vignettes where food passes beneath text.

**The Tomato Field Rule.** Tomato can occupy a complete menu field. In dark sections it marks emphasis, progress and selected count; it is not restricted to a tiny accent.

## Typography

**Display Font:** Literata, with Georgia and serif fallbacks.
**Body Font:** Golos, with Arial and sans-serif fallbacks.

The pairing is literary and approachable. Roman headings carry the statement; italic emphasis supplies warmth without an extra typeface. Body copy, navigation, prices and buttons remain in Golos. Variable WOFF2 fonts are self-hosted with Latin/Cyrillic subsets and SIL OFL notices.

### Hierarchy

- **Display:** The three-line scene introduction. The frontmatter records its desktop fluid ramp.
- **Scene headline:** Crust, ingredients and final close statements, sharing the display's weight and tight spacing.
- **Menu / about / closing headlines:** Separate observed fluid ramps, sharing the Literata heading treatment.
- **Title:** Menu dish names and closely related basket names. Signature captions use a slightly smaller desktop title.
- **Dialog title:** The compact basket heading.
- **Body:** The paper story, with a maximum measure of 40 characters; scene copy uses a 38-character measure, and menu copy uses its denser role.
- **Label / caption:** Practical controls and quiet annotations. Prices and basket quantities use tabular numerals.
- **Wordmark:** Heavy Golos with a widely spaced, small uppercase incumbent tagline. It is branding, not a section heading device.

### Named Rules

**The Two Voices Rule.** Literata speaks in headings and food names. Golos handles navigation, explanation and actions. Italic emphasis stays within Literata.

## Layout

The page uses a fluid gutter and full-width colour fields rather than a centred card container. Desktop scene copy occupies up to 39% of the stage with a 570px cap, leaving the food on the right. The scene is a sticky full viewport with a minimum height of 560px. Its animated journey spans 700svh; the static fallback and reduced-motion journey span 100svh.

The fixed desktop header is 98px high. Sections reserve a 94px anchor offset. The menu uses a .95fr / 1.05fr grid, a fluid 32–88px gap and a sticky signature image; its open rows align copy, price and one circular add action. The about section uses equal columns and a fluid 40–140px gap. The footer uses three columns. Desktop section padding is approximately 84–105px vertically; common inner rhythm comes from the spacing tokens.

At 1050px and below, scene typography and some menu/about details become smaller, with tighter gaps. At 700px and below, the header becomes 83px high and retains the wordmark, menu link and basket count. Scene copy spans the gutter-to-gutter width above the food; menu and about sections stack; the footer becomes two columns with credits across both. The basket fills narrow viewports. Scene captions and the scroll hint are hidden, while touch controls remain at least 44px in the built narrow layout.

The narrow display ramp is 48–68px with a 1.05 line-height; scene headlines use a 36–50px ramp. A separate narrow-and-short rule at 730px height or less uses 46px / 38px scene headings and hides the intro paragraph to preserve the complete pizza and menu action. Menu titles remain 54px; about and closing titles use 40px and 48px.

Source boundary nuance: CSS switches at 700px inclusive, while scene camera fitting and pointer-background capability use width below 700px. This exact-boundary drift is recorded, not promoted into a reusable rule.

## Elevation & Depth

The interface is flat by default. Contrast between fields, fine translucent rules, the food's lighting and contact shadow produce depth. Header and scene vignettes are practical readability layers. The only CSS surface shadow belongs to the basket drawer; the rendered pizza retains its own physically lit depth and studio still shadow.

### Shadow Vocabulary

- **Basket drawer:** `box-shadow: -18px 0 60px #00000033`. Separates the paper panel from the dimmed page.
- **Modal backdrop:** `background: #10130fcc`. Native modal dimming, without decorative blur.
- **Pizza contact:** A radial black canvas texture beneath the model. It is scene lighting, not a card shadow token.

### Named Rules

**The Flat Surface Rule.** Keep menu rows and story surfaces flat. Reserve interface elevation for the modal basket; let the food supply the visual depth.

## Shapes

Containers and colour fields have sharp corners. Circular outlines identify add and quantity controls, while the basket count uses a compact circular badge. Thin rules separate menu rows, image captions and basket regions. Icons are simple inline SVG strokes (1.5px), with rounded linecaps and joins.

Images intentionally crop inside rectangular viewports. The signature image shows the locally rendered pizza; the paper story uses a closer crop of the same still. A crop is a food composition choice, not a rounded card.

## Components

### Buttons and links

Actions are compact and open. Menu/story links use an underlined baseline with an inline arrow and a minimum 48px desktop height. Hover increases the arrow gap over .25s; the closing action uses .3s. Narrow story links use a 44px minimum height.

Add controls are circular outlines, turning charcoal with warm paper icons on hover and during the 750ms added state. Press scales the control to .93. The signature add action stays an unboxed text-plus control. The save action is a full-width sharp charcoal button with a 58px minimum height and a lighter hover shade.

All buttons and links expose a 2px current-colour focus outline offset by 5px. Disabled buttons use .45 opacity; the existing shared disabled cursor is `wait`. This source choice describes current loading/disabled states and does not establish a general disabled-cursor rule for future controls.

### Filters and open menu rows

Filters are text buttons in a labelled group. The active filter uses a 2px underline and `aria-pressed`; it reveals the authored three meat or three vegetarian items. Rows use a thin bottom rule, a serif dish title, compact ingredients, tabular price and one named add button. There are no pill chips, input fields or card components in this build.

Filter changes animate visible rows from 8px lower and .45 opacity over .3s with .03s staggering, under the normal-motion preference. Keep the demonstration menu note visible alongside prices.

### Navigation

The fixed wordmark/navigation/count header overlays the scene with a dark gradient and becomes solid charcoal outside it. Links show a tomato bottom border on hover; the source has no persistent scrollspy selection. On narrow screens only the menu link remains beside the wordmark and basket badge. The wordmark tagline is hidden in the narrow header and remains in the footer.

### Demonstration basket

The native modal dialog is a paper drawer aligned right, with a 520px cap and full viewport height. Its header and summary stay outside the scrollable item body. Empty, populated, quantity-limit and saved-file feedback states exist. Quantity buttons are circular; remove is an underlined text action. The populated count badge turns tomato.

Opening uses a .45s horizontal GSAP entrance with `power4.out`. Escape, close and backdrop actions dismiss the native dialog, and focus returns to its opener. Quantity mutations restore focus to the replacement control and announce changes through a polite live region. The basket persists locally, limits each dish to 99, and exports a TXT summary. Its copy clearly says there is no payment or transmission to a restaurant.

### Camera story and fallback

One model and one perspective camera create a continuous 200° orbit with an approach and a final close view. Two interior holds surround the crust and ingredient passages. In the 13-unit scroll timeline, camera movement pauses at 3.1–4.8 and 7.1–8.9; the intro and close also rest. Text rises from clipped line containers over .65s with .08s staggering and `power4.out`. Paragraphs and actions follow over .5s. ScrollTrigger uses native scrolling with a .35s scrub; optional playback cancels on wheel, touch, relevant keyboard input or a hidden document.

Reduced motion leaves the intro and a static camera view, shortens CSS transitions, removes the extended sticky journey, and hides story/playback/progress controls. Pointer-following floor light requires a fine pointer and no reduced-motion preference; it disables and resets on narrow widths, and reactivates after desktop resize. The light alters the table shader, not pizza geometry or materials.

The scene loads once and compiles its shaders before the loader clears. Rendering runs only for changed, visible frames; DPR is capped at 2 on desktop and 1.5 in the scene's mobile mode, with a 4.3-million-pixel calculation and a minimum DPR of 1. Context loss or load failure reveals the same local studio still and a status message. Menu browsing remains ordinary DOM content.

The decorative still and canvas have distinct accessibility roles; the canvas has a Russian image description, while repeated stills have appropriate alternative text. A skip link reaches the menu. Semantic headings, native buttons, labelled controls, visible focus and status announcements support keyboard use.

The studio raster is a local Blender/Cycles render of the modified **Pizza** scan by **Rigsters**, licensed CC BY 4.0. Keep the model source, author, licence and modification notice in the footer and attribution file, plus embedded raster provenance. Its original diffuse texture is 1024px; the restored 4096px derivative is an upscale, not a true 4K scan. Preserve selected original pizza photographs.

## Do's and Don'ts

### Do:

- **Do** retain the charcoal, warm paper and tomato field roles, using darker tomato emphasis on paper.
- **Do** pair Literata statements and dish names with Golos explanation, navigation and controls.
- **Do** preserve open rows, thin rules, sharp surfaces and circular compact icon controls.
- **Do** keep copy readable throughout camera movement and both interior holds, including narrow and short viewports.
- **Do** support ordinary scrolling, keyboard access, visible focus, local still fallback and reduced motion.
- **Do** preserve licensed asset attribution, font notices, embedded raster provenance and original source photographs.
- **Do** identify the fictional menu, authored example prices and local basket export honestly.

### Don't:

- **Don't** replace the continuous camera approach and orbit with image swaps, crossfades or cuts.
- **Don't** introduce section kickers, repeated icon cards, decorative glass or fabricated social proof into this established world.
- **Don't** add real payment, order transmission, business claims or contact details without real product support.
- **Don't** treat the restored texture as a new high-resolution scan or local frame measurements as a physical-device performance guarantee.
- **Don't** make pointer-following background light active on narrow screens or under reduced motion.

<!-- Evidence: assets/pizza-video/scene-3d/{index.html,style.css,site.js,pizza-scene-source.js,ATTRIBUTION.md,model-info.json,README.md}; PRODUCT.md; .impeccable/surface-briefs/faro.md; the 16 supplied desktop/mobile/user-420 screenshots; .impeccable/review/{runtime.json,background-resize.json}. Documentation records the reviewed artifact; the small CSS/scene 700px boundary drift is not canonized or repaired. Runtime data is local frame-interval/JS render-submission evidence, not a physical-device or GPU benchmark. -->
