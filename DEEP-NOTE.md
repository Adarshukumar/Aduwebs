# 🔍 DEEP NOTE — The Aduwebs (bestone) Site, Fully Understood

> **What this is:** one complete document explaining **every part** of the site — how every angle looks, how each piece is built, every animation, and the full creation process.
> **How it was made:** the site was opened in a real headless Chrome and screenshotted from **35 angles** (desktop / mobile / dark / live-GitHub-data / loading / modal / game — see `screenshots/`), and **all 4,123 lines of code were read line-by-line** (CSS lines 1–2870, HTML 2871–3362, JS 3378–4122).
> **Scope:** `index.html` = exact copy of `uploads/bestone.html`. Nothing in this note guesses — everything is verified against code or pixels.

---

## 1. The Big Picture

The site is a **single self-contained HTML file** (121 KB, no build step, no framework, no external CSS/JS). One file holds three layers:

| Layer | Lines | Contents |
|---|---|---|
| `<style>` | 1 – 2870 | Entire design system: tokens, layout, animations, responsive rules |
| HTML body | 2871 – 3362 | Loader, header, 8 sections, dialog, toast, SVG icon sprite (23 icons) |
| JSON-LD + `<script>` | 3362 – 4122 | SEO schema + all logic (theme, nav, GitHub engine, game) in one IIFE |

**External dependencies (only 2):** Google Fonts (4 families) and the public **GitHub REST API** (`api.github.com/users/Adarshukumar`). Everything else — icons, gradients, game, charts — is generated in-file.

**The core idea:** the page is a *live* portfolio. Static editorial design on the surface; underneath, a small data engine fetches Adarsh's real GitHub profile + repositories on every load and re-renders the work sections. If the API fails, built-in fallback content keeps the design intact.

---

## 2. Design Language (the "look")

### 2.1 The Shell
The whole site sits inside a **rounded "paper card"** (`.shell`, max-width 1510px, 21px radius, deep shadow) floating on a near-black (`#050505`) page background with a 22px margin frame. This framed-poster look is the site's signature. On small phones (≤700px) the shell goes full-bleed (no margin/radius) — screenshot `30-mobile-light-hero.png`.

### 2.2 Color Tokens
```css
--ink:#101010  --paper:#f5f3ee  --surface:#ffffff  --muted:#68665f
--line: ink@14%  --line-strong: ink@26%
--acid:#c8ff37 (electric lime)  --blue:#4b58ff  --red:#ff4f3d
```
Dark theme (`html.dark`) inverts ink/paper to `#f4f1e9` on `#101010` — the *same* variables flip, so every component re-skins automatically. Accent colors stay constant in both themes.

### 2.3 Typography System (4 fonts, each with a job)
| Font | Role | Where you see it |
|---|---|---|
| **Pixelify Sans** | Display / digital voice | Hero name, "OPEN SOURCE", "LET'S TALK", stats, posters, game, loader "+" |
| **Instrument Serif** (+italic) | Editorial voice | Section titles ("Product thinking, *made tangible.*"), modal title, game-result heading |
| **Allura** (script) | Handwritten signature | Logo "AK+" in header, loader mark |
| **DM Sans** | Body/UI text | Everything else (11–15px, tight, utilitarian) |

The tension between *pixel* (code/arcade) and *serif italic* (editorial/human) **is** the brand. Body type is deliberately tiny (10–13px labels, letterspaced uppercase micro-labels) to make the giant display type feel even bigger.

### 2.4 Texture & Detail Language
- **Dot grids** (radial-gradient 9–10px) fade in on the hero's right half, project posters, and game board.
- **Hairline rules everywhere** — sections are separated by 1px lines and column dividers, like a newspaper grid.
- **Outline text** — second lines of big titles use `-webkit-text-stroke` with transparent fill ("Kumar", "IN THE OPEN.", "LET'S BUILD.").
- **Organic blobs** — morphing border-radius shapes (42% 58% 64% 36%…) animate in the GitHub + Contact sections and as the page-wipe.
- **Grayscale→color photos** — avatar images render `grayscale(1)` and colorize on hover.

