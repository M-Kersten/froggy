import { useFrame } from '@react-three/fiber';
import { Island } from './Island';
import { IntroContent } from './IntroContent';
import { IslandContent } from './IslandContent';
import { Bridge } from './Bridge';
import { SmallLilies } from './SmallLilies';
import { Torii, StoneLantern, CherryTree, Bamboo } from '../environment/japanese';
import { islands, bridgeSegments } from '../../data/useWorld';
import { frogState } from '../../state/frogState';
import { useStore } from '../../store/useStore';
import type { Island as IslandData } from '../../types';

/** Per-island Japanese-garden decoration, kept sparse and tucked to the edges. */
function IslandDecor({ island }: { island: IslandData }) {
  const r = island.radius;
  if (island.type === 'intro') {
    return (
      <group>
        <Torii position={[0, 0, -r * 0.82]} scale={1.05} />
        <StoneLantern position={[-1.0, 0, r * 0.5]} scale={0.95} />
        <StoneLantern position={[1.0, 0, r * 0.5]} scale={0.95} />
        <CherryTree position={[r * 0.6, 0, -r * 0.34]} scale={0.85} />
      </group>
    );
  }
  return (
    <group>
      <StoneLantern position={[-r * 0.62, 0, r * 0.42]} scale={0.82} />
      {island.id.charCodeAt(0) % 2 === 0 ? (
        <CherryTree position={[r * 0.6, 0, -r * 0.18]} scale={0.78} />
      ) : (
        <Bamboo position={[r * 0.62, 0, -r * 0.1]} scale={0.8} />
      )}
    </group>
  );
}

/**
 * Watches the frog's distance to each island and drives shared UI state:
 * which island is "nearby" (highlight) and when to auto-open its modal.
 */
function IslandProximity() {
  useFrame(() => {
    const { started, activeNode, dismissedId, nearbyId, setNearby, openNode } = useStore.getState();
    if (!started) return;

    const { x, z } = frogState.position;
    let nearest: IslandData | null = null;
    let nearestDist = Infinity;
    for (const isl of islands) {
      const d = Math.hypot(isl.position[0] - x, isl.position[1] - z);
      if (d < nearestDist) {
        nearestDist = d;
        nearest = isl;
      }
    }
    if (!nearest) return;

    const within = nearestDist <= nearest.radius + 1.6 ? nearest : null;
    if ((within?.id ?? null) !== nearbyId) setNearby(within?.id ?? null);

    // Auto-open the modal when the frog is well onto a node island.
    if (
      within?.content &&
      nearestDist <= within.radius * 0.78 &&
      !activeNode &&
      dismissedId !== within.id
    ) {
      openNode({ id: within.id, accent: within.accent, content: within.content });
    }
  });
  return null;
}

export function Islands() {
  return (
    <group>
      <IslandProximity />
      <SmallLilies />

      {bridgeSegments.map(({ from, to }, i) => {
        const ax = from.position[0];
        const az = from.position[1];
        const dx = to.position[0] - ax;
        const dz = to.position[1] - az;
        const len = Math.hypot(dx, dz) || 1;
        const ux = dx / len;
        const uz = dz / len;
        const start: [number, number] = [ax + ux * (from.radius - 0.2), az + uz * (from.radius - 0.2)];
        const end: [number, number] = [to.position[0] - ux * (to.radius - 0.2), to.position[1] - uz * (to.radius - 0.2)];
        return <Bridge key={i} start={start} end={end} />;
      })}

      {islands.map((isl) => (
        <Island
          key={isl.id}
          id={isl.id}
          position={isl.position}
          radius={isl.radius}
          accent={isl.accent}
          pulse={isl.type === 'intro'}
        >
          {isl.type === 'intro' ? <IntroContent /> : <IslandContent island={isl} />}
          <IslandDecor island={isl} />
        </Island>
      ))}
    </group>
  );
}
