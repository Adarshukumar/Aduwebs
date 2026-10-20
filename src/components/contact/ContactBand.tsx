import { ArrowUpRight, Copy } from "lucide-react";
import { PROFILE } from "../../lib/data";
import { useToast } from "../../context/ToastContext";
import { Magnetic } from "../ui/Magnetic";
import { Reveal } from "../ui/Reveal";

/** The black "Let's talk. Let's build." finale band. */
export function ContactBand() {
  const { show } = useToast();

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      show("Email copied to clipboard");
    } catch {
      window.location.href = `mailto:${PROFILE.email}`;
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#0b0b0b] px-[clamp(20px,4.4vw,62px)] py-[clamp(56px,8vw,110px)] text-[#f4f1e9]">
      <div
        className="blob pointer-events-none -top-40 -left-24 h-[380px] w-[380px] border border-white/10"
        aria-hidden="true"
      />

      <div className="relative">
        <Reveal className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <span className="kicker !text-white/45">Have a project in mind?</span>
          <span className="kicker !text-white/45">Let's make it useful</span>
        </Reveal>

        <Reveal delay={1}>
          <h2 className="mega-title">
            <span className="block">Let's talk.</span>
            <span className="outline-text-thin block ![-webkit-text-stroke-color:rgba(244,241,233,0.5)] pl-[0.06em]">
              Let's build.
            </span>
          </h2>
        </Reveal>

        <Reveal
          delay={2}
          className="mt-12 grid gap-8 border-t border-white/12 pt-9 md:grid-cols-[1.3fr_auto] md:items-end"
        >
          <p className="max-w-lg text-[13.5px] leading-relaxed text-white/55">
            I'm always happy to meet thoughtful people with ambitious ideas. Reach out at{" "}
            <a
              href={`mailto:${PROFILE.email}`}
              className="border-b border-white/35 text-[#f4f1e9] transition-colors hover:border-acid hover:text-acid"
            >
              {PROFILE.email}
            </a>{" "}
            and tell me what you're working on.
          </p>

          <div className="flex flex-wrap gap-3">
            <Magnetic>
              <a href={`mailto:${PROFILE.email}`} className="btn btn-light">
                Start a conversation
                <ArrowUpRight aria-hidden="true" />
              </a>
            </Magnetic>
            <Magnetic>
              <button type="button" onClick={copyEmail} className="btn btn-ghost-light">
                Copy email
                <Copy aria-hidden="true" />
              </button>
            </Magnetic>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
