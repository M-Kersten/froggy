import { CameraRig } from './CameraRig';
import { Water } from './Water';
import { Pads } from './pads/Pads';
import { Frog } from './frog/Frog';
import { FrogShadow } from './frog/FrogShadow';
import { Particles } from './Particles';
import { Reeds } from './environment/Reeds';
import { Rocks } from './environment/Rocks';
import { Flowers } from './environment/Flowers';
import { Dragonflies } from './environment/Dragonflies';
import { COLORS } from '../config';

/** The whole pond world, mounted inside the R3F Canvas. */
export function Experience() {
  return (
    <>
      <color attach="background" args={[COLORS.skyBottom]} />
      <fog attach="fog" args={[COLORS.fog, 28, 56]} />

      {/* Bright, soft daytime lighting. */}
      <hemisphereLight args={[COLORS.skyTop, COLORS.reedDark, 1.0]} />
      <directionalLight position={[8, 14, 6]} intensity={1.05} color="#fff6e6" />
      <directionalLight position={[-6, 8, -4]} intensity={0.25} color={COLORS.waterShallow} />

      <CameraRig />

      <Water />
      <Pads />

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
