import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Globe, LayoutDashboard, Zap, Mail, Lock, User, Eye, EyeOff, LogIn, UserPlus } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useTranslation } from "@/i18n/LanguageProvider";

type AuthMode = "join" | "login" | "register";

export default function Home() {
  const navigate = useNavigate();
  const { signIn } = useAuthActions();
  const { isAuthenticated } = useConvexAuth();
  const { t } = useTranslation();

  const [pin, setPin] = useState("");
  const [mode, setMode] = useState<AuthMode>("join");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) return null;

  function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    if (pin.trim().length === 6) navigate(`/join?pin=${pin.trim()}`);
  }

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await signIn("password", { email, password, flow: "signIn" });
        navigate("/dashboard", { replace: true });
      } else {
        await signIn("password", { email, password, name, flow: "signUp" });
        navigate("/dashboard", { replace: true });
      }
    } catch {
      setError(mode === "login" ? t("home.err.login") : t("home.err.register"));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setError("");
    setGoogleLoading(true);
    try {
      await signIn("google", { redirectTo: "/dashboard" });
    } catch {
      setError(t("home.err.google"));
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <div className="min-h-screen-dvh flex flex-col items-center p-4 sm:p-6 bg-animated overflow-y-auto relative safe-x safe-t-min safe-b">
      <div className="relative z-10 w-full max-w-none sm:max-w-sm my-auto flex flex-col items-center gap-4 sm:gap-6 py-4">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", bounce: 0.4 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-2 sm:mb-3">
            <motion.div
              animate={{ rotate: [0, -15, 15, -10, 10, 0] }}
              transition={{ repeat: Infinity, repeatDelay: 3, duration: 0.6 }}
            >
              <Zap className="h-8 w-8 sm:h-9 sm:w-9 text-violet-400 fill-violet-400" />
            </motion.div>
          </div>
          <h1 className="text-6xl sm:text-7xl font-black tracking-tighter">
            <span className="text-gradient">Pingo</span>
          </h1>
          <p className="text-gray-400 mt-1.5 sm:mt-2 text-base sm:text-lg font-medium">
            {t("home.tagline")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, type: "spring", bounce: 0.35 }}
          className="w-full card p-0 sm:p-6 flex flex-col gap-4"
        >
          <div className="flex gap-1 p-1 bg-surface-900 rounded-xl">
            {(["join", "login", "register"] as AuthMode[]).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(""); }}
                className={[
                  "flex-1 py-2 rounded-lg text-sm font-bold transition-all duration-200",
                  mode === m
                    ? "bg-surface-700 text-white shadow"
                    : "text-gray-500 hover:text-gray-300",
                ].join(" ")}
              >
                  {m === "join" ? t("home.tab.join") : m === "login" ? t("home.tab.login") : t("home.tab.register")}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {mode === "join" && (
              <motion.form
                key="join"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                onSubmit={handleJoin}
                className="flex flex-col gap-3"
              >
                <div>
                  <p className="text-white font-black text-lg mb-0.5">{t("home.join.title")}</p>
                  <p className="text-gray-500 text-sm">{t("home.join.subtitle")}</p>
                </div>
                <Input
                  placeholder="123456"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  maxLength={6}
                  inputMode="numeric"
                  autoFocus
                  className="text-center text-2xl font-black tracking-[0.3em]"
                />
                <Button type="submit" size="lg" disabled={pin.length !== 6} className="w-full">
                  {t("home.join.cta")} <ArrowRight size={18} />
                </Button>
              </motion.form>
            )}

            {mode === "login" && (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                onSubmit={handleAuth}
                className="flex flex-col gap-3"
              >
                <div>
                  <p className="text-white font-black text-lg mb-0.5">{t("home.login.title")}</p>
                  <p className="text-gray-500 text-sm">{t("home.login.subtitle")}</p>
                </div>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                  <Input
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                    autoComplete="email"
                  />
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder={t("home.password")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 pr-10"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {error && (
                  <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
                    {error}
                  </p>
                )}
                <Button type="submit" size="lg" isLoading={loading} disabled={googleLoading || !email || !password} className="w-full">
                  <LogIn size={18} /> {t("home.login.cta")}
                </Button>
              </motion.form>
            )}

            {mode === "register" && (
              <motion.form
                key="register"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                onSubmit={handleAuth}
                className="flex flex-col gap-3"
              >
                <div>
                  <p className="text-white font-black text-lg mb-0.5">{t("home.register.title")}</p>
                  <p className="text-gray-500 text-sm">{t("home.register.subtitle")}</p>
                </div>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                  <Input
                    type="text"
                    placeholder={t("home.name")}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-9"
                    autoComplete="name"
                  />
                </div>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                  <Input
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                    autoComplete="email"
                  />
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder={t("home.register.passwordPlaceholder")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 pr-10"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {error && (
                  <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
                    {error}
                  </p>
                )}
                <Button type="submit" size="lg" isLoading={loading} disabled={googleLoading || !email || !password || password.length < 8} className="w-full">
                  <UserPlus size={18} /> {t("home.register.cta")}
                </Button>
              </motion.form>
            )}
          </AnimatePresence>

          {mode !== "join" && (
            <div className="border-t border-white/5 pt-3 flex flex-col gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={handleGoogleSignIn}
                isLoading={googleLoading}
                disabled={loading}
                className="w-full"
              >
                <Globe size={16} /> {t("home.google")}
              </Button>
              <p className="text-center text-xs text-gray-600 uppercase tracking-wider font-semibold">
                {t("home.orGuest")}
              </p>
              <Button variant="secondary" onClick={() => setMode("join")} className="w-full">
                <LayoutDashboard size={16} /> {t("home.joinGame")}
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
