import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { COLORS } from '../../config';

/**
 * Purely visual low-poly frog, built from flat-shaded primitives. Big eyes sit
 * on top of the head so the character still reads as a cute frog from the
 * top-down camera. Handles its own subtle breathing + blinking; hop motion and
 * squash/stretch are applied by the parent controller.
 */
export function FrogModel() {
  const breath = useRef<THREE.Group>(null);
  const leftEye = useRef<THREE.Group>(null);
  const rightEye = useRef<THREE.Group>(null);
  const nextBlink = useRef(2 + Math.random() * 3);
  const t = useRef(0);

  const mats = useMemo(
    () => ({
      body: new THREE.MeshStandardMaterial({
        color: COLORS.frogBody,
        flatShading: true,
        roughness: 0.65,
        metalness: 0,
      }),
      belly: new THREE.MeshStandardMaterial({
        color: COLORS.frogBelly,
        flatShading: true,
        roughness: 0.7,
      }),
      dark: new THREE.MeshStandardMaterial({
        color: COLORS.frogDark,
        flatShading: true,
        roughness: 0.6,
      }),
      white: new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.4 }),
      black: new THREE.MeshStandardMaterial({ color: '#1d2b22', roughness: 0.3 }),
      cheek: new THREE.MeshStandardMaterial({
        color: COLORS.frogCheek,
        roughness: 0.7,
        flatShading: true,
      }),
    }),
    [],
  );

  useFrame((_, delta) => {
    t.current += delta;
    const time = t.current;

    // Gentle breathing.
    if (breath.current) {
      const b = 1 + Math.sin(time * 2.2) * 0.025;
      breath.current.scale.set(1 / b, b, 1 / b);
    }

    // Periodic synchronized blink.
    nextBlink.current -= delta;
    let lid = 1;
    if (nextBlink.current < 0.16) {
      // 0 → fully shut at the midpoint of the blink window.
      const p = Math.max(0, nextBlink.current) / 0.16;
      lid = Math.abs(p - 0.5) * 2; // 1 → 0 → 1
      if (nextBlink.current <= 0) nextBlink.current = 2.5 + Math.random() * 3.5;
    }
    if (leftEye.current) leftEye.current.scale.y = lid;
    if (rightEye.current) rightEye.current.scale.y = lid;
  });

  return (
    <group ref={breath}>
      {/* Body */}
      <mesh material={mats.body} position={[0, 0.42, 0]} scale={[1.15, 0.85, 1.28]} castShadow>
        <sphereGeometry args={[0.5, 14, 11]} />
      </mesh>
      {/* Belly */}
      <mesh material={mats.belly} position={[0, 0.3, 0.16]} scale={[0.96, 0.66, 1.04]}>
        <sphereGeometry args={[0.42, 14, 10]} />
      </mesh>

      {/* Eyes (mounds + white + pupil), grouped so they can blink */}
      {([-1, 1] as const).map((side) => (
        <group key={side} position={[side * 0.24, 0.74, 0.4]}>
          {/* mound */}
          <mesh material={mats.body} scale={[1, 1.05, 1]}>
            <sphereGeometry args={[0.19, 12, 10]} />
          </mesh>
          {/* eyeball that blinks */}
          <group ref={side === -1 ? leftEye : rightEye} position={[0, 0.06, 0.04]}>
            <mesh material={mats.white}>
              <sphereGeometry args={[0.135, 14, 12]} />
            </mesh>
            <mesh material={mats.black} position={[side * 0.02, 0.02, 0.085]}>
              <sphereGeometry args={[0.075, 12, 10]} />
            </mesh>
          </group>
        </group>
      ))}

      {/* Cheeks */}
      {([-1, 1] as const).map((side) => (
        <mesh
          key={side}
          material={mats.cheek}
          position={[side * 0.42, 0.42, 0.36]}
          scale={[1, 0.7, 0.7]}
        >
          <sphereGeometry args={[0.11, 10, 8]} />
        </mesh>
      ))}

      {/* Smile */}
      <mesh material={mats.dark} position={[0, 0.34, 0.62]} rotation={[Math.PI / 2 - 0.35, 0, 0]}>
        <torusGeometry args={[0.12, 0.02, 8, 16, Math.PI]} />
      </mesh>

      {/* Back legs (folded, splayed) */}
      {([-1, 1] as const).map((side) => (
        <group key={side} position={[side * 0.46, 0.2, -0.18]} rotation={[0, side * -0.5, 0]}>
          <mesh material={mats.body} scale={[0.9, 0.55, 1.5]}>
            <capsuleGeometry args={[0.16, 0.18, 4, 8]} />
          </mesh>
          {/* foot */}
          <mesh material={mats.dark} position={[side * 0.16, -0.06, -0.34]} scale={[1.1, 0.4, 1.2]}>
            <sphereGeometry args={[0.13, 10, 8]} />
          </mesh>
        </group>
      ))}

      {/* Front legs (little) */}
      {([-1, 1] as const).map((side) => (
        <group key={side} position={[side * 0.34, 0.16, 0.42]} rotation={[0.4, side * 0.3, 0]}>
          <mesh material={mats.body} scale={[0.6, 0.5, 1]}>
            <capsuleGeometry args={[0.1, 0.16, 4, 8]} />
          </mesh>
          <mesh material={mats.dark} position={[0, -0.04, 0.2]} scale={[1.1, 0.4, 1.1]}>
            <sphereGeometry args={[0.09, 8, 6]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
