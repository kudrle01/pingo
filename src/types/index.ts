import type { Id } from "@convex/_generated/dataModel";

export type QuestionType = "quiz" | "true_false" | "type_answer";

export type GameStatus = "lobby" | "question" | "results" | "finished";

export interface Question {
  text: string;
  type: QuestionType;
  options: string[];
  correctIndex: number;
  timeLimit: number;
  points: number;
}

export interface Quiz {
  _id: Id<"quizzes">;
  title: string;
  authorId: string;
  isPublic: boolean;
  questions: Question[];
  createdAt: number;
}

export interface Game {
  _id: Id<"games">;
  quizId: Id<"quizzes">;
  hostId: string;
  pin: string;
  status: GameStatus;
  currentQuestion: number;
  questionStartedAt?: number;
}

export interface Player {
  _id: Id<"players">;
  gameId: Id<"games">;
  nickname: string;
  avatar?: string;
  score: number;
  streak: number;
}

export interface Answer {
  _id: Id<"answers">;
  gameId: Id<"games">;
  playerId: Id<"players">;
  questionIndex: number;
  answerIndex: number;
  answeredAt: number;
  points: number;
  isCorrect: boolean;
}
