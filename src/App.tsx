import { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Experience } from './components/Experience';
import { Hud } from './components/ui/Hud';
import { Joystick } from './components/ui/Joystick';
import { Modal } from './components/ui/Modal';
import { StartScreen } from './components/ui/StartScreen';
import { useStore } from './store/useStore';
import { useKeyboardControls } from './input/useKeyboardControls';

export default function App() {
  const started = useStore((s) => s.started);
  const modalOpen = useStore((s) => !!s.activeNode);
  const setTouch = useStore((s) => s.setTouch);

  // Movement is live only while playing and no modal is open.
  useKeyboardControls(started && !modalOpen);

  useEffect(() => {
    const coarse =
      window.matchMedia?.('(pointer: coarse)').matches || 'ontouchstart' in window;
    setTouch(coarse);
  }, [setTouch]);

  return (
    <>
      <Canvas
        flat
        dpr={[1, 2]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        className="canvas"
      >
        <Suspense fallback={null}>
          <Experience />
        </Suspense>
      </Canvas>

      <Hud />
      <Joystick />
      <Modal />
      <StartScreen />
    </>
  );
}
