import { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { COLORS, WORLD } from '../../config';

const COUNT = 14;

/** A scattering of low-poly rocks resting at the pond's edge (static). */
export function Rocks() {
  const mesh = useRef<THREE.InstancedMesh>(null);

  const geometry = useMemo(() => new THREE.IcosahedronGeometry(0.5, 0), []);
  const material = useMemo(
    () => new THREE.MeshStandardMaterial({ color: COLORS.rock, flatShading: true, roughness: 0.95 }),
    [],
  );

  const matrices = useMemo(() => {
    const dummy = new THREE.Object3D();
    const mats: THREE.Matrix4[] = [];
    for (let i = 0; i < COUNT; i++) {
      const angle = (i / COUNT) * Math.PI * 2 + Math.random() * 0.5;
      const r = WORLD.playableRadius - 1 + Math.random() * 3;
      dummy.position.set(Math.cos(angle) * r, -0.1, Math.sin(angle) * r);
      dummy.rotation.set(Math.random(), Math.random() * Math.PI * 2, Math.random());
      const s = 0.5 + Math.random() * 0.9;
      dummy.scale.set(s * (1 + Math.random() * 0.4), s * (0.5 + Math.random() * 0.3), s);
      dummy.updateMatrix();
      mats.push(dummy.matrix.clone());
    }
    return mats;
  }, []);

  useLayoutEffect(() => {
    const m = mesh.current;
    if (!m) return;
    matrices.forEach((mat, i) => m.setMatrixAt(i, mat));
    m.instanceMatrix.needsUpdate = true;
  }, [matrices]);

  return <instancedMesh ref={mesh} args={[geometry, material, COUNT]} />;
}
