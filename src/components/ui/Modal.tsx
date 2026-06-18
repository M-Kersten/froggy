import { useEffect, useRef, useState } from 'react';
import { useStore, type ActiveNode } from '../../store/useStore';
import { FrogMark } from './FrogMark';
import type { ContactLink } from '../../types';

function LinkIcon({ icon }: { icon: ContactLink['icon'] }) {
  const common = { width: 18, height: 18, viewBox: '0 0 24 24', 'aria-hidden': true } as const;
  switch (icon) {
    case 'mail':
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="5" width="18" height="14" rx="2.5" />
          <path d="M4 7l8 6 8-6" />
        </svg>
      );
    case 'github':
      return (
        <svg {...common} fill="currentColor">
          <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.36 1.09 2.94.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg {...common} fill="currentColor">
          <path d="M4.98 3.5A2.5 2.5 0 1 1 0 3.5a2.5 2.5 0 0 1 4.98 0ZM.5 8h4V24h-4Zm7 0h3.8v2.2h.05c.53-1 1.83-2.2 3.77-2.2 4.03 0 4.78 2.65 4.78 6.1V24h-4v-7.1c0-1.7 0-3.9-2.37-3.9-2.38 0-2.74 1.85-2.74 3.77V24h-4Z" />
        </svg>
      );
    case 'youtube':
      return (
        <svg {...common} fill="currentColor">
          <path d="M23 7.5a3 3 0 0 0-2.1-2.1C19 5 12 5 12 5s-7 0-8.9.4A3 3 0 0 0 1 7.5 31 31 0 0 0 .6 12 31 31 0 0 0 1 16.5a3 3 0 0 0 2.1 2.1C5 19 12 19 12 19s7 0 8.9-.4a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .4-4.5 31 31 0 0 0-.4-4.5ZM9.8 15.3V8.7l5.7 3.3Z" />
        </svg>
      );
    default:
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1" />
          <path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1" />
        </svg>
      );
  }
}

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none">
    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * Node detail modal. Opens automatically when the frog reaches an island.
 * Handles projects (screenshot + link), info nodes (link) and contact
 * (multiple icon links). Closes on the button, the backdrop or Escape.
 */
export function Modal() {
  const active = useStore((s) => s.activeNode);
  const close = useStore((s) => s.closeNode);

  const [shown, setShown] = useState<ActiveNode | null>(null);
  const [open, setOpen] = useState(false);
  const closeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (active) {
      setShown(active);
      const id = requestAnimationFrame(() => setOpen(true));
      return () => cancelAnimationFrame(id);
    }
    if (shown) {
      setOpen(false);
      const t = setTimeout(() => setShown(null), 280);
      return () => clearTimeout(t);
    }
  }, [active]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!open) return;
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close]);

  if (!shown) return null;
  const { content, accent } = shown;

  return (
    <div className={`modal-backdrop ${open ? 'is-open' : ''}`} onClick={close} role="presentation">
      <div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={(e) => e.stopPropagation()}>
        <div className="modal-shot-wrap">
          {content.screenshot ? (
            <img className="modal-shot" src={content.screenshot} alt={`${content.title} preview`} />
          ) : (
            <div className="modal-emblem" style={{ background: `linear-gradient(140deg, ${accent}, #ffffff66)` }}>
              <span className="modal-emblem__badge">
                <FrogMark size={54} />
              </span>
            </div>
          )}
          <button className="modal-close" ref={closeBtn} onClick={close} aria-label="Close">
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {content.tag && (
            <span className="modal-tag" style={{ background: accent }}>
              {content.tag}
            </span>
          )}
          <h2 id="modal-title">{content.title}</h2>
          <p>{content.summary}</p>

          {content.links ? (
            <div className="modal-links">
              {content.links.map((l) => (
                <a key={l.label} className="modal-link-row" href={l.url} target="_blank" rel="noreferrer">
                  <span className="modal-link-row__icon" style={{ color: accent }}>
                    <LinkIcon icon={l.icon} />
                  </span>
                  {l.label}
                  <span className="modal-link-row__go">
                    <ArrowIcon />
                  </span>
                </a>
              ))}
              <button className="btn btn--ghost" onClick={close}>
                Keep exploring
              </button>
            </div>
          ) : (
            <div className="modal-actions">
              {content.link && (
                <a className="btn btn--primary" href={content.link} target="_blank" rel="noreferrer">
                  {shown.content.screenshot ? 'View project' : 'Learn more'}
                  <ArrowIcon />
                </a>
              )}
              <button className="btn btn--ghost" onClick={close}>
                Keep exploring
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
