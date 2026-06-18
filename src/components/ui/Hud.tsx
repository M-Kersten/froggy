import { useStore } from '../../store/useStore';
import { FrogMark } from './FrogMark';

/** Minimal heads-up overlay: a name mark and a fading movement hint. */
export function Hud() {
  const started = useStore((s) => s.started);
  const hasMoved = useStore((s) => s.hasMoved);
  const isTouch = useStore((s) => s.isTouch);
  const modalOpen = useStore((s) => !!s.activeProject);

  if (!started) return null;

  return (
    <>
      <div className="hud-logo">
        <FrogMark size={32} />
        <span>Merijn Kersten</span>
      </div>

      <div className={`hud-hint ${hasMoved || modalOpen ? 'hud-hint--hide' : ''}`}>
        {isTouch ? (
          <>Drag anywhere to guide the frog</>
        ) : (
          <>
            Use <kbd>W</kbd>
            <kbd>A</kbd>
            <kbd>S</kbd>
            <kbd>D</kbd> or arrow keys to move
          </>
        )}
      </div>
    </>
  );
}
