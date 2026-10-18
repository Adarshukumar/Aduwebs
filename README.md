# Aduwebs — Adarsh Kumar Portfolio

Personal portfolio website of **Adarsh Kumar** (product designer & creative developer), rebuilt with a refined design system and a live GitHub-powered backend-in-the-browser.

## 🚀 Live preview

- **New site:** open `index.html` (or deploy the repo root to GitHub Pages / Netlify / Vercel — it's fully static, no build step).
- **Original designs (preserved):** `uploads/bestone.html`, `uploads/2nddesign.html`

## 📁 Structure

```
Aduwebs/
├── index.html                  # The new website (entry point)
├── assets/
│   ├── css/styles.css          # Design system (light + dark, responsive)
│   └── js/app.js               # All logic (theme, GitHub sync, game…)
└── uploads/
    ├── bestone.html            # Original upload — kept as-is
    └── 2nddesign.html          # Original upload — kept as-is
```

## ✨ Features

- **Live GitHub sync** — profile, avatar, stats, selected work & full repo browser are fetched from the public GitHub API (`@Adarshukumar`) on every load, with graceful fallbacks if the API is unavailable.
- **Selected Work** — filterable showcase (All / Web / Systems / Other) with generated gradient posters and a project detail modal.
- **Repo browser** — instant search, auto-built language filter, load-more pagination, manual re-sync.
- **Language mix bar** — computed live from all public repositories.
- **Memory game** — 8-pair flip game with timer, move counter, personal-best tracking (`localStorage`) and a confetti win state.
- **Design system** — light & dark themes (persisted, system-aware, no-flash), percentage preloader, page-wipe navigation, magnetic buttons, custom cursor, count-up stats, rotating role words, tilt profile card, scroll progress rail, live local-time clock.
- **Quality** — semantic HTML, ARIA labels, keyboard-accessible dialogs & cards, `prefers-reduced-motion` support, SEO meta + JSON-LD, zero runtime dependencies (only Google Fonts + the GitHub API).

## 🧑‍💻 Contact

- Email: devadarshukumar@gmail.com
- GitHub: [@Adarshukumar](https://github.com/Adarshukumar)
- LinkedIn: [adarshu07](https://www.linkedin.com/in/adarshu07/)
- Instagram: [adarshu.io](https://www.instagram.com/adarshu.io/)
