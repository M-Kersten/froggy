import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * A flat arrow lying on the pad pointing toward the projects (-Z). It bobs and
 * slides forward in a gentle loop to coax the player into the pond.
 */
export function GuideArrow({ color = '#ff8a5c' }: { color?: string }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (group.current) {
      const slide = (Math.sin(t * 2) * 0.5 + 0.5) * 0.35;
      group.current.position.z = -slide;
      group.current.position.y = 0.32 + Math.sin(t * 2.4) * 0.05;
    }
  });

  return (
    <group ref={group}>
      {/* shaft */}
      <mesh position={[0, 0, 0.18]}>
        <boxGeometry args={[0.18, 0.06, 0.6]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.25} roughness={0.5} />
      </mesh>
      {/* head */}
      <mesh position={[0, 0, -0.28]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.3, 0.42, 4]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.25} roughness={0.5} />
      </mesh>
    </group>
  );
}
