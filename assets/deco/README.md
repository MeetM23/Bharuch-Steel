# Prism Rail – Architectural Depth Elements & Motion System

This directory contains photoreal, high-fidelity architectural depth assets engineered for the **Prism Rail** website. These replace flat vector outlines and generic CSS gradients with a true multi-layered depth stack:
- **Far Layer:** Architectural CAD blueprints and vanishing horizon grids (slowest parallax)
- **Mid Layer:** Floating 3D toughened glass panes with separate contact shadows and extruded aluminium profile fragments (sharp, interactive mouse-tilt)
- **Near Layer:** Soft volumetric light shafts, warm bokeh, caustics, and floating dust motes (fastest parallax, soft blur)

---

## 1. 3D Glass Panes (Transparent Alpha WebP, 1200 px long side)

All panels feature studio lighting from upper left, polished green-teal refractive edges, bevel highlights, subtle sky/building architectural reflections, and independent soft contact shadows.

| File | Separate Shadow | Purpose | Resolution | Size (Pane / Shadow) | Prompt / Technique |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `glass-pane-01.webp` | `glass-shadow-01.webp` | Tall single architectural toughened glass pane | 1200×1200 | 81.3 KB / 10.0 KB | Pure Python supersampled ray/normal shader; studio lighting (upper left, warm), 12mm thickness with green-teal core refraction, chamfered bevel specular streaks, subtle sky reflection gradient. |
| `glass-pane-02.webp` | `glass-shadow-02.webp` | Two overlapping glass panels at 12° perspective angle | 1200×1100 | 163.1 KB / 22.8 KB | Dual-pane architectural composition; front pane overlapping rear pane with refractive depth attenuation, double bevel catchlights, soft contact drop shadow. |
| `glass-pane-03.webp` | `glass-shadow-03.webp` | Toughened glass pane rooted in satin silver anodised base channel | 1200×1200 | 74.4 KB / 11.3 KB | Glass panel seated inside extruded aluminium U-channel with EPDM rubber gasket, brushed metallic sheen, and grounding contact shadow. |
| `glass-pane-04.webp` | `glass-shadow-04.webp` | Glass pane anchored in sublimated wooden-finish base channel | 1200×1200 | 124.5 KB / 10.1 KB | Architectural pane with teak woodgrain sublimated aluminium profile base, anisotropic highlights, and warm grounding shadow. |
| `glass-pane-05.webp` | `glass-shadow-05.webp` | Glass pane anchored in charcoal matte powder-coated base channel | 1200×1200 | 82.1 KB / 12.0 KB | Architectural pane with charcoal RAL 7016 powder-coat base, soft specular rim, and deep grounding contact shadow. |
| `glass-pane-06.webp` | `glass-shadow-06.webp` | Architectural 90° corner glass railing pair | 1200×1000 | 166.1 KB / 28.4 KB | Two orthogonal glass panels joined at a crisp corner joint with dual edge refraction, corner gasket, and perspective shadow plane. |

---

## 2. 3D Profile Fragments (Transparent Alpha WebP, 1000 px long side)

Extruded segments derived directly from real engineering specifications (`js/data.js`), rendered in both **Light** (studio day) and **Dark** (cool ambient with teal rim-light) variants.

| Light File | Dark File | Profile Geometry | Resolution | Size (Light / Dark) | Prompt / Technique |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `profile-channel-01-light.webp` | `profile-channel-01-dark.webp` | PR 08 continuous base profile with glass slot & gasket | 1000×800 | 33.1 KB / 37.0 KB | Macro perspective render of continuous extruded base channel (w=48mm, h=120mm, slot=16mm); satin anodised brushed finish, milled chamfers, EPDM gasket line. |
| `profile-bracket-01-light.webp` | `profile-bracket-01-dark.webp` | Heavy-duty architectural glass mounting bracket | 1000×800 | 23.3 KB / 25.2 KB | Extruded bracket segment with precision bolt counterbores and clamping face; crisp bevels, directional anisotropic metallic sheen. |
| `profile-handrail-round-01-light.webp` | `profile-handrail-round-01-dark.webp` | Circular slotted aluminium top rail (PR 40 Round) | 1000×800 | 21.3 KB / 22.2 KB | Round 40mm diameter handrail profile with bottom glass slot; cylindrical highlight roll-off and brushed metal texture. |
| `profile-handrail-rect-01-light.webp` | `profile-handrail-rect-01-dark.webp` | Rectangular slimline architectural handrail (PR 4020) | 1000×800 | 18.5 KB / 20.8 KB | Rectangular 40×20mm cap rail with internal rubber channel; crisp machined corners and longitudinal satin sheen. |
| `profile-endcap-01-light.webp` | `profile-endcap-01-dark.webp` | Machined billet aluminium profile end cap | 1000×800 | 21.9 KB / 29.5 KB | CNC milled solid end closure cap; concentric machining brush texture, mounting dowels, and crisp perimeter chamfer. |
| `profile-bracket-cover-01-light.webp` | `profile-bracket-cover-01-dark.webp` | Clip-on decorative bracket cover shroud | 1000×800 | 30.1 KB / 34.1 KB | Curved snap-fit fascia cover for bracket systems; smooth reflective arch curve and concealed locking flanges. |

---

## 3. Architectural Line-Art & Technical CAD Blueprint Layers

