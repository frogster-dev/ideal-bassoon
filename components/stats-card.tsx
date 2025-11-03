import { Colors } from "@/utils/constants/colors";
import { defaultStyles } from "@/utils/constants/styles";
import { Ionicons } from "@expo/vector-icons";
import { SquircleView } from "expo-squircle-view";
import { StyleSheet, Text, View } from "react-native";

interface StatsCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBackgroundColor: string;
  value: string | number;
  label: string;
  subtitle?: string;
}

export const StatsCard = ({
  icon,
  iconColor,
  iconBackgroundColor,
  value,
  label,
  subtitle,
}: StatsCardProps) => {
  return (
    <SquircleView style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: iconBackgroundColor }]}>
        <Ionicons name={icon} size={24} color={iconColor} />
      </View>
      <View style={styles.content}>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.label}>{label}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </SquircleView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  content: {
    gap: 2,
    alignItems: "center",
  },
  value: {
    ...defaultStyles.textXL,
    ...defaultStyles.textBold,
    color: Colors.dark,
    lineHeight: 40,
  },
  label: {
    ...defaultStyles.textS,
    color: Colors.dark,
    textTransform: "uppercase",
    opacity: 0.6,
  },
  subtitle: {
    ...defaultStyles.textS,
    color: Colors.dark,
    opacity: 0.6,
    marginTop: 4,
  },
});
