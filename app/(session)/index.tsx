import { PauseButton } from "@/components/(session)/pause-button";
import { Colors } from "@/utils/constants/colors";
import { defaultStyles } from "@/utils/constants/styles";
import { SquircleView } from "expo-squircle-view";
import React, { useState } from "react";
import { Image, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  const nbOfExercices = 15;
  const { width } = useWindowDimensions();
  const [currentExercice, setCurrentExercice] = useState(5);

  const [timer, setTimer] = useState(50);

  return (
    <SafeAreaView style={styles.container}>
      {/* Chronometre pour montrer le temps de l'exercice et d'attente */}
      <View
        style={{ margin: 16, marginVertical: 32, justifyContent: "center", alignItems: "center" }}>
        <Text style={styles.timerText}>{timer}</Text>
      </View>

      {/* Progress bar avec le nombre d'exercices */}
      <View style={{ flexDirection: "row", gap: 4, marginHorizontal: 16 }}>
        {Array.from({ length: nbOfExercices }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressBar,
              {
                backgroundColor: index <= currentExercice ? Colors.primary700 : Colors.slate50,
              },
            ]}
          />
        ))}
      </View>

      <View style={{ flex: 1, gap: 16 }}>
        {/* Titre de l'exercice */}
        <View
          style={{
            flex: 3,
            padding: 16,
            gap: 16,
            alignItems: "center",
          }}>
          <Text style={styles.exerciseTitle} numberOfLines={2}>
            Étirement de la taille de la poitrine
          </Text>

          {/* Photo de l'exercice */}
          <SquircleView style={styles.exercisePhotoContainer} borderRadius={16}>
            <Image
              resizeMode="cover"
              source={{ uri: "https://picsum.photos/800" }}
              style={styles.image}
            />
          </SquircleView>
        </View>

        {/* Prochain exercice, s'il y en a un */}
        <View style={styles.nextExerciseContainer}>
          <Text style={styles.nextExerciseText}>Prochain exercice</Text>
          <SquircleView style={styles.nextExercisePhotoContainer} borderRadius={16}>
            <Image
              resizeMode="cover"
              source={{ uri: "https://picsum.photos/800" }}
              style={styles.image}
            />
          </SquircleView>
        </View>
      </View>

      {/* Bouton pour stopper la session position absolute */}
      <PauseButton onPress={() => {}} />
    </SafeAreaView>
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
  nextExerciseContainer: {
    backgroundColor: "#134e4a",
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    padding: 16,
  },
  nextExercisePhotoContainer: {
    flex: 1,
    overflow: "hidden",
    backgroundColor: Colors.orange500,
    alignItems: "center",
    aspectRatio: 1,
    justifyContent: "center",
  },
  nextExerciseText: {
    flex: 2,
    textAlign: "center",
    color: Colors.background,
    opacity: 0.7,
  },
  image: { width: "100%", height: "100%" },
});
