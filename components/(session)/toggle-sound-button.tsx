import { useSessionPreferences } from "@/libs/zustand/session-preferences-store";
import { Colors } from "@/utils/constants/colors";
import { defaultStyles } from "@/utils/constants/styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SquircleButton } from "expo-squircle-view";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const ToggleSoundButton = () => {
  const { soundsEnabled, toggleSounds } = useSessionPreferences();

  return (
    <SquircleButton
      style={styles.container}
      borderRadius={10}
      onPress={toggleSounds}
      activeOpacity={1}>
      <View style={styles.buttonContent}>
        <MaterialCommunityIcons
          name={soundsEnabled ? "volume-high" : "volume-off"}
          size={24}
          color={Colors.primary700}
        />
        <Text style={styles.buttonText}>{soundsEnabled ? "Son activé" : "Sons désactivé"}</Text>
      </View>
    </SquircleButton>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    backgroundColor: Colors.background,
    shadowColor: Colors.dark,
    paddingHorizontal: 16,
    alignSelf: "flex-start",
    justifyContent: "center",
    alignItems: "center",
    borderColor: Colors.slate500,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  buttonText: { color: Colors.primary700, ...defaultStyles.textBold },
});
