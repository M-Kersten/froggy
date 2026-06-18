import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { inputState } from '../../input/inputState';

const RADIUS = 56;

interface Stick {
  ox: number;
  oy: number;
  dx: number;
  dy: number;
}

/**
 * Floating touch joystick. Dragging anywhere spawns the stick under the finger
 * and feeds the shared touch input vector; releasing recenters it.
 */
export function Joystick() {
  const isTouch = useStore((s) => s.isTouch);
  const started = useStore((s) => s.started);
  const modalOpen = useStore((s) => !!s.activeNode);
  const [stick, setStick] = useState<Stick | null>(null);

  if (!isTouch || !started || modalOpen) return null;

  const onDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setStick({ ox: e.clientX, oy: e.clientY, dx: 0, dy: 0 });
  };

  const onMove = (e: React.PointerEvent) => {
    setStick((s) => {
      if (!s) return s;
      let dx = e.clientX - s.ox;
      let dy = e.clientY - s.oy;
      const len = Math.hypot(dx, dy);
      if (len > RADIUS) {
        dx = (dx / len) * RADIUS;
        dy = (dy / len) * RADIUS;
      }
      inputState.touch.set(dx / RADIUS, -dy / RADIUS);
      return { ...s, dx, dy };
    });
  };

  const onUp = () => {
    inputState.touch.set(0, 0);
    setStick(null);
  };

  return (
    <div
      className="joystick-zone"
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
    >
      {stick && (
        <>
          <div className="joystick-base" style={{ left: stick.ox, top: stick.oy }} />
          <div
            className="joystick-thumb"
            style={{ left: stick.ox + stick.dx, top: stick.oy + stick.dy }}
          />
        </>
      )}
    </div>
  );
}
