import { useMemo } from 'react';
import * as THREE from 'three';
import { COLORS } from '../../config';

interface SteppingStonesProps {
  count?: number;
  /** Distance between stones along local +Z. */
  spacing?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  /** For deterministic jitter. */
  seed?: number;
}

/** Tiny deterministic PRNG so the trail is stable across reloads. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const HEIGHT = 0.12;

/** A short trail of small flat stepping stones to guide movement near structures/bridges. */
export function SteppingStones({
  count = 4,
  spacing = 0.7,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  seed = 1,
}: SteppingStonesProps) {
  const geometry = useMemo(() => new THREE.CylinderGeometry(1, 1, HEIGHT, 7), []);

  const lightMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: COLORS.rock, flatShading: true, roughness: 0.9 }),
    [],
  );
  const darkMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({ color: COLORS.rockDark, flatShading: true, roughness: 0.9 }),
    [],
  );

  const stones = useMemo(() => {
    const rng = mulberry32(seed);
    return Array.from({ length: count }, (_, i) => {
      const radius = 0.22 + rng() * 0.12;
      return {
        x: (rng() - 0.5) * 0.24,
        z: i * spacing,
        radius,
        rotY: rng() * Math.PI * 2,
        dark: i % 2 === 1,
      };
    });
  }, [count, spacing, seed]);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {stones.map((s, i) => (
        <mesh
          key={i}
          geometry={geometry}
          material={s.dark ? darkMaterial : lightMaterial}
          position={[s.x, HEIGHT / 2, s.z]}
          rotation={[0, s.rotY, 0]}
          scale={[s.radius, 1, s.radius]}
        />
      ))}
    </group>
  );
}
