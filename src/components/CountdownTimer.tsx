import { useCountdown } from "@/hooks/useCountdown";
import { useTranslation } from "@/i18n/LanguageProvider";

interface CountdownTimerProps {
  duration: number;
  onExpire?: () => void;
  className?: string;
}

const COLOR: Record<"green" | "yellow" | "red", { text: string; stroke: string }> = {
  green: { text: "text-emerald-400", stroke: "stroke-emerald-400" },
  yellow: { text: "text-amber-400", stroke: "stroke-amber-400" },
  red: { text: "text-red-400", stroke: "stroke-red-400" },
};

export function CountdownTimer({ duration, onExpire, className = "" }: CountdownTimerProps) {
  const { timeLeft, progress } = useCountdown({ duration, onExpire });
  const { t } = useTranslation();

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * progress;

  const state = timeLeft > duration * 0.5 ? "green" : timeLeft > duration * 0.25 ? "yellow" : "red";

  const { text, stroke } = COLOR[state];

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      role="timer"
      aria-label={t("common.timeLeft", { n: timeLeft })}
    >
      <svg width="100" height="100" className="rotate-[-90deg]">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          className="stroke-gray-700"
          strokeWidth="8"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          className={`${stroke} [transition:stroke-dashoffset_0.9s_linear,stroke_0.3s]`}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
      <span className={`absolute text-2xl font-black tabular-nums ${text}`}>{timeLeft}</span>
    </div>
  );
}
