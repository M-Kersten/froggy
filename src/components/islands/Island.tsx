import { useMemo, useRef, type ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { BlobShadow } from '../effects/BlobShadow';
import { useStore } from '../../store/useStore';
import { COLORS, WORLD } from '../../config';
import { mulberry32 } from '../../utils/scatter';
import { damp } from '../../utils/math';

interface IslandProps {
  id: string;
  position: [number, number];
  radius: number;
  accent: string;
  children?: ReactNode;
}

/**
 * A solid, layered grassy island: a sandy shoreline, a thick tapered soil body
 * (visible bevelled sides), a flat grass top with a softly shaded rim, a few
 * edge rocks and a soft drop shadow on the water. No glowing outline — approach
 * feedback is a subtle lift + scale.
 */
export function Island({ id, position, radius, accent: _accent, children }: IslandProps) {
  const bob = useRef<THREE.Group>(null);
  const scaler = useRef<THREE.Group>(null);
  const highlight = useRef(0);

  const geo = useMemo(() => {
    const grassTopY = 0.12;
    return {
      sand: new THREE.CylinderGeometry(radius + 0.45, radius + 0.64, 0.2, 30),
      soil: new THREE.CylinderGeometry(radius, radius * 0.82, 0.74, 28),
      grass: new THREE.CylinderGeometry(radius, radius, 0.14, 30),
      rim: new THREE.TorusGeometry(radius, 0.1, 8, 34),
      grassTopY,
    };
  }, [radius]);

  const mats = useMemo(
    () => ({
      sand: new THREE.MeshStandardMaterial({ color: COLORS.sand, flatShading: true, roughness: 0.95 }),
      soil: new THREE.MeshStandardMaterial({ color: COLORS.soil, flatShading: true, roughness: 0.95 }),
      grass: new THREE.MeshStandardMaterial({ color: COLORS.grass, roughness: 0.85 }),
      grassDark: new THREE.MeshStandardMaterial({ color: COLORS.grassDark, flatShading: true, roughness: 0.85 }),
      rock: new THREE.MeshStandardMaterial({ color: COLORS.rock, flatShading: true, roughness: 0.95 }),
    }),
    [],
  );

  const rocks = useMemo(() => {
    let h = 0;
    for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 100000;
    const rng = mulberry32(h + 7);
    const count = 4 + Math.floor(rng() * 3);
    return Array.from({ length: count }, () => {
      const a = rng() * Math.PI * 2;
      const rr = radius + 0.2 + rng() * 0.35;
      const s = 0.32 + rng() * 0.4;
      return {
        x: Math.cos(a) * rr,
        z: Math.sin(a) * rr,
        s,
        ry: rng() * Math.PI,
        sy: 0.5 + rng() * 0.3,
      };
    });
  }, [id, radius]);

  const phase = useMemo(() => {
    let h = 0;
    for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 1000;
    return (h / 1000) * Math.PI * 2;
  }, [id]);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    const dt = Math.min(delta, 0.05);
    if (bob.current) {
      bob.current.position.y = Math.sin(time * 0.7 + phase) * 0.025;
      bob.current.rotation.z = Math.cos(time * 0.5 + phase) * 0.006;
    }
    const target = useStore.getState().nearbyId === id ? 1 : 0;
    highlight.current = damp(highlight.current, target, 8, dt);
    if (scaler.current) {
      const h = highlight.current;
      scaler.current.scale.setScalar(1 + h * 0.022);
      scaler.current.position.y = h * 0.07;
    }
  });

  return (
    <group position={[position[0], 0, position[1]]}>
      {/* Soft drop shadow on the water grounds the island. */}
      <BlobShadow radius={radius + 0.8} position={[0, WORLD.waterY + 0.03, 0]} opacity={0.32} />

      <group ref={bob}>
        <group ref={scaler}>
          {/* Sandy shoreline at the waterline */}
          <mesh geometry={geo.sand} material={mats.sand} position={[0, WORLD.waterY + 0.12, 0]} />
          {/* Thick tapered soil body (visible sides) */}
          <mesh geometry={geo.soil} material={mats.soil} position={[0, geo.grassTopY - 0.07 - 0.37, 0]} />
          {/* Grass top + softly shaded rounded rim */}
          <mesh geometry={geo.grass} material={mats.grass} position={[0, geo.grassTopY - 0.07, 0]} />
          <mesh geometry={geo.rim} material={mats.grassDark} rotation={[Math.PI / 2, 0, 0]} position={[0, geo.grassTopY - 0.02, 0]} />

          {/* Natural edge rocks */}
          {rocks.map((r, i) => (
            <mesh
              key={i}
              material={mats.rock}
              position={[r.x, WORLD.waterY + 0.16, r.z]}
              rotation={[0, r.ry, 0]}
              scale={[r.s, r.s * r.sy, r.s]}
            >
              <dodecahedronGeometry args={[0.5, 0]} />
            </mesh>
          ))}

          {/* On-grass content (focal point) */}
          <group position={[0, geo.grassTopY, 0]}>{children}</group>
        </group>
      </group>
    </group>
  );
}
