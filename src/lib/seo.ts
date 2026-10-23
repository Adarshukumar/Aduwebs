/**
 * Per-route metadata.
 *
 * The old site shipped one `<title>` for all eight routes. This table is the
 * single source of truth; `RouteEffects` applies it on every navigation, so
 * browser history, tabs, shares and crawlers all get a real page name.
 */

export interface RouteMeta {
  title: string;
  description: string;
  path: string;
}

const SITE = "https://adarshkumar-one.vercel.app";

export const ROUTE_META: Record<string, RouteMeta> = {
  "/": {
    path: "/",
    title: "Adarsh Kumar — Product Designer & Developer",
    description:
      "Freelance designer and developer in Delhi. Clear, useful websites, resilient AI backends, and 15+ live tools shipped in the open.",
  },
  "/about": {
    path: "/about",
    title: "About — commerce by day, code by night · Adarsh Kumar",
    description:
      "The long version: Delhi, Dyal Singh College, freelancing since January 2024, five years of timeline compressed into five entries, and four principles that survive contact with clients.",
  },
  "/work": {
    path: "/work",
    title: "Work — six featured projects and every public repository · Adarsh Kumar",
    description:
      "The 48-model chat router, a HuggingFace-compatible gallery server, 15+ AI spaces, client sites and motion work — plus every public GitHub repository, live and searchable.",
  },
  "/stack": {
    path: "/stack",
    title: "Stack — twelve skills, honestly scored · Adarsh Kumar",
    description:
      "Python, FastAPI, React, TypeScript, RAG, Docker and the rest of the working stack, each with a confidence score, the projects that prove it, and a link to the evidence.",
  },
  "/lab": {
    path: "/lab",
    title: "AI Lab — fifteen tools, one endpoint · Adarsh Kumar",
    description:
      "LLM apps, RAG pipelines, diffusion demos and a router that speaks to 48 chat models through a single OpenAI-compatible endpoint on HuggingFace Spaces.",
  },
  "/arcade": {
    path: "/arcade",
    title: "Arcade — memory and sequence games · Adarsh Kumar",
    description:
      "Two small games built from the site's own icon sprite: a three-board memory match and an endless sequence game. Best scores are saved locally.",
  },
  "/contact": {
    path: "/contact",
    title: "Contact — let's talk, let's build · Adarsh Kumar",
    description:
      "Tell me what you're building. A pre-filled email, an honest estimate, and a reply usually within a day. Delhi, India — working worldwide.",
  },
};

const NOT_FOUND: RouteMeta = {
  path: "/404",
  title: "Lost in it — 404 · Adarsh Kumar",
  description: "That page doesn't exist. Try the homepage, the work shelf, or tell me it's broken.",
};

const META_DESCRIPTION = 'meta[name="description"]';
const OG_TITLE = 'meta[property="og:title"]';
const OG_DESCRIPTION = 'meta[property="og:description"]';
const OG_URL = 'meta[property="og:url"]';
const CANONICAL = 'link[rel="canonical"]';

function upsert(selector: string, create: () => HTMLElement, apply: (node: HTMLElement) => void) {
  let node = document.head.querySelector(selector) as HTMLElement | null;
  if (!node) {
    node = create();
    document.head.appendChild(node);
  }
  apply(node);
}

export function applyRouteMeta(pathname: string): void {
  if (typeof document === "undefined") return;

  const meta = ROUTE_META[pathname] ?? NOT_FOUND;
  const url = `${SITE}${meta.path === "/" ? "/" : meta.path}`;

  document.title = meta.title;

  upsert(META_DESCRIPTION, () => {
    const el = document.createElement("meta");
    el.setAttribute("name", "description");
    return el;
  }, (el) => el.setAttribute("content", meta.description));

  upsert(OG_TITLE, () => {
    const el = document.createElement("meta");
    el.setAttribute("property", "og:title");
    return el;
  }, (el) => el.setAttribute("content", meta.title));

  upsert(OG_DESCRIPTION, () => {
    const el = document.createElement("meta");
    el.setAttribute("property", "og:description");
    return el;
  }, (el) => el.setAttribute("content", meta.description));

  upsert(OG_URL, () => {
    const el = document.createElement("meta");
    el.setAttribute("property", "og:url");
    return el;
  }, (el) => el.setAttribute("content", url));

  upsert(CANONICAL, () => {
    const el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    return el;
  }, (el) => el.setAttribute("href", url));
}

/** One `Person` + `WebSite` graph, injected once. */
export function injectStructuredData(): void {
  if (typeof document === "undefined") return;
  if (document.getElementById("adarsh-jsonld")) return;

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE}/#person`,
        name: "Adarsh Kumar",
        url: SITE,
        email: "mailto:devadarshukumar@gmail.com",
        jobTitle: "Product Designer & Developer",
        address: { "@type": "PostalAddress", addressLocality: "Delhi", addressCountry: "IN" },
        sameAs: [
          "https://github.com/Adarshukumar",
          "https://www.linkedin.com/in/adarshu07/",
          "https://huggingface.co/AdarshJi",
          "https://www.instagram.com/adarshu.io/",
          "https://x.com/Adarshukumar07",
        ],
        knowsAbout: [
          "Web design",
          "React",
          "TypeScript",
          "Python",
          "FastAPI",
          "Retrieval-augmented generation",
          "Docker",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE}/#website`,
        url: SITE,
        name: "Adarsh Kumar",
        publisher: { "@id": `${SITE}/#person` },
        inLanguage: "en",
      },
    ],
  };

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.id = "adarsh-jsonld";
  script.textContent = JSON.stringify(graph);
  document.head.appendChild(script);
}
