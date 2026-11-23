import { useEffect, useRef } from "react";
import { animate } from "animejs";
import { useReveal } from "./utils/useReveal";
import "./styles/About.css";

/**
 * About.
 *
 * The story is the longest copy on the site, so it gets the layout the length
 * deserves: a sticky label column, one measure of readable text, and the
 * numbers pulled out as their own row.
 *
 * The character used to fly through this section — it is a fixed layer, and
 * ScrollSmoother wraps everything in a transformed stacking context, so the
 * 3D canvas rendered on top of the prose. That is fixed in index.css; this
 * component only has to be legible.
 */

const HIGHLIGHTS = [
  { value: "15+", label: "AI tools live on Hugging Face" },
  { value: "48", label: "models behind one chat endpoint" },
  { value: "2024", label: "freelancing since January" },
  { value: "2023", label: "writing code since" },
];

const FACTS = [
  { k: "Based in", v: "Delhi, India" },
  { k: "Studied", v: "B.Com (Hons), DU" },
  { k: "Working", v: "Freelance, since 2024" },
  { k: "Reach", v: "devadarshukumar@gmail.com" },
];

const About = () => {
  const ref = useReveal<HTMLElement>(".about-aside, .about-body > *", {
    distance: 22,
    gap: 55,
    duration: 820,
  });
  const counterRef = useRef<HTMLDListElement | null>(null);

  // The stat numbers count up once, when the row first lands.
  useEffect(() => {
    const root = counterRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof IntersectionObserver === "undefined") return;

    const numbers = Array.from(
      root.querySelectorAll<HTMLElement>(".about-stat dt")
    );
    let played = false;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || played) return;
          played = true;

          numbers.forEach((el, index) => {
            const final = el.dataset.value ?? "";
            const digits = final.match(/\d+/);
            if (!digits) return;

            const target = Number(digits[0]);
            const suffix = final.replace(digits[0], "");
            const state = { n: 0 };

            animate(state, {
              n: target,
              duration: 1100,
              delay: index * 90,
              ease: "outExpo",
              onUpdate: () => {
                el.textContent = Math.round(state.n) + suffix;
              },
              onComplete: () => {
                el.textContent = final;
              },
            });
          });

          observer.disconnect();
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  // A quiet parallax on the portrait/label column so the section breathes
  // instead of sitting dead still.
  useEffect(() => {
    const rail = document.querySelector<HTMLElement>(".about-aside");
    if (!rail) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const rect = rail.getBoundingClientRect();
        const progress = Math.max(
          -1,
          Math.min(1, (window.innerHeight / 2 - rect.top) / window.innerHeight)
        );
        rail.style.setProperty("--about-shift", `${progress * 14}px`);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section className="about-section" id="about" ref={ref}>
      <div className="about-grid">
        <aside className="about-aside">
          <h3 className="about-eyebrow">
            <span className="about-eyebrow-dot" aria-hidden="true" />
            About Me
          </h3>

          <p className="about-lede">
            Commerce graduate, self-taught engineer, shipping AI products from
            Delhi since 2024.
          </p>

          <dl className="about-facts">
            {FACTS.map((fact) => (
              <div className="about-fact" key={fact.k}>
                <dt>{fact.k}</dt>
                <dd>{fact.v}</dd>
              </div>
            ))}
          </dl>

          <a
            className="about-link"
            href="mailto:devadarshukumar@gmail.com"
            data-cursor="disable"
          >
            <span>Work with me</span>
            <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
              <path
                d="M3 13L13 3M13 3H5.5M13 3v7.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </aside>

        <div className="about-body">
          <p className="about-lead">
            I'm <strong>Adarsh Kumar</strong> — a freelance developer and AI
            engineer based in Delhi, India. Since January 2024 I've been
            building websites, shipping AI tools and turning messy ideas into
            products that people actually use.
          </p>

          <div className="about-split">
            <div className="about-col">
              <h4>AI &amp; backends</h4>
              <p>
                Python and FastAPI services, LLM apps with LangChain and RAG
                pipelines, image generation, text-to-speech, and
                OpenAI-compatible gateways. I've shipped{" "}
                <strong>15+ live tools on Hugging Face Spaces</strong>, including
                a single endpoint that routes requests across 48 chat models and
                streams the answer back token by token.
              </p>
            </div>

            <div className="about-col">
              <h4>Interface &amp; motion</h4>
              <p>
                Interface-first products — React, TypeScript, Vite and Tailwind
                on the front, Node and REST APIs behind it, with motion and
                detail treated as part of the engineering rather than
                decoration. This site is one: Three.js, GSAP, anime.js, no
                template.
              </p>
            </div>
          </div>

          <p className="about-body-close">
            Academically I'm a B.Com (Hons) graduate from Dyal Singh College,
            University of Delhi — commerce by training, self-taught in code.
            These days I spend most of my time on autonomous agents, RAG
            architectures and the unglamorous backend work that makes AI
            products feel instant.
          </p>

          <dl className="about-stats" ref={counterRef}>
            {HIGHLIGHTS.map((item) => (
              <div className="about-stat" key={item.label}>
                <dt data-value={item.value}>{item.value}</dt>
                <dd>{item.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
};

export default About;
