import { useState } from "react";
import { ArrowUpRight, Github, RefreshCw } from "lucide-react";
import { useGithub } from "../../context/GithubContext";
import { useToast } from "../../context/ToastContext";
import { PROFILE } from "../../lib/data";
import { cx, formatNumber } from "../../lib/utils";
import { Reveal } from "../ui/Reveal";

/**
 * The live-synced GitHub card from the original Profiles section —
 * avatar, name, handle, bio, four ruled stats and a manual re-sync bar.
 */
export function GithubProfileCard() {
  const { data, status, syncing, resync } = useGithub();
  const { show } = useToast();
  const [avatarFailed, setAvatarFailed] = useState(false);

  const { profile, totalStars } = data;
  const avatarUrl = avatarFailed ? null : `${profile.avatar_url}${profile.avatar_url.includes("?") ? "&" : "?"}s=400`;

  const stats = [
    { value: formatNumber(profile.public_repos), label: "Repositories" },
    { value: formatNumber(profile.followers), label: "Followers" },
    { value: formatNumber(profile.following), label: "Following" },
    { value: formatNumber(totalStars), label: "Total stars" },
  ];

  const handleSync = async () => {
    await resync();
    show("GitHub profile re-synced");
  };

  return (
    <div className="flex flex-col gap-5">
      <Reveal className="relative overflow-hidden rounded-[20px] border border-white/12 bg-white/[0.045] p-[clamp(20px,2.6vw,30px)] backdrop-blur-[8px]">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="relative h-[104px] w-[104px] flex-none">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={`${profile.name}'s GitHub profile`}
                onError={() => setAvatarFailed(true)}
                className="photo-bw h-full w-full rounded-full border border-white/20 object-cover"
              />
            ) : (
              <div
                className="grid h-full w-full place-items-center rounded-full border border-white/20"
                style={{ background: "var(--acid)", color: "var(--acid-ink)" }}
                aria-hidden="true"
              >
                <span className="font-display text-3xl">AK</span>
              </div>
            )}
          </div>

          <div className="min-w-0">
            <strong className="font-display block text-[clamp(1.5rem,3vw,2.1rem)] leading-none text-[#f4f1e9]">
              {profile.name || PROFILE.name}
            </strong>
            <span className="font-mono-code mt-2 block text-[12px] text-acid">
              @{profile.login || PROFILE.githubUser}
            </span>
            <p className="mt-3 max-w-xl text-[13px] leading-relaxed text-white/60">
              {profile.bio ||
                "Product designer & developer building in the open — AI tools, backends and websites that actually work."}
            </p>
            {profile.company ? (
              <p className="mt-2 text-[11.5px] tracking-[0.1em] text-white/35 uppercase">
                {profile.company}
              </p>
            ) : null}
            <a
              href={profile.html_url || "https://github.com/Adarshukumar"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-link mt-4 !border-white/30 !text-[#f4f1e9] hover:!border-acid hover:!text-acid"
            >
              View full profile
              <ArrowUpRight aria-hidden="true" />
            </a>
          </div>
        </div>
      </Reveal>

      <Reveal
        delay={1}
        className="grid grid-cols-2 divide-x divide-y divide-white/10 overflow-hidden rounded-[18px] border border-white/12 bg-white/[0.03] sm:grid-cols-4 sm:divide-y-0"
      >
        {stats.map((stat) => (
          <div key={stat.label} className="px-4 py-5 text-center">
            <strong className="font-display block text-[clamp(1.4rem,2.6vw,2rem)] leading-none text-[#f4f1e9] tabular-nums">
              {stat.value}
            </strong>
            <span className="micro-label mt-2 block !text-white/40">{stat.label}</span>
          </div>
        ))}
      </Reveal>

      <Reveal
        delay={2}
        className="flex flex-wrap items-center justify-between gap-3 rounded-full border border-white/12 bg-white/[0.03] px-5 py-3"
      >
        <span className="flex items-center gap-2.5 text-[11.5px] text-white/50">
          <Github className="h-3.5 w-3.5" aria-hidden="true" />
          {status === "loading"
            ? "Contacting the GitHub API…"
            : data.live
              ? `Live from api.github.com · ${new Date(data.syncedAt).toLocaleTimeString("en", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}`
              : "Showing cached profile — GitHub API unavailable"}
        </span>
        <button
          type="button"
          onClick={handleSync}
          disabled={syncing}
          className={cx(
            "btn btn-ghost-light btn-sm",
            syncing && "pointer-events-none opacity-60"
          )}
        >
          <RefreshCw className={cx("h-[13px] w-[13px]", syncing && "spinning")} aria-hidden="true" />
          <span>{syncing ? "Syncing…" : "Sync now"}</span>
        </button>
      </Reveal>
    </div>
  );
}
