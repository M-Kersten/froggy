import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { makeWindMaterial, updateWind } from '../../shaders/windMaterial';
import { islands } from '../../data/useWorld';
import { nearLand } from '../../state/walkable';
import { mulberry32 } from '../../utils/scatter';
import { COLORS, WORLD } from '../../config';

/**
 * Reeds growing in intentional little clusters along the island shorelines
 * (rather than scattered everywhere), bent by a shared wind shader.
 */
export function Reeds() {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const material = useMemo(() => makeWindMaterial(COLORS.reed, 0.16), []);

  const { geometry, matrices } = useMemo(() => {
    const g = new THREE.CylinderGeometry(0.0, 0.06, 1.5, 5, 1);
    g.translate(0, 0.75, 0);

    const rng = mulberry32(101);
    const dummy = new THREE.Object3D();
    const mats: THREE.Matrix4[] = [];
    const phases: number[] = [];

    for (const isl of islands) {
      const clusters = 1 + Math.floor(rng() * 2);
      for (let c = 0; c < clusters; c++) {
        const a = rng() * Math.PI * 2;
        const cr = isl.radius + 0.5 + rng() * 0.7;
        const cx = isl.position[0] + Math.cos(a) * cr;
        const cz = isl.position[1] + Math.sin(a) * cr;
        const blades = 3 + Math.floor(rng() * 3);
        for (let b = 0; b < blades; b++) {
          const x = cx + (rng() - 0.5) * 0.9;
          const z = cz + (rng() - 0.5) * 0.9;
          if (nearLand(x, z, -0.1)) continue; // keep them in the water
          dummy.position.set(x, WORLD.waterY, z);
          dummy.rotation.set(0, rng() * Math.PI * 2, 0);
          const hy = 0.7 + rng() * 0.9;
          dummy.scale.set(0.85 + rng() * 0.4, hy, 0.85 + rng() * 0.4);
          dummy.updateMatrix();
          mats.push(dummy.matrix.clone());
          phases.push(rng() * Math.PI * 2);
        }
      }
    }

    g.setAttribute('aPhase', new THREE.InstancedBufferAttribute(new Float32Array(phases), 1));
    return { geometry: g, matrices: mats };
  }, []);

  useLayoutEffect(() => {
    const m = mesh.current;
    if (!m) return;
    matrices.forEach((mat, i) => m.setMatrixAt(i, mat));
    m.count = matrices.length;
    m.instanceMatrix.needsUpdate = true;
  }, [matrices]);

  useFrame((state) => updateWind(material, state.clock.elapsedTime));

  return <instancedMesh ref={mesh} args={[geometry, material, matrices.length]} frustumCulled={false} />;
}
