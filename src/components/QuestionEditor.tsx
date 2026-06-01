import { Trash2, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { migrateQuestionType } from "@/lib/questionTemplates";
import { useTranslation } from "@/i18n/LanguageProvider";
import type { Question, QuestionType } from "@/types";

interface QuestionEditorProps {
  question: Question;
  index: number;
  total: number;
  onChange: (q: Question) => void;
  onRemove: () => void;
}

export function QuestionEditor({
  question,
  index,
  total,
  onChange,
  onRemove,
}: QuestionEditorProps) {
  const { t } = useTranslation();

  function update(patch: Partial<Question>) {
    onChange({ ...question, ...patch });
  }

  function updateOption(idx: number, value: string) {
    const options = [...question.options];
    options[idx] = value;
    onChange({ ...question, options });
  }

  function changeType(newType: QuestionType) {
    onChange(migrateQuestionType(question, newType));
  }

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-4 sm:p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-violet-400">
          {t("qedit.questionN", { n: index + 1 })}
        </span>
        {total > 1 && (
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex items-center gap-1.5 text-red-400 hover:text-red-300 text-sm"
          >
            <Trash2 size={14} /> {t("qedit.remove")}
          </button>
        )}
      </div>

      <Input
        label={t("qedit.text")}
        placeholder={t("qedit.textPlaceholder")}
        value={question.text}
        onChange={(e) => update({ text: e.target.value })}
        required
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-gray-300 mb-1.5 block">{t("qedit.type")}</label>
          <div className="relative">
            <select
              value={question.type}
              onChange={(e) => changeType(e.target.value as QuestionType)}
              className="w-full appearance-none bg-gray-800 border border-gray-700 rounded-xl pl-3 pr-9 py-2.5 text-white text-sm"
            >
              <option value="quiz">{t("qedit.type.quiz")}</option>
              <option value="true_false">{t("qedit.type.true_false")}</option>
              <option value="type_answer">{t("qedit.type.type_answer")}</option>
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>
        <div>
          <label className="text-sm text-gray-300 mb-1.5 block">{t("qedit.time")}</label>
          <div className="relative">
            <select
              value={question.timeLimit}
              onChange={(e) => update({ timeLimit: Number(e.target.value) })}
              className="w-full appearance-none bg-gray-800 border border-gray-700 rounded-xl pl-3 pr-9 py-2.5 text-white text-sm"
            >
              {[5, 10, 20, 30, 60].map((sec) => (
                <option key={sec} value={sec}>
                  {sec}s
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>
      </div>
      {question.type === "quiz" && (
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-300">{t("qedit.options")}</label>
          {question.options.map((opt, oIdx) => (
            <div key={oIdx} className="flex items-center gap-2">
              <input
                type="radio"
                name={`correct-${index}`}
                checked={question.correctIndex === oIdx}
                onChange={() => update({ correctIndex: oIdx })}
                className="accent-violet-500 w-4 h-4 shrink-0"
              />
              <input
                type="text"
                value={opt}
                onChange={(e) => updateOption(oIdx, e.target.value)}
                placeholder={t("qedit.optionN", { n: oIdx + 1 })}
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-violet-500"
                required
              />
            </div>
          ))}
        </div>
      )}

      {question.type === "true_false" && (
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-300">{t("qedit.correctAnswer")}</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {question.options.map((opt, oIdx) => {
              const isSelected = question.correctIndex === oIdx;
              return (
                <button
                  key={oIdx}
                  type="button"
                  onClick={() => update({ correctIndex: oIdx })}
                  className={[
                    "rounded-xl px-4 py-3 font-semibold transition-colors",
                    isSelected
                      ? "bg-violet-600 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700",
                  ].join(" ")}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {question.type === "type_answer" && (
        <Input
          label={t("qedit.correctAnswer")}
          placeholder={t("qedit.typeAnswerPlaceholder")}
          value={question.options[0] ?? ""}
          onChange={(e) => updateOption(0, e.target.value)}
          required
        />
      )}
    </div>
  );
}
