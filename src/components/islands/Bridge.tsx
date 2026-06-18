import { useMemo } from 'react';
import * as THREE from 'three';
import { COLORS } from '../../config';

interface BridgeProps {
  /** World [x, z] endpoints at the two island edges. */
  start: [number, number];
  end: [number, number];
}

/**
 * A simple arched wooden plank bridge with low rails. Built along its local Z
 * axis then rotated to span the two endpoints. The deck arches gently so it
 * reads as a curved garden bridge even from above.
 */
export function Bridge({ start, end }: BridgeProps) {
  const woodMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: COLORS.wood, flatShading: true, roughness: 0.85 }),
    [],
  );
  const woodDarkMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: COLORS.woodDark, flatShading: true, roughness: 0.85 }),
    [],
  );

  const { length, angle, mid, planks, posts } = useMemo(() => {
    const dx = end[0] - start[0];
    const dz = end[1] - start[1];
    const length = Math.hypot(dx, dz);
    const angle = Math.atan2(dx, dz);
    const mid: [number, number] = [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2];

    const count = Math.max(4, Math.round(length / 0.3));
    const planks: { z: number; y: number }[] = [];
    for (let i = 0; i < count; i++) {
      const t = count > 1 ? i / (count - 1) : 0.5;
      const z = (t - 0.5) * length;
      const y = Math.sin(Math.PI * t) * 0.12 + 0.04;
      planks.push({ z, y });
    }

    const postCount = Math.max(2, Math.round(length / 1.1));
    const posts: { z: number; y: number }[] = [];
    for (let i = 0; i < postCount; i++) {
      const t = i / (postCount - 1);
      posts.push({ z: (t - 0.5) * (length - 0.4), y: Math.sin(Math.PI * t) * 0.12 + 0.04 });
    }

    return { length, angle, mid, planks, posts };
  }, [start, end]);

  return (
    <group position={[mid[0], 0, mid[1]]} rotation={[0, angle, 0]}>
      {/* Deck planks (gently arched) */}
      {planks.map((p, i) => (
        <mesh key={i} material={woodMat} position={[0, p.y, p.z]}>
          <boxGeometry args={[1.2, 0.07, 0.24]} />
        </mesh>
      ))}

      {/* Side rails + posts */}
      {([-1, 1] as const).map((side) => (
        <group key={side}>
          <mesh material={woodDarkMat} position={[side * 0.58, 0.34, 0]}>
            <boxGeometry args={[0.06, 0.06, length]} />
          </mesh>
          {posts.map((p, i) => (
            <mesh key={i} material={woodDarkMat} position={[side * 0.58, p.y + 0.16, p.z]}>
              <boxGeometry args={[0.07, 0.34, 0.07]} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}
