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
      <color attach="background" args={[COLORS.skyBottom]} />
      <fog attach="fog" args={[COLORS.fog, 30, 62]} />

      {/* Bright, soft daytime lighting. */}
      <hemisphereLight args={[COLORS.skyTop, COLORS.soilDark, 1.0]} />
      <directionalLight position={[8, 16, 6]} intensity={1.0} color="#fff6e6" />
      <directionalLight position={[-6, 9, -4]} intensity={0.22} color={COLORS.waterShallow} />

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
