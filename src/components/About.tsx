import "./styles/About.css";

/**
 * About.
 *
 * The story is the longest copy on the site, so it gets the layout the length
 * deserves: a sticky label column on the left, one measure of readable text on
 * the right, and the numbers pulled out as their own row instead of buried in
 * a paragraph.
 */
const HIGHLIGHTS = [
  { value: "15+", label: "AI tools live on Hugging Face" },
  { value: "48", label: "models behind one chat endpoint" },
  { value: "2024", label: "freelancing since January" },
  { value: "2023", label: "writing code since" },
];

const About = () => {
  return (
    <section className="about-section" id="about">
      <div className="about-grid">
        <aside className="about-aside">
          <h3 className="about-eyebrow">About Me</h3>
          <p className="about-lede">
            Commerce graduate, self-taught engineer, shipping AI products from
            Delhi since 2024.
          </p>
          <a
            className="about-link"
            href="mailto:devadarshukumar@gmail.com"
            data-cursor="disable"
          >
            Work with me
          </a>
        </aside>

        <div className="about-body">
          <p>
            I'm <strong>Adarsh Kumar</strong> — a freelance developer and AI
            engineer based in Delhi, India. Since January 2024 I've been
            building websites, shipping AI tools and turning messy ideas into
            products that people actually use.
          </p>

          <p>
            On the AI side I work across the whole stack: Python and FastAPI
            services, LLM apps with LangChain and RAG pipelines, image
            generation, text-to-speech, and OpenAI-compatible gateways. I've
            shipped <strong>15+ live tools on Hugging Face Spaces</strong>,
            including a single endpoint that routes requests across 48 chat
            models and streams the answer back token by token.
          </p>

          <p>
            On the web side I build interface-first products — React,
            TypeScript, Vite and Tailwind on the front, Node and REST APIs
            behind it, with motion and detail treated as part of the
            engineering rather than decoration.
          </p>

          <p className="about-body-close">
            Academically I'm a B.Com (Hons) graduate from Dyal Singh College,
            University of Delhi — commerce by training, self-taught in code.
            These days I spend most of my time on autonomous agents, RAG
            architectures and the unglamorous backend work that makes AI
            products feel instant.
          </p>

          <dl className="about-stats">
            {HIGHLIGHTS.map((item) => (
              <div className="about-stat" key={item.label}>
                <dt>{item.value}</dt>
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
