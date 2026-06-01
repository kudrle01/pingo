import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastApi {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

const ICONS: Record<ToastType, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: AlertTriangle,
  info: Info,
};

const STYLES: Record<ToastType, string> = {
  success: "border-emerald-500/30 bg-emerald-500/15 text-emerald-200",
  error: "border-red-500/30 bg-red-500/15 text-red-200",
  info: "border-violet-500/30 bg-violet-500/15 text-violet-100",
};

const ICON_COLORS: Record<ToastType, string> = {
  success: "text-emerald-400",
  error: "text-red-400",
  info: "text-violet-300",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (type: ToastType, message: string) => {
      const id = ++idRef.current;
      setToasts((prev) => [...prev, { id, type, message }]);
      window.setTimeout(() => remove(id), 3200);
    },
    [remove]
  );

  const api = useRef<ToastApi>({
    success: (m) => push("success", m),
    error: (m) => push("error", m),
    info: (m) => push("info", m),
  });
  // keep closure fresh
  api.current = {
    success: (m) => push("success", m),
    error: (m) => push("error", m),
    info: (m) => push("info", m),
  };

  return (
    <ToastContext.Provider value={api.current}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] flex flex-col items-center gap-2 px-3 safe-t-min">
        <AnimatePresence>
          {toasts.map((toast) => {
            const Icon = ICONS[toast.type];
            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, y: -24, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -16, scale: 0.95 }}
                transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
                className={`pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl border px-4 py-3 shadow-card backdrop-blur-xl ${STYLES[toast.type]}`}
              >
                <Icon size={18} className={`shrink-0 ${ICON_COLORS[toast.type]}`} />
                <span className="min-w-0 flex-1 break-words text-sm font-semibold">
                  {toast.message}
                </span>
                <button
                  type="button"
                  onClick={() => remove(toast.id)}
                  aria-label="Zavřít"
                  className="shrink-0 opacity-60 transition-opacity hover:opacity-100"
                >
                  <X size={16} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}
