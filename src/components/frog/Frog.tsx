import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { FrogModel } from './FrogModel';
import { frogState } from '../../state/frogState';
import { isWalkable } from '../../state/walkable';
import { splash } from '../../state/particles';
import { getMoveDirection } from '../../input/inputState';
import { useStore } from '../../store/useStore';
import { WORLD } from '../../config';
import { clamp, dampAngle, damp } from '../../utils/math';

/**
 * Frog controller — smooth two-legged walking constrained to the walkable
 * surface (islands + bridges), with gentle wall-sliding so it never steps into
 * the water. Publishes normalized speed + walk phase for the model's walk cycle.
 */
export function Frog() {
  const root = useRef<THREE.Group>(null);
  const vel = useRef(new THREE.Vector2());
  const move = useRef(new THREE.Vector2());
  const stepTimer = useRef(0);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const { started, activeNode, markMoved } = useStore.getState();
    const canMove = started && !activeNode;

    getMoveDirection(move.current);
    const dirX = move.current.x;
    const dirZ = -move.current.y; // screen up = world -Z
    const hasInput = canMove && dirX * dirX + dirZ * dirZ > 0.02;

    // Smoothly accelerate the velocity toward the desired direction.
    const targetVX = hasInput ? dirX * WORLD.walkSpeed : 0;
    const targetVZ = hasInput ? dirZ * WORLD.walkSpeed : 0;
    const k = 1 - Math.exp(-WORLD.walkAccel * dt);
    vel.current.x += (targetVX - vel.current.x) * k;
    vel.current.y += (targetVZ - vel.current.y) * k;

    // Attempt the move; slide along edges if blocked, so the frog hugs the land.
    const px = frogState.position.x;
    const pz = frogState.position.z;
    let nx = px + vel.current.x * dt;
    let nz = pz + vel.current.y * dt;
    if (!isWalkable(nx, nz)) {
      if (isWalkable(nx, pz)) {
        nz = pz;
        vel.current.y = 0;
      } else if (isWalkable(px, nz)) {
        nx = px;
        vel.current.x = 0;
      } else {
        nx = px;
        nz = pz;
        vel.current.set(0, 0);
      }
    }
    frogState.position.set(nx, 0, nz);

    // Animation state from the distance actually travelled.
    const dist = Math.hypot(nx - px, nz - pz);
    const norm = clamp(dist / dt / WORLD.walkSpeed, 0, 1);
    frogState.speed = damp(frogState.speed, norm, 12, dt);
    frogState.walkPhase += dist * 5.5;

    if (hasInput) {
      frogState.facing = Math.atan2(dirX, dirZ);
      markMoved();
    }

    // Little dust puffs from the footsteps.
    if (frogState.speed > 0.25) {
      stepTimer.current -= dt;
      if (stepTimer.current <= 0) {
        splash(nx, nz, 0.35);
        stepTimer.current = 0.24;
      }
    }

    if (root.current) {
      root.current.position.set(nx, 0, nz);
      root.current.rotation.y = dampAngle(root.current.rotation.y, frogState.facing, WORLD.turnSpeed, dt);
    }
  });

  return (
    <group ref={root} position={[frogState.position.x, 0, frogState.position.z]}>
      <FrogModel />
    </group>
  );
}
