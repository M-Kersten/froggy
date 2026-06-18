import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { LilyPad } from './LilyPad';
import { IntroContent } from './IntroContent';
import { ProjectPadContent } from './ProjectPadContent';
import { projects } from '../../data/useProjects';
import { frogState } from '../../state/frogState';
import { useStore } from '../../store/useStore';
import { INTRO_PAD_ID, INTRO_POSITION, INTRO_RADIUS, WORLD } from '../../config';
import type { Project } from '../../types';

interface PadInfo {
  id: string;
  x: number;
  z: number;
  project?: Project;
}

/**
 * Watches the frog's distance to every pad and drives the shared UI state:
 * which pad is "nearby" (for highlighting) and when to auto-open a project
 * modal. Runs once per frame off the frog's live position (no re-renders).
 */
function PadProximity({ pads }: { pads: PadInfo[] }) {
  useFrame(() => {
    const { started, activeProject, dismissedPadId, nearbyPadId, setNearbyPad, openProject } =
      useStore.getState();
    if (!started) return;

    const { x, z } = frogState.position;
    let nearest: PadInfo | null = null;
    let nearestDist = Infinity;
    for (const pad of pads) {
      const d = Math.hypot(pad.x - x, pad.z - z);
      if (d < nearestDist) {
        nearestDist = d;
        nearest = pad;
      }
    }

    const within = nearest && nearestDist <= WORLD.hintRange ? nearest : null;
    if ((within?.id ?? null) !== nearbyPadId) setNearbyPad(within?.id ?? null);

    // Auto-open the modal for project pads once the frog is in range.
    if (
      within?.project &&
      nearestDist <= WORLD.interactRange &&
      !activeProject &&
      dismissedPadId !== within.id
    ) {
      openProject(within.project);
    }
  });

  return null;
}

export function Pads() {
  const padInfos = useMemo<PadInfo[]>(
    () => [
      { id: INTRO_PAD_ID, x: INTRO_POSITION[0], z: INTRO_POSITION[1] },
      ...projects.map((p) => ({ id: p.id, x: p.position[0], z: p.position[1], project: p })),
    ],
    [],
  );

  return (
    <group>
      <PadProximity pads={padInfos} />

      <LilyPad id={INTRO_PAD_ID} position={INTRO_POSITION} radius={INTRO_RADIUS} accent="#8fe3a0" pulse>
        <IntroContent />
      </LilyPad>

      {projects.map((p) => (
        <LilyPad key={p.id} id={p.id} position={p.position} radius={WORLD.padRadius} accent={p.accent}>
          <ProjectPadContent project={p} />
        </LilyPad>
      ))}
    </group>
  );
}
