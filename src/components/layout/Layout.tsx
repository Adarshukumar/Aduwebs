import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CursorRing, IntroLoader, PageWipe, RouteEffects, ScrollRail } from "../fx/Effects";

/**
 * The signature "paper poster in a dark frame": everything lives inside a
 * rounded shell floating on a near-black page with a 22px margin.
 */
export function Layout() {
  return (
    <>
      <IntroLoader />
      <CursorRing />
      <PageWipe />
      <ScrollRail />
      <RouteEffects />

      <div className="shell" id="top">
        <Header />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
}
