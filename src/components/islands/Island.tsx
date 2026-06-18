import { useMemo, useRef, type ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';
import { COLORS } from '../../config';
import { damp } from '../../utils/math';

interface IslandProps {
  id: string;
  position: [number, number];
  radius: number;
  accent: string;
  children?: ReactNode;
  /** Always-on gentle pulse to draw the eye (used by the intro island). */
  pulse?: boolean;
}

/**
 * A large grassy island: a tapered dirt base with an overhanging grass cap,
 * a gentle bob, and a proximity highlight ring. The grass surface sits at y≈0
 * so the frog walks on top of it. Decorative content is laid on the grass.
 */
export function Island({ id, position, radius, accent, children, pulse = false }: IslandProps) {
  const bob = useRef<THREE.Group>(null);
  const scaler = useRef<THREE.Group>(null);
  const ringMat = useRef<THREE.MeshBasicMaterial>(null);
  const highlight = useRef(0);

  const dirtGeo = useMemo(
    () => new THREE.CylinderGeometry(radius * 0.98, radius * 0.84, 1.0, 26),
    [radius],
  );
  const grassGeo = useMemo(
    () => new THREE.CylinderGeometry(radius + 0.06, radius + 0.06, 0.16, 28),
    [radius],
  );
  const mats = useMemo(
    () => ({
      dirt: new THREE.MeshStandardMaterial({ color: COLORS.dirt, flatShading: true, roughness: 0.95 }),
      grass: new THREE.MeshStandardMaterial({ color: COLORS.grass, roughness: 0.85 }),
    }),
    [],
  );
  const accentColor = useMemo(() => new THREE.Color(accent), [accent]);

  const phase = useMemo(() => {
    let h = 0;
    for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 1000;
    return (h / 1000) * Math.PI * 2;
  }, [id]);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    const dt = Math.min(delta, 0.05);
    if (bob.current) {
      bob.current.position.y = Math.sin(time * 0.8 + phase) * 0.04;
      bob.current.rotation.x = Math.sin(time * 0.6 + phase) * 0.012;
      bob.current.rotation.z = Math.cos(time * 0.5 + phase) * 0.012;
    }

    const target = useStore.getState().nearbyId === id ? 1 : 0;
    highlight.current = damp(highlight.current, target, 8, dt);
    const h = highlight.current;
    if (scaler.current) scaler.current.scale.setScalar(1 + h * 0.03);
    if (ringMat.current) {
      const pulseAmt = pulse ? 0.25 + 0.2 * (0.5 + 0.5 * Math.sin(time * 2.2)) : 0;
      ringMat.current.opacity = Math.max(h * 0.85, pulseAmt);
    }
  });

  return (
    <group position={[position[0], 0, position[1]]}>
      <group ref={bob}>
        <group ref={scaler}>
          <mesh geometry={dirtGeo} material={mats.dirt} position={[0, -0.5, 0]} />
          <mesh geometry={grassGeo} material={mats.grass} position={[0, -0.05, 0]} />

          {/* Proximity / pulse highlight ring */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
            <ringGeometry args={[radius + 0.12, radius + 0.34, 56]} />
            <meshBasicMaterial
              ref={ringMat}
              color={accentColor}
              transparent
              opacity={0}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>

          {/* On-grass content */}
          <group position={[0, 0.04, 0]}>{children}</group>
        </group>
      </group>
    </group>
  );
}
