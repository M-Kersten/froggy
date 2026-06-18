/** A single portfolio entry, rendered as a project lily pad + modal. */
export interface Project {
  /** Stable unique id, also used as the lily pad id. */
  id: string;
  /** Short title shown on the pad and in the modal header. */
  title: string;
  /** One-sentence description shown on the pad. */
  description: string;
  /** One-sentence summary shown in the modal (can match description). */
  summary: string;
  /** Path to the preview screenshot (relative to the site root). */
  screenshot: string;
  /** Destination for the "View project" / "Read More" link. */
  link: string;
  /** Optional small tag shown as a pill in the modal. */
  tag?: string;
  /** World position of the pad on the pond, [x, z]. */
  position: [number, number];
  /** Accent color (hex) used for the pad highlight + modal accents. */
  accent: string;
}

/** The intro pad has the same spatial fields but fixed copy. */
export interface PadLayout {
  id: string;
  position: [number, number];
  radius: number;
}
