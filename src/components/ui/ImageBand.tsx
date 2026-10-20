import type { ReactNode } from "react";

interface ImageBandProps {
  src: string;
  alt: string;
  kicker: string;
  children: ReactNode;
  height?: string;
  align?: "left" | "center";
}

/**
 * Full-bleed editorial photo band. Images render grayscale and colourise
 * on hover — the same treatment the original site gave its avatars.
 */
export function ImageBand({
  src,
  alt,
  kicker,
  children,
  height = "clamp(220px, 30vw, 340px)",
  align = "left",
}: ImageBandProps) {
  return (
    <section className="group relative overflow-hidden border-y border-line" style={{ height }}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="photo-bw absolute inset-0 h-full w-full object-cover"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            align === "center"
              ? "linear-gradient(to top, rgba(8,8,8,0.9), rgba(8,8,8,0.45))"
              : "linear-gradient(to right, rgba(8,8,8,0.9), rgba(8,8,8,0.32))",
        }}
        aria-hidden="true"
      />
      <div
        className={
          align === "center"
            ? "relative flex h-full flex-col items-center justify-center gap-3 px-[clamp(20px,4.4vw,62px)] text-center"
            : "relative flex h-full flex-col justify-center gap-3 px-[clamp(20px,4.4vw,62px)]"
        }
      >
        <p className="kicker !text-acid">{kicker}</p>
        <div className="font-serif-ed max-w-2xl text-[clamp(1.25rem,2.9vw,2.1rem)] leading-tight text-[#f4f1e9]">
          {children}
        </div>
      </div>
    </section>
  );
}
