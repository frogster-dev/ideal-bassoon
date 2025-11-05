import { SquircleButtonProps } from "expo-squircle-view";
import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { PauseButton } from "../(session)/pause-button";
import { ToggleSoundButton } from "../(session)/toggle-sound-button";

interface PauseOverlayProps extends SquircleButtonProps {
  isPaused: boolean;
}

export const PauseOverlay = ({ onPress, isPaused }: PauseOverlayProps) => {
  return (
    <>
      {/* Backdrop background */}
      {isPaused && <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.backdrop} />}

      {/* Buttons */}
      <View style={styles.content}>
        {isPaused && (
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            <ToggleSoundButton />
          </Animated.View>
        )}

        <PauseButton onPress={onPress} isPaused={isPaused} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  content: {
    gap: 32,
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    zIndex: 2,
  },
});
