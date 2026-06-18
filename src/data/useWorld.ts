import data from './world.json';
import type { Island, Bridge, WorldData } from '../types';
import type { P2 } from '../utils/curve';

const world = data as WorldData;

export const islands: Island[] = world.islands;
export const bridges: Bridge[] = world.bridges;

export function getIsland(id: string): Island | undefined {
  return islands.find((i) => i.id === id);
}

/** Approximate garden centroid (used to bow bridges outward, gradients, etc.). */
export const centroid: P2 = (() => {
  let x = 0;
  let z = 0;
  for (const i of islands) {
    x += i.position[0];
    z += i.position[1];
  }
  return [x / islands.length, z / islands.length];
})();

/** A bridge resolved to a curved path between two islands. */
export interface BridgeCurve {
  from: Island;
  to: Island;
  /** Quadratic bézier control points (island edge → control → island edge). */
  p0: P2;
  p1: P2;
  p2: P2;
}

export const bridgeCurves: BridgeCurve[] = bridges
  .map((b) => {
    const from = getIsland(b.from);
    const to = getIsland(b.to);
    if (!from || !to) return null;

    const dx = to.position[0] - from.position[0];
    const dz = to.position[1] - from.position[1];
    const len = Math.hypot(dx, dz) || 1;
    const ux = dx / len;
    const uz = dz / len;

    // Endpoints sit just inside each island's shoreline.
    const p0: P2 = [from.position[0] + ux * (from.radius - 0.3), from.position[1] + uz * (from.radius - 0.3)];
    const p2: P2 = [to.position[0] - ux * (to.radius - 0.3), to.position[1] - uz * (to.radius - 0.3)];
    const mid: P2 = [(p0[0] + p2[0]) / 2, (p0[1] + p2[1]) / 2];

    // Bow the control point sideways — outward from the garden centre — so the
    // bridge curves like a landmark rather than a straight plank.
    const px = -uz;
    const pz = ux;
    const span = Math.hypot(p2[0] - p0[0], p2[1] - p0[1]);
    const bow = span * 0.16;
    const away = (mid[0] - centroid[0]) * px + (mid[1] - centroid[1]) * pz;
    const sign = away >= 0 ? 1 : -1;
    const p1: P2 = [mid[0] + px * bow * sign, mid[1] + pz * bow * sign];

    return { from, to, p0, p1, p2 };
  })
  .filter((c): c is BridgeCurve => c !== null);
