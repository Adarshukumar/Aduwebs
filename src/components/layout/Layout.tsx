import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { DragonCursor } from "../fx/DragonCursor";
import { IntroLoader } from "../fx/IntroLoader";
import { PageWipe, RouteEffects, ScrollRail } from "../fx/Effects";

/**
 * The signature "paper poster in a dark frame": everything lives inside a
 * rounded shell floating on a near-black page with a 22px margin.
 */
export function Layout() {
  const { pathname } = useLocation();

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <IntroLoader />
      <DragonCursor />
      <PageWipe />
      <ScrollRail />
      <RouteEffects />

      <div className="shell" id="top">
        <Header />
        <main id="main" tabIndex={-1}>
          <div key={pathname} className="route-enter">
            <Outlet />
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
