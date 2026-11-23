import { animate, stagger } from "animejs";
import { useEffect, useRef } from "react";

/**
 * Scroll reveals, on anime.js.
 *
 * Every section used to arrive by plain CSS transition, which reads as
 * "faded in" rather than "composed". This watches a section and, the first
 * time it enters the viewport, plays a staggered anime.js entrance on the
 * elements you point it at — split into lines, words or blocks.
 *
 *   const ref = useReveal<HTMLElement>("h2, p, li", { split: "block" });
 *   <section ref={ref}> ... </section>
 *
 * It only plays once (`once: true`), so scrolling back up doesn't re-trigger
 * a wall of motion, and it bails out to "everything visible" if the browser
 * has no IntersectionObserver — content is never hidden behind an animation
 * that might not run.
 */

type RevealOptions = {
  /** Selector for the children to animate, scoped to the container. */
  selector?: string;
  /** How far they travel, in px. Negative = from above. */
  distance?: number;
  /** Delay between each target, in ms. */
  gap?: number;
  /** Total entrance duration, in ms. */
  duration?: number;
  /** Only run the first time. */
  once?: boolean;
  /** Trigger point: how much of the element must be visible, 0–1. */
  threshold?: number;
};

export function useReveal<T extends HTMLElement>(
  selector = ":scope > *",
  options: RevealOptions = {}
) {
  const {
    distance = 26,
    gap = 70,
    duration = 780,
    once = true,
    threshold = 0.18,
  } = options;

  const container = useRef<T | null>(null);

  useEffect(() => {
    const root = container.current;
    if (!root) return;

    const targets = Array.from(
      root.querySelectorAll<HTMLElement>(selector)
    ).filter((el) => !el.hasAttribute("data-reveal-ignore"));

    if (!targets.length) return;

    // Reduced motion: show everything, animate nothing.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      targets.forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      targets.forEach((el) => {
        el.style.opacity = "1";
      });
      return;
    }

    let played = false;

    // Hide first so nothing flashes in at full opacity before the observer
    // fires. The observer is the only thing that can bring it back, and it
    // always resolves — so a failed animation still ends with visible copy.
    targets.forEach((el) => {
      el.style.opacity = "0";
      el.style.willChange = "opacity, transform";
    });

    const play = () => {
      if (played && once) return;
      played = true;

      animate(targets, {
        opacity: [0, 1],
        translateY: [distance, 0],
        filter: ["blur(6px)", "blur(0px)"],
        duration,
        delay: stagger(gap),
        ease: "outQuart",
        onComplete: () => {
          targets.forEach((el) => {
            el.style.willChange = "auto";
            el.style.filter = "none";
          });
        },
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            play();
            if (once) observer.disconnect();
          }
        });
      },
      { threshold, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(root);

    return () => {
      observer.disconnect();
    };
  }, [selector, distance, gap, duration, once, threshold]);

  return container;
}
