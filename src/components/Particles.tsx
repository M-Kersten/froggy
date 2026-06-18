import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { registerSplash } from '../state/particles';
import { COLORS } from '../config';

const POOL = 150;
const GRAVITY = 9;
const BASE_SIZE = 0.14;

/**
 * A small pooled particle system for the splash/dust kicked up when the frog
 * lands. Exposes its spawn fn through `registerSplash` so emitters don't need a
 * React reference. Inactive particles are parked at scale 0.
 */
export function Particles() {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const state = useMemo(
    () => ({
      pos: new Float32Array(POOL * 3),
      vel: new Float32Array(POOL * 3),
      life: new Float32Array(POOL),
      maxLife: new Float32Array(POOL),
      cursor: 0,
    }),
    [],
  );

  const geometry = useMemo(() => new THREE.SphereGeometry(1, 6, 5), []);
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: COLORS.waterHighlight,
        transparent: true,
        opacity: 0.92,
        depthWrite: false,
        toneMapped: false,
      }),
    [],
  );

  useEffect(() => {
    const spawn = (x: number, z: number, strength: number) => {
      const n = Math.floor(5 + strength * 8);
      for (let k = 0; k < n; k++) {
        const i = state.cursor;
        state.cursor = (state.cursor + 1) % POOL;
        const a = Math.random() * Math.PI * 2;
        const sp = (1.0 + Math.random() * 1.6) * (0.6 + strength * 0.6);
        state.pos[i * 3 + 0] = x;
        state.pos[i * 3 + 1] = 0.12;
        state.pos[i * 3 + 2] = z;
        state.vel[i * 3 + 0] = Math.cos(a) * sp;
        state.vel[i * 3 + 1] = 1.5 + Math.random() * 2.2;
        state.vel[i * 3 + 2] = Math.sin(a) * sp;
        state.life[i] = 0;
        state.maxLife[i] = 0.42 + Math.random() * 0.3;
      }
    };
    registerSplash(spawn);
    return () => registerSplash(null);
  }, [state]);

  useFrame((_, delta) => {
    const m = mesh.current;
    if (!m) return;
    const dt = Math.min(delta, 0.05);

    for (let i = 0; i < POOL; i++) {
      const alive = state.life[i] < state.maxLife[i];
      if (alive) {
        state.life[i] += dt;
        state.vel[i * 3 + 1] -= GRAVITY * dt;
        state.pos[i * 3 + 0] += state.vel[i * 3 + 0] * dt;
        state.pos[i * 3 + 1] += state.vel[i * 3 + 1] * dt;
        state.pos[i * 3 + 2] += state.vel[i * 3 + 2] * dt;
      }
      const t = state.maxLife[i] > 0 ? state.life[i] / state.maxLife[i] : 1;
      const scale = state.life[i] < state.maxLife[i] ? (1 - t) * BASE_SIZE : 0;
      dummy.position.set(state.pos[i * 3], Math.max(state.pos[i * 3 + 1], 0), state.pos[i * 3 + 2]);
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={mesh} args={[geometry, material, POOL]} frustumCulled={false} />;
}
