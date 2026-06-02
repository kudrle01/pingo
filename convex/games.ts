import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { closeActiveGamesForUser } from "./cleanup";

export const getByPin = query({
  args: { pin: v.string() },
  handler: async (ctx, { pin }) => {
    return await ctx.db
      .query("games")
      .withIndex("by_pin", (q) => q.eq("pin", pin))
      .unique();
  },
});

export const get = query({
  args: { id: v.id("games") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

export const create = mutation({
  args: {
    quizId: v.id("quizzes"),
    hostId: v.string(),
    pin: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    await closeActiveGamesForUser(ctx, args.hostId, userId);

    return await ctx.db.insert("games", {
      ...args,
      status: "lobby",
      currentQuestion: 0,
    });
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("games"),
    status: v.union(
      v.literal("lobby"),
      v.literal("question"),
      v.literal("results"),
      v.literal("finished"),
    ),
    currentQuestion: v.optional(v.number()),
    questionStartedAt: v.optional(v.number()),
  },
  handler: async (ctx, { id, status, currentQuestion, questionStartedAt }) => {
    const patch: Record<string, unknown> = { status };
    if (currentQuestion !== undefined) patch.currentQuestion = currentQuestion;
    if (questionStartedAt !== undefined) patch.questionStartedAt = questionStartedAt;
    if (status === "finished") {
      const game = await ctx.db.get(id);
      if (game && game.finishedAt === undefined) patch.finishedAt = Date.now();
    }
    await ctx.db.patch(id, patch);
  },
});

export const cancel = mutation({
  args: { id: v.id("games") },
  handler: async (ctx, { id }) => {
    const players = await ctx.db
      .query("players")
      .withIndex("by_game", (q) => q.eq("gameId", id))
      .collect();
    for (const player of players) await ctx.db.delete(player._id);
    await ctx.db.delete(id);
  },
});

export const nextQuestion = mutation({
  args: { id: v.id("games") },
  handler: async (ctx, { id }) => {
    const game = await ctx.db.get(id);
    if (!game) throw new Error("Hra neexistuje");
    await ctx.db.patch(id, {
      currentQuestion: game.currentQuestion + 1,
      status: "question",
      questionStartedAt: Date.now(),
    });
  },
});

export const submitAnswer = mutation({
  args: {
    gameId: v.id("games"),
    playerId: v.id("players"),
    questionIndex: v.number(),
    answerIndex: v.number(),
    answeredAt: v.number(),
    isCorrect: v.boolean(),
  },
  handler: async (ctx, args) => {
    const game = await ctx.db.get(args.gameId);
    if (!game) throw new Error("Hra neexistuje");
    if (game.status !== "question" || game.currentQuestion !== args.questionIndex) {
      throw new Error("Otázka už není aktivní");
    }

    const quiz = await ctx.db.get(game.quizId);
    if (!quiz) throw new Error("Kvíz neexistuje");

    const question = quiz.questions[args.questionIndex];
    if (!question) throw new Error("Otázka neexistuje");
    const receivedAt = Date.now();
    const questionStartedAt = game.questionStartedAt ?? receivedAt;
    if (receivedAt > questionStartedAt + question.timeLimit * 1000) {
      throw new Error("Čas na odpověď vypršel");
    }

    const player = await ctx.db.get(args.playerId);
    if (!player) throw new Error("Hráč neexistuje");

    const existingAnswers = await ctx.db
      .query("answers")
      .withIndex("by_game_question", (q) =>
        q.eq("gameId", args.gameId).eq("questionIndex", args.questionIndex),
      )
      .collect();
    const existingAnswer = existingAnswers.find((answer) => answer.playerId === args.playerId);
    if (existingAnswer) return existingAnswer.points;

    const answeredInMs = Math.max(0, receivedAt - questionStartedAt);

    let points = 0;
    if (args.isCorrect) {
      const timeFactor = 1 - (answeredInMs / (question.timeLimit * 1000)) * 0.5;
      const streakBonus = Math.min(player.streak * 50, 300);
      points = Math.max(0, Math.round(question.points * timeFactor) + streakBonus);
    }

    await ctx.db.insert("answers", { ...args, answeredAt: receivedAt, points });

    if (args.isCorrect) {
      await ctx.db.patch(args.playerId, {
        score: player.score + points,
        streak: player.streak + 1,
      });
    } else {
      await ctx.db.patch(args.playerId, { streak: 0 });
    }

    return points;
  },
});

export const getAnswers = query({
  args: {
    gameId: v.id("games"),
    questionIndex: v.number(),
  },
  handler: async (ctx, { gameId, questionIndex }) => {
    return await ctx.db
      .query("answers")
      .withIndex("by_game_question", (q) =>
        q.eq("gameId", gameId).eq("questionIndex", questionIndex),
      )
      .collect();
  },
});

export const history = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const hostedGames = await ctx.db
      .query("games")
      .withIndex("by_host", (q) => q.eq("hostId", userId))
      .collect();

    const myPlayerRecords = await ctx.db
      .query("players")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const gameMap = new Map<string, (typeof hostedGames)[number]>();
    for (const game of hostedGames) gameMap.set(game._id, game);
    const myPlayerByGame = new Map<string, (typeof myPlayerRecords)[number]>();
    for (const player of myPlayerRecords) {
      myPlayerByGame.set(player.gameId, player);
      if (!gameMap.has(player.gameId)) {
        const game = await ctx.db.get(player.gameId);
        if (game) gameMap.set(game._id, game);
      }
    }

    const results = await Promise.all(
      [...gameMap.values()]
        .filter((game) => game.status === "finished")
        .map(async (game) => {
          const quiz = await ctx.db.get(game.quizId);
          const players = await ctx.db
            .query("players")
            .withIndex("by_game", (q) => q.eq("gameId", game._id))
            .collect();
          const ranked = [...players].sort((a, b) => b.score - a.score);

          const myPlayer = myPlayerByGame.get(game._id);
          const myRank = myPlayer ? ranked.findIndex((p) => p._id === myPlayer._id) + 1 : null;

          const winner = ranked[0];

          return {
            _id: game._id,
            pin: game.pin,
            status: game.status,
            finishedAt: game.finishedAt,
            playedAt: game.finishedAt ?? game._creationTime,
            quizTitle: quiz?.title ?? "Smazaný kvíz",
            questionCount: quiz?.questions.length ?? 0,
            playerCount: players.length,
            hosted: game.hostId === userId,
            played: myPlayer !== undefined,
            myPlayerId: myPlayer?._id ?? null,
            myRank: myRank && myRank > 0 ? myRank : null,
            myScore: myPlayer?.score ?? null,
            winnerNickname: winner?.nickname ?? null,
            winnerScore: winner?.score ?? null,
          };
        }),
    );

    return results.sort((a, b) => b.playedAt - a.playedAt);
  },
});

export const active = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const hostedGames = await ctx.db
      .query("games")
      .withIndex("by_host", (q) => q.eq("hostId", userId))
      .collect();

    const candidates = new Map<string, (typeof hostedGames)[number]>();
    const playerByGame = new Map<string, string>();

    for (const game of hostedGames) {
      if (game.status !== "finished") candidates.set(game._id, game);
    }

    const myPlayerRecords = await ctx.db
      .query("players")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    for (const player of myPlayerRecords) {
      const game = await ctx.db.get(player.gameId);
      if (game && game.status !== "finished") {
        candidates.set(game._id, game);
        playerByGame.set(game._id, player._id);
      }
    }

    if (candidates.size === 0) return null;

    const game = [...candidates.values()].sort((a, b) => b._creationTime - a._creationTime)[0];
    const quiz = await ctx.db.get(game.quizId);

    return {
      _id: game._id,
      status: game.status,
      pin: game.pin,
      quizTitle: quiz?.title ?? "",
      hosted: game.hostId === userId,
      myPlayerId: playerByGame.get(game._id) ?? null,
    };
  },
});
