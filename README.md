# 🐸 Froggy — an interactive pond portfolio

A portfolio website that feels like a small, polished game. You guide a cute
low-poly frog around a top-down pond with **WASD / arrow keys** (or by dragging
on touch), hopping between lily pads that act as portfolio entries. Reaching a
project pad opens a clean modal with the details.

Built with **React Three Fiber + Three.js + TypeScript**, with a custom water
shader, instanced foliage, and a shared, render-loop-friendly state model.

## ✨ Features

- **Top-down pond** with a custom GLSL water shader: gentle swell, stylized
  lighting, and expanding ripples around the frog + on every landing.
- **Cute frog mascot** with idle breathing, blinking, chained froggy hops, and
  squash-&-stretch — it faces its movement direction and kicks up a little
  splash when it lands.
- **Smooth follow camera** — fixed top-down framing with a touch of lag, no
  rotation, no free controls.
- **Lily pads as content**: an intro pad (title, copy, animated WASD keys, a
  guiding arrow, a pulsing rim) and three project pads (title, screenshot
  preview, one-liner, Read More). Pads bob, highlight, and scale as you near
  them, and the project modal opens automatically.
- **Sparse, intentional life**: swaying reeds (instanced + wind shader),
  drifting flowers, looping dragonflies, scattered rocks.
- **Minimal, accessible UI**: animated start screen, modal with focus handling
  and Escape/backdrop close, fading hints, and a floating touch joystick.
- **Mobile friendly & responsive**, with bundled fonts (no CDN dependency).

## 🚀 Getting started

```bash
npm install
npm run dev        # start the dev server (Vite)
npm run build      # typecheck + production build into dist/
npm run preview    # serve the production build locally
```

## 🧩 Adding a project

Project content lives in [`src/data/projects.json`](src/data/projects.json) —
no component changes required. Append an entry to `projects`:

```jsonc
{
  "id": "my-project",                       // unique; used as the pad id
  "title": "My Project",
  "description": "One sentence shown on the pad.",
  "summary": "One sentence shown in the modal.",
  "screenshot": "./screenshots/my-project.svg", // drop the file in public/screenshots
  "link": "https://example.com/my-project",
  "tag": "Category",                        // optional pill in the modal
  "position": [6, 4],                        // [x, z] on the pond
  "accent": "#ff8a5c"                        // pad highlight + tag color
}
```

Pick a `position` within the playable radius (see `WORLD.playableRadius` in
`src/config.ts`) and spaced from other pads so their interaction ranges don't
overlap. The pad, its preview, label and modal are generated automatically.

## 🏗️ Architecture

```
src/
├── config.ts              # world tuning + shared color palette
├── data/                  # projects.json + loader
├── store/useStore.ts      # zustand: UI/discrete state (modal, nearby pad…)
├── state/                 # per-frame singletons (frog transform, ripples, particles)
├── input/                 # keyboard + shared movement vector (joystick writes here too)
├── shaders/               # water + wind (vertex sway) materials
├── utils/                 # math easing, lily-pad geometry, fonts
└── components/
    ├── Experience.tsx     # the scene graph (lights, fog, everything)
    ├── CameraRig.tsx      # top-down follow camera
    ├── Water.tsx          # shader-driven pond surface
    ├── Particles.tsx      # pooled splash/dust
    ├── frog/              # Frog controller + model + soft shadow
    ├── pads/              # LilyPad, intro content, project content, proximity
    ├── environment/       # reeds, rocks, flowers, dragonflies
    └── ui/                # StartScreen, Modal, Hud, Joystick (DOM overlay)
```

**Performance notes.** The frog transform, ripples and particles live in plain
module singletons and are mutated inside the R3F frame loop, so continuous
motion never triggers React re-renders — the store is only touched for discrete
events (modal open/close, "nearby pad" changes). Foliage is instanced, the
water is a single shader plane, and shadows are faked with a cheap blob.

## 🧪 Optional smoke test

`scripts/smoke.mjs` boots the built app in headless Chromium, starts it, drives
the frog, and asserts the project modal opens/closes while capturing console
errors + screenshots. It needs Puppeteer (kept out of the project deps):

```bash
npm i -D puppeteer
npm run build && npm run preview &
node scripts/smoke.mjs
```

## 🛠️ Tech

React 18 · TypeScript · Vite · Three.js · @react-three/fiber · @react-three/drei · zustand
