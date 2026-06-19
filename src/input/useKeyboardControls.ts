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
 * Listens for WASD / arrow keys and updates the shared keyboard input vector —
 * but only while `enabled` (i.e. the pond is focused/hovered). When disabled it
 * attaches no listeners, so arrow keys scroll the page normally.
 */
export function useKeyboardControls(enabled: boolean): void {
  useEffect(() => {
    if (!enabled) {
      inputState.keyboard.set(0, 0);
      return;
    }

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
      e.preventDefault(); // stop arrow/space page scroll while controlling the frog
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
    window.addEventListener('blur', reset);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', reset);
      reset();
    };
  }, [enabled]);
}
