import { Github, Instagram, Linkedin, Mail, ArrowUpRight } from "lucide-react";
import { PROFILE } from "../../lib/data";
import { HuggingFaceIcon } from "../Icons";
import { WipeLink } from "../fx/Effects";
import { Magnetic } from "../ui/Magnetic";

const FOOTER_NAV = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Work", to: "/work" },
  { label: "Stack", to: "/stack" },
  { label: "AI Lab", to: "/lab" },
  { label: "Arcade", to: "/arcade" },
  { label: "Contact", to: "/contact" },
];

const SOCIAL_ROW = [
  { label: "Email Adarsh Kumar", href: `mailto:${PROFILE.email}`, Icon: Mail },
  { label: "Adarsh Kumar on LinkedIn", href: "https://www.linkedin.com/in/adarshu07/", Icon: Linkedin },
  { label: "Adarsh Kumar on Instagram", href: "https://www.instagram.com/adarshu.io/", Icon: Instagram },
  { label: "Adarsh Kumar on GitHub", href: "https://github.com/Adarshukumar", Icon: Github },
  { label: "Adarsh Kumar on Hugging Face", href: "https://huggingface.co/AdarshJi", Icon: HuggingFaceIcon },
];

/** The black finale band — morphing blob, mega type, ruled footer row. */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-[#0b0b0b] text-[#f4f1e9]">
      <div
        className="blob pointer-events-none -right-32 -bottom-40 h-[420px] w-[420px] border border-white/12"
        style={{ animationDuration: "9s" }}
        aria-hidden="true"
      />

      <div className="relative px-[clamp(20px,4.4vw,62px)] py-16 md:py-20">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="kicker mb-4 !text-white/45">Around the web</p>
            <h2 className="font-display text-[clamp(1.6rem,3.4vw,2.6rem)] leading-none uppercase">
              One person ·<br />
              <span className="outline-text-thin ![-webkit-text-stroke-color:rgba(244,241,233,0.55)]">
                every platform
              </span>
            </h2>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {SOCIAL_ROW.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="grid h-11 w-11 place-items-center rounded-full border border-white/22 text-[#f4f1e9] transition-all duration-300 hover:-translate-y-1 hover:border-acid hover:bg-acid hover:text-[#172100]"
              >
                <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        <nav
          aria-label="Footer navigation"
          className="mb-12 flex flex-wrap gap-x-7 gap-y-3 border-y border-white/12 py-5"
        >
          {FOOTER_NAV.map((item) => (
            <WipeLink
              key={item.to}
              to={item.to}
              className="text-[12.5px] text-white/60 transition-colors duration-300 hover:text-acid"
            >
              {item.label}
            </WipeLink>
          ))}
        </nav>

        <div className="grid gap-8 md:grid-cols-[1.4fr_auto] md:items-end">
          <div>
            <p className="mb-5 max-w-md text-[13.5px] leading-relaxed text-white/55">
              Have a project in mind? Reach out at{" "}
              <a
                href={`mailto:${PROFILE.email}`}
                className="border-b border-white/35 text-[#f4f1e9] transition-colors hover:border-acid hover:text-acid"
              >
                {PROFILE.email}
              </a>{" "}
              and tell me what you're working on.
            </p>
            <Magnetic>
              <a href={`mailto:${PROFILE.email}`} className="btn btn-acid">
                Start a conversation
                <ArrowUpRight aria-hidden="true" />
              </a>
            </Magnetic>
          </div>

          <div className="flex flex-col gap-1.5 text-[11.5px] text-white/40 md:text-right">
            <span>
              © {year} {PROFILE.name}
            </span>
            <span>Designed &amp; built with intention</span>
            <span className="font-mono-code text-[10.5px] text-acid/70">
              {PROFILE.motto}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
