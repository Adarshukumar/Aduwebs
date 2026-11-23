import { SplitText } from "gsap/SplitText";
import gsap from "gsap";
import { smoother } from "../Navbar";

export function initialFX() {
  document.body.style.overflowY = "auto";
  smoother.paused(false);
  document.getElementsByTagName("main")[0].classList.add("main-active");
  gsap.to("body", {
    backgroundColor: "#050505",
    duration: 0.5,
    delay: 1,
  });

  var landingText = new SplitText(
    [".landing-info h3", ".landing-intro h2", ".landing-intro h1"],
    {
      type: "chars,lines",
      linesClass: "split-line",
    }
  );
  gsap.fromTo(
    landingText.chars,
    { opacity: 0, y: 80, filter: "blur(5px)" },
    {
      opacity: 1,
      duration: 1.2,
      filter: "blur(0px)",
      ease: "power3.inOut",
      y: 0,
      stagger: 0.025,
      delay: 0.3,
    }
  );

  // The role words are a single, quiet stack now — one reveal, no carousel.
  // (They used to cross-fade in an endless 4s loop, which left both words
  // half-visible on top of each other at the same time.)
  var roles = new SplitText(".landing-roles .landing-role", {
    type: "chars,lines",
    linesClass: "split-h2",
  });

  gsap.fromTo(
    roles.chars,
    { opacity: 0, y: 40, filter: "blur(6px)" },
    {
      opacity: 1,
      duration: 1.1,
      filter: "blur(0px)",
      ease: "power3.out",
      y: 0,
      stagger: { each: 0.028, from: "start" },
      delay: 0.55,
    }
  );

  gsap.fromTo(
    [".header", ".icons-section", ".nav-fade"],
    { opacity: 0 },
    {
      opacity: 1,
      duration: 1.2,
      ease: "power1.inOut",
      delay: 0.1,
    }
  );
}
