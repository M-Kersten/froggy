import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { COLORS } from '../../config';

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
        <mesh key={side} position={[side * (width / 2 - 0.25), 0.34, 0.3]}>
          <boxGeometry args={[0.13, 0.7, 0.13]} />
          <meshStandardMaterial color={COLORS.woodDark} flatShading roughness={0.85} />
        </mesh>
      ))}

      <group position={[0, 0.78, 0]} rotation={[TILT, 0, 0]}>
        <mesh position={[0, -0.03, 0]}>
          <boxGeometry args={[width + 0.18, 0.07, h + 0.18]} />
          <meshStandardMaterial color={COLORS.wood} flatShading roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.0, 0]}>
          <boxGeometry args={[width + 0.04, 0.07, h + 0.04]} />
          <meshStandardMaterial color="#ffffff" roughness={0.6} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.055, 0]}>
          <planeGeometry args={[width, h]} />
          <meshBasicMaterial map={tex} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}
