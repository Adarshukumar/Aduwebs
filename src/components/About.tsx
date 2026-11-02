import "./styles/About.css";

const About = () => {
  return (
    <div className="about-section" id="about">
      <div className="about-me">
        <h3 className="title">About Me</h3>

        <p className="para">
          I'm Adarsh Kumar — a freelance developer and AI engineer based in Delhi,
          India. Since January 2024 I've been building websites, shipping AI tools
          and turning messy ideas into products that people actually use.
          <br />
          <br />
          On the AI side I work across the whole stack: Python and FastAPI services,
          LLM apps with LangChain and RAG pipelines, image generation, text-to-speech,
          and OpenAI-compatible gateways. I've shipped 15+ live tools on Hugging Face
          Spaces, including a single endpoint that routes requests across 48 chat
          models and streams the answer back token by token.
          <br />
          <br />
          On the web side I build interface-first products — React, TypeScript,
          Vite and Tailwind on the front, Node and REST APIs behind it, with motion
          and detail treated as part of the engineering rather than decoration. I
          care about the moment a complex system becomes simple enough for someone
          to use without a manual.
          <br />
          <br />
          Academically I'm a B.Com (Hons) graduate from Dyal Singh College,
          University of Delhi — commerce by training, self-taught in code. These
          days I spend most of my time on autonomous agents, RAG architectures and
          the unglamorous backend work that makes AI products feel instant.
        </p>
      </div>
    </div>
  );
};

export default About;
