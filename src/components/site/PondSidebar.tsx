import type { CSSProperties } from 'react';
import { teleportTo } from '../../state/frogState';
import { useStore } from '../../store/useStore';
import { getIsland } from '../../data/useWorld';
import { sidebarCards } from '../../data/site';

/**
 * Cards beside the pond that teleport the frog to an island and open its info —
 * so visitors can jump straight to a spot instead of walking there.
 */
export function PondSidebar() {
  const openNode = useStore((s) => s.openNode);

  const jump = (islandId: string) => {
    const isl = getIsland(islandId);
    if (!isl) return;
    teleportTo(isl.position[0], isl.position[1]);
    if (isl.content) openNode({ id: isl.id, accent: isl.accent, content: isl.content });
  };

  return (
    <aside className="pond-sidebar" aria-label="Jump to a spot in the pond">
      <p className="pond-sidebar__title">Hop to…</p>
      {sidebarCards.map((c) => {
        const isl = getIsland(c.island);
        return (
          <button
            key={c.island}
            className="pond-card"
            style={{ '--accent': isl?.accent } as CSSProperties}
            onClick={() => jump(c.island)}
          >
            <span className="pond-card__dot" />
            <span className="pond-card__text">
              <strong>{c.label}</strong>
              <small>{c.hint}</small>
            </span>
            <span className="pond-card__go" aria-hidden="true">→</span>
          </button>
        );
      })}
    </aside>
  );
}
