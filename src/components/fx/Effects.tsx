import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cx, isFinePointer, prefersReducedMotion } from "../../lib/utils";

/* ─────────────────────  intro loader (once per session)  ───────────────── */

export function IntroLoader() {
  const [done, setDone] = useState(false);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setMounted(false);
      document.body.classList.add("ready");
      return;
    }

    let seen = false;
    try {
      seen = sessionStorage.getItem("adarsh-intro-seen") === "true";
    } catch {
      /* ignore */
    }

    if (seen) {
      setMounted(false);
      document.body.classList.add("ready");
      return;
    }

    const exit = window.setTimeout(() => setDone(true), 1150);
    const unmount = window.setTimeout(() => {
      setMounted(false);
      try {
        sessionStorage.setItem("adarsh-intro-seen", "true");
      } catch {
        /* ignore */
      }
    }, 2250);
    const ready = window.setTimeout(() => document.body.classList.add("ready"), 900);

    return () => {
      window.clearTimeout(exit);
      window.clearTimeout(unmount);
      window.clearTimeout(ready);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div className={cx("intro-loader", done && "is-done")} aria-hidden="true">
      <div className="flex flex-col items-center gap-5">
        <div className="loader-mark flex items-start">
          <span className="font-script text-[88px] leading-none text-[#f4f1e9]">AK</span>
          <span className="font-display mt-3 text-3xl leading-none text-acid">+</span>
        </div>
        <div className="loader-line w-[110px]" />
        <p className="micro-label !text-[#7d7a72]">Portfolio loading</p>
      </div>
    </div>
  );
}

/* ───────────────────────────  cursor ring  ────────────────────────────── */

export function CursorRing() {
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isFinePointer() || prefersReducedMotion()) return;

    const ring = ringRef.current;
    if (!ring) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let frame = 0;

    ring.classList.add("active");

    const onMove = (event: MouseEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    // Event delegation so dynamically rendered cards also grow the ring
    // (fixes the audit note that late-rendered rows were never bound).
    const onOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const interactive = target?.closest(
        "a, button, input, select, textarea, .memory-card, [data-cursor]"
      );
      ring.classList.toggle("hover", Boolean(interactive));
    };

    const onLeave = () => ring.classList.remove("active");
    const onEnter = () => ring.classList.add("active");

    const animate = () => {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      // transform, not left/top — keeps the ring on the compositor.
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      frame = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
    };
  }, []);

  return <div ref={ringRef} className="cursor-ring" aria-hidden="true" />;
}

/* ───────────────────────  scroll progress rail  ───────────────────────── */

export function useScrollProgress() {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const scrollTop = window.scrollY;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(scrollable, scrollTop) / scrollable : 0;
      setPercent(Math.round(progress * 100));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return percent;
}

export function ScrollRail() {
  const percent = useScrollProgress();

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
      // force reflow so the animation can restart
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

/** Scrolls to top and re-triggers entrance choreography on every route change.
 *  The very first run is left to <IntroLoader/>, so the hero choreography
 *  never fires behind the loader curtain. */
export function RouteEffects() {
  const { pathname } = useLocation();
  const firstRun = useRef(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    document.body.classList.add("ready");
  }, [pathname]);

  return null;
}
