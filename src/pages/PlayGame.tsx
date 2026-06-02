import { AnswerOptions } from "@/components/play/AnswerOptions";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Clock, LoaderCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { useCountdown } from "@/hooks/useCountdown";
import { useTranslation } from "@/i18n/LanguageProvider";
import { getAvatar } from "@/lib/avatars";
import { formatScore } from "@/lib/formatters";

function TimerBar({ duration, onExpire }: { duration: number; onExpire: () => void }) {
  const { timeLeft, progress } = useCountdown({ duration, onExpire });
  const urgent = timeLeft <= 5;

  return (
    <motion.div
      animate={urgent ? { scale: [1, 1.06, 1] } : {}}
      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.6 }}
      className={`flex items-center gap-2 rounded-xl px-3 py-2 ${urgent ? "bg-red-900/60" : "bg-surface-700"}`}
    >
      <Clock size={16} className={urgent ? "text-red-400" : "text-gray-400"} />
      <div className="flex-1 h-2 bg-surface-600 rounded-full overflow-hidden">
        <motion.div
          animate={{ width: `${(1 - progress) * 100}%` }}
          transition={{ duration: 0.9, ease: "linear" }}
          className={`h-full rounded-full ${urgent ? "bg-red-500" : "bg-violet-500"}`}
        />
      </div>
      <span
        className={`text-sm font-bold w-5 text-right ${urgent ? "text-red-400" : "text-gray-300"}`}
      >
        {timeLeft}
      </span>
    </motion.div>
  );
}

