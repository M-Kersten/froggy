import { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { getLilyPadGeometry } from '../../utils/lilyPadGeometry';
import { bridgeCurves } from '../../data/useWorld';
import { isWalkable } from '../../state/walkable';
import { mulberry32, scatterWater } from '../../utils/scatter';
import { COLORS, WORLD } from '../../config';

const MAX = 260;

interface Lily {
  x: number;
  z: number;
  s: number;
  rot: number;
}

/**
 * Small decorative lily pads (not walkable). They line the routes between
 * islands — echoing the wooden bridges — to suggest direction and add rhythm,
 * plus a light scatter across the open water.
 */
export function SmallLilies() {
  const geometry = useMemo(() => getLilyPadGeometry(0.5), []);
  const material = useMemo(
    () => new THREE.MeshStandardMaterial({ color: COLORS.lily, flatShading: true, roughness: 0.8 }),
    [],
  );
  const mesh = useRef<THREE.InstancedMesh>(null);

  const lilies = useMemo<Lily[]>(() => {
    const rng = mulberry32(505);
    const out: Lily[] = [];

    // Stepping-stone trails flanking each bridge.
    for (const { from, to } of bridgeCurves) {
      const ax = from.position[0];
      const az = from.position[1];
      const dx = to.position[0] - ax;
      const dz = to.position[1] - az;
      const len = Math.hypot(dx, dz) || 1;
      const px = -dz / len;
      const pz = dx / len;
      const steps = Math.max(4, Math.round(len / 0.6));
      for (let i = 1; i < steps; i++) {
        const t = i / steps;
        const cx = ax + dx * t;
        const cz = az + dz * t;
        for (const base of [0.95, -1.2, 1.7]) {
          const off = base * (0.8 + rng() * 0.6);
          const x = cx + px * off;
          const z = cz + pz * off;
          if (!isWalkable(x, z) && out.length < MAX) {
            out.push({ x, z, s: 0.45 + rng() * 0.45, rot: rng() * Math.PI * 2 });
          }
        }
      }
    }

    // A few extra pads drifting in open water.
    for (const [x, z] of scatterWater(28, 0.6, rng)) {
      if (out.length < MAX) out.push({ x, z, s: 0.4 + rng() * 0.5, rot: rng() * Math.PI * 2 });
    }

    return out;
  }, []);

  useLayoutEffect(() => {
    const m = mesh.current;
    if (!m) return;
    const dummy = new THREE.Object3D();
    lilies.forEach((l, i) => {
      dummy.position.set(l.x, WORLD.waterY + 0.03, l.z);
      dummy.rotation.set(0, l.rot, 0);
      dummy.scale.setScalar(l.s);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.count = lilies.length;
    m.instanceMatrix.needsUpdate = true;
  }, [lilies]);

  return <instancedMesh ref={mesh} args={[geometry, material, MAX]} frustumCulled={false} />;
}
