import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { FrogModel } from './FrogModel';
import { frogState } from '../../state/frogState';
import { addRipple } from '../../state/ripples';
import { splash } from '../../state/particles';
import { getMoveDirection } from '../../input/inputState';
import { useStore } from '../../store/useStore';
import { WORLD } from '../../config';
import { dampAngle, easeInOutCubic, lerp, damp } from '../../utils/math';

type Phase = 'idle' | 'hop';

/**
 * Frog controller. Movement is a chain of short froggy hops: holding a
 * direction queues hop after hop, each an eased arc with squash on take-off /
 * landing and a stretch through the air. Landing spawns a ripple + splash.
 */
export function Frog() {
  const root = useRef<THREE.Group>(null);
  const squash = useRef<THREE.Group>(null);

  const phase = useRef<Phase>('idle');
  const hopT = useRef(0);
  const start = useRef(new THREE.Vector2());
  const target = useRef(new THREE.Vector2());
  const cooldown = useRef(0);
  const landImpact = useRef(0);
  const idleRipple = useRef(1.2);

  const move = useRef(new THREE.Vector2());

  const beginHop = (dirX: number, dirZ: number) => {
    const len = Math.hypot(dirX, dirZ) || 1;
    const nx = dirX / len;
    const nz = dirZ / len;

    start.current.set(frogState.position.x, frogState.position.z);
    let tx = start.current.x + nx * WORLD.hopDistance;
    let tz = start.current.y + nz * WORLD.hopDistance;

    // Keep the frog inside the playable shore circle.
    const d = Math.hypot(tx, tz);
    if (d > WORLD.playableRadius) {
      tx = (tx / d) * WORLD.playableRadius;
      tz = (tz / d) * WORLD.playableRadius;
    }
    target.current.set(tx, tz);

    frogState.facing = Math.atan2(nx, nz); // model nose points +Z
    hopT.current = 0;
    phase.current = 'hop';
    frogState.isMoving = true;
  };

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const time = state.clock.elapsedTime;
    const { started, activeProject, markMoved } = useStore.getState();
    const canMove = started && !activeProject;

    getMoveDirection(move.current);
    // Screen "up" (move.y) is world -Z.
    const dirX = move.current.x;
    const dirZ = -move.current.y;
    const hasInput = canMove && dirX * dirX + dirZ * dirZ > 0.02;

    if (cooldown.current > 0) cooldown.current -= dt;

    let airStretch = 1;

    if (phase.current === 'idle') {
      frogState.isMoving = false;
      if (hasInput && cooldown.current <= 0) {
        beginHop(dirX, dirZ);
        markMoved();
      } else {
        // Faint idle ripple so the frog looks like it's resting in the water.
        idleRipple.current -= dt;
        if (idleRipple.current <= 0) {
          addRipple(frogState.position.x, frogState.position.z, time, 0.22);
          idleRipple.current = 1.6 + Math.random();
        }
      }
    }

    if (phase.current === 'hop') {
      hopT.current += dt / WORLD.hopDuration;
      const tt = Math.min(hopT.current, 1);
      const e = easeInOutCubic(tt);
      const x = lerp(start.current.x, target.current.x, e);
      const z = lerp(start.current.y, target.current.y, e);
      const y = Math.sin(Math.PI * tt) * WORLD.hopHeight;
      frogState.position.set(x, y, z);
      airStretch = 1 + Math.sin(Math.PI * tt) * 0.18;

      if (hopT.current >= 1) {
        phase.current = 'idle';
        cooldown.current = WORLD.hopCooldown;
        frogState.position.set(target.current.x, 0, target.current.y);
        landImpact.current = 1;
        addRipple(target.current.x, target.current.y, time, 0.85);
        splash(target.current.x, target.current.y, 1);
      }
    } else {
      frogState.position.y = 0;
    }

    // Landing squash relaxes back out (springy settle).
    landImpact.current = damp(landImpact.current, 0, 9, dt);
    const land = landImpact.current;
    const sy = airStretch * (1 - land * 0.28);
    const sxz = (1 / Math.sqrt(airStretch)) * (1 + land * 0.2);
    if (squash.current) squash.current.scale.set(sxz, sy, sxz);

    // Apply transform to the scene graph.
    if (root.current) {
      root.current.position.copy(frogState.position);
      root.current.rotation.y = dampAngle(
        root.current.rotation.y,
        frogState.facing,
        WORLD.turnSpeed,
        dt,
      );
    }
  });

  return (
    <group ref={root} position={[frogState.position.x, 0, frogState.position.z]}>
      <group ref={squash}>
        <FrogModel />
      </group>
    </group>
  );
}
