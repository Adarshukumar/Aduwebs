import { useEffect, useRef, useState } from "react";
import { animate, createTimeline, stagger, utils } from "../../lib/motion";
import { isFinePointer, prefersReducedMotion } from "../../lib/utils";

/**
 * The opening — v2, "the arrival".
 *
 * The first thing you meet is the face: the avatar rises through a scan field,
 * develops from duotone into full colour, an aperture ring closes around it as
 * the counter runs to 100, the name sets itself letter by letter — then the
 * curtain doesn't just fade, it irises open *out of the portrait* so the eye
 * lands on the same face in the hero. One object, two places.
 *
 * Every frame is a property write on an already-composited layer (transform,
 * opacity, mask, one CSS var) — no layout, no repaint storms.
 *
 * Modes via the query string, for A/B work:
 *   ?intro=v2       force the full sequence (default; also replays it)
 *   ?intro=classic  the monogram curtain
 *   ?intro=off      straight to the site
 * Repeat visits in a session get a 420 ms fade; reduced motion gets nothing.
 */

const SESSION_KEY = "adarsh-intro-seen-v3";
const AVATAR = "/img/avatar.jpg";

type Mode = "v2" | "classic" | "off";

function readMode(): { mode: Mode; forced: boolean } {
  if (typeof window === "undefined") return { mode: "v2", forced: false };
  const value = new URLSearchParams(window.location.search).get("intro");
  if (value === "off" || value === "classic" || value === "v2") {
    return { mode: value, forced: true };
  }
  return { mode: "v2", forced: false };
}

