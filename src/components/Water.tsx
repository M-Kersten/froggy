import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createWaterMaterial, MAX_ISLANDS } from '../shaders/water';
import { centroid, islands } from '../data/useWorld';
import { WORLD } from '../config';

/**
 * The pond surface: a flat plane with a clean stylised shader — a smooth depth
 * gradient (centred on the garden), soft shoreline foam around each island, a
 * gentle sparkle and event ripples. No busy ripple texture.
 */
export function Water() {
  const material = useMemo(() => {
    const mat = createWaterMaterial();
    (mat.uniforms.uCenter.value as THREE.Vector2).set(centroid[0], centroid[1]);

    const data = mat.uniforms.uIslands.value as Float32Array;
    const count = Math.min(islands.length, MAX_ISLANDS);
    for (let i = 0; i < count; i++) {
      data[i * 3 + 0] = islands[i].position[0];
      data[i * 3 + 1] = islands[i].position[1];
      data[i * 3 + 2] = islands[i].radius;
    }
    mat.uniforms.uIslandCount.value = count;
    return mat;
  }, []);
  const geometry = useMemo(() => new THREE.PlaneGeometry(WORLD.waterSize, WORLD.waterSize, 1, 1), []);
  const matRef = useRef(material);

  useFrame((state) => {
    matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <mesh geometry={geometry} material={material} rotation={[-Math.PI / 2, 0, 0]} position={[0, WORLD.waterY, 0]} />
  );
}