---

## 3. Global Systems (present on every scroll position)

### 3.1 Intro Loader — screenshot `20-loader-real.png`
Full-screen `#080808` layer, z-index 9999. Center: script **"AK"** (88px Allura) with a pixel **"+"**, a 110px hairline that sweeps in (`loaderLine`, translateX −100%→0), and micro-caption "PORTFOLIO LOADING".
- Shows **once per browser session** (`sessionStorage: adarsh-intro-seen`).
- Timeline: mark pops in (scale .8, rotate −8° → 1) → line sweeps → at **1150ms** JS adds `.is-done` → the whole layer **iris-outs** via `clip-path: circle(150%) → circle(0%)` over 1.05s (`21-loader-exit.png`) → element removed from DOM.
- No-JS / repeat visit / reduced-motion → loader never displays (`html.intro-skipped`).

### 3.2 Page Wipe (anchor navigation transition)
Clicking any in-page link doesn't just scroll: a **145vmax organic blob** anchored offscreen bottom-right scales 0→1 (rotating 0→14°) covering the screen at ~48% of 0.95s, the scroll jumps at 260ms underneath it, then the blob shrinks away rotating to 28°. This is why nav clicks feel like page changes.

### 3.3 Custom Cursor
A 30px ring (`mix-blend-mode:difference`, so it inverts over anything) chases the mouse with **lerp smoothing (×0.16 per frame)** via `requestAnimationFrame`. Grows to 48px + white fill over interactive elements. Only activates on fine pointers (mouse), hidden ≤700px and for reduced-motion.

### 3.4 Scroll Progress Rail
Fixed at the right edge (outside the shell, on the black frame): vertical % counter `000–100` in pixel font + 110px track that fills. The header's ↑ button is also a **conic-gradient progress ring** driven by the same %. Rail hides ≤1200px.

### 3.5 Header
Sticky, blurred (`backdrop-filter: blur(18px)` over 88% paper), 3-column grid: script logo / centered nav / actions. Nav links get an underline sweep + **scroll-spy** active state (IntersectionObserver, rootMargin −38%/−52%). Actions: theme toggle (sun/moon swap) and the progress-ring top button. ≤980px: nav becomes a burger; ≤430px the theme button hides entirely.

### 3.6 Theme Engine
`localStorage: adarsh-theme` → else OS `prefers-color-scheme`. Toggling just flips `html.dark`; a 0.4s background/color transition on `.shell` cross-fades the whole site (screenshots `11/12/13` dark set).

### 3.7 Reveal-on-Scroll
`.reveal` elements start `opacity:0; translateY(38px)` (only when JS is on: `html.js`) and rise in over 0.8s when 12% visible. `reveal-delay-1/2/3` add 80ms steps. One-shot (unobserved after firing).

### 3.8 Toast + Dialog
- **Toast:** bottom-right pill, slides up 12px + fades; auto-hides 2.6s. Used for email-copy + sync errors.
- **Modal:** native `<dialog>` (top-layer, `::backdrop` blur 8px + 68% black), 760px wide, gradient poster header + serif-italic title + 3-col meta + repo/live buttons. Closes via ×, Esc, or backdrop click (coordinate check). Screenshot `24-live-modal.png` — verified working with real data.

### 3.9 Mobile Menu
Fixed inset card (10px frame, radius 18) that scales 0.96→1 + fades; giant pixel links (42–76px) that slide 8px and turn acid on hover; always dark (`#0c0c0c`) in both themes. Body scroll locks. Screenshot `31-mobile-light-menu.png`. ⚠️ **Has a stacking bug — see §10.1.**

---

## 4. Section-by-Section (how each angle looks + how it's built)

