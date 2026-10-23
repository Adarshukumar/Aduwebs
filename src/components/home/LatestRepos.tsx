import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { REPO_FALLBACK } from "../../lib/data";
import { useGithub } from "../../context/GithubContext";
import { relativeTime } from "../../lib/utils";
import { WipeLink } from "../fx/Effects";

/**
 * "Latest from the repo shelf" — the newest three public repositories, live.
 * It exists so the home page has one band that changes on its own: the site
 * proves it is wired to GitHub instead of claiming it.
 */
export function LatestRepos() {
  const { data } = useGithub();
  const trackRef = useRef<HTMLDivElement>(null);
  const latest = [...data.repos]
    .sort((a, b) => new Date(b.updated_at ?? 0).getTime() - new Date(a.updated_at ?? 0).getTime())
    .slice(0, 3);

  const list = latest.length > 0 ? latest : REPO_FALLBACK.slice(0, 3);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onMove = (event: PointerEvent) => {
      const rect = track.getBoundingClientRect();
      track.style.setProperty("--mx", `${((event.clientX - rect.left) / rect.width) * 100}%`);
    };
    track.addEventListener("pointermove", onMove, { passive: true });
    return () => track.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <section className="section-pad border-t border-line" aria-labelledby="latest-title">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="kicker mb-3">Fresh from GitHub</p>
          <h2 id="latest-title" className="font-display text-[clamp(1.9rem,4.4vw,3.2rem)] leading-none uppercase">
            Last three <span className="outline-text">pushes.</span>
          </h2>
        </div>
        <WipeLink to="/work" className="text-link text-[13px]">
          Every repository
          <ArrowUpRight aria-hidden="true" />
        </WipeLink>
      </div>

      <div ref={trackRef} className="latest-track">
        {list.map((repo, index) => (
          <a
            key={repo.name}
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="latest-card group"
            style={{ ["--i" as string]: index }}
          >
            <span className="latest-index">{String(index + 1).padStart(2, "0")}</span>
            <strong className="latest-name">{repo.name}</strong>
            <span className="latest-desc">
              {repo.description || "No description yet — the code is the description."}
            </span>
            <span className="latest-meta">
              <span
                className="latest-dot"
                style={{ background: repo.language ? "var(--acid)" : "var(--line-strong)" }}
              />
              {repo.language ?? "—"}
              <span className="latest-sep">·</span>
              {repo.stargazers_count ?? 0} ★
              <span className="latest-sep">·</span>
              {repo.updated_at ? relativeTime(repo.updated_at) : "—"}
            </span>
            <ArrowUpRight className="latest-arrow" aria-hidden="true" />
          </a>
        ))}
      </div>

      <p className="mt-5 text-[11.5px] text-muted">
        Pulled from <span className="font-mono-code">api.github.com</span> on every visit —{" "}
        {data.live ? "live right now" : "showing the cached snapshot"}.
      </p>
    </section>
  );
}
