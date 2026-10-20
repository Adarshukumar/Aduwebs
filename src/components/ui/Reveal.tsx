import { useEffect, useRef, useState, type ReactNode } from "react";
import { cx } from "../../lib/utils";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: 0 | 1 | 2 | 3;
  as?: "div" | "section" | "article" | "aside" | "li" | "span";
}

/**
 * Rise-in-on-scroll. Mirrors the original `.reveal` + IntersectionObserver pair:
 * one-shot, unobserved after firing, and forced visible under reduced motion.
 */
export function Reveal({ children, className, delay = 0, as = "div" }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const Tag = as as "div";

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const delayClass = delay > 0 ? `reveal-delay-${delay}` : "";

  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement>}
      className={cx("reveal", visible && "visible", delayClass, className)}
    >
      {children}
    </Tag>
  );
}
