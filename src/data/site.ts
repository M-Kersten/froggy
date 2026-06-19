/**
 * Editable copy for the website chrome around the pond. Project + node details
 * live in `world.json`; this is the prose that frames them.
 */

export interface NavItem {
  label: string;
  href: string;
}

export interface SidebarCard {
  label: string;
  hint: string;
  /** Island id the card teleports the frog to. */
  island: string;
}

export const profile = {
  name: 'Merijn Kersten',
  role: 'Creative technologist · XR & playful interaction',
  heroTagline: 'I build playful, spatial experiences.',
  heroLede:
    'Creative technologist working across AI characters, mixed reality and spatial computing. I turn ambitious ideas into interactive things people love to touch.',
  email: 'info@merijnkersten.nl',
};

export const nav: NavItem[] = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Speaking', href: '#speaking' },
  { label: 'Experiments', href: '#experiments' },
  { label: 'Blog', href: '#blog' },
  { label: 'Contact', href: '#contact' },
];

export const sidebarCards: SidebarCard[] = [
  { label: 'About Me', hint: 'Who I am', island: 'introduction' },
  { label: 'Speaking & Workshops', hint: 'Talks & sessions', island: 'talks' },
  { label: 'Experiments', hint: 'Playground', island: 'experiments' },
  { label: 'Blog', hint: 'Writing & devlog', island: 'devlog' },
  { label: 'Contact', hint: 'Say hello', island: 'contact' },
];

export const about = {
  heading: 'About me',
  lede: 'I design and build interactive worlds — and I care as much about how they feel as what they do.',
  body: [
    "I'm Merijn Kersten, a creative technologist based in the Netherlands. I work at the seam between design and engineering: prototyping AI-driven characters, mixed-reality tools and spatial-computing experiences, then shipping them as polished, playful products.",
    'My favourite projects make something complex feel approachable and a little bit magical — whether that\'s underground infrastructure in mixed reality or a pond you explore by guiding a frog.',
  ],
  highlights: [
    { k: 'Focus', v: 'XR · Spatial computing · Creative AI' },
    { k: 'Tools', v: 'Three.js · React · Unity · Vision Pro' },
    { k: 'Based in', v: 'The Netherlands · working worldwide' },
  ],
};

export const speaking = {
  heading: 'Speaking & workshops',
  lede: 'Talks and hands-on sessions on spatial computing, playful interaction and creative AI.',
  items: [
    { title: 'Designing for Spatial Computing', meta: 'Talk · conferences & meetups' },
    { title: 'Prototyping with Creative AI', meta: 'Workshop · teams & studios' },
    { title: 'Playful Interaction Design', meta: 'Guest lecture · universities' },
  ],
};

export const experiments = {
  heading: 'Experiments',
  lede: 'A sketchbook of small prototypes, shader studies and weekend builds — including this pond.',
  items: [
    { title: 'This pond', meta: 'Three.js · React Three Fiber' },
    { title: 'Shader studies', meta: 'GLSL · stylised water & light' },
    { title: 'Interaction toys', meta: 'Tiny playable concepts' },
  ],
};

export const blog = {
  heading: 'Blog & devlog',
  lede: 'Notes and behind-the-scenes writing on the things I’m making.',
  posts: [
    { title: 'Building a frog-pond portfolio', meta: 'Devlog' },
    { title: 'Stylised water without the noise', meta: 'Shaders' },
    { title: 'Spatial UI lessons from Vision Pro', meta: 'XR' },
  ],
};

export const footer = {
  blurb: 'Designed & built by Merijn Kersten. The pond runs on Three.js + React Three Fiber.',
};
