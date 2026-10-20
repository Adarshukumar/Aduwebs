/**
 * Aduwebs — content layer.
 * Every string here is sourced from Adarsh Kumar's real GitHub profile
 * README (Adarshukumar/Adarshukumar) and the Aduwebs repo (branch
 * arena/35ee871c-aduwebs): README.md, logs/CHANGELOG.md, DEEP-NOTE.md.
 */

export const PROFILE = {
  name: "Adarsh Kumar",
  handle: "@Adarshukumar",
  firstName: "Adarsh",
  lastName: "Kumar",
  role: "Product designer · Creative developer",
  roleAlt: "AI Developer & ML Engineer",
  location: "Delhi, India",
  locationLine: "Delhi, India — working worldwide",
  availability: "Available for select projects",
  email: "devadarshukumar@gmail.com",
  emailAlt: "adarshukumar@gmail.com",
  company: "Adarsh Ltd.....",
  education: "B.Com (Hons) · Dyal Singh College, University of Delhi",
  freelancingSince: "January 2024",
  githubUser: "Adarshukumar",
  avatar: "https://avatars.githubusercontent.com/u/268533455?v=4",
  statement:
    "I turn complex ideas into clear, useful products — combining thoughtful design, resilient systems, and expressive code.",
  motto: "Build fast. Break things. Learn faster.",
  funFact: "I debug with print() — zero regrets.",
  coffee: "Always",
  bio: "I'm Adarsh — a freelance developer from Delhi who's probably debugging something right now. Since January 2024 I've been building websites, editing videos, and shipping small AI tools for real people — 15+ of them running live on HuggingFace Spaces. These days most of my free time goes into LLM apps, RAG pipelines, and backend APIs. Commerce by day at Dyal Singh College, University of Delhi — code by night.",
  aboutLead:
    "I care about the moment a messy idea becomes simple enough to use — and strong enough to scale.",
} as const;

export type SocialKey =
  | "github"
  | "linkedin"
  | "instagram"
  | "huggingface"
  | "email"
  | "x"
  | "youtube"
  | "spotify"
  | "discord"
  | "linktree"
  | "itch";

export interface Social {
  key: SocialKey;
  name: string;
  handle: string;
  line: string;
  cta: string;
  url: string;
  accent?: boolean;
}

export const SOCIALS: Social[] = [
  {
    key: "linkedin",
    name: "LinkedIn",
    handle: "/in/adarshu07",
    line: "Freelance Web Developer · Building with AI · 129 connections",
    cta: "Connect with me",
    url: "https://www.linkedin.com/in/adarshu07/",
  },
  {
    key: "huggingface",
    name: "Hugging Face",
    handle: "@AdarshJi",
    line: "15+ live AI tools on Spaces — image generation, text-to-speech, automation",
    cta: "Try the tools",
    url: "https://huggingface.co/AdarshJi",
    accent: true,
  },
  {
    key: "github",
    name: "GitHub",
    handle: "@Adarshukumar",
    line: "Open source, in the open — 19 public repositories and counting",
    cta: "View full profile",
    url: "https://github.com/Adarshukumar",
  },
  {
    key: "instagram",
    name: "Instagram",
    handle: "@adarshu.io",
    line: "Design, motion experiments and building in public",
    cta: "Follow along",
    url: "https://www.instagram.com/adarshu.io/",
  },
  {
    key: "x",
    name: "X / Twitter",
    handle: "@Adarshukumar07",
    line: "Short-form thoughts on AI, agents and shipping fast",
    cta: "Follow me",
    url: "https://x.com/Adarshukumar07",
  },
  {
    key: "youtube",
    name: "YouTube",
    handle: "@Adarshukumar",
    line: "Build logs, demos and the occasional tutorial",
    cta: "Watch",
    url: "https://youtube.com/@Adarshukumar",
  },
  {
    key: "spotify",
    name: "Spotify",
    handle: "Adarshukumar",
    line: "The playlists that survive a 3 a.m. debugging session",
    cta: "See the taste",
    url: "https://open.spotify.com/user/Adarshukumar",
  },
  {
    key: "discord",
    name: "Discord",
    handle: "Adarshukumar",
    line: "Where the collabs and late-night build chats happen",
    cta: "Say hello",
    url: "https://discord.com/users/Adarshukumar",
  },
  {
    key: "linktree",
    name: "Linktree",
    handle: "adarshu",
    line: "Every link that matters, on one page",
    cta: "Open the tree",
    url: "https://linktr.ee/adarshu",
  },
  {
    key: "itch",
    name: "Itch.io",
    handle: "Adarshukumar",
    line: "AI × games — small experiments that turned playable",
    cta: "Play them",
    url: "https://Adarshukumar.itch.io",
  },
  {
    key: "email",
    name: "Email",
    handle: "devadarshukumar@gmail.com",
    line: "Fastest way to reach me — projects, internships, good conversations",
    cta: "Write to me",
    url: "mailto:devadarshukumar@gmail.com",
  },
];

