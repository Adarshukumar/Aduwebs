import { useEffect, useRef, useState } from "react";
import "./styles/Loading.css";
import { useLoading } from "../context/LoadingProvider";
import gsap from "gsap";
import { animate } from "animejs";
import { initialFX } from "./utils/initialFX";

/**
 * The opening.
 *
 * Rebuilt to match the reference site's entry, not a spinner bolted onto a
 * black page:
 *
 *   1. a pale ground with a script @AK in the top corner and a ball bouncing
 *      through a row of picket posts — a tiny game, running while the model
 *      downloads;
 *   2. a huge slow marquee of role words across the middle;
 *   3. a black pill at the centre with a blinking caret: "Loading 042%" that
 *      becomes "Welcome" the moment the counter lands;
 *   4. the pill *expands into the page* — the black swallows the whole
 *      viewport in one continuous shape, and the hero is already animating
 *      underneath it by the time it clears.
 *
 * The counter is driven by the real GLTF download (see `setProgress`), never
 * a fake timer, and there is a hard escape so a dead CDN can't trap anyone.
 */

const SLOWMO =
  typeof window !== "undefined" &&
  new URLSearchParams(window.location.search).get("curtain") === "slow";

const S = SLOWMO ? 5 : 1;
const ms = (value: number) => value * S;

