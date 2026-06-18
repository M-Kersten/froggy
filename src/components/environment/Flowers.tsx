import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { COLORS, WORLD } from '../../config';
import { mulberry32, scatterWater } from '../../utils/scatter';

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
      ref.current.position.y = WORLD.waterY + 0.06 + Math.sin(t * 1.1 + data.phase) * 0.03;
      ref.current.rotation.y = t * 0.15 + data.phase;
      ref.current.rotation.x = Math.sin(t * 0.8 + data.phase) * 0.05;
    }
  });

  return (
    <group ref={ref} position={[data.pos[0], WORLD.waterY + 0.06, data.pos[1]]} scale={data.scale}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <circleGeometry args={[0.32, 12]} />
        <meshStandardMaterial color={COLORS.lily} roughness={0.85} />
      </mesh>
      {petals.map((a, i) => (
        <mesh
          key={i}
          position={[Math.cos(a) * 0.12, 0.05, Math.sin(a) * 0.12]}
          rotation={[0, -a, 0]}
          scale={[0.1, 0.05, 0.16]}
        >
          <sphereGeometry args={[1, 8, 6]} />
          <meshStandardMaterial color={data.petalColor} flatShading roughness={0.7} />
        </mesh>
      ))}
      <mesh position={[0, 0.08, 0]}>
        <sphereGeometry args={[0.07, 10, 8]} />
        <meshStandardMaterial color={COLORS.flowerYellow} flatShading roughness={0.6} />
      </mesh>
    </group>
  );
}

/** A handful of small flowers drifting on the water around the garden. */
export function Flowers() {
  const flowers = useMemo<FlowerData[]>(() => {
    const palette = [COLORS.flowerPink, COLORS.flowerWhite, COLORS.flowerPink];
    const rng = mulberry32(303);
    return scatterWater(6, 0.5, rng).map((pos, i) => ({
      pos,
      petalColor: palette[i % palette.length],
      phase: rng() * Math.PI * 2,
      scale: 0.75 + rng() * 0.5,
    }));
  }, []);

  return (
    <group>
      {flowers.map((f, i) => (
        <Flower key={i} data={f} />
      ))}
    </group>
  );
}
