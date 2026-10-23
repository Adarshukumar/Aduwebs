/**
 * One scroll engine for the whole site.
 *
 * Lenis owns the wheel; this module owns the *state*. A single rAF-throttled
 * listener publishes the 0–1 progress value, so the header ring and the right
 * rail read the same number instead of running two loops (the old bug).
 */
import Lenis from "lenis";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { prefersReducedMotion } from "./utils";

/* ─────────────────────────────  lenis  ───────────────────────────── */

let lenis: Lenis | null = null;
let rafId = 0;

export function initSmoothScroll(): Lenis | null {
  if (typeof window === "undefined") return null;
  if (lenis) return lenis;
  if (prefersReducedMotion()) return null;

  lenis = new Lenis({
    lerp: 0.09,
    wheelMultiplier: 1,
    touchMultiplier: 1.4,
    smoothWheel: true,
    syncTouch: false,
    autoResize: true,
  });

  const raf = (time: number) => {
    lenis?.raf(time);
    rafId = requestAnimationFrame(raf);
  };
  rafId = requestAnimationFrame(raf);

  document.documentElement.classList.add("has-lenis");
  return lenis;
}

export function destroySmoothScroll(): void {
  if (rafId) cancelAnimationFrame(rafId);
  rafId = 0;
  lenis?.destroy();
  lenis = null;
  document.documentElement.classList.remove("has-lenis");
}

export function pauseScroll(): void {
  lenis?.stop();
}

export function resumeScroll(): void {
  lenis?.start();
}

export function refreshScroll(): void {
  lenis?.resize();
}

/** Jump back to the top through the same physics the user is already feeling. */
export function scrollToTop(immediate = false): void {
  if (lenis) {
    lenis.scrollTo(0, { immediate, force: true });
    return;
  }
  window.scrollTo({ top: 0, behavior: immediate ? "auto" : "smooth" });
}

export function scrollToId(id: string): void {
  const target = document.getElementById(id);
  if (!target) return;
  if (lenis) {
    lenis.scrollTo(target, { offset: -92 });
    return;
  }
  target.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ────────────────────────  progress store  ───────────────────────── */

let progress = 0;
const listeners = new Set<() => void>();
let ticking = false;

function measure() {
  ticking = false;
  const doc = document.documentElement;
  const max = doc.scrollHeight - window.innerHeight;
  const next = max > 4 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
  if (Math.abs(next - progress) > 0.0015) {
    progress = next;
    listeners.forEach((listener) => listener());
  }
}

function schedule() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(measure);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) {
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    schedule();
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    }
  };
}

/** Scroll progress 0–1, shared by every consumer. */
export function useScrollProgress(): number {
  return useSyncExternalStore(
    subscribe,
    () => progress,
    () => 0
  );
}

/** `true` once the page has scrolled past `threshold` px. */
export function useScrolled(threshold = 12): boolean {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
}

/** Pointer position in viewport px, shared, rAF-throttled. */
export function usePointer(): React.RefObject<{ x: number; y: number }> {
  const point = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      point.current.x = event.clientX;
      point.current.y = event.clientY;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  return point;
}
