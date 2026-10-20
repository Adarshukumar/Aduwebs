# Aduwebs — Adarsh Kumar's portfolio

A multi-page portfolio for **Adarsh Kumar** — product designer, creative developer and AI/ML builder from Delhi. Built as a Vite + React + TypeScript SPA, styled with Tailwind CSS v4 and animated with Framer Motion and hand-written CSS.

**Live:** [https://aduwebs.vercel.app](https://aduwebs.vercel.app)

---

## Stack

| Layer | Choice |
| --- | --- |
| Build tool | Vite 7 |
| UI | React 19 + TypeScript 5.9 |
| Routing | React Router 7 (client-side, SPA rewrites on Vercel) |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) + a token-driven `src/index.css` |
| Motion | Framer Motion, IntersectionObserver reveals, CSS keyframes |
| Icons | lucide-react + a few hand-rolled brand icons |
| Data | Static content in `src/lib/data.ts`, live GitHub data in `src/lib/github.ts` |
| Lint | ESLint 9 (flat config) + typescript-eslint |

No backend. The only network call is the public GitHub API.

---

## Routes

| Path | Page | What it is |
| --- | --- | --- |
| `/` | `pages/Home.tsx` | Hero, about, services, skills, featured work, GitHub profile card, social ID grid, process, a compact memory game, contact band |
| `/about` | `pages/About.tsx` | Full story, facts, timeline, principles, services, all social profiles |
| `/work` | `pages/Work.tsx` | Six featured projects plus the complete live GitHub repository shelf with search, language/family filters and sorting |
| `/stack` | `pages/Stack.tsx` | Every skill grouped by language / AI / frontend / data, with confidence bars and a toolbox list |
| `/lab` | `pages/Lab.tsx` | Live AI tools, an ingest → embed → route → serve pipeline explainer, experiments |
| `/arcade` | `pages/Arcade.tsx` | Memory game with three difficulties plus a Simon-style sequence game, both with local best scores |
| `/contact` | `pages/Contact.tsx` | Contact form (composes a `mailto:`), socials, FAQ, availability |
| `*` | `pages/NotFound.tsx` | Paper-styled 404 |

Every route renders inside `components/layout/Layout.tsx`, which provides the "paper poster in a dark frame" shell, the sticky header, the footer, the intro loader, the custom cursor ring, the page-wipe transition and the scroll rail.

---

## How the content layer works

`src/lib/data.ts` is the single source of truth for copy: profile, socials, skills, services, process, featured projects, repository fallbacks, lab tools, timeline, principles, FAQ, nav links and game data. Editing a string there updates it everywhere.

`src/lib/github.ts` fetches the profile and up to 100 public repositories from the GitHub REST API (`Adarshukumar`), derives stars and language stats, caches the payload in `localStorage` for five minutes and falls back to cached data and then to `REPO_FALLBACK` when the API is unavailable or rate-limited. The header shows a "Live from api.github.com" badge when a real fetch succeeded.

Global state lives in three small contexts: `ThemeContext` (light/dark, persisted), `ToastContext` (status messages) and `GithubContext` (profile, repos, sync status, manual re-sync).

---

## Project structure

```
src/
├── App.tsx                  # route table + providers
├── main.tsx                 # root render, BrowserRouter
├── index.css                # design tokens, Tailwind theme, all custom CSS
├── components/
│   ├── layout/              # Header, Footer, Layout shell
│   ├── home/Hero.tsx        # hero section
│   ├── fx/Effects.tsx       # intro loader, cursor ring, page wipe, scroll rail
│   ├── ui/                  # Reveal, Magnetic, Marquee, Poster, ImageBand, SectionHeading
│   ├── profiles/            # GithubProfileCard, IdGrid (social cards)
│   ├── skills/SkillRow.tsx
│   ├── arcade/MemoryGame.tsx
│   ├── contact/ContactBand.tsx
│   └── Icons.tsx            # brand icons (HuggingFace, etc.)
├── context/                 # theme, toast, GitHub providers
├── lib/                     # data, github client, helpers
└── pages/                   # Home, About, Work, Stack, Lab, Arcade, Contact, NotFound
public/img/                  # photographic bands (code, delhi, desk, neural)
```

---

## Design system

All colors, fonts and spacing tokens are CSS custom properties in `src/index.css`, exposed to Tailwind through `@theme inline` (`bg-paper`, `text-ink`, `border-line`, `text-acid`, …). Light and dark themes swap the token values under `html.dark` — no duplicated component classes.

Type: Pixelify Sans for display, DM Sans for body, Instrument Serif for editorial italics, Allura for the AK monogram, JetBrains Mono for code. Fonts load from Google Fonts in `index.html`.

Accessibility and motion: semantic landmarks, labelled sections, focus-visible styles, `aria-label` on icon-only controls, live regions for toasts, and every animation respects `prefers-reduced-motion`.

---

## Running locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc -b && vite build → dist/
npm run preview  # serve the production build
npm run lint     # ESLint
```

Node 20+ recommended (Vercel builds this project on Node 24).

---

## Deploying to Vercel

The repo ships a hardened `vercel.json`:

- framework `vite`, `npm ci` install, `npm run build`, output `dist`
- SPA rewrite: every unknown path falls back to `index.html`
- immutable one-year caching for hashed `/assets/*`, a week for `/img/*`
- `nosniff`, `SAMEORIGIN`, strict referrer policy and a locked-down permissions policy

The live project is **`aduwebs`** (`prj_IArXIau0UCA3azcZd0mI8YgC884C`) in the `devadarshukumar-6419` Vercel account, with the production alias **https://aduwebs.vercel.app**.

Redeploy from this checkout:

```bash
npx vercel link          # once — pick the existing "aduwebs" project
npx vercel --prod        # build + deploy to production
```

A GitHub-integration deploy (push-to-deploy) can be enabled on the project once the Vercel GitHub app is installed for the `Adarshukumar` account; until then deploy from the CLI or create a deployment against the repository/branch.

---

## Notes

- The site is fully static; there are no server functions or environment variables to configure.
- GitHub API requests are unauthenticated, so the UI degrades gracefully to cached/fallback data when the rate limit is hit.
- `npm run lint` reports a handful of stylistic rules from `eslint-plugin-react-hooks` (set-state-in-effect) and `react-refresh` (context files export hooks), plus historically unused symbols that have now been removed. These do not affect the build.
