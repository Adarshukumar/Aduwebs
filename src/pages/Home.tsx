import { ArrowUpRight, Lightbulb, Camera, Code2, Gamepad2 } from "lucide-react";
import { Hero } from "../components/home/Hero";
import { Marquee } from "../components/ui/Marquee";
import { Reveal } from "../components/ui/Reveal";
import { SectionHeading } from "../components/ui/SectionHeading";
import { Magnetic } from "../components/ui/Magnetic";
import { Poster } from "../components/ui/Poster";
import { SkillRow } from "../components/skills/SkillRow";
import { GithubProfileCard } from "../components/profiles/GithubProfileCard";
import { IdGrid } from "../components/profiles/IdGrid";
import { MemoryGame } from "../components/arcade/MemoryGame";
import { ContactBand } from "../components/contact/ContactBand";
import { WipeLink } from "../components/fx/Effects";
import { PROCESS, PROFILE, SERVICES, SKILLS } from "../lib/data";
import { cx, gradientFor } from "../lib/utils";

const SERVICE_ICONS = { code: Code2, bulb: Lightbulb, camera: Camera } as const;

export function Home() {
  return (
    <>
      <Hero />
      <Marquee />

      {/* ─────────────────────────  about  ───────────────────────── */}
      <section className="section-pad" id="about" aria-labelledby="about-title">
        <SectionHeading
          kicker="A little about me"
          title={
            <>
              Product thinking,
              <br />
              <em>made tangible.</em>
            </>
          }
          description="Commerce by day, code by night. I learn fastest on real problems — building real things, for real people."
        />

        <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:gap-14">
          <Reveal>
            <p className="font-serif-ed text-[clamp(1.5rem,3.4vw,2.6rem)] leading-[1.18]">
              I care about the moment a messy idea becomes{" "}
              <em className="italic">simple enough to use</em> — and strong enough to scale.
            </p>
          </Reveal>

          <Reveal delay={1}>
            <p className="text-[14px] leading-[1.75] text-muted">{PROFILE.bio}</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a
                href="https://www.linkedin.com/in/adarshu07/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-link"
              >
                More on LinkedIn
                <ArrowUpRight aria-hidden="true" />
              </a>
              <WipeLink to="/about" className="text-link">
                The full story
                <ArrowUpRight aria-hidden="true" />
              </WipeLink>
            </div>
          </Reveal>
        </div>

        <div className="mt-14 grid border-t border-line md:grid-cols-3">
          {SERVICES.map((service, index) => {
            const Icon = SERVICE_ICONS[service.icon];
            return (
              <Reveal
                as="article"
                key={service.title}
                delay={(index % 3) as 0 | 1 | 2}
                className="wipe-card border-b border-line md:border-r md:last:border-r-0"
              >
                <div className="icon-disc mb-6">
                  <Icon aria-hidden="true" />
                </div>
                <h3 className="font-display mb-3 text-[22px] leading-tight uppercase">
                  {service.title}
                </h3>
                <p className="wipe-muted text-[13px] leading-relaxed text-muted">{service.desc}</p>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ─────────────────────────  skills  ───────────────────────── */}
      <section className="section-pad border-t border-line" id="skills" aria-labelledby="skills-title">
        <SectionHeading
          kicker="Stack I actually use"
          title={
            <>
              Code I speak,
              <br />
              <em>tools I trust.</em>
            </>
          }
          description="No tutorial trophies — this is the working stack behind client projects, 15+ live AI tools, and this very website."
        />

        <div className="project-list">
          {SKILLS.slice(0, 4).map((skill, index) => (
            <SkillRow key={skill.name} skill={skill} index={index} showLevel={false} />
          ))}
        </div>

        <Reveal className="mt-10 flex flex-wrap items-center justify-between gap-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="micro-label mr-1">Also in the toolbox</span>
            {["Docker", "MongoDB", "Firebase", "Flask", "Git", "WordPress", "HF Spaces"].map(
              (tool) => (
                <span key={tool} className="chip">
                  {tool}
                </span>
              )
            )}
          </div>
          <Magnetic>
            <WipeLink to="/stack" className="btn btn-outline btn-sm">
              See the full stack
              <ArrowUpRight aria-hidden="true" />
            </WipeLink>
          </Magnetic>
        </Reveal>
      </section>

      {/* ────────────────────────  work teaser  ────────────────────── */}
      <section className="section-pad border-t border-line" aria-labelledby="work-teaser-title">
        <SectionHeading
          kicker="Selected work"
          title={
            <>
              Things made
              <br />
              <em>in the open.</em>
            </>
          }
          description="Client builds, AI tools and open-source experiments — every one of them live somewhere you can click."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "48-Model Router",
              top: "AI · Backend",
              bottom: "FastAPI + SSE",
              tag: "LLM",
              to: "/work",
            },
            {
              title: "15+ HF Spaces",
              top: "AI · Tools",
              bottom: "Live on HuggingFace",
              tag: "SPACES",
              to: "/lab",
            },
            {
              title: "Client Websites",
              top: "Web · Freelance",
              bottom: "Since Jan 2024",
              tag: "WEB",
              to: "/work",
            },
          ].map((item, index) => (
            <Reveal key={item.title} delay={(index % 3) as 0 | 1 | 2} className="group">
              <WipeLink to={item.to} className="block">
                <Poster
                  title={item.title}
                  top={item.top}
                  index={String(index + 1).padStart(2, "0")}
                  bottomLeft={item.bottom}
                  tag={item.tag}
                  gradient={gradientFor(index)}
                  className="poster-wide"
                />
              </WipeLink>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-9 flex justify-center">
          <Magnetic>
            <WipeLink to="/work" className="btn">
              Browse all the work
              <ArrowUpRight aria-hidden="true" />
            </WipeLink>
          </Magnetic>
        </Reveal>
      </section>

      {/* ────────────────────────  profiles  ──────────────────────── */}
      <section
        className="relative overflow-hidden bg-[#0b0b0b] px-[clamp(20px,4.4vw,62px)] py-[clamp(56px,8vw,110px)] text-[#f4f1e9]"
        id="profiles"
        aria-labelledby="profiles-title"
      >
        <div
          className="blob pointer-events-none -top-28 -right-20 h-[340px] w-[340px] opacity-70"
          style={{ background: "var(--acid)" }}
          aria-hidden="true"
        />
        <div
          className="blob blob-float pointer-events-none -right-32 top-10 h-[420px] w-[420px] border border-white/12"
          aria-hidden="true"
        />

        <div className="relative">
          <SectionHeading
            dark
            kicker="Profiles / Around the web"
            title={
              <>
                Open source,
                <br />
                <span className="outline-text-thin ![-webkit-text-stroke-color:rgba(244,241,233,0.5)]">
                  in the open.
                </span>
              </>
            }
            description="Code is part of the conversation, not the final word. The GitHub card below re-syncs live from the public API — everything else is one door per platform."
          />

          <GithubProfileCard />

          <Reveal className="mt-14 mb-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/12 pt-8">
            <span className="kicker !text-white/45">One person · every platform</span>
            <span className="kicker !text-white/45">Pick a door</span>
          </Reveal>

          <IdGrid limit={6} />

          <Reveal className="mt-9 flex justify-center">
            <Magnetic>
              <WipeLink to="/about" className="btn btn-ghost-light">
                Every profile &amp; the full story
                <ArrowUpRight aria-hidden="true" />
              </WipeLink>
            </Magnetic>
          </Reveal>
        </div>
      </section>

      {/* ────────────────────────  process  ───────────────────────── */}
      <section className="section-pad" id="process" aria-labelledby="process-title">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal>
            <h2 className="font-display text-[clamp(2.4rem,6.4vw,5rem)] leading-[0.9] uppercase">
              A useful
              <br />
              <span className="outline-text">method.</span>
            </h2>
            <p className="mt-6 max-w-md text-[13.5px] leading-relaxed text-muted">
              The process changes with the problem, but the principles stay consistent: understand
              the context, make the idea tangible, test the risky part first, and refine only what
              creates value.
            </p>
          </Reveal>

          <div className="grid gap-px sm:grid-cols-2">
            {PROCESS.map((step, index) => (
              <Reveal
                as="article"
                key={step.step}
                delay={(index % 3) as 0 | 1 | 2}
                className={cx(
                  "group border-t border-line pt-6 sm:pr-6 sm:border-r",
                  index % 2 === 1 && "sm:border-r-0"
                )}
              >
                <span className="micro-label block">{step.step}</span>
                <h3 className="font-display mt-5 mb-3 text-[20px] leading-tight uppercase transition-colors duration-300 group-hover:text-[#4b58ff]">
                  {step.title}
                </h3>
                <p className="text-[13px] leading-relaxed text-muted">{step.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────  arcade  ────────────────────────── */}
      <section
        className="section-pad border-t border-line"
        id="arcade"
        aria-labelledby="arcade-title"
      >
        <SectionHeading
          kicker="A tiny interaction"
          title={
            <>
              Play the
              <br />
              <em>memory game.</em>
            </>
          }
          description="A small reminder that useful digital work can be simple, playful, and satisfying. Three boards, one best-score per board."
        />

        <Reveal>
          <MemoryGame />
        </Reveal>

        <Reveal className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <span className="text-[12.5px] text-muted">
            Full arcade with difficulty notes and a second game →
          </span>
          <Magnetic>
            <WipeLink to="/arcade" className="btn btn-outline btn-sm">
              Open the arcade
              <Gamepad2 aria-hidden="true" />
            </WipeLink>
          </Magnetic>
        </Reveal>
      </section>

      <ContactBand />
    </>
  );
}

export default Home;
