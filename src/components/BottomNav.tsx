import { useLocation, useNavigate } from "react-router-dom";
import { useConvexAuth } from "convex/react";
import { motion } from "framer-motion";
import { LayoutGrid, Gamepad2, History, Settings, type LucideIcon } from "lucide-react";
import { useTranslation } from "@/i18n/LanguageProvider";

interface Tab {
  to: string;
  labelKey: string;
  icon: LucideIcon;
}

const TABS: Tab[] = [
  { to: "/dashboard", labelKey: "nav.quizzes", icon: LayoutGrid },
  { to: "/join", labelKey: "nav.play", icon: Gamepad2 },
  { to: "/history", labelKey: "nav.history", icon: History },
  { to: "/settings", labelKey: "nav.settings", icon: Settings },
];

export function BottomNav() {
  const { isAuthenticated } = useConvexAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  if (!isAuthenticated) return null;

  return (
    <nav className="shrink-0 z-40 safe-b safe-x sm:hidden">
      <div className="mx-auto max-w-md px-3 pb-2">
        <div className="flex items-stretch justify-around rounded-2xl border border-white/10 bg-surface-800/90 backdrop-blur-xl shadow-card">
          {TABS.map(({ to, labelKey, icon: Icon }) => {
            const active =
              location.pathname === to ||
              (to !== "/dashboard" && location.pathname.startsWith(to));
            return (
              <button
                key={to}
                type="button"
                onClick={() => navigate(to)}
                aria-current={active ? "page" : undefined}
                className="relative flex flex-1 flex-col items-center gap-0.5 py-2.5 px-2"
              >
                {active && (
                  <motion.span
                    layoutId="bottomnav-active"
                    initial={false}
                    className="absolute inset-1 rounded-xl bg-gradient-to-br from-violet-600/25 to-fuchsia-600/20 border border-violet-500/30"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <Icon
                  size={20}
                  className={`relative z-10 transition-colors ${
                    active ? "text-violet-300" : "text-gray-500"
                  }`}
                />
                <span
                  className={`relative z-10 text-[10px] font-bold tracking-wide transition-colors ${
                    active ? "text-violet-200" : "text-gray-500"
                  }`}
                >
                  {t(labelKey)}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
