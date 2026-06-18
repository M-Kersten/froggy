import * as THREE from 'three';
import { FROG_START } from '../config';

/**
 * Single-frog game → a tiny module-level singleton is the simplest, fastest
 * way to share the frog's live transform between the controller, the camera
 * rig, ripples and particles without forcing React re-renders every frame.
 */
export const frogState = {
  /** Current world position (y is the hop height above the water). */
  position: new THREE.Vector3(FROG_START[0], 0, FROG_START[1]),
  /** Facing angle in radians (around the Y axis). */
  facing: Math.PI, // looking "into" the garden (toward -Z) at the start
  /** Normalized walk speed 0..1 (drives the walk-cycle blend). */
  speed: 0,
  /** Walk-cycle phase in radians (advances with distance travelled). */
  walkPhase: 0,
};

// Lightweight debug hook (used by the headless smoke test).
if (typeof window !== 'undefined') {
  (window as unknown as { __frog?: typeof frogState }).__frog = frogState;
}
