import { AppHeader } from "@/components/AppHeader";
import { Leaderboard } from "@/components/Leaderboard";
import { Podium } from "@/components/Podium";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/i18n/LanguageProvider";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { ArrowLeft, Home, ListOrdered, RotateCcw, Trophy } from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

export default function Results() {
  const { gameId } = useParams<{ gameId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const playerId = searchParams.get("playerId");
  const review = searchParams.get("review") === "1";
  const game = useQuery(api.games.get, { id: gameId as Id<"games"> });
  const players = useQuery(api.players.getLeaderboard, game ? { gameId: game._id } : "skip");

  if (!game || !players) {
    return (
      <div className="min-h-screen-dvh flex items-center justify-center">
        <p className="text-gray-500 animate-pulse text-sm">{t("results.loading")}</p>
      </div>
    );
  }

  const myRank = playerId ? players.findIndex((p) => p._id === playerId) + 1 : null;

  return (
    <div className="min-h-screen-dvh bg-animated flex flex-col overflow-y-auto relative safe-x">
      {review && <AppHeader back="/history" />}
      <div className={`relative z-10 pb-8 px-6 ${review ? "pt-6" : "pt-8 safe-t-min"}`}>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-black text-center mb-1 text-gradient"
        >
          {review ? t("results.finalTitle") : t("results.title")}
        </motion.h1>

        {myRank && myRank <= 3 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2 }}
            className="text-center text-violet-300 font-bold text-sm mt-1"
          >
            <Trophy size={16} className="inline-block align-[-2px] mr-1" />
            {t("results.yourPlace", { n: myRank })}
          </motion.p>
        )}

        <Podium players={players} highlightId={playerId ?? undefined} celebrate={!review} />
      </div>

      <div className="relative z-10 flex-1 px-6 py-4 flex flex-col gap-3 max-w-lg mx-auto w-full">
        {(review || players.length > 3) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: review ? 0.1 : 2.5 }}
            className="card px-0 py-5 sm:p-5"
          >
            <h2 className="text-xs font-black text-white mb-3 flex items-center gap-2 uppercase tracking-wider">
              <ListOrdered size={14} className="text-violet-400" />
              {t("results.overall")}
            </h2>
            <Leaderboard players={players} highlightId={playerId ?? undefined} />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: review ? 0.2 : 2.8 }}
          className="flex flex-col sm:flex-row gap-3 pb-6 safe-b-min"
        >
          {review ? (
            <Button className="flex-1" onClick={() => navigate("/history", { replace: true })}>
              <ArrowLeft size={16} /> {t("results.backHistory")}
            </Button>
          ) : (
            <>
              <Button className="flex-1" onClick={() => navigate("/", { replace: true })}>
                <Home size={16} /> {t("results.home")}
              </Button>
              <Button
                className="flex-1"
                variant="secondary"
                onClick={() => navigate("/join", { replace: true })}
              >
                <RotateCcw size={16} /> {t("results.again")}
              </Button>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
