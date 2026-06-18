import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { WasdHints } from './WasdHints';
import { GuideArrow } from './GuideArrow';
import { useStore } from '../../store/useStore';
import { FONT_REGULAR, FONT_SEMIBOLD } from '../../utils/fonts';
import { damp } from '../../utils/math';

const TITLE_COLOR = '#274b38';
const BODY_COLOR = '#365f49';

const TITLE = "Hi, I'm Merijn Kersten";
const BODY = 'Welcome to my interactive portfolio. Use WASD to walk the frog across the bridges and explore my work.';

/**
 * Copy + guidance laid flat on the intro island. The WASD hint and arrow gently
 * shrink away once the player starts walking, keeping the garden calm.
 */
export function IntroContent() {
  const hasMoved = useStore((s) => s.hasMoved);
  const hints = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    if (hints.current) {
      const s = damp(hints.current.scale.x, hasMoved ? 0 : 1, 6, dt);
      hints.current.scale.setScalar(s);
      hints.current.visible = s > 0.02;
    }
  });

  return (
    <group>
      <Text
        font={FONT_SEMIBOLD}
        fontSize={0.4}
        position={[0, 0.06, -1.7]}
        rotation={[-Math.PI / 2, 0, 0]}
        color={TITLE_COLOR}
        anchorX="center"
        anchorY="middle"
        maxWidth={5.6}
        textAlign="center"
        outlineWidth={0.006}
        outlineColor="#ffffff"
        outlineOpacity={0.35}
      >
        {TITLE}
      </Text>

      <Text
        font={FONT_REGULAR}
        fontSize={0.2}
        position={[0, 0.06, -0.55]}
        rotation={[-Math.PI / 2, 0, 0]}
        color={BODY_COLOR}
        anchorX="center"
        anchorY="middle"
        maxWidth={5}
        textAlign="center"
        lineHeight={1.35}
      >
        {BODY}
      </Text>

      <group ref={hints}>
        <group position={[0, 0, 1.65]}>
          <WasdHints />
        </group>
        {/* Arrow near the far edge, pointing into the garden. */}
        <group position={[0, 0, -2.7]}>
          <GuideArrow />
        </group>
      </group>
    </group>
  );
}
