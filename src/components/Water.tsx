import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createWaterMaterial } from '../shaders/water';
import { WORLD } from '../config';

/**
 * The pond surface: a large segmented plane driven by a custom shader for
 * gentle swell, stylized lighting and expanding ripples. The ripple buffer is
 * mutated elsewhere (frog hops, landings) and uploaded fresh every frame.
 */
export function Water() {
  const material = useMemo(() => createWaterMaterial(), []);
  const geometry = useMemo(
    () => new THREE.PlaneGeometry(WORLD.waterSize, WORLD.waterSize, 100, 100),
    [],
  );
  const matRef = useRef(material);

  useFrame((state) => {
    // Use the shared clock so ripple start-times line up with the shader.
    matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <mesh
      geometry={geometry}
      material={material}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
      receiveShadow={false}
    />
  );
}
