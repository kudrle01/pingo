import { useNavigate } from "react-router-dom";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { api } from "@convex/_generated/api";
import { useTranslation } from "@/i18n/LanguageProvider";

export function ResumeBar() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const active = useQuery(api.games.active);

  if (!active) return null;

  const to = active.hosted
    ? `/host/${active._id}`
    : `/play/${active._id}?playerId=${active.myPlayerId ?? ""}`;

  const label = active.status === "lobby" ? t("resume.lobby") : t("resume.label");

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => navigate(to)}
      className="block w-full border-b border-violet-500/20 bg-gradient-to-r from-violet-600/20 to-fuchsia-600/15 py-2.5 text-left transition-colors hover:from-violet-600/30 hover:to-fuchsia-600/20 safe-x"
    >
      <span className="mx-auto flex w-full max-w-5xl items-center gap-3">
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-xs font-bold text-white">{label}</span>
          <span className="block truncate text-[11px] text-violet-200/80">{active.quizTitle}</span>
        </span>
        <span className="flex shrink-0 items-center gap-1.5 rounded-xl bg-white/10 px-3 py-1.5 text-xs font-bold text-white">
          <Play size={13} /> {t("resume.cta")}
        </span>
      </span>
    </motion.button>
  );
}