### 4.1 HERO — `22-live-hero.png` (light), `11-dark-hero.png` (dark), `30` (mobile)
**Look:** Top meta row (green pulsing availability dot · role · location). Then the name at up to **12rem Pixelify**: "Adarsh" solid, "Kumar" outlined and indented 15%. Below-left, the statement with an underlined strong phrase; below-right, two pill buttons (solid + outline, magnetic). Right column: the **profile card** — a tall black portrait card (GitHub avatar full-bleed, grayscale; huge pixel initials as fallback art) with "PROFILE / 001 · OPEN TO IDEAS" top labels and pixel name at the bottom over a scrim gradient. Bottom: a 4-cell stat strip ruled by hairlines (18 repos · 1 follower · 16 stars · 24/7).
**Built:** CSS grid `1.55fr / 0.55fr`; entrance choreographed after loader: title lines `heroLineIn` (rise 70px + un-squash scaleY .8→1, staggered 50/160ms), bottom row fades at 380ms. Stats + card text are **filled by the GitHub engine** (§6); before data arrives they show "—". Buttons use the magnetic hover system (translate toward cursor by 18–28% of offset).

### 4.2 MARQUEE
Black band bleeding past the shell padding (width +44px, −22px offset), pixel text *"DESIGN + CODE + SYSTEMS + RESEARCH + SHIP + LEARN"* looping every 27s (two identical items, translateX −50%), acid "+" separators, pauses on hover.

### 4.3 ABOUT — `03-about.png`
**Look:** Serif headline "Product thinking, *made tangible.*" with a right-aligned muted description. A huge lead sentence (up to 57px) with serif-italic phrase inline ("*simple enough to use*"), bio paragraph + "More on LinkedIn ↗" link beside it. Then 3 ruled service cells (compass / code / bulb icons in circles).
**Built:** bio text is **live-rewritten from the GitHub bio** if one exists (`profile.bio` + appended sentence). Service cards have a **circle-wipe hover**: an ink disc grows from the bottom-right corner (border-radius 50% 0 0, 0→150%) inverting the card.

### 4.4 SELECTED WORK — `23-live-work.png`, `25-live-work-filter-web.png`
**Look:** Serif "Things made *in the open.*" + filter pills (All/Web/Systems/Other) + count ("6 FEATURED PROJECTS"). Each project is a 3-column editorial row separated by hairlines: left copy (index "01" pinned top, title/description/View-project pinned **bottom** via `margin-bottom:auto` — the airy void is intentional), center **generated poster** (near-square gradient card, dot-grid texture, blurred white orb + ring, giant pixel title, meta corners), right meta column (Role / Primary stack chips with language dots / Last updated / repo link).
**Built:** rows are **rendered from GitHub repos** (non-forks, first 6 by last-updated). Poster gradients cycle through 6 preset pairs by index. Filter tabs re-render by language family (`workType()`: JS/TS/HTML/CSS/Vue/Svelte→Web; Java/Python/C/C++/Go/Rust/PHP/Shell→Systems; else Other). Row/poster clicks open the dialog (§3.8). Poster hover: lifts 8px, tilts −0.5°, orbs drift, title rises. If the API fails → 3 built-in fallback projects render instead (`04-work.png`).

### 4.5 GITHUB (dark inset panel) — `26-live-github.png`, `27-live-repo-search.png`, `06-github.png` (fallback state)
**Look:** A rounded **black panel inset 22px inside the shell** — a room within the room. Giant pixel "OPEN SOURCE, *IN THE OPEN.*" (solid + outline), an animated **acid-lime blob** morphing top-right (8s border-radius morph + rotate) behind a larger outlined blob (11s float). Glassy profile card (blurred, white@4.5%): circular avatar, name, @handle, bio, profile link. Four pixel stats across ruled cells. Then the **repo browser**: search input, language `<select>`, "Sync now" button; a scrollable list (max-height 640px) of repo rows (GitHub icon + name · truncated description · badges/language-dot/★/⑂); footer with status text + Load more.
**Built:** fully driven by §6 — search filters on name+description+topics as you type; language filter incl. "Other"; pagination reveals 30 at a time; Sync re-fetches (icon spins while loading). ⚠️ **Two live bugs visible in `26` — see §10.2/§10.3.**

