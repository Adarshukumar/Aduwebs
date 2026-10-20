import { useState } from "react";
import { ArrowRight, ArrowUpRight, MapPin } from "lucide-react";
import { HERO_STATS, PROFILE } from "../../lib/data";
import { useGithub } from "../../context/GithubContext";
import { Magnetic } from "../ui/Magnetic";
import { WipeLink } from "../fx/Effects";

/**
 * The hero: availability row, giant pixel name (solid + outlined line),
 * statement, two magnetic CTAs, the tall portrait card and the ruled stat strip.
 */
export function Hero() {
  const { data } = useGithub();
  const [avatarFailed, setAvatarFailed] = useState(false);
  const avatar = avatarFailed ? null : `${data.profile.avatar_url}?s=600`;

  return (
    <section className="relative overflow-hidden px-[clamp(20px,4.4vw,62px)] pt-10 pb-0 md:pt-14">
      <div
        className="dot-grid pointer-events-none absolute inset-y-0 right-0 w-[52%] opacity-80"
        aria-hidden="true"
      />

      {/* meta row */}
      <div className="hero-fade relative mb-10 flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-b border-line pb-5">
        <div className="flex items-center gap-2.5">
          <span className="pulse-dot" aria-hidden="true" />
          <span className="micro-label !text-ink whitespace-nowrap">
            {PROFILE.availability}
          </span>
        </div>
        <div className="micro-label">{PROFILE.role}</div>
        <div className="micro-label flex items-center gap-1.5">
          <MapPin className="h-3 w-3" aria-hidden="true" />
          {PROFILE.locationLine}
        </div>
      </div>

      <div className="relative grid gap-10 lg:grid-cols-[1.55fr_0.55fr] lg:gap-14">
        <div>
          <p className="hero-fade kicker mb-5">Hello — I'm {PROFILE.name}</p>

          <h1
            className="font-display text-[clamp(4rem,12.2vw,11rem)] leading-[0.82] uppercase"
            aria-label={PROFILE.name}
          >
            <span className="hero-line">{PROFILE.firstName}</span>
            <span className="hero-line outline-text pl-[0.14em]">{PROFILE.lastName}</span>
          </h1>

          <div className="hero-fade mt-10 grid gap-8 md:grid-cols-[1.25fr_auto] md:items-end">
            <p className="max-w-xl text-[15px] leading-relaxed text-muted">
              I turn complex ideas into{" "}
              <strong className="font-semibold text-ink underline decoration-acid decoration-2 underline-offset-4">
                clear, useful products
              </strong>
              —combining thoughtful design, resilient systems, and expressive code.
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

        {/* portrait card */}
        <aside
          className="hero-fade group relative hidden min-h-[440px] overflow-hidden rounded-[18px] border border-line bg-[#0d0d0d] lg:block"
          aria-label="Profile overview"
        >
          {avatar ? (
            <img
              src={avatar}
              alt={PROFILE.name}
              onError={() => setAvatarFailed(true)}
              className="photo-bw absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="dot-grid absolute inset-0 grid place-items-center">
              <span
                className="font-display text-[7rem] leading-none"
                style={{ color: "var(--acid)" }}
                aria-hidden="true"
              >
                AK
              </span>
            </div>
          )}

          <div
            className="absolute inset-x-0 bottom-0 h-2/3"
            style={{ background: "linear-gradient(to top, rgba(8,8,8,0.94), transparent)" }}
            aria-hidden="true"
          />

          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
            <span className="micro-label !text-white/70">Profile / 001</span>
            <span className="micro-label !text-acid">Open to ideas</span>
          </div>

          <div className="absolute inset-x-0 bottom-0 p-5">
            <div className="micro-label mb-2 !text-white/60">Web · Video · AI Projects</div>
            <h2 className="font-display text-[clamp(1.6rem,2.4vw,2.2rem)] leading-none text-[#f4f1e9] uppercase">
              {PROFILE.name}
            </h2>
            <div className="my-3 h-px w-full bg-white/20" />
            <div className="flex items-center justify-between gap-3">
              <span className="micro-label !text-white/55">Freelance developer</span>
              <span className="micro-label !text-white/55">{PROFILE.location}</span>
            </div>
          </div>
        </aside>
      </div>

      {/* stat strip */}
      <div className="hero-fade relative mt-14 grid grid-cols-2 divide-x divide-y divide-line border-t border-line sm:grid-cols-4 sm:divide-y-0">
        {HERO_STATS.map((stat) => (
          <div key={stat.label} className="px-4 py-7 first:pl-0">
            <span className="font-display block text-[clamp(1.7rem,3.4vw,2.6rem)] leading-none">
              {stat.value}
            </span>
            <span className="micro-label mt-2.5 block">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
