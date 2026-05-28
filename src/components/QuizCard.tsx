import { Play, Pencil, Trash2, HelpCircle } from "lucide-react";
import { formatDate } from "@/lib/formatters";
import { Button } from "@/components/ui/Button";
import type { Quiz } from "@/types";

interface QuizCardProps {
  quiz: Quiz;
  onPlay?: (quiz: Quiz) => void;
  onEdit?: (quiz: Quiz) => void;
  onDelete?: (quiz: Quiz) => void;
}

export function QuizCard({ quiz, onPlay, onEdit, onDelete }: QuizCardProps) {
  return (
    <div className="card card-hover p-5 flex flex-col gap-4 group">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-white line-clamp-2 leading-snug">
            {quiz.title}
          </h3>
          <div className="flex items-center gap-2 mt-1.5">
            <HelpCircle size={12} className="text-gray-500 shrink-0" />
            <p className="text-xs text-gray-500 truncate">
              {quiz.questions.length} otázek · {formatDate(quiz.createdAt)}
            </p>
          </div>
        </div>
        <span
          className={`shrink-0 text-xs px-2.5 py-1 rounded-full font-semibold ${
            quiz.isPublic
              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
              : "bg-white/5 text-gray-500 border border-white/8"
          }`}
        >
          {quiz.isPublic ? "Veřejný" : "Soukromý"}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {onPlay && (
          <Button size="sm" onClick={() => onPlay(quiz)} className="flex-1">
            <Play size={13} /> Spustit
          </Button>
        )}
        {onEdit && (
          <Button size="sm" variant="secondary" onClick={() => onEdit(quiz)}>
            <Pencil size={13} />
          </Button>
        )}
        {onDelete && (
          <Button size="sm" variant="danger" onClick={() => onDelete(quiz)}>
            <Trash2 size={13} />
          </Button>
        )}
      </div>
    </div>
  );
}
