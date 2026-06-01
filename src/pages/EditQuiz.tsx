import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "convex/react";
import { Plus, Save } from "lucide-react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { QuestionEditor } from "@/components/QuestionEditor";
import { QuestionImportButton } from "@/components/QuestionImportButton";
import { useTranslation } from "@/i18n/LanguageProvider";
import { useToast } from "@/components/ToastProvider";
import { emptyQuestionForType } from "@/lib/questionTemplates";
import type { Question } from "@/types";

export default function EditQuiz() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const toast = useToast();

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
      <div className="min-h-screen-dvh flex items-center justify-center">
        <p className="text-gray-400 animate-pulse">{t("quizForm.loading")}</p>
      </div>
    );
  }

  if (quiz === null) {
    return (
      <div className="min-h-screen-dvh flex flex-col items-center justify-center gap-4 p-4 sm:p-6">
        <p className="text-xl text-white">{t("quizForm.notFound")}</p>
        <Button onClick={() => navigate("/dashboard")}>{t("quizForm.backDashboard")}</Button>
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
      toast.success(t("toast.quizUpdated"));
      navigate("/dashboard", { replace: true });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen-dvh bg-gray-950">
      <AppHeader title={t("quizForm.editTitle")} back="/dashboard" />
      <div className="max-w-2xl mx-auto p-4 sm:p-6 safe-x safe-b-min">
        <h1 className="hidden sm:block text-2xl sm:text-3xl font-black text-white mb-8">{t("quizForm.editTitle")}</h1>

        <form onSubmit={handleSave} className="flex flex-col gap-6">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5 flex flex-col gap-4">
            <Input
              label={t("quizForm.name")}
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
              <span className="text-gray-300 text-sm">{t("quizForm.public")}</span>
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
            <Plus size={18} /> {t("quizForm.addQuestion")}
          </Button>

          <Button type="submit" size="lg" isLoading={saving}>
            <Save size={18} /> {t("quizForm.saveEdit")}
          </Button>
        </form>
      </div>
    </div>
  );
}
