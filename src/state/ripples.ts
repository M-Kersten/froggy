/**
 * A small fixed-size ring buffer of water ripples shared with the water
 * shader. Each ripple is packed as vec4(x, z, startTime, strength) and the
 * flat Float32Array is handed directly to a `uniform vec4 uRipples[MAX]`.
 */
export const MAX_RIPPLES = 24;

/** Packed ripple data: [x, z, startTime, strength] × MAX_RIPPLES. */
export const rippleData = new Float32Array(MAX_RIPPLES * 4);

let head = 0;

/**
 * Register a new ripple at (x, z). `now` is the shared shader clock time so
 * the shader can compute each ripple's age. Strength scales size + opacity.
 */
export function addRipple(x: number, z: number, now: number, strength = 1): void {
  const i = head * 4;
  rippleData[i + 0] = x;
  rippleData[i + 1] = z;
  rippleData[i + 2] = now;
  rippleData[i + 3] = strength;
  head = (head + 1) % MAX_RIPPLES;
}