### 4.6 PROCESS — code-verified (screenshot pending re-verify, see §10.7)
Pixel mega-heading "A USEFUL METHOD." (up to 140px) + intro paragraph, then **3 ruled columns**: 01 Discover / 02 Make / 03 Refine, each with pixel step-number, 70px of air, heading, and short copy. Stacks to one column ≤700px.

### 4.7 ARCADE (Memory Game) — `29-game-one-flip.png`, `08`, `13`, `34`
**Look:** Serif "Play the *memory game.*" Then a bordered cabinet: left sidebar (pixel "MEMORY" title, how-to, ruled stat cells TIME/MOVES/MATCHED, live status line, full-width Restart pill pinned bottom) and right board area (dot-grid floor) with a **4×4 grid of cards**. Card fronts are paper-light with a pixel "?" and a tiny corner dot; backs are black with a white line icon (code, bike, star, send, bulb, gamepad, camera, compass). Matched pairs turn **acid lime** with a pop. Win state: blurred overlay + rising card with lime ★ badge and serif-italic "Perfect match."
**Built:** deck = 8 SVG symbols ×2, Fisher-Yates shuffle. Flip = CSS 3D (`rotateY(180deg)`, preserve-3d, 0.5s). State machine in JS: first flip starts the 1s-interval timer; two flips = 1 move; mismatch locks board 760ms then flips back; match marks `.is-matched` (`matchedPop` scale keyframe); 8/8 → win overlay + best score saved (`localStorage: adarsh-memory-best`). Fully keyboard/screen-reader labeled (`aria-label` updates per card).

### 4.8 CONTACT + FOOTER — `09-contact.png`, `35-mobile-contact.png`
Black finale (full-bleed inside shell): morphing outline blob behind, kickers left/right, then **"LET'S TALK. / LET'S BUILD."** at up to 170px pixel (solid over outline). Ruled bottom row: invitation copy with underlined email; two light pills — "Start a conversation" (mailto) and "Copy email" (Clipboard API → toast; falls back to mailto). Footer: © year (auto), 4 circular social icons (mail/LinkedIn/Instagram/GitHub — invert + lift on hover), "Designed & built with intention".

---

## 5. Animation Catalog (every motion in the file)

| # | Animation | Where | Duration / Easing | Trigger |
|---|---|---|---|---|
| 1 | `loaderMark` scale/rotate-in | Loader AK | 1s ease | Page load (1st/session) |
| 2 | `loaderLine` sweep | Loader hairline | 1s @0.15s delay | Page load |
| 3 | `loaderAway` clip-path iris-out | Loader exit | 1.05s | JS timer 1150ms |
| 4 | `heroLineIn` rise+un-squash ×2 | Hero title lines | .9s, stagger 50/160ms | `body.ready` |
| 5 | `heroFadeIn` | Hero statement+buttons | .8s @380ms | `body.ready` |
| 6 | `availabilityPulse` | Green dot halo | 2.3s ∞ | Always |
| 7 | `marquee` translateX −50% | Marquee band | 27s linear ∞ (pause: hover) | Always |
| 8 | Reveal rise (38px) | `.reveal` blocks | .8s + 80ms steps | Scroll into view |
| 9 | Underline sweep | Nav links | .35s | Hover/active |
| 10 | Circle-wipe fill | Service cards | .55s | Hover |
| 11 | Poster lift/tilt + orb drift | Project posters | .6–.8s | Hover |
| 12 | Photo grayscale→color + zoom | Profile card | .5–.8s | Hover |
| 13 | `blobFloat` / `blobMorph` | GitHub blobs | 11s / 8s ∞ alternate | Always |
| 14 | `spin` | Sync button icon | .9s linear ∞ | While syncing |
| 15 | Card flip `rotateY` | Memory cards | .5s | Click |
| 16 | `matchedPop` scale 1.08 | Matched pair | .45s | On match |
| 17 | Result card rise | Game win overlay | .5s | Win |
| 18 | `contactBlob` rotate/scale | Contact backdrop | 9s ∞ alternate | Always |
| 19 | `blobWipe` | Page transition blob | .95s | Anchor click |
| 20 | Cursor ring lerp + grow | Custom cursor | rAF / .2s | Mouse move/hover |
| 21 | Magnetic pull | CTA buttons (`.magnetic`) | rAF-follow | Mouse over |
| 22 | Menu scale/fade + burger→× morph | Mobile menu | .45–.55s | Burger tap |
| 23 | Theme cross-fade | Whole shell | .4s | Theme toggle |
| 24 | Toast rise | Toast pill | .3s | Copy/sync events |
| — | **Reduced-motion**: global kill-switch collapses ALL of the above to 0.01ms and forces reveals visible | | | OS setting |

