import { calculateScore } from "@/lib/scoring";
import { useState } from "react";

interface ScoreState {
  total: number;
  streak: number;
  lastPoints: number;
}

export function useScore() {
  const [state, setState] = useState<ScoreState>({
    total: 0,
    streak: 0,
    lastPoints: 0,
  });

  function addAnswer(
    isCorrect: boolean,
    timeLimit: number,
    answeredInMs: number,
    basePoints: number,
  ): number {
    const points = calculateScore(isCorrect, timeLimit, answeredInMs, basePoints, state.streak);

    setState((prev) => ({
      total: prev.total + points,
      streak: isCorrect ? prev.streak + 1 : 0,
      lastPoints: points,
    }));

    return points;
  }

  function reset() {
    setState({ total: 0, streak: 0, lastPoints: 0 });
  }

  return {
    total: state.total,
    streak: state.streak,
    lastPoints: state.lastPoints,
    addAnswer,
    reset,
  };
}
