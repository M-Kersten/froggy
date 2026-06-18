import { create } from 'zustand';
import type { Project } from '../types';

interface GameState {
  /** True once the asset loader has finished and the player presses start. */
  started: boolean;

  /** Pad the frog is currently close enough to interact with (or null). */
  nearbyPadId: string | null;
  /** Project whose modal is currently open (or null). */
  activeProject: Project | null;
  /**
   * The pad whose modal the player just dismissed. Prevents the modal from
   * instantly re-opening; cleared once the frog leaves interaction range.
   */
  dismissedPadId: string | null;

  /** Whether the player has moved the frog at least once. */
  hasMoved: boolean;
  /** Ids of project pads the player has opened, for subtle "visited" styling. */
  visited: Set<string>;

  /** True on touch / coarse-pointer devices (drives the on-screen joystick). */
  isTouch: boolean;

  start: () => void;
  setNearbyPad: (id: string | null) => void;
  openProject: (project: Project) => void;
  closeProject: () => void;
  markMoved: () => void;
  setTouch: (isTouch: boolean) => void;
}

export const useStore = create<GameState>((set, get) => ({
  started: false,
  nearbyPadId: null,
  activeProject: null,
  dismissedPadId: null,
  hasMoved: false,
  visited: new Set<string>(),
  isTouch: false,

  start: () => set({ started: true }),

  setNearbyPad: (id) => {
    const { nearbyPadId, dismissedPadId } = get();
    if (id === nearbyPadId) return;
    // Leaving a pad's range clears its "dismissed" lock so it can reopen later.
    const nextDismissed = id === null ? null : dismissedPadId;
    set({ nearbyPadId: id, dismissedPadId: nextDismissed });
  },

  openProject: (project) => {
    const visited = new Set(get().visited);
    visited.add(project.id);
    set({ activeProject: project, visited });
  },

  closeProject: () => {
    const active = get().activeProject;
    set({
      activeProject: null,
      // Remember which pad we dismissed so it won't immediately pop again.
      dismissedPadId: active ? active.id : get().dismissedPadId,
    });
  },

  markMoved: () => {
    if (!get().hasMoved) set({ hasMoved: true });
  },

  setTouch: (isTouch) => set({ isTouch }),
}));