export function IntroLoader() {
  const { mode, forced } = readMode();
  const [mounted, setMounted] = useState(mode !== "off");
  const [variant] = useState<"v2" | "classic">(mode === "classic" ? "classic" : "v2");

  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const scanRef = useRef<HTMLSpanElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const kickerRef = useRef<HTMLSpanElement>(null);
  const ruleRef = useRef<HTMLSpanElement>(null);

  // classic-mode refs
  const markRef = useRef<HTMLDivElement>(null);
  const classicRuleRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !mounted) return;

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

    if (seen && !forced) {
      const quick = animate(root, { opacity: [1, 0], duration: 420, ease: "inOutQuad", onComplete: finish });
      return () => quick.revert();
    }

    document.body.classList.remove("ready");

    const skipAll = () => {
      utils.set(root, { opacity: 0 });
      finish();
    };

    /* ─────────────────────  classic curtain  ───────────────────── */
    if (variant === "classic") {
      const counter = { value: 0 };
      const iris = { value: 150 };
      const timeline = createTimeline({ defaults: { ease: "outExpo" } });
      timeline
        .add(markRef.current ?? root, { opacity: [0, 1], scale: [0.82, 1], rotate: [-9, 0], duration: 620 }, 0)
        .add(classicRuleRef.current ?? root, { scaleX: [0, 1], duration: 520, ease: "inOutQuart" }, 240)
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
        .add(markRef.current ?? root, { scale: [1, 1.3], opacity: [1, 0], duration: 700 }, 1150);

      const irisAnim = animate(iris, {
        value: 0,
        duration: 820,
        delay: 1150,
        ease: "inOutQuart",
        onUpdate: () => root.style.setProperty("--iris", `${iris.value.toFixed(2)}%`),
        onComplete: finish,
      });

      const skip = () => {
        timeline.pause();
        irisAnim.pause();
        skipAll();
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
    }

    /* ───────────────────────  arrival v2  ──────────────────────── */

    const stage = stageRef.current ?? root;
    const portrait = portraitRef.current ?? root;
    const ring = ringRef.current;
    const word = wordRef.current;
    const letters = word ? Array.from(word.querySelectorAll<HTMLElement>("[data-letter]")) : [];

    // Ring geometry drives the aperture progress.
    const radius = ring ? Number(ring.getAttribute("r") ?? 96) : 96;
    const circumference = 2 * Math.PI * radius;
    if (ring) {
      ring.style.strokeDasharray = `${circumference}`;
      ring.style.strokeDashoffset = `${circumference}`;
    }

    // The curtain opens from wherever the hero portrait actually is.
    const aimIris = () => {
      const target = document.querySelector<HTMLElement>(".portrait-hero, .portrait-story");
      const rect = target?.getBoundingClientRect();
      const x = rect && rect.width > 40 ? rect.left + rect.width / 2 : window.innerWidth / 2;
      const y = rect && rect.height > 40 ? rect.top + rect.height / 2 : window.innerHeight * 0.42;
      root.style.setProperty("--iris-x", `${Math.round(x)}px`);
      root.style.setProperty("--iris-y", `${Math.round(y)}px`);
    };
    aimIris();
    window.addEventListener("resize", aimIris);

    // Pointer tilt on the avatar — the one flourish that makes it feel physical.
    let tiltRaf = 0;
    const onMove = (event: PointerEvent) => {
      if (!isFinePointer() || tiltRaf) return;
      tiltRaf = requestAnimationFrame(() => {
        tiltRaf = 0;
        const px = event.clientX / window.innerWidth - 0.5;
        const py = event.clientY / window.innerHeight - 0.5;
        stage.style.setProperty("--tilt-y", `${(px * 9).toFixed(2)}deg`);
        stage.style.setProperty("--tilt-x", `${(-py * 7).toFixed(2)}deg`);
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const progress = { value: 0 };
    const iris = { value: 150 };
    const hold = { value: 0 };

    const timeline = createTimeline({ defaults: { ease: "outExpo" } });

    timeline
      .add(stage, { opacity: [0, 1], duration: 320 }, 0)
      .add(portrait, { opacity: [0, 1], scale: [0.9, 1], translateY: [30, 0], duration: 1000 }, 40)
      .add(scanRef.current ?? portrait, { top: ["-25%", "125%"], duration: 900, ease: "inOutQuart" }, 120)
      .add(
        progress,
        {
          value: 100,
          duration: 940,
          ease: "inOutQuart",
          onUpdate: () => {
            const p = progress.value;
            root.style.setProperty("--reveal", `${Math.round(p * 1.18)}%`);
            root.style.setProperty("--develop", `${(p / 100).toFixed(3)}`);
            if (counterRef.current) {
              counterRef.current.textContent = String(Math.round(p)).padStart(3, "0");
            }
            if (ring) {
              ring.style.strokeDashoffset = `${circumference * (1 - p / 100)}`;
            }
            if (ruleRef.current) {
              ruleRef.current.style.transform = `scaleX(${(p / 100).toFixed(3)})`;
            }
          },
        },
        260
      )
      .add(
        letters,
        { opacity: [0, 1], translateY: [14, 0], filter: ["blur(8px)", "blur(0px)"], duration: 620, delay: stagger(26) },
        700
      )
      .add(kickerRef.current ?? root, { opacity: [1, 0], duration: 160, ease: "linear" }, 930)
      .add(hold, { value: 1, duration: 260, ease: "linear" }, 1120)
      .add(portrait, { scale: [1, 1.07], duration: 620 }, 1180);

    // "Welcome" replaces "loading" after the fade has fully landed, so anime is
    // no longer writing opacity and the swap cannot be overwritten.
    const welcome = window.setTimeout(() => {
      const kicker = kickerRef.current;
      if (!kicker) return;
      kicker.textContent = "Welcome";
      animate(kicker, { opacity: [0, 1], translateY: [4, 0], duration: 260, ease: "outQuad" });
    }, 1120);

    /**
     * The handoff.
     *
     * Measure where the hero's portrait actually sits, then FLIP the intro's
     * circular avatar across to that rectangle while the backdrop dissolves.
     * The hero card is already fading in underneath, so the object the visitor
     * met at the start is the object they land on — one continuous thing
     * instead of two unrelated screens.
     */
    const handoff = () => {
      const frame = stage.querySelector<HTMLElement>(".iv-frame");
      const target = [...document.querySelectorAll<HTMLElement>(".portrait-hero, .portrait-story")].find(
        (el) => el.getBoundingClientRect().width > 60
      );
      const source = frame?.getBoundingClientRect();
      const dest = target?.getBoundingClientRect();

      // Fly only when the destination is properly on screen. On a phone the
      // portrait sits below the fold, and flying there would yank the avatar
      // out of the viewport — dissolve in place instead.
      const reachable =
        source && dest && dest.top > 0 && dest.top < window.innerHeight * 0.72 && dest.width > 120;
      if (reachable) {
        const scale = Math.min(dest.width / (source.width * 0.82), 1.9);
        const dx = dest.left + dest.width / 2 - (source.left + source.width / 2);
        const dy = dest.top + dest.height / 2 - (source.top + source.height / 2);
        root.style.setProperty("--fly-x", `${dx.toFixed(1)}px`);
        root.style.setProperty("--fly-y", `${dy.toFixed(1)}px`);
        root.style.setProperty("--fly-s", `${scale.toFixed(3)}`);
      }
      // Let the hero fade up underneath while the avatar is still in the air,
      // so the frame it lands in is already there.
      document.body.classList.add("ready");
      root.classList.add(reachable ? "is-flying" : "is-dissolving");
      if (!reachable && stage) {
        // anime owns .iv-stage's inline opacity (the entrance wrote it), so the
        // exit has to go through anime too — a CSS class would lose the cascade.
        animate(stage, { opacity: 0, scale: 0.96, translateY: -12, duration: 560, ease: "outQuad" });
      }
      document.body.classList.add("intro-handoff");

      window.setTimeout(() => {
        document.body.classList.remove("intro-handoff");
        finish();
      }, 900);
    };

    const IRIS_AT = 1620;
    const irisAnim = animate(iris, {
      value: 0,
      duration: 760,
      delay: IRIS_AT,
      ease: "inOutQuart",
      onUpdate: () => root.style.setProperty("--iris", `${iris.value.toFixed(2)}%`),
      onComplete: handoff,
    });

    const skip = () => {
      timeline.pause();
      irisAnim.pause();
      window.clearTimeout(welcome);
      skipAll();
    };
    window.addEventListener("pointerdown", skip, { once: true });
    window.addEventListener("keydown", skip, { once: true });
    window.addEventListener("wheel", skip, { once: true, passive: true });

    return () => {
      window.clearTimeout(welcome);
      timeline.revert();
      irisAnim.revert();
      window.removeEventListener("resize", aimIris);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("wheel", skip);
      if (tiltRaf) cancelAnimationFrame(tiltRaf);
    };
  }, [mounted, variant, forced]);

  if (!mounted) return null;

  if (variant === "classic") {
    return (
      <div ref={rootRef} className="intro-loader" aria-hidden="true">
        <span className="loader-ring" />
        <div className="loader-inner">
          <div ref={markRef} className="loader-mark">
            <span className="font-script text-[86px] leading-none text-[#f4f1e9]">AK</span>
            <span className="font-display mt-3 text-3xl leading-none text-acid">+</span>
          </div>
          <span ref={classicRuleRef} className="loader-rule" />
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

  return (
    <div ref={rootRef} className="intro-loader intro-loader-v2" aria-hidden="true">
      <span className="iv-veil" />
      <div ref={stageRef} className="iv-stage">
        <span className="iv-halo" />
        <span className="iv-grid" />

        <div className="iv-frame">
          <span className="iv-tick tl" />
          <span className="iv-tick tr" />
          <span className="iv-tick bl" />
          <span className="iv-tick br" />
          <span className="iv-tag">Profile&nbsp;/&nbsp;001</span>
          <span className="iv-tag iv-tag--right">
            <i className="iv-dot" />
            Open to ideas
          </span>

          <div ref={portraitRef} className="iv-portrait">
            <img
              src={AVATAR}
              alt=""
              className="iv-img"
              fetchPriority="high"
              decoding="sync"
              draggable={false}
            />
            <span className="iv-tint" />
            <span className="iv-grain" />
            <span ref={scanRef} className="iv-scan" />
          </div>

          <svg className="iv-ring" viewBox="0 0 200 200" aria-hidden="true">
            <circle className="iv-ring-track" cx="100" cy="100" r="96" />
            <circle ref={ringRef} className="iv-ring-fill" cx="100" cy="100" r="96" />
          </svg>
          <span className="iv-orbit" />
        </div>

        <div ref={wordRef} className="iv-word" aria-label="Adarsh Kumar">
          {"ADARSH KUMAR".split("").map((char, index) => (
            <span key={`${char}-${index}`} data-letter aria-hidden="true">
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </div>

        <div className="iv-status">
          <span ref={kickerRef} className="iv-kicker">
            Loading the studio
          </span>
          <span className="iv-rule" ref={ruleRef} />
          <span ref={counterRef} className="iv-count tabular-nums">
            000
          </span>
        </div>
      </div>
    </div>
  );
}
