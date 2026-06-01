import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import {
  ArrowLeft,
  LayoutGrid,
  Gamepad2,
  History,
  Settings,
  LogOut,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ResumeBar } from "@/components/ResumeBar";
import { useTranslation } from "@/i18n/LanguageProvider";
import { useToast } from "@/components/ToastProvider";

interface NavTab {
  to: string;
  labelKey: string;
  icon: LucideIcon;
}

const TABS: NavTab[] = [
  { to: "/dashboard", labelKey: "nav.quizzes", icon: LayoutGrid },
  { to: "/join", labelKey: "nav.play", icon: Gamepad2 },
  { to: "/history", labelKey: "nav.history", icon: History },
  { to: "/settings", labelKey: "nav.settings", icon: Settings },
];

interface AppHeaderProps {
  title?: string;
  back?: string;
  actions?: ReactNode;
  logout?: boolean;
}

export function AppHeader({ title, back, actions, logout = false }: AppHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();
  const { t } = useTranslation();
  const toast = useToast();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const barRef = useRef<HTMLDivElement>(null);
  const [barHeight, setBarHeight] = useState(0);

  useLayoutEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const update = () => setBarHeight(el.offsetHeight);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await signOut();
      toast.success(t("toast.loggedOut"));
      navigate("/", { replace: true });
    } finally {
      setLoggingOut(false);
      setConfirmOpen(false);
    }
  }

  function isActive(to: string) {
    return location.pathname === to || (to !== "/dashboard" && location.pathname.startsWith(to));
  }

  return (
    <>
      <div ref={barRef} className="fixed inset-x-0 top-0 z-30">
      <header className="safe-t safe-x border-b border-white/5 bg-surface-900/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center gap-3">
        <div className="flex min-w-0 items-center gap-2">
          {back && (
            <button
              type="button"
              onClick={() => navigate(back)}
              aria-label={t("common.back")}
              className="-ml-2 flex h-9 w-9 items-center justify-center rounded-xl text-gray-300 transition-colors active:bg-white/10 sm:hidden"
            >
              <ArrowLeft size={20} />
            </button>
          )}

          <button
            type="button"
            onClick={() => navigate(isAuthenticated ? "/dashboard" : "/")}
            className="hidden items-center gap-2 sm:flex"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-glow-sm">
              <Zap size={16} className="text-white fill-white" />
            </span>
            <span className="text-lg font-black text-gradient">Pingo</span>
          </button>

          {title && (
            <h1 className="truncate text-lg font-black text-white sm:hidden">{title}</h1>
          )}
        </div>

        {isAuthenticated && (
          <nav className="ml-2 hidden items-center gap-1 sm:flex">
            {TABS.map(({ to, labelKey, icon: Icon }) => {
              const active = isActive(to);
              return (
                <button
                  key={to}
                  type="button"
                  onClick={() => navigate(to)}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-bold transition-colors ${
                    active
                      ? "border-violet-500/30 bg-violet-600/20 text-violet-200"
                      : "border-transparent text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon size={16} /> {t(labelKey)}
                </button>
              );
            })}
          </nav>
        )}

        <div className="ml-auto flex items-center gap-2">
          {actions}
          {logout && isAuthenticated && (
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              aria-label={t("logout.button")}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 transition-colors hover:bg-white/5 hover:text-white active:bg-white/10"
            >
              <LogOut size={18} />
            </button>
          )}
        </div>
      </div>
      </header>

      <ResumeBar />
      </div>

      <div aria-hidden style={{ height: barHeight }} />

      {logout && (
        <ConfirmDialog
          isOpen={confirmOpen}
          title={t("logout.title")}
          description={t("logout.desc")}
          confirmLabel={t("logout.confirm")}
          isLoading={loggingOut}
          onConfirm={handleLogout}
          onClose={() => setConfirmOpen(false)}
        />
      )}
    </>
  );
}
