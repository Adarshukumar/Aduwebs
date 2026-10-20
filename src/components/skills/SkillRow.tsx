import { ArrowUpRight } from "lucide-react";
import type { Skill } from "../../lib/data";
import { cx, gradientFor } from "../../lib/utils";
import { Poster } from "../ui/Poster";
import { WipeLink } from "../fx/Effects";

interface SkillRowProps {
  skill: Skill;
  index: number;
  showLevel?: boolean;
}

/**
 * The editorial three-column row from the original Skills section:
 * copy (index pinned top, CTA pinned bottom) · generated poster · meta column.
 */
export function SkillRow({ skill, index, showLevel = true }: SkillRowProps) {
  const number = String(index + 1).padStart(2, "0");
  const external = skill.url.startsWith("http");
  const gradient = gradientFor(index);

  const linkInner = (
    <>
      {skill.cta}
      <ArrowUpRight aria-hidden="true" />
    </>
  );

  return (
    <article className="project-row group items-start">
      <div className="flex min-h-[220px] flex-col">
        <span className="project-index">{number}</span>
        <h3 className="project-title">{skill.name}</h3>
        <p className="max-w-md text-[13.5px] leading-relaxed text-muted">{skill.desc}</p>

        <div className="mt-auto pt-6">
          {external ? (
            <a
              href={skill.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-link"
            >
              {linkInner}
            </a>
          ) : (
            <WipeLink to={skill.url} className="text-link">
              {linkInner}
            </WipeLink>
          )}
        </div>
      </div>

      <div className="min-w-0">
        <Poster
          title={skill.name}
          top={skill.typeLabel}
          index={number}
          bottomLeft={skill.where}
          tag={skill.tag}
          gradient={gradient}
        />
      </div>

      <div className="project-meta-col flex flex-col gap-5">
        <div>
          <span className="micro-label mb-2.5 block">Used for</span>
          <div className="flex flex-wrap gap-1.5">
            {skill.use.map((item, itemIndex) => (
              <span key={item} className="chip">
                {itemIndex === 0 ? (
                  <span className="chip-dot" style={{ ["--dot-color" as string]: skill.color }} />
                ) : null}
                {item}
              </span>
            ))}
          </div>
        </div>

        <div>
          <span className="micro-label mb-2 block">Seen in</span>
          <span className="text-[13px] text-ink">{skill.where}</span>
        </div>

        {showLevel ? (
          <div>
            <div className="mb-2 flex items-baseline justify-between gap-3">
              <span className="micro-label">Confidence</span>
              <span className="font-mono-code text-[11px] text-muted tabular-nums">
                {skill.level}%
              </span>
            </div>
            <div
              className="h-[3px] w-full overflow-hidden rounded-full"
              style={{ background: "var(--line)" }}
              role="progressbar"
              aria-valuenow={skill.level}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${skill.name} confidence`}
            >
              <span
                className={cx("block h-full rounded-full transition-[width] duration-1000")}
                style={{
                  width: `${skill.level}%`,
                  background: skill.color,
                  transitionTimingFunction: "var(--ease)",
                }}
              />
            </div>
          </div>
        ) : null}

        <div>
          <span className="micro-label mb-2 block">Proof</span>
          <span className="text-[13px] text-ink">{skill.proof}</span>
        </div>
      </div>
    </article>
  );
}
