import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { COLORS } from '../../../config';

interface PropProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

interface Blob {
  pos: [number, number, number];
  size: number;
  color: string;
}

/**
 * A low-poly cherry-blossom tree: a tapered trunk with a couple of short
 * branches and a soft pink canopy of overlapping flattened blobs. The canopy
 * sways gently and idly via useFrame, desynced by a per-instance phase.
 */
export function CherryTree({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }: PropProps) {
  const canopy = useRef<THREE.Group>(null);
  const phase = useMemo(() => Math.random() * Math.PI * 2, []);

  const blobs = useMemo<Blob[]>(
    () => [
      { pos: [0, 1.85, 0], size: 0.85, color: COLORS.cherry },
      { pos: [-0.6, 1.6, 0.2], size: 0.6, color: COLORS.cherryDeep },
      { pos: [0.6, 1.65, -0.1], size: 0.62, color: COLORS.cherry },
      { pos: [0.15, 1.55, 0.6], size: 0.55, color: COLORS.cherryDeep },
      { pos: [-0.2, 1.6, -0.55], size: 0.55, color: COLORS.cherry },
      { pos: [0, 2.2, 0], size: 0.55, color: COLORS.cherry },
    ],
    [],
  );

  useFrame((state) => {
    if (canopy.current) {
      canopy.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.2 + phase) * 0.03;
    }
  });

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Trunk (tapered) */}
      <mesh position={[0, 0.65, 0]}>
        <cylinderGeometry args={[0.1, 0.18, 1.3, 7]} />
        <meshStandardMaterial color={COLORS.trunk} flatShading roughness={0.9} metalness={0} />
      </mesh>

      {/* Short branches */}
      <mesh position={[-0.28, 1.15, 0.05]} rotation={[0, 0, 0.7]}>
        <cylinderGeometry args={[0.045, 0.08, 0.6, 6]} />
        <meshStandardMaterial color={COLORS.trunk} flatShading roughness={0.9} metalness={0} />
      </mesh>
      <mesh position={[0.26, 1.25, -0.08]} rotation={[0.2, 0, -0.65]}>
        <cylinderGeometry args={[0.04, 0.07, 0.55, 6]} />
        <meshStandardMaterial color={COLORS.trunk} flatShading roughness={0.9} metalness={0} />
      </mesh>

      {/* Canopy: overlapping flattened blobs (sways) */}
      <group ref={canopy}>
        {blobs.map((b, i) => (
          <mesh key={i} position={b.pos} scale={[b.size, b.size * 0.82, b.size]}>
            <icosahedronGeometry args={[1, 1]} />
            <meshStandardMaterial color={b.color} flatShading roughness={0.85} metalness={0} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
