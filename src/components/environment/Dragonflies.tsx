import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { COLORS } from '../../config';

interface FlyData {
  center: [number, number];
  radius: [number, number];
  speed: number;
  height: number;
  phase: number;
}

function Dragonfly({ data }: { data: FlyData }) {
  const root = useRef<THREE.Group>(null);
  const wings = useRef<THREE.Group>(null);
  const prev = useRef(new THREE.Vector2(data.center[0], data.center[1]));

  const wingMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: COLORS.dragonflyWing,
        transparent: true,
        opacity: 0.55,
        roughness: 0.3,
        side: THREE.DoubleSide,
      }),
    [],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime * data.speed + data.phase;
    const x = data.center[0] + Math.sin(t) * data.radius[0];
    const z = data.center[1] + Math.cos(t * 0.8) * data.radius[1];
    const y = data.height + Math.sin(t * 1.7) * 0.35;

    if (root.current) {
      root.current.position.set(x, y, z);
      const vx = x - prev.current.x;
      const vz = z - prev.current.y;
      if (vx * vx + vz * vz > 1e-6) root.current.rotation.y = Math.atan2(vx, vz);
      root.current.rotation.z = Math.sin(t * 2) * 0.1;
    }
    prev.current.set(x, z);

    if (wings.current) {
      const flap = Math.sin(state.clock.elapsedTime * 34 + data.phase) * 0.6;
      wings.current.children.forEach((w, i) => {
        const side = i < 2 ? 1 : -1;
        w.rotation.z = side * (0.2 + flap);
      });
    }
  });

  return (
    <group ref={root}>
      {/* body */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <capsuleGeometry args={[0.05, 0.5, 4, 8]} />
        <meshStandardMaterial color={COLORS.dragonfly} flatShading roughness={0.5} />
      </mesh>
      {/* head */}
      <mesh position={[0, 0, 0.32]}>
        <sphereGeometry args={[0.09, 10, 8]} />
        <meshStandardMaterial color={COLORS.dragonfly} flatShading roughness={0.5} />
      </mesh>
      {/* eyes */}
      <mesh position={[0.06, 0.02, 0.37]}>
        <sphereGeometry args={[0.04, 8, 6]} />
        <meshStandardMaterial color="#1d2b22" />
      </mesh>
      <mesh position={[-0.06, 0.02, 0.37]}>
        <sphereGeometry args={[0.04, 8, 6]} />
        <meshStandardMaterial color="#1d2b22" />
      </mesh>

      {/* four wings, flapped in useFrame */}
      <group ref={wings} position={[0, 0.05, 0.05]}>
        {[
          [1, 0.16],
          [1, -0.02],
          [-1, 0.16],
          [-1, -0.02],
        ].map(([side, z], i) => (
          <group key={i} position={[0.02 * side, 0, z]}>
            <mesh material={wingMat} position={[side * 0.22, 0, 0]} scale={[0.42, 1, 0.16]}>
              <circleGeometry args={[0.5, 12]} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

/** Two lazy dragonflies looping above the pond. */
export function Dragonflies() {
  const flies = useMemo<FlyData[]>(
    () => [
      { center: [-3, -2], radius: [5, 4], speed: 0.5, height: 2.4, phase: 0 },
      { center: [4, 1], radius: [4.5, 5.5], speed: 0.42, height: 2.9, phase: 2.2 },
    ],
    [],
  );
  return (
    <group>
      {flies.map((f, i) => (
        <Dragonfly key={i} data={f} />
      ))}
    </group>
  );
}
