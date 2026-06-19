import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Signboard } from './Signboard';
import { WasdHints } from './WasdHints';
import { GuideArrow } from './GuideArrow';
import { useStore } from '../../store/useStore';
import { damp } from '../../utils/math';

/**
 * The intro hub's focal point: a welcome signboard, with the WASD keys + guide
 * arrow that fade away once the player starts walking.
 */
export function IntroContent() {
  const hints = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const hasMoved = useStore.getState().hasMoved;
    if (hints.current) {
      const s = damp(hints.current.scale.x, hasMoved ? 0 : 1, 6, dt);
      hints.current.scale.setScalar(s);
      hints.current.visible = s > 0.02;
    }
  });

  return (
    <group>
      <Signboard
        title="Hi, I'm Merijn Kersten"
        subtitle="No i'm not a frog, but he's here to guide you through my work!"
        accent="#7ec98a"
        width={3.7}
        position={[0, 0, -0.6]}
      />

      <group ref={hints}>
        <group position={[0, 0, 2.4]}>
          <WasdHints />
        </group>
        <group position={[0, 0, -3.9]}>
          <GuideArrow />
        </group>
      </group>
    </group>
  );
}
