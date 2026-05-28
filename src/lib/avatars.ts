const DICEBEAR_BASE = "https://api.dicebear.com/9.x/bottts-neutral/svg";

const BG_COLORS = [
  "b6e3f4", "c0aede", "d1d4f9", "ffd5dc", "fde68a",
  "a7f3d0", "fed7aa", "e9d5ff", "bfdbfe", "fbcfe8",
  "bbf7d0", "fecaca", "fef3c7", "ddd6fe", "cffafe",
];

export interface AvatarOption {
  id: string;
  label: string;
  url: string;
  bg: string;
}

function seedToBg(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return BG_COLORS[Math.abs(hash) % BG_COLORS.length]!;
}

export function getAvatar(seed?: string): AvatarOption {
  const id = seed && seed.length > 0 ? seed : "default";
  const bg = seedToBg(id);
  return {
    id,
    label: id,
    bg,
    url: `${DICEBEAR_BASE}?seed=${encodeURIComponent(id)}&backgroundColor=${bg}&radius=50`,
  };
}

export function randomSeed(): string {
  return Math.random().toString(36).slice(2, 10);
}
