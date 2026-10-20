import { useMemo, useState } from "react";
import { ArrowUpRight, Layers } from "lucide-react";
import { PageHero, SectionHeading } from "../components/ui/SectionHeading";
import { Reveal } from "../components/ui/Reveal";
import { Magnetic } from "../components/ui/Magnetic";
import { Marquee } from "../components/ui/Marquee";
import { SkillRow } from "../components/skills/SkillRow";
import { ContactBand } from "../components/contact/ContactBand";
import { WipeLink } from "../components/fx/Effects";
import { SKILLS, SKILL_FILTERS, TOOLBOX, type SkillType } from "../lib/data";
import { cx } from "../lib/utils";

const GROUPS: { key: SkillType; title: string; blurb: string }[] = [
  {
    key: "languages",
    title: "Languages",
    blurb: "The four I reach for first — Python for anything with a model in it, JS/TS for anything with a browser, C/C++ for the fundamentals.",
  },
  {
    key: "ai",
    title: "AI & APIs",
    blurb: "Where most of the free hours go: LLM apps, RAG pipelines, model routing and the FastAPI services that put them in front of real people.",
  },
  {
    key: "frontend",
    title: "Frontend & Creative",
    blurb: "Hand-built, responsive and accessible — plus the video and motion work that sits alongside it for creator clients.",
  },
  {
    key: "data",
    title: "Data & Cloud",
    blurb: "Storage, containers and hosting. Docker images that deploy the same everywhere, and HuggingFace Spaces as a genuinely free host.",
  },
];

export function Stack() {
  const [filter, setFilter] = useState<SkillType | "all">("all");

  const items = useMemo(
    () => SKILLS.filter((skill) => filter === "all" || skill.type === filter),
    [filter]
  );

  const average = Math.round(
    SKILLS.reduce((sum, skill) => sum + skill.level, 0) / SKILLS.length
  );

  return (
    <>
      <PageHero
        kicker="Stack / 004"
        title="Code I speak,"
        outline="tools I trust."
        description="No tutorial trophies — this is the working stack behind client projects, 15+ live AI tools, and this very website. Human languages included, free of charge: Hindi and English."
        meta={
          <>
            <span className="chip">{SKILLS.length} core skills</span>
            <span className="chip">{TOOLBOX.length} more in the toolbox</span>
            <span className="chip">
              <Layers className="h-3 w-3" aria-hidden="true" /> {average}% average confidence
            </span>
          </>
        }
      />

      {/* ───────────────────  filterable list  ─────────────────── */}
      <section className="section-pad" aria-labelledby="stack-title">
        <Reveal className="mb-9 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter skills">
            {SKILL_FILTERS.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => setFilter(option.key)}
                aria-pressed={filter === option.key}
                className={cx("filter-tab", filter === option.key && "is-active")}
              >
                {option.label}
              </button>
            ))}
          </div>
          <span className="micro-label" aria-live="polite">
            {items.length} core {items.length === 1 ? "skill" : "skills"}
          </span>
        </Reveal>

        <div className="project-list" aria-live="polite">
          {items.length === 0 ? (
            <div className="rounded-[18px] border border-dashed border-linestrong p-12 text-center text-[13px] text-muted">
              Nothing here yet — check the full toolbox below.
            </div>
          ) : (
            items.map((skill, index) => (
              <SkillRow key={skill.name} skill={skill} index={index} />
            ))
          )}
        </div>
      </section>

      <Marquee words={["Python", "FastAPI", "LangChain", "RAG", "React", "TypeScript", "Docker"]} />

      {/* ───────────────────  grouped overview  ─────────────────── */}
      <section className="section-pad" aria-labelledby="groups-title">
        <SectionHeading
          kicker="The same stack, grouped"
          title={
            <>
              Four shelves,
              <br />
              <em>one toolbox.</em>
            </>
          }
          description="How the pieces fit together when a project actually starts."
        />

        <div className="grid gap-px border-t border-line md:grid-cols-2">
          {GROUPS.map((group, index) => {
            const groupSkills = SKILLS.filter((skill) => skill.type === group.key);
            return (
              <Reveal
                as="article"
                key={group.key}
                delay={(index % 3) as 0 | 1 | 2}
                className={cx(
                "border-b border-line p-[clamp(20px,2.6vw,32px)] md:border-r",
                index % 2 === 1 && "md:border-r-0"
              )}
              >
                <div className="mb-5 flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-[22px] leading-none uppercase">
                    {group.title}
                  </h3>
                  <span className="micro-label">{groupSkills.length}</span>
                </div>
                <p className="mb-6 text-[13px] leading-relaxed text-muted">{group.blurb}</p>
                <div className="flex flex-wrap gap-1.5">
                  {groupSkills.map((skill) => (
                    <button
                      key={skill.name}
                      type="button"
                      onClick={() => {
                        setFilter(skill.type);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="chip transition-transform duration-300 hover:-translate-y-0.5"
                    >
                      <span
                        className="chip-dot"
                        style={{ ["--dot-color" as string]: skill.color }}
                      />
                      {skill.name}
                    </button>
                  ))}
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ───────────────────  toolbox strip  ─────────────────── */}
      <section className="section-pad border-t border-line" aria-labelledby="toolbox-title">
        <SectionHeading
          kicker="Also in the toolbox"
          title={
            <>
              The rest of
              <br />
              <em>the drawer.</em>
            </>
          }
          description="Not headline skills — but they show up in real projects often enough to matter."
        />

        <Reveal className="flex flex-wrap gap-2.5">
          {TOOLBOX.map((tool) => (
            <span
              key={tool}
              className="chip !py-2.5 !px-4 !text-[13px] transition-transform duration-300 hover:-translate-y-0.5"
            >
              {tool}
            </span>
          ))}
        </Reveal>

        <Reveal delay={1} className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Spoken", value: "Hindi · English" },
            { label: "Editor of choice", value: "VS Code + print()" },
            { label: "Deploy target", value: "HF Spaces · Docker · Vercel" },
          ].map((item) => (
            <div key={item.label} className="rounded-[16px] border border-line bg-surface p-5">
              <span className="micro-label mb-2 block">{item.label}</span>
              <span className="text-[14px]">{item.value}</span>
            </div>
          ))}
        </Reveal>

        <Reveal delay={2} className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-7">
          <p className="text-[12.5px] text-muted">
            Want to see these in actual repositories instead of a list?
          </p>
          <div className="flex flex-wrap gap-3">
            <Magnetic>
              <WipeLink to="/work" className="btn btn-outline btn-sm">
                Browse the work
                <ArrowUpRight aria-hidden="true" />
              </WipeLink>
            </Magnetic>
            <Magnetic>
              <WipeLink to="/lab" className="btn btn-sm">
                See the AI lab
                <ArrowUpRight aria-hidden="true" />
              </WipeLink>
            </Magnetic>
          </div>
        </Reveal>
      </section>

      <ContactBand />
    </>
  );
}

export default Stack;
