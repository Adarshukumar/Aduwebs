import { useEffect, useRef } from "react";
import { ArrowRight, ArrowUpRight, MapPin } from "lucide-react";
import { HERO_STATS, PROFILE } from "../../lib/data";
import { useGithub } from "../../context/GithubContext";
import { animate, motionAllowed } from "../../lib/motion";
import { Magnetic } from "../ui/Magnetic";
import { Parallax } from "../ui/Parallax";
import { PortraitFrame } from "../profile/AvatarPortrait";
import { WipeLink } from "../fx/Effects";
import { Typewriter } from "../ui/Typewriter";

/**
 * The hero: availability row, giant pixel name, statement, two magnetic CTAs,
 * the treated portrait and the ruled stat strip. The name reveals line-by-line
 * through a mask the moment the loader lifts; the numbers count themselves up
 * on first paint.
 */
export function Hero() {
  const { data } = useGithub();
  const statRef = useRef<HTMLDivElement>(null);
  const avatar = data.profile.avatar_url
    ? `${data.profile.avatar_url}?s=640`
    : PROFILE.avatar;

  useEffect(() => {
    const root = statRef.current;
    if (!root || !motionAllowed()) return;

    const counters = Array.from(root.querySelectorAll<HTMLElement>("[data-count]"));

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        observer.disconnect();

        counters.forEach((node) => {
          const target = Number(node.dataset.count ?? 0);
          const suffix = node.dataset.suffix ?? "";
          const proxy = { value: 0 };
          animate(proxy, {
            value: target,
            duration: 1400,
            ease: "outExpo",
            onUpdate: () => {
              node.textContent = String(Math.round(proxy.value)) + suffix;
            },
          });
        });
      },
      { threshold: 0.4 }
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative overflow-hidden px-[clamp(20px,4.4vw,62px)] pt-10 pb-0 md:pt-14">
      <Parallax depth={34} className="pointer-events-none absolute inset-y-0 right-0 w-[52%]">
        <div className="dot-grid h-full w-full opacity-80" aria-hidden="true" />
      </Parallax>

      {/* meta row */}
      <div className="hero-fade relative mb-10 flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-b border-line pb-5">
        <div className="flex items-center gap-2.5">
          <span className="pulse-dot" aria-hidden="true" />
          <span className="micro-label availability-label whitespace-nowrap">{PROFILE.availability}</span>
        </div>
        <div className="micro-label">{PROFILE.role}</div>
        <div className="micro-label flex items-center gap-1.5">
          <MapPin className="h-3 w-3" aria-hidden="true" />
          {PROFILE.locationLine}
        </div>
      </div>

      <div className="relative grid gap-10 lg:grid-cols-[1.42fr_0.72fr] lg:gap-16">
        <div>
          <p className="hero-fade kicker mb-5">
            <span className="text-muted">Hello — I'm {PROFILE.name} · </span>
            <Typewriter
              className="!text-ink"
              lines={[
                PROFILE.role,
                PROFILE.roleAlt,
                "AI tools · websites · motion",
                "Delhi → anywhere",
              ]}
            />
          </p>

          <h1 className="hero-title" aria-label={PROFILE.name}>
            <span className="line-mask">
              <span className="font-display text-[clamp(3.6rem,11.4vw,10.4rem)] leading-[0.84] uppercase">
                {PROFILE.firstName}
              </span>
            </span>
            <span className="line-mask pl-[0.1em]">
              <span className="outline-text font-display text-[clamp(3.6rem,11.4vw,10.4rem)] leading-[0.84] uppercase">
                {PROFILE.lastName}
              </span>
            </span>
          </h1>

          <div className="hero-fade mt-10 grid gap-8 md:grid-cols-[1.25fr_auto] md:items-end">
            <p className="max-w-xl text-[15px] leading-relaxed text-muted">
              {PROFILE.statement.split("clear, useful products")[0]}
              <strong className="font-semibold text-ink underline decoration-acid decoration-2 underline-offset-4">
                clear, useful products
              </strong>
              {PROFILE.statement.split("clear, useful products")[1]}
            </p>

            <div className="flex flex-wrap gap-3">
              <Magnetic>
                <WipeLink to="/stack" className="btn">
                  Explore my skills
                  <ArrowRight aria-hidden="true" />
                </WipeLink>
              </Magnetic>
              <Magnetic>
                <a
                  href="https://www.linkedin.com/in/adarshu07/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                >
                  LinkedIn profile
                  <ArrowUpRight aria-hidden="true" />
                </a>
              </Magnetic>
            </div>
          </div>
        </div>

        {/* portrait */}
        <div className="hero-fade hero-portrait-wrap relative hidden lg:block">
          <PortraitFrame
            src={avatar}
            alt={PROFILE.name}
            variant="hero"
            label="Profile / 001"
            badge="Open to ideas"
          >
            <div className="micro-label mb-2 !text-white/60">Web · Video · AI Projects</div>
            <h2 className="font-display text-[clamp(1.6rem,2.2vw,2.1rem)] leading-none text-[#f4f1e9] uppercase">
              {PROFILE.name}
            </h2>
            <div className="my-3 h-px w-full bg-white/20" />
            <div className="flex items-center justify-between gap-3">
              <span className="micro-label !text-white/55">Freelance developer</span>
              <span className="micro-label !text-white/55">{PROFILE.location}</span>
            </div>
          </PortraitFrame>
        </div>
      </div>

      {/* portrait on small screens — the same module, cropped tighter */}
      <div className="hero-fade mt-10 lg:hidden">
        <PortraitFrame src={avatar} alt={PROFILE.name} variant="story" label="Profile / 001" badge={PROFILE.availability}>
          <div className="flex items-end justify-between gap-3">
            <div>
              <span className="micro-label block !text-white/55">{PROFILE.role}</span>
              <span className="font-display block text-lg text-[#f4f1e9] uppercase">{PROFILE.name}</span>
            </div>
            <span className="micro-label !text-acid">{PROFILE.location}</span>
          </div>
        </PortraitFrame>
      </div>

      {/* stat strip */}
      <div
        ref={statRef}
        className="hero-fade relative mt-14 grid grid-cols-2 divide-x divide-y divide-line border-t border-line sm:grid-cols-4 sm:divide-y-0"
      >
        {HERO_STATS.map((stat, index) => {
          const numeric = /^(\d+)(.*)$/.exec(stat.value);
          const animateNumber = numeric && index < 2;
          return (
            <div key={stat.label} className="px-4 py-7 first:pl-0">
              <span className="font-display block text-[clamp(1.7rem,3.4vw,2.6rem)] leading-none">
                {animateNumber ? (
                  <span data-count={numeric[1]} data-suffix={numeric[2]}>
                    {`0${numeric[2]}`}
                  </span>
                ) : (
                  stat.value
                )}
              </span>
              <span className="micro-label mt-2.5 block">{stat.label}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
