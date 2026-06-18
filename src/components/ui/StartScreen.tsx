import { useEffect, useState } from 'react';
import { useProgress } from '@react-three/drei';
import { useStore } from '../../store/useStore';
import { FrogMark } from './FrogMark';

/**
 * Welcome / loading overlay. Waits for assets (and a short minimum) before
 * enabling the "Hop in" button, then fades out once the player starts.
 */
export function StartScreen() {
  const started = useStore((s) => s.started);
  const start = useStore((s) => s.start);
  const { active, progress } = useProgress();

  const [minPassed, setMinPassed] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMinPassed(true), 900);
    return () => clearTimeout(t);
  }, []);

  if (hidden) return null;

  const ready = minPassed && !active;

  return (
    <div
      className={`start ${started ? 'start--hide' : ''}`}
      onTransitionEnd={() => started && setHidden(true)}
      aria-hidden={started}
    >
      <div className="start__card">
        <div className="start__mark">
          <FrogMark size={72} />
        </div>
        <h1>Merijn Kersten</h1>
        <p>
          An interactive portfolio in a tiny pond. Guide the frog across the lily pads to discover
          my work.
        </p>
        <button className="btn btn--primary start__btn" disabled={!ready} onClick={start}>
          {ready ? 'Hop in' : `Loading ${Math.round(progress)}%`}
          {ready && (
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path
                d="M5 12h14M13 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          )}
        </button>
        <span className="start__controls">WASD / arrow keys · drag on touch</span>
      </div>
    </div>
  );
}
