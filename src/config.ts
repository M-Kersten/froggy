/**
 * Central tuning + theme for the garden world.
 * One place to rebalance the layout and keep the 3D palette in sync with the
 * DOM UI (see index.css custom properties).
 */

export const COLORS = {
  // Water (deep + cool so the bright land masses pop)
  waterDeep: '#103a48',
  waterShallow: '#2b8193',
  waterHighlight: '#74cbd2',

  // Sky / ambient
  skyTop: '#cdeef0',
  skyBottom: '#e7f4ee',
  fog: '#c4e6e9',

  // Islands
  grass: '#8cca58',
  grassDark: '#5f9e3f',
  grassShade: '#3f7d35',
  soil: '#9c7647',
  soilDark: '#6f5230',
  rockBase: '#7d756a',
  sand: '#e7d6a6',
  sandDark: '#cdb37e',
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
  bridgeRed: '#c75a48',
  cherry: '#f6b6d0',
  cherryDeep: '#ec9bbd',
  trunk: '#8a5a3c',
  lantern: '#bbb4a6',
  lanternDark: '#938c7e',
  toriiRed: '#d2604c',
  bamboo: '#93c25c',
  bambooDark: '#6fa043',

  // Foliage / props
  reed: '#56a557',
  reedDark: '#3f8848',
  rock: '#9aa29c',
  rockDark: '#79817b',

  // Flowers / lilies
  lily: '#4f9e58',
  lilyDeep: '#3c8348',
  flowerPink: '#f7a8c4',
  flowerWhite: '#fdfdfb',
  flowerYellow: '#ffd25a',

  // Board / sign surfaces
  panel: '#f4ecd8',

  // Dragonfly
  dragonfly: '#4fb6c9',
  dragonflyWing: '#dff6fb',
} as const;

/** Pond + gameplay tuning. */
export const WORLD = {
  /** Visual size of the water plane (square). */
  waterSize: 110,
  /** Water surface height (islands rise above it; their grass tops are at y = 0). */
  waterY: -0.45,

  /** Frog walking. */
  walkSpeed: 3.9,
  walkAccel: 9,
  turnSpeed: 12,
  /** Margin kept between the frog and an island/bridge edge. */
  edgeMargin: 0.35,
  /** Half-width of a bridge's walkable strip. */
  bridgeHalfWidth: 0.72,
} as const;

/**
 * Camera framing — top-down with a gentle tilt, following the frog closely so
 * only a little of the world is visible at once (discovery through movement).
 */
export const CAMERA = {
  offset: [0, 12, 4.0] as [number, number, number],
  fov: 42,
  /** Follow smoothing (higher = snappier). */
  damping: 2.8,
} as const;

export const INTRO_ID = 'introduction';

/** Rough rectangular extent of the garden, used to scatter water decoration. */
export const GARDEN_BOUNDS = {
  minX: -20,
  maxX: 20,
  minZ: -30,
  maxZ: 24,
} as const;

/** Frog start: on the intro hub, toward the viewer so it doesn't cover the copy. */
export const FROG_START: [number, number] = [0, 23];
