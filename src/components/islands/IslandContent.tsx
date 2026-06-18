import { FramedDisplay } from './FramedDisplay';
import { Signboard } from './Signboard';
import { StandProp } from './StandProp';
import type { Island } from '../../types';

/**
 * Composes a node island like a small diorama: a focal display/prop set back
 * from a labelled signboard near the front, with empty grass around them.
 */
export function IslandContent({ island }: { island: Island }) {
  const content = island.content;
  if (!content) return null;

  const isProject = island.type === 'project' && !!content.screenshot;

  return (
    <group>
      {isProject ? (
        <FramedDisplay url={content.screenshot!} width={2.7} position={[0, 0, -1.1]} />
      ) : (
        island.prop &&
        island.prop !== 'torii' &&
        island.prop !== 'board' && (
          <group position={[0, 0, -0.6]}>
            <StandProp prop={island.prop} accent={island.accent} />
          </group>
        )
      )}

      <Signboard
        title={isProject ? content.title : island.label}
        subtitle={isProject ? content.tag : undefined}
        accent={island.accent}
        badge={island.number}
        width={isProject ? 2.7 : 2.0}
        position={[0, 0, isProject ? 1.7 : 0.95]}
      />
    </group>
  );
}
