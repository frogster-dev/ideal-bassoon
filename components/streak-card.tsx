import { Colors } from "@/utils/constants/colors";
import { defaultStyles } from "@/utils/constants/styles";
import { SquircleView } from "expo-squircle-view";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { AnimatedFireIcon } from "./animated-fire-icon";

interface StreakCardProps {
  streak: number;
}

export const StreakCard = ({ streak }: StreakCardProps) => {
  const text = streak > 1 ? `${streak} jours d'affilés !` : `${streak} jour d'affilé !`;

  return (
    <SquircleView style={styles.container}>
      <View style={styles.fireIconContainer}>
        <AnimatedFireIcon size={72} />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>{text}</Text>
        <Text style={styles.description}>
          Continuez de vous étirer tous les jours pour augmenter votre streak !
        </Text>
      </View>
    </SquircleView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    padding: 24,
    alignItems: "center",
    backgroundColor: Colors.background,
    borderRadius: 16,
  },
  fireIconContainer: { alignItems: "center", marginVertical: 32 },
  textContainer: { alignItems: "center", gap: 8 },
  title: { ...defaultStyles.textXL, color: Colors.blue900, fontWeight: "bold" },
  description: { color: Colors.blue900, opacity: 0.7, textAlign: "center" },
});
