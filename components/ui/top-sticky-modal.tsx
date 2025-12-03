import { Colors } from "@/utils/constants/colors";
import { defaultStyles } from "@/utils/constants/styles";
import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface TopStickyModalProps {
  visible: boolean;
  message: string;
}

export const TopStickyModal = ({ visible, message }: TopStickyModalProps) => {
  const insets = useSafeAreaInsets();
  const modalHeight = useSharedValue(100);
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(visible ? 1 : 0, { duration: 300 });
  }, [visible]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    zIndex: visible || progress.value > 0 ? 999 : -1,
  }));

  const modalStyle = useAnimatedStyle(() => {
    // Start position: above the screen
    const hiddenY = -(modalHeight.value + insets.top + 50);
    // End position: slightly below the top inset
    const visibleY = insets.top + 10;

    const translateY = interpolate(
      progress.value,
      [0, 1],
      [hiddenY, visibleY],
      Extrapolation.CLAMP,
    );

    return {
      transform: [{ translateY }],
      zIndex: 1000,
    };
  });

  return (
    <>
      <Animated.View
        style={[styles.backdrop, backdropStyle]}
        pointerEvents={visible ? "auto" : "none"}
      />

      <Animated.View
        style={[styles.container, modalStyle]}
        onLayout={(e) => {
          modalHeight.value = e.nativeEvent.layout.height;
        }}>
        <ActivityIndicator size="small" color={Colors.background} />
        <Text style={styles.text}>{message}</Text>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  container: {
    position: "absolute",
    top: 0,
    left: 20,
    right: 20,
    height: 50,
    backgroundColor: Colors.primary500,
    padding: 12,
    gap: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 0.2,
    elevation: 5,
  },
  text: {
    ...defaultStyles.textS,
    ...defaultStyles.textBold,
    color: Colors.background,
    textAlign: "center",
  },
});
