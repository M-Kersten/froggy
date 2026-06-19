import { FrogMark } from '../ui/FrogMark';
import { profile, nav } from '../../data/site';

/** Sticky top navigation. */
export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="brand" href="#top">
        <FrogMark size={30} />
        <span>{profile.name}</span>
      </a>
      <nav className="site-nav">
        {nav.map((n) => (
          <a key={n.href} href={n.href}>
            {n.label}
          </a>
        ))}
      </nav>
      <a className="btn btn--primary site-cta" href="#contact">
        Get in touch
      </a>
    </header>
  );
}
