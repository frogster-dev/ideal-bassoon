import { Colors } from "@/utils/constants/colors";
import { defaultStyles } from "@/utils/constants/styles";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SquircleButton, SquircleView } from "expo-squircle-view";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const FirstTimeChallenge = () => {
  const router = useRouter();

  return (
    <View style={styles.wrapper}>
      <SquircleView style={styles.card} borderRadius={16}>
        <View style={{ gap: 8 }}>
          <Text style={styles.title}>Étirez-vous pendant 7 jours !</Text>
          <Text style={styles.subtitle}>
            Apaisez-vous, clarifiez votre esprit. Posez votre téléphone et suivez nos étirements
            pendant 15 min. Ton corps te remerciera.
          </Text>
        </View>

        <View style={{ gap: 8 }}>
          <View style={styles.pill}>
            <Ionicons name="calendar-outline" size={16} color={Colors.primary700} />
            <Text style={styles.pillText}>Objectif: 7 jours d'affilée</Text>
          </View>
          <View style={styles.pill}>
            <Ionicons name="time-outline" size={16} color={Colors.primary700} />
            <Text style={styles.pillText}>Séances courtes et efficaces</Text>
          </View>
        </View>

        <SquircleButton
          borderRadius={12}
          style={styles.cta}
          onPress={() => router.push("/start")}
          activeOpacity={0.8}>
          <Text style={styles.ctaText}>Commencer à s'étirer</Text>
          <Ionicons name="arrow-forward" size={18} color={Colors.background} />
        </SquircleButton>
      </SquircleView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
  },
  card: {
    backgroundColor: Colors.background,
    padding: 16,
    gap: 16,
  },
  title: {
    ...defaultStyles.textL,
    ...defaultStyles.textBold,
    color: Colors.dark,
  },
  subtitle: {
    ...defaultStyles.textS,
    color: Colors.slate500,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    backgroundColor: Colors.primary50,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  pillText: {
    ...defaultStyles.textS,
    color: Colors.primary700,
  },
  cta: {
    backgroundColor: Colors.primary700,
    paddingVertical: 14,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  ctaText: {
    color: Colors.background,
    ...defaultStyles.textBold,
  },
});
