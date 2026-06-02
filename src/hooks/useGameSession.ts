import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";

export function useGameSession(gameId: Id<"games">) {
  const game = useQuery(api.games.get, { id: gameId });
  const players = useQuery(api.players.listByGame, { gameId });
  const leaderboard = useQuery(api.players.getLeaderboard, { gameId });

  const updateStatus = useMutation(api.games.updateStatus);
  const nextQuestion = useMutation(api.games.nextQuestion);
  const submitAnswer = useMutation(api.games.submitAnswer);

  return {
    game,
    players,
    leaderboard,
    updateStatus,
    nextQuestion,
    submitAnswer,
    isLoading: game === undefined,
  };
}