/* ───────────────────────────  skills  ─────────────────────────── */

export type SkillType = "languages" | "ai" | "frontend" | "data";

export interface Skill {
  name: string;
  type: SkillType;
  typeLabel: string;
  tag: string;
  color: string;
  desc: string;
  use: string[];
  where: string;
  proof: string;
  cta: string;
  url: string;
  level: number;
}

export const SKILLS: Skill[] = [
  {
    name: "Python",
    type: "languages",
    typeLabel: "Language",
    tag: "PY",
    color: "#4cc9f0",
    desc: "My first language for getting things done — AI backends, APIs, scrapers and small automations that quietly run in the background.",
    use: ["FastAPI services", "LLM apps", "Automation"],
    where: "15+ live AI tools",
    proof: "HuggingFace Spaces",
    cta: "See the live tools",
    url: "https://huggingface.co/AdarshJi",
    level: 92,
  },
  {
    name: "JavaScript",
    type: "languages",
    typeLabel: "Language",
    tag: "JS",
    color: "#f1df57",
    desc: "The language of the browser — interactive pages, playful details and interfaces that respond instantly. This website included.",
    use: ["Interfaces", "Interactions", "Browser magic"],
    where: "Client sites & this page",
    proof: "This website",
    cta: "You're looking at it",
    url: "/",
    level: 85,
  },
  {
    name: "TypeScript",
    type: "languages",
    typeLabel: "Language",
    tag: "TS",
    color: "#61dafb",
    desc: "JavaScript with a spine — typed contracts across React front-ends and Node services, so refactors stop being scary.",
    use: ["React apps", "Typed APIs", "Node services"],
    where: "Freelance builds",
    proof: "GitHub",
    cta: "See the repos",
    url: "/work",
    level: 78,
  },
  {
    name: "C · C++",
    type: "languages",
    typeLabel: "Language",
    tag: "C++",
    color: "#8c6cff",
    desc: "Where I learned to actually think — pointers, memory, data structures. Still the fastest way to reason about a problem.",
    use: ["DSA", "Systems", "Performance"],
    where: "Foundations",
    proof: "GitHub",
    cta: "Browse the C repo",
    url: "https://github.com/Adarshukumar/C",
    level: 74,
  },
  {
    name: "FastAPI",
    type: "ai",
    typeLabel: "AI · Backend",
    tag: "API",
    color: "#39d98a",
    desc: "How my AI work reaches the real world — clean APIs with SSE streaming, like the router serving 48 chat models through one endpoint.",
    use: ["Model serving", "SSE streaming", "OpenAI-style APIs"],
    where: "48-model chat router",
    proof: "HuggingFace Spaces",
    cta: "See it in action",
    url: "https://huggingface.co/AdarshJi",
    level: 88,
  },
  {
    name: "LangChain · RAG",
    type: "ai",
    typeLabel: "AI · Backend",
    tag: "LLM",
    color: "#c8ff37",
    desc: "Where the learning curve is steepest and most fun — chat-with-your-data pipelines, retrieval, and LLM apps that solve real problems.",
    use: ["RAG pipelines", "Chat apps", "Model routing"],
    where: "AI experiments",
    proof: "Live tools",
    cta: "See the experiments",
    url: "/lab",
    level: 84,
  },
  {
    name: "Deep Learning",
    type: "ai",
    typeLabel: "AI · Models",
    tag: "DL",
    color: "#ff6b4a",
    desc: "TensorFlow, PyTorch, Keras and scikit-learn — from a first neural net to OpenCV vision pipelines and HuggingFace model cards.",
    use: ["PyTorch", "TensorFlow", "OpenCV"],
    where: "Model experiments",
    proof: "HuggingFace",
    cta: "See the models",
    url: "https://huggingface.co/AdarshJi",
    level: 76,
  },
  {
    name: "React",
    type: "frontend",
    typeLabel: "Frontend",
    tag: "UI",
    color: "#61dafb",
    desc: "Component-driven interfaces for client work — pages that stay fast, editable and easy to grow after handover.",
    use: ["Landing pages", "Dashboards", "Components"],
    where: "Freelance builds",
    proof: "LinkedIn",
    cta: "More on LinkedIn",
    url: "https://www.linkedin.com/in/adarshu07/",
    level: 82,
  },
  {
    name: "HTML · CSS",
    type: "frontend",
    typeLabel: "Frontend",
    tag: "</>",
    color: "#ff6b4a",
    desc: "Hand-built, responsive and accessible — no page builders. WordPress joins the stack when a client needs to edit everything themselves.",
    use: ["Responsive sites", "Design systems", "WordPress"],
    where: "Every single project",
    proof: "This website",
    cta: "You're looking at it",
    url: "/",
    level: 94,
  },
  {
    name: "Databases",
    type: "data",
    typeLabel: "Data · Cloud",
    tag: "DB",
    color: "#4ea94b",
    desc: "MongoDB, MySQL, PostgreSQL, SQLite and Redis — plus Firebase and Supabase when a project needs auth and realtime on day one.",
    use: ["MongoDB", "PostgreSQL", "Redis"],
    where: "Every backend",
    proof: "GitHub",
    cta: "See the backends",
    url: "/work",
    level: 79,
  },
  {
    name: "Docker · Cloud",
    type: "data",
    typeLabel: "Data · Cloud",
    tag: "OPS",
    color: "#0db7ed",
    desc: "Containerised services that deploy the same way everywhere — Docker images, Google Cloud, and HuggingFace Spaces as a free host.",
    use: ["Docker", "Google Cloud", "HF Spaces"],
    where: "Deployments",
    proof: "galleryserver-docker",
    cta: "See the image server",
    url: "https://github.com/Adarshukumar/galleryserver-docker",
    level: 72,
  },
  {
    name: "Video & Motion",
    type: "frontend",
    typeLabel: "Creative",
    tag: "EDIT",
    color: "#f4a6ff",
    desc: "Reels, YouTube edits and promos with clean motion — the same eye for timing that makes an interface feel alive.",
    use: ["Reels", "YouTube edits", "Promos"],
    where: "Client work",
    proof: "Instagram",
    cta: "See the edits",
    url: "https://www.instagram.com/adarshu.io/",
    level: 80,
  },
];

