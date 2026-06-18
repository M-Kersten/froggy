import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';
import { inputState } from '../../input/inputState';
import { FONT_SEMIBOLD } from '../../utils/fonts';
import { COLORS } from '../../config';

interface Key {
  letter: string;
  pos: [number, number];
  test: () => boolean;
}

const REST = '#f4fbf4';
const PRESSED = new THREE.Color(COLORS.frogBody);
const RESTC = new THREE.Color(REST);

/**
 * The four WASD keycaps shown on the intro pad. Caps depress when the matching
 * key is actually held; when idle they play a looping demo press to invite
 * input.
 */
export function WasdHints() {
  const keys = useMemo<Key[]>(
    () => [
      { letter: 'W', pos: [0, -0.52], test: () => inputState.keyboard.y > 0.1 },
      { letter: 'A', pos: [-0.52, 0], test: () => inputState.keyboard.x < -0.1 },
      { letter: 'S', pos: [0, 0], test: () => inputState.keyboard.y < -0.1 },
      { letter: 'D', pos: [0.52, 0], test: () => inputState.keyboard.x > 0.1 },
    ],
    [],
  );

  const groups = useRef<(THREE.Group | null)[]>([]);
  const mats = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  const press = useRef<number[]>([0, 0, 0, 0]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const time = state.clock.elapsedTime;
    const anyInput = inputState.keyboard.lengthSq() > 0.01;
    // Idle demo: cycle W → A → S → D.
    const demoIndex = Math.floor(time * 1.6) % 4;

    keys.forEach((k, i) => {
      const target = (anyInput ? k.test() : demoIndex === i) ? 1 : 0;
      press.current[i] += (target - press.current[i]) * (1 - Math.exp(-18 * dt));
      const p = press.current[i];
      const g = groups.current[i];
      if (g) g.position.y = 0.12 - p * 0.06;
      const m = mats.current[i];
      if (m) m.color.copy(RESTC).lerp(PRESSED, p);
    });
  });

  return (
    <group>
      {keys.map((k, i) => (
        <group key={k.letter} position={[k.pos[0], 0.12, k.pos[1]]} ref={(el) => (groups.current[i] = el)}>
          <RoundedBox args={[0.44, 0.16, 0.44]} radius={0.06} smoothness={3} castShadow>
            <meshStandardMaterial
              ref={(el) => (mats.current[i] = el)}
              color={REST}
              roughness={0.5}
              metalness={0}
            />
          </RoundedBox>
          <Text
            font={FONT_SEMIBOLD}
            fontSize={0.2}
            position={[0, 0.09, 0.02]}
            rotation={[-Math.PI / 2, 0, 0]}
            color="#2c5138"
            anchorX="center"
            anchorY="middle"
          >
            {k.letter}
          </Text>
        </group>
      ))}
    </group>
  );
}
