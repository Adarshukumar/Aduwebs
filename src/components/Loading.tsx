import { useEffect, useRef, useState } from "react";
import "./styles/Loading.css";
import { useLoading } from "../context/LoadingProvider";
import gsap from "gsap";
import { animate } from "animejs";
import { initialFX } from "./utils/initialFX";

/**
 * The opening — the monogram curtain.
 *
 * A script "AK" with the accent plus, an orbit ring turning behind it, a
 * hairline rule drawing itself under a counter that runs to 100. When the
 * counter lands the mark holds for a beat, then the whole curtain irises shut
 * from the middle and hands over to the 3D scene.
 *
 * The counter is driven by the real model download (see `setProgress`), not a
 * timer, so a slow connection waits honestly and a fast one doesn't stall.
 */

/**
 * `?curtain=slow` runs the whole opening at a fifth of speed — useful for
 * inspecting the timing, and for anyone who wants to watch the curtain close.
 */
const SLOWMO =
  typeof window !== "undefined" &&
  new URLSearchParams(window.location.search).get("curtain") === "slow";

/** Every delay and duration goes through here so `?curtain=slow` stays honest. */
const S = SLOWMO ? 5 : 1;
const ms = (value: number) => value * S;

const Loading = ({ percent }: { percent: number }) => {
  const { setIsLoading } = useLoading();
  const [leaving, setLeaving] = useState(false);
  const [welcomed, setWelcomed] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const lockupRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLSpanElement>(null);
  const ruleRef = useRef<HTMLSpanElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);

  // ── the intro: mark, orbit, rule ───────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        orbitRef.current,
        { opacity: 0, scale: 0.86, rotate: -18 },
        { opacity: 0.55, scale: 1, rotate: 0, duration: ms(1.1) },
        0
      )
        .fromTo(
          lockupRef.current,
          { opacity: 0, scale: 0.82, y: 14, rotate: -7 },
          { opacity: 1, scale: 1, y: 0, rotate: 0, duration: ms(0.95) },
          ms(0.08)
        )
        .fromTo(ruleRef.current, { scaleX: 0 }, { scaleX: 1, duration: ms(0.6), ease: "power2.inOut" }, ms(0.5))
        .fromTo(
          [statusRef.current, countRef.current],
          { opacity: 0, y: 6 },
          { opacity: 1, y: 0, duration: ms(0.45) },
          ms(0.62)
        );

      // The monogram is one glyph, so a per-letter stagger would be a no-op.
      // Instead: let the script mark settle out of a slight skew with the
      // plus arriving a beat later, and let the orbit ring trail a fine
      // dashed halo around it.
      const ak = lockupRef.current?.querySelector(".curtain-ak");
      const plus = lockupRef.current?.querySelector(".curtain-plus");

      if (ak && plus) {
        animate(ak, {
          skewX: [-8, 0],
          letterSpacing: ["0.06em", "0em"],
          duration: ms(1200),
          delay: ms(180),
          ease: "outExpo",
        });

        animate(plus, {
          opacity: [0, 1],
          scale: [0.4, 1],
          rotate: [-90, 0],
          duration: ms(720),
          delay: ms(700),
          ease: "outBack(2)",
        });
      }

      if (orbitRef.current) {
        animate(orbitRef.current, {
          rotate: [0, 360],
          duration: ms(9000),
          loop: true,
          ease: "linear",
        });
      }
    }, rootRef);

    return () => ctx.revert();
  }, []);

  // ── the counter lands: swap the label, wake the page, iris out ──
  useEffect(() => {
    if (percent < 100) return;

    // let the counter visibly sit on 100 before anything moves
    const beat = window.setTimeout(() => {
      setWelcomed(true);
      if (statusRef.current) statusRef.current.textContent = "Welcome";
    }, ms(140));

    // The page has to be awake *behind* the curtain, or the iris opens onto a
    // frozen hero. initialFX unpauses the smooth scroller and runs the reveal.
    const HOLD = 520;
    const wake = window.setTimeout(() => {
      try {
        initialFX();
      } catch (error) {
        // never let a reveal failure trap the visitor behind the curtain
        console.error("initialFX failed", error);
      }
    }, ms(140 + HOLD));

    const close = window.setTimeout(() => {
      const root = rootRef.current;
      if (!root) return;
      setLeaving(true);

      // iris shut: 150% -> 0%, one property, GPU-friendly
      gsap.fromTo(
        root,
        { "--curtain-iris": "150%" },
        {
          "--curtain-iris": "0%",
          duration: ms(0.82),
          ease: "power3.inOut",
          onComplete: () => setIsLoading(false),
        }
      );
      // The lockup *rides* the iris out rather than dissolving ahead of it —
      // it stays opaque while the opening narrows, and only lets go at the end.
      gsap.to([lockupRef.current, orbitRef.current], {
        scale: 1.1,
        opacity: 0,
        duration: ms(0.82),
        delay: ms(0.12),
        ease: "power1.in",
      });
    }, ms(140 + HOLD));

    return () => {
      window.clearTimeout(beat);
      window.clearTimeout(wake);
      window.clearTimeout(close);
    };
  }, [percent, setIsLoading]);

  // ── the failsafe ───────────────────────────────────────────────
  // If the model never reports done (dead network, blocked CDN, WebGL refused)
  // the visitor still gets the site instead of a permanent curtain.
  useEffect(() => {
    const escape = window.setTimeout(() => {
      if (percent < 100) {
        console.warn("Model load timed out — opening the site anyway");
        setWelcomed(true);
        if (statusRef.current) statusRef.current.textContent = "Welcome";
        try {
          initialFX();
        } catch {
          /* the page is still usable without the reveal */
        }
        setLeaving(true);
        const root = rootRef.current;
        if (root) {
          gsap.fromTo(
            root,
            { "--curtain-iris": "150%" },
            { "--curtain-iris": "0%", duration: ms(0.82), ease: "power3.inOut", onComplete: () => setIsLoading(false) }
          );
        } else {
          setIsLoading(false);
        }
      }
    }, ms(14000));

    return () => window.clearTimeout(escape);
  }, [percent, setIsLoading]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    // the glow follows the pointer, but only by a little — a lean, not a drag
    const { currentTarget: target } = e;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    target.style.setProperty("--curtain-x", `${x}px`);
    target.style.setProperty("--curtain-y", `${y}px`);
  };

  return (
    <div
      ref={rootRef}
      className={`curtain${leaving ? " is-leaving" : ""}${welcomed ? " is-welcomed" : ""}`}
      onMouseMove={handleMouseMove}
      aria-hidden="true"
    >
      <span className="curtain-tick tl" />
      <span className="curtain-tick tr" />
      <span className="curtain-tick bl" />
      <span className="curtain-tick br" />

      <div className="curtain-header">
        <span className="curtain-mark-word">@AK</span>
        <span>
          Adarsh Kumar<span className="curtain-header-dot"> · Portfolio</span>
        </span>
      </div>

      <div className="curtain-inner">
        <span ref={orbitRef} className="curtain-orbit" />

        <div ref={lockupRef} className="curtain-lockup">
          <span className="curtain-ak">AK</span>
          <span className="curtain-plus">+</span>
        </div>

        <span ref={ruleRef} className="curtain-rule" />

        <div className="curtain-meta">
          <span ref={statusRef} className="curtain-status">
            Loading the studio
          </span>
          <span ref={countRef} className="curtain-count">
            {String(percent).padStart(3, "0")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Loading;

/**
 * Progress for the character model.
 *
 * `clear()` jumps to done, `loaded()` ticks the remainder to 100 once the
 * GLTF has resolved. Both are kept because Scene.tsx drives them.
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
