import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "convex/react";
import { ArrowLeft, Plus, Save } from "lucide-react";
import { api } from "@convex/_generated/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { QuestionEditor } from "@/components/QuestionEditor";
import { QuestionImportButton } from "@/components/QuestionImportButton";
import { emptyQuestionForType } from "@/lib/questionTemplates";
import type { Question } from "@/types";

export default function CreateQuiz() {
  const navigate = useNavigate();
  const createQuiz = useMutation(api.quizzes.create);
  const me = useQuery(api.users.me);

  const [title, setTitle] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([
    emptyQuestionForType("quiz"),
  ]);
  const [saving, setSaving] = useState(false);

  function addQuestion() {
    setQuestions((prev) => [...prev, emptyQuestionForType("quiz")]);
  }

  function updateQuestion(idx: number, next: Question) {
    setQuestions((prev) => prev.map((q, i) => (i === idx ? next : q)));
  }

  function removeQuestion(idx: number) {
    setQuestions((prev) => prev.filter((_, i) => i !== idx));
  }

  function handleImport(imported: Question[]) {
    setQuestions((prev) => {
      const isInitial =
        prev.length === 1 && prev[0].text === "" && prev[0].type === "quiz";
      return isInitial ? imported : [...prev, ...imported];
    });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || questions.length === 0 || !me) return;
    setSaving(true);
    try {
      await createQuiz({
        title: title.trim(),
        authorId: me._id,
        isPublic,
        questions,
      });
      navigate("/dashboard", { replace: true });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4 mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={17} /> Zpět
          </button>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Nový kvíz</h1>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-6">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5 flex flex-col gap-4">
            <Input
              label="Název kvízu"
              placeholder="Např. Geografie Evropy"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="w-4 h-4 accent-violet-500"
              />
              <span className="text-gray-300 text-sm">Veřejný kvíz</span>
            </label>
            <QuestionImportButton onImport={handleImport} />
          </div>

          {questions.map((q, qIdx) => (
            <QuestionEditor
              key={qIdx}
              question={q}
              index={qIdx}
              total={questions.length}
              onChange={(next) => updateQuestion(qIdx, next)}
              onRemove={() => removeQuestion(qIdx)}
            />
          ))}

          <Button type="button" variant="secondary" onClick={addQuestion}>
            <Plus size={18} /> Přidat otázku
          </Button>

          <Button type="submit" size="lg" isLoading={saving} disabled={!me}>
            <Save size={18} /> Uložit kvíz
          </Button>
        </form>
      </div>
    </div>
  );
}
