import { COLORS } from '../../../config';

interface PropProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

/**
 * A Japanese stone lantern (tōrō): stacked low-poly hexagonal stone pieces with
 * a small warm-glowing window, a pyramidal roof and a finial. Total height ~1.3.
 */
export function StoneLantern({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }: PropProps) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Base */}
      <mesh position={[0, 0.09, 0]}>
        <cylinderGeometry args={[0.32, 0.36, 0.18, 6]} />
        <meshStandardMaterial color={COLORS.lanternDark} flatShading roughness={0.9} metalness={0} />
      </mesh>

      {/* Post */}
      <mesh position={[0, 0.34, 0]}>
        <cylinderGeometry args={[0.13, 0.15, 0.34, 6]} />
        <meshStandardMaterial color={COLORS.lantern} flatShading roughness={0.9} metalness={0} />
      </mesh>

      {/* Lower platform under the light-box */}
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.26, 0.28, 0.08, 6]} />
        <meshStandardMaterial color={COLORS.lanternDark} flatShading roughness={0.9} metalness={0} />
      </mesh>

      {/* Light-box (fire chamber) */}
      <mesh position={[0, 0.74, 0]}>
        <cylinderGeometry args={[0.26, 0.26, 0.3, 6]} />
        <meshStandardMaterial color={COLORS.lantern} flatShading roughness={0.88} metalness={0} />
      </mesh>
      {/* Warm glow windows on the front and back faces */}
      {[0, Math.PI].map((a) => (
        <mesh key={a} position={[Math.sin(a) * 0.255, 0.74, Math.cos(a) * 0.255]} rotation={[0, a, 0]}>
          <planeGeometry args={[0.16, 0.18]} />
          <meshBasicMaterial color="#ffdf9e" />
        </mesh>
      ))}

      {/* Roof (hexagonal pyramid) */}
      <mesh position={[0, 1.02, 0]}>
        <coneGeometry args={[0.4, 0.26, 6]} />
        <meshStandardMaterial color={COLORS.lanternDark} flatShading roughness={0.9} metalness={0} />
      </mesh>

      {/* Finial */}
      <mesh position={[0, 1.22, 0]}>
        <coneGeometry args={[0.07, 0.14, 6]} />
        <meshStandardMaterial color={COLORS.lantern} flatShading roughness={0.9} metalness={0} />
      </mesh>
    </group>
  );
}
