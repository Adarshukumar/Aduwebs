import { useEffect, useRef, useState } from "react";
import { animate, createTimeline, utils } from "../../lib/motion";
import { prefersReducedMotion } from "../../lib/utils";

/**
 * The opening.
 *
 * A single anime.js timeline: the monogram lands, an acid rule draws itself, a
 * counter runs to 100, then the curtain irises shut from the inside out. Any
 * click, key or wheel skips it. Repeat visits in the same session get the short
 * cut (a 420 ms fade), and reduced-motion gets nothing at all.
 */

const SESSION_KEY = "adarsh-intro-seen-v2";
const IRIS_START = 1150;
const IRIS_DURATION = 820;

export function IntroLoader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const ruleRef = useRef<HTMLSpanElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const ringRef = useRef<HTMLSpanElement>(null);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mark = markRef.current ?? root;
    const rule = ruleRef.current ?? root;
    const ring = ringRef.current ?? root;

    const finish = () => {
      document.body.classList.add("ready");
      try {
        sessionStorage.setItem(SESSION_KEY, "true");
      } catch {
        /* private mode — the loader simply runs again next time */
      }
      setMounted(false);
    };

    if (prefersReducedMotion()) {
      finish();
      return;
    }

    let seen = false;
    try {
      seen = sessionStorage.getItem(SESSION_KEY) === "true";
    } catch {
      seen = false;
    }

    if (seen) {
      // Short curtain: no monologue for repeat visitors.
      const quick = animate(root, {
        opacity: [1, 0],
        duration: 420,
        ease: "inOutQuad",
        onComplete: finish,
      });
      return () => {
        quick.revert();
      };
    }

    document.body.classList.remove("ready");
    const counter = { value: 0 };
    const iris = { value: 150 };

    const timeline = createTimeline({ defaults: { ease: "outExpo" } });

    timeline
      .add(mark, { opacity: [0, 1], scale: [0.82, 1], rotate: [-9, 0], duration: 620 }, 0)
      .add(rule, { scaleX: [0, 1], duration: 520, ease: "inOutQuart" }, 240)
      .add(
        counter,
        {
          value: 100,
          duration: 900,
          ease: "inOutQuart",
          onUpdate: () => {
            if (counterRef.current) {
              counterRef.current.textContent = String(Math.round(counter.value)).padStart(3, "0");
            }
          },
        },
        460
      )
      .add(ring, { rotate: [0, 220], opacity: [0.12, 0.5], duration: 940, ease: "linear" }, 560)
      .add(mark, { scale: [1, 1.3], opacity: [1, 0], duration: 700 }, IRIS_START);

    const irisAnim = animate(iris, {
      value: 0,
      duration: IRIS_DURATION,
      delay: IRIS_START,
      ease: "inOutQuart",
      onUpdate: () => {
        root.style.setProperty("--iris", `${iris.value.toFixed(2)}%`);
      },
      onComplete: finish,
    });

    const skip = () => {
      timeline.pause();
      irisAnim.pause();
      utils.set(root, { opacity: 0 });
      finish();
    };

    window.addEventListener("pointerdown", skip, { once: true });
    window.addEventListener("keydown", skip, { once: true });
    window.addEventListener("wheel", skip, { once: true, passive: true });

    return () => {
      timeline.revert();
      irisAnim.revert();
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("wheel", skip);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div ref={rootRef} className="intro-loader" aria-hidden="true">
      <span ref={ringRef} className="loader-ring" />
      <div className="loader-inner">
        <div ref={markRef} className="loader-mark">
          <span className="font-script text-[86px] leading-none text-[#f4f1e9]">AK</span>
          <span className="font-display mt-3 text-3xl leading-none text-acid">+</span>
        </div>
        <span ref={ruleRef} className="loader-rule" />
        <div className="loader-meta">
          <span className="micro-label !text-[#6f6c64]">Portfolio loading</span>
          <span ref={counterRef} className="micro-label !text-[#f4f1e9] tabular-nums">
            000
          </span>
        </div>
      </div>
    </div>
  );
}
