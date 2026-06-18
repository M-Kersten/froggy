import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { COLORS } from '../../config';
import { roundedPlate } from '../../utils/roundedPlate';

interface FramedDisplayProps {
  url: string;
  width?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

const TILT = 0.5;

/**
 * A framed picture display on posts (project screenshots), tilted toward the
 * camera so it reads from the top-down view.
 */
export function FramedDisplay({
  url,
  width = 2.7,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}: FramedDisplayProps) {
  const tex = useTexture(url);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  const h = width * 0.625; // 16:10

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {([-1, 1] as const).map((side) => (
        <mesh key={side} position={[side * (width / 2 - 0.27), 0.34, 0.28]}>
          <cylinderGeometry args={[0.075, 0.085, 0.7, 10]} />
          <meshStandardMaterial color={COLORS.woodDark} roughness={0.85} />
        </mesh>
      ))}

      <group position={[0, 0.78, 0]} rotation={[TILT, 0, 0]}>
        <mesh geometry={roundedPlate(width + 0.22, h + 0.22, 0.18, 0.08)} position={[0, -0.03, 0]}>
          <meshStandardMaterial color={COLORS.wood} roughness={0.8} />
        </mesh>
        <mesh geometry={roundedPlate(width + 0.06, h + 0.06, 0.14, 0.07)} position={[0, 0.01, 0]}>
          <meshStandardMaterial color="#ffffff" roughness={0.6} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.085, 0]}>
          <planeGeometry args={[width, h]} />
          <meshBasicMaterial map={tex} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}
