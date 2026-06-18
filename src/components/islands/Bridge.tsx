import { useMemo } from 'react';
import * as THREE from 'three';
import { COLORS } from '../../config';
import { sampleQuadBezier } from '../../utils/curve';
import type { BridgeCurve } from '../../data/useWorld';

const DECK_HALF = 0.72;
const ARCH = 0.36;

interface Plank {
  x: number;
  y: number;
  z: number;
  ang: number;
}
interface Rail {
  x: number;
  y: number;
  z: number;
  ang: number;
  len: number;
}

/**
 * A curved, arched wooden bridge with red rails — built by sampling the bridge
 * bézier so it reads as a landmark crossing rather than a flat plank.
 */
export function Bridge({ curve }: { curve: BridgeCurve }) {
  const mats = useMemo(
    () => ({
      plank: new THREE.MeshStandardMaterial({ color: COLORS.wood, flatShading: true, roughness: 0.8 }),
      rail: new THREE.MeshStandardMaterial({ color: COLORS.bridgeRed, flatShading: true, roughness: 0.65 }),
      post: new THREE.MeshStandardMaterial({ color: COLORS.woodDark, flatShading: true, roughness: 0.85 }),
    }),
    [],
  );

  const { planks, rails, posts } = useMemo(() => {
    const span = Math.hypot(curve.p2[0] - curve.p0[0], curve.p2[1] - curve.p0[1]);
    const n = Math.max(5, Math.round(span / 0.34));
    const pts = sampleQuadBezier(curve.p0, curve.p1, curve.p2, n);
    const arch = (t: number) => Math.sin(Math.PI * t) * ARCH + 0.08;

    const planks: Plank[] = [];
    const railL: [number, number, number][] = [];
    const railR: [number, number, number][] = [];

    for (let i = 0; i <= n; i++) {
      const t = i / n;
      const [x, z] = pts[i];
      const prev = pts[Math.max(0, i - 1)];
      const next = pts[Math.min(n, i + 1)];
      const tx = next[0] - prev[0];
      const tz = next[1] - prev[1];
      const ang = Math.atan2(tx, tz);
      const y = arch(t);
      planks.push({ x, y, z, ang });

      const tl = Math.hypot(tx, tz) || 1;
      const px = -tz / tl;
      const pz = tx / tl;
      railL.push([x + px * DECK_HALF, y, z + pz * DECK_HALF]);
      railR.push([x - px * DECK_HALF, y, z - pz * DECK_HALF]);
    }

    const rails: Rail[] = [];
    const mkRail = (arr: [number, number, number][]) => {
      for (let i = 0; i < arr.length - 1; i++) {
        const a = arr[i];
        const b = arr[i + 1];
        const dx = b[0] - a[0];
        const dz = b[2] - a[2];
        rails.push({
          x: (a[0] + b[0]) / 2,
          y: (a[1] + b[1]) / 2 + 0.34,
          z: (a[2] + b[2]) / 2,
          ang: Math.atan2(dx, dz),
          len: Math.hypot(dx, dz) + 0.04,
        });
      }
    };
    mkRail(railL);
    mkRail(railR);

    const posts: [number, number, number][] = [];
    for (let i = 0; i <= n; i += 3) {
      posts.push(railL[i]);
      posts.push(railR[i]);
    }

    return { planks, rails, posts };
  }, [curve]);

  return (
    <group>
      {planks.map((p, i) => (
        <mesh key={i} material={mats.plank} position={[p.x, p.y, p.z]} rotation={[0, p.ang, 0]}>
          <boxGeometry args={[1.5, 0.1, 0.34]} />
        </mesh>
      ))}
      {rails.map((r, i) => (
        <mesh key={`r${i}`} material={mats.rail} position={[r.x, r.y, r.z]} rotation={[0, r.ang, 0]}>
          <boxGeometry args={[0.08, 0.08, r.len]} />
        </mesh>
      ))}
      {posts.map((p, i) => (
        <mesh key={`p${i}`} material={mats.post} position={[p[0], p[1] + 0.18, p[2]]}>
          <boxGeometry args={[0.1, 0.44, 0.1]} />
        </mesh>
      ))}
    </group>
  );
}
