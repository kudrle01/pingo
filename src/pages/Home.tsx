import { useToast } from "@/components/ToastProvider";
import { Button } from "@/components/ui/Button";
import { IconInput } from "@/components/ui/IconInput";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { useTranslation } from "@/i18n/LanguageProvider";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Globe,
  KeyRound,
  LayoutDashboard,
  LogIn,
  Mail,
  ShieldCheck,
  User,
  UserPlus,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type AuthMode = "join" | "login" | "register";
type FlowStep = null | "verify" | "reset";

function CodeInput(props: React.ComponentProps<typeof Input>) {
  return (
    <Input
      placeholder="123456"
      inputMode="numeric"
      maxLength={6}
      className="text-center text-2xl font-black tracking-[0.3em]"
      {...props}
    />
  );
}

export default function Home() {
  const navigate = useNavigate();
  const { signIn } = useAuthActions();
  const { isAuthenticated } = useConvexAuth();
  const { t } = useTranslation();
  const toast = useToast();

  const [pin, setPin] = useState("");
  const [mode, setMode] = useState<AuthMode>("join");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [flowStep, setFlowStep] = useState<FlowStep>(null);
  const [pendingEmail, setPendingEmail] = useState("");
  const [resetCodeSent, setResetCodeSent] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) return null;

  const onlyDigits = (value: string) => value.replace(/\D/g, "").slice(0, 6);

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
        setPendingEmail(email);
        setCode("");
        setFlowStep("verify");
        toast.info(t("home.codeSent"));
      }
    } catch {
      setError(mode === "login" ? t("home.err.login") : t("home.err.register"));
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn("password", { email: pendingEmail, code, flow: "email-verification" });
      navigate("/dashboard", { replace: true });
    } catch {
      setError(t("home.err.code"));
    } finally {
      setLoading(false);
    }
  }

  async function handleResetRequest(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn("password", { email, flow: "reset" });
      setPendingEmail(email);
      setResetCodeSent(true);
      setCode("");
      setPassword("");
      toast.info(t("home.codeSent"));
    } catch {
      setError(t("home.reset.err"));
    } finally {
      setLoading(false);
    }
  }

  async function handleResetVerify(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn("password", {
        email: pendingEmail,
        code,
        newPassword: password,
        flow: "reset-verification",
      });
      navigate("/dashboard", { replace: true });
    } catch {
      setError(t("home.err.code"));
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

  function startReset() {
    setFlowStep("reset");
    setResetCodeSent(false);
    setError("");
    setCode("");
    setPassword("");
  }

  function cancelFlow() {
    setFlowStep(null);
    setResetCodeSent(false);
    setError("");
    setCode("");
  }

  const backButton = (
    <button
      type="button"
      onClick={cancelFlow}
      className="self-start inline-flex items-center gap-1.5 text-sm font-semibold text-gray-400 transition-colors hover:text-white"
    >
      <ArrowLeft size={16} /> {t("home.back")}
    </button>
  );

  const errorBox = error && (
    <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
      {error}
    </p>
  );

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
              transition={{ repeat: Number.POSITIVE_INFINITY, repeatDelay: 3, duration: 0.6 }}
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
          {flowStep === "verify" ? (
            <form onSubmit={handleVerify} className="flex flex-col gap-3">
              {backButton}
              <div className="flex flex-col items-center text-center gap-1">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600/20 text-violet-300">
                  <ShieldCheck size={24} />
                </span>
                <p className="text-white font-black text-lg mt-1">{t("home.verify.title")}</p>
                <p className="text-gray-500 text-sm">
                  {t("home.verify.subtitle", { email: pendingEmail })}
                </p>
              </div>
              <CodeInput
                value={code}
                onChange={(e) => setCode(onlyDigits(e.target.value))}
                autoFocus
              />
              {errorBox}
              <Button
                type="submit"
                size="lg"
                isLoading={loading}
                disabled={code.length < 6}
                className="w-full"
              >
                <ShieldCheck size={18} /> {t("home.verify.cta")}
              </Button>
            </form>
          ) : flowStep === "reset" ? (
            <form
              onSubmit={resetCodeSent ? handleResetVerify : handleResetRequest}
              className="flex flex-col gap-3"
            >
              {backButton}
              <div className="flex flex-col items-center text-center gap-1">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600/20 text-violet-300">
                  <KeyRound size={24} />
                </span>
                <p className="text-white font-black text-lg mt-1">{t("home.reset.title")}</p>
                <p className="text-gray-500 text-sm">
                  {resetCodeSent ? t("home.reset.codeSentTitle") : t("home.reset.subtitle")}
                </p>
              </div>

              {!resetCodeSent ? (
                <>
                  <IconInput
                    icon={<Mail size={16} />}
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    autoFocus
                  />
                  {errorBox}
                  <Button
                    type="submit"
                    size="lg"
                    isLoading={loading}
                    disabled={!email}
                    className="w-full"
                  >
                    {t("home.reset.send")}
                  </Button>
                </>
              ) : (
                <>
                  <CodeInput
                    value={code}
                    onChange={(e) => setCode(onlyDigits(e.target.value))}
                    autoFocus
                  />
                  <PasswordInput
                    placeholder={t("home.reset.newPassword")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                  {errorBox}
                  <Button
                    type="submit"
                    size="lg"
                    isLoading={loading}
                    disabled={code.length < 6 || password.length < 8}
                    className="w-full"
                  >
                    {t("home.reset.cta")}
                  </Button>
                </>
              )}
            </form>
          ) : (
            <>
              <div className="flex gap-1 p-1 bg-surface-900 rounded-xl">
                {(["join", "login", "register"] as AuthMode[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      setMode(m);
                      setError("");
                    }}
                    className={[
                      "flex-1 py-2 rounded-lg text-sm font-bold transition-all duration-200",
                      mode === m
                        ? "bg-surface-700 text-white shadow"
                        : "text-gray-500 hover:text-gray-300",
                    ].join(" ")}
                  >
                    {m === "join"
                      ? t("home.tab.join")
                      : m === "login"
                        ? t("home.tab.login")
                        : t("home.tab.register")}
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
                    <CodeInput
                      value={pin}
                      onChange={(e) => setPin(onlyDigits(e.target.value))}
                      autoFocus
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
                      <p className="text-white font-black text-lg mb-0.5">
                        {t("home.login.title")}
                      </p>
                      <p className="text-gray-500 text-sm">{t("home.login.subtitle")}</p>
                    </div>
                    <IconInput
                      icon={<Mail size={16} />}
                      type="email"
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                    />
                    <PasswordInput
                      placeholder={t("home.password")}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={startReset}
                      className="self-end text-xs font-semibold text-violet-300 hover:text-violet-200"
                    >
                      {t("home.forgot")}
                    </button>
                    {errorBox}
                    <Button
                      type="submit"
                      size="lg"
                      isLoading={loading}
                      disabled={googleLoading || !email || !password}
                      className="w-full"
                    >
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
                      <p className="text-white font-black text-lg mb-0.5">
                        {t("home.register.title")}
                      </p>
                      <p className="text-gray-500 text-sm">{t("home.register.subtitle")}</p>
                    </div>
                    <IconInput
                      icon={<User size={16} />}
                      type="text"
                      placeholder={t("home.name")}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="name"
                    />
                    <IconInput
                      icon={<Mail size={16} />}
                      type="email"
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                    />
                    <PasswordInput
                      placeholder={t("home.register.passwordPlaceholder")}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                    />
                    {errorBox}
                    <Button
                      type="submit"
                      size="lg"
                      isLoading={loading}
                      disabled={googleLoading || !email || !password || password.length < 8}
                      className="w-full"
                    >
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
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
