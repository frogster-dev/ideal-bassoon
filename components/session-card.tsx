import { useTranslation } from "@/hooks/use-translation";
import { Session } from "@/libs/drizzle/schema";
import { Colors } from "@/utils/constants/colors";
import { defaultStyles } from "@/utils/constants/styles";
import { formatDate, formatDuration } from "@/utils/time";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SquircleButton } from "expo-squircle-view";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface SessionCardProps {
  item: Session;
  placeholder?: boolean;
}

export const SessionCard = React.memo(({ item, placeholder }: SessionCardProps) => {
  const router = useRouter();
  const { t } = useTranslation();

  const getDifficultyLabel = (difficulty: number) => {
    switch (difficulty) {
      case 1:
        return "Facile";
      case 2:
        return "Moyen";
      case 3:
        return "Difficile";
    }
  };

  const getDifficultyLabelStyle = (difficulty: number) => {
    switch (difficulty) {
      case 1:
        return { ...styles.sessionDetailValue, color: Colors.green500 };
      case 2:
        return { ...styles.sessionDetailValue, color: Colors.yellow500 };
      case 3:
        return { ...styles.sessionDetailValue, color: Colors.red500 };
    }
  };

  const handleRedoSession = () => {
    router.push({
      pathname: "/start",
      params: {
        sessionId: item.id,
      },
    });
  };

  return (
    <View style={styles.sessionCard}>
      <Text style={styles.title}>{item.title}</Text>

      <View style={styles.sessionDetails}>
        <View style={styles.sessionDetail}>
          <Text style={styles.sessionDetailLabel}>Exercices</Text>
          <Text style={styles.sessionDetailValue}>{item.numberOfExercices}</Text>
        </View>
        <View style={styles.sessionDetail}>
          <Text style={styles.sessionDetailLabel}>Durée</Text>
          <Text style={styles.sessionDetailValue}>{formatDuration(item.totalDuration)}</Text>
        </View>
        <View style={[styles.sessionDetail, styles.sessionDetailRight]}>
          <Text style={styles.sessionDetailLabel}>Difficulté</Text>
          <Text style={getDifficultyLabelStyle(item.difficulty)}>
            {getDifficultyLabel(item.difficulty)}
          </Text>
        </View>
      </View>

      <View style={styles.footerRow}>
        <Text style={styles.sessionDateText} numberOfLines={1}>
          {formatDate(item.startedAt)}
        </Text>
        <SquircleButton
          style={styles.actionButton}
          activeOpacity={0.8}
          disabled={placeholder}
          onPress={handleRedoSession}>
          <Text style={styles.actionButtonText}>{t("session.redoSession")}</Text>
          <MaterialIcons name="control-point-duplicate" size={24} color={Colors.slate500} />
        </SquircleButton>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  sessionCard: {
    backgroundColor: Colors.background,
    padding: 24,
    marginBottom: 4,
    gap: 12,
  },
  title: {
    ...defaultStyles.textL,
    ...defaultStyles.textBold,
    color: Colors.dark,
  },
  sessionDetails: { flexDirection: "row", gap: 24, marginBottom: 24 },
  sessionDetail: {
    gap: 4,
  },
  sessionDetailRight: { flex: 1, alignItems: "flex-end" },
  sessionDetailLabel: {
    ...defaultStyles.textS,
    color: Colors.dark,
    opacity: 0.6,
  },
  sessionDetailValue: {
    ...defaultStyles.textBold,
    color: Colors.dark,
  },
  footerRow: {
    flexDirection: "row",
    alignSelf: "center",
    gap: 16,
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  sessionDateText: {
    ...defaultStyles.textS,
    color: Colors.dark,
    opacity: 0.6,
    flex: 1,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.slate200,
    backgroundColor: Colors.slate50,
    borderRadius: 8,
    padding: 8,
    paddingHorizontal: 12,
  },
  actionButtonText: {
    ...defaultStyles.textS,
    color: Colors.dark,
    opacity: 0.6,
  },
  actionButtonGhost: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.background,
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 12,
  },
});
