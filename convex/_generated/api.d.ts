









import type * as auth from "../auth.js";
import type * as games from "../games.js";
import type * as http from "../http.js";
import type * as players from "../players.js";
import type * as quizzes from "../quizzes.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  games: typeof games;
  http: typeof http;
  players: typeof players;
  quizzes: typeof quizzes;
  users: typeof users;
}>;









export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;









export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
