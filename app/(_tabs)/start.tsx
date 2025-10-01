import { useRouter } from "expo-router";
import { SquircleButton, SquircleView } from "expo-squircle-view";
import React, { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

import { CustomSlider, SliderOption } from "@/components/ui/custom-slider";
import { Line } from "@/components/ui/line";
import { SegmentedProjectPriorityButton } from "@/components/ui/segmented-difficulty-buttonts";
import { Colors } from "@/utils/constants/colors";
import { defaultStyles } from "@/utils/constants/styles";

export default function Page() {
  const router = useRouter();

  // Durée d'éffort en seconds (min: 10min, max: 25min)
  const [effortDuration, setEffortDuration] = useState(10 * 60);

  // Durée de pause entre chaque exercices en seconds (min: 5sec, max: 60sec)
  const [pauseDuration, setPauseDuration] = useState(5);

  // Durée pour chaque exercices en seconds (min: 30sec, max: 60sec)
  const [exerciseDuration, setExerciseDuration] = useState(30);

  // Difficulté des exercices (min: 1, max: 3) (1 is easy, 2 is medium, 3 is hard)
  const [difficulty, setDifficulty] = useState(1);

  // Slider options
  const effortDurationOptions: SliderOption[] = [
    { label: "~10min", value: 10 * 60 },
    { label: "~15min", value: 15 * 60 },
    { label: "~20min", value: 20 * 60 },
    { label: "~25min", value: 25 * 60 },
  ];

  const pauseDurationOptions: SliderOption[] = [
    { label: "5sec", value: 0 },
    { label: "10sec", value: 10 },
    { label: "20sec", value: 20 },
    { label: "30sec", value: 30 },
    { label: "40sec", value: 40 },
    { label: "50sec", value: 50 },
    { label: "60sec", value: 60 },
  ];

  const exerciseDurationOptions: SliderOption[] = [
    { label: "30sec", value: 30 },
    { label: "40sec", value: 40 },
    { label: "50sec", value: 50 },
    { label: "60sec", value: 60 },
  ];

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
            options={effortDurationOptions}
            value={effortDuration}
            onValueChange={setEffortDuration}
            step={5 * 60} // 5 minutes step
          />

          <CustomSlider
            title="Durée de pause entre exercices"
            options={pauseDurationOptions}
            value={pauseDuration}
            onValueChange={(value) => setPauseDuration(!value ? 5 : value)}
            step={10} // 10 seconds step
          />

          <CustomSlider
            title="Durée de chaque exercice"
            options={exerciseDurationOptions}
            value={exerciseDuration}
            onValueChange={setExerciseDuration}
            step={10} // 10 seconds step
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
            <Line left="Nombre d'exercices" right={numberOfPossiblesExercices} />
            <Line left="Durée totale de la séance" right={totalTime} />
            <Line left="Total pause" right={pauseTime} />
          </View>
        </SquircleView>
      </ScrollView>

      <View style={styles.absoluteView}>
        <View style={[styles.totalTimeContainer, styles.shadow]}>
          <Text style={styles.totalTimeText}>total: {totalTime}</Text>
        </View>

        <SquircleButton
          style={[styles.button, styles.shadow]}
          onPress={() => router.replace("/(session)")}>
          <Text style={styles.buttonText}>Commencer la séance</Text>
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
