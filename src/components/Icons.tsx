import {
  Bike,
  Lightbulb,
  Camera,
  Code2,
  Compass,
  Cpu,
  Gamepad2,
  Github,
  Instagram,
  Linkedin,
  Mail,
  Rocket,
  Send,
  Sparkles,
  Star,
  Terminal,
  Twitter,
  Youtube,
  Music2,
  MessageCircle,
  Link2,
  type LucideIcon,
} from "lucide-react";
import type { GameSymbol, SocialKey } from "../lib/data";

/** The eight (plus four hard-mode) symbols used on the memory-game board. */
export const GAME_ICONS: Record<string, LucideIcon> = {
  code: Code2,
  bike: Bike,
  star: Star,
  send: Send,
  bulb: Lightbulb,
  gamepad: Gamepad2,
  camera: Camera,
  compass: Compass,
  rocket: Rocket,
  cpu: Cpu,
  sparkles: Sparkles,
  terminal: Terminal,
};

export function GameIcon({ symbol, className }: { symbol: GameSymbol; className?: string }) {
  const Icon = GAME_ICONS[symbol] ?? Star;
  return <Icon className={className} strokeWidth={1.6} aria-hidden="true" />;
}

/** Hugging Face has no lucide glyph — hand-rolled to match the stroke style. */
export function HuggingFaceIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9.2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="9" cy="10.2" r="1.15" fill="currentColor" />
      <circle cx="15" cy="10.2" r="1.15" fill="currentColor" />
      <path
        d="M8.4 14.6c.9 1.1 2.1 1.7 3.6 1.7s2.7-.6 3.6-1.7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M4.2 6.6 6.4 8M19.8 6.6 17.6 8M12 2.6v2.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export const SOCIAL_ICONS: Record<SocialKey, LucideIcon | typeof HuggingFaceIcon> = {
  github: Github,
  linkedin: Linkedin,
  instagram: Instagram,
  huggingface: HuggingFaceIcon,
  email: Mail,
  x: Twitter,
  youtube: Youtube,
  spotify: Music2,
  discord: MessageCircle,
  linktree: Link2,
  itch: Gamepad2,
};

export function SocialIcon({ social, className }: { social: SocialKey; className?: string }) {
  const Icon = SOCIAL_ICONS[social] ?? Link2;
  return <Icon className={className} aria-hidden="true" />;
}
