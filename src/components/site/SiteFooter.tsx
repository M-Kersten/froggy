import { profile, nav, footer } from '../../data/site';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__row">
        <span className="site-footer__brand">{profile.name}</span>
        <nav className="site-footer__nav">
          {nav.map((n) => (
            <a key={n.href} href={n.href}>
              {n.label}
            </a>
          ))}
        </nav>
      </div>
      <p className="site-footer__note">
        © {new Date().getFullYear()} {profile.name}. {footer.blurb}
      </p>
    </footer>
  );
}