export const SKILL_FILTERS: { key: SkillType | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "languages", label: "Languages" },
  { key: "ai", label: "AI & APIs" },
  { key: "frontend", label: "Frontend" },
  { key: "data", label: "Data & Cloud" },
];

export const TOOLBOX = [
  "Docker",
  "MongoDB",
  "Firebase",
  "Flask",
  "Django",
  "Git",
  "WordPress",
  "HuggingFace Spaces",
  "Supabase",
  "Redis",
  "GraphQL",
  "Socket.io",
  "OpenCV",
  "NumPy · Pandas",
];

/* ─────────────────────────  services  ────────────────────────── */

export interface Service {
  icon: "code" | "bulb" | "camera";
  title: string;
  desc: string;
  bullets: string[];
}

export const SERVICES: Service[] = [
  {
    icon: "code",
    title: "Websites that work",
    desc: "Landing pages and small-business sites — hand-built in HTML, CSS, JavaScript and React, or WordPress when you need to edit everything yourself.",
    bullets: ["Responsive & accessible", "Fast by default", "Editable after handover"],
  },
  {
    icon: "bulb",
    title: "AI tools & backends",
    desc: "LLM apps, RAG pipelines and FastAPI services — like a router serving 48 chat models through one API, and 15+ tools running live on HuggingFace Spaces.",
    bullets: ["RAG & retrieval", "Streaming APIs", "Model routing"],
  },
  {
    icon: "camera",
    title: "Video & tech help",
    desc: "Reels, YouTube edits and promos with clean motion — plus honest tech support and small automations for creators and small businesses.",
    bullets: ["Reels & shorts", "YouTube edits", "Small automations"],
  },
];

