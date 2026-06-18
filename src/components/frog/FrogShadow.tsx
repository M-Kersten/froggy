import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { frogState } from '../../state/frogState';

/**
 * A cheap soft blob shadow that tracks the frog and shrinks/fades as it hops —
 * grounds the character without the cost of real shadow maps.
 */
export function FrogShadow() {
  const ref = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);

  const texture = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const ctx = c.getContext('2d')!;
    const g = ctx.createRadialGradient(32, 32, 2, 32, 32, 32);
    g.addColorStop(0, 'rgba(0,0,0,0.5)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  }, []);

  useFrame(() => {
    if (!ref.current || !matRef.current) return;
    const y = frogState.position.y;
    ref.current.position.set(frogState.position.x, 0.05, frogState.position.z);
    const shrink = Math.max(0.45, 1 - y * 0.45);
    ref.current.scale.setScalar(shrink);
    matRef.current.opacity = Math.max(0.15, 0.55 - y * 0.35);
  });

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[1.5, 1.5]} />
      <meshBasicMaterial ref={matRef} map={texture} transparent depthWrite={false} opacity={0.5} />
    </mesh>
  );
}
