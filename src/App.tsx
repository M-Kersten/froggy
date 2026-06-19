import { SiteHeader } from './components/site/SiteHeader';
import { Hero } from './components/site/Hero';
import { Sections } from './components/site/Sections';
import { SiteFooter } from './components/site/SiteFooter';
import { Modal } from './components/ui/Modal';

/**
 * The portfolio site: a normal scrollable page (header → hero with the
 * interactive pond → content sections → footer). The pond is the memorable
 * hero, but everything is reachable without it.
 */
export default function App() {
  return (
    <div className="site">
      <SiteHeader />
      <Hero />
      <Sections />
      <SiteFooter />
      <Modal />
    </div>
  );
}
