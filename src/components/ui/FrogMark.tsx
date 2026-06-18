/** Small inline frog mark used in the start card and HUD logo. */
export function FrogMark({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <ellipse cx="32" cy="40" rx="22" ry="18" fill="#7ac74f" />
      <circle cx="22" cy="20" r="10" fill="#7ac74f" />
      <circle cx="42" cy="20" r="10" fill="#7ac74f" />
      <circle cx="22" cy="19" r="5.5" fill="#fff" />
      <circle cx="42" cy="19" r="5.5" fill="#fff" />
      <circle cx="23" cy="20" r="2.6" fill="#1d2b22" />
      <circle cx="43" cy="20" r="2.6" fill="#1d2b22" />
      <path d="M24 44 q8 7 16 0" stroke="#3f9a52" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="20" cy="44" r="3.2" fill="#f4a9b8" />
      <circle cx="44" cy="44" r="3.2" fill="#f4a9b8" />
    </svg>
  );
}
