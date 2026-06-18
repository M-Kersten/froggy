import { islands, bridgeCurves } from '../data/useWorld';
import { sampleQuadBezier } from '../utils/curve';
import { WORLD } from '../config';

interface Disc {
  x: number;
  z: number;
  r: number;
}
interface Segment {
  ax: number;
  az: number;
  bx: number;
  bz: number;
  hw: number;
}

/**
 * The walkable surface = island discs (shrunk by an edge margin so the frog
 * stays on the grass) ∪ curved bridge strips (each bézier sampled into short
 * segments). The frog can never leave it, which keeps it out of the water.
 */
const discs: Disc[] = islands.map((i) => ({
  x: i.position[0],
  z: i.position[1],
  r: i.radius - WORLD.edgeMargin,
}));

const segments: Segment[] = [];
for (const c of bridgeCurves) {
  const span = Math.hypot(c.p2[0] - c.p0[0], c.p2[1] - c.p0[1]);
  const n = Math.max(2, Math.round(span / 1.1));
  const pts = sampleQuadBezier(c.p0, c.p1, c.p2, n);
  for (let i = 0; i < pts.length - 1; i++) {
    segments.push({
      ax: pts[i][0],
      az: pts[i][1],
      bx: pts[i + 1][0],
      bz: pts[i + 1][1],
      hw: WORLD.bridgeHalfWidth,
    });
  }
}

function insideDisc(x: number, z: number, d: Disc): boolean {
  const dx = x - d.x;
  const dz = z - d.z;
  return dx * dx + dz * dz <= d.r * d.r;
}

function nearSegment(x: number, z: number, s: Segment): boolean {
  const vx = s.bx - s.ax;
  const vz = s.bz - s.az;
  const len2 = vx * vx + vz * vz || 1;
  let t = ((x - s.ax) * vx + (z - s.az) * vz) / len2;
  t = Math.max(0, Math.min(1, t));
  const px = s.ax + vx * t;
  const pz = s.az + vz * t;
  const dx = x - px;
  const dz = z - pz;
  return dx * dx + dz * dz <= s.hw * s.hw;
}

/** Is the point (x, z) on land (an island or a bridge)? */
export function isWalkable(x: number, z: number): boolean {
  for (const d of discs) if (insideDisc(x, z, d)) return true;
  for (const s of segments) if (nearSegment(x, z, s)) return true;
  return false;
}

// Full-radius island discs (for keeping scenery clear of the shoreline).
const fullDiscs: Disc[] = islands.map((i) => ({ x: i.position[0], z: i.position[1], r: i.radius }));

/** True if (x, z) is within `margin` of any island (i.e. on or near land). */
export function nearLand(x: number, z: number, margin = 0): boolean {
  for (const d of fullDiscs) {
    const dx = x - d.x;
    const dz = z - d.z;
    const rr = d.r + margin;
    if (dx * dx + dz * dz <= rr * rr) return true;
  }
  return false;
}
