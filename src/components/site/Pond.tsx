import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useProgress } from '@react-three/drei';
import { Experience } from '../Experience';
import { PondJoystick } from './PondJoystick';
import { useStore } from '../../store/useStore';
import { useKeyboardControls } from '../../input/useKeyboardControls';

/**
 * The interactive pond, embedded as a hero panel (not fullscreen). Keyboard
 * control only activates while the pond is hovered/focused so the page still
 * scrolls normally, and rendering pauses when it scrolls out of view.
 */
export function Pond() {
  const wrap = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const [inView, setInView] = useState(true);

  const modalOpen = useStore((s) => !!s.activeNode);
  const hasMoved = useStore((s) => s.hasMoved);
  const isTouch = useStore((s) => s.isTouch);
  const setTouch = useStore((s) => s.setTouch);
  const { active: loading, progress } = useProgress();

  useKeyboardControls(hovering && !modalOpen);

  useEffect(() => {
    setTouch(window.matchMedia?.('(pointer: coarse)').matches || 'ontouchstart' in window);
  }, [setTouch]);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.04 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      className="pond-wrap"
      ref={wrap}
      onPointerEnter={() => setHovering(true)}
      onPointerLeave={() => setHovering(false)}
    >
      <Canvas
        flat
        dpr={[1, 2]}
        frameloop={inView ? 'always' : 'never'}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        className="pond-canvas"
      >
        <Suspense fallback={null}>
          <Experience />
        </Suspense>
      </Canvas>

      {loading && (
        <div className="pond-loader">
          <span className="pond-spinner" />
          Loading the pond… {Math.round(progress)}%
        </div>
      )}

      <div className={`pond-hint ${hasMoved || modalOpen ? 'is-hidden' : ''}`}>
        {isTouch ? (
          'Drag the joystick to roam'
        ) : (
          <>
            <kbd>W</kbd>
            <kbd>A</kbd>
            <kbd>S</kbd>
            <kbd>D</kbd> to roam · click a card to jump
          </>
        )}
      </div>

      <PondJoystick />
    </div>
  );
}
