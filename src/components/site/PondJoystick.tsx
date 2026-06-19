import { useRef, useState } from 'react';
import { useStore } from '../../store/useStore';
import { inputState } from '../../input/inputState';

const R = 46;

/**
 * A fixed touch joystick in the pond's corner. Only the joystick captures touch
 * (so the rest of the page still scrolls on mobile). Hidden on non-touch.
 */
export function PondJoystick() {
  const isTouch = useStore((s) => s.isTouch);
  const modalOpen = useStore((s) => !!s.activeNode);
  const pointer = useRef<number | null>(null);
  const [thumb, setThumb] = useState({ x: 0, y: 0 });

  if (!isTouch || modalOpen) return null;

  const onDown = (e: React.PointerEvent) => {
    pointer.current = e.pointerId;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (pointer.current !== e.pointerId) return;
    const r = e.currentTarget.getBoundingClientRect();
    let dx = e.clientX - (r.left + r.width / 2);
    let dy = e.clientY - (r.top + r.height / 2);
    const len = Math.hypot(dx, dy);
    if (len > R) {
      dx = (dx / len) * R;
      dy = (dy / len) * R;
    }
    inputState.touch.set(dx / R, -dy / R);
    setThumb({ x: dx, y: dy });
  };
  const onUp = (e: React.PointerEvent) => {
    if (pointer.current !== e.pointerId) return;
    pointer.current = null;
    inputState.touch.set(0, 0);
    setThumb({ x: 0, y: 0 });
  };

  return (
    <div
      className="pond-joystick"
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
    >
      <div className="pond-joystick__thumb" style={{ transform: `translate(${thumb.x}px, ${thumb.y}px)` }} />
    </div>
  );
}
