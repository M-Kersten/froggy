import { Text } from '@react-three/drei';
import { COLORS } from '../../config';
import { FONT_REGULAR, FONT_SEMIBOLD } from '../../utils/fonts';

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
        <mesh key={side} position={[side * (width / 2 - 0.22), 0.3, 0.26]}>
          <boxGeometry args={[0.12, 0.62, 0.12]} />
          <meshStandardMaterial color={COLORS.woodDark} flatShading roughness={0.85} />
        </mesh>
      ))}

      <group position={[0, 0.64, 0]} rotation={[TILT, 0, 0]}>
        {/* frame + panel */}
        <mesh position={[0, -0.03, 0]}>
          <boxGeometry args={[width + 0.14, 0.06, h + 0.14]} />
          <meshStandardMaterial color={COLORS.wood} flatShading roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.01, 0]}>
          <boxGeometry args={[width, 0.06, h]} />
          <meshStandardMaterial color={COLORS.panel} roughness={0.85} />
        </mesh>
        {/* accent strip along the top edge */}
        <mesh position={[0, 0.05, -h / 2 + 0.12]}>
          <boxGeometry args={[width, 0.04, 0.16]} />
          <meshStandardMaterial color={accent} roughness={0.6} />
        </mesh>

        {/* optional number stamp */}
        {badge !== undefined && (
          <group position={[-width / 2 + 0.36, 0.06, -h / 2 + 0.12]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.18, 0.18, 0.06, 22]} />
              <meshStandardMaterial color="#ffffff" roughness={0.5} />
            </mesh>
            <Text
              font={FONT_SEMIBOLD}
              fontSize={0.2}
              position={[0, 0.06, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
              color={accent}
              anchorX="center"
              anchorY="middle"
            >
              {String(badge)}
            </Text>
          </group>
        )}

        <Text
          font={FONT_SEMIBOLD}
          fontSize={subtitle ? 0.22 : 0.26}
          position={[0, 0.06, subtitle ? -0.12 : 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          color={HEADING}
          anchorX="center"
          anchorY="middle"
          maxWidth={width - 0.3}
          textAlign="center"
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            font={FONT_REGULAR}
            fontSize={0.12}
            position={[0, 0.06, 0.18]}
            rotation={[-Math.PI / 2, 0, 0]}
            color={BODY}
            anchorX="center"
            anchorY="middle"
            maxWidth={width - 0.4}
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
