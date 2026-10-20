import { ArrowRight, Home as HomeIcon } from "lucide-react";
import { Magnetic } from "../components/ui/Magnetic";
import { Marquee } from "../components/ui/Marquee";
import { WipeLink } from "../components/fx/Effects";
import { NAV_LINKS } from "../lib/data";

export function NotFound() {
  return (
    <>
      <section className="relative flex min-h-[62vh] flex-col justify-center overflow-hidden px-[clamp(20px,4.4vw,62px)] py-24">
        <div
          className="dot-grid pointer-events-none absolute inset-y-0 right-0 w-1/2 opacity-70"
          aria-hidden="true"
        />
        <div
          className="blob blob-float pointer-events-none -top-24 -left-20 h-80 w-80 opacity-[0.14]"
          style={{ background: "var(--acid)" }}
          aria-hidden="true"
        />

        <div className="relative">
          <p className="kicker mb-5">Error / 404</p>
          <h1 className="font-display text-[clamp(4.5rem,17vw,13rem)] leading-[0.8] uppercase">
            <span className="block">Lost</span>
            <span className="outline-text block pl-[0.08em]">in it.</span>
          </h1>
          <p className="mt-8 max-w-lg text-[14.5px] leading-relaxed text-muted">
            That page doesn't exist — or it moved while I was refactoring. Try one of these instead,
            or go back to the start.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Magnetic>
              <WipeLink to="/" className="btn">
                Back to home
                <HomeIcon aria-hidden="true" />
              </WipeLink>
            </Magnetic>
            <Magnetic>
              <WipeLink to="/contact" className="btn btn-outline">
                Tell me it's broken
                <ArrowRight aria-hidden="true" />
              </WipeLink>
            </Magnetic>
          </div>

          <nav aria-label="Site sections" className="mt-12 flex flex-wrap gap-2.5 border-t border-line pt-7">
            {NAV_LINKS.filter((link) => !link.end).map((link) => (
              <WipeLink key={link.to} to={link.to} className="chip !py-2 !px-3.5 !text-[12.5px]">
                {link.label}
              </WipeLink>
            ))}
          </nav>
        </div>
      </section>

      <Marquee words={["404", "Not found", "Try again", "Ship it", "Learn from it"]} />
    </>
  );
}

export default NotFound;
