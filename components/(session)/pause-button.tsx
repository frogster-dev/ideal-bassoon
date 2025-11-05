import { Colors } from "@/utils/constants/colors";
import { defaultStyles } from "@/utils/constants/styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SquircleButton, SquircleButtonProps } from "expo-squircle-view";
import React, { useEffect } from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

interface PauseButtonProps extends SquircleButtonProps {
  isPaused: boolean;
}

export const PauseButton = ({ onPress, isPaused }: PauseButtonProps) => {
  const { width: screenWidth } = useWindowDimensions();
  const buttonWidth = useSharedValue(56);

  useEffect(() => {
    buttonWidth.value = withTiming(isPaused ? screenWidth - 32 : 56, {
      duration: 300,
    });
  }, [isPaused, screenWidth]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: buttonWidth.value,
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <SquircleButton
        style={[styles.button, { backgroundColor: isPaused ? Colors.background : Colors.dark }]}
        borderRadius={10}
        onPress={onPress}
        activeOpacity={1}>
        {isPaused ? (
          <View style={styles.buttonContent}>
            <Text style={{ color: Colors.primary700, ...defaultStyles.textBold }}>Reprendre</Text>
            <MaterialCommunityIcons name="play" size={24} color={Colors.primary700} />
          </View>
        ) : (
          <MaterialCommunityIcons name="pause" size={24} color={Colors.slate200} />
        )}
      </SquircleButton>
    </Animated.View>
  );
};
const styles = StyleSheet.create({
  button: {
    height: 56,
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
  buttonContent: { flexDirection: "row", alignItems: "center", gap: 8 },
});
