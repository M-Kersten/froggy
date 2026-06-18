import { useEffect } from 'react';
import { inputState } from './inputState';

const KEY_MAP: Record<string, [axis: 'x' | 'y', value: number]> = {
  KeyW: ['y', 1],
  ArrowUp: ['y', 1],
  KeyS: ['y', -1],
  ArrowDown: ['y', -1],
  KeyA: ['x', -1],
  ArrowLeft: ['x', -1],
  KeyD: ['x', 1],
  ArrowRight: ['x', 1],
};

/**
 * Listens for WASD / arrow keys and updates the shared keyboard input vector.
 * `enabled` lets us suspend movement (e.g. while a modal is open).
 */
export function useKeyboardControls(enabled: boolean): void {
  useEffect(() => {
    const pressed = new Set<string>();

    const recompute = () => {
      let x = 0;
      let y = 0;
      for (const code of pressed) {
        const entry = KEY_MAP[code];
        if (!entry) continue;
        if (entry[0] === 'x') x += entry[1];
        else y += entry[1];
      }
      inputState.keyboard.set(Math.max(-1, Math.min(1, x)), Math.max(-1, Math.min(1, y)));
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (!(e.code in KEY_MAP)) return;
      // Stop the page from scrolling on arrow / space presses.
      e.preventDefault();
      if (!enabled) return;
      pressed.add(e.code);
      recompute();
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (!(e.code in KEY_MAP)) return;
      pressed.delete(e.code);
      recompute();
    };

    const reset = () => {
      pressed.clear();
      inputState.keyboard.set(0, 0);
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    // Releasing focus (tab switch) should stop the frog.
    window.addEventListener('blur', reset);

    if (!enabled) reset();

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', reset);
      reset();
    };
  }, [enabled]);
}
