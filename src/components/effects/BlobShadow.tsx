import { useMemo } from 'react';
import * as THREE from 'three';

interface BlobShadowProps {
  /** Shadow radius in world units. */
  radius: number;
  position?: [number, number, number];
  opacity?: number;
  color?: string;
}

/** One shared white→transparent radial texture, tinted per-instance via material color. */
const SHADOW_TEXTURE = (() => {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(64, 64, 2, 64, 64, 64);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
})();

/**
 * A soft round drop-shadow decal lying flat on a surface (faces +Y) — grounds
 * islands and props on the water/grass without the cost of real shadow maps.
 */
export function BlobShadow({
  radius,
  position = [0, 0, 0],
  opacity = 0.3,
  color = '#0a2a33',
}: BlobShadowProps) {
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: SHADOW_TEXTURE,
        color: new THREE.Color(color),
        transparent: true,
        opacity,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        toneMapped: false,
      }),
    [color, opacity],
  );

  return (
    <mesh
      position={position}
      rotation={[-Math.PI / 2, 0, 0]}
      scale={radius * 2}
      material={material}
    >
      <planeGeometry args={[1, 1]} />
    </mesh>
  );
}
