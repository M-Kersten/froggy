import { COLORS } from '../../../config';

interface PropProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

const PILLAR_HALF = 1.1; // half the distance between pillar centers (width ~2.2)
const PILLAR_HEIGHT = 2.3;
const KASAGI_Y = 2.45; // top beam height (overall ~2.6 with the upturned caps)

/**
 * A simple Japanese torii gate: two round pillars, a curved-up top beam
 * (kasagi) that overhangs, and a smaller crossbeam (nuki) below it.
 */
export function Torii({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }: PropProps) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Pillars (slightly tapered round posts) */}
      {[-PILLAR_HALF, PILLAR_HALF].map((x) => (
        <group key={x}>
          <mesh position={[x, PILLAR_HEIGHT / 2, 0]}>
            <cylinderGeometry args={[0.13, 0.17, PILLAR_HEIGHT, 8]} />
            <meshStandardMaterial color={COLORS.toriiRed} flatShading roughness={0.8} metalness={0} />
          </mesh>
          {/* Stone footing accent */}
          <mesh position={[x, 0.06, 0]}>
            <cylinderGeometry args={[0.22, 0.26, 0.12, 8]} />
            <meshStandardMaterial color={COLORS.woodDark} flatShading roughness={0.85} metalness={0} />
          </mesh>
        </group>
      ))}

      {/* Nuki: lower crossbeam, joining the pillars */}
      <mesh position={[0, 1.75, 0]}>
        <boxGeometry args={[2.5, 0.2, 0.26]} />
        <meshStandardMaterial color={COLORS.toriiRed} flatShading roughness={0.8} metalness={0} />
      </mesh>
      {/* Dark joint band on the nuki */}
      <mesh position={[0, 1.75, 0]}>
        <boxGeometry args={[0.22, 0.24, 0.3]} />
        <meshStandardMaterial color={COLORS.woodDark} flatShading roughness={0.85} metalness={0} />
      </mesh>

      {/* Shimaki: thin secondary beam just under the kasagi */}
      <mesh position={[0, KASAGI_Y - 0.2, 0]}>
        <boxGeometry args={[2.7, 0.14, 0.3]} />
        <meshStandardMaterial color={COLORS.woodDark} flatShading roughness={0.85} metalness={0} />
      </mesh>

      {/* Kasagi: top beam, overhanging the pillars */}
      <mesh position={[0, KASAGI_Y, 0]}>
        <boxGeometry args={[3.0, 0.22, 0.36]} />
        <meshStandardMaterial color={COLORS.toriiRed} flatShading roughness={0.8} metalness={0} />
      </mesh>
      {/* Upturned end caps (angled, slightly raised) to suggest the sweeping curve */}
      {[-1, 1].map((s) => (
        <mesh
          key={s}
          position={[s * 1.58, KASAGI_Y + 0.06, 0]}
          rotation={[0, 0, s * -0.22]}
        >
          <boxGeometry args={[0.5, 0.2, 0.36]} />
          <meshStandardMaterial color={COLORS.toriiRed} flatShading roughness={0.8} metalness={0} />
        </mesh>
      ))}
    </group>
  );
}
