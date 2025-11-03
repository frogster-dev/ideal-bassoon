import { useRouter } from "expo-router";
import { SquircleButton, SquircleView } from "expo-squircle-view";
import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

import { CustomSlider } from "@/components/ui/custom-slider";
import { Line } from "@/components/ui/line";
import { SegmentedProjectPriorityButton } from "@/components/ui/segmented-difficulty-buttonts";
import * as schema from "@/libs/drizzle/schema";
import { useInSessionStore } from "@/libs/zustand/in-session-store";
import { createSession } from "@/services/session-service";
import { Colors } from "@/utils/constants/colors";
import {
  effortDurationOptions,
  effortDurationOptionsDev,
  exerciseDurationOptions,
  exerciseDurationOptionsDev,
  pauseDurationOptions,
  pauseDurationOptionsDev,
} from "@/utils/constants/session";
import { defaultStyles } from "@/utils/constants/styles";
import { getExerciseImage } from "@/utils/exercise-images";
import { useAuth } from "@clerk/clerk-expo";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { Image } from "expo-image";
import { useSQLiteContext } from "expo-sqlite";

export default function Page() {
  const router = useRouter();
  const { userId } = useAuth();
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });

  const { exercices, initializeSession, isLoading, setSessionId } = useInSessionStore();

  // Durée d'éffort en seconds (min: 10min, max: 25min in prod | 1min-4min in dev)
  const [effortDuration, setEffortDuration] = useState(__DEV__ ? 1 * 60 : 10 * 60);

  // Durée de pause entre chaque exercices en seconds (min: 5sec, max: 60sec in prod | 2sec-8sec in dev)
  const [pauseDuration, setPauseDuration] = useState(__DEV__ ? 2 : 5);

  // Durée pour chaque exercices en seconds (min: 30sec, max: 60sec in prod | 4sec-16sec in dev)
  const [exerciseDuration, setExerciseDuration] = useState(__DEV__ ? 4 : 30);

  // Difficulté des exercices (min: 1, max: 3) (1 is easy, 2 is medium, 3 is hard)
  const [difficulty, setDifficulty] = useState(1);

  const [numberOfPossiblesExercices, totalTime, pauseTime] = useMemo(() => {
    // In seconds
    const numberOfPossiblesExercices = Math.floor(effortDuration / exerciseDuration);
    const exercicesTime = numberOfPossiblesExercices * exerciseDuration;
    const pauseTime = (numberOfPossiblesExercices - 1) * pauseDuration;

    const time = exercicesTime + pauseTime;

    // Convert the time to minutes and seconds as a string
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    const pauseTimeMinutes = Math.floor(pauseTime / 60);
    const pauseTimeSeconds = pauseTime % 60;

    return [
      numberOfPossiblesExercices,
      `${minutes} min ${seconds.toString().padStart(2, "0")} sec`,
      `${pauseTimeMinutes} min ${pauseTimeSeconds.toString().padStart(2, "0")} sec`,
    ];
  }, [effortDuration, pauseDuration, exerciseDuration]);

  useEffect(() => {
    initializeSession({
      numberOfExercices: numberOfPossiblesExercices,
      duration: exerciseDuration,
      pauseDuration: pauseDuration,
      difficulty,
    });
  }, [numberOfPossiblesExercices, exerciseDuration, pauseDuration, difficulty]);

  const handleStartSession = async () => {
    if (!userId || isLoading || exercices.length === 0) return;

    try {
      const session = await createSession(drizzleDb, {
        userId,
        difficulty,
        numberOfExercices: numberOfPossiblesExercices,
        exerciseDuration,
        pauseDuration,
        exercices,
      });

      setSessionId(session.id);
      router.replace("/(session)");
    } catch (error) {
      console.error("Failed to create session:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 208 }}>
        <View style={styles.content}>
          <Text style={styles.pageTitle}>Configuration de la séance d'étirement</Text>

          <CustomSlider
            title="Durée d'effort"
            options={__DEV__ ? effortDurationOptionsDev : effortDurationOptions}
            value={effortDuration}
            onValueChange={setEffortDuration}
            step={__DEV__ ? 1 * 60 : 5 * 60} // 1 minute step in DEV, 5 minutes in prod
          />

          <CustomSlider
            title="Durée de pause entre exercices"
            options={__DEV__ ? pauseDurationOptionsDev : pauseDurationOptions}
            value={pauseDuration}
            onValueChange={(value) => setPauseDuration(!value ? (__DEV__ ? 2 : 5) : value)}
            step={__DEV__ ? 2 : 10} // 2 seconds step in DEV, 10 seconds in prod
          />

          <CustomSlider
            title="Durée de chaque exercice"
            options={__DEV__ ? exerciseDurationOptionsDev : exerciseDurationOptions}
            value={exerciseDuration}
            onValueChange={setExerciseDuration}
            step={__DEV__ ? 4 : 10} // 4 seconds step in DEV, 10 seconds in prod
          />

          <SegmentedProjectPriorityButton
            selectedId={difficulty}
            onDifficultyChange={setDifficulty}
          />
        </View>

        <SquircleView
          style={{ backgroundColor: Colors.background, padding: 16, gap: 32 }}
          borderRadius={16}>
          <Text style={{ ...defaultStyles.textBold, color: Colors.dark }}>
            Recapitulatif de la séance
          </Text>
          <View style={{ gap: 16 }}>
            <Line left="Nombre d'exercices a avoir" right={numberOfPossiblesExercices} />
            <Line left="Durée totale de la séance" right={totalTime} />
            <Line left="Total pause" right={pauseTime} />
          </View>

          <View style={{ gap: 16, flexDirection: "row", alignItems: "center" }}>
            <View style={{ flex: 1, height: 1, backgroundColor: Colors.slate200 }} />
            <Text style={{ color: Colors.slate500 }}>Exercices ({exercices.length})</Text>
            <View style={{ flex: 1, height: 1, backgroundColor: Colors.slate200 }} />
          </View>

          <View style={{ gap: 16 }}>
            {exercices.map((exercice) => (
              <View key={exercice.id} style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ flex: 1 }}>{exercice.title}</Text>
                <Image
                  source={getExerciseImage(exercice.image)}
                  style={{
                    width: 42,
                    height: 42,
                    backgroundColor: Colors.slate200,
                    borderRadius: 6,
                  }}
                  contentFit="cover"
                />
              </View>
            ))}
          </View>
        </SquircleView>
      </ScrollView>

      <View style={styles.absoluteView}>
        <View style={[styles.totalTimeContainer, styles.shadow]}>
          <Text style={styles.totalTimeText}>total: {totalTime}</Text>
        </View>

        <SquircleButton
          style={[styles.button, styles.shadow, { opacity: isLoading ? 0.5 : 1 }]}
          onPress={handleStartSession}
          disabled={isLoading}>
          <Text style={styles.buttonText}>
            {isLoading ? "Chargement des exercices..." : "Commencer la séance"}
          </Text>
        </SquircleButton>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: Colors.grayBackground },
  content: {
    paddingBottom: 120, // Add padding to account for the fixed bottom section
  },
  pageTitle: {
    ...defaultStyles.textL,
    color: Colors.dark,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: Colors.primary700,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    height: 50,
    borderRadius: 10,
  },
  buttonText: {
    color: Colors.background,
    ...defaultStyles.textBold,
  },
  totalTimeContainer: {
    backgroundColor: Colors.background,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignSelf: "center",
    borderRadius: 99,
  },
  totalTimeText: {
    color: Colors.primary700,
    ...defaultStyles.textS,
  },
  absoluteView: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    gap: 16,
  },
  shadow: {
    shadowColor: Colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
