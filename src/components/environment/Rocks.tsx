import { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { COLORS, WORLD } from '../../config';
import { mulberry32, scatterWater } from '../../utils/scatter';

const COUNT = 22;

/** A scattering of low-poly rocks resting in the shallows around the islands. */
export function Rocks() {
  const mesh = useRef<THREE.InstancedMesh>(null);

  const geometry = useMemo(() => new THREE.IcosahedronGeometry(0.5, 0), []);
  const material = useMemo(
    () => new THREE.MeshStandardMaterial({ color: COLORS.rock, flatShading: true, roughness: 0.95 }),
    [],
  );

  const matrices = useMemo(() => {
    const rng = mulberry32(202);
    const points = scatterWater(COUNT, 0.1, rng);
    const dummy = new THREE.Object3D();
    const mats: THREE.Matrix4[] = [];
    points.forEach(([x, z]) => {
      dummy.position.set(x, WORLD.waterY - 0.05, z);
      dummy.rotation.set(rng(), rng() * Math.PI * 2, rng());
      const s = 0.4 + rng() * 0.85;
      dummy.scale.set(s * (1 + rng() * 0.4), s * (0.45 + rng() * 0.3), s);
      dummy.updateMatrix();
      mats.push(dummy.matrix.clone());
    });
    return mats;
  }, []);

  useLayoutEffect(() => {
    const m = mesh.current;
    if (!m) return;
    matrices.forEach((mat, i) => m.setMatrixAt(i, mat));
    m.count = matrices.length;
    m.instanceMatrix.needsUpdate = true;
  }, [matrices]);

  return <instancedMesh ref={mesh} args={[geometry, material, COUNT]} />;
}