/* ─────────────────────────  process  ─────────────────────────── */

export const PROCESS = [
  {
    step: "01 / Discover",
    title: "Frame the real problem",
    desc: "Talk to people, inspect the system, map constraints, and define what a useful outcome actually looks like.",
  },
  {
    step: "02 / Make",
    title: "Prototype the behavior",
    desc: "Move from abstract decisions to something testable — early enough to learn and bold enough to explore.",
  },
  {
    step: "03 / Refine",
    title: "Polish the signal",
    desc: "Improve hierarchy, interaction, performance, and edge cases until the experience feels clear and dependable.",
  },
  {
    step: "04 / Ship",
    title: "Launch, then keep learning",
    desc: "Deploy it, watch how real people use it, and iterate. Shipping is the start of the feedback loop, not the end.",
  },
];

/* ─────────────────────  AI lab / HF tools  ───────────────────── */

export interface LabTool {
  name: string;
  kind: string;
  desc: string;
  stack: string[];
  status: "Live" | "In progress" | "Experiment";
  gradient: [string, string];
}

export const LAB_TOOLS: LabTool[] = [
  {
    name: "48-Model Chat Router",
    kind: "LLM Gateway",
    desc: "One OpenAI-style endpoint that routes to 48 chat models — pick a provider per request, stream tokens over SSE, and never rewrite client code again.",
    stack: ["FastAPI", "SSE", "LangChain"],
    status: "Live",
    gradient: ["#4b58ff", "#8c6cff"],
  },
  {
    name: "Image Generation Space",
    kind: "Diffusion",
    desc: "Prompt-to-image on HuggingFace Spaces with a queue, presets and a gallery — the fastest way to hand a non-technical client a working demo.",
    stack: ["Diffusers", "Gradio", "HF Spaces"],
    status: "Live",
    gradient: ["#ff4f3d", "#ffb27a"],
  },
  {
    name: "Text-to-Speech Studio",
    kind: "Audio",
    desc: "Type a script, get a voiceover. Built for creators who need narration for reels and YouTube edits without booking a studio.",
    stack: ["TTS", "Gradio", "Python"],
    status: "Live",
    gradient: ["#39d98a", "#c8ff37"],
  },
  {
    name: "RAG Chat-with-your-Data",
    kind: "Retrieval",
    desc: "Upload documents, get answers with citations. Chunking, embeddings and a vector store wired into a chat interface that admits when it doesn't know.",
    stack: ["LangChain", "Embeddings", "Vector DB"],
    status: "Live",
    gradient: ["#0db7ed", "#4b58ff"],
  },
  {
    name: "Gallery Server (Docker)",
    kind: "API",
    desc: "A HuggingFace-compatible image server packaged as a Docker image — drop-in free image API for tools that expect the HF contract.",
    stack: ["Docker", "FastAPI", "HF-compatible"],
    status: "Live",
    gradient: ["#8c6cff", "#f4a6ff"],
  },
  {
    name: "Autonomous Agent Playground",
    kind: "Agents",
    desc: "Multi-step reasoning agents with tool use — plan, act, observe, retry. The current obsession and the steepest learning curve on the list.",
    stack: ["LangChain", "Tool use", "Python"],
    status: "In progress",
    gradient: ["#c8ff37", "#39d98a"],
  },
  {
    name: "OpenCV Vision Experiments",
    kind: "Computer vision",
    desc: "Detection, tracking and small vision utilities — the bridge between raw pixels and something a product can actually use.",
    stack: ["OpenCV", "NumPy", "PyTorch"],
    status: "Experiment",
    gradient: ["#5c3ee8", "#0db7ed"],
  },
  {
    name: "AI × Games",
    kind: "Playful",
    desc: "Applying ML models to game development — because the memory game on this site deserved smarter opponents eventually.",
    stack: ["Python", "ML", "Itch.io"],
    status: "Experiment",
    gradient: ["#ff6b4a", "#f1df57"],
  },
];

