import { Colors } from "@/utils/constants/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SquircleButton, SquircleButtonProps } from "expo-squircle-view";
import React from "react";
import { StyleSheet } from "react-native";

export const PauseButton = ({ onPress }: SquircleButtonProps) => {
  return (
    <SquircleButton style={styles.container} borderRadius={8}>
      <MaterialCommunityIcons name="pause" size={24} color={Colors.slate200} />
    </SquircleButton>
  );
};
const styles = StyleSheet.create({
  container: {
    height: 56,
    position: "absolute",
    bottom: 32,
    left: 16,
    width: 56,
    backgroundColor: Colors.dark,
    shadowColor: Colors.dark,
    justifyContent: "center",
    alignItems: "center",
    borderColor: Colors.slate500,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
