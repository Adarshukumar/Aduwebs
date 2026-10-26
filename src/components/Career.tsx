import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>

        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>

          {/* Foundations */}
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>First lines of code</h4>
                <h5>Self-taught</h5>
              </div>
              <div>2023 · Delhi</div>
            </div>

            <p>
              Started with C and C++ for the fundamentals, moved into Python and
              never really left. First scrapers, first REST APIs, first neural
              network — the usual path from curiosity to obsession.
            </p>
          </div>

          {/* Freelance */}
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Freelance Web Developer</h4>
                <h5>Self-employed</h5>
              </div>
              <div>Jan 2024 – Present · Delhi, India</div>
            </div>

            <p>
              Landed the first client website in January 2024 and have been
              shipping since — landing pages and small-business sites hand-built in
              HTML, CSS, JavaScript and React, plus WordPress when the client wants
              to own the editing experience. Also produce video edits, reels and
              promos, and small automations for creators and small businesses.
            </p>
          </div>

          {/* AI */}
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>AI Developer &amp; ML Engineer</h4>
                <h5>Independent · Hugging Face</h5>
              </div>
              <div>2025 – Present</div>
            </div>

            <p>
              15+ AI tools live on Hugging Face Spaces: image generation,
              text-to-speech, automation utilities and a 48-model chat router that
              speaks the OpenAI-compatible API and streams over SSE. Built
              Dockerised image-serving APIs, a Hugging Face-compatible gallery
              server, and RAG chat backends for real users — all in the open.
            </p>
          </div>

          {/* Education */}
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>B.Com (Hons)</h4>
                <h5>Dyal Singh College, University of Delhi</h5>
              </div>
              <div>Graduated 2024</div>
            </div>

            <p>
              Commerce by day, code by night. The degree taught me how businesses
              actually decide — the code taught me how to build what they decide.
              The two turned out to complement each other better than expected.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
