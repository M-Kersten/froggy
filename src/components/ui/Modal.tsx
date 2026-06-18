import { useEffect, useRef, useState } from 'react';
import { useStore } from '../../store/useStore';
import type { Project } from '../../types';

/**
 * Project detail modal. Opens automatically when the frog reaches a project
 * pad. Closes on the button, the backdrop or Escape. A short local "open" state
 * drives the enter/exit animation so the card can animate out before unmount.
 */
export function Modal() {
  const project = useStore((s) => s.activeProject);
  const close = useStore((s) => s.closeProject);

  const [shown, setShown] = useState<Project | null>(null);
  const [open, setOpen] = useState(false);
  const closeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (project) {
      setShown(project);
      const id = requestAnimationFrame(() => setOpen(true));
      return () => cancelAnimationFrame(id);
    }
    if (shown) {
      setOpen(false);
      const t = setTimeout(() => setShown(null), 280);
      return () => clearTimeout(t);
    }
  }, [project]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!open) return;
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close]);

  if (!shown) return null;

  return (
    <div
      className={`modal-backdrop ${open ? 'is-open' : ''}`}
      onClick={close}
      role="presentation"
    >
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-shot-wrap">
          <img className="modal-shot" src={shown.screenshot} alt={`${shown.title} preview`} />
          <button className="modal-close" ref={closeBtn} onClick={close} aria-label="Close">
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {shown.tag && (
            <span className="modal-tag" style={{ background: shown.accent }}>
              {shown.tag}
            </span>
          )}
          <h2 id="modal-title">{shown.title}</h2>
          <p>{shown.summary}</p>

          <div className="modal-actions">
            <a className="btn btn--primary" href={shown.link} target="_blank" rel="noreferrer">
              View project
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
            </a>
            <button className="btn btn--ghost" onClick={close}>
              Keep exploring
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
