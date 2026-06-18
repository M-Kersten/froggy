/**
 * Central tuning + theme for the garden world.
 * One place to rebalance the layout and keep the 3D palette in sync with the
 * DOM UI (see index.css custom properties).
 */

export const COLORS = {
  // Water (calm, slightly muted blue-green)
  waterDeep: '#2a7f97',
  waterShallow: '#5cb9c4',
  waterHighlight: '#bfeef0',

  // Sky / ambient
  skyTop: '#cdeef0',
  skyBottom: '#eef8f0',
  fog: '#d4eef0',

  // Islands
  grass: '#86c25c',
  grassDark: '#5fa244',
  dirt: '#a07a4c',
  dirtDark: '#7c5c36',
  moss: '#6fae4d',

  // Frog (humanoid)
  frogBody: '#86c95a',
  frogDark: '#69ad44',
  frogBelly: '#e7f6c8',
  frogCheek: '#f4a9b8',
  shirt: '#f3ede0',
  shirtShade: '#ded3bf',
  pants: '#9a6b3f',
  pantsShade: '#7d5530',
  scarf: '#e2674f',
  pack: '#b07d49',

  // Japanese garden props
  wood: '#b07c45',
  woodDark: '#7f5528',
  cherry: '#f6b6d0',
  cherryDeep: '#ec9bbd',
  trunk: '#8a5a3c',
  lantern: '#bbb4a6',
  lanternDark: '#938c7e',
  toriiRed: '#d2604c',
  bamboo: '#93c25c',
  bambooDark: '#6fa043',

  // Foliage / props
  reed: '#5fae5f',
  reedDark: '#43904c',
  rock: '#a3aaa6',
  rockDark: '#828a86',

  // Flowers / lilies
  lily: '#4f9e58',
  flowerPink: '#f7a8c4',
  flowerWhite: '#fdfdfb',
  flowerYellow: '#ffd25a',

  // Dragonfly
  dragonfly: '#4fb6c9',
  dragonflyWing: '#dff6fb',
} as const;

/** Pond + gameplay tuning. */
export const WORLD = {
  /** Visual size of the water plane (square). */
  waterSize: 80,
  /** Water surface height (islands rise above it; their grass tops are at y = 0). */
  waterY: -0.4,

  /** Frog walking. */
  walkSpeed: 3.7,
  /** Acceleration / deceleration smoothing (higher = snappier). */
  walkAccel: 9,
  /** Facing turn smoothing. */
  turnSpeed: 12,
  /** Margin kept between the frog and an island/bridge edge (so it stays on land). */
  edgeMargin: 0.32,
  /** Half-width of a bridge's walkable strip. */
  bridgeHalfWidth: 0.62,

  /** Distance (from island center, normalized by radius) at which a node opens. */
  interactRangePad: 1.0,
  /** Extra range (beyond the island radius) at which a node highlights. */
  hintRangePad: 2.2,
} as const;

/** Camera framing — top-down with a gentle tilt, following the frog at mid-zoom. */
export const CAMERA = {
  /** Offset from the frog: high up, slightly toward the viewer for a touch of depth. */
  offset: [0, 14.5, 4.8] as [number, number, number],
  /** Field of view (narrow-ish keeps the look close to top-down). */
  fov: 44,
  /** Follow smoothing (higher = snappier). */
  damping: 3.0,
} as const;

export const INTRO_ID = 'introduction';

/** Rough rectangular extent of the garden, used to scatter water decoration. */
export const GARDEN_BOUNDS = {
  minX: -15.5,
  maxX: 12.5,
  minZ: -11.5,
  maxZ: 19.5,
} as const;

/** Frog start: on the intro island, toward the viewer so it doesn't cover the copy. */
export const FROG_START: [number, number] = [0, 17.8];
