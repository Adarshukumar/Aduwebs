import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ArrowUp, Menu, Moon, Sun, X } from "lucide-react";
import { NAV_LINKS, PROFILE } from "../../lib/data";
import { useTheme } from "../../context/ThemeContext";
import { cx } from "../../lib/utils";
import { useWipeNavigate } from "../fx/Effects";
import { pauseScroll, resumeScroll, scrollToTop, useScrolled, useScrollProgress } from "../../lib/scroll";

export function Header() {
  const { theme, toggle } = useTheme();
  const { pathname } = useLocation();

  // The panel is open *for a route*: navigating (including back/forward) closes
  // it without an effect that writes state on every pathname change.
  const [menuState, setMenuState] = useState({ open: false, at: pathname });
  const menuOpen = menuState.open && menuState.at === pathname;
  const setMenuOpen = (open: boolean) => setMenuState({ open, at: pathname });
  const scrolled = useScrolled(12);
  const percent = Math.round(useScrollProgress() * 100);
  const wipeNavigate = useWipeNavigate();
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    if (menuOpen) pauseScroll();
    else resumeScroll();
    return () => {
      document.body.classList.remove("menu-open");
      resumeScroll();
    };
  }, [menuOpen]);

  // Focus management: move into the panel, trap Tab, restore on close.
  useEffect(() => {
    if (!menuOpen) return;
    const panel = panelRef.current;
    if (!panel) return;

    const focusables = panel.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
    focusables[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setMenuOpen(false);
        return;
      }
      if (event.key !== "Tab" || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const trigger = triggerRef.current;
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      trigger?.focus();
    };
  }, [menuOpen]);

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
          <span className="mark-plus font-display mt-1.5 text-base leading-none">+</span>
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
            className={cx("round-button", menuOpen && "menu-close-button !border-white/30")}
          >
            {theme === "dark" ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
          </button>

          <button
            type="button"
            onClick={() => scrollToTop(false)}
            aria-label="Back to top"
            className={cx(
              "round-button progress-ring relative hidden sm:grid",
              menuOpen && "invisible"
            )}
            style={{ ["--progress" as string]: `${percent}%` }}
          >
            <ArrowUp aria-hidden="true" />
          </button>

          <button
            ref={triggerRef}
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            className={cx(
              "round-button lg:hidden",
              menuOpen && "menu-close-button !border-white/30"
            )}
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </header>

      {/* Mobile menu — always dark, sits *under* the raised header so the
          close button is never trapped (fixes audit issue §10.1). */}
      <div
        ref={panelRef}
        className={cx(
          "fixed inset-[10px] z-101 flex flex-col justify-center gap-1 rounded-[18px] bg-[#0c0c0c] px-7 transition-all duration-[450ms] lg:hidden",
          menuOpen
            ? "pointer-events-auto scale-100 opacity-100"
            : "pointer-events-none scale-[0.96] opacity-0"
        )}
        style={{ transitionTimingFunction: "var(--ease)" }}
        aria-hidden={!menuOpen}
        role="dialog"
        aria-modal={menuOpen || undefined}
        aria-label="Site navigation"
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
