# 📜 Aduwebs — Changelog (version logs)

Every version of the site, what changed, and where it lives. **Newest first.**

## 🔁 How versioning works here

1. `index.html` is always the **live site** — it mirrors the current live version.
2. Every version is frozen forever as `versions/vN.html` (never edited after freeze).
3. A new change round = new version: build it, freeze as the next `vN`, make `index.html` match it, add an entry in this log.
4. Design baseline stays the **bestone** design language (loader, paper shell, type, motion) — versions evolve content/structure, not the look, unless Adarsh says so.

| Version | Status | File | Log |
| --- | --- | --- | --- |
| **v2** | 🟢 LIVE (= `index.html`) | `versions/v2.html` | below |
| **v1** | 📦 Archived | `versions/v1.html` | below |
| **v3** | ⬜ Next round | — | starts here when built |

Extras (not versions): `redesign-draft.html` (alternate rebuild experiment + `assets/`), `uploads/` (raw original files, untouched).

---

## v3 — next

_Not started. The next round of changes lands here: it will be built from v2, frozen as `versions/v3.html`, and logged in this section._

---

## v2 — 19 Oct 2026 — "Skills + Profiles refinement" 🟢 LIVE

**Base:** v1 · **Commit:** `191a7e3` · **Evidence:** `screenshots-refine/` (19 real-Chromium screenshots) · **Audit notes:** `DEEP-NOTE.md` §13

Why: GitHub dominated every section. Skills and Adarsh's other profiles deserved the spotlight; GitHub stays as one (still live-synced) card. Same design throughout — no visual redesign.

### Changed
- **Work section → Skills** — "Code I speak, tools I trust." Same project-card poster system, now fed by a built-in `SKILLS` dataset: Python, JavaScript, FastAPI, LangChain & RAG, React, HTML/CSS. Working filters: All / Languages / AI & APIs / Frontend. Toolbox strip below: Docker · Flask · MongoDB · Firebase · Git · WordPress · HuggingFace Spaces.
- **GitHub section → Profiles** — the live GitHub profile card + stats + slim sync bar stay exactly as loved; the repo-browser (search/filter/list) is removed and replaced by an **ID batch** in the same card style: LinkedIn (`/in/adarshu07`), Hugging Face (`@AdarshJi` · 15+ live AI tools), Instagram (`@adarshu.io`), Email. Anchor renamed `#github` → `#profiles` (section id + `data-section` + nav `data-nav` kept in sync; scrollspy untouched).
- **Hero** — stats now: 10+ languages & tools · 15+ live AI tools · freelancing since 2024 · 24/7 curiosity mode. Buttons: "Explore my skills" + "LinkedIn profile". Location line: "Delhi, India — Working worldwide".
- **About & services** — rewritten from the real LinkedIn profile: freelance since Jan 2024, 15+ tools on HuggingFace Spaces, 48-model AI chat router, B.Com (Hons) @ Dyal Singh College, University of Delhi. Services: Websites that work / AI tools & backends / Video & tech help.
- **Nav labels** — About · Skills · Profiles · Play Game · Contact.
- **Meta/SEO** — descriptions de-GitHub'd; Hugging Face added to JSON-LD `sameAs`.

### Fixed (from DEEP-NOTE §10, all browser-verified)
- 📱 Mobile-menu close trap — header rises above the open menu with light controls; real tap-to-close tested.
- `[hidden]` guard — avatar and its AK-fallback no longer overlap.
- Bio fallback — no more stuck "Loading…" when GitHub bio is empty.
- Sync (refresh) icon properly sized; anchor `scroll-margin` so sticky header never clips section titles; memory-game dot pattern now theme-aware.

### Removed (~10 KB of dead code)
- Repo list/search/language-filter/load-more, selected-work filters, project modal/`<dialog>` + all related CSS/JS. Zero dangling element references (automated check).

---

## v1 — Oct 2026 — "bestone original" 📦 Archived

**Base:** `uploads/bestone.html` (original upload, kept pristine) · **Commit:** `61dce93` · **Evidence:** `screenshots/` (35 screenshots) · **Deep audit:** `DEEP-NOTE.md` §1–12

The original design exactly as Adarsh made it — and the design baseline for every future version.

- Single-file site: intro loader, paper shell, Sora/Inter/JetBrains Mono type system, light+dark themes, page-wipe nav, magnetic buttons, cursor ring, scroll progress rail.
- GitHub everywhere: hero stats, **Selected Work** (filterable repo showcase + project modal), **GitHub section** (live profile card, stats, full repo browser with search/filter/load-more, manual sync).
- Memory game (8 pairs, timer/moves/best), process steps, contact with copy-email + mailto form.
- Known issues found in audit (mobile-menu trap, avatar overlap, stuck bio, oversized sync icon, header-clipped anchors) — all fixed in v2.
