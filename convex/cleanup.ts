import type { MutationCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

/**
 * Ensures a user has at most one active (non-finished) game at a time —
 * both as host and as a joined player. Called before creating or joining a game.
 *
 * - Hosted games still in "lobby" (never started) are deleted along with their players.
 * - Hosted games already in progress are marked "finished" (kept in history).
 * - Games the user only joined are left (their player record is removed).
 */
export async function closeActiveGamesForUser(
  ctx: MutationCtx,
  hostId: string,
  userId: Id<"users"> | null,
  exceptGameId?: Id<"games">
) {
  const hosted = await ctx.db
    .query("games")
    .withIndex("by_host", (q) => q.eq("hostId", hostId))
    .collect();

  for (const game of hosted) {
    if (game._id === exceptGameId || game.status === "finished") continue;
    if (game.status === "lobby") {
      const players = await ctx.db
        .query("players")
        .withIndex("by_game", (q) => q.eq("gameId", game._id))
        .collect();
      for (const player of players) await ctx.db.delete(player._id);
      await ctx.db.delete(game._id);
    } else {
      await ctx.db.patch(game._id, {
        status: "finished",
        finishedAt: game.finishedAt ?? Date.now(),
      });
    }
  }

  if (userId) {
    const myPlayers = await ctx.db
      .query("players")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    for (const player of myPlayers) {
      if (player.gameId === exceptGameId) continue;
      const game = await ctx.db.get(player.gameId);
      if (game && game.status !== "finished") await ctx.db.delete(player._id);
    }
  }
}
