import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { COLORS, WORLD } from '../../config';

interface FlowerData {
  pos: [number, number];
  petalColor: string;
  phase: number;
  scale: number;
}

function Flower({ data }: { data: FlowerData }) {
  const ref = useRef<THREE.Group>(null);
  const petals = useMemo(() => [0, 1, 2, 3, 4].map((i) => (i / 5) * Math.PI * 2), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ref.current) {
      ref.current.position.y = 0.06 + Math.sin(t * 1.1 + data.phase) * 0.04;
      ref.current.rotation.y = t * 0.15 + data.phase;
      ref.current.rotation.x = Math.sin(t * 0.8 + data.phase) * 0.06;
    }
  });

  return (
    <group ref={ref} position={[data.pos[0], 0.06, data.pos[1]]} scale={data.scale}>
      {/* small lily-pad-ish leaf under the flower */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <circleGeometry args={[0.34, 12]} />
        <meshStandardMaterial color={COLORS.padDark} roughness={0.8} />
      </mesh>
      {petals.map((a, i) => (
        <mesh
          key={i}
          position={[Math.cos(a) * 0.13, 0.05, Math.sin(a) * 0.13]}
          rotation={[0, -a, 0]}
          scale={[0.1, 0.05, 0.17]}
        >
          <sphereGeometry args={[1, 8, 6]} />
          <meshStandardMaterial color={data.petalColor} flatShading roughness={0.7} />
        </mesh>
      ))}
      <mesh position={[0, 0.08, 0]}>
        <sphereGeometry args={[0.08, 10, 8]} />
        <meshStandardMaterial color={COLORS.flowerYellow} flatShading roughness={0.6} />
      </mesh>
    </group>
  );
}

/** A handful of small flowers drifting on the water surface. */
export function Flowers() {
  const flowers = useMemo<FlowerData[]>(() => {
    const palette = [COLORS.flowerPink, COLORS.flowerWhite, COLORS.flowerPink];
    const out: FlowerData[] = [];
    const count = 9;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 3 + Math.random() * (WORLD.playableRadius - 4);
      out.push({
        pos: [Math.cos(angle) * r, Math.sin(angle) * r],
        petalColor: palette[i % palette.length],
        phase: Math.random() * Math.PI * 2,
        scale: 0.8 + Math.random() * 0.6,
      });
    }
    return out;
  }, []);

  return (
    <group>
      {flowers.map((f, i) => (
        <Flower key={i} data={f} />
      ))}
    </group>
  );
}
