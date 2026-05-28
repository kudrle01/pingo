export function calculateScore(
  isCorrect: boolean,
  timeLimit: number,
  answeredInMs: number,
  basePoints: number,
  streak: number
): number {
  if (!isCorrect) return 0;
  const timeFactor = 1 - (answeredInMs / (timeLimit * 1000)) * 0.5;
  const streakBonus = Math.min(streak * 50, 300);
  return Math.max(0, Math.round(basePoints * timeFactor) + streakBonus);
}
