import { Colors } from "@/utils/constants/colors";
import { defaultStyles } from "@/utils/constants/styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SquircleButton } from "expo-squircle-view";
import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

interface SegmentedProjectPriorityButtonProps {
  selectedId: number;
  onDifficultyChange: (id: number) => void;
}

export const SegmentedProjectPriorityButton = ({
  selectedId,
  onDifficultyChange,
}: SegmentedProjectPriorityButtonProps) => {
  return (
    <View style={{ gap: 4, marginVertical: 32 }}>
      <Text style={styles.priorityLabel}>Difficulté des exercices ?</Text>

      <View style={styles.segmentedButtonContainer}>
        <Button id={1} isSelected={selectedId === 1} onPress={() => onDifficultyChange(1)} />
        <Button id={2} isSelected={selectedId === 2} onPress={() => onDifficultyChange(2)} />
        <Button id={3} isSelected={selectedId === 3} onPress={() => onDifficultyChange(3)} />
      </View>
    </View>
  );
};

interface ButtonProps {
  id: number;
  isSelected: boolean;
  onPress: (id: number) => void;
}

const DIFFICULTY_DESCRIPTIONS = [
  {
    id: 1,
    label: "Facile",
    colors: [Colors.green50, Colors.green200, Colors.green500],
  },
  {
    id: 2,
    label: "Moyen",
    colors: [Colors.yellow50, Colors.yellow200, Colors.yellow500],
  },
  {
    id: 3,
    label: "Difficile",
    colors: [Colors.orange50, Colors.orange200, Colors.orange500],
  },
];

const Button = ({ id, isSelected, onPress }: ButtonProps) => {
  const { label, colors, Icon } = useMemo(() => {
    const { label: label1, colors: colors1 } = DIFFICULTY_DESCRIPTIONS.find(
      (difficulty) => difficulty.id === id,
    )!;

    return {
      label: label1,
      colors: colors1,
      Icon: (
        <View style={{ flexDirection: "row" }}>
          {Array.from({ length: id }, (_, index) => (
            <MaterialCommunityIcons
              key={index}
              name="star-four-points-small"
              size={24}
              color="black"
            />
          ))}
        </View>
      ),
    };
  }, [id]);

  const handlePress = () => {
    onPress(id);
  };

  return (
    <SquircleButton
      activeOpacity={0.8}
      onPress={handlePress}
      style={[
        styles.segmentedButton,
        isSelected && { backgroundColor: colors[0], borderColor: colors[1] },
      ]}
      borderRadius={8}>
      {Icon}
      <Text
        style={[
          { color: isSelected ? colors[2] : Colors.slate500 },
          isSelected && defaultStyles.textBold,
        ]}>
        {label}
      </Text>
    </SquircleButton>
  );
};

const styles = StyleSheet.create({
  priorityLabel: {
    fontWeight: "600",
    color: Colors.dark,
    marginBottom: 16,
  },
  segmentedButtonContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  segmentedButton: {
    flex: 1,
    backgroundColor: Colors.slate50,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.slate200,
  },
  priorityDescriptionContainer: {
    backgroundColor: Colors.slate50,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.slate200,
  },
  priorityTitle: {
    ...defaultStyles.textL,
    ...defaultStyles.textBold,
    color: Colors.dark,
    marginBottom: 4,
  },
  priorityDescription: {
    ...defaultStyles.textS,
    color: Colors.slate500,
    lineHeight: 18,
  },
});
