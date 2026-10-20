import { useMemo, useState } from "react";
import { ArrowUpRight, Cpu, FlaskConical, Radio, Zap } from "lucide-react";
import { PageHero, SectionHeading } from "../components/ui/SectionHeading";
import { Reveal } from "../components/ui/Reveal";
import { Magnetic } from "../components/ui/Magnetic";
import { Marquee } from "../components/ui/Marquee";
import { ContactBand } from "../components/contact/ContactBand";
import { WipeLink } from "../components/fx/Effects";
import { LAB_TOOLS, type LabTool } from "../lib/data";
import { cx } from "../lib/utils";

const FILTERS = ["All", "Live", "In progress", "Experiment"] as const;
type Filter = (typeof FILTERS)[number];

const STATUS_COLOR: Record<LabTool["status"], string> = {
  Live: "#35d07f",
  "In progress": "#f1df57",
  Experiment: "#8c6cff",
};

const PIPELINE = [
  {
    step: "01",
    title: "Ingest",
    desc: "Documents, images or a raw prompt come in. Chunking and cleaning happen here — the unglamorous step that decides whether retrieval works at all.",
    icon: FlaskConical,
  },
  {
    step: "02",
    title: "Embed & retrieve",
    desc: "Chunks become vectors, vectors go into a store, and a query pulls back only the handful that actually matter.",
    icon: Cpu,
  },
  {
    step: "03",
    title: "Route & generate",
    desc: "The router picks a model out of 48, builds the prompt with retrieved context, and streams tokens back over SSE.",
    icon: Zap,
  },
  {
    step: "04",
    title: "Serve",
    desc: "FastAPI in front, Gradio for demos, Docker for anything that needs to live somewhere permanent. HuggingFace Spaces hosts most of it for free.",
    icon: Radio,
  },
];

function ToolCard({ tool, index }: { tool: LabTool; index: number }) {
  return (
    <Reveal as="article" delay={(index % 3) as 0 | 1 | 2} className="group h-full">
      <a
        href="https://huggingface.co/AdarshJi"
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-full flex-col overflow-hidden rounded-[18px] border border-line bg-surface transition-all duration-500 hover:-translate-y-1.5 hover:border-linestrong hover:shadow-[0_22px_48px_rgba(16,16,16,0.14)]"
      >
        <div
          className="relative h-[104px] overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${tool.gradient[0]}, ${tool.gradient[1]})` }}
        >
          <div className="dot-grid absolute inset-0 opacity-40" aria-hidden="true" />
          <div
            className="absolute -right-8 -bottom-10 h-32 w-32 rounded-full opacity-70 blur-[2px] transition-transform duration-700 group-hover:scale-110"
            style={{
              background:
                "radial-gradient(circle at 32% 30%, rgba(255,255,255,0.85), rgba(255,255,255,0) 62%)",
            }}
            aria-hidden="true"
          />
          <span className="font-display absolute top-3.5 left-4 text-[11px] tracking-[0.18em] text-white/90 uppercase">
            {tool.kind}
          </span>
          <span
            className="absolute top-3 right-3.5 flex items-center gap-1.5 rounded-full bg-black/35 px-2.5 py-1 text-[10px] tracking-[0.12em] text-white uppercase backdrop-blur-sm"
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: STATUS_COLOR[tool.status] }}
              aria-hidden="true"
            />
            {tool.status}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h3 className="font-serif-ed text-[23px] leading-tight">{tool.name}</h3>
          <p className="mt-3 flex-1 text-[13px] leading-relaxed text-muted">{tool.desc}</p>
          <div className="mt-5 flex flex-wrap gap-1.5">
            {tool.stack.map((tech) => (
              <span key={tech} className="chip">
                {tech}
              </span>
            ))}
          </div>
          <span className="text-link mt-5 border-t border-line pt-4">
            {tool.status === "Live" ? "Try it live" : "Follow the build"}
            <ArrowUpRight aria-hidden="true" />
          </span>
        </div>
      </a>
    </Reveal>
  );
}

