import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { WasdHints } from './WasdHints';
import { GuideArrow } from './GuideArrow';
import { useStore } from '../../store/useStore';
import { intro } from '../../data/useProjects';
import { FONT_REGULAR, FONT_SEMIBOLD } from '../../utils/fonts';
import { damp } from '../../utils/math';

const TITLE_COLOR = '#1f3b2e';
const BODY_COLOR = '#2f5a44';

/**
 * Copy + guidance laid flat on the intro pad. The WASD hint and arrow gently
 * shrink away once the player has moved, keeping the pond uncluttered.
 */
export function IntroContent() {
  const hasMoved = useStore((s) => s.hasMoved);
  const hints = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    if (hints.current) {
      const target = hasMoved ? 0 : 1;
      const s = damp(hints.current.scale.x, target, 6, dt);
      hints.current.scale.setScalar(s);
      hints.current.visible = s > 0.02;
    }
  });

  return (
    <group>
      <Text
        font={FONT_SEMIBOLD}
        fontSize={0.42}
        position={[0, 0.22, -1.4]}
        rotation={[-Math.PI / 2, 0, 0]}
        color={TITLE_COLOR}
        anchorX="center"
        anchorY="middle"
        maxWidth={5.2}
        textAlign="center"
        outlineWidth={0.006}
        outlineColor="#ffffff"
        outlineOpacity={0.4}
      >
        {intro.title}
      </Text>

      <Text
        font={FONT_REGULAR}
        fontSize={0.2}
        position={[0, 0.22, -0.35]}
        rotation={[-Math.PI / 2, 0, 0]}
        color={BODY_COLOR}
        anchorX="center"
        anchorY="middle"
        maxWidth={4.6}
        textAlign="center"
        lineHeight={1.35}
      >
        {intro.description}
      </Text>

      <group ref={hints}>
        <group position={[0, 0, 0.95]}>
          <WasdHints />
        </group>
        {/* Arrow sits just past the far edge, pointing into the pond. */}
        <group position={[0, 0, -2.7]}>
          <GuideArrow />
        </group>
      </group>
    </group>
  );
}