| File | Purpose | Format / Resolution | Size | Description |
| :--- | :--- | :--- | :--- | :--- |
| `blueprint-light.svg` | Section background technical drafting | SVG, 2400×1600 | 12.2 KB | Dimensioned CAD elevation and cross-section drawings with ISO hatch patterns, dimension callouts (R4.0, 12mm Toughened, 48.0mm Base, 120.0mm H), section cuts, and projection lines in 10% opacity primary teal (`#00a9c9`). |
| `blueprint-dark.svg` | Dark section technical drafting | SVG, 2400×1600 | 12.2 KB | Same architectural drafting adapted for dark charcoal sections (`#10161b`) in 8% opacity cyan/white lines. |
| `perspective-grid.svg` | Hero horizon ground plane | SVG, 2400×1200 | 4.5 KB | Axonometric perspective grid vanishing smoothly toward the horizon, echoing architectural showroom floors. |

---

## 4. Light & Atmosphere Layers (Transparent Alpha WebP)

| File | Purpose | Resolution | Size | Prompt / Technique |
| :--- | :--- | :--- | :--- | :--- |
| `light-shaft-01.webp` | Soft volumetric sunlight beam | 1200×1600 | 43.5 KB | Oblique volumetric architectural sunbeam through glass with soft Gaussian falloff and warm gold tint (`#d4a017`). |
| `lens-glint-01.webp` | Anamorphic horizontal glass glint | 1600×600 | 6.7 KB | Crisp horizontal lens streak with teal and diamond-white core flare along glass edges. |
| `bokeh-warm-01.webp` | Out-of-focus sunset foreground bokeh | 1200×1000 | 77.7 KB | Soft hexagonal and circular out-of-focus blur discs with optical chromatic aberration and warm architectural tones. |
| `caustic-teal-01.webp` | Glass refraction caustic wave pattern | 1024×1024 | 80.5 KB | Tileable fluid caustic refraction pattern mimicking sunlight focused through architectural glass on adjacent wall surfaces. |
| `dust-particles-01.webp` | Micro dust motes in sunbeam | 1200×1200 | 40.5 KB | Sub-pixel floating dust particles and luminous micro-droplets drifting in a sunbeam. |
| `light-glow-01.webp` | Architectural radial ambient light falloff | 1400×1000 | 63.8 KB | Smooth elliptical radial lighting pool for hero and dark section accents. |

---

## 5. Motion Assets (`/assets/video` & `/assets/img/products/turntables`)

| File | Format | Duration / Res | Size | Description |
| :--- | :--- | :--- | :--- | :--- |
| `hero-dark.mp4` / `.webm` | H.264 / VP9 | 10 s (1920×1080) | 538 KB / 116 KB | Muted, desaturated, blurred dark crop of hero terrace video for dark contact & CTA sections. |
| `bg-glass-loop-01.mp4` / `.webm` | H.264 / VP9 | 6 s (1280×720) | 330 KB / 230 KB | Seamless loop: macro dolly along glass railing edge with sun glint and foreground bokeh. Header background for `about.html`. |
| `bg-metal-loop-01.mp4` / `.webm` | H.264 / VP9 | 6 s (1280×720) | 328 KB / 278 KB | Seamless loop: camera drifting past satin anodised aluminium profile with moving anisotropic sheen. Header background for `finishes.html`. |
| `bg-caustic-loop-01.mp4` / `.webm` | H.264 / VP9 | 6 s (1280×720) | 358 KB / 138 KB | Seamless loop: soft caustic light refracts dynamically through glass over limestone wall. Header background for `applications.html`. |
| `pr-08-cp.webm` | VP9 | 3.6 s (1000×800) | 132 KB | 360° 3D turntable loop on light studio background. Plays on hover over product card. |
| `pr-19-cp.webm` | VP9 | 3.6 s (1000×800) | 136 KB | 360° 3D turntable loop for heavy-duty base channel. Plays on hover. |
| `pr-21-cp-led.webm` | VP9 | 3.6 s (1000×800) | 153 KB | 360° 3D turntable loop with luminous warm/teal LED base channel glow. Plays on hover. |
| `pr-33-sd.webm` | VP9 | 3.6 s (1000×800) | 138 KB | 360° 3D turntable loop for side-mount / fascia glass profile. Plays on hover. |

---

## 6. Integration Architecture & Performance

1. **Depth Stack Placement:**
   - Elements are placed in side gutters (`left: clamp(-30px, 1.5vw, 24px)`, `right: clamp(-30px, 1.5vw, 30px)`) ensuring complete non-overlap with headings, copy, cards, and interactive forms.
2. **Mouse-Tilt Parallax:**
   - 6px subtle translation (`--tx`, `--ty`) with smooth easing (`0.12s cubic-bezier(0.25, 1, 0.5, 1)`).
   - Automatically disabled on touch screens (`pointer: coarse`) and when `prefers-reduced-motion: reduce` is detected.
3. **Lazy Video Execution:**
   - All background videos use `preload="none"` and are observed by an `IntersectionObserver`. Videos only play when visible within the viewport (threshold `0.1`), eliminating CPU/GPU overhead when scrolled past.
4. **Mobile Optimization:**
   - At `<= 820px`, near blur layers, secondary glints/dust, and separate shadows are cleanly hidden via CSS. Maximum of 2 subtle elements per section, ensuring pristine typography and ultra-fast paint times.
5. **Payload Budget:**
   - Added network transfer per page is under 800 KB desktop, well within the 1.5 MB requirement.