export function Lab() {
  const [filter, setFilter] = useState<Filter>("All");

  const tools = useMemo(
    () => LAB_TOOLS.filter((tool) => filter === "All" || tool.status === filter),
    [filter]
  );

  const liveCount = LAB_TOOLS.filter((tool) => tool.status === "Live").length;

  return (
    <>
      <PageHero
        kicker="AI Lab / 005"
        title="Fifteen tools,"
        outline="one obsession."
        description="LLM apps, RAG pipelines, diffusion demos and a router that speaks to 48 chat models through a single endpoint — most of it live on HuggingFace Spaces, all of it free to try."
        meta={
          <>
            <span className="chip">
              <span className="chip-dot" style={{ ["--dot-color" as string]: "#35d07f" }} />
              {liveCount} of {LAB_TOOLS.length} showcased tools live
            </span>
            <span className="chip">48 models behind one endpoint</span>
            <a
              href="https://huggingface.co/AdarshJi"
              target="_blank"
              rel="noopener noreferrer"
              className="chip !text-ink hover:!border-acid"
            >
              huggingface.co/AdarshJi
              <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
            </a>
          </>
        }
      />

      {/* ───────────────────  hero image band  ─────────────────── */}
      <section className="relative h-[240px] overflow-hidden border-b border-line md:h-[320px]">
        <img
          src="/img/neural.jpg"
          alt="Abstract glowing neural network artwork"
          className="photo-bw h-full w-full object-cover"
          loading="lazy"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to right, rgba(8,8,8,0.86), rgba(8,8,8,0.35))" }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 flex flex-col justify-center gap-3 px-[clamp(20px,4.4vw,62px)]">
          <p className="kicker !text-acid">Currently learning</p>
          <p className="font-serif-ed max-w-2xl text-[clamp(1.3rem,3vw,2.2rem)] leading-tight text-[#f4f1e9]">
            Going deeper into <em className="italic">RAG + LangChain</em> — and building autonomous
            agents that can actually finish a task.
          </p>
        </div>
      </section>

      {/* ───────────────────  tools grid  ─────────────────── */}
      <section className="section-pad" aria-labelledby="tools-title">
        <SectionHeading
          kicker="The collection"
          title={
            <>
              Small tools,
              <br />
              <em>shipped publicly.</em>
            </>
          }
          description="A representative slice of the 15+ Spaces. Every one of them exists because a real problem needed a real answer, not because a tutorial said to build it."
        />

        <Reveal className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter tools by status">
            {FILTERS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setFilter(option)}
                aria-pressed={filter === option}
                className={cx("filter-tab", filter === option && "is-active")}
              >
                {option}
              </button>
            ))}
          </div>
          <span className="micro-label" aria-live="polite">
            {tools.length} {tools.length === 1 ? "tool" : "tools"}
          </span>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {tools.map((tool, index) => (
            <ToolCard key={tool.name} tool={tool} index={index} />
          ))}
        </div>

        <Reveal className="mt-10 flex justify-center">
          <Magnetic>
            <a
              href="https://huggingface.co/AdarshJi"
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
            >
              Open the full HuggingFace profile
              <ArrowUpRight aria-hidden="true" />
            </a>
          </Magnetic>
        </Reveal>
      </section>

      <Marquee words={["LLMs", "RAG", "LangChain", "FastAPI", "Diffusers", "Agents", "SSE"]} />

      {/* ───────────────────  pipeline  ─────────────────── */}
      <section className="section-pad" aria-labelledby="pipeline-title">
        <SectionHeading
          kicker="How a RAG system actually works"
          title={
            <>
              Four steps,
              <br />
              <em>end to end.</em>
            </>
          }
          description="The pipeline behind most of what's above — the version I'd draw on a whiteboard in an interview."
        />

        <div className="grid gap-px border-t border-line md:grid-cols-2 xl:grid-cols-4">
          {PIPELINE.map((stage, index) => (
            <Reveal
              as="article"
              key={stage.step}
              delay={(index % 3) as 0 | 1 | 2}
              className="group border-b border-line p-[clamp(20px,2.4vw,28px)] xl:border-r xl:last:border-r-0"
            >
              <div className="mb-6 flex items-center justify-between gap-3">
                <span className="micro-label">{stage.step}</span>
                <span className="icon-disc !h-10 !w-10">
                  <stage.icon className="h-4 w-4" aria-hidden="true" />
                </span>
              </div>
              <h3 className="font-display mb-3 text-[20px] leading-tight uppercase">
                {stage.title}
              </h3>
              <p className="text-[12.5px] leading-relaxed text-muted">{stage.desc}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───────────────────  router spotlight  ─────────────────── */}
      <section
        className="relative overflow-hidden bg-[#0b0b0b] px-[clamp(20px,4.4vw,62px)] py-[clamp(56px,8vw,110px)] text-[#f4f1e9]"
        aria-labelledby="router-title"
      >
        <div
          className="blob pointer-events-none -top-32 right-0 h-[380px] w-[380px] opacity-60"
          style={{ background: "var(--blue)" }}
          aria-hidden="true"
        />
        <div className="relative grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="kicker mb-5 !text-white/45">Spotlight</p>
            <h2 className="font-display text-[clamp(2.2rem,5.4vw,4rem)] leading-[0.92] uppercase">
              One endpoint.
              <br />
              <span className="outline-text-thin ![-webkit-text-stroke-color:rgba(244,241,233,0.5)]">
                48 models.
              </span>
            </h2>
            <p className="mt-6 max-w-lg text-[14px] leading-relaxed text-white/60">
              The chat router is the piece I'm proudest of. It exposes a single OpenAI-compatible
              endpoint; the caller names a model per request and the router handles provider
              differences, key management and streaming. Swapping models stops being a refactor and
              becomes a string.
            </p>

            <ul className="mt-8 flex flex-col gap-3.5">
              {[
                "OpenAI-compatible request/response contract",
                "Server-Sent Events for token streaming",
                "Per-request model selection across 48 models",
                "FastAPI + LangChain underneath, Docker on top",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-[13.5px] text-white/70">
                  <span
                    className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full"
                    style={{ background: "var(--acid)" }}
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-wrap gap-3">
              <Magnetic>
                <a
                  href="https://huggingface.co/AdarshJi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-acid"
                >
                  See it on HuggingFace
                  <ArrowUpRight aria-hidden="true" />
                </a>
              </Magnetic>
              <Magnetic>
                <WipeLink to="/work" className="btn btn-ghost-light">
                  More open source
                </WipeLink>
              </Magnetic>
            </div>
          </div>

          <Reveal delay={1}>
            <div className="code-card !text-[12px]">
              <div className="mb-4 flex items-center gap-2 border-b border-white/10 pb-3">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" aria-hidden="true" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" aria-hidden="true" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" aria-hidden="true" />
                <span className="ml-2 text-[11px] text-[#6b6862]">router.py</span>
              </div>
              <pre className="whitespace-pre-wrap">
                <code>
                  <span className="tok-com"># one endpoint, every model</span>
                  {"\n"}
                  <span className="tok-key">from</span> fastapi <span className="tok-key">import</span> FastAPI{"\n"}
                  <span className="tok-key">from</span> fastapi.responses <span className="tok-key">import</span> StreamingResponse{"\n\n"}
                  app = <span className="tok-fn">FastAPI</span>(){"\n\n"}
                  <span className="tok-key">@app.post</span>(<span className="tok-str">"/v1/chat/completions"</span>){"\n"}
                  <span className="tok-key">async def</span> <span className="tok-fn">chat</span>(req: ChatRequest):{"\n"}
                  {"    "}model = <span className="tok-fn">route</span>(req.model){"\n"}
                  {"    "}context = <span className="tok-key">await</span> <span className="tok-fn">retrieve</span>(req.messages){"\n"}
                  {"    "}tokens = model.<span className="tok-fn">stream</span>(context){"\n"}
                  {"    "}
                  <span className="tok-key">return</span> <span className="tok-fn">StreamingResponse</span>({"\n"}
                  {"        "}<span className="tok-fn">sse</span>(tokens),{"\n"}
                  {"        "}media_type=<span className="tok-str">"text/event-stream"</span>,{"\n"}
                  {"    "}){"\n\n"}
                  <span className="tok-com"># 48 models · 1 contract · 0 client rewrites</span>
                </code>
              </pre>
            </div>
          </Reveal>
        </div>
      </section>

      <ContactBand />
    </>
  );
}

export default Lab;
