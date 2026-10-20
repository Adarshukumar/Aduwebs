import { ArrowUpRight, Coffee, GraduationCap, MapPin, Quote, Sparkles, Terminal } from "lucide-react";
import { PageHero, SectionHeading } from "../components/ui/SectionHeading";
import { Reveal } from "../components/ui/Reveal";
import { Magnetic } from "../components/ui/Magnetic";
import { Marquee } from "../components/ui/Marquee";
import { ImageBand } from "../components/ui/ImageBand";
import { IdGrid } from "../components/profiles/IdGrid";
import { ContactBand } from "../components/contact/ContactBand";
import { WipeLink } from "../components/fx/Effects";
import {
  OPEN_FOR,
  PRINCIPLES,
  PROFILE,
  RIGHT_NOW,
  SERVICES,
  TIMELINE,
} from "../lib/data";
import { useGithub } from "../context/GithubContext";
import { useState } from "react";
import { cx } from "../lib/utils";

const FACTS = [
  { icon: MapPin, label: "Based in", value: "Delhi, India 🇮🇳" },
  { icon: GraduationCap, label: "Studied", value: "B.Com (Hons), Dyal Singh College · University of Delhi" },
  { icon: Terminal, label: "Debugging with", value: "print() — zero regrets" },
  { icon: Coffee, label: "Coffee level", value: "☕☕☕ always" },
];

const ADARSH_PY = `#!/usr/bin/env python3
# ─────────────────────────────────────────────────────────
#   Adarsh Kumar · AI Developer & ML Engineer · India 🇮🇳
# ─────────────────────────────────────────────────────────

class AdarshKumar:

    def __init__(self):
        self.name       = "Adarsh Kumar"
        self.handle     = "@Adarshukumar"
        self.role       = "AI Developer & ML Engineer"
        self.location   = "Delhi, India 🇮🇳"
        self.languages  = ["Python 🐍", "C++ ⚙️", "JavaScript 🌐", "C"]
        self.ai_stack   = ["LangChain 🔗", "HuggingFace 🤗", "OpenAI 🤖", "Gemini ✨"]
        self.frameworks = ["FastAPI ⚡", "Flask 🌶️", "TensorFlow 🔥", "PyTorch 💥"]
        self.databases  = ["Firebase 🔥", "MySQL 🐬", "MongoDB 🍃", "SQLite 📦"]
        self.hobbies    = ["🤖 AI Research", "🎮 Game Dev", "📖 Learning", "🌍 Open Source"]
        self.fun_fact   = "I debug with print() — no regrets 🛠️"
        self.motto      = "Build fast. Break things. Learn faster. 🚀"

    def say_hi(self) -> str:
        return "\\n".join([
            "Hey there! 👋  I'm Adarsh.",
            "I turn data + ideas into intelligent AI systems.",
            "Let's build something incredible together! 🚀",
        ])

    def available_for(self) -> list:
        return [
            "AI / ML Projects      🤖",
            "Open Source Collab    🌍",
            "Freelance AI Dev      💼",
            "Research Partnerships 🧪",
        ]

me = AdarshKumar()
print(me.say_hi())`;

