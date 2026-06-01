import { useQuery } from "convex/react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, FileQuestion } from "lucide-react";
import { api } from "@convex/_generated/api";
import { QuizCard } from "@/components/QuizCard";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/i18n/LanguageProvider";
import type { Quiz } from "@/types";

export default function Dashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const me = useQuery(api.users.me);
  const authorId = me?._id ?? "";

  const quizzes = useQuery(api.quizzes.list, authorId ? { authorId } : "skip");

  if (quizzes === undefined) {
    return (
      <div className="min-h-screen-dvh flex items-center justify-center">
        <p className="text-gray-500 animate-pulse text-sm">{t("dashboard.loading")}</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex h-screen-dvh flex-col overflow-hidden">
      <AppHeader
        title={t("dashboard.title")}
        actions={
          <Button size="sm" onClick={() => navigate("/create")}>
            <Plus size={16} /> {t("dashboard.new")}
          </Button>
        }
      />

      <div className="flex-1 min-h-0 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 safe-x sm:pb-10">
        <p className="text-gray-500 text-sm mb-5">
          {me?.name ?? me?.email ?? ""}
          {quizzes && ` · ${t("dashboard.count", { count: quizzes.length })}`}
        </p>

        {quizzes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="tile text-center py-20 px-6 flex flex-col items-center gap-4"
          >
            <div className="w-16 h-16 rounded-3xl bg-surface-700 border border-white/5 flex items-center justify-center">
              <FileQuestion size={28} className="text-gray-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-300">{t("dashboard.empty.title")}</p>
              <p className="text-gray-600 text-sm mt-1">{t("dashboard.empty.subtitle")}</p>
            </div>
            <Button onClick={() => navigate("/create")}>
              <Plus size={16} /> {t("dashboard.empty.cta")}
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
                  onOpen={(q) => navigate(`/quiz/${q._id}`)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
      </div>

      <BottomNav />
    </div>
  );
}
