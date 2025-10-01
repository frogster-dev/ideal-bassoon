import { Colors } from "@/utils/constants/colors";
import { AntDesign } from "@expo/vector-icons";
import { SquircleButton, SquircleButtonProps } from "expo-squircle-view";
import React from "react";
import { StyleSheet, Text } from "react-native";

export const AppleButton = (props: SquircleButtonProps) => {
  return (
    <SquircleButton {...props} style={styles.container} borderRadius={12}>
      <AntDesign name="apple" size={24} color="black" />
      <Text style={styles.text} numberOfLines={1}>
        Apple
      </Text>
    </SquircleButton>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background,
    gap: 8,
    flex: 1,
    height: 56,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.slate200,
  },
  text: { color: Colors.dark, textAlign: "center", fontWeight: "500" },
});
