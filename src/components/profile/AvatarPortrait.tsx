import { useEffect, useRef, useState, type ReactNode } from "react";
import { cx, isFinePointer, prefersReducedMotion } from "../../lib/utils";

interface PortraitFrameProps {
  src?: string | null;
  /** Used when the remote avatar is blocked or 404s — ships with the site. */
  fallbackSrc?: string;
  alt: string;
  /** `hero` fills the home column, `story` the 4:5 card on /about. */
  variant?: "hero" | "story";
  className?: string;
  children?: ReactNode;
  /** Small pixel label in the top-left corner. */
  label?: string;
  /** Pixel label in the top-right corner. */
  badge?: string;
}

/**
 * The GitHub avatar, treated like an artefact rather than a headshot.
 *
 * Pointer-parallax tilt, a duotone that resolves to full colour as you get
 * close, RGB-split glitch slices, halftone + scanline texture, a sweeping scan
 * beam and corner ticks. Falls back to the `AK` monogram if the CDN is blocked
 * — which is exactly what happens behind a strict proxy, so it has to look
 * deliberate either way.
 */
export function PortraitFrame({
  src,
  fallbackSrc = "/img/avatar.jpg",
  alt,
  variant = "hero",
  className,
  children,
  label = "Portrait / 001",
  badge = "Open to ideas",
}: PortraitFrameProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  // Two-stage: remote avatar → bundled fallback → monogram. A blocked CDN
  // (corporate proxy, offline) must never leave an empty frame.
  const [stage, setStage] = useState<0 | 1 | 2>(0);
  const image = stage === 0 ? src : stage === 1 ? fallbackSrc : null;
  const style = image ? ({ "--portrait": `url("${image}")` } as React.CSSProperties) : undefined;

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || !isFinePointer() || prefersReducedMotion()) return;

    let raf = 0;
    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;
    let glossX = 50;
    let glossY = 50;

    const tick = () => {
      x += (targetX - x) * 0.09;
      y += (targetY - y) * 0.09;
      frame.style.setProperty("--rx", `${x.toFixed(2)}deg`);
      frame.style.setProperty("--ry", `${y.toFixed(2)}deg`);
      frame.style.setProperty("--gx", `${glossX.toFixed(1)}%`);
      frame.style.setProperty("--gy", `${glossY.toFixed(1)}%`);
      const settled = Math.abs(targetX - x) < 0.05 && Math.abs(targetY - y) < 0.05;
      raf = settled ? 0 : requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      const rect = frame.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      targetX = (0.5 - py) * 14;
      targetY = (px - 0.5) * 16;
      glossX = px * 100;
      glossY = py * 100;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onEnter = () => frame.classList.add("is-near");
    const onLeave = () => {
      frame.classList.remove("is-near");
      targetX = 0;
      targetY = 0;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    frame.addEventListener("pointermove", onMove, { passive: true });
    frame.addEventListener("pointerenter", onEnter);
    frame.addEventListener("pointerleave", onLeave);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      frame.removeEventListener("pointermove", onMove);
      frame.removeEventListener("pointerenter", onEnter);
      frame.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={frameRef}
      className={cx("portrait", `portrait-${variant}`, image ? "has-image" : "no-image", className)}
      style={style}
      data-cursor="portrait"
    >
      <div className="portrait-plane">
        {image ? (
          <>
            <img
              src={image}
              alt={alt}
              className="portrait-img"
              loading={variant === "hero" ? "eager" : "lazy"}
              decoding="async"
              draggable={false}
              onError={() => setStage((s) => (s + 1) as 0 | 1 | 2)}
            />
            <span className="portrait-tone" aria-hidden="true" />
            <span className="portrait-halftone" aria-hidden="true" />
            <span className="portrait-scan" aria-hidden="true" />
            <span className="portrait-gloss" aria-hidden="true" />
            <span className="portrait-glitch glitch-1" aria-hidden="true" />
            <span className="portrait-glitch glitch-2" aria-hidden="true" />
            <span className="portrait-glitch glitch-3" aria-hidden="true" />
          </>
        ) : (
          <div className="portrait-fallback">
            <span className="portrait-fallback-mark">AK</span>
            <span className="portrait-fallback-grid" aria-hidden="true" />
            <span className="portrait-fallback-caption">{alt}</span>
          </div>
        )}

        <span className="portrait-tick tl" aria-hidden="true" />
        <span className="portrait-tick tr" aria-hidden="true" />
        <span className="portrait-tick bl" aria-hidden="true" />
        <span className="portrait-tick br" aria-hidden="true" />

        <div className="portrait-top">
          <span className="micro-label !text-white/70">{label}</span>
          <span className="micro-label portrait-badge">{badge}</span>
        </div>

        <div className="portrait-veil" aria-hidden="true" />
        {children ? <div className="portrait-caption">{children}</div> : null}
      </div>
    </div>
  );
}

interface AvatarTypeProps {
  src?: string | null;
  fallbackSrc?: string;
  text?: string;
  className?: string;
  caption?: string;
}

/**
 * The avatar as type: a giant wordmark filled with the GitHub photo, so the
 * portrait reads twice — once as a picture, once as the initials.
 */
export function AvatarType({
  src,
  fallbackSrc = "/img/avatar.jpg",
  text = "AK",
  className,
  caption,
}: AvatarTypeProps) {
  const [stage, setStage] = useState<0 | 1 | 2>(0);
  const image = stage === 0 ? src : stage === 1 ? fallbackSrc : null;

  return (
    <figure className={cx("avatar-type", className)}>
      <span
        className={cx("avatar-type-word", image && "has-image")}
        style={image ? ({ "--portrait": `url("${image}")` } as React.CSSProperties) : undefined}
        aria-hidden="true"
      >
        {text}
      </span>
      {/* Keeps the real image in the document for accessibility + right-click. */}
      {image ? (
        <img
          src={image}
          alt=""
          className="sr-only"
          onError={() => setStage((s) => (s + 1) as 0 | 1 | 2)}
          aria-hidden="true"
        />
      ) : null}
      {caption ? <figcaption className="micro-label">{caption}</figcaption> : null}
    </figure>
  );
}
