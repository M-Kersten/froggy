import { Environment, Lightformer } from '@react-three/drei';
import { CameraRig } from './CameraRig';
import { Water } from './Water';
import { Islands } from './islands/Islands';
import { Frog } from './frog/Frog';
import { FrogShadow } from './frog/FrogShadow';
import { Particles } from './Particles';
import { Reeds } from './environment/Reeds';
import { Rocks } from './environment/Rocks';
import { Flowers } from './environment/Flowers';
import { Dragonflies } from './environment/Dragonflies';
import { COLORS } from '../config';

/** The whole Japanese-garden pond world, mounted inside the R3F Canvas. */
export function Experience() {
  return (
    <>
      <color attach="background" args={[COLORS.fog]} />
      <fog attach="fog" args={[COLORS.fog, 26, 60]} />

      {/* Soft image-based lighting (baked once) wraps everything in gentle,
          warm-to-cool ambient so surfaces read round instead of flat. */}
      <Environment resolution={128} frames={1}>
        <Lightformer intensity={1.2} color="#fff1d6" position={[0, 10, 3]} scale={[18, 18, 1]} />
        <Lightformer intensity={0.7} color="#bfe9ff" position={[-9, 4, -6]} rotation={[0, Math.PI / 2.5, 0]} scale={[12, 12, 1]} />
        <Lightformer intensity={0.6} color="#dff7e0" position={[9, 3, 6]} rotation={[0, -Math.PI / 2.5, 0]} scale={[12, 12, 1]} />
        <Lightformer intensity={0.4} color="#a9dff0" position={[0, -6, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[16, 16, 1]} />
      </Environment>

      {/* Soft, warm key light for gentle form + a cool ambient fill. */}
      <hemisphereLight args={[COLORS.skyTop, COLORS.soilDark, 0.3]} />
      <directionalLight position={[7, 13, 6]} intensity={0.85} color="#ffe7bf" />

      <CameraRig />

      <Water />
      <Islands />

      <Frog />
      <FrogShadow />
      <Particles />

      <Reeds />
      <Rocks />
      <Flowers />
      <Dragonflies />
    </>
  );
}
