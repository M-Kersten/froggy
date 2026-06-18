import data from './world.json';
import type { Island, Bridge, WorldData } from '../types';

const world = data as WorldData;

export const islands: Island[] = world.islands;
export const bridges: Bridge[] = world.bridges;

export function getIsland(id: string): Island | undefined {
  return islands.find((i) => i.id === id);
}

/** Resolve bridges to concrete island endpoints (skips any dangling ids). */
export interface BridgeSegment {
  from: Island;
  to: Island;
}

export const bridgeSegments: BridgeSegment[] = bridges
  .map((b) => ({ from: getIsland(b.from), to: getIsland(b.to) }))
  .filter((s): s is BridgeSegment => !!s.from && !!s.to);