/* ───────────────────────  journey / timeline  ────────────────── */

export const TIMELINE = [
  {
    year: "Now",
    title: "Building autonomous AI agents",
    desc: "Going deeper into RAG, LangChain and multi-step reasoning — while freelancing on websites and AI backends for real clients.",
    tag: "2026",
  },
  {
    year: "2025",
    title: "15+ AI tools live on HuggingFace Spaces",
    desc: "Image generation, text-to-speech, automation and a 48-model chat router — all shipped in the open, all free to try.",
    tag: "Shipping",
  },
  {
    year: "2024",
    title: "Freelancing begins",
    desc: "January 2024 — first client website. Websites, video edits and small AI tools for creators and small businesses since.",
    tag: "Freelance",
  },
  {
    year: "2024",
    title: "B.Com (Hons), Dyal Singh College",
    desc: "Commerce by day at the University of Delhi. Code by night — the two turned out to complement each other better than expected.",
    tag: "Education",
  },
  {
    year: "2023",
    title: "Python, then everything else",
    desc: "Started with C and C++ for the fundamentals, fell into Python, and never really left. First scrapers, first APIs, first neural net.",
    tag: "Foundations",
  },
];

export const PRINCIPLES = [
  {
    title: "Ship it, learn from it, do it better",
    desc: "A live tool teaches more in a week than a perfect plan teaches in a month.",
  },
  {
    title: "Quality over quantity — always",
    desc: "Fewer things, done properly. Every repo here is something I'd hand over.",
  },
  {
    title: "Build in the open",
    desc: "Code is part of the conversation, not the final word. Public work invites better questions.",
  },
  {
    title: "Simple enough to use, strong enough to scale",
    desc: "The moment a messy idea becomes clear is the whole job.",
  },
];

export const RIGHT_NOW = [
  { emoji: "🔭", text: "Building autonomous AI agents" },
  { emoji: "🌱", text: "Going deeper into RAG + LangChain" },
  { emoji: "🤝", text: "Always open for cool collabs" },
  { emoji: "⚡", text: "Shipping things fast & learning faster" },
];

export const OPEN_FOR = [
  "AI / ML Projects",
  "Open Source Collab",
  "Freelance AI Dev",
  "Research Partnerships",
];

/* ─────────────────────  featured projects  ───────────────────── */

export interface FeaturedProject {
  name: string;
  tagline: string;
  desc: string;
  role: string;
  stack: string[];
  year: string;
  gradient: [string, string];
  url: string;
  live?: string;
  type: "Web" | "AI" | "Systems";
}

