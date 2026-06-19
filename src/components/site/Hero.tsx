import { profile } from '../../data/site';
import { Pond } from './Pond';
import { PondSidebar } from './PondSidebar';

/**
 * Fullscreen hero: the interactive pond fills the viewport, with the site
 * chrome (intro copy + quick-jump sidebar) floating on top. Scrolling down
 * leaves the pond behind and continues into the rest of the page.
 */
export function Hero() {
  return (
    <section className="hero" id="top">
      <Pond />

      <div className="hero__overlay">
        <div className="hero__intro">
          <p className="hero__eyebrow">{profile.role}</p>
          <h1 className="hero__title">{profile.heroTagline}</h1>
          <p className="hero__lede">{profile.heroLede}</p>
          <div className="hero__cta">
            <a className="btn btn--primary" href="#work">
              See my work
            </a>
            <a className="btn btn--ghost" href="#contact">
              Get in touch
            </a>
          </div>
        </div>

        <PondSidebar />

        <a className="hero__scroll" href="#work" aria-label="Scroll to content">
          <span>Scroll to explore</span>
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </section>
  );
}
