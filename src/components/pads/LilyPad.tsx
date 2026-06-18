import { useMemo, useRef, type ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getLilyPadGeometry } from '../../utils/lilyPadGeometry';
import { useStore } from '../../store/useStore';
import { COLORS } from '../../config';
import { damp } from '../../utils/math';

interface LilyPadProps {
  id: string;
  position: [number, number];
  radius: number;
  accent: string;
  /** Extra content laid on top of the pad (title, screenshot, hints…). */
  children?: ReactNode;
  /** Adds an always-on gentle pulse to draw the eye (used by the intro pad). */
  pulse?: boolean;
}

/**
 * A floating lily pad: gentle bob + sway, a proximity highlight ring, and a
 * subtle scale-up when the frog is near. Pads share cached geometry per radius.
 */
export function LilyPad({ id, position, radius, accent, children, pulse = false }: LilyPadProps) {
  const bob = useRef<THREE.Group>(null);
  const scaler = useRef<THREE.Group>(null);
  const ringMat = useRef<THREE.MeshBasicMaterial>(null);
  const highlight = useRef(0);

  const geometry = useMemo(() => getLilyPadGeometry(radius), [radius]);
  const padMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: COLORS.pad, flatShading: true, roughness: 0.78 }),
    [],
  );
  const accentColor = useMemo(() => new THREE.Color(accent), [accent]);

  // Deterministic per-pad phase so bobbing isn't synchronized.
  const phase = useMemo(() => {
    let h = 0;
    for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 1000;
    return (h / 1000) * Math.PI * 2;
  }, [id]);

  // A handful of radial veins (skip the notch side near angle 0).
  const veins = useMemo(() => {
    const out: number[] = [];
    const count = 7;
    for (let i = 0; i < count; i++) {
      const a = 0.6 + (i / count) * (Math.PI * 2 - 1.2);
      out.push(a);
    }
    return out;
  }, []);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    const dt = Math.min(delta, 0.05);
    if (bob.current) {
      bob.current.position.y = 0.04 + Math.sin(time * 0.9 + phase) * 0.05;
      bob.current.rotation.x = Math.sin(time * 0.7 + phase) * 0.025;
      bob.current.rotation.z = Math.cos(time * 0.6 + phase) * 0.025;
    }

    const isNear = useStore.getState().nearbyPadId === id;
    const targetHi = isNear ? 1 : 0;
    highlight.current = damp(highlight.current, targetHi, 8, dt);
    const h = highlight.current;

    if (scaler.current) {
      const s = 1 + h * 0.05;
      scaler.current.scale.setScalar(s);
    }
    if (ringMat.current) {
      const pulseAmt = pulse ? 0.35 + 0.25 * (0.5 + 0.5 * Math.sin(time * 2.4)) : 0;
      ringMat.current.opacity = Math.max(h * 0.9, pulseAmt);
    }
  });

  return (
    <group position={[position[0], 0, position[1]]}>
      <group ref={bob}>
        <group ref={scaler}>
          {/* Pad slab */}
          <mesh geometry={geometry} material={padMaterial} receiveShadow castShadow />

          {/* Veins */}
          {veins.map((a, i) => (
            <mesh
              key={i}
              position={[Math.cos(a) * radius * 0.42, 0.16, Math.sin(a) * radius * 0.42]}
              rotation={[0, -a, 0]}
            >
              <boxGeometry args={[radius * 0.8, 0.012, 0.05]} />
              <meshStandardMaterial color={COLORS.padVein} roughness={0.8} transparent opacity={0.5} />
            </mesh>
          ))}

          {/* Proximity / pulse highlight ring */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.17, 0]}>
            <ringGeometry args={[radius * 0.97, radius * 1.08, 48]} />
            <meshBasicMaterial
              ref={ringMat}
              color={accentColor}
              transparent
              opacity={0}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>

          {/* On-pad content */}
          {children}
        </group>
      </group>
    </group>
  );
}