function highlight(line: string) {
  if (line.trimStart().startsWith("#")) return <span className="tok-com">{line}</span>;
  const parts = line.split(/(\b(?:class|def|return|self|import|from|print|str|list|None|True|False)\b|"[^"]*")/g);
  return parts.map((part, index) => {
    if (/^(class|def|return|import|from)$/.test(part)) return <span key={index} className="tok-key">{part}</span>;
    if (/^(self|str|list|None|True|False|print)$/.test(part)) return <span key={index} className="tok-fn">{part}</span>;
    if (part.startsWith('"')) return <span key={index} className="tok-str">{part}</span>;
    return <span key={index}>{part}</span>;
  });
}

export function About() {
  const { data } = useGithub();
  const [avatarFailed, setAvatarFailed] = useState(false);
  const avatar = avatarFailed ? null : `${data.profile.avatar_url}?s=800`;

  return (
    <>
      <PageHero
        kicker="About / 002"
        title="Commerce by day,"
        outline="code by night."
        description="I'm Adarsh — a freelance developer from Delhi who's probably debugging something right now. This is the longer version: where I came from, what I'm building, and how I like to work."
        meta={
          <>
            <span className="chip">
              <span className="chip-dot" style={{ ["--dot-color" as string]: "#35d07f" }} />
              {PROFILE.availability}
            </span>
            <span className="chip">Freelancing since {PROFILE.freelancingSince}</span>
            <span className="chip">{PROFILE.location}</span>
          </>
        }
      />

      {/* ─────────────────────  the story  ───────────────────── */}
      <section className="section-pad" aria-labelledby="story-title">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <Reveal className="group relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[18px] border border-line bg-[#0d0d0d]">
              {avatar ? (
                <img
                  src={avatar}
                  alt={PROFILE.name}
                  onError={() => setAvatarFailed(true)}
                  className="photo-bw h-full w-full object-cover"
                />
              ) : (
                <div className="dot-grid grid h-full w-full place-items-center">
                  <span className="font-display text-[6rem] text-acid" aria-hidden="true">
                    AK
                  </span>
                </div>
              )}
              <div
                className="absolute inset-x-0 bottom-0 h-1/2"
                style={{ background: "linear-gradient(to top, rgba(8,8,8,0.9), transparent)" }}
                aria-hidden="true"
              />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4">
                <div>
                  <span className="micro-label block !text-white/55">{PROFILE.role}</span>
                  <span className="font-display block text-xl text-[#f4f1e9] uppercase">
                    {PROFILE.name}
                  </span>
                </div>
                <span className="micro-label !text-acid">Delhi 🇮🇳</span>
              </div>
            </div>
          </Reveal>

          <div className="flex flex-col gap-7">
            <Reveal>
              <p className="font-serif-ed text-[clamp(1.5rem,3.2vw,2.4rem)] leading-[1.2]">
                {PROFILE.aboutLead.split("simple enough to use")[0]}
                <em className="italic">simple enough to use</em>
                {PROFILE.aboutLead.split("simple enough to use")[1]}
              </p>
            </Reveal>

            <Reveal delay={1}>
              <p className="text-[14px] leading-[1.8] text-muted">{PROFILE.bio}</p>
            </Reveal>

            <Reveal delay={2} className="grid gap-px border-t border-line sm:grid-cols-2">
              {FACTS.map(({ icon: Icon, label, value }) => (
                <div key={label} className="border-b border-line py-5 sm:pr-5">
                  <span className="micro-label mb-2.5 flex items-center gap-2">
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                    {label}
                  </span>
                  <span className="text-[13.5px] leading-snug text-ink">{value}</span>
                </div>
              ))}
            </Reveal>

            <Reveal delay={3}>
              <blockquote className="relative rounded-[16px] border border-line bg-surface p-6">
                <Quote
                  className="absolute -top-3 left-5 h-6 w-6 rounded-full p-1"
                  style={{ background: "var(--acid)", color: "var(--acid-ink)" }}
                  aria-hidden="true"
                />
                <p className="font-serif-ed text-[20px] leading-snug italic">
                  "{PROFILE.motto}"
                </p>
                <footer className="micro-label mt-3">— the working motto</footer>
              </blockquote>
            </Reveal>
          </div>
        </div>
      </section>

      <Marquee words={["AI Research", "Game Dev", "Learning", "Open Source", "RAG", "Agents"]} />

      <ImageBand
        src="/img/desk.jpg"
        alt="A laptop showing code on a desk at night"
        kicker="The setup"
      >
        Most of this was written after midnight — <em className="italic">commerce by day, code by night</em>{" "}
        is not a slogan, it's the actual schedule.
      </ImageBand>

      {/* ─────────────────────  right now  ───────────────────── */}
      <section className="section-pad" aria-labelledby="now-title">
        <SectionHeading
          kicker="Right now"
          title={
            <>
              What I'm
              <br />
              <em>building.</em>
            </>
          }
          description="Four things currently taking up most of the free hours — plus what I'm open to."
        />

        <div className="grid gap-5 md:grid-cols-2">
          <Reveal className="rounded-[18px] border border-line bg-surface p-[clamp(20px,2.6vw,30px)]">
            <span className="micro-label mb-5 block">Currently</span>
            <ul className="flex flex-col gap-4">
              {RIGHT_NOW.map((item) => (
                <li key={item.text} className="flex items-start gap-3 text-[14px]">
                  <span aria-hidden="true">{item.emoji}</span>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={1} className="rounded-[18px] border border-line bg-surface p-[clamp(20px,2.6vw,30px)]">
            <span className="micro-label mb-5 block">Open for</span>
            <ul className="flex flex-col gap-4">
              {OPEN_FOR.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[14px]">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-acid" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Magnetic className="mt-6">
              <WipeLink to="/contact" className="btn btn-sm">
                Start a project
                <ArrowUpRight aria-hidden="true" />
              </WipeLink>
            </Magnetic>
          </Reveal>
        </div>
      </section>

      {/* ─────────────────────  timeline  ───────────────────── */}
      <section className="section-pad border-t border-line" aria-labelledby="journey-title">
        <SectionHeading
          kicker="The journey so far"
          title={
            <>
              From C pointers
              <br />
              <em>to AI agents.</em>
            </>
          }
          description="Newest first. None of it was linear — that turned out to be the point."
        />

        <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:gap-16">
          <Reveal>
            <ol className="ml-1">
              {TIMELINE.map((item) => (
                <li key={item.title} className="timeline-item">
                  <span className="micro-label mb-2 block">{item.tag}</span>
                  <h3 className="font-display text-[20px] leading-tight uppercase">{item.title}</h3>
                  <p className="mt-2 max-w-lg text-[13px] leading-relaxed text-muted">{item.desc}</p>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal delay={1}>
            <div className="code-card">
              <div className="mb-4 flex items-center gap-2 border-b border-white/10 pb-3">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" aria-hidden="true" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" aria-hidden="true" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" aria-hidden="true" />
                <span className="ml-2 text-[11px] text-[#6b6862]">adarsh.py</span>
              </div>
              <pre className="whitespace-pre">
                <code>
                  {ADARSH_PY.split("\n").map((line, index) => (
                    <span key={index} className="block">
                      {highlight(line)}
                    </span>
                  ))}
                </code>
              </pre>
            </div>
            <p className="mt-4 flex items-center gap-2 text-[12px] text-muted">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Straight out of the GitHub profile README — the bio as executable code.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ─────────────────────  principles  ───────────────────── */}
      <section className="section-pad border-t border-line" aria-labelledby="principles-title">
        <SectionHeading
          kicker="How I work"
          title={
            <>
              Four things
              <br />
              <em>I keep coming back to.</em>
            </>
          }
        />

        <div className="grid border-t border-line md:grid-cols-2">
          {PRINCIPLES.map((principle, index) => (
            <Reveal
              as="article"
              key={principle.title}
              delay={(index % 3) as 0 | 1 | 2}
              className={cx(
                "wipe-card border-b border-line md:border-r",
                index % 2 === 1 && "md:border-r-0"
              )}
            >
              <span className="micro-label mb-5 block">
                {String(index + 1).padStart(2, "0")} / Principle
              </span>
              <h3 className="font-display mb-3 text-[21px] leading-tight uppercase">
                {principle.title}
              </h3>
              <p className="wipe-muted text-[13px] leading-relaxed text-muted">{principle.desc}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ─────────────────────  services  ───────────────────── */}
      <section className="section-pad border-t border-line" aria-labelledby="services-title">
        <SectionHeading
          kicker="What I can do for you"
          title={
            <>
              Three ways
              <br />
              <em>we could work.</em>
            </>
          }
          description="Rewritten from the real LinkedIn profile — the services actually on offer, not a wishlist."
        />

        <div className="grid gap-5 lg:grid-cols-3">
          {SERVICES.map((service, index) => (
            <Reveal
              as="article"
              key={service.title}
              delay={(index % 3) as 0 | 1 | 2}
              className="flex flex-col rounded-[18px] border border-line bg-surface p-[clamp(20px,2.4vw,28px)] transition-transform duration-500 hover:-translate-y-1.5"
            >
              <span className="micro-label mb-4 block">
                {String(index + 1).padStart(2, "0")} / Service
              </span>
              <h3 className="font-display mb-3 text-[22px] leading-tight uppercase">
                {service.title}
              </h3>
              <p className="text-[13px] leading-relaxed text-muted">{service.desc}</p>
              <ul className="mt-5 flex flex-col gap-2 border-t border-line pt-5">
                {service.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-center gap-2.5 text-[12.5px]">
                    <span className="h-1.5 w-1.5 flex-none rounded-full bg-acid" aria-hidden="true" />
                    {bullet}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ─────────────────────  profiles  ───────────────────── */}
      <section
        className="relative overflow-hidden bg-[#0b0b0b] px-[clamp(20px,4.4vw,62px)] py-[clamp(56px,8vw,110px)] text-[#f4f1e9]"
        aria-labelledby="all-profiles-title"
      >
        <div
          className="blob blob-float pointer-events-none -bottom-32 -left-24 h-[380px] w-[380px] border border-white/10"
          aria-hidden="true"
        />
        <div className="relative">
          <SectionHeading
            dark
            kicker="Everywhere else"
            title={
              <>
                One person,
                <br />
                <span className="outline-text-thin ![-webkit-text-stroke-color:rgba(244,241,233,0.5)]">
                  eleven doors.
                </span>
              </>
            }
            description="All eleven places I actually show up — from the profile README's full connect list."
          />
          <IdGrid />
        </div>
      </section>

      <ContactBand />
    </>
  );
}

export default About;
