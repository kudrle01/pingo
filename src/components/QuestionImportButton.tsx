import { useToast } from "@/components/ToastProvider";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useTranslation } from "@/i18n/LanguageProvider";
import { QuestionImportError, parseQuestionsFile } from "@/lib/questionImport";
import type { Question } from "@/types";
import { HelpCircle, Upload } from "lucide-react";
import { useRef, useState } from "react";

interface QuestionImportButtonProps {
  onImport: (questions: Question[]) => void;
}

export function QuestionImportButton({ onImport }: QuestionImportButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const { t } = useTranslation();
  const toast = useToast();

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    setBusy(true);
    try {
      const questions = await parseQuestionsFile(file);
      if (questions.length === 0) {
        throw new QuestionImportError(t("import.err.empty"));
      }
      onImport(questions);
      toast.success(t("toast.imported", { count: questions.length }));
    } catch (e) {
      const msg =
        e instanceof QuestionImportError
          ? e.message
          : t("import.err.read", { msg: (e as Error).message });
      setError(msg);
      toast.error(msg);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="secondary"
          isLoading={busy}
          onClick={() => inputRef.current?.click()}
          className="min-w-0 flex-1 sm:flex-none"
        >
          <Upload size={16} className="shrink-0" />
          <span className="truncate">
            {t("import.button")}
            <span className="hidden sm:inline">{t("import.formats")}</span>
          </span>
        </Button>
        <button
          type="button"
          onClick={() => setIsHelpOpen(true)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-surface-700 text-gray-300 transition-colors hover:border-white/20 hover:bg-surface-600 hover:text-white"
          aria-label={t("import.help")}
          title={t("import.help")}
        >
          <HelpCircle size={18} />
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".json,.csv,application/json,text/csv"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
      {error && <p className="text-sm text-red-400 bg-red-500/10 rounded-lg px-3 py-2">{error}</p>}
      <Modal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        title={t("import.modalTitle")}
      >
        <div className="flex flex-col gap-5 text-sm leading-6 text-gray-300">
          <section>
            <h3 className="mb-2 font-bold text-white">JSON</h3>
            <p className="mb-3">{t("import.help.jsonDesc")}</p>
            <pre className="overflow-x-auto rounded-xl bg-surface-950 p-3 text-xs text-gray-200">
              {`[
  {
    "text": "Hlavní město Francie?",
    "type": "quiz",
    "options": ["Paříž", "Londýn", "Berlín", "Madrid"],
    "correctIndex": 0,
    "timeLimit": 20,
    "points": 1000
  }
]`}
            </pre>
          </section>

          <section>
            <h3 className="mb-2 font-bold text-white">CSV</h3>
            <p className="mb-3">{t("import.help.csvDesc")}</p>
            <pre className="overflow-x-auto rounded-xl bg-surface-950 p-3 text-xs text-gray-200">
              {`text,type,option1,option2,option3,option4,correctIndex,timeLimit,points
"Hlavní město Francie?",quiz,Paříž,Londýn,Berlín,Madrid,0,20,1000
"Země je placatá",true_false,Pravda,Nepravda,,,1,10,1000
"Řeka tekoucí Prahou?",type_answer,Vltava,,,,0,30,2000`}
            </pre>
          </section>

          <section>
            <h3 className="mb-2 font-bold text-white">{t("import.help.typesTitle")}</h3>
            <ul className="list-disc space-y-1 pl-5 text-gray-400">
              <li>{t("import.help.typeQuiz")}</li>
              <li>{t("import.help.typeTf")}</li>
              <li>{t("import.help.typeTa")}</li>
            </ul>
          </section>
        </div>
      </Modal>
    </div>
  );
}
