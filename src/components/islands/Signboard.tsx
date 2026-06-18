import { Text } from '@react-three/drei';
import { COLORS } from '../../config';
import { FONT_REGULAR, FONT_SEMIBOLD } from '../../utils/fonts';
import { roundedPlate } from '../../utils/roundedPlate';

interface SignboardProps {
  title: string;
  subtitle?: string;
  accent: string;
  /** Optional step number, stamped on the board. */
  badge?: number;
  width?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

const TILT = 0.52; // lean the plaque back so it faces the high camera
const HEADING = '#33291c';
const BODY = '#5a4a36';

/**
 * A wooden plaque on posts that holds a title (and optional subtitle), tilted
 * toward the camera so it stays readable from the top-down view. Replaces
 * free-floating 3D text with a physical sign.
 */
export function Signboard({
  title,
  subtitle,
  accent,
  badge,
  width = 2.4,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}: SignboardProps) {
  const h = width * 0.46;
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {([-1, 1] as const).map((side) => (
        <mesh key={side} position={[side * (width / 2 - 0.24), 0.3, 0.24]}>
          <cylinderGeometry args={[0.07, 0.08, 0.62, 10]} />
          <meshStandardMaterial color={COLORS.woodDark} roughness={0.85} />
        </mesh>
      ))}

      <group position={[0, 0.64, 0]} rotation={[TILT, 0, 0]}>
        {/* rounded frame + panel */}
        <mesh geometry={roundedPlate(width + 0.16, h + 0.16, 0.16, 0.08)} position={[0, -0.03, 0]}>
          <meshStandardMaterial color={COLORS.wood} roughness={0.8} />
        </mesh>
        <mesh geometry={roundedPlate(width, h, 0.14, 0.07)} position={[0, 0.02, 0]}>
          <meshStandardMaterial color={COLORS.panel} roughness={0.85} />
        </mesh>
        {/* accent strip along the top edge */}
        <mesh geometry={roundedPlate(width - 0.1, 0.18, 0.08, 0.04)} position={[0, 0.085, -h / 2 + 0.18]}>
          <meshStandardMaterial color={accent} roughness={0.6} />
        </mesh>

        {/* optional number stamp */}
        {badge !== undefined && (
          <group position={[-width / 2 + 0.36, 0.1, -h / 2 + 0.18]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.17, 0.17, 0.05, 22]} />
              <meshStandardMaterial color="#ffffff" roughness={0.5} />
            </mesh>
            <Text font={FONT_SEMIBOLD} fontSize={0.2} position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} color={accent} anchorX="center" anchorY="middle">
              {String(badge)}
            </Text>
          </group>
        )}

        <Text
          font={FONT_SEMIBOLD}
          fontSize={subtitle ? 0.22 : 0.26}
          position={[0, 0.12, subtitle ? -0.1 : 0.05]}
          rotation={[-Math.PI / 2, 0, 0]}
          color={HEADING}
          anchorX="center"
          anchorY="middle"
          maxWidth={width - 0.35}
          textAlign="center"
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            font={FONT_REGULAR}
            fontSize={0.13}
            position={[0, 0.12, 0.22]}
            rotation={[-Math.PI / 2, 0, 0]}
            color={BODY}
            anchorX="center"
            anchorY="middle"
            maxWidth={width - 0.45}
            textAlign="center"
            lineHeight={1.3}
          >
            {subtitle}
          </Text>
        )}
      </group>
    </group>
  );
}
