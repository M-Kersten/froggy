import { create } from 'zustand';
import type { NodeContent } from '../types';

export interface ActiveNode {
  id: string;
  accent: string;
  content: NodeContent;
}

interface GameState {
  /** True once the loader has finished and the player presses start. */
  started: boolean;

  /** Island the frog is close enough to interact with (for highlighting). */
  nearbyId: string | null;
  /** Node whose modal is currently open (or null). */
  activeNode: ActiveNode | null;
  /**
   * Node whose modal was just dismissed — stops it instantly re-opening;
   * cleared once the frog walks out of range.
   */
  dismissedId: string | null;

  /** Whether the player has moved the frog at least once. */
  hasMoved: boolean;
  /** Ids of nodes the player has opened, for subtle "visited" styling. */
  visited: Set<string>;

  /** True on touch / coarse-pointer devices (drives the on-screen joystick). */
  isTouch: boolean;

  start: () => void;
  setNearby: (id: string | null) => void;
  openNode: (node: ActiveNode) => void;
  closeNode: () => void;
  markMoved: () => void;
  setTouch: (isTouch: boolean) => void;
}

export const useStore = create<GameState>((set, get) => ({
  started: false,
  nearbyId: null,
  activeNode: null,
  dismissedId: null,
  hasMoved: false,
  visited: new Set<string>(),
  isTouch: false,

  start: () => set({ started: true }),

  setNearby: (id) => {
    const { nearbyId, dismissedId } = get();
    if (id === nearbyId) return;
    // Leaving a node's range clears its "dismissed" lock so it can reopen later.
    set({ nearbyId: id, dismissedId: id === null ? null : dismissedId });
  },

  openNode: (node) => {
    const visited = new Set(get().visited);
    visited.add(node.id);
    set({ activeNode: node, visited });
  },

  closeNode: () => {
    const active = get().activeNode;
    set({ activeNode: null, dismissedId: active ? active.id : get().dismissedId });
  },

  markMoved: () => {
    if (!get().hasMoved) set({ hasMoved: true });
  },

  setTouch: (isTouch) => set({ isTouch }),
}));
