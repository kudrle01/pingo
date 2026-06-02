import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { FlagIcon } from "@/components/FlagIcon";
import { useToast } from "@/components/ToastProvider";
import { useTranslation } from "@/i18n/LanguageProvider";
import { LANGUAGES, type Lang } from "@/i18n/translations";
import { motion } from "framer-motion";
import { Check, Languages } from "lucide-react";

export default function Settings() {
  const { lang, setLang, t } = useTranslation();
  const toast = useToast();

  function choose(code: Lang) {
    if (code === lang) return;
    setLang(code);
    toast.success(t("toast.langChanged"));
  }

  return (
    <div className="fixed inset-0 flex h-screen-dvh flex-col overflow-hidden">
      <AppHeader title={t("settings.title")} logout />

      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="max-w-2xl mx-auto p-4 sm:p-6 safe-x sm:pb-10 flex flex-col gap-6">
          <section className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-gray-300">
              <Languages size={18} className="text-violet-300" />
              <h2 className="text-sm font-black uppercase tracking-wider">
                {t("settings.language")}
              </h2>
            </div>
            <p className="text-sm text-gray-500">{t("settings.language.desc")}</p>

            <div className="flex flex-col gap-2 mt-1">
              {LANGUAGES.map(({ code, label }) => {
                const active = code === lang;
                return (
                  <motion.button
                    key={code}
                    type="button"
                    whileTap={{ scale: 0.98 }}
                    onClick={() => choose(code)}
                    aria-pressed={active}
                    className={`tile flex items-center gap-3 p-4 text-left ${
                      active ? "ring-2 ring-violet-500/50" : ""
                    }`}
                  >
                    <FlagIcon code={code} className="h-6 w-8 shrink-0" />
                    <span className="flex-1 font-bold text-white">{label}</span>
                    {active && <Check size={18} className="text-violet-300" />}
                  </motion.button>
                );
              })}
            </div>
          </section>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
