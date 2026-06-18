import regular from '../assets/fonts/Poppins-Regular.ttf';
import medium from '../assets/fonts/Poppins-Medium.ttf';
import semibold from '../assets/fonts/Poppins-SemiBold.ttf';

/**
 * Fonts are bundled as hashed assets (works at any deploy path) and reused by
 * both the 3D text (troika) and the DOM UI. We inject the @font-face rules from
 * the same imported URLs so there's a single source of truth and no CDN fetch.
 */
export const FONT_REGULAR = regular;
export const FONT_MEDIUM = medium;
export const FONT_SEMIBOLD = semibold;

const FACE_CSS = `
@font-face{font-family:'Poppins';src:url(${regular}) format('truetype');font-weight:400;font-style:normal;font-display:swap;}
@font-face{font-family:'Poppins';src:url(${medium}) format('truetype');font-weight:500;font-style:normal;font-display:swap;}
@font-face{font-family:'Poppins';src:url(${semibold}) format('truetype');font-weight:600;font-style:normal;font-display:swap;}
`;

if (typeof document !== 'undefined' && !document.getElementById('poppins-faces')) {
  const el = document.createElement('style');
  el.id = 'poppins-faces';
  el.textContent = FACE_CSS;
  document.head.appendChild(el);
}
