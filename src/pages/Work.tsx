import { useMemo, useState } from "react";
import { ArrowUpRight, ExternalLink, GitFork, Search, Star } from "lucide-react";
import { PageHero, SectionHeading } from "../components/ui/SectionHeading";
import { Reveal } from "../components/ui/Reveal";
import { Magnetic } from "../components/ui/Magnetic";
import { Poster } from "../components/ui/Poster";
import { Marquee } from "../components/ui/Marquee";
import { ImageBand } from "../components/ui/ImageBand";
import { ContactBand } from "../components/contact/ContactBand";
import { WipeLink } from "../components/fx/Effects";
import { useGithub } from "../context/GithubContext";
import { FEATURED, type FeaturedProject } from "../lib/data";
import {
  languageColor,
  repoFamily,
  repoLanguages,
  type RepoFamily,
} from "../lib/github";
import { cx, gradientFor, relativeTime } from "../lib/utils";

const PAGE_SIZE = 9;

const FAMILIES: (RepoFamily | "All")[] = ["All", "Web", "AI & Data", "Systems", "Other"];

function FeaturedCard({ project, index }: { project: FeaturedProject; index: number }) {
  return (
    <Reveal as="article" delay={(index % 3) as 0 | 1 | 2} className="group">
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-full flex-col"
      >
        <Poster
          title={project.name}
          top={project.type}
          index={String(index + 1).padStart(2, "0")}
          bottomLeft={project.year}
          tag={project.tagline}
          gradient={project.gradient}
          className="aspect-[16/11]"
        />
        <div className="flex flex-1 flex-col border-x border-b border-line bg-surface p-5">
          <h3 className="font-serif-ed text-[24px] leading-tight">{project.name}</h3>
          <p className="micro-label mt-1.5">{project.tagline}</p>
          <p className="mt-3.5 text-[13px] leading-relaxed text-muted">{project.desc}</p>

          <div className="mt-5 flex flex-wrap gap-1.5">
            {project.stack.map((tech) => (
              <span key={tech} className="chip">
                {tech}
              </span>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4">
            <span className="micro-label">{project.role}</span>
            <span className="text-link">
              Open
              <ArrowUpRight aria-hidden="true" />
            </span>
          </div>
        </div>
      </a>
    </Reveal>
  );
}

export function Work() {
  const { data, status } = useGithub();
  const [query, setQuery] = useState("");
  const [family, setFamily] = useState<RepoFamily | "All">("All");
  const [language, setLanguage] = useState("All");
  const [sort, setSort] = useState<"updated" | "stars" | "name">("updated");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const languages = useMemo(() => repoLanguages(data.repos), [data.repos]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    const result = data.repos.filter((repo) => {
      if (family !== "All" && repoFamily(repo.language) !== family) return false;
      if (language !== "All" && repo.language !== language) return false;
      if (!needle) return true;
      return (
        repo.name.toLowerCase().includes(needle) ||
        (repo.description ?? "").toLowerCase().includes(needle) ||
        repo.topics.some((topic) => topic.toLowerCase().includes(needle))
      );
    });

    return result.sort((a, b) => {
      if (sort === "stars") return b.stargazers_count - a.stargazers_count;
      if (sort === "name") return a.name.localeCompare(b.name);
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });
  }, [data.repos, family, language, query, sort]);

  const shown = filtered.slice(0, visible);
  const totalStars = data.totalStars;

  return (
    <>
      <PageHero
        kicker="Work / 003"
        title="Things made"
        outline="in the open."
        description="Featured client and AI work up top, then every public repository — pulled live from the GitHub API, searchable and filterable."
        meta={
          <>
            <span className="chip">
              <span className="chip-dot" style={{ ["--dot-color" as string]: "#35d07f" }} />
              {status === "loading" ? "Syncing with GitHub…" : data.live ? "Live from GitHub" : "Cached snapshot"}
            </span>
            <span className="chip">{data.profile.public_repos} repositories</span>
            <span className="chip">
              <Star className="h-3 w-3" aria-hidden="true" /> {totalStars} total stars
            </span>
          </>
        }
      />

      {/* ───────────────────  featured  ─────────────────── */}
      <section className="section-pad" aria-labelledby="featured-title">
        <SectionHeading
          kicker="Selected work"
          title={
            <>
              Six things
              <br />
              <em>worth clicking.</em>
            </>
          }
          description="The projects that best explain what I do — a model router, a Dockerised image API, 15+ live AI tools, and the freelance web work that pays for all of it."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED.map((project, index) => (
            <FeaturedCard key={project.name} project={project} index={index} />
          ))}
        </div>
      </section>

      <Marquee words={["Open source", "Python", "FastAPI", "React", "TypeScript", "C++", "RAG"]} />

      <ImageBand
        src="/img/code.jpg"
        alt="Close up of code on a computer screen"
        kicker="Everything public"
      >
        Nineteen repositories, no gatekeeping — <em className="italic">the shelf below is the real one</em>,
        pulled straight from the GitHub API.
      </ImageBand>

      {/* ───────────────────  repo browser  ─────────────────── */}
      <section className="section-pad" aria-labelledby="repos-title">
        <SectionHeading
          kicker="Every public repository"
          title={
            <>
              The whole
              <br />
              <em>shelf.</em>
            </>
          }
          description="Search by name, description or topic. Filter by what it's made of. Sorted however you like it."
        />

        {/* toolbar */}
        <Reveal className="mb-8 flex flex-col gap-4 rounded-[18px] border border-line bg-surface p-4 lg:flex-row lg:items-center">
          <label className="relative flex-1">
            <span className="sr-only">Search repositories</span>
            <Search
              className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setVisible(PAGE_SIZE);
              }}
              placeholder="Search repositories…"
              className="field !rounded-full !py-2.5 !pl-10"
            />
          </label>

          <div className="flex flex-wrap items-center gap-2">
            <label className="sr-only" htmlFor="language-filter">
              Filter by language
            </label>
            <select
              id="language-filter"
              value={language}
              onChange={(event) => {
                setLanguage(event.target.value);
                setVisible(PAGE_SIZE);
              }}
              className="field !w-auto !rounded-full !py-2.5 text-[13px]"
            >
              <option value="All">All languages</option>
              {languages.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <label className="sr-only" htmlFor="sort-filter">
              Sort repositories
            </label>
            <select
              id="sort-filter"
              value={sort}
              onChange={(event) => setSort(event.target.value as typeof sort)}
              className="field !w-auto !rounded-full !py-2.5 text-[13px]"
            >
              <option value="updated">Recently updated</option>
              <option value="stars">Most stars</option>
              <option value="name">Name A–Z</option>
            </select>
          </div>
        </Reveal>

        {/* family tabs */}
        <Reveal delay={1} className="mb-7 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
            {FAMILIES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setFamily(item);
                  setVisible(PAGE_SIZE);
                }}
                aria-pressed={family === item}
                className={cx("filter-tab", family === item && "is-active")}
              >
                {item}
              </button>
            ))}
          </div>
          <span className="micro-label" aria-live="polite">
            {filtered.length} {filtered.length === 1 ? "repository" : "repositories"}
          </span>
        </Reveal>

        {/* repo grid */}
        {shown.length === 0 ? (
          <Reveal className="rounded-[18px] border border-dashed border-linestrong p-12 text-center">
            <p className="font-serif-ed text-2xl italic">Nothing matches that.</p>
            <p className="mt-2 text-[13px] text-muted">
              Try a different search, or clear the filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setFamily("All");
                setLanguage("All");
              }}
              className="btn btn-outline btn-sm mt-6"
            >
              Reset filters
            </button>
          </Reveal>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {shown.map((repo, index) => (
              <Reveal key={repo.name} delay={(index % 3) as 0 | 1 | 2} as="article">
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col rounded-[16px] border border-line bg-surface p-5 transition-all duration-500 hover:-translate-y-1 hover:border-linestrong hover:shadow-[0_18px_40px_rgba(16,16,16,0.12)]"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <h3 className="font-display text-[19px] leading-tight break-all transition-colors duration-300 group-hover:text-[#4b58ff]">
                      {repo.name}
                    </h3>
                    <ExternalLink
                      className="mt-1 h-3.5 w-3.5 flex-none text-muted opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      aria-hidden="true"
                    />
                  </div>

                  <p className="min-h-[38px] text-[12.5px] leading-relaxed text-muted">
                    {repo.description || (
                      <span className="italic opacity-60">No description yet.</span>
                    )}
                  </p>

                  <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line pt-4 text-[11.5px] text-muted">
                    {repo.language ? (
                      <span className="flex items-center gap-1.5">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ background: languageColor(repo.language) }}
                          aria-hidden="true"
                        />
                        {repo.language}
                      </span>
                    ) : (
                      <span className="italic opacity-70">{repoFamily(repo.language)}</span>
                    )}
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3" aria-hidden="true" />
                      {repo.stargazers_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork className="h-3 w-3" aria-hidden="true" />
                      {repo.forks_count}
                    </span>
                    <span className="ml-auto">{relativeTime(repo.updated_at)}</span>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        )}

        {visible < filtered.length ? (
          <Reveal className="mt-9 flex justify-center">
            <Magnetic>
              <button
                type="button"
                onClick={() => setVisible((count) => count + PAGE_SIZE)}
                className="btn btn-outline"
              >
                Load {Math.min(PAGE_SIZE, filtered.length - visible)} more
                <ArrowUpRight aria-hidden="true" />
              </button>
            </Magnetic>
          </Reveal>
        ) : null}

        <Reveal className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-7">
          <p className="text-[12.5px] text-muted">
            Data from{" "}
            <a
              href="https://github.com/Adarshukumar"
              target="_blank"
              rel="noopener noreferrer"
              className="border-b border-linestrong transition-colors hover:border-ink"
            >
              api.github.com/users/Adarshukumar
            </a>{" "}
            — re-synced on every visit, with a cached snapshot as fallback.
          </p>
          <Magnetic>
            <WipeLink to="/lab" className="btn btn-sm">
              See the AI tools
              <ArrowUpRight aria-hidden="true" />
            </WipeLink>
          </Magnetic>
        </Reveal>
      </section>

      {/* ───────────────────  gradient legend  ─────────────────── */}
      <section className="section-pad border-t border-line" aria-labelledby="palette-title">
        <SectionHeading
          kicker="What the shelf is made of"
          title={
            <>
              Languages,
              <br />
              <em>by weight.</em>
            </>
          }
          description="Counted straight from the live repository list — no hand-typed numbers."
        />

        <Reveal className="flex flex-wrap gap-2.5">
          {languages.map((item) => {
            const count = data.repos.filter((repo) => repo.language === item).length;
            return (
              <span
                key={item}
                className="chip !py-2 !pl-3 !pr-3.5 !text-[12.5px]"
                title={`${count} ${count === 1 ? "repository" : "repositories"}`}
              >
                <span
                  className="chip-dot"
                  style={{ ["--dot-color" as string]: languageColor(item) }}
                />
                {item}
                <span className="font-mono-code ml-1 text-[10.5px] opacity-60">{count}</span>
              </span>
            );
          })}
          {languages.length === 0 ? (
            <span className="text-[13px] text-muted">Waiting on the GitHub API…</span>
          ) : null}
        </Reveal>

        <Reveal delay={1} className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(["Web", "AI & Data", "Systems", "Other"] as RepoFamily[]).map((item) => {
            const count = data.repos.filter((repo) => repoFamily(repo.language) === item).length;
            return (
              <div key={item} className="rounded-[16px] border border-line bg-surface p-5">
                <span className="font-display block text-[2rem] leading-none tabular-nums">
                  {count}
                </span>
                <span className="micro-label mt-2 block">{item}</span>
                <div
                  className="mt-4 h-[3px] w-full overflow-hidden rounded-full"
                  style={{ background: "var(--line)" }}
                >
                  <span
                    className="block h-full rounded-full"
                    style={{
                      width: `${data.repos.length ? (count / data.repos.length) * 100 : 0}%`,
                      background: "var(--acid)",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </Reveal>

        <p className="mt-6 text-[12px] text-muted">
          Poster gradients on this page cycle through the same eight pairs the original single-file
          site used — <span className="font-mono-code">#4b58ff → #c8ff37</span> and friends.
        </p>
      </section>

      <ContactBand />
    </>
  );
}

export default Work;