export const FEATURED: FeaturedProject[] = [
  {
    name: "Aduwebs",
    tagline: "This portfolio",
    desc: "A single-file editorial portfolio with a live GitHub data engine, intro loader, page-wipe navigation, magnetic buttons and a memory game — now rebuilt as a multi-page React app.",
    role: "Design + Build",
    stack: ["React", "TypeScript", "Tailwind", "GitHub API"],
    year: "2026",
    gradient: ["#4b58ff", "#c8ff37"],
    url: "https://github.com/Adarshukumar/Aduwebs",
    type: "Web",
  },
  {
    name: "48-Model Chat Router",
    tagline: "One endpoint, every model",
    desc: "An OpenAI-compatible FastAPI gateway that routes a single request to any of 48 chat models, streaming tokens back over Server-Sent Events.",
    role: "Solo build",
    stack: ["FastAPI", "LangChain", "SSE"],
    year: "2025",
    gradient: ["#8c6cff", "#4b58ff"],
    url: "https://huggingface.co/AdarshJi",
    live: "https://huggingface.co/AdarshJi",
    type: "AI",
  },
  {
    name: "Gallery Server",
    tagline: "HuggingFace-compatible image API",
    desc: "A Dockerised image-serving API that speaks the HuggingFace contract, so any tool expecting an HF inference endpoint can use it unchanged.",
    role: "Solo build",
    stack: ["Docker", "FastAPI", "Python"],
    year: "2025",
    gradient: ["#0db7ed", "#39d98a"],
    url: "https://github.com/Adarshukumar/galleryserver-docker",
    type: "Systems",
  },
  {
    name: "15+ HF Spaces",
    tagline: "AI tools in the open",
    desc: "Image generation, text-to-speech, automation utilities and RAG chat — a running collection of small AI tools anyone can try without installing anything.",
    role: "Ongoing",
    stack: ["Gradio", "Diffusers", "HF Spaces"],
    year: "2025",
    gradient: ["#ff4f3d", "#f1df57"],
    url: "https://huggingface.co/AdarshJi",
    live: "https://huggingface.co/AdarshJi",
    type: "AI",
  },
  {
    name: "Client Websites",
    tagline: "Freelance since Jan 2024",
    desc: "Landing pages and small-business sites hand-built in HTML/CSS/JS and React — or WordPress when the client needs to own the editing experience.",
    role: "Freelance",
    stack: ["React", "HTML/CSS", "WordPress"],
    year: "2024 —",
    gradient: ["#c8ff37", "#39d98a"],
    url: "https://www.linkedin.com/in/adarshu07/",
    type: "Web",
  },
  {
    name: "Video & Motion",
    tagline: "Reels, edits, promos",
    desc: "YouTube edits, reels and promos with clean motion — plus honest tech support and small automations for creators and small businesses.",
    role: "Freelance",
    stack: ["Motion", "Editing", "Automation"],
    year: "2024 —",
    gradient: ["#f4a6ff", "#8c6cff"],
    url: "https://www.instagram.com/adarshu.io/",
    type: "Web",
  },
];

/* ─────────────────  fallback GitHub repos (real, from API)  ──── */

export interface RepoFallback {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  html_url: string;
  updated_at: string;
  fork: boolean;
  topics: string[];
  license: { spdx_id: string } | null;
}

