import { MdArrowOutward, MdCopyright } from "react-icons/md";
import "./styles/Contact.css";

const Contact = () => {
  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h3>Contact</h3>

        <div className="contact-flex">
          {/* LEFT BOX */}
          <div className="contact-box">
            <h4>Connect</h4>

            <p className="contact-links">
              <a
                href="https://www.linkedin.com/in/adarshu07/"
                target="_blank"
                rel="noreferrer"
                data-cursor="disable"
              >
                LinkedIn — adarshu07
              </a>

              {" | "}

              <a
                href="https://github.com/Adarshukumar"
                target="_blank"
                rel="noreferrer"
                data-cursor="disable"
              >
                GitHub — Adarshukumar
              </a>

              <br />

              <a
                href="https://huggingface.co/AdarshJi"
                target="_blank"
                rel="noreferrer"
                data-cursor="disable"
              >
                Hugging Face — AdarshJi
              </a>
              {" | "}

              <a
                href="https://www.instagram.com/adarshu.io/"
                target="_blank"
                rel="noreferrer"
                data-cursor="disable"
              >
                Instagram — adarshu.io
              </a>
              <br />
              <a
                href="mailto:devadarshukumar@gmail.com"
                target="_blank"
                rel="noreferrer"
                data-cursor="disable"
              >
                Email — devadarshukumar@gmail.com
              </a>
            </p>

            <h4>Education</h4>

            <p>
              B.Com (Hons), Dyal Singh College, University of Delhi — Delhi,
              India. Graduated 2024; self-taught in software since 2023.
            </p>
          </div>

          {/* MIDDLE BOX */}
          <div className="contact-box">
            <h4>Social</h4>

            <a
              href="https://github.com/Adarshukumar"
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              GitHub <MdArrowOutward />
            </a>

            <a
              href="https://www.linkedin.com/in/adarshu07/"
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              LinkedIn <MdArrowOutward />
            </a>

            <a
              href="https://huggingface.co/AdarshJi"
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              Hugging Face <MdArrowOutward />
            </a>

            <a
              href="https://www.instagram.com/adarshu.io/"
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              Instagram <MdArrowOutward />
            </a>
          </div>

          {/* RIGHT BOX */}
          <div className="contact-box">
            <h2>
              Designed and Developed <br />
              by <span>Adarsh Kumar</span>
            </h2>

            <h5>
              <MdCopyright /> 2026
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
