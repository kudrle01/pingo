import { useEffect } from "react";
import { Medal } from "lucide-react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { formatScore } from "@/lib/formatters";
import { getAvatar } from "@/lib/avatars";
import type { Player } from "@/types";

interface PodiumProps {
  players: Player[];
  highlightId?: string;
  celebrate?: boolean;
}

const SLOTS = [
  { rank: 2, height: "h-28", bg: "bg-gray-600",   crown: "bg-gray-500",   delay: 0.5 },
  { rank: 1, height: "h-44", bg: "bg-yellow-500", crown: "bg-yellow-400", delay: 1.3 },
  { rank: 3, height: "h-16", bg: "bg-amber-700",  crown: "bg-amber-600",  delay: 0.0 },
] as const;

const RANK_ICONS = {
  1: <Medal className="h-4 w-4" strokeWidth={2.5} />,
  2: <Medal className="h-4 w-4" strokeWidth={2.5} />,
  3: <Medal className="h-4 w-4" strokeWidth={2.5} />,
} as const;

export function Podium({ players, highlightId, celebrate = true }: PodiumProps) {
  useEffect(() => {
    if (!celebrate) return;
    const t = setTimeout(() => {
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.3 },
        colors: ["#a855f7", "#ec4899", "#f59e0b", "#10b981", "#ffffff", "#6366f1"],
      });
    }, 2000);
    return () => clearTimeout(t);
  }, [celebrate]);

  return (
    <div className="flex items-end justify-center gap-2 sm:gap-3 pt-6 pb-2 overflow-x-auto">
      {SLOTS.map(({ rank, height, bg, crown, delay }) => {
        const player = players[rank - 1];
        const avatar = player ? getAvatar(player.avatar) : null;
        return (
          <div key={rank} className="flex flex-col items-center w-24 sm:w-28 shrink-0">
            {player && avatar && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: delay + 0.4, type: "spring", bounce: 0.4 }}
                className="text-center mb-2 w-full"
              >
                <div className={[
                  "w-14 h-14 rounded-full mx-auto mb-1.5 overflow-hidden border-2 shadow-lg",
                  player._id === highlightId
                    ? "border-violet-400 shadow-glow-sm scale-110"
                    : "border-white/20",
                ].join(" ")}
                  style={{ backgroundColor: "#" + avatar.bg }}
                >
                  <img src={avatar.url} alt={avatar.label} className="w-full h-full object-cover" />
                </div>
                <p className="text-white font-black text-xs truncate leading-tight px-1">
                  {player.nickname}
                </p>
                <p className="text-gray-400 text-xs font-semibold">{formatScore(player.score)}</p>
              </motion.div>
            )}

            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay, type: "spring", bounce: 0.15, duration: 0.7 }}
              style={{ originY: 1 }}
              className={`w-full ${height} ${bg} rounded-t-2xl flex items-start justify-center pt-3 shadow-lg`}
            >
              <span className={`${crown} rounded-full w-8 h-8 flex items-center justify-center text-white font-black text-sm shadow-md`}>
                {RANK_ICONS[rank] ?? rank}
              </span>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}

