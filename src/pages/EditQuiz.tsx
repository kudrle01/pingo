import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "convex/react";
import { ArrowLeft, Plus, Save } from "lucide-react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { QuestionEditor } from "@/components/QuestionEditor";
import { QuestionImportButton } from "@/components/QuestionImportButton";
import { emptyQuestionForType } from "@/lib/questionTemplates";
import type { Question } from "@/types";

export default function EditQuiz() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const quiz = useQuery(api.quizzes.get, id ? { id: id as Id<"quizzes"> } : "skip");
  const updateQuiz = useMutation(api.quizzes.update);

  const [title, setTitle] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [saving, setSaving] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (quiz && !hydrated) {
      setTitle(quiz.title);
      setIsPublic(quiz.isPublic);
      setQuestions(quiz.questions);
      setHydrated(true);
    }
  }, [quiz, hydrated]);

  if (quiz === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 animate-pulse">Načítám kvíz…</p>
      </div>
    );
  }

  if (quiz === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4 sm:p-6">
        <p className="text-xl text-white">Kvíz nenalezen.</p>
        <Button onClick={() => navigate("/dashboard")}>Zpět na Dashboard</Button>
      </div>
    );
  }

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
    setQuestions((prev) => [...prev, ...imported]);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || questions.length === 0 || !id) return;
    setSaving(true);
    try {
      await updateQuiz({
        id: id as Id<"quizzes">,
        title: title.trim(),
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
          <h1 className="text-2xl sm:text-3xl font-black text-white">Upravit kvíz</h1>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-6">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5 flex flex-col gap-4">
            <Input
              label="Název kvízu"
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

          <Button type="submit" size="lg" isLoading={saving}>
            <Save size={18} /> Uložit změny
          </Button>
        </form>
      </div>
    </div>
  );
}
