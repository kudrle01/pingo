import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, ChevronRight, Flag, Users, BarChart2, Zap, StopCircle } from "lucide-react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { Leaderboard } from "@/components/Leaderboard";
import { AnswerDistribution } from "@/components/AnswerDistribution";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useTranslation } from "@/i18n/LanguageProvider";
import { useToast } from "@/components/ToastProvider";

export default function HostGame() {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const toast = useToast();

  const game = useQuery(api.games.get, { id: gameId as Id<"games"> });
  const quiz = useQuery(api.quizzes.get, game ? { id: game.quizId } : "skip");
  const players = useQuery(api.players.listByGame, game ? { gameId: game._id } : "skip");
  const answers = useQuery(
    api.games.getAnswers,
    game && (game.status === "question" || game.status === "results")
      ? { gameId: game._id, questionIndex: game.currentQuestion }
      : "skip"
  );

  const updateStatus = useMutation(api.games.updateStatus);
  const nextQuestion = useMutation(api.games.nextQuestion);
  const cancelGame = useMutation(api.games.cancel);
  const [isEndDialogOpen, setIsEndDialogOpen] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const currentQ = game && quiz ? quiz.questions[game.currentQuestion] : undefined;
  const answeredCount = answers?.length ?? 0;

  useEffect(() => {
    if (!game || !currentQ || !players || game.status !== "question") return;

    const showResults = () => {
      void updateStatus({ id: game._id, status: "results" });
    };

    if (players.length > 0 && answeredCount >= players.length) {
      showResults();
      return;
    }

    const startedAt = game.questionStartedAt ?? Date.now();
    const endsAt = startedAt + currentQ.timeLimit * 1000;
    const remainingMs = endsAt - Date.now();

    if (remainingMs <= 0) {
      showResults();
      return;
    }

    const timeoutId = window.setTimeout(showResults, remainingMs);
    return () => window.clearTimeout(timeoutId);
  }, [
    answeredCount,
    currentQ,
    game,
    players,
    updateStatus,
  ]);

  if (!game || !quiz || !players) {
    return (
      <div className="min-h-screen-dvh flex items-center justify-center">
        <p className="text-gray-500 animate-pulse text-sm">{t("host.loading")}</p>
      </div>
    );
  }

  const isLastQuestion = game.currentQuestion >= quiz.questions.length - 1;

  async function handleStart() {
    if (!players || players.length === 0) return;
    await updateStatus({ id: game!._id, status: "question", questionStartedAt: Date.now() });
    toast.success(t("toast.gameStarted"));
  }

  async function handleShowResults() {
    await updateStatus({ id: game!._id, status: "results" });
  }

  async function handleNext() {
    if (isLastQuestion) {
      setIsEndDialogOpen(true);
    } else {
      await nextQuestion({ id: game!._id });
    }
  }

  async function confirmEndGame() {
    setIsEnding(true);
    try {
      if (game!.status === "lobby") {
        await cancelGame({ id: game!._id });
        toast.info(t("toast.gameCancelled"));
        navigate("/dashboard", { replace: true });
      } else {
        await updateStatus({ id: game!._id, status: "finished" });
        toast.success(t("toast.gameEnded"));
        navigate(`/results/${game!._id}`, { replace: true });
      }
    } finally {
      setIsEnding(false);
      setIsEndDialogOpen(false);
    }
  }

  const answerCounts = currentQ
    ? currentQ.options.map((_, idx) => ({
        index: idx,
        count: answers?.filter((a) => a.answerIndex === idx).length ?? 0,
      }))
    : [];

  return (
    <div className="min-h-screen-dvh p-4 sm:p-6 safe-x safe-t-min safe-b-min">
      <div className="max-w-3xl mx-auto flex flex-col gap-4">

        <div className="card px-0 py-4 sm:p-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center">
              <Zap size={17} className="text-white fill-white" />
            </div>
            <div>
              <h1 className="text-base font-black text-white leading-tight break-words">{quiz.title}</h1>
              <p className="text-gray-500 text-xs">
                {t("host.question")}{" "}
                <span className="text-violet-400 font-bold">{game.currentQuestion + 1}</span>
                {" / "}{quiz.questions.length}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-start gap-3 sm:items-end">
            <div className="text-left sm:text-right">
              <p className="text-xs text-gray-600 uppercase tracking-wider font-semibold">{t("host.pin")}</p>
              <p className="text-3xl font-black text-gradient tracking-widest">{game.pin}</p>
            </div>
            {game.status !== "finished" && (
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={() => setIsEndDialogOpen(true)}
              >
                <StopCircle size={15} /> {t("host.end")}
              </Button>
            )}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {game.status === "lobby" && (
            <motion.div
              key="lobby"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="card p-6 sm:p-10 text-center flex flex-col items-center gap-4"
            >
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 border border-violet-500/20 flex items-center justify-center">
                <Users size={28} className="text-violet-400" />
              </div>
              <div>
                <p className="text-white font-black text-xl">{t("host.waiting")}</p>
                <p className="text-gray-500 text-sm mt-1">
                  {t("host.connected")}{" "}
                  <span className="text-violet-400 font-bold">{players.length}</span>
                </p>
              </div>
              <Button size="lg" onClick={handleStart} disabled={players.length === 0}>
                <Play size={18} /> {t("host.start")}
              </Button>
              {players.length === 0 && (
                <p className="text-xs text-gray-500">{t("host.needPlayers")}</p>
              )}
            </motion.div>
          )}

          {game.status === "question" && currentQ && (
            <motion.div
              key={`question-${game.currentQuestion}`}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="flex flex-col gap-3"
            >
              <div className="card px-0 py-4 sm:p-6 border-violet-500/20">
                <p className="text-xs text-violet-400 font-bold mb-2 uppercase tracking-wider">
                  {t("host.questionN", { n: game.currentQuestion + 1 })}
                </p>
                <p className="text-xl sm:text-2xl font-black text-white break-words">{currentQ.text}</p>
                <p className="mt-3 text-sm font-semibold text-gray-500">
                  {t("host.answered", { a: answeredCount, b: players.length })}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentQ.options.map((option, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.07, type: "spring", bounce: 0.3 }}
                    className={`rounded-2xl p-3 text-white font-bold text-sm break-words ${
                      ["bg-[#e74c3c]", "bg-[#3498db]", "bg-[#f39c12]", "bg-[#2ecc71]"][idx]
                    }`}
                  >
                    {option}
                  </motion.div>
                ))}
              </div>

              <Button size="lg" onClick={handleShowResults}>
                <BarChart2 size={18} /> {t("host.showResults")}
              </Button>
            </motion.div>
          )}

          {game.status === "results" && currentQ && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="flex flex-col gap-3"
            >
              <div className="card px-0 py-5 sm:p-5">
                <p className="text-xs text-violet-400 font-bold mb-1 uppercase tracking-wider">
                  {t("host.questionResults", { n: game.currentQuestion + 1 })}
                </p>
                <p className="text-lg font-black text-white mb-4 break-words">{currentQ.text}</p>
                <AnswerDistribution
                  question={currentQ}
                  counts={answerCounts}
                  total={answers?.length ?? 0}
                />
              </div>

              <Button size="lg" onClick={handleNext}>
                {isLastQuestion
                  ? <><Flag size={18} /> {t("host.end")}</>
                  : <><ChevronRight size={18} /> {t("host.next")}</>}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div layout className="card px-0 py-5 sm:p-5">
          <h2 className="text-xs font-black text-white mb-3 flex items-center gap-2 uppercase tracking-wider">
            <Users size={15} className="text-violet-400" />
            {t("host.players", { n: players.length })}
          </h2>
          <Leaderboard players={players} />
        </motion.div>

      </div>
      <ConfirmDialog
        isOpen={isEndDialogOpen}
        title={t("host.end.title")}
        description={t("host.end.desc")}
        confirmLabel={t("host.end.confirm")}
        isLoading={isEnding}
        onConfirm={confirmEndGame}
        onClose={() => setIsEndDialogOpen(false)}
      />
    </div>
  );
}
