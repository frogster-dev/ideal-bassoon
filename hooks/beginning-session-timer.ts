import { useEffect, useState } from "react";

type TUseTimer = {
  beginningTimeLeft: number;
  beginningTimerFinished: boolean;
  pauseBeginningTimer: () => void;
  resumeBeginningTimer: () => void;
  addTimeToBeginningTimer: (secondsToAdd: number) => void;
};

type TimerState = "finished" | "running" | "paused";

export const useBeginningSessionTimer = (initialTimeInSeconds: number): TUseTimer => {
  const [timerState, setTimerState] = useState<TimerState>("running");
  const [timeLeft, setTimeLeft] = useState(initialTimeInSeconds);
  const [timerFinished, setTimerFinished] = useState(false);

  const pauseBeginningTimer = () => {
    setTimerState("paused");
  };

  const resumeBeginningTimer = () => {
    setTimerState("running");
  };

  const addTimeToBeginningTimer = (secondsToAdd: number) => {
    setTimeLeft((prev) => {
      const newTime = prev + secondsToAdd;
      // Cap at 60 seconds max
      return Math.min(newTime, 60);
    });
  };

  // Timer countdown logic
  useEffect(() => {
    if (timerState !== "running") return;

    if (timeLeft <= 0) {
      setTimerState("finished");
      setTimerFinished(true);
      return;
    }

    // Decrease time left by 1 second
    const id = setTimeout(() => setTimeLeft((prev) => Math.max(Math.floor(prev - 1), 0)), 1000);

    return () => {
      clearTimeout(id);
    };
  }, [timeLeft, timerState]);

  return {
    beginningTimeLeft: timeLeft,
    beginningTimerFinished: timerFinished,
    pauseBeginningTimer,
    resumeBeginningTimer,
    addTimeToBeginningTimer,
  };
};
