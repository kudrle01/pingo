import type { Question } from "@/types";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface AnswerCount {
  index: number;
  count: number;
}

interface AnswerDistributionProps {
  question: Question;
  counts: AnswerCount[];
  total: number;
}

const BAR_COLORS = ["bg-[#e74c3c]", "bg-[#3498db]", "bg-[#f39c12]", "bg-[#2ecc71]"];

export function AnswerDistribution({ question, counts, total }: AnswerDistributionProps) {
  const max = Math.max(...counts.map((c) => c.count), 1);

  return (
    <div className="flex flex-col gap-3">
      {question.options.map((option, idx) => {
        const count = counts.find((c) => c.index === idx)?.count ?? 0;
        const pct = total > 0 ? Math.round((count / total) * 100) : 0;
        const barPct = Math.round((count / max) * 100);
        const isCorrect = idx === question.correctIndex;

        return (
          <div
            key={idx}
            className="grid grid-cols-[0.5rem_minmax(0,1fr)_1.25rem] items-center gap-3"
          >
            <div className={`h-2 w-2 rounded-full ${BAR_COLORS[idx] ?? "bg-gray-500"}`} />
            <div className="min-w-0">
              <div className="mb-1 flex items-start justify-between gap-3 text-sm">
                <span
                  className={`min-w-0 flex-1 break-words font-medium ${isCorrect ? "text-green-400" : "text-gray-300"}`}
                >
                  {option}
                </span>
                <span className="shrink-0 text-gray-400">
                  {count} ({pct}%)
                </span>
              </div>
              <div className="h-6 bg-surface-600 rounded-lg overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${barPct}%` }}
                  transition={{ duration: 0.7, delay: idx * 0.1, ease: "easeOut" }}
                  className={`h-full rounded-lg ${BAR_COLORS[idx] ?? "bg-gray-500"} ${isCorrect ? "ring-2 ring-green-400" : ""}`}
                />
              </div>
            </div>
            <div className="flex h-5 w-5 items-center justify-center self-center">
              {isCorrect && <CheckCircle2 size={18} className="text-green-400" />}
            </div>
          </div>
        );
      })}
    </div>
  );
}
