/**
 * Imperative bridge to the splash/dust particle system. The Particles
 * component registers its `spawn` implementation on mount; emitters (the frog)
 * call `splash()` without needing a React reference. No-ops if unmounted.
 */
type SpawnFn = (x: number, z: number, strength: number) => void;

let spawnImpl: SpawnFn | null = null;

export function registerSplash(fn: SpawnFn | null): void {
  spawnImpl = fn;
}

export function splash(x: number, z: number, strength = 1): void {
  spawnImpl?.(x, z, strength);
}