One easing rules everything: `--ease: cubic-bezier(0.22, 1, 0.36, 1)` (a soft "expo-out") — that's why all motion feels related.

---

## 6. The JavaScript Engines

### 6.1 GitHub Sync Engine (`loadGithub()`)
1. Fires **two parallel fetches** with proper API headers: `GET /users/Adarshukumar` and `GET /users/Adarshukumar/repos?sort=updated&per_page=100&type=owner`.
2. Filters repos to owner-owned; stores in `allRepositories`.
3. `applyProfile()` paints: hero location/company, GitHub card name/handle, bio (hero statement + about bio get rewritten **only if a bio exists**), avatars (`?s=600` hero / `?s=400` card), counts everywhere, total stars (summed client-side).
4. Renders **Featured Work** (non-forks, top 6, filterable) and the **Repo Browser** (search + language + 30-per-page "Load more" + live status line).
5. Failure path (offline/rate-limit): keeps design alive with 3 fallback projects, shows an in-list error with a direct GitHub link, and toasts "GitHub sync is temporarily unavailable". Verified in `04/06` screenshots.
6. Safety: all API strings pass through `escapeHtml()` before hitting `innerHTML` (XSS-safe); dates/numbers formatted via `Intl`.

**Live numbers observed during audit:** 18 repos · 1 follower · 2 following · 16 total stars; profile name "Adarsh kumar", company "Adarsh Ltd....", location/bio `null`.

### 6.2 Navigation Engine
Anchor clicks are intercepted → menu closes → blob wipe runs → smooth scroll fires at 260ms. Scroll-spy (IO), scroll-% rail + conic ring (scroll listener), back-to-top reuses the same wipe navigation.