function ScorePopup({ points }: { points: number }) {
  return (
    <AnimatePresence>
      <motion.div
        key={points}
        initial={{ opacity: 1, y: 0, scale: 1 }}
        animate={{ opacity: 0, y: -60, scale: 1.3 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
        className="absolute inset-x-0 top-1/2 flex justify-center pointer-events-none z-50"
      >
        <span className="text-3xl font-black text-white drop-shadow-lg">
          +{formatScore(points)}
        </span>
      </motion.div>
    </AnimatePresence>
  );
}

export default function PlayGame() {
  const { gameId } = useParams<{ gameId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const playerId = searchParams.get("playerId") as Id<"players"> | null;

  const game = useQuery(api.games.get, { id: gameId as Id<"games"> });
  const quiz = useQuery(api.quizzes.get, game ? { id: game.quizId } : "skip");
  const player = useQuery(api.players.get, playerId ? { id: playerId } : "skip");
  const submitAnswer = useMutation(api.games.submitAnswer);

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [textAnswer, setTextAnswer] = useState("");
  const [answered, setAnswered] = useState(false);
  const [lastPoints, setLastPoints] = useState<number | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset per-question state only when the question changes
  useEffect(() => {
    setSelectedAnswer(null);
    setTextAnswer("");
    setAnswered(false);
    setLastPoints(null);
    setShowPopup(false);
  }, [game?.currentQuestion]);

  useEffect(() => {
    if (game?.status === "finished") {
      navigate(`/results/${gameId}?playerId=${playerId ?? ""}`, { replace: true });
    }
  }, [game?.status, gameId, playerId, navigate]);

  if (!game || !quiz || !player) {
    return (
      <div className="min-h-screen-dvh safe-x flex items-center justify-center">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-400">
          {t("play.waitingGame")}
        </motion.p>
      </div>
    );
  }

  const avatar = getAvatar(player.avatar);

  if (game.status === "lobby") {
    return (
      <div className="min-h-screen-dvh safe-x flex flex-col items-center justify-center gap-6 p-6">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2.5, ease: "easeInOut" }}
          className="w-24 h-24 rounded-full overflow-hidden shadow-xl"
          style={{ backgroundColor: `#${avatar.bg}` }}
        >
          <img src={avatar.url} alt={avatar.label} className="w-full h-full object-cover" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <p className="text-2xl font-black text-white">{player.nickname}</p>
          <p className="text-gray-400 mt-1">{t("play.waitingStart")}</p>
        </motion.div>
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.8 }}
          className="flex items-center gap-2 text-gray-500 text-sm"
        >
          <Clock size={14} />
          {t("play.hostSoon")}
        </motion.div>
      </div>
    );
  }

  if (game.status === "results") {
    const currentQ = quiz.questions[game.currentQuestion];
    const isCorrect = selectedAnswer !== null ? selectedAnswer === currentQ?.correctIndex : false;
    const didAnswer = selectedAnswer !== null;

    return (
      <div className="min-h-screen-dvh safe-x flex flex-col items-center justify-center gap-5 p-6">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", bounce: 0.5 }}
        >
          {!didAnswer ? (
            <XCircle size={80} className="text-gray-500" />
          ) : isCorrect ? (
            <CheckCircle2 size={80} className="text-green-400" />
          ) : (
            <XCircle size={80} className="text-red-400" />
          )}
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`text-3xl font-black ${
            !didAnswer ? "text-gray-500" : isCorrect ? "text-green-400" : "text-red-400"
          }`}
        >
          {!didAnswer ? t("play.timeUp") : isCorrect ? t("play.correct") : t("play.wrong")}
        </motion.h2>

        {currentQ && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card px-5 py-3 text-center max-w-[85vw]"
          >
            <p className="text-xs text-gray-500 mb-1">{t("play.correctAnswer")}</p>
            <p className="text-white font-bold break-words">
              {currentQ.options[currentQ.correctIndex]}
            </p>
          </motion.div>
        )}

        {lastPoints !== null && lastPoints > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: "spring", bounce: 0.6 }}
            className="bg-violet-600/20 border border-violet-500/40 rounded-2xl px-8 py-4 text-center"
          >
            <p className="text-gray-400 text-sm">{t("play.roundPoints")}</p>
            <p className="text-4xl font-black text-violet-300">+{formatScore(lastPoints)}</p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <p className="text-gray-500 text-sm">{t("play.totalScore")}</p>
          <p className="text-2xl font-bold text-white">{formatScore(player.score)}</p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-gray-600 text-sm"
        >
          {t("play.waitNext")}
        </motion.p>
      </div>
    );
  }

  const currentQ = quiz.questions[game.currentQuestion];
  if (!currentQ) return null;

  async function commitAnswer(optionIdx: number, isCorrect: boolean) {
    if (!game || !playerId || answered) return;

    setSelectedAnswer(optionIdx);
    setAnswered(true);

    try {
      const points = await submitAnswer({
        gameId: game._id,
        playerId,
        questionIndex: game.currentQuestion,
        answerIndex: optionIdx,
        answeredAt: Date.now(),
        isCorrect,
      });

      setLastPoints(points);
      if (points > 0) {
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 1200);
      }
    } catch {
      setSelectedAnswer(null);
      setLastPoints(0);
    }
  }

  return (
    <div className="min-h-screen-dvh safe-x safe-t-min safe-b-min flex flex-col p-4 gap-3 relative">
      {showPopup && lastPoints !== null && <ScorePopup points={lastPoints} />}

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <img
            src={avatar.url}
            alt={avatar.label}
            className="w-8 h-8 rounded-lg"
            style={{ backgroundColor: `#${avatar.bg}` }}
          />
          <div>
            <p className="text-white font-bold text-sm leading-tight">{player.nickname}</p>
            <p className="text-violet-300 font-black text-sm">{formatScore(player.score)}</p>
          </div>
        </div>
        <p className="text-xs text-gray-600 mr-auto ml-2">
          {game.currentQuestion + 1}/{quiz.questions.length}
        </p>
        {!answered && (
          <div className="flex-1 max-w-[180px]">
            <TimerBar
              key={game.currentQuestion}
              duration={currentQ.timeLimit}
              onExpire={() => setAnswered(true)}
            />
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={game.currentQuestion}
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ type: "spring", bounce: 0.3 }}
          className="card px-0 py-4 sm:p-6 flex items-center justify-center min-h-[120px]"
        >
          <p className="text-lg sm:text-xl font-bold text-white text-center break-words">
            {currentQ.text}
          </p>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {answered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="card p-4 flex flex-col items-center gap-1 border-violet-500/30"
          >
            <motion.div
              animate={{ rotate: [0, -5, 5, -5, 5, 0] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, repeatDelay: 1.5, duration: 0.4 }}
              className="text-violet-300"
            >
              <LoaderCircle size={28} className="animate-spin" />
            </motion.div>
            <p className="text-white font-bold text-sm">{t("play.answerSent")}</p>
            <p className="text-gray-500 text-xs">{t("play.waitHost")}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnswerOptions
        question={currentQ}
        questionIndex={game.currentQuestion}
        answered={answered}
        selectedAnswer={selectedAnswer}
        textAnswer={textAnswer}
        onTextAnswerChange={setTextAnswer}
        onAnswer={commitAnswer}
      />
    </div>
  );
}
