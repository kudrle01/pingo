import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { Home, RotateCcw, ListOrdered, Trophy } from "lucide-react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { Podium } from "@/components/Podium";
import { Leaderboard } from "@/components/Leaderboard";
import { Button } from "@/components/ui/Button";

export default function Results() {
  const { gameId } = useParams<{ gameId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const playerId = searchParams.get("playerId");
  const game = useQuery(api.games.get, { id: gameId as Id<"games"> });
  const players = useQuery(
    api.players.getLeaderboard,
    game ? { gameId: game._id } : "skip"
  );

  if (!game || !players) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 animate-pulse text-sm">Načítám výsledky…</p>
      </div>
    );
  }

  const myRank = playerId ? players.findIndex((p) => p._id === playerId) + 1 : null;

  return (
    <div className="min-h-screen bg-animated flex flex-col overflow-hidden relative">
      <div className="relative z-10 pb-8 px-6 pt-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-black text-center mb-1 text-gradient"
        >
          Výsledky
        </motion.h1>

        {myRank && myRank <= 3 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2 }}
            className="text-center text-violet-300 font-bold text-sm mt-1"
          >
            <Trophy size={16} className="inline-block align-[-2px] mr-1" />
            Jsi na {myRank}. místě!
          </motion.p>
        )}

        <Podium players={players} highlightId={playerId ?? undefined} />
      </div>

      <div className="relative z-10 flex-1 px-6 py-4 flex flex-col gap-3 max-w-lg mx-auto w-full">
        {players.length > 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5 }}
            className="card p-5"
          >
            <h2 className="text-xs font-black text-white mb-3 flex items-center gap-2 uppercase tracking-wider">
              <ListOrdered size={14} className="text-violet-400" />
              Celkové pořadí
            </h2>
            <Leaderboard players={players} highlightId={playerId ?? undefined} />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.8 }}
          className="flex flex-col sm:flex-row gap-3 pb-6"
        >
          <Button className="flex-1" onClick={() => navigate("/", { replace: true })}>
            <Home size={16} /> Domů
          </Button>
          <Button className="flex-1" variant="secondary" onClick={() => navigate("/join", { replace: true })}>
            <RotateCcw size={16} /> Hrát znovu
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
