import { Session } from "@/libs/drizzle/schema";
import { Colors } from "@/utils/constants/colors";
import { defaultStyles } from "@/utils/constants/styles";
import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import { SessionCard } from "./session-card";

interface SessionCardPlaceholderProps {
  title: string;
  date: "today" | "yesterday";
  numberOfExercices: number;
  totalDuration: number;
  difficulty: number;
}

export const SessionCardPlaceholder = memo((props: SessionCardPlaceholderProps) => {
  // Adapt date to the format of the session card (date but be a date in item)
  // Today date is early in the morning
  // Yesterday date is late in the evening
  const date =
    props.date === "today"
      ? new Date(new Date().setHours(7, 31, 0, 0))
      : new Date(new Date().setHours(19, 12, 59, 999));

  const item = { ...props, startedAt: date } as unknown as Session;

  return (
    <View style={{ opacity: 0.5 }}>
      <SessionCard item={item} placeholder />
    </View>
  );
});

const styles = StyleSheet.create({
  placeholder: { opacity: 0.5 },
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
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  sessionDateText: {
    ...defaultStyles.textS,
    color: Colors.dark,
    opacity: 0.6,
    flex: 1,
  },
  actionButtonsRow: { flexDirection: "row", gap: 16 },
  actionButton: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.slate200,
    backgroundColor: Colors.slate50,
    borderRadius: 8,
    padding: 12,
  },
  actionButtonGhost: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.background,
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 12,
  },
});
