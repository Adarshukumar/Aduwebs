import type { ReactNode } from "react";
import { useParallax } from "../../lib/motion";
import { cx } from "../../lib/utils";

/**
 * Scroll-scrubbed depth. The wrapper writes `--parallax` on itself from an
 * anime.js scroll observer; CSS does the rest, on the compositor.
 */
export function Parallax({
  children,
  depth = 40,
  className,
}: {
  children: ReactNode;
  depth?: number;
  className?: string;
}) {
  const ref = useParallax<HTMLDivElement>(depth);
  return (
    <div ref={ref} data-parallax className={cx(className)} aria-hidden={undefined}>
      {children}
    </div>
  );
}
