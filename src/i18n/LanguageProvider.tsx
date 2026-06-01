import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { translations, type Lang } from "@/i18n/translations";

type TParams = Record<string, string | number>;

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string, params?: TParams) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);
const STORAGE_KEY = "pingo.lang";

function getInitialLang(): Lang {
  if (typeof window !== "undefined") {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "cs" || stored === "en") return stored;
  }
  return "cs";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(getInitialLang);

  useEffect(() => {
    if (typeof document !== "undefined") document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore storage errors */
    }
  }, []);

  const t = useCallback(
    (key: string, params?: TParams) => {
      const dict = translations[lang] ?? translations.cs;
      let str = dict[key] ?? translations.cs[key] ?? key;
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          str = str.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
        }
      }
      return str;
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return ctx;
}
