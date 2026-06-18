/**
 * Central tuning + theme for the pond world.
 * Keeping these in one place makes the scene easy to rebalance and keeps
 * the 3D palette in sync with the DOM UI (see index.css custom properties).
 */

export const COLORS = {
  // Water
  waterDeep: '#1f8fb0',
  waterShallow: '#62cfd9',
  waterHighlight: '#bff0f2',

  // Sky / ambient
  skyTop: '#bfeaf2',
  skyBottom: '#e9f7ef',
  fog: '#cdeef0',

  // Lily pads
  pad: '#5cc16a',
  padDark: '#3f9a52',
  padEdge: '#2f8043',
  padVein: '#3c8f4d',

  // Frog
  frogBody: '#7ac74f',
  frogBelly: '#e7f6c8',
  frogDark: '#5aa83b',
  frogCheek: '#f4a9b8',

  // Foliage / props
  reed: '#56a85e',
  reedDark: '#3c8a48',
  reedTip: '#caa64a',
  rock: '#9fa9ad',
  rockDark: '#7c878c',

  // Flowers
  flowerPink: '#f7a8c4',
  flowerWhite: '#fdfdfb',
  flowerYellow: '#ffd25a',

  // Dragonfly
  dragonfly: '#4fb6c9',
  dragonflyWing: '#dff6fb',
} as const;

/** Pond + gameplay tuning. */
export const WORLD = {
  /** Radius of the playable water surface. */
  pondRadius: 18,
  /** Visual size of the water plane (square). */
  waterSize: 60,
  /** Radius of the soft circular "shore" the frog cannot cross. */
  playableRadius: 15.5,

  /** Default lily pad radius (large, per brief). */
  padRadius: 2.4,

  /** Frog movement. */
  hopDistance: 1.35,
  hopDuration: 0.34,
  hopHeight: 0.7,
  hopCooldown: 0.04,
  turnSpeed: 14,

  /** Distance (from pad center) at which the modal opens / pad highlights. */
  interactRange: 3.4,
  /** Range at which a pad starts to gently highlight. */
  hintRange: 4.6,
} as const;

/** Camera framing — top-down with a gentle tilt so geometry still reads. */
export const CAMERA = {
  /** Offset from the frog: high up, slightly behind for a touch of depth. */
  offset: [0, 15.5, 4.6] as [number, number, number],
  /** Field of view (narrow-ish keeps the look close to orthographic/top-down). */
  fov: 40,
  /** Follow smoothing (higher = snappier). */
  damping: 3.4,
} as const;

export const INTRO_PAD_ID = 'intro';

/** Fixed world position of the (larger) intro pad. */
export const INTRO_POSITION: [number, number] = [0, 5];
export const INTRO_RADIUS = WORLD.padRadius * 1.3;

/** Frog start: on the intro pad but toward the camera so it doesn't cover the copy. */
export const FROG_START: [number, number] = [0, 6.7];
