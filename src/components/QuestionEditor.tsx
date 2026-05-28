import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { migrateQuestionType } from "@/lib/questionTemplates";
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
          Otázka {index + 1}
        </span>
        {total > 1 && (
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex items-center gap-1.5 text-red-400 hover:text-red-300 text-sm"
          >
            <Trash2 size={14} /> Odstranit
          </button>
        )}
      </div>

      <Input
        label="Text otázky"
        placeholder="Co je hlavní město Francie?"
        value={question.text}
        onChange={(e) => update({ text: e.target.value })}
        required
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-gray-300 mb-1.5 block">Typ</label>
          <select
            value={question.type}
            onChange={(e) => changeType(e.target.value as QuestionType)}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm"
          >
            <option value="quiz">Výběr z možností</option>
            <option value="true_false">Pravda / Nepravda</option>
            <option value="type_answer">Psaná odpověď</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-300 mb-1.5 block">Čas (s)</label>
          <select
            value={question.timeLimit}
            onChange={(e) => update({ timeLimit: Number(e.target.value) })}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm"
          >
            {[5, 10, 20, 30, 60].map((t) => (
              <option key={t} value={t}>
                {t}s
              </option>
            ))}
          </select>
        </div>
      </div>
      {question.type === "quiz" && (
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-300">
            Možnosti (zaškrtni správnou)
          </label>
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
                placeholder={`Možnost ${oIdx + 1}`}
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-violet-500"
                required
              />
            </div>
          ))}
        </div>
      )}

      {question.type === "true_false" && (
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-300">Správná odpověď</label>
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
          label="Správná odpověď"
          placeholder="Např. Paříž"
          value={question.options[0] ?? ""}
          onChange={(e) => updateOption(0, e.target.value)}
          required
        />
      )}
    </div>
  );
}
