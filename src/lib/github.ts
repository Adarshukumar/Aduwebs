import { REPO_FALLBACK, type RepoFallback } from "./data";

const GITHUB_USER = "Adarshukumar";
const API_PROFILE = `https://api.github.com/users/${GITHUB_USER}`;
const API_REPOS = `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&direction=desc&per_page=100&type=owner`;

export interface GithubProfile {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  company: string | null;
  location: string | null;
  blog: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  html_url: string;
}

export interface GithubData {
  profile: GithubProfile;
  repos: RepoFallback[];
  totalStars: number;
  live: boolean;
  syncedAt: number;
}

const FALLBACK_PROFILE: GithubProfile = {
  login: GITHUB_USER,
  name: "Adarsh Kumar",
  avatar_url: "https://avatars.githubusercontent.com/u/268533455?v=4",
  bio: "AI developer & full-stack builder from Delhi — websites, backends and 15+ live AI tools, all shipped in the open.",
  company: "Adarsh Ltd.....",
  location: "Delhi, India",
  blog: "",
  public_repos: 19,
  followers: 1,
  following: 2,
  created_at: "2026-03-16T06:48:40Z",
  html_url: `https://github.com/${GITHUB_USER}`,
};

/** Adarsh's GitHub bio is null on the API — never leave a "Loading…" string on screen. */
export const DEFAULT_BIO =
  "Product designer & developer building in the open — AI tools, backends and websites that actually work.";

const CACHE_KEY = "adarsh-github-cache-v1";
const CACHE_TTL = 5 * 60 * 1000;

function readCache(): GithubData | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GithubData;
    if (!parsed?.profile || !Array.isArray(parsed.repos)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(data: GithubData) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    /* storage full or blocked — non-fatal */
  }
}

export function fallbackData(): GithubData {
  return {
    profile: FALLBACK_PROFILE,
    repos: REPO_FALLBACK,
    totalStars: REPO_FALLBACK.reduce((sum, r) => sum + (r.stargazers_count || 0), 0),
    live: false,
    syncedAt: Date.now(),
  };
}

/**
 * Fetch Adarsh's real GitHub profile + repositories.
 * Falls back to a cached copy, then to baked-in data, so the design
 * never breaks offline or when the unauthenticated rate limit is hit.
 */
export async function loadGithub(): Promise<GithubData> {
  const cached = readCache();
  if (cached && Date.now() - cached.syncedAt < CACHE_TTL) return cached;

  try {
    const [profileRes, repoRes] = await Promise.all([
      fetch(API_PROFILE, { headers: { Accept: "application/vnd.github+json" } }),
      fetch(API_REPOS, { headers: { Accept: "application/vnd.github+json" } }),
    ]);

    if (!profileRes.ok || !repoRes.ok) throw new Error(`GitHub API ${profileRes.status}`);

    const profile = (await profileRes.json()) as GithubProfile;
    const allRepos = (await repoRes.json()) as RepoFallback[];

    const repos = (Array.isArray(allRepos) ? allRepos : []).filter(
      (r) => !r.fork && r.name !== GITHUB_USER
    );

    const data: GithubData = {
      profile: {
        ...profile,
        bio: profile.bio?.trim() ? profile.bio : DEFAULT_BIO,
        name: profile.name?.trim() ? profile.name.trim() : "Adarsh Kumar",
      },
      repos,
      totalStars: repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0),
      live: true,
      syncedAt: Date.now(),
    };

    writeCache(data);
    return data;
  } catch {
    if (cached) return { ...cached, live: false };
    return fallbackData();
  }
}

/** Force a re-fetch, ignoring the freshness cache. */
export async function syncGithub(): Promise<GithubData> {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch {
    /* ignore */
  }
  return loadGithub();
}

/* ───────────────────────  language helpers  ─────────────────────── */

export const LANGUAGE_COLORS: Record<string, string> = {
  Python: "#3572A5",
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  HTML: "#e34c26",
  CSS: "#563d7c",
  C: "#555555",
  "C++": "#f34b7d",
  "C#": "#178600",
  Java: "#b07219",
  Go: "#00ADD8",
  Rust: "#dea584",
  PHP: "#4F5D95",
  Shell: "#89e051",
  "Jupyter Notebook": "#DA5B0B",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  Dockerfile: "#384d54",
  MDX: "#fcb32c",
};

export function languageColor(language: string | null): string {
  if (!language) return "#8a8a8a";
  return LANGUAGE_COLORS[language] ?? "#8a8a8a";
}

export type RepoFamily = "Web" | "AI & Data" | "Systems" | "Other";

const WEB_LANGS = new Set(["JavaScript", "TypeScript", "HTML", "CSS", "Vue", "Svelte", "MDX"]);
const SYSTEMS_LANGS = new Set(["C", "C++", "C#", "Java", "Go", "Rust", "Shell", "Dockerfile"]);
const AI_LANGS = new Set(["Python", "Jupyter Notebook"]);

export function repoFamily(language: string | null): RepoFamily {
  if (!language) return "Other";
  if (WEB_LANGS.has(language)) return "Web";
  if (AI_LANGS.has(language)) return "AI & Data";
  if (SYSTEMS_LANGS.has(language)) return "Systems";
  return "Other";
}

export function repoLanguages(repos: RepoFallback[]): string[] {
  const set = new Set<string>();
  repos.forEach((r) => {
    if (r.language) set.add(r.language);
  });
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}
