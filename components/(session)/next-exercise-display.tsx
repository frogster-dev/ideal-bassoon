import { Image } from "expo-image";
import { SquircleView } from "expo-squircle-view";
import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Colors } from "@/utils/constants/colors";
import { getExerciseImage } from "@/utils/exercise-images";
import { ExerciseWithDuration } from "@/utils/interfaces/exercice";

export const NextExerciseDisplay = memo(({ exercise }: { exercise: ExerciseWithDuration }) => (
  <View style={styles.nextExerciseContainer}>
    <View style={{ gap: 4, flex: 1 }}>
      <Text style={[styles.nextExerciseTitle]}>Prochain exercice</Text>
      <Text style={styles.nextExerciseText}>{exercise.title}</Text>
    </View>

    <SquircleView style={styles.nextExercisePhotoContainer} borderRadius={16}>
      <Image contentFit="cover" source={getExerciseImage(exercise.image)} style={styles.image} />
    </SquircleView>
  </View>
));

const styles = StyleSheet.create({
  container: { flex: 3, padding: 16, gap: 16, alignItems: "center" },
  nextExercisePhotoContainer: {
    flex: 1,
    margin: 16,
    overflow: "hidden",
    backgroundColor: Colors.orange500,
    alignItems: "center",
    aspectRatio: 1,
    justifyContent: "center",
  },
  image: { width: "100%", height: "100%" },
  nextExerciseText: { color: Colors.background },
  nextExerciseTitle: { opacity: 0.7, textTransform: "uppercase", color: Colors.background },
  nextExerciseContainer: {
    backgroundColor: "#134e4a",
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    padding: 16,
  },
});
