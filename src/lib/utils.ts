/** Small shared helpers — the same ones the original single-file site used. */

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function formatNumber(value = 0): string {
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(
    value
  );
}

export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en", { day: "2-digit", month: "short", year: "numeric" });
}

export function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "—";
  const diff = Date.now() - then;
  const day = 86_400_000;
  if (diff < day) return "today";
  if (diff < day * 7) return `${Math.floor(diff / day)}d ago`;
  if (diff < day * 31) return `${Math.floor(diff / (day * 7))}w ago`;
  if (diff < day * 365) return `${Math.floor(diff / (day * 31))}mo ago`;
  return `${Math.floor(diff / (day * 365))}y ago`;
}

/** Fisher–Yates — identical to the original memory-game shuffle. */
export function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
  }
  return result;
}

export function formatTime(seconds: number): string {
  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  return `${mins}:${secs}`;
}

const POSTER_GRADIENTS: [string, string][] = [
  ["#4b58ff", "#8c6cff"],
  ["#c8ff37", "#39d98a"],
  ["#ff4f3d", "#ffb27a"],
  ["#0db7ed", "#4b58ff"],
  ["#8c6cff", "#f4a6ff"],
  ["#ff6b4a", "#f1df57"],
  ["#39d98a", "#0db7ed"],
  ["#f1df57", "#c8ff37"],
];

export function gradientFor(index: number): [string, string] {
  return POSTER_GRADIENTS[Math.abs(index) % POSTER_GRADIENTS.length];
}

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function isFinePointer(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;
}
