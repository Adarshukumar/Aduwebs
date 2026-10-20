import { ArrowUpRight } from "lucide-react";
import { SOCIALS, type Social } from "../../lib/data";
import { cx } from "../../lib/utils";
import { SocialIcon } from "../Icons";
import { Reveal } from "../ui/Reveal";

function IdCard({ social, delay }: { social: Social; delay: 0 | 1 | 2 }) {
  const external = social.url.startsWith("http");

  return (
    <Reveal as="article" delay={delay} className="id-card">
      <div className={cx("id-badge", social.accent && "acid")}>
        <SocialIcon social={social.key} className="h-[21px] w-[21px]" />
      </div>
      <div className="min-w-0">
        <strong className="font-display block text-[19px] leading-tight text-[#f4f1e9]">
          {social.name}
        </strong>
        <span className="font-mono-code mt-1 block truncate text-[11.5px] text-acid">
          {social.handle}
        </span>
        <p className="mt-2.5 text-[12.5px] leading-relaxed text-white/55">{social.line}</p>
        <a
          href={social.url}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          className="text-link mt-3.5 !border-white/25 !text-[#f4f1e9] hover:!border-acid hover:!text-acid"
        >
          {social.cta}
          <ArrowUpRight aria-hidden="true" />
        </a>
      </div>
    </Reveal>
  );
}

interface IdGridProps {
  limit?: number;
  className?: string;
}

/** "One person · every platform" — the ID batch in the shared card style. */
export function IdGrid({ limit, className }: IdGridProps) {
  const items = limit ? SOCIALS.slice(0, limit) : SOCIALS;

  return (
    <div className={cx("grid gap-4 sm:grid-cols-2 xl:grid-cols-3", className)}>
      {items.map((social, index) => (
        <IdCard key={social.key} social={social} delay={(index % 3) as 0 | 1 | 2} />
      ))}
    </div>
  );
}
