import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { closeActiveGamesForUser } from "./cleanup";

export const listByGame = query({
  args: { gameId: v.id("games") },
  handler: async (ctx, { gameId }) => {
    return await ctx.db
      .query("players")
      .withIndex("by_game", (q) => q.eq("gameId", gameId))
      .collect();
  },
});

export const get = query({
  args: { id: v.id("players") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

export const join = mutation({
  args: {
    gameId: v.id("games"),
    nickname: v.string(),
    avatar: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const nickname = args.nickname.trim();
    if (nickname.length < 2) throw new Error("Přezdívka je příliš krátká");

    const game = await ctx.db.get(args.gameId);
    if (!game) throw new Error("Hra neexistuje");
    if (game.status !== "lobby") throw new Error("Do hry už se nejde připojit");

    const players = await ctx.db
      .query("players")
      .withIndex("by_game", (q) => q.eq("gameId", args.gameId))
      .collect();
    const normalizedNickname = nickname.toLocaleLowerCase("cs-CZ");
    const isTaken = players.some(
      (player) => player.nickname.trim().toLocaleLowerCase("cs-CZ") === normalizedNickname
    );
    if (isTaken) throw new Error("Tahle přezdívka už je ve hře obsazená");

    const userId = await getAuthUserId(ctx);

    if (userId) {
      await closeActiveGamesForUser(ctx, userId, userId, args.gameId);
    }

    return await ctx.db.insert("players", {
      ...args,
      nickname,
      userId: userId ?? undefined,
      score: 0,
      streak: 0,
    });
  },
});

export const getLeaderboard = query({
  args: { gameId: v.id("games") },
  handler: async (ctx, { gameId }) => {
    const players = await ctx.db
      .query("players")
      .withIndex("by_game", (q) => q.eq("gameId", gameId))
      .collect();
    return players.sort((a, b) => b.score - a.score);
  },
});
