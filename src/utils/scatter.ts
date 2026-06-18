import { GARDEN_BOUNDS } from '../config';
import { nearLand } from '../state/walkable';

/** Tiny deterministic PRNG so scattered scenery is stable across reloads. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Sample `count` points in the open water (at least `margin` from any island),
 * using the given RNG so results are reproducible.
 */
export function scatterWater(count: number, margin: number, rng: () => number): [number, number][] {
  const { minX, maxX, minZ, maxZ } = GARDEN_BOUNDS;
  const pts: [number, number][] = [];
  let tries = 0;
  while (pts.length < count && tries < count * 50) {
    tries++;
    const x = minX + (maxX - minX) * rng();
    const z = minZ + (maxZ - minZ) * rng();
    if (!nearLand(x, z, margin)) pts.push([x, z]);
  }
  return pts;
}
