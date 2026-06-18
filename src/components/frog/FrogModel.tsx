import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { COLORS } from '../../config';
import { frogState } from '../../state/frogState';

/**
 * A cute, humanoid (bipedal) frog: big head with top-mounted eyes, simple
 * clothes, a little backpack and a neckerchief. It reads as a friendly frog
 * from the top-down camera. The walk cycle (leg/arm swing + body bob) is driven
 * by the shared frog state; blinking + breathing are handled locally.
 */
export function FrogModel() {
  const bob = useRef<THREE.Group>(null);
  const torso = useRef<THREE.Group>(null);
  const leftLeg = useRef<THREE.Group>(null);
  const rightLeg = useRef<THREE.Group>(null);
  const leftArm = useRef<THREE.Group>(null);
  const rightArm = useRef<THREE.Group>(null);
  const leftEye = useRef<THREE.Group>(null);
  const rightEye = useRef<THREE.Group>(null);
  const nextBlink = useRef(2 + Math.random() * 3);

  const m = useMemo(
    () => ({
      skin: new THREE.MeshStandardMaterial({ color: COLORS.frogBody, flatShading: true, roughness: 0.6 }),
      skinDark: new THREE.MeshStandardMaterial({ color: COLORS.frogDark, flatShading: true, roughness: 0.6 }),
      shirt: new THREE.MeshStandardMaterial({ color: COLORS.shirt, roughness: 0.8 }),
      pants: new THREE.MeshStandardMaterial({ color: COLORS.pants, roughness: 0.85 }),
      scarf: new THREE.MeshStandardMaterial({ color: COLORS.scarf, roughness: 0.7 }),
      pack: new THREE.MeshStandardMaterial({ color: COLORS.pack, roughness: 0.85 }),
      white: new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.35 }),
      black: new THREE.MeshStandardMaterial({ color: '#20312a', roughness: 0.3 }),
      cheek: new THREE.MeshStandardMaterial({ color: COLORS.frogCheek, roughness: 0.7 }),
    }),
    [],
  );

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const time = state.clock.elapsedTime;
    const s = frogState.speed; // 0..1
    const p = frogState.walkPhase;

    const swing = Math.sin(p);
    if (leftLeg.current) leftLeg.current.rotation.x = swing * 0.7 * s;
    if (rightLeg.current) rightLeg.current.rotation.x = -swing * 0.7 * s;
    if (leftArm.current) leftArm.current.rotation.x = -swing * 0.55 * s;
    if (rightArm.current) rightArm.current.rotation.x = swing * 0.55 * s;

    if (bob.current) {
      const walkBob = Math.abs(Math.sin(p)) * 0.06 * s;
      const breathe = Math.sin(time * 2.2) * 0.012 * (1 - s);
      bob.current.position.y = walkBob + breathe;
    }
    if (torso.current) {
      torso.current.rotation.x = -0.14 * s; // lean into the walk
      torso.current.rotation.z = Math.sin(p) * 0.05 * s; // gentle sway
    }

    // Blink.
    nextBlink.current -= dt;
    let lid = 1;
    if (nextBlink.current < 0.16) {
      const q = Math.max(0, nextBlink.current) / 0.16;
      lid = Math.abs(q - 0.5) * 2;
      if (nextBlink.current <= 0) nextBlink.current = 2.5 + Math.random() * 3.5;
    }
    if (leftEye.current) leftEye.current.scale.y = lid;
    if (rightEye.current) rightEye.current.scale.y = lid;
  });

  return (
    <group ref={bob}>
      {/* Legs (pivot at hips, swing forward/back) */}
      {([-1, 1] as const).map((side) => (
        <group
          key={side}
          ref={side === -1 ? leftLeg : rightLeg}
          position={[side * 0.17, 0.52, 0]}
        >
          <mesh material={m.skin} position={[0, -0.24, 0]}>
            <capsuleGeometry args={[0.13, 0.3, 4, 8]} />
          </mesh>
          {/* foot */}
          <mesh material={m.skinDark} position={[0, -0.46, 0.1]} scale={[1.1, 0.5, 1.5]}>
            <sphereGeometry args={[0.14, 8, 6]} />
          </mesh>
        </group>
      ))}

      {/* Torso group (everything above the hips) */}
      <group ref={torso} position={[0, 0.5, 0]}>
        {/* shorts / pelvis */}
        <RoundedBox args={[0.52, 0.34, 0.4]} radius={0.12} smoothness={3} position={[0, 0.1, 0]}>
          <primitive object={m.pants} attach="material" />
        </RoundedBox>
        {/* shirt / chest */}
        <RoundedBox args={[0.56, 0.42, 0.42]} radius={0.14} smoothness={3} position={[0, 0.46, 0]}>
          <primitive object={m.shirt} attach="material" />
        </RoundedBox>

        {/* Backpack */}
        <RoundedBox args={[0.46, 0.5, 0.26]} radius={0.1} smoothness={3} position={[0, 0.42, -0.32]}>
          <primitive object={m.pack} attach="material" />
        </RoundedBox>
        {([-1, 1] as const).map((side) => (
          <mesh key={side} material={m.pack} position={[side * 0.2, 0.5, 0.04]} rotation={[0.1, 0, 0]}>
            <boxGeometry args={[0.07, 0.5, 0.08]} />
          </mesh>
        ))}

        {/* Neckerchief */}
        <mesh material={m.scarf} position={[0, 0.74, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.2, 0.06, 8, 16]} />
        </mesh>
        <mesh material={m.scarf} position={[0.06, 0.66, 0.2]} rotation={[0.3, 0, 0.4]}>
          <coneGeometry args={[0.08, 0.22, 4]} />
        </mesh>

        {/* Arms (pivot at shoulders) */}
        {([-1, 1] as const).map((side) => (
          <group
            key={side}
            ref={side === -1 ? leftArm : rightArm}
            position={[side * 0.34, 0.6, 0]}
          >
            {/* short sleeve */}
            <mesh material={m.shirt} position={[0, -0.02, 0]}>
              <sphereGeometry args={[0.13, 8, 6]} />
            </mesh>
            <mesh material={m.skin} position={[0, -0.22, 0]}>
              <capsuleGeometry args={[0.09, 0.26, 4, 8]} />
            </mesh>
            {/* hand */}
            <mesh material={m.skin} position={[0, -0.42, 0.02]}>
              <sphereGeometry args={[0.11, 8, 6]} />
            </mesh>
          </group>
        ))}

        {/* Head */}
        <group position={[0, 0.95, 0.02]}>
          <mesh material={m.skin}>
            <sphereGeometry args={[0.37, 16, 13]} />
          </mesh>
          {/* eye mounds + eyes on top */}
          {([-1, 1] as const).map((side) => (
            <group key={side} position={[side * 0.17, 0.26, 0.12]}>
              <mesh material={m.skin}>
                <sphereGeometry args={[0.17, 12, 10]} />
              </mesh>
              <group ref={side === -1 ? leftEye : rightEye} position={[0, 0.05, 0.04]}>
                <mesh material={m.white}>
                  <sphereGeometry args={[0.12, 14, 12]} />
                </mesh>
                <mesh material={m.black} position={[side * 0.015, 0.01, 0.08]}>
                  <sphereGeometry args={[0.066, 12, 10]} />
                </mesh>
              </group>
            </group>
          ))}
          {/* cheeks */}
          {([-1, 1] as const).map((side) => (
            <mesh key={side} material={m.cheek} position={[side * 0.27, -0.04, 0.24]} scale={[1, 0.7, 0.5]}>
              <sphereGeometry args={[0.08, 8, 6]} />
            </mesh>
          ))}
          {/* smile */}
          <mesh material={m.skinDark} position={[0, -0.08, 0.3]} rotation={[Math.PI / 2 - 0.3, 0, 0]}>
            <torusGeometry args={[0.13, 0.022, 8, 16, Math.PI]} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
