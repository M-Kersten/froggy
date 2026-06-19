import type { CSSProperties } from 'react';
import { teleportTo } from '../../state/frogState';
import { useStore } from '../../store/useStore';
import { projects, getIsland } from '../../data/useWorld';
import { about, speaking, experiments, blog, profile } from '../../data/site';
import type { Island } from '../../types';

function scrollTop() {
  document.getElementById('top')?.scrollIntoView({ behavior: 'smooth' });
}

function Work() {
  const openNode = useStore((s) => s.openNode);
  const showInPond = (isl: Island) => {
    teleportTo(isl.position[0], isl.position[1]);
    if (isl.content) openNode({ id: isl.id, accent: isl.accent, content: isl.content });
    scrollTop();
  };

  return (
    <section className="section" id="work">
      <div className="section__head">
        <h2>Selected work</h2>
        <p>A few projects I'm proud of — or guide the frog across the pond to find them.</p>
      </div>
      <div className="work-grid">
        {projects.map((p) => {
          const c = p.content!;
          return (
            <article className="work-card" key={p.id} style={{ '--accent': p.accent } as CSSProperties}>
              <a className="work-card__shot" href={c.link} target="_blank" rel="noreferrer">
                <img src={c.screenshot} alt={`${c.title} preview`} loading="lazy" />
              </a>
              <div className="work-card__body">
                {c.tag && <span className="tag">{c.tag}</span>}
                <h3>{c.title}</h3>
                <p>{c.summary}</p>
                <div className="work-card__actions">
                  <a className="btn btn--primary" href={c.link} target="_blank" rel="noreferrer">
                    View project
                  </a>
                  <button className="btn btn--ghost" onClick={() => showInPond(p)}>
                    Show in pond
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="section section--split" id="about">
      <div className="section__head">
        <h2>{about.heading}</h2>
        <p>{about.lede}</p>
      </div>
      <div className="about-body">
        <div className="about-prose">
          {about.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <dl className="about-facts">
          {about.highlights.map((h) => (
            <div key={h.k}>
              <dt>{h.k}</dt>
              <dd>{h.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function TileSection({
  id,
  heading,
  lede,
  items,
}: {
  id: string;
  heading: string;
  lede: string;
  items: { title: string; meta: string }[];
}) {
  return (
    <section className="section" id={id}>
      <div className="section__head">
        <h2>{heading}</h2>
        <p>{lede}</p>
      </div>
      <ul className="tile-list">
        {items.map((it) => (
          <li key={it.title} className="tile">
            <span className="tile__meta">{it.meta}</span>
            <span className="tile__title">{it.title}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Contact() {
  const links = getIsland('contact')?.content?.links ?? [];
  return (
    <section className="section section--contact" id="contact">
      <div className="section__head">
        <h2>Let's make something playful</h2>
        <p>Have a project, a talk, or just want to say hello? I'd love to hear from you.</p>
      </div>
      <div className="contact-actions">
        <a className="btn btn--primary" href={`mailto:${profile.email}`}>
          {profile.email}
        </a>
        <div className="contact-links">
          {links
            .filter((l) => l.icon !== 'mail')
            .map((l) => (
              <a key={l.label} href={l.url} target="_blank" rel="noreferrer">
                {l.label}
              </a>
            ))}
        </div>
      </div>
    </section>
  );
}

export function Sections() {
  return (
    <main className="site-main">
      <Work />
      <About />
      <TileSection id="speaking" heading={speaking.heading} lede={speaking.lede} items={speaking.items} />
      <TileSection id="experiments" heading={experiments.heading} lede={experiments.lede} items={experiments.items} />
      <TileSection
        id="blog"
        heading={blog.heading}
        lede={blog.lede}
        items={blog.posts}
      />
      <Contact />
    </main>
  );
}
