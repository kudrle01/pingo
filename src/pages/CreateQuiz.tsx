import { AppHeader } from "@/components/AppHeader";
import { QuestionEditor } from "@/components/QuestionEditor";
import { QuestionImportButton } from "@/components/QuestionImportButton";
import { useToast } from "@/components/ToastProvider";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useTranslation } from "@/i18n/LanguageProvider";
import { emptyQuestionForType } from "@/lib/questionTemplates";
import type { Question } from "@/types";
import { api } from "@convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { Plus, Save } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateQuiz() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const toast = useToast();
  const createQuiz = useMutation(api.quizzes.create);
  const me = useQuery(api.users.me);

  const [title, setTitle] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([emptyQuestionForType("quiz")]);
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
      const isInitial = prev.length === 1 && prev[0].text === "" && prev[0].type === "quiz";
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
      toast.success(t("toast.quizCreated"));
      navigate("/dashboard", { replace: true });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen-dvh bg-gray-950">
      <AppHeader title={t("quizForm.createTitle")} back="/dashboard" />
      <div className="max-w-2xl mx-auto p-4 sm:p-6 safe-x safe-b-min">
        <h1 className="hidden sm:block text-2xl sm:text-3xl font-black text-white mb-8">
          {t("quizForm.createTitle")}
        </h1>

        <form onSubmit={handleSave} className="flex flex-col gap-6">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5 flex flex-col gap-4">
            <Input
              label={t("quizForm.name")}
              placeholder={t("quizForm.namePlaceholder")}
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

          <Button type="submit" size="lg" isLoading={saving} disabled={!me}>
            <Save size={18} /> {t("quizForm.saveCreate")}
          </Button>
        </form>
      </div>
    </div>
  );
}