export const REPO_FALLBACK: RepoFallback[] = [
  { name: "Aduwebs", description: "website", language: null, stargazers_count: 0, forks_count: 0, html_url: "https://github.com/Adarshukumar/Aduwebs", updated_at: "2026-10-19T06:17:43Z", fork: false, topics: [], license: null },
  { name: "dsk_", description: "bakchdoi", language: "JavaScript", stargazers_count: 0, forks_count: 0, html_url: "https://github.com/Adarshukumar/dsk_", updated_at: "2026-10-17T16:32:47Z", fork: false, topics: [], license: null },
  { name: "C", description: "All C Projects", language: "C", stargazers_count: 1, forks_count: 0, html_url: "https://github.com/Adarshukumar/C", updated_at: "2026-10-07T14:35:20Z", fork: false, topics: [], license: null },
  { name: "ReactJs", description: "Learning Reactjs", language: "TypeScript", stargazers_count: 1, forks_count: 0, html_url: "https://github.com/Adarshukumar/ReactJs", updated_at: "2026-10-07T14:33:54Z", fork: false, topics: [], license: null },
  { name: "Javascript", description: "All Javascript Projects", language: "JavaScript", stargazers_count: 1, forks_count: 0, html_url: "https://github.com/Adarshukumar/Javascript", updated_at: "2026-10-07T13:54:23Z", fork: false, topics: [], license: null },
  { name: "Typescript", description: "All Typescript Projects", language: "TypeScript", stargazers_count: 1, forks_count: 0, html_url: "https://github.com/Adarshukumar/Typescript", updated_at: "2026-10-07T13:53:00Z", fork: false, topics: [], license: null },
  { name: "Python", description: "All Python Projects", language: "Jupyter Notebook", stargazers_count: 1, forks_count: 0, html_url: "https://github.com/Adarshukumar/Python", updated_at: "2026-10-06T15:10:04Z", fork: false, topics: [], license: null },
  { name: "galleryserver-docker", description: "huggingface compatable server -- API for Free Images", language: "Python", stargazers_count: 1, forks_count: 0, html_url: "https://github.com/Adarshukumar/galleryserver-docker", updated_at: "2026-10-06T15:05:58Z", fork: false, topics: [], license: null },
  { name: "cloud", description: null, language: "Python", stargazers_count: 1, forks_count: 0, html_url: "https://github.com/Adarshukumar/cloud", updated_at: "2026-10-06T15:05:53Z", fork: false, topics: [], license: null },
  { name: "meow", description: "Denchuuu", language: "Python", stargazers_count: 1, forks_count: 0, html_url: "https://github.com/Adarshukumar/meow", updated_at: "2026-10-06T15:05:52Z", fork: false, topics: [], license: null },
  { name: "wtf", description: "percddhance", language: "Python", stargazers_count: 1, forks_count: 0, html_url: "https://github.com/Adarshukumar/wtf", updated_at: "2026-10-06T15:05:46Z", fork: false, topics: [], license: null },
  { name: "apk", description: null, language: null, stargazers_count: 1, forks_count: 0, html_url: "https://github.com/Adarshukumar/apk", updated_at: "2026-10-06T15:05:45Z", fork: false, topics: [], license: null },
  { name: "public", description: "beahhh", language: null, stargazers_count: 1, forks_count: 0, html_url: "https://github.com/Adarshukumar/public", updated_at: "2026-10-06T15:05:43Z", fork: false, topics: [], license: null },
  { name: "skills", description: null, language: "Python", stargazers_count: 1, forks_count: 0, html_url: "https://github.com/Adarshukumar/skills", updated_at: "2026-10-06T15:05:42Z", fork: false, topics: [], license: { spdx_id: "MIT" } },
  { name: "aduskill", description: null, language: "Python", stargazers_count: 1, forks_count: 0, html_url: "https://github.com/Adarshukumar/aduskill", updated_at: "2026-10-06T15:05:42Z", fork: false, topics: [], license: { spdx_id: "MIT" } },
  { name: "serv__", description: "desking", language: "Python", stargazers_count: 1, forks_count: 0, html_url: "https://github.com/Adarshukumar/serv__", updated_at: "2026-10-06T15:05:40Z", fork: false, topics: [], license: null },
  { name: "Perc", description: null, language: "Python", stargazers_count: 1, forks_count: 0, html_url: "https://github.com/Adarshukumar/Perc", updated_at: "2026-09-03T09:21:34Z", fork: false, topics: [], license: null },
  { name: "RepopoxRev", description: null, language: "Python", stargazers_count: 0, forks_count: 0, html_url: "https://github.com/Adarshukumar/RepopoxRev", updated_at: "2026-08-14T13:36:35Z", fork: false, topics: [], license: null },
  { name: "Adarshukumar", description: "My GitHub profile", language: null, stargazers_count: 1, forks_count: 0, html_url: "https://github.com/Adarshukumar/Adarshukumar", updated_at: "2026-03-29T12:19:36Z", fork: false, topics: [], license: null },
];

