import { useEffect, useRef, type ReactNode } from "react";
import { cx, isFinePointer, prefersReducedMotion } from "../../lib/utils";

interface MagneticProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  as?: "div" | "span";
}

/**
 * Pulls toward the cursor while hovered — the magnetic CTA feel from the
 * original site. Gated to fine pointers and disabled under reduced motion.
 */
export function Magnetic({ children, className, strength = 0.24, as = "div" }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const Tag = as as "div";

  useEffect(() => {
    const node = ref.current;
    if (!node || !isFinePointer() || prefersReducedMotion()) return;

    let frame = 0;

    const onMove = (event: MouseEvent) => {
      const rect = node.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * strength;
      const y = (event.clientY - rect.top - rect.height / 2) * strength;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        node.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });
    };

    const onLeave = () => {
      cancelAnimationFrame(frame);
      node.style.transform = "translate3d(0, 0, 0)";
    };

    node.style.transition = "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)";
    node.addEventListener("mousemove", onMove);
    node.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      node.removeEventListener("mousemove", onMove);
      node.removeEventListener("mouseleave", onLeave);
      node.style.transform = "";
    };
  }, [strength]);

  return (
    <Tag ref={ref as React.Ref<HTMLDivElement>} className={cx("inline-block", className)}>
      {children}
    </Tag>
  );
}
