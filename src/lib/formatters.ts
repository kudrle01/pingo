import type { Lang } from "@/i18n/translations";

const LOCALES: Record<Lang, string> = { cs: "cs-CZ", en: "en-GB" };

export function formatScore(score: number): string {
  return score.toLocaleString("cs-CZ");
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function formatDate(timestamp: number, lang: Lang = "cs"): string {
  return new Date(timestamp).toLocaleDateString(LOCALES[lang] ?? "cs-CZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatRank(rank: number): string {
  return `${rank}.`;
}
