import { useTranslation } from "@/i18n/LanguageProvider";
import { formatDate } from "@/lib/formatters";
import type { Quiz } from "@/types";
import { ChevronRight, HelpCircle } from "lucide-react";

interface QuizCardProps {
  quiz: Quiz;
  onOpen?: (quiz: Quiz) => void;
}

export function QuizCard({ quiz, onOpen }: QuizCardProps) {
  const { t, lang } = useTranslation();
  const monogram = quiz.title.trim().charAt(0).toUpperCase() || "?";

  return (
    <div
      className={`tile p-3 sm:p-4 flex items-center gap-3 group ${
        onOpen ? "cursor-pointer active:scale-[0.98]" : ""
      }`}
      onClick={onOpen ? () => onOpen(quiz) : undefined}
      role={onOpen ? "button" : undefined}
      tabIndex={onOpen ? 0 : undefined}
      onKeyDown={
        onOpen
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onOpen(quiz);
              }
            }
          : undefined
      }
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-lg font-black text-white shadow-glow-sm">
        {monogram}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="flex-1 min-w-0 truncate text-base font-bold text-white leading-snug">
            {quiz.title}
          </h3>
          <span
            className={`shrink-0 text-[10px] px-2 py-0.5 rounded-full font-semibold ${
              quiz.isPublic
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
                : "bg-white/5 text-gray-500 border border-white/10"
            }`}
          >
            {quiz.isPublic ? t("common.public") : t("common.private")}
          </span>
        </div>
        <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <HelpCircle size={12} className="shrink-0" /> {quiz.questions.length}
          </span>
          <span className="h-1 w-1 rounded-full bg-gray-600" />
          <span className="truncate">{formatDate(quiz.createdAt, lang)}</span>
        </div>
      </div>

      <ChevronRight
        size={18}
        className="shrink-0 text-gray-600 transition-transform group-active:translate-x-0.5"
      />
    </div>
  );
}
