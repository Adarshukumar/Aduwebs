import { useEffect, useRef } from "react";
import { isFinePointer, prefersReducedMotion } from "../../lib/utils";

/**
 * The dragon.
 *
 * A hand-drawn wyvern (one inline SVG, no sprite sheet, no network request) that
 * flies toward the pointer with a critically-damped lag, banks into its own
 * velocity, mirrors when it changes direction and beats its wings faster the
 * harder you move. Embers trail it on a canvas; a hairline reticle keeps the
 * exact pointer position legible and locks acid on anything interactive.
 *
 * Respects: fine pointer only, never under `prefers-reduced-motion`, pauses when
 * the tab is hidden, and form fields keep their native text caret.
 */

const NOSE_X = 179;
const NOSE_Y = 33;
const SPRITE_SCALE = 0.38;
const MIRROR = "scale(-1 1)";

interface Ember {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
  acid: boolean;
}

export function DragonCursor() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const reticleRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nearWingRef = useRef<SVGGElement>(null);
  const farWingRef = useRef<SVGGElement>(null);
  const spadeRef = useRef<SVGGElement>(null);
  const eyeRef = useRef<SVGGElement>(null);
  const spriteRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (!isFinePointer() || prefersReducedMotion()) return;

    const wrap = wrapRef.current;
    const reticle = reticleRef.current;
    const canvas = canvasRef.current;
    const nearWing = nearWingRef.current;
    const farWing = farWingRef.current;
    const spade = spadeRef.current;
    const eye = eyeRef.current;
    const sprite = spriteRef.current;
    if (!wrap || !reticle || !canvas || !nearWing || !farWing || !spade || !eye || !sprite) return;

    document.body.classList.add("dragon-ready");

    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    let pointerX = width / 2;
    let pointerY = height / 2;
    let dragonX = pointerX;
    let dragonY = pointerY;
    let reticleX = pointerX;
    let reticleY = pointerY;
    let lean = 0;
    let facing = 1;
    let flapPhase = 0;
    let spadePhase = 0;
    let idle = 0;
    let blinkAt = 2200;
    let blinkPhase = 0;
    let active = false;
    let hovering = false;

    const embers: Ember[] = [];
    const MAX_EMBERS = 64;

    const pushEmber = (x: number, y: number, burst = false) => {
      if (embers.length >= MAX_EMBERS) embers.shift();
      const angle = Math.random() * Math.PI * 2;
      const speed = burst ? 1.4 + Math.random() * 2.6 : 0.2 + Math.random() * 0.55;
      embers.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (burst ? 0.45 : 0.14),
        life: 0,
        max: burst ? 620 + Math.random() * 380 : 420 + Math.random() * 320,
        size: burst ? 1.4 + Math.random() * 2.1 : 0.8 + Math.random() * 1.5,
        acid: Math.random() < 0.72,
      });
    };

    const onPointerMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!active) {
        active = true;
        dragonX = pointerX;
        dragonY = pointerY;
        reticleX = pointerX;
        reticleY = pointerY;
        wrap.classList.add("is-live");
        reticle.classList.add("is-live");
      }
      idle = 0;
    };

    const onPointerLeave = () => {
      active = false;
      wrap.classList.remove("is-live");
      reticle.classList.remove("is-live");
    };

    const onOver = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      const next = Boolean(
        target?.closest(
          "a, button, input, select, textarea, label, .memory-card, .filter-tab, [data-cursor]"
        )
      );
      if (next !== hovering) {
        hovering = next;
        reticle.classList.toggle("is-hover", next);
        wrap.classList.toggle("is-hover", next);
      }
    };

    const onDown = () => {
      pushEmber(dragonX, dragonY, true);
      pushEmber(dragonX, dragonY, true);
      wrap.classList.add("is-press");
      window.setTimeout(() => wrap.classList.remove("is-press"), 220);
    };

    let raf = 0;
    let last = performance.now();

    function renderEmbers(dt: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      for (let i = embers.length - 1; i >= 0; i -= 1) {
        const p = embers[i];
        p.life += dt;
        if (p.life > p.max) {
          embers.splice(i, 1);
          continue;
        }
        p.x += p.vx * (dt / 16);
        p.y += p.vy * (dt / 16);
        p.vy -= 0.008 * (dt / 16);
        p.vx *= 0.985;

        const t = 1 - p.life / p.max;
        const alpha = t * t * 0.7;
        ctx.beginPath();
        ctx.fillStyle = p.acid
          ? `rgba(200, 255, 55, ${alpha})`
          : `rgba(255, 122, 61, ${alpha * 0.8})`;
        ctx.arc(p.x, p.y, Math.max(0.2, p.size * (0.4 + t * 0.9)), 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(48, now - last);
      last = now;
      idle += dt;

      if (!active) {
        renderEmbers(dt);
        return;
      }

      const ease = hovering ? 0.2 : 0.145;
      dragonX += (pointerX - dragonX) * ease;
      dragonY += (pointerY - dragonY) * ease;
      reticleX += (pointerX - reticleX) * 0.28;
      reticleY += (pointerY - reticleY) * 0.28;

      const vx = pointerX - dragonX;
      const vy = pointerY - dragonY;
      const speed = Math.hypot(vx, vy);

      if (Math.abs(vx) > 1.1) {
        const next = vx < 0 ? -1 : 1;
        if (next !== facing) {
          facing = next;
          sprite.setAttribute("transform", facing === -1 ? MIRROR : "");
        }
      }

      const targetLean = Math.max(-20, Math.min(20, vy * 0.42)) * facing;
      lean += (targetLean - lean) * 0.12;

      const bob = idle > 1400 && speed < 1.2 ? Math.sin(now / 620) * 2.2 : 0;

      wrap.style.transform = `translate3d(${dragonX.toFixed(2)}px, ${(
        dragonY + bob
      ).toFixed(2)}px, 0) rotate(${lean.toFixed(2)}deg)`;
      reticle.style.transform = `translate3d(${reticleX.toFixed(2)}px, ${reticleY.toFixed(
        2
      )}px, 0) translate(-50%, -50%)`;

      const beatRate = 0.0055 + Math.min(0.017, speed * 0.0016);
      flapPhase += dt * beatRate;
      const amp = 16 + Math.min(16, speed * 1.1);
      nearWing.setAttribute("transform", `rotate(${(Math.sin(flapPhase) * amp - 4).toFixed(2)} 100 50)`);
      farWing.setAttribute(
        "transform",
        `rotate(${(Math.sin(flapPhase - 0.75) * amp * 0.85 - 4).toFixed(2)} 100 50)`
      );

      spadePhase += dt * 0.0042;
      spade.setAttribute("transform", `rotate(${(Math.sin(spadePhase) * 10).toFixed(2)} 18 78)`);

      // blink: a quick squash of the eye every few seconds
      blinkAt -= dt;
      if (blinkAt < 0) {
        blinkAt = 2600 + Math.random() * 3200;
        blinkPhase = 1;
      }
      if (blinkPhase > 0) {
        blinkPhase = Math.max(0, blinkPhase - dt / 130);
        const squash = 1 - Math.sin(blinkPhase * Math.PI) * 0.9;
        eye.setAttribute(
          "transform",
          `translate(0 ${(27 * (1 - squash)).toFixed(2)}) scale(1 ${squash.toFixed(2)})`
        );
      }

      if (speed > 0.9 && Math.random() > 0.55) {
        pushEmber(dragonX - 26 * facing, dragonY + 9 + Math.random() * 6);
      }

      renderEmbers(dt);
    };

    raf = requestAnimationFrame(frame);

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("resize", resize);

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      document.body.classList.remove("dragon-ready");
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("pointerover", onOver);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="dragon-trail" aria-hidden="true" />
      <div ref={reticleRef} className="dragon-reticle" aria-hidden="true">
        <span className="dragon-reticle-dot" />
        <span className="dragon-reticle-label">view</span>
      </div>
      <div ref={wrapRef} className="dragon" aria-hidden="true">
        <span className="dragon-glow" />
        <svg className="dragon-sprite" viewBox="-80 -24 86 60" overflow="visible">
          <g ref={spriteRef}>
            <g transform={`scale(${SPRITE_SCALE}) translate(${-NOSE_X} ${-NOSE_Y})`}>
              <g ref={farWingRef}>
                <path d={MEMBRANE} fill="var(--dragon-line)" opacity="0.12" transform="translate(10,-10) scale(0.88)" />
                <path d={MEMBRANE} fill="none" stroke="var(--dragon-line)" strokeWidth="2.2" opacity="0.28" transform="translate(10,-10) scale(0.88)" />
              </g>

              <g ref={spadeRef}>
                <path d={SPADE} fill="var(--dragon-body)" stroke="var(--dragon-line)" strokeWidth="5" strokeLinejoin="round" />
              </g>

              <path
                d={BODY}
                fill="var(--dragon-body)"
                stroke="var(--dragon-line)"
                strokeWidth="7"
                strokeLinejoin="round"
              />

              <g ref={nearWingRef}>
                <path
                  d={MEMBRANE}
                  fill="url(#dragon-membrane)"
                  stroke="var(--dragon-line)"
                  strokeWidth="6.5"
                  strokeLinejoin="round"
                />
                <path d="M 96 46 C 84 32 68 18 44 8" fill="none" stroke="var(--dragon-line)" strokeWidth="2.4" opacity="0.55" />
                <path d="M 92 54 C 82 44 70 36 56 30" fill="none" stroke="var(--dragon-line)" strokeWidth="2" opacity="0.4" />
              </g>

              <path d="M 74 84 C 70 92 70 100 78 102 C 86 104 91 98 88 93 C 86 89 80 90 80 95" fill="var(--dragon-body)" stroke="var(--dragon-line)" strokeWidth="5" strokeLinejoin="round" />
              <path d="M 84 96 L 91 98 M 84 94 L 90 93" fill="none" stroke="var(--dragon-line)" strokeWidth="2.4" strokeLinecap="round" />
              <path d="M 96 82 C 98 90 104 94 110 91" fill="none" stroke="var(--dragon-line)" strokeWidth="10" strokeLinecap="round" />
              <path d="M 96 82 C 98 90 104 94 110 91" fill="none" stroke="var(--dragon-body)" strokeWidth="5" strokeLinecap="round" />
              <path d="M 110 91 L 116 94 M 110 91 L 116 90" fill="none" stroke="var(--dragon-line)" strokeWidth="2.2" strokeLinecap="round" />

              <path d="M 78 47 L 82 37 L 88 47 Z" fill="var(--dragon-line)" />
              <path d="M 90 46 L 96 35 L 101 47 Z" fill="var(--dragon-line)" />
              <path d="M 128 18 C 126 8 132 1 143 0 C 136 8 136 14 139 20" fill="var(--dragon-line)" />

              <g ref={eyeRef}>
                <path d="M 138 27 C 143 23 151 23 155 27 C 151 32 143 32 138 27 Z" fill="var(--dragon-eye)" stroke="var(--dragon-line)" strokeWidth="2" />
                <circle cx="147" cy="27" r="1.5" fill="var(--dragon-body)" />
              </g>

              <path d="M 130 39 C 140 47 156 47 170 40" fill="none" stroke="var(--dragon-line)" strokeWidth="2.4" strokeLinecap="round" />
              <path d="M 145 42 L 147 49 L 151 42 Z" fill="var(--dragon-body)" stroke="var(--dragon-line)" strokeWidth="1.5" />
              <path d="M 157 41 L 159 47 L 163 40 Z" fill="var(--dragon-body)" stroke="var(--dragon-line)" strokeWidth="1.5" />
              <circle cx="167" cy="33" r="1.7" fill="var(--dragon-line)" />
            </g>
          </g>
          <defs>
            <linearGradient id="dragon-membrane" x1="0.1" y1="0" x2="0.7" y2="1">
              <stop offset="0" stopColor="#e8ff9a" stopOpacity="0.98" />
              <stop offset="0.55" stopColor="#c8ff37" stopOpacity="0.9" />
              <stop offset="1" stopColor="#a4dd1a" stopOpacity="0.66" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </>
  );
}

/* Geometry lives here so the JSX above stays readable. The creature faces right. */
const BODY =
  "M 14 72 C 40 70 58 62 74 52 C 86 44 96 40 104 44 C 110 32 120 20 132 15 C 148 9 168 14 180 24 C 186 29 186 35 179 38 C 170 42 160 43 150 42 C 143 42 137 45 133 48 C 124 55 116 63 110 71 C 104 80 96 87 84 90 C 66 94 48 90 36 85 C 26 81 19 76 14 72 Z";

const SPADE = "M 18 76 L 8 66 L 11 77 L 4 87 L 18 82 Z";

/** Wing with a scalloped trailing edge — reads as a bat wing at any size. */
const MEMBRANE =
  "M 100 50 C 90 36 72 22 44 18 L 58 34 L 46 33 L 58 50 L 46 49 L 58 64 C 68 70 88 64 100 50 Z";
