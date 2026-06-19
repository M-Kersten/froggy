import { type ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import { Island } from './Island';
import { IntroContent } from './IntroContent';
import { IslandContent } from './IslandContent';
import { Bridge } from './Bridge';
import { SmallLilies } from './SmallLilies';
import { SteppingStones } from './SteppingStones';
import { BlobShadow } from '../effects/BlobShadow';
import { Torii, StoneLantern, CherryTree, Bamboo } from '../environment/japanese';
import { islands, bridgeCurves } from '../../data/useWorld';
import { frogState } from '../../state/frogState';
import { useStore } from '../../store/useStore';
import type { Island as IslandData } from '../../types';

/** A decoration prop with a soft grounding shadow beneath it. */
function Grounded({
  x,
  z,
  shadow,
  children,
}: {
  x: number;
  z: number;
  shadow: number;
  children: ReactNode;
}) {
  return (
    <group position={[x, 0, z]}>
      <BlobShadow radius={shadow} position={[0, 0.02, 0]} opacity={0.26} />
      {children}
    </group>
  );
}

/** Sparse Japanese-garden decoration; trees overhang the edges for depth. */
function IslandDecor({ island }: { island: IslandData }) {
  const r = island.radius;
  if (island.type === 'intro') {
    return (
      <group>
        <Grounded x={0} z={-r * 0.74} shadow={1.0}>
          <Torii scale={1.2} />
        </Grounded>
        <Grounded x={r * 0.66} z={-r * 0.4} shadow={1.0}>
          <CherryTree scale={1.3} />
        </Grounded>
        {([-1, 1] as const).map((s) => (
          <Grounded key={s} x={s * 1.5} z={r * 0.46} shadow={0.45}>
            <StoneLantern scale={0.95} />
          </Grounded>
        ))}
      </group>
    );
  }
  const even = island.id.charCodeAt(0) % 2 === 0;
  return (
    <group>
      <Grounded x={-r * 0.66} z={-r * 0.36} shadow={0.95}>
        <CherryTree scale={1.15} />
      </Grounded>
      <Grounded x={r * 0.6} z={r * 0.2} shadow={0.42}>
        {even ? <StoneLantern scale={0.8} /> : <Bamboo scale={0.85} />}
      </Grounded>
    </group>
  );
}

/** Watches the frog's distance to each island; drives highlight + auto-modal. */
function IslandProximity() {
  useFrame(() => {
    const { started, activeNode, dismissedId, nearbyId, setNearby, openNode } = useStore.getState();
    if (!started) return;
    const { x, z } = frogState.position;
    let nearest: IslandData | null = null;
    let best = Infinity;
    for (const isl of islands) {
      const d = Math.hypot(isl.position[0] - x, isl.position[1] - z);
      if (d < best) {
        best = d;
        nearest = isl;
      }
    }
    if (!nearest) return;
    const within = best <= nearest.radius + 1.4 ? nearest : null;
    if ((within?.id ?? null) !== nearbyId) setNearby(within?.id ?? null);
    // Auto-open on walk-up, but never the intro hub (the frog starts there).
    if (
      within?.content &&
      within.type !== 'intro' &&
      best <= within.radius * 0.7 &&
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

      {bridgeCurves.map((curve, i) => (
        <Bridge key={i} curve={curve} />
      ))}

      {/* Stepping stones leading onto each island from its bridges. */}
      {bridgeCurves.map((curve, i) => {
        const stones: ReactNode[] = [];
        const ends: [[number, number], [number, number], number][] = [
          [curve.p0, curve.p1, 0],
          [curve.p2, curve.p1, 1],
        ];
        ends.forEach(([edge, ctrl, k]) => {
          const inwardX = edge[0] - ctrl[0];
          const inwardZ = edge[1] - ctrl[1];
          const len = Math.hypot(inwardX, inwardZ) || 1;
          const nx = inwardX / len;
          const nz = inwardZ / len;
          stones.push(
            <SteppingStones
              key={`${i}-${k}`}
              count={3}
              spacing={0.62}
              position={[edge[0] + nx * 0.4, 0.12, edge[1] + nz * 0.4]}
              rotation={[0, Math.atan2(nx, nz), 0]}
              seed={i * 7 + k + 1}
            />,
          );
        });
        return <group key={`s${i}`}>{stones}</group>;
      })}

      {islands.map((isl) => (
        <Island key={isl.id} id={isl.id} position={isl.position} radius={isl.radius} accent={isl.accent}>
          {isl.type === 'intro' ? <IntroContent /> : <IslandContent island={isl} />}
          <IslandDecor island={isl} />
        </Island>
      ))}
    </group>
  );
}
