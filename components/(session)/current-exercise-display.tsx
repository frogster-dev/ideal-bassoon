import { Image } from "expo-image";
import { SquircleView } from "expo-squircle-view";
import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Colors } from "@/utils/constants/colors";
import { defaultStyles } from "@/utils/constants/styles";
import { getExerciseImage } from "@/utils/exercise-images";
import { ExerciseWithDuration } from "@/utils/interfaces/exercice";

export const CurrentExerciseDisplay = memo(({ exercise }: { exercise: ExerciseWithDuration }) => (
  <View style={styles.container}>
    <Text style={styles.exerciseTitle} numberOfLines={2}>
      {exercise.title}
    </Text>

    <SquircleView style={styles.exercisePhotoContainer} borderRadius={16}>
      <Image contentFit="cover" source={getExerciseImage(exercise.image)} style={styles.image} />
    </SquircleView>
  </View>
));

const styles = StyleSheet.create({
  container: {
    flex: 3,
    padding: 16,
    gap: 16,
    alignItems: "center",
  },
  image: { width: "100%", height: "100%" },
  exercisePhotoContainer: {
    overflow: "hidden",
    backgroundColor: Colors.green500,
    aspectRatio: 1,
    maxWidth: "100%",
    flex: 1,
  },
  exerciseTitle: {
    ...defaultStyles.textL,
    ...defaultStyles.textBold,
    color: Colors.background,
    textAlign: "center",
  },
});
