import { useRef, useState } from "react";
import { HelpCircle, Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import {
  parseQuestionsFile,
  QuestionImportError,
} from "@/lib/questionImport";
import type { Question } from "@/types";

interface QuestionImportButtonProps {
  onImport: (questions: Question[]) => void;
}





export function QuestionImportButton({ onImport }: QuestionImportButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    setBusy(true);
    try {
      const questions = await parseQuestionsFile(file);
      if (questions.length === 0) {
        throw new QuestionImportError("Soubor neobsahuje žádné otázky");
      }
      onImport(questions);
    } catch (e) {
      const msg =
        e instanceof QuestionImportError
          ? e.message
          : `Chyba při čtení souboru: ${(e as Error).message}`;
      setError(msg);
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
          className="flex-1 sm:flex-none"
        >
          <Upload size={16} /> Importovat otázky (JSON / CSV)
        </Button>
        <button
          type="button"
          onClick={() => setIsHelpOpen(true)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-surface-700 text-gray-300 transition-colors hover:border-white/20 hover:bg-surface-600 hover:text-white"
          aria-label="Zobrazit návod k importu otázek"
          title="Návod k importu"
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
      {error && (
        <p className="text-sm text-red-400 bg-red-500/10 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
      <Modal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        title="Formát importu otázek"
      >
        <div className="flex flex-col gap-5 text-sm leading-6 text-gray-300">
          <section>
            <h3 className="mb-2 font-bold text-white">JSON</h3>
            <p className="mb-3">
              JSON soubor musí obsahovat pole otázek. Každá otázka má pole
              <code className="mx-1 rounded bg-surface-700 px-1.5 py-0.5 text-violet-200">text</code>,
              <code className="mx-1 rounded bg-surface-700 px-1.5 py-0.5 text-violet-200">type</code>,
              <code className="mx-1 rounded bg-surface-700 px-1.5 py-0.5 text-violet-200">options</code>,
              <code className="mx-1 rounded bg-surface-700 px-1.5 py-0.5 text-violet-200">correctIndex</code>,
              <code className="mx-1 rounded bg-surface-700 px-1.5 py-0.5 text-violet-200">timeLimit</code>
              a
              <code className="mx-1 rounded bg-surface-700 px-1.5 py-0.5 text-violet-200">points</code>.
            </p>
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
            <p className="mb-3">
              CSV musí mít hlavičku níže. Podporuje se čárka i středník jako oddělovač.
            </p>
            <pre className="overflow-x-auto rounded-xl bg-surface-950 p-3 text-xs text-gray-200">
{`text,type,option1,option2,option3,option4,correctIndex,timeLimit,points
"Hlavní město Francie?",quiz,Paříž,Londýn,Berlín,Madrid,0,20,1000
"Země je placatá",true_false,Pravda,Nepravda,,,1,10,1000
"Řeka tekoucí Prahou?",type_answer,Vltava,,,,0,30,2000`}
            </pre>
          </section>

          <section>
            <h3 className="mb-2 font-bold text-white">Typy otázek</h3>
            <ul className="list-disc space-y-1 pl-5 text-gray-400">
              <li><span className="font-semibold text-gray-200">quiz</span>: přesně 4 možnosti, správná je podle indexu 0 až 3.</li>
              <li><span className="font-semibold text-gray-200">true_false</span>: přesně 2 možnosti, typicky Pravda / Nepravda.</li>
              <li><span className="font-semibold text-gray-200">type_answer</span>: správná textová odpověď je v první možnosti, <span className="font-mono text-gray-200">correctIndex</span> je 0.</li>
            </ul>
          </section>
        </div>
      </Modal>
    </div>
  );
}
