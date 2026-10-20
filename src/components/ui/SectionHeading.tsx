import type { ReactNode } from "react";
import { cx } from "../../lib/utils";
import { Reveal } from "./Reveal";

interface SectionHeadingProps {
  kicker: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "split" | "left";
  className?: string;
  dark?: boolean;
}

/** Editorial section header: pixel kicker → serif title (with italic line) → muted copy. */
export function SectionHeading({
  kicker,
  title,
  description,
  align = "split",
  className,
  dark = false,
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cx(
        "mb-10 md:mb-14",
        align === "split"
          ? "grid gap-6 md:grid-cols-[1.15fr_0.85fr] md:items-end"
          : "flex flex-col gap-4",
        className
      )}
    >
      <div>
        <p className={cx("kicker mb-4", dark && "!text-white/55")}>{kicker}</p>
        <h2 className="section-title">{title}</h2>
      </div>
      {description ? (
        <p
          className={cx(
            "max-w-md text-[13.5px] leading-relaxed text-muted md:justify-self-end md:text-right",
            dark && "!text-white/60"
          )}
        >
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}

interface PageHeroProps {
  kicker: string;
  title: ReactNode;
  outline?: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
}

/** Full-width banner used at the top of every sub-page. */
export function PageHero({ kicker, title, outline, description, meta }: PageHeroProps) {
  return (
    <header className="relative overflow-hidden border-b border-line px-[clamp(20px,4.4vw,62px)] pt-16 pb-14 md:pt-24 md:pb-20">
      <div
        className="dot-grid pointer-events-none absolute inset-y-0 right-0 w-1/2 opacity-70"
        aria-hidden="true"
      />
      <div
        className="blob blob-float pointer-events-none -top-24 -right-16 h-72 w-72 opacity-[0.16]"
        style={{ background: "var(--acid)" }}
        aria-hidden="true"
      />
      <div className="relative max-w-5xl">
        <p className="kicker mb-5">{kicker}</p>
        <h1 className="mega-title">
          <span className="block">{title}</span>
          {outline ? <span className="outline-text block pl-[0.08em]">{outline}</span> : null}
        </h1>
        {description ? (
          <p className="mt-7 max-w-2xl text-[14.5px] leading-relaxed text-muted">{description}</p>
        ) : null}
        {meta ? <div className="mt-8 flex flex-wrap items-center gap-3">{meta}</div> : null}
      </div>
    </header>
  );
}
