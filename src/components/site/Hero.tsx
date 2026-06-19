import { profile } from '../../data/site';
import { Pond } from './Pond';
import { PondSidebar } from './PondSidebar';

/** Hero: intro copy above the interactive pond + its quick-jump sidebar. */
export function Hero() {
  return (
    <section className="hero" id="top">
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

      <div className="hero__stage">
        <Pond />
        <PondSidebar />
      </div>
    </section>
  );
}
