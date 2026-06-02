import { AppHeader } from "@/components/AppHeader";
import { QuestionEditor } from "@/components/QuestionEditor";
import { useToast } from "@/components/ToastProvider";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useTranslation } from "@/i18n/LanguageProvider";
import { formatDate } from "@/lib/formatters";
import { generatePin } from "@/lib/pinGenerator";
import type { Question, QuestionType } from "@/types";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { motion } from "framer-motion";
import { Check, Clock, HelpCircle, Pencil, Play, Trash2, Trophy, X } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function formatDuration(totalSeconds: number) {
  if (totalSeconds < 60) return `${totalSeconds}s`;
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function cloneQuestion(q: Question): Question {
  return { ...q, options: [...q.options] };
}

export default function QuizDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, lang } = useTranslation();
  const toast = useToast();

  const quiz = useQuery(api.quizzes.get, id ? { id: id as Id<"quizzes"> } : "skip");
  const me = useQuery(api.users.me);
  const createGame = useMutation(api.games.create);
  const removeQuiz = useMutation(api.quizzes.remove);
  const updateQuiz = useMutation(api.quizzes.update);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState<Question | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);

  const TYPE_LABELS: Record<QuestionType, string> = {
    quiz: t("qedit.type.quiz"),
    true_false: t("qedit.type.true_false"),
    type_answer: t("qedit.type.type_answer"),
  };

  if (quiz === undefined) {
    return (
      <div className="min-h-screen-dvh flex items-center justify-center">
        <p className="text-gray-500 animate-pulse text-sm">{t("common.loading")}</p>
      </div>
    );
  }

  if (quiz === null) {
    return (
      <div className="min-h-screen-dvh flex flex-col items-center justify-center gap-4 p-4 sm:p-6">
        <p className="text-xl text-white">{t("detail.notFound")}</p>
        <Button onClick={() => navigate("/dashboard")}>{t("detail.backQuizzes")}</Button>
      </div>
    );
  }

  const monogram = quiz.title.trim().charAt(0).toUpperCase() || "?";
  const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);
  const totalTime = quiz.questions.reduce((sum, q) => sum + q.timeLimit, 0);

  const original = editingIndex !== null ? quiz.questions[editingIndex] : null;
  const dirty =
    draft !== null && original !== null && JSON.stringify(draft) !== JSON.stringify(original);

  function startEdit(idx: number) {
    setEditingIndex(idx);
    setDraft(cloneQuestion(quiz!.questions[idx]));
  }

  function closeEdit() {
    setEditingIndex(null);
    setDraft(null);
  }

  async function persistQuestions(questions: Question[]) {
    await updateQuiz({
      id: quiz!._id,
      title: quiz!.title,
      isPublic: quiz!.isPublic,
      questions,
    });
  }

  async function confirmSave() {
    if (editingIndex === null || !draft) return;
    setIsSaving(true);
    try {
      const next = quiz!.questions.map((q, i) => (i === editingIndex ? draft : q));
      await persistQuestions(next);
      toast.success(t("toast.questionSaved"));
      closeEdit();
    } catch {
      toast.error(t("toast.error"));
    } finally {
      setIsSaving(false);
      setSaveOpen(false);
    }
  }

  async function confirmRemove() {
    if (editingIndex === null) return;
    setIsSaving(true);
    try {
      const next = quiz!.questions.filter((_, i) => i !== editingIndex);
      await persistQuestions(next);
      toast.success(t("toast.questionRemoved"));
      closeEdit();
    } catch {
      toast.error(t("toast.error"));
    } finally {
      setIsSaving(false);
      setRemoveOpen(false);
    }
  }

  function requestCancel() {
    if (dirty) setCancelOpen(true);
    else closeEdit();
  }

  async function handlePlay() {
    if (!me) return;
    setIsStarting(true);
    try {
      const pin = generatePin();
      const gameId = await createGame({ quizId: quiz!._id, hostId: me._id, pin });
      toast.success(t("toast.gameStarted"));
      navigate(`/host/${gameId}`);
    } finally {
      setIsStarting(false);
    }
  }

  async function confirmDelete() {
    setIsDeleting(true);
    try {
      await removeQuiz({ id: quiz!._id });
      toast.success(t("toast.quizDeleted"));
      navigate("/dashboard", { replace: true });
    } finally {
      setIsDeleting(false);
      setIsDeleteOpen(false);
    }
  }

  const stats = [
    { icon: HelpCircle, label: t("detail.stats.questions"), value: String(quiz.questions.length) },
    { icon: Trophy, label: t("detail.stats.points"), value: String(totalPoints) },
    { icon: Clock, label: t("detail.stats.time"), value: formatDuration(totalTime) },
  ];

  return (
    <div className="min-h-screen-dvh bg-gray-950">
      <AppHeader title={t("detail.title")} back="/dashboard" />

      <div className="max-w-2xl mx-auto p-4 sm:p-6 safe-x safe-b-min flex flex-col gap-5">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-white/10 bg-gradient-to-br from-violet-600/15 via-surface-800/40 to-fuchsia-600/10 p-5 flex flex-col gap-5"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-2xl font-black text-white shadow-glow-sm">
              {monogram}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl font-black text-white leading-tight break-words">
                {quiz.title}
              </h1>
              <div className="mt-1.5 flex items-center gap-2 text-xs text-gray-400">
                <span
                  className={`px-2 py-0.5 rounded-full font-semibold ${
                    quiz.isPublic
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
                      : "bg-white/5 text-gray-400 border border-white/10"
                  }`}
                >
                  {quiz.isPublic ? t("common.public") : t("common.private")}
                </span>
                <span>{formatDate(quiz.createdAt, lang)}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {stats.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="rounded-2xl bg-white/[0.04] border border-white/5 p-3 flex flex-col items-center gap-1 text-center"
              >
                <Icon size={16} className="text-violet-300" />
                <span className="text-lg font-black text-white leading-none whitespace-nowrap">
                  {value}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="flex flex-col gap-2">
          <Button
            size="lg"
            onClick={handlePlay}
            isLoading={isStarting}
            disabled={!me}
            className="w-full"
          >
            <Play size={18} /> {t("detail.play")}
          </Button>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => navigate(`/quiz/${quiz._id}/edit`)}
              className="flex-1"
            >
              <Pencil size={16} /> {t("common.edit")}
            </Button>
            <Button variant="danger" onClick={() => setIsDeleteOpen(true)} className="flex-1">
              <Trash2 size={16} /> {t("common.delete")}
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2 mt-1 px-1">
            <h2 className="text-xs font-black text-gray-400 uppercase tracking-wider">
              {t("detail.questionsHeading", { count: quiz.questions.length })}
            </h2>
            {editingIndex === null && (
              <span className="text-[11px] text-gray-600">{t("detail.editHint")}</span>
            )}
          </div>

          {quiz.questions.map((q, idx) => {
            if (editingIndex === idx && draft) {
              return (
                <div key={idx} className="flex flex-col gap-2">
                  <QuestionEditor
                    question={draft}
                    index={idx}
                    total={quiz.questions.length}
                    onChange={setDraft}
                    onRemove={() => setRemoveOpen(true)}
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setSaveOpen(true)}
                      isLoading={isSaving}
                      disabled={!dirty}
                      className="flex-1"
                    >
                      <Check size={16} /> {t("common.save")}
                    </Button>
                    <Button variant="secondary" onClick={requestCancel} className="flex-1">
                      <X size={16} /> {t("common.cancel")}
                    </Button>
                  </div>
                </div>
              );
            }

            return (
              <motion.button
                key={idx}
                type="button"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(idx * 0.03, 0.3) }}
                onClick={() => startEdit(idx)}
                className="tile p-4 flex gap-3 cursor-pointer active:scale-[0.99] w-full text-left"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-violet-600/20 text-violet-300 text-xs font-black">
                  {idx + 1}
                </span>
                <div className="min-w-0 flex-1 flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-white font-semibold break-words flex-1 min-w-0">
                      {q.text || "—"}
                    </p>
                    <span className="shrink-0 text-[10px] px-2 py-0.5 rounded-full font-semibold bg-white/5 text-gray-400 border border-white/10">
                      {TYPE_LABELS[q.type]}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Trophy size={12} /> {q.points} {t("common.points")}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {q.timeLimit} {t("common.seconds")}
                    </span>
                    <span className="truncate text-emerald-400/80">
                      {q.type === "type_answer" ? t("detail.answer") : t("detail.correct")}:{" "}
                      {(q.type === "type_answer" ? q.options[0] : q.options[q.correctIndex]) ?? "—"}
                    </span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        title={t("detail.delete.title")}
        description={t("detail.delete.desc", { title: quiz.title })}
        confirmLabel={t("detail.delete.confirm")}
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onClose={() => setIsDeleteOpen(false)}
      />
      <ConfirmDialog
        isOpen={saveOpen}
        title={t("detail.save.title")}
        description={t("detail.save.desc")}
        confirmLabel={t("common.save")}
        isLoading={isSaving}
        onConfirm={confirmSave}
        onClose={() => setSaveOpen(false)}
      />
      <ConfirmDialog
        isOpen={cancelOpen}
        title={t("detail.cancel.title")}
        description={t("detail.cancel.desc")}
        confirmLabel={t("common.discard")}
        onConfirm={() => {
          setCancelOpen(false);
          closeEdit();
        }}
        onClose={() => setCancelOpen(false)}
      />
      <ConfirmDialog
        isOpen={removeOpen}
        title={t("detail.removeQuestion.title")}
        description={t("detail.removeQuestion.desc")}
        confirmLabel={t("qedit.remove")}
        isLoading={isSaving}
        onConfirm={confirmRemove}
        onClose={() => setRemoveOpen(false)}
      />
    </div>
  );
}
