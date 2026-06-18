# 🐸 Froggy — an interactive Japanese-garden portfolio

A portfolio website that feels like a small, calm game. You guide a cute,
humanoid frog through a miniature Japanese garden — walking it across **large
grassy islands** linked by **little wooden bridges** with **WASD / arrow keys**
(or by dragging on touch). Each island is a portfolio stop; reaching one gently
opens a clean modal. The frog never steps into the water.

The garden flows from the **Introduction** island at the bottom and branches
upward — Projects on the main path, with side islands for Experiments, Devlog,
Talks and Contact — so exploring naturally reveals more.

Built with **React Three Fiber + Three.js + TypeScript**, with a custom water
shader, instanced foliage, a walkable-surface movement system and a
render-loop-friendly state model.

## ✨ Highlights

- **Humanoid frog** — walks on two legs with a leg/arm walk-cycle, body bob,
  idle breathing + blinking, simple clothes, a neckerchief and a little
  backpack. Big top-mounted eyes keep it reading as a frog from above.
- **Stays on land** — movement is constrained to the union of island discs and
  bridge strips, with gentle wall-sliding along edges, so the frog never enters
  the pond.
- **Japanese-garden world** — large grassy islands with overhanging turf,
  curved wooden bridges, a torii gate, stone lanterns, cherry-blossom trees,
  bamboo, rocks and reeds. Calm colours, open space, nothing cluttered.
- **Branching layout** — a data-driven set of islands + bridges flowing
  bottom→top, with small decorative lily pads tracing the routes between pads.
- **Follow camera** — strict top-down with a touch of tilt + lag, mid-zoom so a
  couple of islands and their bridges are in frame at once.
- **Calm water** — a custom GLSL shader (gentle swell, stylized lighting,
  ambient ripples) one plane deep.
- **Minimal, accessible UI** — animated start screen, a modal that adapts to
  projects (screenshot + link), info nodes (link) and contact (icon link list),
  with focus handling and Escape/backdrop close. Bundled fonts (no CDN).
- **Mobile friendly** — floating touch joystick, responsive layout.

## 🚀 Getting started

```bash
npm install
npm run dev        # start the dev server (Vite)
npm run build      # typecheck + production build into dist/
npm run preview    # serve the production build locally
```

## 🧩 Editing the garden

The whole layout is data-driven in [`src/data/world.json`](src/data/world.json):
an array of `islands` and the `bridges` (by id) that connect them. Add an island
and a bridge and everything — the grass, label, number badge, decorative prop,
proximity modal, the walkable surface and the lily-pad trail — updates
automatically.

```jsonc
// islands[]
{
  "id": "my-project",
  "type": "project",           // intro | project | info | contact
  "label": "Project 5",
  "number": 5,                  // optional badge (main-path nodes)
  "position": [6, -4],          // [x, z]; bottom = +z, top = -z
  "radius": 3.0,
  "accent": "#ff8a5c",
  "prop": "board",              // torii | board | easel | book | mic | signs
  "content": {                  // omit for the intro island
    "title": "My Project",
    "summary": "One sentence shown in the modal.",
    "screenshot": "./screenshots/my-project.svg",  // optional (public/screenshots)
    "link": "https://example.com",
    "tag": "Category"
    // contact nodes use `links: [{ label, url, icon }]` instead
  }
}

// bridges[]
{ "from": "vision-pro-prototype", "to": "my-project" }
```

Tip: space islands so their interaction ranges don't overlap, and keep bridge
spans a couple of units long for readable connectors.

## 🏗️ Architecture

```
src/
├── config.ts                 # world tuning + shared color palette
├── data/                     # world.json + loader (islands, bridges, segments)
├── store/useStore.ts         # zustand: UI/discrete state (modal, nearby node…)
├── state/                    # per-frame singletons: frog transform, walkable
│                             #   surface, ripples, particles
├── input/                    # keyboard + shared movement vector (joystick too)
├── shaders/                  # water + wind (vertex sway) materials
├── utils/                    # easing, lily-pad geometry, seeded scatter, fonts
└── components/
    ├── Experience.tsx        # the scene graph (lights, fog, everything)
    ├── CameraRig.tsx         # top-down follow camera
    ├── Water.tsx             # shader-driven pond surface
    ├── Particles.tsx         # pooled dust puffs
    ├── frog/                 # walking controller + humanoid model + soft shadow
    ├── islands/              # Island, Bridge, content, props, SmallLilies, manager
    ├── environment/          # reeds, rocks, flowers, dragonflies
    │   └── japanese/         # torii, stone lantern, cherry tree, bamboo
    └── ui/                   # StartScreen, Modal, Hud, Joystick (DOM overlay)
```

**Movement / walkable surface.** `state/walkable.ts` builds the walkable area
from the island discs (shrunk by an edge margin) and bridge strips. The frog
controller attempts each step and slides along an axis if blocked, so it hugs
the land and never enters the water.

**Performance.** The frog transform, ripples and particles live in plain module
singletons mutated inside the R3F frame loop, so continuous motion never
triggers React re-renders — the store is only touched for discrete events
(modal open/close, "nearby node" changes). Foliage + lily pads are instanced,
scenery is scattered with a seeded RNG (stable across reloads), the water is a
single shader plane, and shadows are faked with a cheap blob. Vendors are split
into cacheable chunks.

## 🧪 Optional smoke test

`scripts/smoke.mjs` boots the built app in headless Chromium, starts it, walks
the frog and teleports it onto islands to verify the project + contact modals,
capturing console errors + screenshots. It needs Puppeteer (kept out of project
deps):

```bash
npm i -D puppeteer
npm run build && npm run preview &
node scripts/smoke.mjs
```

## 🛠️ Tech

React 18 · TypeScript · Vite · Three.js · @react-three/fiber · @react-three/drei · zustand