/* ─────────────────────────  FAQ  ─────────────────────────────── */

export const FAQ = [
  {
    q: "What kind of projects do you take on?",
    a: "Websites and landing pages for small businesses and creators, AI tools and backends (LLM apps, RAG pipelines, FastAPI services), and video edits or small automations. If it involves Python, a browser, or a model — probably yes.",
  },
  {
    q: "How fast can you start?",
    a: "Usually within a week. Small sites and single tools can start almost immediately; larger AI systems get a short discovery call first so we agree on what 'done' means.",
  },
  {
    q: "Do you work with clients outside India?",
    a: "Yes — I'm based in Delhi but working worldwide. Most collaboration happens over email, LinkedIn and shared docs, with async updates so timezones never block progress.",
  },
  {
    q: "Can I edit the site after handover?",
    a: "Always. Either I build it in WordPress so you own the editing experience, or I hand over clean, commented React/HTML with a short walkthrough. No lock-in, no mystery code.",
  },
  {
    q: "Are you open to internships and collaborations?",
    a: "Yes. AI/ML projects, open-source collaboration, freelance work and research partnerships are all on the table. Email is the fastest route.",
  },
  {
    q: "What does it cost?",
    a: "It depends on scope. Send a short description of what you need and you'll get an honest estimate — including what I'd cut if the budget is tight.",
  },
];

/* ───────────────────────  memory game  ───────────────────────── */

export type GameSymbol =
  | "code"
  | "bike"
  | "star"
  | "send"
  | "bulb"
  | "gamepad"
  | "camera"
  | "compass"
  | "rocket"
  | "cpu"
  | "sparkles"
  | "terminal";

export const GAME_SYMBOLS: GameSymbol[] = [
  "code",
  "bike",
  "star",
  "send",
  "bulb",
  "gamepad",
  "camera",
  "compass",
];

export interface Difficulty {
  key: "easy" | "classic" | "hard";
  label: string;
  pairs: number;
  cols: number;
  blurb: string;
}

export const DIFFICULTIES: Difficulty[] = [
  { key: "easy", label: "Warm-up", pairs: 6, cols: 4, blurb: "6 pairs · 4 columns" },
  { key: "classic", label: "Classic", pairs: 8, cols: 4, blurb: "8 pairs · the original" },
  { key: "hard", label: "Brutal", pairs: 12, cols: 6, blurb: "12 pairs · 6 columns" },
];

export const HARD_SYMBOLS: GameSymbol[] = [
  "code",
  "bike",
  "star",
  "send",
  "bulb",
  "gamepad",
  "camera",
  "compass",
  "rocket",
  "cpu",
  "sparkles",
  "terminal",
];

/* ───────────────────────  nav + footer  ──────────────────────── */

export const NAV_LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/about", label: "About" },
  { to: "/work", label: "Work" },
  { to: "/stack", label: "Stack" },
  { to: "/lab", label: "AI Lab" },
  { to: "/arcade", label: "Play Game" },
  { to: "/contact", label: "Contact" },
];

export const MARQUEE_WORDS = [
  "Design",
  "Code",
  "Systems",
  "Research",
  "Ship",
  "Learn",
  "AI",
  "RAG",
  "FastAPI",
];

export const HERO_STATS = [
  { value: "10+", label: "Languages & tools" },
  { value: "15+", label: "Live AI tools" },
  { value: "2024", label: "Freelancing since" },
  { value: "24/7", label: "Curiosity mode" },
];
