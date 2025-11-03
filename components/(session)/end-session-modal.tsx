import { Colors } from "@/utils/constants/colors";
import { STRETCH_SESSION_CONGRATULATIONS } from "@/utils/constants/congratulations";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { Dimensions, Modal, ModalProps, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

interface StarConfig {
  id: number;
  initialOpacity: number;
  duration: number;
  rotation: number;
  targetX: number;
  targetY: number;
  size: number;
}

const AnimatedStar = ({ config }: { config: StarConfig }) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(config.initialOpacity);
  const rotate = useSharedValue(0);

  useEffect(() => {
    // Start animations
    translateX.value = withTiming(config.targetX, {
      duration: config.duration,
      easing: Easing.out(Easing.ease),
    });

    translateY.value = withTiming(config.targetY, {
      duration: config.duration,
      easing: Easing.out(Easing.ease),
    });

    rotate.value = withTiming(config.rotation, {
      duration: config.duration,
      easing: Easing.linear,
    });

    // Fade out at 70% of duration
    opacity.value = withSequence(
      withDelay(
        config.duration * 0.7,
        withTiming(0, {
          duration: config.duration * 0.3,
          easing: Easing.out(Easing.ease),
        }),
      ),
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate.value}deg` },
      ],
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View style={[styles.star, animatedStyle]}>
      <Ionicons name="star" size={config.size} color="#FFD700" />
    </Animated.View>
  );
};

interface EndSessionModalProps extends ModalProps {
  onClose: () => void;
}

export const EndSessionModal = ({ onClose, ...props }: EndSessionModalProps) => {
  const starsCount = 100;
  const durationRange = [2000, 4000];
  const initialOpacityRange = [0.4, 1.0];
  const rotationRange = [90, 540];
  const sizeRange = [16, 24];

  const randomPositiveSentence =
    STRETCH_SESSION_CONGRATULATIONS[
      Math.floor(Math.random() * STRETCH_SESSION_CONGRATULATIONS.length)
    ];

  // Generate star configurations
  const starsConfig: StarConfig[] = Array.from({ length: starsCount }, (_, i) => {
    const duration = durationRange[0] + Math.random() * (durationRange[1] - durationRange[0]);
    const initialOpacity =
      initialOpacityRange[0] + Math.random() * (initialOpacityRange[1] - initialOpacityRange[0]);
    const rotation = rotationRange[0] + Math.random() * (rotationRange[1] - rotationRange[0]);
    const size = sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]);

    // Random target position on edges
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.max(width, height) * 0.6; // Slightly smaller for modal
    const targetX = Math.cos(angle) * distance;
    const targetY = Math.sin(angle) * distance;

    return {
      id: i,
      initialOpacity,
      duration,
      rotation,
      targetX,
      targetY,
      size,
    };
  });

  // Close modal after the maximum star duration
  useEffect(() => {
    const maxDurationForAStar = durationRange[1];
    const timer = setTimeout(() => {
      onClose();
    }, maxDurationForAStar);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <Modal {...props} animationType="fade" transparent>
      <LinearGradient
        // Background Linear Gradient
        colors={[Colors.primary700, "#06b6d4"]}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />

      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={{ color: Colors.background }}>Session terminée !</Text>
          <Text style={{ fontWeight: "bold", color: Colors.background, fontSize: 48 }}>
            Bravo !
          </Text>
          <View style={{ gap: 16, marginTop: 16 }}>
            <View style={{ height: 1, backgroundColor: Colors.background, opacity: 0.4 }} />
            <Text style={styles.modalPositiveSentence}>{randomPositiveSentence}</Text>
          </View>
        </View>

        <View style={styles.starsContainer}>
          {starsConfig.map((config) => (
            <AnimatedStar key={config.id} config={config} />
          ))}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    gap: 16,
    alignItems: "center",
  },
  starsContainer: {
    position: "absolute",
    top: height / 2,
    left: width / 2,
    width: 0,
    height: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  star: {
    position: "absolute",
  },
  modalPositiveSentence: {
    fontStyle: "italic",
    textAlign: "center",
    color: Colors.background,
    marginHorizontal: 16,
  },
});
