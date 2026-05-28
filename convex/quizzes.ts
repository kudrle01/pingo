import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: { authorId: v.optional(v.string()) },
  handler: async (ctx, { authorId }) => {
    if (authorId) {
      return await ctx.db
        .query("quizzes")
        .filter((q) => q.eq(q.field("authorId"), authorId))
        .order("desc")
        .collect();
    }
    return await ctx.db
      .query("quizzes")
      .filter((q) => q.eq(q.field("isPublic"), true))
      .order("desc")
      .collect();
  },
});

export const get = query({
  args: { id: v.id("quizzes") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    authorId: v.string(),
    isPublic: v.boolean(),
    questions: v.array(
      v.object({
        text: v.string(),
        type: v.union(
          v.literal("quiz"),
          v.literal("true_false"),
          v.literal("type_answer")
        ),
        options: v.array(v.string()),
        correctIndex: v.number(),
        timeLimit: v.number(),
        points: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("quizzes", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("quizzes"),
    title: v.optional(v.string()),
    isPublic: v.optional(v.boolean()),
    questions: v.optional(
      v.array(
        v.object({
          text: v.string(),
          type: v.union(
            v.literal("quiz"),
            v.literal("true_false"),
            v.literal("type_answer")
          ),
          options: v.array(v.string()),
          correctIndex: v.number(),
          timeLimit: v.number(),
          points: v.number(),
        })
      )
    ),
  },
  handler: async (ctx, { id, ...patch }) => {
    await ctx.db.patch(id, patch);
  },
});

export const remove = mutation({
  args: { id: v.id("quizzes") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
