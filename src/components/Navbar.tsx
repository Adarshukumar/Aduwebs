import { useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import "./styles/Navbar.css";

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);
export let smoother: ScrollSmoother;

const SECTIONS = [
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "contact", label: "Contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.7,
      speed: 1.7,
      effects: true,
      autoResize: true,
      ignoreMobileResize: true,
    });

    smoother.scrollTop(0);
    smoother.paused(true);

    let links = document.querySelectorAll(".header ul a");
    links.forEach((elem) => {
      let element = elem as HTMLAnchorElement;
      element.addEventListener("click", (e) => {
        if (window.innerWidth > 1024) {
          e.preventDefault();
          let elem = e.currentTarget as HTMLAnchorElement;
          let section = elem.getAttribute("data-href");
          smoother.scrollTo(section, true, "top top");
        }
      });
    });
    window.addEventListener("resize", () => {
      ScrollSmoother.refresh(true);
    });

    return () => {
      window.removeEventListener("resize", () => ScrollSmoother.refresh(true));
    };
  }, []);

  // Wait for the intro to hand over before the rail starts reacting, then
  // track which section owns the viewport.
  useEffect(() => {
    let cleanups: Array<() => void> = [];
    const start = window.setTimeout(() => {
      const onScroll = () => {
        // the smoother scrolls the window, so scrollY is the honest source
        setScrolled(window.scrollY > 40);

        // The sections between About and Work (What I Do, Career) have no nav
        // entry of their own, so a "top passed the 45% line" test leaves About
        // lit all the way through Career. Instead: pick whichever *named*
        // section covers the reading line, and keep the last one you passed.
        const marker = window.innerHeight * 0.35;
        let current = "";
        let lastPassed = "";
        for (const section of SECTIONS) {
          const el = document.getElementById(section.id);
          if (!el) continue;
          const rect = el.getBoundingClientRect();
          if (rect.top <= marker) lastPassed = section.id;
          if (rect.top <= marker && rect.bottom > marker) current = section.id;
        }
        // if the reading line sits in an unnamed section, hold the one above it
        setActive(current || lastPassed);
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      cleanups.push(() => window.removeEventListener("scroll", onScroll));
    }, 1200);

    return () => {
      window.clearTimeout(start);
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return (
    <>
      <header className={`header${scrolled ? " is-scrolled" : ""}`}>
        <a
          href="/#"
          className="navbar-title"
          data-cursor="disable"
          aria-label="Adarsh Kumar — home"
        >
          <span className="navbar-ak">AK</span>
          <span className="navbar-plus" aria-hidden="true">
            +
          </span>
        </a>

        <a
          href="https://www.linkedin.com/in/adarshu07/"
          className="navbar-connect"
          data-cursor="disable"
          target="_blank"
          rel="noreferrer"
        >
          <span className="navbar-connect-dot" aria-hidden="true" />
          linkedin.com/in/adarshu07
        </a>

        <button
          type="button"
          className={`navbar-toggle${menuOpen ? " is-open" : ""}`}
          aria-expanded={menuOpen}
          aria-controls="navbar-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
          data-cursor="disable"
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>

        <nav
          id="navbar-menu"
          aria-label="Sections"
          className={menuOpen ? "is-open" : undefined}
        >
          <ul>
            {SECTIONS.map((section) => (
              <li key={section.id}>
                <a
                  data-href={`#${section.id}`}
                  href={`#${section.id}`}
                  className={active === section.id ? "is-active" : undefined}
                  aria-current={active === section.id ? "true" : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  <HoverLinks text={section.label} />
                </a>
              </li>
            ))}
            <li>
              <a
                href="/Adarsh-Kumar-CV.pdf"
                target="_blank"
                rel="noreferrer"
                className="navbar-resume"
                data-cursor="disable"
                onClick={() => setMenuOpen(false)}
              >
                <span className="navbar-resume-full">Résumé</span>
                <span className="navbar-resume-short">CV</span>
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;
