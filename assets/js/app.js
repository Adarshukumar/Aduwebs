/* ============================================================
   ADUWEBS — Adarsh Kumar portfolio engine
   Modules: theme · preloader · cursor · nav · reveals ·
            live GitHub sync · project modal · memory game
   ============================================================ */
(() => {
  "use strict";

  /* ---------------- Utilities ---------------- */
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  const GITHUB_USER = "Adarshukumar";
  const GITHUB_URL = `https://github.com/${GITHUB_USER}`;
  const API_PROFILE = `https://api.github.com/users/${GITHUB_USER}`;
  const API_REPOS = `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&direction=desc&per_page=100&type=owner`;
  const PAGE_SIZE = 12;

  let allRepositories = [];
  let featuredFilter = "all";
  let visibleRepoCount = PAGE_SIZE;
  let githubLive = false;

  const escapeHtml = (value = "") => String(value)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#039;");

  const formatNumber = (value = 0) => new Intl.NumberFormat("en", {
    notation: value >= 10000 ? "compact" : "standard",
    maximumFractionDigits: 1
  }).format(value || 0);

  const formatDate = (date) => date
    ? new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(new Date(date))
    : "Unknown";

  const cleanRepoName = (name = "Project") => name
    .replace(/\.git$/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();

  const LANGUAGE_COLORS = {
    JavaScript: "#f1df57", TypeScript: "#4b8bff", HTML: "#ff6b4a", CSS: "#c76cff",
    Python: "#4cc9f0", Java: "#ff8d55", "C++": "#65c6c8", C: "#8b9bb4", "C#": "#7ee787",
    Go: "#42d7ed", Rust: "#e6a36d", PHP: "#8b7cff", Swift: "#ff704f", Kotlin: "#b16cff",
    Dart: "#36c5f0", Shell: "#8ddb8b", Vue: "#41d9a5", Svelte: "#ff8a5c", Ruby: "#ff5d7a",
    Lua: "#6c8cff", Dockerfile: "#5cc8e6", Jupyter: "#f2a35c", "Jupyter Notebook": "#f2a35c"
  };
  const languageColor = (language) => LANGUAGE_COLORS[language] || "#b4afa5";

  const workType = (language) => {
    const web = ["JavaScript", "TypeScript", "HTML", "CSS", "Vue", "Svelte"];
    const systems = ["Java", "Python", "C", "C++", "C#", "Go", "Rust", "PHP", "Shell", "Dockerfile", "Ruby", "Kotlin", "Swift", "Dart"];
    if (web.includes(language)) return "web";
    if (systems.includes(language)) return "systems";
    return "other";
  };

  const gradientFor = (index) => {
    const gradients = [
      ["#1f5b45", "#8ee97d"], ["#ff614d", "#8c6cff"], ["#2253c9", "#7ee7ec"],
      ["#e4a02d", "#ff6d61"], ["#6c43b5", "#f099c7"], ["#315f57", "#bedc79"],
      ["#173a5e", "#5cc8e6"], ["#7a2e4d", "#ff9d6c"]
    ];
    return gradients[Math.abs(index) % gradients.length];
  };

  const FALLBACK_PROJECTS = [
    { id: "fb-1", name: "Product Interface", description: "A product design and front-end build system for clear, thoughtful, maintainable digital experiences.", language: "JavaScript", html_url: GITHUB_URL, homepage: "", updated_at: new Date().toISOString(), stargazers_count: 0, forks_count: 0, topics: ["Design Systems", "Frontend", "Product"] },
    { id: "fb-2", name: "Open Source Toolkit", description: "A home for practical tools, experiments, and reusable components created in public and improved through feedback.", language: "TypeScript", html_url: GITHUB_URL, homepage: "", updated_at: new Date().toISOString(), stargazers_count: 0, forks_count: 0, topics: ["Open Source", "Tools", "Utilities"] },
    { id: "fb-3", name: "Research to Delivery", description: "A structured workflow for moving from user research and rough ideas to validated, usable product experiences.", language: "Python", html_url: GITHUB_URL, homepage: "", updated_at: new Date().toISOString(), stargazers_count: 0, forks_count: 0, topics: ["Research", "Prototyping", "Delivery"] }
  ];

  /* ---------------- Toast ---------------- */
  const toast = $("#toast");
  let toastTimer;
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
  }

  /* ---------------- Theme ---------------- */
  const themeButton = $("#themeToggle");
  function syncThemeButton() {
    const dark = document.documentElement.classList.contains("dark");
    themeButton.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
  }
  syncThemeButton();
  themeButton.addEventListener("click", () => {
    const dark = document.documentElement.classList.toggle("dark");
    try { localStorage.setItem("adu-theme", dark ? "dark" : "light"); } catch (e) { /* ignore */ }
    syncThemeButton();
    showToast(dark ? "Dark mode on" : "Light mode on");
  });

  /* ---------------- Preloader ---------------- */
  const preloader = $("#preloader");
  const preloaderFill = $("#preloaderFill");
  const preloaderCount = $("#preloaderCount");
  let introSeen = false;
  try { introSeen = Boolean(sessionStorage.getItem("adu-intro-seen")); } catch (e) { /* ignore */ }

  function finishIntro() {
    document.body.classList.add("ready");
    if (preloader) {
      preloader.classList.add("done");
      setTimeout(() => preloader.remove(), 1000);
    }
  }

  if (introSeen || reducedMotion || !preloader) {
    if (preloader) preloader.remove();
    document.body.classList.add("ready");
  } else {
    try { sessionStorage.setItem("adu-intro-seen", "true"); } catch (e) { /* ignore */ }
    let progress = 0;
    const tick = setInterval(() => {
      progress = Math.min(100, progress + 3 + Math.random() * 9);
      preloaderFill.style.width = `${progress}%`;
      preloaderCount.textContent = `${Math.floor(progress)}%`;
      if (progress >= 100) { clearInterval(tick); setTimeout(finishIntro, 220); }
    }, 55);
    setTimeout(() => { clearInterval(tick); finishIntro(); }, 3200); // safety hatch
  }

  /* ---------------- Custom cursor ---------------- */
  if (finePointer && !reducedMotion) {
    const dot = $("#cursorDot");
    const ring = $("#cursorRing");
    let mouseX = -60, mouseY = -60, ringX = -60, ringY = -60;

    window.addEventListener("mousemove", (event) => {
      mouseX = event.clientX; mouseY = event.clientY;
      dot.style.left = `${mouseX}px`; dot.style.top = `${mouseY}px`;
      dot.classList.add("on"); ring.classList.add("on");
    }, { passive: true });
    document.addEventListener("mouseleave", () => { dot.classList.remove("on"); ring.classList.remove("on"); });
    window.addEventListener("mousedown", () => ring.classList.add("down"));
    window.addEventListener("mouseup", () => ring.classList.remove("down"));

    (function animateRing() {
      ringX += (mouseX - ringX) * 0.17;
      ringY += (mouseY - ringY) * 0.17;
      ring.style.left = `${ringX}px`; ring.style.top = `${ringY}px`;
      requestAnimationFrame(animateRing);
    })();

    const hoverSelector = "a, button, input, select, .project-poster, .memory-card, .lang-segment";
    document.addEventListener("mouseover", (event) => {
      ring.classList.toggle("hover", Boolean(event.target.closest(hoverSelector)));
    });
  }

  /* ---------------- Magnetic buttons ---------------- */
  if (finePointer && !reducedMotion) {
    $$(".magnetic").forEach((element) => {
      element.addEventListener("mousemove", (event) => {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        element.style.transform = `translate(${x * 0.18}px, ${y * 0.28}px)`;
      });
      element.addEventListener("mouseleave", () => { element.style.transform = ""; });
    });
  }

  /* ---------------- Profile card tilt ---------------- */
  const profileCard = $("#profileCard");
  if (profileCard && finePointer && !reducedMotion) {
    profileCard.addEventListener("mousemove", (event) => {
      const rect = profileCard.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      profileCard.style.transform = `rotateY(${(px - 0.5) * 9}deg) rotateX(${(0.5 - py) * 9}deg)`;
      profileCard.style.setProperty("--mx", `${px * 100}%`);
      profileCard.style.setProperty("--my", `${py * 100}%`);
    });
    profileCard.addEventListener("mouseleave", () => { profileCard.style.transform = ""; });
  }

  /* ---------------- Navigation ---------------- */
  const menuButton = $("#menuButton");
  function closeMenu() {
    document.body.classList.remove("menu-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
  }
  menuButton.addEventListener("click", () => {
    const open = document.body.classList.toggle("menu-open");
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  });
  window.addEventListener("resize", () => { if (window.innerWidth > 980) closeMenu(); });

  const pageWipe = $("#pageWipe");
  function navigateTo(element) {
    if (!element) return;
    closeMenu();
    if (!reducedMotion && pageWipe) {
      pageWipe.classList.remove("run");
      void pageWipe.offsetWidth; // restart animation
      pageWipe.classList.add("run");
    }
    setTimeout(() => {
      element.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
    }, reducedMotion ? 0 : 270);
  }

  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = link.getAttribute("href");
      if (!target || target === "#") return;
      const destination = $(target);
      if (!destination) return;
      event.preventDefault();
      navigateTo(destination);
    });
  });
  $("#scrollTop").addEventListener("click", () => navigateTo($("#top")));

  /* scroll-spy */
  const navLinks = $$(".desktop-nav .nav-link");
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => link.classList.toggle("active", link.dataset.nav === entry.target.dataset.section));
      });
    }, { rootMargin: "-38% 0px -52% 0px", threshold: 0 });
    $$("[data-section]").forEach((section) => spy.observe(section));
  }

  /* scroll progress */
  const scrollPercent = $("#scrollPercent");
  const scrollFill = $("#scrollFill");
  const scrollButton = $(".scroll-button");
  function updateScrollProgress() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const percentage = scrollable > 0 ? Math.round(Math.min(window.scrollY / scrollable, 1) * 100) : 0;
    scrollPercent.textContent = String(percentage).padStart(3, "0");
    scrollFill.style.height = `${percentage}%`;
    scrollButton.style.setProperty("--progress", `${percentage}%`);
  }
  window.addEventListener("scroll", updateScrollProgress, { passive: true });
  window.addEventListener("resize", updateScrollProgress);
  updateScrollProgress();

  /* ---------------- Reveal on scroll ---------------- */
  if ("IntersectionObserver" in window && !reducedMotion) {
    const revealer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add("in"); revealer.unobserve(entry.target); }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -6% 0px" });
    $$(".reveal").forEach((element) => revealer.observe(element));
  } else {
    $$(".reveal").forEach((element) => element.classList.add("in"));
  }

  /* ---------------- Count-up animation ---------------- */
  function countUp(element, target) {
    if (!element) return;
    element.dataset.countTo = String(target);
    if (reducedMotion) { element.textContent = formatNumber(target); return; }
    const duration = 1100;
    const start = performance.now();
    (function frame(now) {
      const ratio = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - ratio, 3);
      element.textContent = formatNumber(Math.round(target * eased));
      if (ratio < 1) requestAnimationFrame(frame);
    })(start);
  }

  /* ---------------- Hero word rotator ---------------- */
  const rotateTrack = $("#rotateTrack");
  if (rotateTrack && !reducedMotion) {
    const total = rotateTrack.children.length;
    let index = 0;
    rotateTrack.appendChild(rotateTrack.children[0].cloneNode(true)); // seamless loop
    setInterval(() => {
      index += 1;
      rotateTrack.style.transition = "";
      rotateTrack.style.transform = `translateY(-${index * 1.35}em)`;
      if (index === total) {
        setTimeout(() => {
          rotateTrack.style.transition = "none";
          rotateTrack.style.transform = "translateY(0)";
          index = 0;
        }, 750);
      }
    }, 2800);
  }

  /* ---------------- Live GitHub engine ---------------- */
  function applyAvatar(url) {
    if (!url) return;
    const sized = `${url}${url.includes("?") ? "&" : "?"}s=640`;
    const heroAvatar = $("#heroAvatar");
    heroAvatar.src = sized;
    heroAvatar.hidden = false;
    $("#heroInitials").style.display = "none";
    const ghAvatar = $("#githubAvatar");
    ghAvatar.src = `${url}${url.includes("?") ? "&" : "?"}s=200`;
    ghAvatar.hidden = false;
    $("#githubAvatarFallback").style.display = "none";
  }

  function applyProfile(profile) {
    if (!profile) return;
    const displayName = (profile.name || "Adarsh Kumar").trim();
    $("#githubProfileName").textContent = displayName;
    $("#githubProfileHandle").textContent = `@${profile.login || GITHUB_USER}`;
    const bio = (profile.bio || "").trim();
    $("#githubBio").textContent = bio || "Product designer and creative developer — building useful things in the open.";
    if (bio) $("#aboutBio").textContent = bio;
    $("#profileCompany").textContent = (profile.company || "Independent creator").trim();
    const location = (profile.location || "Worldwide").trim();
    $("#profileLocation").textContent = location;
    $("#heroLocation").textContent = profile.location
      ? `${location} — working worldwide`
      : "Ghaziabad, India — working worldwide";
    applyAvatar(profile.avatar_url);

    countUp($("#heroRepos"), profile.public_repos || 0);
    countUp($("#heroFollowers"), profile.followers || 0);
    countUp($("#githubRepos"), profile.public_repos || 0);
    countUp($("#githubFollowers"), profile.followers || 0);
    countUp($("#githubFollowing"), profile.following || 0);
  }

  function projectKey(repo) { return String(repo.id ?? repo.name); }

  function renderFeaturedProjects() {
    const container = $("#projectList");
    let projects = (allRepositories.length ? allRepositories : FALLBACK_PROJECTS)
      .filter((repo) => !repo.fork);

    /* Prefer repos with a description & recent activity for the showcase */
    projects.sort((a, b) => {
      const score = (r) => (r.description ? 2 : 0) + Math.min(r.stargazers_count || 0, 3);
      return score(b) - score(a) || new Date(b.updated_at) - new Date(a.updated_at);
    });

    if (featuredFilter !== "all") {
      projects = projects.filter((repo) => workType(repo.language) === featuredFilter);
    }

    if (!projects.length) {
      container.innerHTML = `<div class="repo-empty" style="color:var(--muted)">Nothing in this category yet — more is being built. Check the GitHub section below for everything.</div>`;
      $("#workCount").textContent = "0 featured projects";
      return;
    }

    projects = projects.slice(0, 6);
    $("#workCount").textContent = `${projects.length} featured ${projects.length === 1 ? "project" : "projects"}${githubLive ? " · live" : ""}`;

    container.innerHTML = projects.map((repo, index) => {
      const title = cleanRepoName(repo.name);
      const description = repo.description || "An open-source project built, documented, and shared in public.";
      const language = repo.language || "Open Source";
      const [a, b] = gradientFor(index);
      const topics = (repo.topics || []).slice(0, 3);
      return `
        <article class="project-row" style="--i:${index}">
          <div class="project-copy">
            <span class="project-index">Project ${String(index + 1).padStart(2, "0")}</span>
            <h3 class="project-title">${escapeHtml(title)}</h3>
            <p class="project-description">${escapeHtml(description)}</p>
            <button class="project-open" type="button" data-open-project="${escapeHtml(projectKey(repo))}">
              View project <svg aria-hidden="true"><use href="#i-arrow-up-right"/></svg>
            </button>
          </div>
          <div class="project-visual-cell">
            <div class="project-poster" role="button" tabindex="0" aria-label="Open ${escapeHtml(title)} details"
                 data-open-project="${escapeHtml(projectKey(repo))}" style="--poster-a:${a};--poster-b:${b}">
              <div class="poster-top"><span>Open source</span><span>${String(index + 1).padStart(2, "0")}</span></div>
              <div class="poster-title">${escapeHtml(title)}</div>
              <div class="poster-bottom"><span>${escapeHtml(language)}</span><span>GitHub ↗</span></div>
            </div>
          </div>
          <div class="project-meta">
            <div>
              <span class="meta-label">Role</span>
              <span class="meta-value">${repo.fork ? "Contributor" : "Creator / maintainer"}</span>
            </div>
            <div>
              <span class="meta-label">Primary stack</span>
              <span class="tool-list">
                <span class="tool-chip"><span class="language-dot" style="--dot-color:${languageColor(language)}"></span>${escapeHtml(language)}</span>
                ${topics.map((t) => `<span class="tool-chip">${escapeHtml(t)}</span>`).join("")}
              </span>
            </div>
            <div>
              <span class="meta-label">Last updated</span>
              <span class="meta-value">${formatDate(repo.updated_at)}</span>
              <span class="meta-value sub">★ ${formatNumber(repo.stargazers_count)} · ⑂ ${formatNumber(repo.forks_count)}</span>
              <a class="text-link meta-link" href="${escapeHtml(repo.html_url || GITHUB_URL)}" target="_blank" rel="noopener noreferrer">Open repository ↗</a>
            </div>
          </div>
        </article>`;
    }).join("");
  }

  function filteredRepositories() {
    const query = $("#repoSearch").value.trim().toLowerCase();
    const languageFilter = $("#repoFilter").value;
    const source = allRepositories.length ? allRepositories : FALLBACK_PROJECTS;
    return source.filter((repo) => {
      const haystack = `${repo.name} ${repo.description || ""} ${(repo.topics || []).join(" ")}`.toLowerCase();
      const matchesQuery = !query || haystack.includes(query);
      const matchesLanguage = languageFilter === "all" || (repo.language || "Other") === languageFilter;
      return matchesQuery && matchesLanguage;
    });
  }

  function repoRowHtml(repo, staggerIndex) {
    const language = repo.language || "Other";
    return `
      <article class="repo-row" style="--i:${staggerIndex}">
        <a class="repo-name" href="${escapeHtml(repo.html_url || GITHUB_URL)}" target="_blank" rel="noopener noreferrer">
          <svg aria-hidden="true"><use href="#i-github"/></svg>
          <span title="${escapeHtml(repo.name)}">${escapeHtml(repo.name)}</span>
        </a>
        <p class="repo-description">${escapeHtml(repo.description || "No description provided.")}</p>
        <div class="repo-meta">
          ${repo.fork ? `<span class="repo-badge">Fork</span>` : ""}
          ${repo.archived ? `<span class="repo-badge">Archived</span>` : ""}
          <span class="repo-language"><span class="language-dot" style="--dot-color:${languageColor(language)}"></span>${escapeHtml(language)}</span>
          <span class="metric"><svg aria-hidden="true"><use href="#i-star"/></svg>${formatNumber(repo.stargazers_count)}</span>
          <span class="metric"><svg aria-hidden="true"><use href="#i-fork"/></svg>${formatNumber(repo.forks_count)}</span>
        </div>
      </article>`;
  }

  function renderRepositoryList() {
    const list = $("#repoList");
    const filtered = filteredRepositories();
    const visible = filtered.slice(0, visibleRepoCount);
    $("#loadMoreRepos").hidden = visible.length >= filtered.length;

    if (!visible.length) {
      const query = $("#repoSearch").value.trim();
      list.innerHTML = `<div class="repo-empty">No repositories match “${escapeHtml(query)}”. Try a different search.</div>`;
    } else {
      list.innerHTML = visible.map((repo, index) => repoRowHtml(repo, Math.min(index, 12))).join("");
    }

    $("#repoStatus").textContent = githubLive
      ? `${filtered.length} ${filtered.length === 1 ? "repository" : "repositories"} · synced from GitHub`
      : "Live GitHub data unavailable — showing highlights";
  }

  function buildLanguageFilter() {
    const select = $("#repoFilter");
    const current = select.value;
    const counts = new Map();
    (allRepositories.length ? allRepositories : FALLBACK_PROJECTS).forEach((repo) => {
      const lang = repo.language || "Other";
      counts.set(lang, (counts.get(lang) || 0) + 1);
    });
    const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
    select.innerHTML = `<option value="all">All languages</option>` +
      sorted.map(([lang, n]) => `<option value="${escapeHtml(lang)}">${escapeHtml(lang)} (${n})</option>`).join("");
    select.value = [...select.options].some((o) => o.value === current) ? current : "all";
  }

  function renderLanguageMix() {
    const bar = $("#langBar");
    const legend = $("#langLegend");
    const note = $("#langMixNote");
    const source = allRepositories.length ? allRepositories : FALLBACK_PROJECTS;
    const counts = new Map();
    source.forEach((repo) => {
      const lang = repo.language || "Other";
      counts.set(lang, (counts.get(lang) || 0) + 1);
    });
    const total = source.length || 1;
    const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
    const top = sorted.slice(0, 5);
    const restCount = sorted.slice(5).reduce((sum, [, n]) => sum + n, 0);
    const segments = restCount > 0 ? [...top, ["More", restCount]] : top;

    bar.innerHTML = segments.map(([lang, n]) =>
      `<span class="lang-segment" title="${escapeHtml(lang)} — ${Math.round((n / total) * 100)}%"
             style="width:${(n / total) * 100}%;background:${languageColor(lang)}"></span>`
    ).join("");

    legend.innerHTML = segments.map(([lang, n]) =>
      `<span class="legend-item"><span class="language-dot" style="--dot-color:${languageColor(lang)}"></span>${escapeHtml(lang)}<b>${Math.round((n / total) * 100)}%</b></span>`
    ).join("");

    note.textContent = githubLive ? `across ${total} public repositories · live` : "preview — live sync unavailable";
  }

  function setSyncLoading(loading) {
    const button = $("#refreshGithub");
    button.classList.toggle("loading", loading);
    button.querySelector("span").textContent = loading ? "Syncing…" : "Sync now";
    if (loading) $("#repoStatus").textContent = "Syncing with GitHub…";
  }

  async function loadGithub(manual = false) {
    setSyncLoading(true);
    try {
      const headers = { "Accept": "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" };
      const [profileResponse, reposResponse] = await Promise.all([
        fetch(API_PROFILE, { headers }),
        fetch(API_REPOS, { headers })
      ]);
      if (!profileResponse.ok || !reposResponse.ok) {
        throw new Error(`GitHub API ${profileResponse.status}/${reposResponse.status}`);
      }
      const profile = await profileResponse.json();
      const repositories = await reposResponse.json();

      allRepositories = Array.isArray(repositories)
        ? repositories.filter((r) => r.owner && r.owner.login.toLowerCase() === GITHUB_USER.toLowerCase())
        : [];
      githubLive = true;
      visibleRepoCount = PAGE_SIZE;

      applyProfile(profile);
      const totalStars = allRepositories.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
      countUp($("#heroStars"), totalStars);
      countUp($("#githubStars"), totalStars);

      buildLanguageFilter();
      renderFeaturedProjects();
      renderRepositoryList();
      renderLanguageMix();
      $("#repoStatus").textContent = `${allRepositories.length} public ${allRepositories.length === 1 ? "repository" : "repositories"} · synced just now`;
      if (manual) showToast("GitHub synced — everything is up to date");
    } catch (error) {
      console.warn("GitHub sync failed:", error);
      githubLive = false;
      allRepositories = [];
      buildLanguageFilter();
      renderFeaturedProjects();
      renderLanguageMix();
      $("#repoList").innerHTML = `
        <div class="repo-error">
          The live repository feed could not be reached just now (GitHub may be rate-limiting this browser).
          You can still <a href="${GITHUB_URL}" target="_blank" rel="noopener noreferrer">open the GitHub account directly</a>.
        </div>`;
      $("#repoStatus").textContent = "Live sync unavailable · showing highlights above";
      $("#loadMoreRepos").hidden = true;
      $("#githubBio").textContent = "Product designer and creative developer — building useful things in the open.";
      showToast("GitHub sync is temporarily unavailable");
    } finally {
      setSyncLoading(false);
    }
  }

  $("#refreshGithub").addEventListener("click", () => loadGithub(true));
  $("#repoSearch").addEventListener("input", () => { visibleRepoCount = PAGE_SIZE; renderRepositoryList(); });
  $("#repoFilter").addEventListener("change", () => { visibleRepoCount = PAGE_SIZE; renderRepositoryList(); });
  $("#loadMoreRepos").addEventListener("click", () => { visibleRepoCount += PAGE_SIZE; renderRepositoryList(); });

  $$(".filter-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      featuredFilter = tab.dataset.workFilter;
      $$(".filter-tab").forEach((item) => item.classList.toggle("active", item === tab));
      renderFeaturedProjects();
    });
  });

  /* ---------------- Project modal ---------------- */
  const projectDialog = $("#projectDialog");
  function openProject(key) {
    const source = allRepositories.length ? allRepositories : FALLBACK_PROJECTS;
    const project = source.find((repo) => projectKey(repo) === String(key));
    if (!project) return;
    const title = cleanRepoName(project.name);
    const language = project.language || "Open Source";
    const sourceIndex = Math.max(source.indexOf(project), 0);
    const [a, b] = gradientFor(sourceIndex);

    $("#modalPoster").style.setProperty("--poster-a", a);
    $("#modalPoster").style.setProperty("--poster-b", b);
    $("#modalPosterIndex").textContent = String(sourceIndex + 1).padStart(2, "0");
    $("#modalPosterTitle").textContent = title;
    $("#modalPosterLanguage").textContent = language;
    $("#modalTitle").textContent = title;
    $("#modalDescription").textContent = project.description || "An open-source project shared publicly on GitHub.";
    $("#modalRole").textContent = project.fork ? "Contributor" : "Creator / maintainer";
    $("#modalLanguage").textContent = language;
    $("#modalStats").textContent = `★ ${formatNumber(project.stargazers_count)} · ⑂ ${formatNumber(project.forks_count)}`;
    $("#modalUpdated").textContent = formatDate(project.updated_at);
    $("#modalRepoLink").href = project.html_url || GITHUB_URL;

    const topics = project.topics || [];
    $("#modalTopics").innerHTML = topics.slice(0, 6).map((t) => `<span class="tool-chip">${escapeHtml(t)}</span>`).join("");

    const liveLink = $("#modalLiveLink");
    liveLink.hidden = !project.homepage;
    if (project.homepage) liveLink.href = project.homepage;

    if (typeof projectDialog.showModal === "function") projectDialog.showModal();
    else projectDialog.setAttribute("open", "");
  }

  document.addEventListener("click", (event) => {
    const opener = event.target.closest("[data-open-project]");
    if (opener) openProject(opener.dataset.openProject);
  });
  document.addEventListener("keydown", (event) => {
    const opener = event.target.closest("[data-open-project]");
    if (opener && (event.key === "Enter" || event.key === " ") && opener.getAttribute("role") === "button") {
      event.preventDefault();
      openProject(opener.dataset.openProject);
    }
  });
  $("#modalClose").addEventListener("click", () => projectDialog.close());
  projectDialog.addEventListener("click", (event) => {
    const rect = projectDialog.getBoundingClientRect();
    const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
    if (outside) projectDialog.close();
  });

  /* ---------------- Copy email ---------------- */
  const copyButton = $("#copyEmail");
  if (copyButton) {
    copyButton.addEventListener("click", async () => {
      const email = copyButton.dataset.copyEmail;
      try {
        await navigator.clipboard.writeText(email);
        copyButton.classList.add("copied");
        copyButton.querySelector(".copy-label").textContent = "Copied!";
        showToast("Email copied to clipboard");
        setTimeout(() => {
          copyButton.classList.remove("copied");
          copyButton.querySelector(".copy-label").textContent = "Copy email";
        }, 2400);
      } catch (error) {
        window.location.href = `mailto:${email}`;
      }
    });
  }

  /* ---------------- Memory game ---------------- */
  const GAME_SYMBOLS = ["code", "bike", "star", "send", "bulb", "gamepad", "camera", "compass"];
  const board = $("#memoryBoard");
  const boardArea = $("#gameBoardArea");
  let flipped = [];
  let matchedPairs = 0;
  let moves = 0;
  let seconds = 0;
  let locked = false;
  let timerId = null;

  const shuffle = (items) => {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  };
  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  function bestScore() {
    try { return Number(localStorage.getItem("adu-memory-best")) || null; } catch (e) { return null; }
  }
  function paintBest() {
    const best = bestScore();
    $("#gameBest").textContent = best ? String(best) : "—";
  }
  function paintStats() {
    $("#gameMoves").textContent = String(moves);
    $("#gameMatched").textContent = `${matchedPairs}/${GAME_SYMBOLS.length}`;
    $("#gameTime").textContent = formatTime(seconds);
  }

  function renderBoard() {
    const deck = shuffle([...GAME_SYMBOLS, ...GAME_SYMBOLS]);
    board.innerHTML = deck.map((symbol, index) => `
      <button class="memory-card" type="button" data-symbol="${symbol}" style="--i:${index}" aria-label="Hidden card ${index + 1}">
        <span class="memory-card-inner">
          <span class="memory-face memory-front" aria-hidden="true">?</span>
          <span class="memory-face memory-back" aria-hidden="true"><svg><use href="#i-${symbol}"/></svg></span>
        </span>
      </button>`).join("");
  }

  function resetGame() {
    clearInterval(timerId);
    timerId = null;
    flipped = []; matchedPairs = 0; moves = 0; seconds = 0; locked = false;
    const result = $("#gameResult");
    result.classList.remove("show");
    result.setAttribute("aria-hidden", "true");
    $("#gameResultRecord").hidden = true;
    $("#gameStatus").textContent = "Select a card to begin.";
    paintStats(); paintBest(); renderBoard();
  }

  function confettiBurst() {
    if (reducedMotion) return;
    const colors = ["#c8ff37", "#ff4f3d", "#4b58ff", "#f2a35c", "#8c6cff", "#4cc9f0"];
    for (let i = 0; i < 42; i += 1) {
      const piece = document.createElement("span");
      piece.className = "confetti-piece";
      piece.style.background = colors[i % colors.length];
      const angle = Math.random() * Math.PI * 2;
      const distance = 110 + Math.random() * 210;
      piece.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
      piece.style.setProperty("--dy", `${Math.sin(angle) * distance + 120}px`);
      piece.style.setProperty("--rot", `${Math.random() * 540 - 270}deg`);
      piece.style.animationDelay = `${Math.random() * 0.12}s`;
      boardArea.appendChild(piece);
      setTimeout(() => piece.remove(), 1500);
    }
  }

  function completeGame() {
    clearInterval(timerId);
    timerId = null;
    locked = true;
    const previousBest = bestScore();
    const isRecord = !previousBest || moves < previousBest;
    if (isRecord) {
      try { localStorage.setItem("adu-memory-best", String(moves)); } catch (e) { /* ignore */ }
    }
    paintBest();
    $("#gameResultText").textContent = `You matched every card in ${moves} moves and ${formatTime(seconds)}.`;
    $("#gameResultRecord").hidden = !isRecord;
    const result = $("#gameResult");
    result.classList.add("show");
    result.setAttribute("aria-hidden", "false");
    $("#gameStatus").textContent = "All pairs matched. Nice work.";
    confettiBurst();
  }

  function flipCard(card) {
    if (locked || card.classList.contains("is-open") || card.classList.contains("is-matched")) return;
    if (!timerId) {
      timerId = setInterval(() => { seconds += 1; $("#gameTime").textContent = formatTime(seconds); }, 1000);
      $("#gameStatus").textContent = "Find the matching symbols.";
    }
    card.classList.add("is-open");
    card.setAttribute("aria-label", `${card.dataset.symbol} card`);
    flipped.push(card);
    if (flipped.length < 2) return;

    moves += 1;
    paintStats();
    const [first, second] = flipped;
    if (first.dataset.symbol === second.dataset.symbol) {
      first.classList.add("is-matched");
      second.classList.add("is-matched");
      matchedPairs += 1;
      flipped = [];
      paintStats();
      $("#gameStatus").textContent = matchedPairs === GAME_SYMBOLS.length
        ? "All pairs matched."
        : `${matchedPairs} ${matchedPairs === 1 ? "pair" : "pairs"} matched. Keep going.`;
      if (matchedPairs === GAME_SYMBOLS.length) setTimeout(completeGame, 480);
    } else {
      locked = true;
      setTimeout(() => {
        first.classList.remove("is-open");
        second.classList.remove("is-open");
        first.setAttribute("aria-label", "Hidden card");
        second.setAttribute("aria-label", "Hidden card");
        flipped = [];
        locked = false;
      }, 780);
    }
  }

  board.addEventListener("click", (event) => {
    const card = event.target.closest(".memory-card");
    if (card) flipCard(card);
  });
  $("#restartGame").addEventListener("click", resetGame);
  $("#playAgain").addEventListener("click", resetGame);

  /* ---------------- Footer clock + year ---------------- */
  $("#currentYear").textContent = String(new Date().getFullYear());
  const clockElement = $("#localTime");
  function tickClock() {
    try {
      clockElement.textContent = new Intl.DateTimeFormat("en-IN", {
        hour: "2-digit", minute: "2-digit", second: "2-digit",
        hour12: true, timeZone: "Asia/Kolkata"
      }).format(new Date());
    } catch (e) {
      clockElement.textContent = new Date().toLocaleTimeString();
    }
  }
  tickClock();
  setInterval(tickClock, 1000);

  /* ---------------- Boot ---------------- */
  resetGame();
  loadGithub();
})();
