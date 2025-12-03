import { useTranslation } from "@/hooks/use-translation";
import { Colors } from "@/utils/constants/colors";
import { defaultStyles } from "@/utils/constants/styles";
import { SquircleButton } from "expo-squircle-view";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

interface SecondStepProps {
  onGoalSelected?: (goal: string) => void;
}

export const SecondStep = ({ onGoalSelected }: SecondStepProps) => {
  const { t } = useTranslation();
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  const goals = [
    { id: "goal1", label: t("onboarding.goal1"), icon: "🧘" },
    { id: "goal2", label: t("onboarding.goal2"), icon: "😴" },
    { id: "goal3", label: t("onboarding.goal3"), icon: "⚡" },
    { id: "goal4", label: t("onboarding.goal4"), icon: "🤸" },
    { id: "goal5", label: t("onboarding.goal5"), icon: "💪" },
    { id: "goal6", label: t("onboarding.goal6"), icon: "✨" },
  ];

  const handleSelectGoal = (goalId: string) => {
    setSelectedGoal(goalId);
    onGoalSelected?.(goalId);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("onboarding.title2")}</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.goalsContainer}>
          {goals.map((goal) => {
            const isSelected = selectedGoal === goal.id;
            return (
              <SquircleButton
                key={goal.id}
                style={[styles.goalCard, isSelected && styles.goalCardSelected]}
                onPress={() => handleSelectGoal(goal.id)}
                activeOpacity={0.7}>
                <Text style={styles.goalIcon}>{goal.icon}</Text>
                <Text style={[styles.goalLabel, isSelected && styles.goalLabelSelected]}>
                  {goal.label}
                </Text>
                <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
              </SquircleButton>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.grayBackground,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 208,
  },
  header: {
    marginVertical: 16,
  },
  title: {
    ...defaultStyles.textL,
    ...defaultStyles.textBold,
    color: Colors.primary700,
    textAlign: "center",
  },
  goalsContainer: {
    gap: 12,
  },
  goalCard: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: Colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 0.2,
    elevation: 2,
  },
  goalCardSelected: {
    borderColor: Colors.primary500,
    backgroundColor: Colors.primary50,
  },
  goalIcon: {
    fontSize: 28,
  },
  goalLabel: {
    flex: 1,
    color: Colors.dark,
    fontWeight: "500",
  },
  goalLabelSelected: {
    color: Colors.primary700,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.slate200,
    justifyContent: "center",
    alignItems: "center",
  },
  radioOuterSelected: {
    borderColor: Colors.primary500,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary500,
  },
});
