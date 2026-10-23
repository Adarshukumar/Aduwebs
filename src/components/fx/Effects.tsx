import { useCallback, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { applyRouteMeta, injectStructuredData } from "../../lib/seo";
import { refreshScroll, scrollToId, scrollToTop, useScrollProgress } from "../../lib/scroll";
import { cx, prefersReducedMotion } from "../../lib/utils";

/* ───────────────────────  scroll progress rail  ───────────────────────── */

export function ScrollRail() {
  const progress = useScrollProgress();
  const percent = Math.round(progress * 100);

  return (
    <div className="progress-rail" aria-hidden="true">
      <span className="font-display text-[11px] tracking-[0.14em] tabular-nums">
        {String(percent).padStart(3, "0")}
      </span>
      <span className="progress-track">
        <span className="progress-fill" style={{ height: `${percent}%` }} />
      </span>
    </div>
  );
}

/* ───────────────────────  page-wipe navigation  ───────────────────────── */

const WIPE_EVENT = "aduwebs:wipe";

export function PageWipe() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const run = () => {
      el.classList.remove("run");
      void el.offsetWidth;
      el.classList.add("run");
      window.setTimeout(() => el.classList.remove("run"), 1000);
    };

    window.addEventListener(WIPE_EVENT, run);
    return () => window.removeEventListener(WIPE_EVENT, run);
  }, []);

  return <div ref={ref} className="page-wipe" aria-hidden="true" />;
}

/** Navigate with the organic blob wipe — the site's signature transition. */
export function useWipeNavigate() {
  const navigate = useNavigate();

  return useCallback(
    (to: string) => {
      if (prefersReducedMotion()) {
        navigate(to);
        return;
      }
      window.dispatchEvent(new Event(WIPE_EVENT));
      window.setTimeout(() => navigate(to), 260);
    },
    [navigate]
  );
}

interface WipeLinkProps extends React.ComponentProps<typeof Link> {
  to: string;
}

export function WipeLink({ to, onClick, ...rest }: WipeLinkProps) {
  const wipeNavigate = useWipeNavigate();

  return (
    <Link
      to={to}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
        event.preventDefault();
        wipeNavigate(to);
      }}
      {...rest}
    />
  );
}

/**
 * Route side-effects, in one place: metadata, scroll reset, scroll-engine
 * refresh, and the entrance choreography that the loader would otherwise do.
 * The very first run is left to <IntroLoader/>.
 */
export function RouteEffects() {
  const { pathname, hash } = useLocation();

  // In-page anchors must go through Lenis, or the browser's smooth scroll and
  // the engine fight over the same scrollTop.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey) return;
      const anchor = (event.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor) return;
      const id = anchor.getAttribute("href")?.slice(1);
      if (!id || id === "top") return;
      if (!document.getElementById(id)) return;
      event.preventDefault();
      scrollToId(id);
      history.replaceState(null, "", `#${id}`);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  const firstRun = useRef(true);

  useEffect(() => {
    applyRouteMeta(pathname);
    injectStructuredData();

    if (hash) {
      const target = document.querySelector(hash);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }

    scrollToTop(true);

    if (firstRun.current) {
      firstRun.current = false;
      return;
    }

    document.body.classList.add("ready");
    // New page, new document height.
    requestAnimationFrame(() => refreshScroll());
  }, [pathname, hash]);

  return null;
}

/** Small helper for anchors that scroll inside the page. */
export function SectionLink({
  to,
  className,
  children,
}: {
  to: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={`#${to}`}
      className={cx(className)}
      onClick={(event) => {
        const target = document.getElementById(to);
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", `#${to}`);
      }}
    >
      {children}
    </a>
  );
}
