import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useTranslation } from "@/i18n/LanguageProvider";
import { isTextAnswerCorrect } from "@/lib/questionTemplates";
import type { Question } from "@/types";
import { motion } from "framer-motion";
import { Check, Circle, Diamond, SendHorizontal, Square, Triangle, X } from "lucide-react";

const QUIZ_COLORS = ["bg-[#e74c3c]", "bg-[#3498db]", "bg-[#f39c12]", "bg-[#2ecc71]"];
const QUIZ_ICONS = [Triangle, Diamond, Circle, Square];

const optionVariants = {
  hidden: { opacity: 0, scale: 0.6, y: 30 },
  show: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { delay: i * 0.08, type: "spring" as const, bounce: 0.45 },
  }),
  tap: { scale: 0.93 },
};

interface AnswerOptionsProps {
  question: Question;
  questionIndex: number;
  answered: boolean;
  selectedAnswer: number | null;
  textAnswer: string;
  onTextAnswerChange: (value: string) => void;
  onAnswer: (optionIndex: number, isCorrect: boolean) => void;
}

export function AnswerOptions({
  question,
  questionIndex,
  answered,
  selectedAnswer,
  textAnswer,
  onTextAnswerChange,
  onAnswer,
}: AnswerOptionsProps) {
  const { t } = useTranslation();

  if (question.type === "quiz") {
    return (
      <motion.div
        key={`grid-${questionIndex}`}
        variants={{ show: { transition: { staggerChildren: 0.07 } } }}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
      >
        {question.options.map((option, idx) => {
          const Icon = QUIZ_ICONS[idx] ?? Circle;
          const isSelected = answered && idx === selectedAnswer;
          return (
            <motion.button
              key={idx}
              custom={idx}
              variants={optionVariants}
              whileTap="tap"
              onClick={() => onAnswer(idx, idx === question.correctIndex)}
              disabled={answered}
              className={[
                "rounded-2xl p-4 min-h-[72px] sm:min-h-[88px] text-white font-bold text-left flex items-center gap-3 shadow-lg transition-all duration-200 active:scale-[0.97]",
                QUIZ_COLORS[idx] ?? QUIZ_COLORS[0],
                isSelected ? "ring-4 ring-white shadow-xl" : "",
                answered && !isSelected ? "opacity-40 scale-95" : "",
                "disabled:cursor-not-allowed",
              ].join(" ")}
            >
              <Icon size={20} className="shrink-0" />
              <span className="min-w-0 break-words text-sm">{option}</span>
            </motion.button>
          );
        })}
      </motion.div>
    );
  }

  if (question.type === "true_false") {
    return (
      <motion.div
        key={`tf-${questionIndex}`}
        variants={{ show: { transition: { staggerChildren: 0.1 } } }}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
      >
        {question.options.map((option, idx) => {
          const isSelected = answered && idx === selectedAnswer;
          return (
            <motion.button
              key={idx}
              custom={idx}
              variants={optionVariants}
              whileTap="tap"
              onClick={() => onAnswer(idx, idx === question.correctIndex)}
              disabled={answered}
              className={[
                "rounded-2xl p-6 text-white font-bold text-xl flex flex-col items-center justify-center gap-2 text-center break-words transition-all duration-200",
                idx === 0 ? "bg-[#2ecc71]" : "bg-[#e74c3c]",
                isSelected ? "ring-4 ring-white shadow-xl" : "",
                answered && !isSelected ? "opacity-40 scale-95" : "",
                "disabled:cursor-not-allowed",
              ].join(" ")}
            >
              {idx === 0 ? (
                <Check size={32} className="shrink-0" />
              ) : (
                <X size={32} className="shrink-0" />
              )}
              <span className="min-w-0 break-words">{option}</span>
            </motion.button>
          );
        })}
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={(e) => {
        e.preventDefault();
        if (answered) return;
        onAnswer(0, isTextAnswerCorrect(question.options[0] ?? "", textAnswer));
      }}
      className="flex flex-col gap-3"
    >
      <Input
        placeholder={t("play.typePlaceholder")}
        value={textAnswer}
        onChange={(e) => onTextAnswerChange(e.target.value)}
        disabled={answered}
        autoFocus
      />
      <Button type="submit" size="lg" disabled={answered || textAnswer.trim().length === 0}>
        {t("play.submit")} <SendHorizontal size={18} />
      </Button>
    </motion.form>
  );
}
