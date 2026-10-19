# 🗂️ Aduwebs — Structure & formatting notes

How this repo is organized and how the site file itself is built, so any future round (v3, v4…) keeps the same nice formatting and structure. Version history: [`CHANGELOG.md`](CHANGELOG.md).

## Repo map

```
Aduwebs/
├── index.html               # 🟢 THE live site — always mirrors the live version (currently v2)
├── versions/
│   ├── v1.html              # 📦 Frozen v1 — bestone original (never edit)
│   └── v2.html              # 🟢 Frozen v2 — identical to index.html right now
├── logs/
│   ├── CHANGELOG.md         # What changed in each version + versioning rules
│   └── STRUCTURE.md         # This file — layout & formatting conventions
├── DEEP-NOTE.md             # Deep audit: v1 full inspection (§1–12) + v2 addendum (§13)
├── screenshots/             # v1 evidence — 35 browser screenshots
├── screenshots-refine/      # v2 evidence — 19 browser screenshots
├── uploads/
│   ├── bestone.html         # Raw original upload #1 (source of v1) — untouched
│   └── 2nddesign.html       # Raw original upload #2 — untouched
├── redesign-draft.html      # Alternate rebuild experiment (not a version, not live)
└── assets/                  # CSS/JS used only by redesign-draft.html
    ├── css/styles.css
    └── js/app.js
```

## Site file conventions (index.html / every version)

- **Single file, no build step.** All CSS in one `<style>` in `<head>`, all JS in one `<script>` at the end of `<body>`. Fonts via Google Fonts; icons via an inline SVG sprite (`<use href="#i-…">`).
- **Line endings are CRLF** and indentation is 2 spaces (HTML), 4 inside CSS/JS blocks as shipped — keep them when editing so diffs stay clean.
- **CSS order:** design tokens (`:root` custom properties) → base/reset → utilities → header/nav → hero → sections in page order → components (cards, buttons, game) → animations → media queries (1100 / 980 / 700 / 560 px) → reduced-motion.
- **Theming:** light default; dark via `[data-theme="dark"]` on `<html>`, persisted in `localStorage`. Key tokens: `--paper`, `--ink`, `--accent` (lime), surface/border alphas. Fonts: **Sora** (display), **Inter** (UI/body), **JetBrains Mono** (labels/numbers).
- **Page order:** loader → header → hero (`#home`) → about (`#about`) → skills (`#skills`) → profiles (`#profiles`) → process (`#process`) → arcade (`#arcade`) → contact (`#contact`) → footer.
- **Scrollspy rule:** nav highlighting pairs `data-nav` (on links) with `data-section` (on sections) — if you rename a section id, rename all three (id, `data-section`, `data-nav` + `href`) together.
- **Reveal animations:** add class `reveal` (+ optional `reveal-delay-1/2/3`); an IntersectionObserver adds `visible`. New JS-rendered cards must be re-observed (see `renderSkills`).
- **JS style:** vanilla, small helpers (`$`, `$$`, `escapeHtml`, `formatNumber`), feature blocks in page order, boot calls at the bottom. Anything rendered from data lives as a top-of-block dataset (e.g. `SKILLS`).
- **Cards system (reuse before inventing):** `.project-card` rows (index · gradient poster · meta column) power Skills; `.github-profile`-style cards (avatar circle · name · handle · bio · link) power the Profiles ID batch (`.id-card`). New showcase content should slot into one of these.
- **Accessibility:** buttons get `aria-label`/`aria-expanded` where stateful, `:focus-visible` outlines, `prefers-reduced-motion` respected, `[hidden]` guarded with `display:none !important`.

## Making the next version (v3, v4, …)

1. Edit `index.html` (work from the live version).
2. Browser-check it (screenshots, interactions) — don't ship blind.
3. Freeze: `cp index.html versions/v3.html` (next number).
4. Log it: new section at the top of `logs/CHANGELOG.md` (what/why/fixed/removed) + evidence folder if screenshots were taken.
5. Update `README.md` (live version + features) if anything user-facing changed.
6. Commit with a `vN:` prefix, e.g. `v3: <summary>`, and push.
