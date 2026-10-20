import { cx } from "../../lib/utils";

interface PosterProps {
  title: string;
  top?: string;
  index?: string;
  bottomLeft?: string;
  tag?: string;
  gradient: [string, string];
  className?: string;
  compact?: boolean;
}

/**
 * The generated gradient "poster" card — dot-grid texture, blurred orb,
 * hairline ring and giant pixel title. Identical system to the original
 * project posters, now driven by props instead of innerHTML strings.
 */
export function Poster({
  title,
  top,
  index,
  bottomLeft,
  tag,
  gradient,
  className,
  compact = false,
}: PosterProps) {
  return (
    <div
      className={cx("poster", className)}
      style={
        {
          "--poster-a": gradient[0],
          "--poster-b": gradient[1],
        } as React.CSSProperties
      }
      aria-hidden="true"
    >
      <span className="poster-orb" />
      <span className="poster-ring" />

      {(top || index) && !compact ? (
        <div className="poster-top">
          <span>{top}</span>
          <span>{index}</span>
        </div>
      ) : (
        <span />
      )}

      <div className="poster-title">{title}</div>

      <div className="poster-meta">
        <span>{bottomLeft}</span>
        <span
          className={cx(
            "rounded-full border border-white/40 px-2.5 py-1",
            compact ? "text-[9px]" : "text-[10px]"
          )}
        >
          {tag}
        </span>
      </div>
    </div>
  );
}
