import { useTranslation } from "@/i18n/LanguageProvider";
import { getAvatar } from "@/lib/avatars";
import { formatRank, formatScore } from "@/lib/formatters";
import type { Player } from "@/types";
import { Flame, Medal } from "lucide-react";

interface LeaderboardProps {
  players: Player[];
  highlightId?: string;
}

const MEDAL_COLORS = ["text-yellow-400", "text-gray-300", "text-amber-500"];
const MEDAL_BG = ["bg-yellow-500/10", "bg-gray-400/10", "bg-amber-600/10"];

export function Leaderboard({ players, highlightId }: LeaderboardProps) {
  const { t } = useTranslation();
  const sorted = [...players].sort((a, b) => b.score - a.score);

  if (sorted.length === 0) {
    return <div className="text-center text-gray-600 py-8 text-sm">{t("lb.empty")}</div>;
  }

  return (
    <ol className="flex flex-col gap-1.5">
      {sorted.map((player, idx) => {
        const isHighlighted = player._id === highlightId;
        const avatar = getAvatar(player.avatar);
        return (
          <li
            key={player._id}
            className={[
              "flex items-center gap-3 rounded-xl px-3 py-2 transition-all duration-200",
              isHighlighted
                ? "bg-gradient-to-r from-violet-600/25 to-fuchsia-600/15 border border-violet-500/40"
                : idx < 3
                  ? `${MEDAL_BG[idx]} border border-white/5`
                  : "bg-white/[0.03] border border-white/[0.04] hover:bg-white/[0.05]",
            ].join(" ")}
          >
            <span
              className={`w-6 flex justify-center shrink-0 ${MEDAL_COLORS[idx] ?? "text-gray-600"}`}
            >
              {idx < 3 ? (
                <Medal size={15} />
              ) : (
                <span className="text-xs font-bold text-gray-600">{formatRank(idx + 1)}</span>
              )}
            </span>
            <img
              src={avatar.url}
              alt={avatar.label}
              className="w-8 h-8 rounded-lg shrink-0"
              style={{ backgroundColor: `#${avatar.bg}` }}
            />
            <span className="flex-1 min-w-0 font-semibold text-white truncate text-sm">
              {player.nickname}
              {isHighlighted && (
                <span className="ml-1.5 text-xs text-violet-400 font-normal">{t("lb.you")}</span>
              )}
            </span>
            {player.streak >= 2 && (
              <span className="flex items-center gap-0.5 text-xs text-orange-400 font-bold">
                <Flame size={12} /> {player.streak}
              </span>
            )}
            <span
              className={`font-black text-sm shrink-0 ${isHighlighted ? "text-violet-300" : "text-gray-300"}`}
            >
              {formatScore(player.score)}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
