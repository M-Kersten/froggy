import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { COLORS } from '../../../config';

interface PropProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

interface Stalk {
  offset: [number, number];
  height: number;
  tilt: [number, number];
  phase: number;
  radius: number;
}

/** Number of darker node rings spaced up each stalk. */
const NODES = 4;

/**
 * A small cluster of tall thin bamboo stalks with darker node rings and a few
 * leaf blades near the top. Each stalk sways gently (sin-based, per-stalk phase).
 */
export function Bamboo({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }: PropProps) {
  const group = useRef<THREE.Group>(null);

  const stalks = useMemo<Stalk[]>(() => {
    const count = 3 + Math.floor(Math.random() * 3); // 3–5 stalks
    const out: Stalk[] = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.6;
      const r = 0.12 + Math.random() * 0.22;
      out.push({
        offset: [Math.cos(angle) * r, Math.sin(angle) * r],
        height: 2.2 + Math.random() * 1.0, // 2.2–3.2 units
        tilt: [(Math.random() - 0.5) * 0.16, (Math.random() - 0.5) * 0.16],
        phase: Math.random() * Math.PI * 2,
        radius: 0.05 + Math.random() * 0.02,
      });
    }
    return out;
  }, []);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    g.children.forEach((child, i) => {
      const s = stalks[i];
      if (!s) return;
      child.rotation.z = s.tilt[0] + Math.sin(t * 0.9 + s.phase) * 0.025;
      child.rotation.x = s.tilt[1] + Math.cos(t * 0.8 + s.phase) * 0.02;
    });
  });

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <group ref={group}>
        {stalks.map((s, i) => (
          <group key={i} position={[s.offset[0], 0, s.offset[1]]}>
            {/* Cane */}
            <mesh position={[0, s.height / 2, 0]}>
              <cylinderGeometry args={[s.radius * 0.85, s.radius, s.height, 7]} />
              <meshStandardMaterial color={COLORS.bamboo} flatShading roughness={0.8} metalness={0} />
            </mesh>

            {/* Darker node rings */}
            {Array.from({ length: NODES }).map((_, n) => (
              <mesh key={n} position={[0, (s.height * (n + 1)) / (NODES + 1), 0]}>
                <cylinderGeometry args={[s.radius * 1.18, s.radius * 1.18, 0.05, 7]} />
                <meshStandardMaterial color={COLORS.bambooDark} flatShading roughness={0.8} metalness={0} />
              </mesh>
            ))}

            {/* A few leaf blades near the top */}
            {[0, 1, 2].map((l) => {
              const a = (l / 3) * Math.PI * 2 + s.phase;
              return (
                <mesh
                  key={l}
                  position={[Math.cos(a) * 0.1, s.height - 0.12 - l * 0.12, Math.sin(a) * 0.1]}
                  rotation={[Math.PI / 2.4, a, 0]}
                  scale={[0.045, 0.34, 1]}
                >
                  <coneGeometry args={[1, 1, 4]} />
                  <meshStandardMaterial color={COLORS.bambooDark} flatShading roughness={0.8} metalness={0} />
                </mesh>
              );
            })}
          </group>
        ))}
      </group>
    </group>
  );
}
