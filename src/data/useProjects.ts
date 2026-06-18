import data from './projects.json';
import type { Project } from '../types';

interface IntroData {
  title: string;
  description: string;
}

/**
 * Project content is authored in `projects.json` so new entries can be added
 * without touching component code — just append an object to `projects`.
 */
export const intro: IntroData = data.intro;

export const projects: Project[] = data.projects as Project[];

export function getProjectById(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}
