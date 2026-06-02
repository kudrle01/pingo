import { useEffect, useRef, useState } from "react";

interface UseCountdownOptions {
  duration: number;
  onExpire?: () => void;
  autoStart?: boolean;
}

interface UseCountdownResult {
  timeLeft: number;
  progress: number;
  isRunning: boolean;
  start: () => void;
  reset: () => void;
}

export function useCountdown({
  duration,
  onExpire,
  autoStart = true,
}: UseCountdownOptions): UseCountdownResult {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(autoStart);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    setTimeLeft(duration);
    setIsRunning(autoStart);
  }, [duration, autoStart]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRunning(false);
          onExpireRef.current?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  return {
    timeLeft,
    progress: 1 - timeLeft / duration,
    isRunning,
    start: () => setIsRunning(true),
    reset: () => {
      setTimeLeft(duration);
      setIsRunning(autoStart);
    },
  };
}
