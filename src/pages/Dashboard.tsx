import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, FileQuestion, Zap, LogOut } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "@convex/_generated/api";
import { QuizCard } from "@/components/QuizCard";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Button } from "@/components/ui/Button";
import { generatePin } from "@/lib/pinGenerator";
import type { Quiz } from "@/types";

export default function Dashboard() {
  const navigate = useNavigate();
  const { signOut } = useAuthActions();

  const me = useQuery(api.users.me);
  const authorId = me?._id ?? "";

  const quizzes = useQuery(api.quizzes.list, authorId ? { authorId } : "skip");
  const removeQuiz = useMutation(api.quizzes.remove);
  const createGame = useMutation(api.games.create);
  const [quizToDelete, setQuizToDelete] = useState<Quiz | null>(null);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handlePlay(quiz: Quiz) {
    const pin = generatePin();
    const gameId = await createGame({ quizId: quiz._id, hostId: authorId, pin });
    navigate(`/host/${gameId}`);
  }

  function handleEdit(quiz: Quiz) {
    navigate(`/quiz/${quiz._id}/edit`);
  }

  function handleDelete(quiz: Quiz) {
    setQuizToDelete(quiz);
  }

  async function confirmDeleteQuiz() {
    if (!quizToDelete) return;
    setIsDeleting(true);
    try {
      await removeQuiz({ id: quizToDelete._id });
      setQuizToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  }

  async function confirmLogout() {
    setIsLoggingOut(true);
    try {
      await signOut();
      navigate("/", { replace: true });
    } finally {
      setIsLoggingOut(false);
      setIsLogoutDialogOpen(false);
    }
  }

  if (quizzes === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 animate-pulse text-sm">Načítám kvízy...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-glow-sm">
              <Zap size={20} className="text-white fill-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Moje kvízy</h1>
              <p className="text-gray-500 text-xs">
                {me?.name ?? me?.email ?? ""}
                {quizzes && ` · ${quizzes.length} kvízu`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => navigate("/create")} className="flex-1 sm:flex-none">
              <Plus size={16} /> Nový kvíz
            </Button>
            <Button variant="secondary" onClick={() => setIsLogoutDialogOpen(true)} title="Odhlásit se">
              <LogOut size={16} />
            </Button>
          </div>
        </motion.div>

        {quizzes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card text-center py-20 flex flex-col items-center gap-4"
          >
            <div className="w-16 h-16 rounded-3xl bg-surface-700 border border-white/5 flex items-center justify-center">
              <FileQuestion size={28} className="text-gray-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-300">Zatím žádné kvízy</p>
              <p className="text-gray-600 text-sm mt-1">Vytvoř svůj první kvíz!</p>
            </div>
            <Button onClick={() => navigate("/create")}>
              <Plus size={16} /> Vytvořit kvíz
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
          >
            {quizzes.map((quiz, i) => (
              <motion.div
                key={quiz._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <QuizCard
                  quiz={quiz as Quiz}
                  onPlay={handlePlay}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
      <ConfirmDialog
        isOpen={quizToDelete !== null}
        title="Smazat kvíz?"
        description={
          <p>
            Kvíz <span className="font-bold text-white">{quizToDelete?.title}</span> bude trvale
            odstraněn. Tuto akci nejde vrátit zpět.
          </p>
        }
        confirmLabel="Smazat kvíz"
        isLoading={isDeleting}
        onConfirm={confirmDeleteQuiz}
        onClose={() => setQuizToDelete(null)}
      />
      <ConfirmDialog
        isOpen={isLogoutDialogOpen}
        title="Odhlásit se?"
        description="Po odhlášení se vrátíš na úvodní stránku a chráněné části aplikace už nepůjdou otevřít bez přihlášení."
        confirmLabel="Odhlásit se"
        isLoading={isLoggingOut}
        onConfirm={confirmLogout}
        onClose={() => setIsLogoutDialogOpen(false)}
      />
    </div>
  );
}
