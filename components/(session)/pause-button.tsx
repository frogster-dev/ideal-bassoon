import { Colors } from "@/utils/constants/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SquircleButton, SquircleButtonProps } from "expo-squircle-view";
import React from "react";
import { StyleSheet } from "react-native";

interface PauseButtonProps extends SquircleButtonProps {
  isPaused: boolean;
}

export const PauseButton = ({ onPress, isPaused }: PauseButtonProps) => {
  return (
    <SquircleButton
      style={[styles.container, { backgroundColor: isPaused ? Colors.primary700 : Colors.dark }]}
      borderRadius={8}
      onPress={onPress}
      activeOpacity={0.8}>
      {isPaused ? (
        <MaterialCommunityIcons name="play" size={24} color={Colors.slate200} />
      ) : (
        <MaterialCommunityIcons name="pause" size={24} color={Colors.slate200} />
      )}
    </SquircleButton>
  );
};
const styles = StyleSheet.create({
  container: {
    height: 56,
    position: "absolute",
    bottom: 16,
    right: 16,
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