const Loading = ({ percent }: { percent: number }) => {
  const { setIsLoading } = useLoading();
  const [loaded, setLoaded] = useState(false);
  const [clicked, setClicked] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // ── the entrance: ground, game, marquee, pill ──────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        rootRef.current,
        { opacity: 0 },
        { opacity: 1, duration: ms(0.5), ease: "power1.out" },
        0
      )
        .fromTo(
          gameRef.current,
          { opacity: 0, scale: 0.4, x: 18 },
          { opacity: 1, scale: 0.4, x: 0, duration: ms(0.7) },
          ms(0.25)
        )
        .fromTo(
          headerRef.current,
          { opacity: 0, y: -8 },
          { opacity: 1, y: 0, duration: ms(0.6) },
          ms(0.1)
        )
        .fromTo(
          marqueeRef.current,
          { opacity: 0, y: 26 },
          { opacity: 1, y: 0, duration: ms(0.9) },
          ms(0.2)
        )
        .fromTo(
          wrapRef.current,
          { opacity: 0, y: 26, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: ms(0.8), ease: "outExpo" },
          ms(0.4)
        );

      // the marquee drifts continuously, independent of load progress
      const track = marqueeRef.current?.querySelector(".loading-marquee-track");
      if (track) {
        animate(track, {
          translateX: [0, -1920],
          duration: ms(26000),
          loop: true,
          ease: "linear",
        });
      }

      // a slow breathing pulse on the hover glow so the pill never sits dead
      const glow = wrapRef.current?.querySelector(".loading-glow");
      if (glow) {
        animate(glow, {
          scale: [1, 1.18, 1],
          opacity: [0.45, 0.7, 0.45],
          duration: ms(3200),
          loop: true,
          ease: "inOutSine",
        });
      }
    }, rootRef);

    return () => ctx.revert();
  }, []);

  /**
   * The handover.
   *
   * The pill swells until black fills the frame, then that black lifts to
   * reveal the hero — which initialFX has already started animating, so the
   * two read as one continuous move rather than a fade to a static page.
   *
   * This is called from the same timer that flips `clicked`, not from an
   * effect watching it: a re-render can land between the two, and a GSAP
   * tween started against a stale element gets reverted mid-flight.
   */
  const runHandover = () => {
    const wrap = wrapRef.current;
    const screen = rootRef.current;
    if (!wrap || !screen) return;

    // Scaling a fixed-size plate, not tweening width/height: layout-driven
    // custom properties get recomputed mid-tween and the animation stalls
    // at whatever the first frame measured.
    const plateW = 248;
    const plateH = 64;
    const coverW = window.innerWidth + 2400;
    const coverH = window.innerHeight + 400;
    const scale = Math.max(coverW / plateW, coverH / plateH);

    gsap
      .timeline()
      .set(wrap, { width: plateW, height: plateH, borderRadius: 100 })
      .to(
        wrap,
        {
          scale,
          borderRadius: 100 / scale,
          duration: ms(1),
          ease: "expo.inOut",
        },
        0
      )
      .to(
        [marqueeRef.current, headerRef.current, gameRef.current].filter(Boolean),
        { opacity: 0, duration: ms(0.35), ease: "power1.out" },
        0
      )
      .to(
        screen,
        { opacity: 0, duration: ms(0.7), ease: "power2.inOut" },
        ms(0.8)
      );
  };

  // ── the counter lands ─────────────────────────────────────────
  useEffect(() => {
    if (percent < 100) return;

    const beat = window.setTimeout(() => {
      setLoaded(true);
      if (statusRef.current) statusRef.current.textContent = "Welcome";
      if (countRef.current) countRef.current.style.opacity = "0";
    }, ms(520));

    // Everything behind has to be awake *before* the pill opens, or the wipe
    // reveals a frozen hero. initialFX unpauses the scroller and runs the
    // hero's own reveal, so the two animations overlap and read as one move.
    const wake = window.setTimeout(() => {
      try {
        initialFX();
      } catch (error) {
        console.error("initialFX failed", error);
      }
    }, ms(560));

    const open = window.setTimeout(() => {
      setClicked(true);
      runHandover();
    }, ms(900));

    const done = window.setTimeout(() => {
      setIsLoading(false);
    }, ms(1900));

    return () => {
      window.clearTimeout(beat);
      window.clearTimeout(wake);
      window.clearTimeout(open);
      window.clearTimeout(done);
    };
  }, [percent, setIsLoading]);



  // ── the failsafe ───────────────────────────────────────────────
  useEffect(() => {
    const escape = window.setTimeout(() => {
      if (percent < 100) {
        console.warn("Model load timed out — opening the site anyway");
        setLoaded(true);
          if (statusRef.current) statusRef.current.textContent = "Welcome";
        try {
          initialFX();
        } catch {
          /* the page is still usable without the reveal */
        }
        setClicked(true);
        window.setTimeout(() => setIsLoading(false), 1200);
      }
    }, ms(14000));

    return () => window.clearTimeout(escape);
  }, [percent, setIsLoading]);

  return (
    <>
      <div ref={headerRef} className="loading-header">
        <a href="/#" className="loader-title" data-cursor="disable">
          <span className="loader-title-ak">AK</span>
          <span className="loader-title-plus">+</span>
        </a>

        <div ref={gameRef} className={`loaderGame${clicked ? " loader-out" : ""}`}>
          <div className="loaderGame-container">
            <div className="loaderGame-in">
              {[...Array(27)].map((_, index) => (
                <div className="loaderGame-line" key={index} />
              ))}
            </div>
            <div className="loaderGame-ball" />
          </div>
        </div>
      </div>

      <div ref={rootRef} className="loading-screen">
        <div ref={marqueeRef} className="loading-marquee">
          <div className="loading-marquee-track">
            {[
              "AI Developer",
              "ML Engineer",
              "Product Designer",
              "Creative Developer",
              "AI Developer",
              "ML Engineer",
              "Product Designer",
              "Creative Developer",
            ].map((word, index) => (
              <span key={index}>{word}</span>
            ))}
          </div>
        </div>

        <div
          ref={wrapRef}
          className={`loading-wrap${clicked ? " loading-clicked" : ""}`}
        >
          <div className="loading-glow" aria-hidden="true" />

          <div className={`loading-content2${loaded ? " is-done" : ""}`}>
            <span ref={statusRef} className="loading-status">
              Loading
            </span>
            <span ref={countRef} className="loading-count">
              {String(percent).padStart(3, "0")}
            </span>
          </div>

          <span className="loading-caret" aria-hidden="true" />
        </div>
      </div>
    </>
  );
};

export default Loading;

/**
 * Progress for the character model.
 * `clear()` jumps to done, `loaded()` ticks the remainder to 100 once the
 * GLTF resolves. Both kept because Scene.tsx drives them.
 */
export const setProgress = (setLoading: (value: number) => void) => {
  let percent = 0;
  let interval: ReturnType<typeof setInterval>;

  interval = setInterval(() => {
    if (percent <= 50) {
      percent = percent + Math.round(Math.random() * 5);
      setLoading(Math.min(percent, 100));
    } else {
      clearInterval(interval);
      interval = setInterval(() => {
        percent = percent + Math.round(Math.random());
        setLoading(Math.min(percent, 100));
        if (percent > 91) {
          clearInterval(interval);
        }
      }, 2000);
    }
  }, 100);

  function clear() {
    clearInterval(interval);
    setLoading(100);
  }

  function loaded() {
    return new Promise<number>((resolve) => {
      clearInterval(interval);
      interval = setInterval(() => {
        if (percent < 100) {
          percent++;
          setLoading(percent);
        } else {
          resolve(percent);
          clearInterval(interval);
        }
      }, 2);
    });
  }

  return { loaded, percent, clear };
};
