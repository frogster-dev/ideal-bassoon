import {
  BEGINNING_SESSION_MODAL_TIMER,
  BeginningSessionModal,
} from "@/components/(session)/beginning-session-modal";
import { CurrentExerciseDisplay } from "@/components/(session)/current-exercise-display";
import { NextExerciseDisplay } from "@/components/(session)/next-exercise-display";
import { PauseOverlay } from "@/components/ui/pause-overlay";
import { useBeginningSessionTimer } from "@/hooks/beginning-session-timer";
import { useTimer } from "@/hooks/use-timer";
import { useInSessionStore } from "@/libs/zustand/in-session-store";
import { useSessionPreferences } from "@/libs/zustand/session-preferences-store";
import { Colors } from "@/utils/constants/colors";
import { defaultStyles } from "@/utils/constants/styles";
import { useSounds } from "@/utils/sounds";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

type State = "beginning" | "exercices" | "exerciseRest" | "pause" | "end";

type SessionState = {
  previous: State | null;
  current: State;
};

export default function Page() {
  const router = useRouter();

  const { soundsEnabled } = useSessionPreferences();

  // Index of the current exercice
  const [index, setIndex] = useState(0);

  // State of the session
  const [sessionState, setSessionState] = useState<SessionState>({
    previous: null,
    current: "beginning",
  });

  const { exercices, sessionParams } = useInSessionStore();

  const { playStartSession, playEndSession, playStartRest, playEndRest } = useSounds();
  const [beginningModalVisible, setBeginningModalVisible] = useState(true);

  // Track if we've already played the start-rest sound for the current rest period
  const startRestSoundPlayedRef = useRef(false);

  const [currentExercice, nextExercice] = useMemo(
    () => [exercices[index], exercices[index + 1]],
    [index, exercices],
  );

  // Reset the start-rest sound flag when starting a new exercise
  useEffect(() => {
    if (sessionState.current === "exercices") {
      startRestSoundPlayedRef.current = false;
    }
  }, [index, sessionState.current]);

  // Main exercise timer
  const { timeLeft, timerFinished, startTimer, pauseTimer, resumeTimer, stopTimer } = useTimer();

  // Rest timer between exercises
  const {
    timeLeft: restTimeLeft,
    timerFinished: restTimerFinished,
    startTimer: startRestTimer,
    pauseTimer: pauseRestTimer,
    resumeTimer: resumeRestTimer,
    stopTimer: stopRestTimer,
  } = useTimer();

  // Beginning session timer (start at the first render)
  const {
    beginningTimeLeft,
    beginningTimerFinished,
    pauseBeginningTimer,
    resumeBeginningTimer,
    addTimeToBeginningTimer,
  } = useBeginningSessionTimer(BEGINNING_SESSION_MODAL_TIMER);

  // Handle beginning timer and modal
  useEffect(() => {
    if (!exercices || exercices.length === 0) return;

    if (beginningTimerFinished) {
      // Beginning timer is finished, start the session
      setBeginningModalVisible(false);
      setSessionState((prev) => ({ previous: prev.current, current: "exercices" }));

      // Play start session
      if (soundsEnabled) playStartSession();

      // Start the main timer with the duration of the first exercice
      const initialTime = exercices[0]?.duration ?? 100;
      startTimer(initialTime);
    }
  }, [beginningTimerFinished, exercices, playStartSession, startTimer]);

  // Handle main timer - transition to rest when exercise finishes
  useEffect(() => {
    if (sessionState.current !== "exercices" || !exercices || exercices.length === 0) return;

    if (timerFinished) {
      const newIndex = index + 1;

      if (newIndex < exercices.length) {
        // Start rest period before next exercise
        setSessionState((prev) => ({ previous: prev.current, current: "exerciseRest" }));
        const pauseDuration = sessionParams?.pauseDuration ?? 10;
        startRestTimer(pauseDuration);

        // Play the sound
        if (soundsEnabled) playStartRest();

        // Reset the flag so we can play the sound for this new rest period
        startRestSoundPlayedRef.current = false;
      } else {
        // Session is complete - play end session sound
        if (soundsEnabled) playEndSession();
        stopTimer();
        pauseBeginningTimer();
        router.push("/(session)/end");
      }
    }
  }, [
    sessionState,
    timerFinished,
    index,
    exercices,
    sessionParams,
    playEndSession,
    startRestTimer,
    stopTimer,
    pauseBeginningTimer,
    router,
  ]);

  // Handle rest timer - start next exercise when rest finishes
  useEffect(() => {
    if (sessionState.current !== "exerciseRest") return;

    if (restTimerFinished) {
      const newIndex = index + 1;
      setIndex(newIndex);
      setSessionState((prev) => ({ previous: prev.current, current: "exercices" }));
      startTimer(exercices[newIndex]?.duration ?? 100);
    } else {
      // Start the End Rest sound 2 seconds before the exercise ends
      if (restTimeLeft === 2) {
        if (soundsEnabled) playEndRest();
      }
    }
  }, [sessionState, restTimerFinished, restTimeLeft, index, exercices, playEndRest, startTimer]);

  const handlePauseButtonPress = () => {
    if (sessionState.current !== "pause") {
      // If we pause during Beginning
      if (sessionState.current === "beginning") {
        pauseBeginningTimer();
      }

      // If we pause during Exercices
      if (sessionState.current === "exercices") {
        pauseTimer();
      }

      // If we pause during Exercise Rest
      if (sessionState.current === "exerciseRest") {
        pauseRestTimer();
      }

      setSessionState((prev) => ({ previous: prev.current, current: "pause" }));
    } else {
      if (sessionState.previous === "beginning") {
        resumeBeginningTimer();
      }

      if (sessionState.previous === "exercices") {
        resumeTimer();
      }

      if (sessionState.previous === "exerciseRest") {
        resumeRestTimer();
      }

      setSessionState((prev) => ({ previous: "pause", current: prev.previous! }));
    }
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <BeginningSessionModal
          timer={beginningTimeLeft}
          visible={beginningModalVisible}
          onRequestClose={() => setBeginningModalVisible(false)}
          onAddTime={addTimeToBeginningTimer}
        />

        {/* Chronometre pour montrer le temps de l'exercice et d'attente */}
        <View style={styles.container}>
          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>{!beginningTimerFinished ? ".." : timeLeft}</Text>
          </View>

          {/* Progress bar avec le nombre d'exercices */}
          <View style={{ flexDirection: "row", gap: 4, marginHorizontal: 16 }}>
            {Array.from({ length: exercices.length + 1 }).map((_, idx) => (
              <View
                key={idx}
                style={[
                  styles.progressBar,
                  { backgroundColor: idx <= index ? Colors.primary700 : Colors.slate50 },
                ]}
              />
            ))}
          </View>

          <View style={{ flex: 1, gap: 16 }}>
            {currentExercice && <CurrentExerciseDisplay exercise={currentExercice} />}

            {nextExercice && <NextExerciseDisplay exercise={nextExercice} />}
          </View>

          <PauseOverlay
            isPaused={sessionState.current === "pause"}
            onPress={handlePauseButtonPress}
          />

          {/* Bouton pour stopper la session position absolute */}
          {/* <PauseButton
            onPress={handlePauseButtonPress}
            isPaused={sessionState.current === "pause"}
          /> */}

          {/* Rest timer overlay with fade-in animation */}
          {(sessionState.current === "exerciseRest" ||
            (sessionState.current === "pause" && sessionState.previous === "exerciseRest")) && (
            <Animated.View entering={FadeIn} style={styles.restOverlay}>
              <Text style={styles.restTimerText}>{restTimeLeft}</Text>
              <Text style={styles.restLabel}>Rest</Text>
            </Animated.View>
          )}
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#042f2e" },
  exerciseTitle: {
    ...defaultStyles.textL,
    ...defaultStyles.textBold,
    color: Colors.background,
    textAlign: "center",
  },
  timerText: {
    ...defaultStyles.textMassive,
    ...defaultStyles.textBold,
    color: Colors.background,
  },
  progressBar: {
    flex: 1,
    height: 4,
    borderRadius: 99,
  },
  exercisePhotoContainer: {
    overflow: "hidden",
    backgroundColor: Colors.green500,
    aspectRatio: 1,
    maxWidth: "100%",
    flex: 1,
  },
  pauseButton: {
    position: "absolute",
    bottom: 32,
    left: 16,
    backgroundColor: Colors.background,
    padding: 16,
  },
  timerContainer: {
    margin: 16,
    marginVertical: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  restOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  restTimerText: {
    ...defaultStyles.textMassive,
    ...defaultStyles.textBold,
    color: Colors.background,
    fontSize: 72,
  },
  restLabel: {
    ...defaultStyles.textL,
    ...defaultStyles.textBold,
    color: Colors.background,
    marginTop: 16,
  },
});
