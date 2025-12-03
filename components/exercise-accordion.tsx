import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { Colors } from "@/utils/constants/colors";
import { defaultStyles } from "@/utils/constants/styles";
import { getExerciseImage } from "@/utils/exercise-images";
import { ExerciseWithDuration } from "@/utils/interfaces/exercice";

interface ExerciseAccordionProps {
  exercise: ExerciseWithDuration;
  index: number;
  totalExercises: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onChange: () => void;
}

export const ExerciseAccordion = ({
  exercise,
  index,
  totalExercises,
  onMoveUp,
  onMoveDown,
  onChange,
}: ExerciseAccordionProps) => {
  const open = useSharedValue(false);
  const progress = useDerivedValue(() => (open.value ? withTiming(1) : withTiming(0)));

  const heightAnimationStyle = useAnimatedStyle(() => ({
    height: interpolate(progress.value, [0, 1], [0, 150], Extrapolation.CLAMP),
    opacity: progress.value,
  }));

  const toggleOpen = () => {
    open.value = !open.value;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{exercise.title}</Text>
          <Image
            source={getExerciseImage(exercise.image)}
            style={styles.image}
            contentFit="cover"
          />
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            onPress={onMoveUp}
            disabled={index === 0}
            hitSlop={{ top: 10, bottom: 10, left: 5, right: 5 }}>
            <Ionicons
              name="arrow-up"
              size={20}
              color={index === 0 ? Colors.slate200 : Colors.primary700}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onMoveDown}
            disabled={index === totalExercises - 1}
            hitSlop={{ top: 10, bottom: 10, left: 5, right: 5 }}>
            <Ionicons
              name="arrow-down"
              size={20}
              color={index === totalExercises - 1 ? Colors.slate200 : Colors.primary700}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={onChange} hitSlop={{ top: 10, bottom: 10, left: 5, right: 5 }}>
            <Ionicons name="refresh" size={20} color={Colors.primary700} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={toggleOpen}
            hitSlop={{ top: 10, bottom: 10, left: 5, right: 5 }}>
            <Ionicons name="timer-outline" size={20} color={Colors.primary700} />
          </TouchableOpacity>
        </View>
      </View>

      <Animated.View style={[styles.content, heightAnimationStyle]}>
        <Text style={defaultStyles.textXL}>{exercise.duration} s</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderColor: Colors.slate200,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 12,
  },
  title: {
    flex: 1,
    color: Colors.dark,
    ...defaultStyles.textS,
    marginRight: 8,
  },
  image: {
    width: 42,
    height: 42,
    backgroundColor: Colors.slate200,
    borderRadius: 6,
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  content: {
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
});
