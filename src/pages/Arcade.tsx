import { useCallback, useEffect, useRef, useState } from "react";
import { Play, RotateCcw, Trophy } from "lucide-react";
import { PageHero, SectionHeading } from "../components/ui/SectionHeading";
import { Reveal } from "../components/ui/Reveal";
import { MemoryGame } from "../components/arcade/MemoryGame";
import { ContactBand } from "../components/contact/ContactBand";
import { GameIcon } from "../components/Icons";
import { GAME_SYMBOLS, type GameSymbol } from "../lib/data";
import { cx } from "../lib/utils";

/* ─────────────────  second game: Sequence (Simon-style)  ───────────────── */

const PADS: GameSymbol[] = ["code", "star", "bulb", "gamepad", "camera", "compass"];
const PAD_COLORS = ["#4b58ff", "#f1df57", "#c8ff37", "#ff4f3d", "#8c6cff", "#0db7ed"];
const SEQ_BEST_KEY = "adarsh-sequence-best";

type Phase = "idle" | "showing" | "input" | "over";

function SequenceGame() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerIndex, setPlayerIndex] = useState(0);
  const [activePad, setActivePad] = useState<number | null>(null);
  const [best, setBest] = useState<number>(() => {
    try {
      return Number(localStorage.getItem(SEQ_BEST_KEY) ?? 0);
    } catch {
      return 0;
    }
  });

  const timers = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const playBack = useCallback(
    (next: number[]) => {
      setPhase("showing");
      setPlayerIndex(0);
      clearTimers();

      next.forEach((pad, index) => {
        const on = window.setTimeout(() => setActivePad(pad), 620 * index + 420);
        const off = window.setTimeout(() => setActivePad(null), 620 * index + 800);
        timers.current.push(on, off);
      });

      const done = window.setTimeout(() => setPhase("input"), 620 * next.length + 500);
      timers.current.push(done);
    },
    [clearTimers]
  );

  const start = useCallback(() => {
    clearTimers();
    const first = [Math.floor(Math.random() * PADS.length)];
    setSequence(first);
    setActivePad(null);
    playBack(first);
  }, [clearTimers, playBack]);

  const endGame = useCallback(
    (reached: number) => {
      clearTimers();
      setPhase("over");
      setActivePad(null);
      if (reached > best) {
        setBest(reached);
        try {
          localStorage.setItem(SEQ_BEST_KEY, String(reached));
        } catch {
          /* ignore */
        }
      }
    },
    [best, clearTimers]
  );

  const press = useCallback(
    (pad: number) => {
      if (phase !== "input") return;

      setActivePad(pad);
      const off = window.setTimeout(() => setActivePad(null), 220);
      timers.current.push(off);

      if (sequence[playerIndex] !== pad) {
        endGame(sequence.length - 1);
        return;
      }

      const nextIndex = playerIndex + 1;
      if (nextIndex === sequence.length) {
        const grown = [...sequence, Math.floor(Math.random() * PADS.length)];
        const wait = window.setTimeout(() => {
          setSequence(grown);
          playBack(grown);
        }, 620);
        timers.current.push(wait);
        setPlayerIndex(0);
        setPhase("showing");
      } else {
        setPlayerIndex(nextIndex);
      }
    },
    [endGame, phase, playBack, playerIndex, sequence]
  );

  const statusText =
    phase === "idle"
      ? "Watch the pattern, then repeat it."
      : phase === "showing"
        ? "Watch closely…"
        : phase === "input"
          ? `Your turn — step ${playerIndex + 1} of ${sequence.length}`
          : `Sequence broke at ${sequence.length}. Best: ${best}.`;

  return (
    <div className="grid gap-6 rounded-[20px] border border-line bg-surface p-[clamp(14px,2.2vw,26px)] lg:grid-cols-[0.85fr_1.15fr]">
      <aside className="flex flex-col gap-5">
        <div className="flex items-center justify-between gap-3">
          <span className="micro-label">Game / 002</span>
          <span className="micro-label">6 pads</span>
        </div>

        <h3 className="font-display text-[clamp(2.2rem,5vw,3.4rem)] leading-none uppercase">
          Sequence
        </h3>

        <p className="text-[13px] leading-relaxed text-muted">
          The board lights up a pattern, one pad at a time. Repeat it exactly. Every round adds one
          more step — how long can you hold it in your head?
        </p>

        <div className="grid grid-cols-2 divide-x divide-line border-y border-line">
          <div className="px-2 py-3">
            <strong className="font-display block text-xl tabular-nums">
              {sequence.length}
            </strong>
            <span className="micro-label">Round</span>
          </div>
          <div className="px-3 py-3 text-right">
            <strong className="font-display block text-xl tabular-nums">{best}</strong>
            <span className="micro-label">Best</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[12px] text-muted">
          <Trophy className="h-3.5 w-3.5" style={{ color: "var(--acid)" }} aria-hidden="true" />
          <span>Best sequence: <strong className="font-mono-code text-ink">{best || "—"}</strong></span>
        </div>

        <p className="min-h-[20px] text-[12.5px] text-muted" aria-live="polite">
          {statusText}
        </p>

        <div className="mt-auto flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={start}
            disabled={phase === "showing"}
            className={cx("btn flex-1", phase === "showing" && "pointer-events-none opacity-55")}
          >
            {phase === "idle" ? "Start" : phase === "over" ? "Play again" : "Restart"}
            <Play aria-hidden="true" />
          </button>
          <button type="button" onClick={start} className="btn btn-outline" aria-label="Reset sequence game">
            <RotateCcw aria-hidden="true" />
          </button>
        </div>
      </aside>

      <div className="relative">
        <div className="dot-grid absolute inset-0 rounded-[16px] opacity-60" aria-hidden="true" />
        <div className="relative grid grid-cols-3 gap-[clamp(6px,1vw,12px)]" role="group" aria-label="Sequence game pads">
          {PADS.map((symbol, index) => {
            const lit = activePad === index;
            return (
              <button
                key={symbol}
                type="button"
                onClick={() => press(index)}
                disabled={phase !== "input"}
                aria-label={`Pad ${index + 1}: ${symbol}`}
                className={cx(
                  "grid aspect-square place-items-center rounded-[12px] border transition-all duration-200",
                  phase === "input" ? "cursor-pointer" : "cursor-default"
                )}
                style={{
                  background: lit ? PAD_COLORS[index] : "var(--surface)",
                  borderColor: lit ? PAD_COLORS[index] : "var(--line)",
                  color: lit ? "#101010" : "var(--muted)",
                  transform: lit ? "scale(1.04)" : "scale(1)",
                  boxShadow: lit ? `0 12px 30px ${PAD_COLORS[index]}55` : "none",
                }}
              >
                <GameIcon symbol={symbol} className="h-[38%] w-[38%]" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────  the page  ─────────────────────────── */

export function Arcade() {
  return (
    <>
      <PageHero
        kicker="Arcade / 006"
        title="A tiny"
        outline="interaction."
        description="A small reminder that useful digital work can be simple, playful, and satisfying. Two games, both built from the same eight icons that live in this site's SVG sprite."
        meta={
          <>
            <span className="chip">Memory · 3 boards</span>
            <span className="chip">Sequence · endless rounds</span>
            <span className="chip">Best scores saved locally</span>
          </>
        }
      />

      <section className="section-pad" aria-labelledby="memory-title">
        <SectionHeading
          kicker="Game 001"
          title={
            <>
              Play the
              <br />
              <em>memory game.</em>
            </>
          }
          description="The original eight-pair board, plus a warm-up and a brutal 12-pair version. Each board keeps its own best score."
        />

        <Reveal>
          <MemoryGame />
        </Reveal>

        <Reveal delay={1} className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            {
              title: "Warm-up",
              desc: "6 pairs on a 4-column board. Good for proving the mechanic before the real thing.",
            },
            {
              title: "Classic",
              desc: "The original 8 pairs — exactly the board the first version of this site shipped with.",
            },
            {
              title: "Brutal",
              desc: "12 pairs across 6 columns, with four extra icons pulled into the deck.",
            },
          ].map((board) => (
            <div key={board.title} className="rounded-[16px] border border-line bg-surface p-5">
              <span className="micro-label mb-2.5 block">Board</span>
              <h3 className="font-display mb-2 text-[19px] uppercase">{board.title}</h3>
              <p className="text-[12.5px] leading-relaxed text-muted">{board.desc}</p>
            </div>
          ))}
        </Reveal>
      </section>

      <section className="section-pad border-t border-line" aria-labelledby="sequence-title">
        <SectionHeading
          kicker="Game 002 · new"
          title={
            <>
              Then try
              <br />
              <em>sequence.</em>
            </>
          }
          description="A Simon-style pattern game using the same icon set. It gets one step longer every round — the only limit is your short-term memory."
        />

        <Reveal>
          <SequenceGame />
        </Reveal>
      </section>

      <section className="section-pad border-t border-line" aria-labelledby="how-title">
        <SectionHeading
          kicker="Under the hood"
          title={
            <>
              How the games
              <br />
              <em>are built.</em>
            </>
          }
          description="Both run entirely in the browser — no server, no accounts, no tracking. Scores live in localStorage on your device only."
        />

        <div className="grid gap-px border-t border-line md:grid-cols-3">
          {[
            {
              title: "Fisher–Yates shuffle",
              desc: "The deck is shuffled with the same unbiased algorithm the original single-file site used — every arrangement genuinely equally likely.",
            },
            {
              title: "CSS 3D flips",
              desc: "Cards rotate on the Y axis with preserve-3d and backface-visibility, so the flip is handled by the compositor rather than JavaScript.",
            },
            {
              title: "Accessible by default",
              desc: "Every card is a real button with a live aria-label, the board is a grid role, and status updates go through an aria-live region.",
            },
          ].map((item, index) => (
            <Reveal
              as="article"
              key={item.title}
              delay={(index % 3) as 0 | 1 | 2}
              className="border-b border-line p-[clamp(20px,2.4vw,28px)] md:border-r md:last:border-r-0"
            >
              <span className="micro-label mb-4 block">
                {String(index + 1).padStart(2, "0")} / Detail
              </span>
              <h3 className="font-display mb-3 text-[19px] leading-tight uppercase">
                {item.title}
              </h3>
              <p className="text-[12.5px] leading-relaxed text-muted">{item.desc}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-9 flex flex-wrap gap-2.5">
          {GAME_SYMBOLS.map((symbol) => (
            <span key={symbol} className="chip !py-2 !px-3">
              <GameIcon symbol={symbol} className="h-3.5 w-3.5" />
              {symbol}
            </span>
          ))}
        </Reveal>
      </section>

      <ContactBand />
    </>
  );
}

export default Arcade;
