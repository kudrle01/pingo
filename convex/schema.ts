import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  quizzes: defineTable({
    title: v.string(),
    authorId: v.string(),
    isPublic: v.boolean(),
    questions: v.array(
      v.object({
        text: v.string(),
        type: v.union(v.literal("quiz"), v.literal("true_false"), v.literal("type_answer")),
        options: v.array(v.string()),
        correctIndex: v.number(),
        timeLimit: v.number(),
        points: v.number(),
      }),
    ),
    createdAt: v.number(),
  }),

  games: defineTable({
    quizId: v.id("quizzes"),
    hostId: v.string(),
    pin: v.string(),
    status: v.union(
      v.literal("lobby"),
      v.literal("question"),
      v.literal("results"),
      v.literal("finished"),
    ),
    currentQuestion: v.number(),
    questionStartedAt: v.optional(v.number()),
    finishedAt: v.optional(v.number()),
  })
    .index("by_pin", ["pin"])
    .index("by_host", ["hostId"]),

  players: defineTable({
    gameId: v.id("games"),
    userId: v.optional(v.id("users")),
    nickname: v.string(),
    avatar: v.optional(v.string()),
    score: v.number(),
    streak: v.number(),
  })
    .index("by_game", ["gameId"])
    .index("by_user", ["userId"]),

  answers: defineTable({
    gameId: v.id("games"),
    playerId: v.id("players"),
    questionIndex: v.number(),
    answerIndex: v.number(),
    answeredAt: v.number(),
    points: v.number(),
    isCorrect: v.boolean(),
  }).index("by_game_question", ["gameId", "questionIndex"]),
});
