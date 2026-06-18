export type IslandType = 'intro' | 'project' | 'info' | 'contact';

/** Decorative prop sitting on an island (Japanese-garden flavour). */
export type IslandProp = 'torii' | 'board' | 'easel' | 'book' | 'mic' | 'signs';

export interface ContactLink {
  label: string;
  url: string;
  /** Simple icon key rendered in the modal. */
  icon: 'mail' | 'github' | 'linkedin' | 'youtube' | 'link';
}

/** Content shown when a node's modal opens. */
export interface NodeContent {
  title: string;
  /** One-sentence summary. */
  summary: string;
  /** Optional preview image (projects). */
  screenshot?: string;
  /** Optional single external link (projects / info). */
  link?: string;
  /** Optional pill label. */
  tag?: string;
  /** Optional list of links (contact). */
  links?: ContactLink[];
}

/** One island in the garden. */
export interface Island {
  id: string;
  type: IslandType;
  /** Short label shown on the grass. */
  label: string;
  /** Step number for the main-path nodes (intro + projects). */
  number?: number;
  /** World position [x, z]. */
  position: [number, number];
  radius: number;
  /** Accent color (highlight ring, modal accents, label tint). */
  accent: string;
  /** Optional decorative prop. */
  prop?: IslandProp;
  /** Modal content (absent for the intro island, which renders copy in 3D). */
  content?: NodeContent;
}

/** A wooden bridge connecting two islands by id. */
export interface Bridge {
  from: string;
  to: string;
}

export interface WorldData {
  islands: Island[];
  bridges: Bridge[];
}
