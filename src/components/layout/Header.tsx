import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ArrowUp, Menu, Moon, Sun, X } from "lucide-react";
import { NAV_LINKS, PROFILE } from "../../lib/data";
import { useTheme } from "../../context/ThemeContext";
import { cx } from "../../lib/utils";
import { useScrollProgress, useWipeNavigate } from "../fx/Effects";

export function Header() {
  const { theme, toggle } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const percent = useScrollProgress();
  const wipeNavigate = useWipeNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);

  // Close the overlay menu whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const go = (to: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    setMenuOpen(false);
    wipeNavigate(to);
  };

  return (
    <>
      <header
        className={cx(
          "sticky top-0 z-100 grid min-h-[76px] grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-line px-5 backdrop-blur-[18px] transition-shadow duration-500 md:px-9",
          scrolled && "shadow-[0_10px_30px_rgba(0,0,0,0.07)]",
          menuOpen && "!z-102 !border-transparent !bg-transparent !backdrop-blur-none"
        )}
        style={{
          background: menuOpen
            ? "transparent"
            : "color-mix(in srgb, var(--paper) 88%, transparent)",
        }}
      >
        <a
          href="/"
          onClick={go("/")}
          aria-label="Adarsh Kumar — home"
          className={cx(
            "flex items-start transition-colors duration-300",
            menuOpen && "text-[#f4f1e9]"
          )}
        >
          <span className="font-script text-[34px] leading-none">AK</span>
          <span className="font-display mt-1.5 text-base leading-none text-acid">+</span>
        </a>

        <nav aria-label="Primary navigation" className="hidden justify-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={go(link.to)}
              className={({ isActive }) =>
                cx(
                  "nav-link relative py-1 text-[12.5px] font-medium tracking-[0.01em] transition-colors duration-300",
                  isActive ? "text-ink" : "text-muted hover:text-ink",
                  menuOpen && "text-[#f4f1e9]"
                )
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  <span
                    className={cx(
                      "absolute -bottom-0.5 left-0 h-px bg-current transition-all duration-[350ms]",
                      isActive ? "w-full" : "w-0"
                    )}
                    style={{ transitionTimingFunction: "var(--ease)" }}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={toggle}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            className={cx(
              "round-button",
              menuOpen && "!border-white/30 !text-[#f4f1e9] hover:!bg-[#f4f1e9] hover:!text-[#101010]"
            )}
          >
            {theme === "dark" ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
          </button>

          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
            className={cx(
              "round-button progress-ring relative hidden sm:grid",
              menuOpen && "!text-[#f4f1e9]"
            )}
            style={{ ["--progress" as string]: `${percent}%` }}
          >
            <ArrowUp aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            className={cx(
              "round-button lg:hidden",
              menuOpen && "!border-white/30 !text-[#f4f1e9] hover:!bg-[#f4f1e9] hover:!text-[#101010]"
            )}
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </header>

      {/* Mobile menu — always dark, sits *under* the raised header so the
          close button is never trapped (fixes audit issue §10.1). */}
      <div
        className={cx(
          "fixed inset-[10px] z-101 flex flex-col justify-center gap-1 rounded-[18px] bg-[#0c0c0c] px-7 transition-all duration-[450ms] lg:hidden",
          menuOpen
            ? "pointer-events-auto scale-100 opacity-100"
            : "pointer-events-none scale-[0.96] opacity-0"
        )}
        style={{ transitionTimingFunction: "var(--ease)" }}
        aria-hidden={!menuOpen}
      >
        <nav aria-label="Mobile navigation" className="flex flex-col">
          {NAV_LINKS.map((link, index) => (
            <a
              key={link.to}
              href={link.to}
              tabIndex={menuOpen ? 0 : -1}
              onClick={go(link.to)}
              className="font-display border-b border-white/10 py-3 text-[clamp(30px,10vw,52px)] leading-[1.05] uppercase text-[#f4f1e9] transition-all duration-300 hover:translate-x-2 hover:text-acid"
              style={{
                transitionTimingFunction: "var(--ease)",
                transitionDelay: menuOpen ? `${index * 40}ms` : "0ms",
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? "none" : "translateY(10px)",
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="mt-8 flex flex-col gap-1 text-[11px] tracking-[0.16em] text-white/45 uppercase">
          <span>{PROFILE.name}</span>
          <span>Product designer + developer</span>
          <span className="text-acid">{PROFILE.locationLine}</span>
        </div>
      </div>
    </>
  );
}
