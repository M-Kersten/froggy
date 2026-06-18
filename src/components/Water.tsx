import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createWaterMaterial } from '../shaders/water';
import { centroid } from '../data/useWorld';
import { WORLD } from '../config';

/**
 * The pond surface: a large segmented plane driven by a custom shader for
 * gentle swell, a strong depth gradient (centred on the garden so land pops)
 * and expanding ripples. Ripple data is mutated elsewhere and uploaded fresh.
 */
export function Water() {
  const material = useMemo(() => {
    const mat = createWaterMaterial();
    (mat.uniforms.uCenter.value as THREE.Vector2).set(centroid[0], centroid[1]);
    return mat;
  }, []);
  const geometry = useMemo(
    () => new THREE.PlaneGeometry(WORLD.waterSize, WORLD.waterSize, 120, 120),
    [],
  );
  const matRef = useRef(material);

  useFrame((state) => {
    matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <mesh
      geometry={geometry}
      material={material}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, WORLD.waterY, 0]}
    />
  );
}
