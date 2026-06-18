import * as THREE from 'three';

/**
 * Shared movement intent, written by every input source (keyboard, on-screen
 * joystick) and read by the frog controller each frame. Vectors are in the
 * pond's screen-space convention: x = right (+X), y = "up"/away (-Z).
 */
export const inputState = {
  keyboard: new THREE.Vector2(0, 0),
  touch: new THREE.Vector2(0, 0),
};

const tmp = new THREE.Vector2();

/**
 * Combined, length-clamped movement direction. Writes into `out` and returns
 * it. `out.y` maps to world -Z (so "up" on screen moves into the pond).
 */
export function getMoveDirection(out: THREE.Vector2): THREE.Vector2 {
  out.copy(inputState.keyboard).add(tmp.copy(inputState.touch));
  if (out.lengthSq() > 1) out.normalize();
  return out;
}
