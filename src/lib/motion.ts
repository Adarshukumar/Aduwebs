/**
 * The motion toolkit.
 *
 * anime.js v4 does the choreography (timelines, staggers, counters, scroll
 * observers); this file keeps every call site honest about reduced-motion and
 * about cleaning up after itself.
 */
import { animate, createTimeline, onScroll, stagger, utils, type JSAnimation, type Timeline } from "animejs";
import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "./utils";

export { animate, createTimeline, onScroll, stagger, utils };
export type { JSAnimation, Timeline };

/** anime.js is the one place that decides what "fast" means. */
export const EASE = {
  out: "outExpo",
  inOut: "inOutQuart",
  spring: "outElastic(1, .6)",
  swift: "outQuart",
} as const;

export function motionAllowed(): boolean {
  return !prefersReducedMotion();
}

/**
 * Run an animation factory once the element is in view, and again never.
 * Returns a ref to spread on the element you want to observe.
 */
export function useInViewAnimation<T extends HTMLElement>(
  build: (element: T) => JSAnimation | Timeline | null,
  options: { threshold?: number; rootMargin?: string; once?: boolean } = {}
) {
  const ref = useRef<T>(null);
  const { threshold = 0.25, rootMargin = "0px 0px -8% 0px", once = true } = options;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (!motionAllowed() || !("IntersectionObserver" in window)) return;

    let animation: JSAnimation | Timeline | null = null;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            animation = build(entry.target as T);
            if (once) observer.unobserve(entry.target);
          } else if (!once && animation) {
            animation.revert();
          }
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      animation?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}

/** Count a number up from zero, once, on first sight. */
export function useCountUp(target: number, duration = 1100) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (!motionAllowed()) {
      node.textContent = String(target);
      return;
    }

    const counter = { value: 0 };
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        observer.disconnect();
        animate(counter, {
          value: target,
          duration,
          ease: EASE.out,
          onUpdate: () => {
            node.textContent = String(Math.round(counter.value));
          },
        });
      },
      { threshold: 0.6 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [target, duration]);

  return ref;
}

/**
 * Scroll-scrubbed parallax. `depth` is pixels of travel across the element's
 * full pass through the viewport — negative moves against the scroll.
 */
export function useParallax<T extends HTMLElement>(depth = 40) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || !motionAllowed()) return;

    const observer = onScroll({
      target: node,
      enter: "bottom top",
      leave: "top bottom",
      onUpdate: (self) => {
        const shift = (self.progress - 0.5) * 2 * depth;
        node.style.setProperty("--parallax", `${shift.toFixed(2)}px`);
      },
    });

    return () => {
      observer.revert();
    };
  }, [depth]);

  return ref;
}
