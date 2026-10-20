import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { RotateCcw, Trophy } from "lucide-react";
import { DIFFICULTIES, GAME_SYMBOLS, HARD_SYMBOLS, type Difficulty } from "../../lib/data";
import { cx, formatTime, shuffle } from "../../lib/utils";
import { GameIcon } from "../Icons";

interface Card {
  id: number;
  symbol: string;
  open: boolean;
  matched: boolean;
}

const BEST_KEY = "adarsh-memory-best";

function readBests(): Record<string, number> {
  try {
    const raw = localStorage.getItem(BEST_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed ? (parsed as Record<string, number>) : {};
  } catch {
    return {};
  }
}

function writeBests(bests: Record<string, number>) {
  try {
    localStorage.setItem(BEST_KEY, JSON.stringify(bests));
  } catch {
    /* ignore */
  }
}

function buildDeck(pairs: number): Card[] {
  const pool = pairs > GAME_SYMBOLS.length ? HARD_SYMBOLS : GAME_SYMBOLS;
  const symbols = pool.slice(0, pairs);
  return shuffle([...symbols, ...symbols]).map((symbol, index) => ({
    id: index,
    symbol,
    open: false,
    matched: false,
  }));
}

export function MemoryGame({ compact = false }: { compact?: boolean }) {
  const [difficulty, setDifficulty] = useState<Difficulty>(
    DIFFICULTIES.find((d) => d.key === "classic") ?? DIFFICULTIES[1]
  );
  const [cards, setCards] = useState<Card[]>(() => buildDeck(8));
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [status, setStatus] = useState("Select a card to begin.");
  const [won, setWon] = useState(false);
  const [bests, setBests] = useState<Record<string, number>>(() => readBests());
  const [newRecord, setNewRecord] = useState(false);

  const flipped = useRef<number[]>([]);
  const locked = useRef(false);
  const timer = useRef<number | null>(null);

  const matchedCount = useMemo(() => cards.filter((c) => c.matched).length / 2, [cards]);

  const stopTimer = useCallback(() => {
    if (timer.current !== null) {
      window.clearInterval(timer.current);
      timer.current = null;
    }
  }, []);

  const reset = useCallback(
    (next: Difficulty = difficulty) => {
      stopTimer();
      flipped.current = [];
      locked.current = false;
      setCards(buildDeck(next.pairs));
      setMoves(0);
      setSeconds(0);
      setWon(false);
      setNewRecord(false);
      setStatus("Select a card to begin.");
    },
    [difficulty, stopTimer]
  );

  const changeDifficulty = useCallback(
    (next: Difficulty) => {
      setDifficulty(next);
      reset(next);
    },
    [reset]
  );

  // Timer starts on the first flip and stops on win / unmount.
  useEffect(() => {
    return () => stopTimer();
  }, [stopTimer]);

  useEffect(() => {
    if (won) stopTimer();
  }, [won, stopTimer]);

  const finish = useCallback(
    (finalMoves: number, finalSeconds: number) => {
      stopTimer();
      locked.current = true;
      setWon(true);

      const previous = bests[difficulty.key];
      const isRecord = !previous || finalMoves < previous;
      if (isRecord) {
        const nextBests = { ...bests, [difficulty.key]: finalMoves };
        setBests(nextBests);
        writeBests(nextBests);
        setNewRecord(true);
      }

      setStatus("All pairs matched. Nice work.");
      void finalSeconds;
    },
    [bests, difficulty.key, stopTimer]
  );

  const flip = useCallback(
    (id: number) => {
      if (locked.current || won) return;

      const card = cards.find((c) => c.id === id);
      if (!card || card.open || card.matched) return;

      if (timer.current === null) {
        timer.current = window.setInterval(() => setSeconds((s) => s + 1), 1000);
        setStatus("Find the matching symbols.");
      }

      const opened = [...flipped.current, id];
      flipped.current = opened;
      setCards((prev) => prev.map((c) => (c.id === id ? { ...c, open: true } : c)));

      if (opened.length < 2) return;

      const [firstId, secondId] = opened;
      const first = cards.find((c) => c.id === firstId);
      const second = cards.find((c) => c.id === secondId);
      const nextMoves = moves + 1;
      setMoves(nextMoves);
      flipped.current = [];

      if (first && second && first.symbol === second.symbol) {
        const nextCards = cards.map((c) =>
          c.id === firstId || c.id === secondId ? { ...c, matched: true, open: true } : c
        );
        // apply the just-flipped card too (it isn't in `cards` state yet)
        const settled = nextCards.map((c) => (c.id === id ? { ...c, open: true } : c));
        setCards(settled);

        const matchedNow = settled.filter((c) => c.matched).length / 2;
        setStatus(
          matchedNow === difficulty.pairs
            ? "All pairs matched."
            : `${matchedNow} pairs matched. Keep going.`
        );

        if (matchedNow === difficulty.pairs) {
          window.setTimeout(() => finish(nextMoves, seconds + 1), 480);
        }
      } else {
        locked.current = true;
        window.setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstId || c.id === secondId ? { ...c, open: false } : c
            )
          );
          flipped.current = [];
          locked.current = false;
        }, 760);
      }
    },
    [cards, difficulty.pairs, finish, moves, seconds, won]
  );

  const best = bests[difficulty.key];

  return (
    <div
      className={cx(
        "grid gap-6 rounded-[20px] border border-line bg-surface p-[clamp(14px,2.2vw,26px)]",
        compact ? "lg:grid-cols-1" : "lg:grid-cols-[0.85fr_1.15fr]"
      )}
    >
      <aside className="flex flex-col gap-5">
        <div className="flex items-center justify-between gap-3">
          <span className="micro-label">Game / 001</span>
          <span className="micro-label">{difficulty.pairs} pairs</span>
        </div>

        <h3 className="font-display text-[clamp(2.2rem,5vw,3.4rem)] leading-none uppercase">
          Memory
        </h3>

        <p className="text-[13px] leading-relaxed text-muted">
          Flip two cards at a time. Find the matching symbols and clear the board in as few moves as
          possible.
        </p>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Choose difficulty">
          {DIFFICULTIES.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => changeDifficulty(option)}
              aria-pressed={option.key === difficulty.key}
              className={cx("filter-tab", option.key === difficulty.key && "is-active")}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 divide-x divide-line border-y border-line">
          <div className="px-2 py-3">
            <strong className="font-display block text-xl tabular-nums">
              {formatTime(seconds)}
            </strong>
            <span className="micro-label">Time</span>
          </div>
          <div className="px-3 py-3">
            <strong className="font-display block text-xl tabular-nums">{moves}</strong>
            <span className="micro-label">Moves</span>
          </div>
          <div className="px-3 py-3 text-right">
            <strong className="font-display block text-xl tabular-nums">
              {matchedCount}/{difficulty.pairs}
            </strong>
            <span className="micro-label">Matched</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[12px] text-muted">
          <Trophy className="h-3.5 w-3.5 text-acid" style={{ color: "var(--acid)" }} aria-hidden="true" />
          <span>
            Best on {difficulty.label}:{" "}
            <strong className="font-mono-code text-ink">{best ? `${best} moves` : "—"}</strong>
          </span>
        </div>

        <p className="min-h-[20px] text-[12.5px] text-muted" aria-live="polite">
          {status}
        </p>

        <button type="button" onClick={() => reset()} className="btn btn-outline mt-auto w-full">
          Restart game
          <RotateCcw aria-hidden="true" />
        </button>
      </aside>

      <div className="relative">
        <div
          className="dot-grid absolute inset-0 rounded-[16px] opacity-60"
          aria-hidden="true"
        />
        <div
          className="memory-board relative"
          style={{ gridTemplateColumns: `repeat(${difficulty.cols}, minmax(0, 1fr))` }}
          role="grid"
          aria-label="Memory matching game board"
        >
          {cards.map((card, index) => (
            <button
              key={card.id}
              type="button"
              role="gridcell"
              onClick={() => flip(card.id)}
              className={cx(
                "memory-card",
                card.open && "is-open",
                card.matched && "is-matched"
              )}
              aria-label={
                card.open || card.matched
                  ? `${card.symbol} card`
                  : `Hidden card ${index + 1} of ${cards.length}`
              }
            >
              <span className="memory-inner">
                <span className="memory-face memory-front" aria-hidden="true">
                  ?
                </span>
                <span className="memory-face memory-back" aria-hidden="true">
                  <GameIcon symbol={card.symbol as never} />
                </span>
              </span>
            </button>
          ))}
        </div>

        <div
          className={cx("game-result", won && "show")}
          aria-hidden={!won}
          role={won ? "dialog" : undefined}
          aria-label={won ? "Game complete" : undefined}
        >
          <div className="game-result-card">
            <div
              className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full text-2xl"
              style={{ background: "var(--acid)", color: "var(--acid-ink)" }}
              aria-hidden="true"
            >
              ★
            </div>
            <h4 className="font-serif-ed text-3xl italic">
              {newRecord ? "New record." : "Perfect match."}
            </h4>
            <p className="mt-2 mb-5 text-[13px] text-muted">
              You cleared {difficulty.pairs} pairs in {moves} moves and {formatTime(seconds)}.
              {newRecord ? " That's your best on this board." : ""}
            </p>
            <button type="button" onClick={() => reset()} className="btn w-full">
              Play again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
