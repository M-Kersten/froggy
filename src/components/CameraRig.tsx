import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { frogState } from '../state/frogState';
import { CAMERA, FROG_START } from '../config';

/**
 * Top-down camera that follows the frog with a touch of lag. Only the position
 * tracks the frog — there's no rotation or user control, keeping the framing
 * stable and readable.
 */
export function CameraRig() {
  const cam = useRef<THREE.PerspectiveCamera>(null);
  const look = useRef(new THREE.Vector3(FROG_START[0], 0, FROG_START[1]));
  const desired = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    const c = cam.current;
    if (!c) return;
    const dt = Math.min(delta, 0.05);
    const k = 1 - Math.exp(-CAMERA.damping * dt);

    // Optional zoom multiplier (debug / future setting).
    const zoom = (window as unknown as { __camZoom?: number }).__camZoom ?? 1;
    desired.current.set(
      frogState.position.x + CAMERA.offset[0] * zoom,
      CAMERA.offset[1] * zoom,
      frogState.position.z + CAMERA.offset[2] * zoom,
    );
    c.position.lerp(desired.current, k);

    // Smoothly track the look-at point (ground level, ignore hop bounce).
    look.current.lerp(
      desired.current.set(frogState.position.x, 0, frogState.position.z),
      k,
    );
    c.lookAt(look.current);
  });

  return (
    <PerspectiveCamera
      ref={cam}
      makeDefault
      fov={CAMERA.fov}
      near={1}
      far={70}
      position={[
        FROG_START[0] + CAMERA.offset[0],
        CAMERA.offset[1],
        FROG_START[1] + CAMERA.offset[2],
      ]}
    />
  );
}
