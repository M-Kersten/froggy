import head from '../assets/fonts/Baloo2-Round.ttf';
import body from '../assets/fonts/VarelaRound.ttf';

/**
 * Rounded, friendly fonts (bundled as hashed assets, no CDN) shared by the 3D
 * signs and the DOM UI: Baloo 2 for headings/titles, Varela Round for body.
 * The exported names map onto the old roles so callers don't need to change.
 */
export const FONT_SEMIBOLD = head; // headings, sign titles, key caps, buttons
export const FONT_MEDIUM = body;
export const FONT_REGULAR = body; // body copy, sign subtitles

const FACE_CSS = `
@font-face{font-family:'Baloo 2';src:url(${head}) format('truetype');font-weight:400 700;font-style:normal;font-display:swap;}
@font-face{font-family:'Varela Round';src:url(${body}) format('truetype');font-weight:400;font-style:normal;font-display:swap;}
`;

if (typeof document !== 'undefined' && !document.getElementById('round-faces')) {
  const el = document.createElement('style');
  el.id = 'round-faces';
  el.textContent = FACE_CSS;
  document.head.appendChild(el);
}