### 6.3 Pointer Engine
Custom cursor (rAF lerp loop) + magnetic buttons (mousemove offset math) — both gated to `pointer:fine` and disabled under reduced-motion. Cursor hover targets are bound once at startup (elements added later, e.g. repo rows, don't grow the ring — minor).

### 6.4 Persistence Map
| Key | Storage | Purpose |
|---|---|---|
| `adarsh-theme` | localStorage | dark/light choice |
| `adarsh-intro-seen` | sessionStorage | loader once per session |
| `adarsh-memory-best` | localStorage | best (fewest) moves |

### 6.5 SEO/Meta Layer
Description + OpenGraph tags, `theme-color`, and a **JSON-LD Person schema** (name, jobTitle, email, sameAs links). Semantic landmarks, skip-friendly heading order, `aria-live` on dynamic regions (project list, repo list, game status, toast).

---

## 7. Responsive System

| Breakpoint | What changes |
|---|---|
| **≤1200px** | Hero title scales down; project columns tighten; progress rail hides |
| **≤980px** | Desktop nav → burger + overlay menu; hero stacks (card max 520px, right-aligned); about 1-col; project rows 2-col with meta as full-width strip; arcade stacks (sidebar on top) |
| **≤700px** | **Shell goes full-bleed** (no frame/radius); hero stats 2×2; services stack; projects 1-col (poster 1/0.9); GitHub stats 2×2; repo rows 1-col; process stacks; cursor hidden; footer reflows |
| **≤430px** | Theme button hidden; hero actions 1-col; tighter game grid (4px gaps); smaller card |

Type is fluid throughout via `clamp()` — e.g. hero title `clamp(5.5rem, 12.2vw, 12rem)`.

---

## 8. How the Site Was Created (the build process, end-to-end)

1. **Concept:** an editorial "paper poster in a dark frame" — Swiss-grid hairlines + arcade pixel type + one acid accent. Everything derives from ~10 CSS variables.
2. **Single-file construction:** semantic HTML skeleton (header/main/8 sections/dialog) → design system in one `<style>` (tokens → base → components → sections → animations → media queries → reduced-motion) → SVG sprite for icons (no icon font/CDN) → one IIFE script module by feature.
3. **Data wiring:** GitHub REST API as a free CMS — the portfolio *content* lives in GitHub itself (repos, descriptions, topics, avatar), the file is just the rendering skin. Fallback dataset baked in for offline.
4. **Motion design:** one shared easing curve; loader→hero choreography sequenced by a single `body.ready` class; scroll effects via two IntersectionObservers (reveal + spy).
5. **Hardening:** `escapeHtml` on all remote strings, ARIA roles/labels/live-regions, keyboard operability (cards are focusable, Enter/Space opens modal, Esc closes), reduced-motion support, no-JS grace (loader/reveals are JS-gated so content is visible without JS).
6. **To run/deploy:** open the file or host it anywhere static (GitHub Pages reads `index.html` from the repo root directly). No build, no env vars, no keys (unauthenticated GitHub API = 60 req/hr per visitor IP).

---

## 9. Screenshot Index (all 35 angles in `screenshots/`)

`01` hero mid-entrance · `02` hero (fallback data) · `03` about · `04` work (fallback) · `05` modal attempt (test artifact) · `06` github (fallback) · `07/08` arcade · `09` contact · `10` full desktop · `11/12/13` dark hero/work/arcade · `14` mobile hero · `15` mobile menu · `16/17/18` mobile sections (menu stuck — see §10.1) · `19` mobile full · `20` **loader** · `21` loader exit iris · `22` **live hero** · `23` live work · `24` **live modal** · `25` work filter=Web · `26` **live github (bugs visible)** · `27` repo search · `28` process (see §10.7) · `29` game flip · `30–35` mobile light set.

*Note: in screenshots, the GitHub avatar is a local AK placeholder (the avatar CDN is blocked in this sandbox) and fonts are the genuine Google font files served locally — real visitors see the real photo (grayscale) and identical type.*

---

## 10. Visual Audit — Confirmed Issues & Refinement Plan

Found by *looking* at the site + verifying each in code. Priority-ordered. **All fixes preserve the exact design** — these are correctness/polish, not redesign.

### 🔴 10.1 Mobile menu traps the close button
**Evidence:** `31-mobile-light-menu.png` — no × visible anywhere.
**Cause:** `.site-header` (z-100) creates a stacking context; the burger's `z-index:102` is trapped inside it, while `.mobile-menu` (z-101, sibling) paints over the whole header. Users can only exit by tapping a link. In light theme the (covered) button would also be near-black on black.
**Fix:** when open, raise header above menu and restyle for dark: `.menu-open .site-header{z-index:102;background:transparent;border-color:transparent;backdrop-filter:none}` + `.menu-open .brand,.menu-open .menu-button{color:#f4f1e9;border-color:rgba(255,255,255,.3)}` + `.menu-open .menu-button span{background:#f4f1e9}`.

### 🔴 10.2 GitHub avatar fallback never hides (lime AK circle overlaps stats)
**Evidence:** `26-live-github.png` + measured `display:grid 126×126` while avatar img also 126×126.
**Cause:** JS uses the `hidden` attribute, but author CSS `display:grid` (fallback) and `img{display:block}` (global reset) override the UA `[hidden]{display:none}` — and the file has **no `[hidden]` guard rule**. Also shows broken-image alt text on hero/github avatars before sync or when the API/avatar fails (`02`, `11`, `14`).
**Fix (1 line + tiny hardening):** add `[hidden]{display:none !important}` to base CSS; optionally add `onerror` fallback on avatar `<img>`s to re-show initials/fallback.

### 🔴 10.3 "Loading the public GitHub profile…" is permanent
**Evidence:** `26` — stats synced (18/1/2/16) yet bio line still says Loading…
**Cause:** bio only painted `if (profile.bio)`; Adarsh's GitHub bio is `null`.
**Fix:** in `applyProfile`, set a default bio string when `!profile.bio` (e.g. "Product designer & developer building in the open.").

### 🟠 10.4 "Sync now" refresh icon renders gigantic
**Evidence:** `06-github.png` bottom-right — icon fills the button box.
**Cause:** `.sync-button svg` has an animation rule but **no width/height** (every other icon in the file is sized; this one was missed).
**Fix:** `.sync-button svg{width:13px;height:13px}`.

### 🟠 10.5 Anchored sections slide under the sticky header
**Evidence:** `08/13/29` — "Play the" clipped at top after scrolling to #arcade; section tops tuck under the 76px header (big top-padding mostly masks it, headings still kiss the header).
**Fix:** `section[id]{scroll-margin-top:84px}` (and `.github-section` too).

### 🟡 10.6 Small polish items
- **Modal has no entrance animation** (appears instantly while everything else eases) — add a subtle `dialog[open]` rise/fade using the same `--ease`.
- **Mobile header actions pushed left** by `.header-actions{margin-right:45–48px}` ≤700px — looks unbalanced vs the flush-left logo; likely leftover. Remove.
- **Mobile has no theme toggle ≤430px** (`.theme-button{display:none}`) — phone users can't switch theme. Space exists if the 45px margin above is removed.
- **"AVAILABLE FOR SELECT PROJECTS" wraps** to 2 lines on mobile next to the dot (`30`) — allow smaller size or `white-space:nowrap` with reduced letter-spacing.
- **Dark-mode game board dots** use dark ink at 11% → invisible on dark surface; switch to a theme-aware dot color.
- **Cursor ring** uses `left/top` updates (layout) instead of `transform` (compositor) — performance micro-fix.
- **Cursor hover-grow** doesn't apply to dynamically rendered elements (project rows/repos bound after startup) — switch to event delegation (`mouseover` + `closest()`).
- **Game timer keeps running** across later browsing if you leave mid-game (seen 00:21 in `13`) — pause when board off-screen (optional).

### ⚪ 10.7 To re-verify
- `28-process.png` captured a blank frame (section content still at reveal-start `opacity:0` in headless instant-jump conditions). Code + full-page layout are correct; smooth in-page navigation passes through the trigger zone, so real users should see it animate in. Worth one manual look in a real browser.

---

## 11. Verdict

The design is **genuinely strong**: a coherent token system, a memorable pixel×serif×script type trio, disciplined hairline grids, one-easing motion language, and a clever "GitHub-as-CMS" data layer with honest fallbacks — all in one dependency-free file with real accessibility care. The issues above are small, surgical fixes (three are one-liners) that make the *existing* design behave exactly as it already looks in the good screenshots (`22`, `24`, `03`, `09`, `11`).

*— End of deep note. Companion files: `screenshots/` (35 angles), `index.html` (the site), `uploads/` (originals).*
