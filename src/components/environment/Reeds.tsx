import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { makeWindMaterial, updateWind } from '../../shaders/windMaterial';
import { COLORS, WORLD } from '../../config';
import { mulberry32, scatterWater } from '../../utils/scatter';

const COUNT = 90;

/**
 * Reed blades dotted through the water around the islands, drawn in a single
 * instanced mesh and bent by a shared wind shader (each blade gets a random
 * phase so the sway desyncs).
 */
export function Reeds() {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const material = useMemo(() => makeWindMaterial(COLORS.reed, 0.16), []);

  const { geometry, matrices } = useMemo(() => {
    const g = new THREE.CylinderGeometry(0.0, 0.06, 1.4, 5, 1);
    g.translate(0, 0.7, 0); // base at y = 0 so the wind bend grows upward

    const rng = mulberry32(101);
    const points = scatterWater(COUNT, 0.3, rng);
    const phases = new Float32Array(points.length);
    const dummy = new THREE.Object3D();
    const mats: THREE.Matrix4[] = [];

    points.forEach(([x, z], i) => {
      dummy.position.set(x, WORLD.waterY, z);
      dummy.rotation.set(0, rng() * Math.PI * 2, 0);
      const hy = 0.7 + rng() * 1.0;
      const hx = 0.8 + rng() * 0.5;
      dummy.scale.set(hx, hy, hx);
      dummy.updateMatrix();
      mats.push(dummy.matrix.clone());
      phases[i] = rng() * Math.PI * 2;
    });

    g.setAttribute('aPhase', new THREE.InstancedBufferAttribute(phases, 1));
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

  return <instancedMesh ref={mesh} args={[geometry, material, COUNT]} frustumCulled={false} />;
}
