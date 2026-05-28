import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

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
      v.literal("finished")
    ),
    currentQuestion: v.optional(v.number()),
    questionStartedAt: v.optional(v.number()),
  },
  handler: async (ctx, { id, status, currentQuestion, questionStartedAt }) => {
    const patch: Record<string, unknown> = { status };
    if (currentQuestion !== undefined) patch.currentQuestion = currentQuestion;
    if (questionStartedAt !== undefined) patch.questionStartedAt = questionStartedAt;
    await ctx.db.patch(id, patch);
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
        q.eq("gameId", args.gameId).eq("questionIndex", args.questionIndex)
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
        q.eq("gameId", gameId).eq("questionIndex", questionIndex)
      )
      .collect();
  },
});
