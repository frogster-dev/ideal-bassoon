import { useTranslation } from "@/hooks/use-translation";
import { Colors } from "@/utils/constants/colors";
import { AntDesign } from "@expo/vector-icons";
import { SquircleButton, SquircleButtonProps } from "expo-squircle-view";
import React from "react";
import { StyleSheet, Text } from "react-native";

export const AppleButton = (props: SquircleButtonProps) => {
  const { t } = useTranslation();

  return (
    <SquircleButton
      {...props}
      style={[styles.container, props.disabled && styles.containerDisabled]}
      borderRadius={16}
      activeOpacity={0.8}>
      <AntDesign name="apple" size={24} color={Colors.dark} />
      <Text style={styles.text}>{t("auth.signInWithApple")}</Text>
    </SquircleButton>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background,
    gap: 12,
    height: 56,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: Colors.slate200,
    shadowColor: Colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 0.2,
    elevation: 2,
  },
  containerDisabled: { opacity: 0.5 },
  text: { color: Colors.dark, fontWeight: "500" },
});
