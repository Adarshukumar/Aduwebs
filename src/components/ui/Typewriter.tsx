import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "../../lib/utils";

interface TypewriterProps {
  /** Lines to type, in order. The first one is shown immediately. */
  lines: string[];
  className?: string;
  typeSpeed?: number;
  holdTime?: number;
  cursor?: boolean;
}

/**
 * A quiet typewriter: types a line, holds, deletes, moves on.
 *
 * The first line is server-rendered in full — so the meaning is never hidden
 * behind an animation — and screen readers get the whole list once, in a
 * visually-hidden node, rather than hearing the loop forever.
 */
export function Typewriter({
  lines,
  className,
  typeSpeed = 46,
  holdTime = 2100,
  cursor = true,
}: TypewriterProps) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState(lines[0] ?? "");
  const [deleting, setDeleting] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion() || lines.length < 2) return;

    const current = lines[index % lines.length];
    let timer: number;

    if (!deleting) {
      if (text.length < current.length) {
        timer = window.setTimeout(() => {
          if (mounted.current) setText(current.slice(0, text.length + 1));
        }, typeSpeed);
      } else {
        timer = window.setTimeout(() => {
          if (mounted.current) setDeleting(true);
        }, holdTime);
      }
    } else if (text.length > 0) {
      timer = window.setTimeout(() => {
        if (mounted.current) setText(current.slice(0, text.length - 1));
      }, typeSpeed * 0.5);
    } else {
      timer = window.setTimeout(() => {
        if (!mounted.current) return;
        setDeleting(false);
        setIndex((value) => (value + 1) % lines.length);
      }, 180);
    }

    return () => window.clearTimeout(timer);
  }, [text, deleting, index, lines, typeSpeed, holdTime]);

  return (
    <span className={className}>
      <span aria-hidden="true">{text}</span>
      {cursor ? <span className="type-cursor" aria-hidden="true" /> : null}
      <span className="sr-only">{lines.join(" · ")}</span>
    </span>
  );
}
