import { useQuery } from "convex/react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Trophy, Users, Crown, Gamepad2, ChevronRight } from "lucide-react";
import { api } from "@convex/_generated/api";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/i18n/LanguageProvider";
import { formatScore, formatDate } from "@/lib/formatters";

export default function History() {
  const navigate = useNavigate();
  const { t, lang } = useTranslation();
  const games = useQuery(api.games.history);

  if (games === undefined) {
    return (
      <div className="min-h-screen-dvh flex items-center justify-center">
        <p className="text-gray-500 animate-pulse text-sm">{t("history.loading")}</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex h-screen-dvh flex-col overflow-hidden">
      <AppHeader title={t("history.title")} />
      <div className="flex-1 min-h-0 overflow-y-auto">
      <div className="max-w-2xl mx-auto p-4 sm:p-6 safe-x sm:pb-10">
        <p className="text-gray-500 text-sm mb-5">
          {games.length === 0 ? t("history.none") : t("history.count", { count: games.length })}
        </p>

        {games.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="tile text-center py-16 px-6 flex flex-col items-center gap-4"
          >
            <div className="w-16 h-16 rounded-3xl bg-surface-700 border border-white/5 flex items-center justify-center">
              <Gamepad2 size={28} className="text-gray-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-300">{t("history.empty.title")}</p>
              <p className="text-gray-600 text-sm mt-1">{t("history.empty.subtitle")}</p>
            </div>
            <Button onClick={() => navigate("/join")}>
              <Gamepad2 size={16} /> {t("history.empty.cta")}
            </Button>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-3">
            {games.map((game, i) => {
              const isWinner = game.myRank === 1;
              return (
                <motion.button
                  key={game._id}
                  type="button"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.04, 0.3) }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() =>
                    navigate(
                      `/results/${game._id}?review=1${
                        game.myPlayerId ? `&playerId=${game.myPlayerId}` : ""
                      }`
                    )
                  }
                  className="tile p-4 text-left flex items-center gap-3"
                >
                  <div className="flex-1 min-w-0">
                    {game.hosted && (
                      <div className="mb-1">
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold border border-violet-500/25 bg-violet-500/15 text-violet-300">
                          <Crown size={9} className="inline-block align-[-1px] mr-1" />
                          {t("history.hosted")}
                        </span>
                      </div>
                    )}
                    <h3 className="text-base font-bold text-white truncate">
                      {game.quizTitle}
                    </h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span>{formatDate(game.playedAt, lang)}</span>
                      <span className="flex items-center gap-1">
                        <Users size={11} /> {game.playerCount}
                      </span>
                      {game.winnerNickname && (
                        <span className="flex items-center gap-1 truncate">
                          <Trophy size={11} className="text-yellow-400 shrink-0" />
                          <span className="truncate">{game.winnerNickname}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {game.played && game.myRank ? (
                    <div
                      className={`shrink-0 text-center rounded-xl px-3 py-2 border ${
                        isWinner
                          ? "bg-yellow-500/10 border-yellow-500/30"
                          : "bg-white/5 border-white/10"
                      }`}
                    >
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                        {t("history.yourPlace")}
                      </p>
                      <p
                        className={`text-lg font-black leading-none ${
                          isWinner ? "text-yellow-400" : "text-white"
                        }`}
                      >
                        {game.myRank}.
                      </p>
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        {formatScore(game.myScore ?? 0)}
                      </p>
                    </div>
                  ) : (
                    <ChevronRight size={18} className="text-gray-600 shrink-0" />
                  )}
                </motion.button>
              );
            })}
          </div>
        )}
      </div>
      </div>
      <BottomNav />
    </div>
  );
}
