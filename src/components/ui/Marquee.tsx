import { MARQUEE_WORDS } from "../../lib/data";

/** Black band that bleeds past the shell padding — loops forever, pauses on hover. */
export function Marquee({ words = MARQUEE_WORDS }: { words?: readonly string[] }) {
  const line = (
    <div className="marquee-item">
      {words.map((word) => (
        <span key={word} className="contents">
          {word} <span>+</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {line}
        {line}
      </div>
    </div>
  );
}
