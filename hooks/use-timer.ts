import { useEffect, useState } from "react";

type TUseTimer = {
  timeLeft: number;
  timerFinished: boolean;
  startTimer: (initialTimeInSeconds: number) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => void;
};

export type TimerState = "finished" | "running" | "paused";

export const useTimer = (): TUseTimer => {
  const [timerState, setTimerState] = useState<TimerState>("paused");
  const [timeLeft, setTimeLeft] = useState(-1);
  const [timerFinished, setTimerFinished] = useState(false);

  const startTimer = (initialTimeInSeconds: number) => {
    setTimerState("running");
    setTimeLeft(initialTimeInSeconds);
    setTimerFinished(false);
  };

  const pauseTimer = () => {
    setTimerState("paused");
  };

  const resumeTimer = () => {
    setTimerState("running");
  };

  const stopTimer = () => {
    setTimerState("finished");
    setTimeLeft(-1);
    setTimerFinished(true);
  };

  // Timer countdown logic
  useEffect(() => {
    if (timerState === "finished" || timeLeft <= 0) {
      setTimerState("finished");
      setTimerFinished(true);
      return;
    }

    if (timerState === "paused") return;

    // Decrease time left by 1 second
    const id = setTimeout(() => setTimeLeft((prev) => Math.max(Math.floor(prev - 1), 0)), 1000);

    return () => {
      clearTimeout(id);
    };
  }, [timeLeft, timerState]);

  return { timeLeft, timerFinished, startTimer, pauseTimer, resumeTimer, stopTimer };
};
