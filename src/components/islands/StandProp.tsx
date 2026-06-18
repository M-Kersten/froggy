import { COLORS } from '../../config';
import type { IslandProp } from '../../types';

/**
 * Small low-poly thematic objects that sit on the info / contact islands
 * (book = devlog, mic = talks, signs = contact, easel = experiments).
 */
export function StandProp({ prop, accent }: { prop: IslandProp; accent: string }) {
  switch (prop) {
    case 'book':
      return (
        <group position={[0, 0, 0]}>
          {/* lectern post + slanted top */}
          <mesh position={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.07, 0.09, 0.6, 6]} />
            <meshStandardMaterial color={COLORS.woodDark} flatShading roughness={0.85} />
          </mesh>
          <group position={[0, 0.66, 0]} rotation={[-0.5, 0, 0]}>
            {/* two pages */}
            {([-1, 1] as const).map((s) => (
              <mesh key={s} position={[s * 0.18, 0, 0]} rotation={[0, s * 0.18, 0]}>
                <boxGeometry args={[0.34, 0.04, 0.46]} />
                <meshStandardMaterial color="#fbf7ec" flatShading roughness={0.7} />
              </mesh>
            ))}
            <mesh position={[0, -0.03, 0]}>
              <boxGeometry args={[0.72, 0.05, 0.5]} />
              <meshStandardMaterial color={accent} flatShading roughness={0.6} />
            </mesh>
          </group>
        </group>
      );

    case 'mic':
      return (
        <group position={[0, 0, 0]}>
          <mesh position={[0, 0.04, 0]}>
            <cylinderGeometry args={[0.26, 0.3, 0.08, 16]} />
            <meshStandardMaterial color={COLORS.lanternDark} flatShading roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.55, 0]}>
            <cylinderGeometry args={[0.035, 0.035, 1.0, 8]} />
            <meshStandardMaterial color={COLORS.lantern} roughness={0.6} metalness={0.2} />
          </mesh>
          <mesh position={[0, 1.12, 0]}>
            <sphereGeometry args={[0.13, 12, 10]} />
            <meshStandardMaterial color="#2c3a33" flatShading roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.98, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.14, 8]} />
            <meshStandardMaterial color={accent} roughness={0.5} />
          </mesh>
        </group>
      );

    case 'signs':
      return (
        <group position={[0, 0, 0]}>
          {[
            { x: -0.5, z: 0.1, ry: 0.3, h: 0.95, c: accent },
            { x: 0.45, z: -0.15, ry: -0.25, h: 1.15, c: COLORS.wood },
            { x: 0.05, z: 0.4, ry: 0.05, h: 0.8, c: COLORS.toriiRed },
          ].map((s, i) => (
            <group key={i} position={[s.x, 0, s.z]} rotation={[0, s.ry, 0]}>
              <mesh position={[0, s.h / 2, 0]}>
                <cylinderGeometry args={[0.05, 0.05, s.h, 6]} />
                <meshStandardMaterial color={COLORS.woodDark} flatShading roughness={0.85} />
              </mesh>
              <mesh position={[0, s.h, 0]}>
                <boxGeometry args={[0.5, 0.28, 0.06]} />
                <meshStandardMaterial color={s.c} flatShading roughness={0.7} />
              </mesh>
            </group>
          ))}
        </group>
      );

    case 'easel':
    default:
      return (
        <group position={[0, 0, 0]}>
          {/* tripod legs */}
          {[-0.3, 0.3].map((x, i) => (
            <mesh key={i} position={[x, 0.45, 0.12]} rotation={[0.2, 0, x > 0 ? -0.18 : 0.18]}>
              <cylinderGeometry args={[0.04, 0.04, 0.95, 6]} />
              <meshStandardMaterial color={COLORS.woodDark} flatShading roughness={0.85} />
            </mesh>
          ))}
          <mesh position={[0, 0.45, -0.12]} rotation={[-0.2, 0, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.95, 6]} />
            <meshStandardMaterial color={COLORS.woodDark} flatShading roughness={0.85} />
          </mesh>
          {/* canvas */}
          <mesh position={[0, 0.78, 0.04]} rotation={[-0.12, 0, 0]}>
            <boxGeometry args={[0.66, 0.5, 0.05]} />
            <meshStandardMaterial color="#fbf7ec" flatShading roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.78, 0.07]} rotation={[-0.12, 0, 0]}>
            <boxGeometry args={[0.46, 0.3, 0.05]} />
            <meshStandardMaterial color={accent} flatShading roughness={0.6} />
          </mesh>
        </group>
      );
  }
}
