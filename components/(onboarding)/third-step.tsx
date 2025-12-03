import { BouncingArrow } from "@/components/ui/bouncing-arrow";
import { useTranslation } from "@/hooks/use-translation";
import { Colors } from "@/utils/constants/colors";
import { defaultStyles } from "@/utils/constants/styles";
import { SquircleView } from "expo-squircle-view";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

export const ThirdStep = () => {
  const { t } = useTranslation();

  const renderFeatureCard = (index: number, icon: string, title: string, description: string) => {
    return (
      <Animated.View entering={FadeIn.delay(index * 200)}>
        <SquircleView style={styles.featureCard}>
          <SquircleView style={styles.iconContainer}>
            <Text style={styles.icon}>{icon}</Text>
          </SquircleView>
          <View style={{ gap: 4, flex: 1 }}>
            <Text style={styles.featureTitle}>{title}</Text>
            <Text style={styles.featureDescription}>{description}</Text>
          </View>
        </SquircleView>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        contentContainerStyle={{ flex: 1, paddingBottom: 32 }}>
        <View style={{ gap: 16, marginTop: 32 }}>
          {renderFeatureCard(
            1,
            "⏱️",
            "Personnalisez votre séance",
            "Choisissez le temps de la séance et les temps de pause",
          )}
          {renderFeatureCard(
            2,
            "🎯",
            "Exercices adaptés",
            "Des exercices efficaces en fonction de votre niveau vous sont proposés",
          )}
          {renderFeatureCard(
            3,
            "🚀",
            "Commencez maintenant",
            "Appuyez sur le bouton et c'est parti !",
          )}
        </View>

        <SquircleView style={styles.summaryCard}>
          <Text style={styles.summaryText}>{t("onboarding.title3")}</Text>
        </SquircleView>
      </ScrollView>
      <View style={{ gap: 0, alignItems: "center", marginBottom: 32 }}>
        <Text style={styles.summaryText}>{t("onboarding.title4")}</Text>
        <BouncingArrow />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.grayBackground,
    paddingHorizontal: 24,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    gap: 20,
    paddingVertical: 40,
  },
  featureCard: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    width: 48,
    borderRadius: 12,
    height: 48,
    backgroundColor: Colors.grayBackground,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: { fontSize: 28 },
  featureTitle: {
    ...defaultStyles.textBold,
    color: Colors.primary700,
  },
  featureDescription: {
    color: Colors.dark,
    opacity: 0.7,
  },
  summaryCard: {
    backgroundColor: Colors.primary50,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.primary200,
    marginTop: 16,
  },
  summaryText: { color: Colors.primary700 },
});
