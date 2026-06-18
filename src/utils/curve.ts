export type P2 = [number, number];

/** Quadratic bézier point at t. */
export function quadBezier(p0: P2, p1: P2, p2: P2, t: number): P2 {
  const u = 1 - t;
  const a = u * u;
  const b = 2 * u * t;
  const c = t * t;
  return [a * p0[0] + b * p1[0] + c * p2[0], a * p0[1] + b * p1[1] + c * p2[1]];
}

/** `n+1` evenly-parameterized points along a quadratic bézier (inclusive). */
export function sampleQuadBezier(p0: P2, p1: P2, p2: P2, n: number): P2[] {
  const pts: P2[] = [];
  for (let i = 0; i <= n; i++) pts.push(quadBezier(p0, p1, p2, i / n));
  return pts;
}
