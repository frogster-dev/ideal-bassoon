import { Colors } from "@/utils/constants/colors";
import { defaultStyles } from "@/utils/constants/styles";
import Slider from "@react-native-community/slider";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export interface SliderOption {
  label: string;
  value: number;
}

interface CustomSliderProps {
  title: string;
  options: SliderOption[];
  value: number;
  onValueChange: (value: number) => void;
  minimumValue?: number;
  maximumValue?: number;
  step?: number;
}

export const CustomSlider = ({
  title,
  options,
  value,
  onValueChange,
  minimumValue,
  maximumValue,
  step = 1,
}: CustomSliderProps) => {
  // Calculate min and max values from options if not provided
  const minValue = minimumValue ?? Math.min(...options.map((opt) => opt.value));
  const maxValue = maximumValue ?? Math.max(...options.map((opt) => opt.value));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={minValue}
          maximumValue={maxValue}
          value={value}
          onValueChange={onValueChange}
          step={step}
          minimumTrackTintColor={Colors.primary700}
          maximumTrackTintColor={Colors.slate200}
          // thumbStyle={styles.thumb}
        />
      </View>

      <View style={styles.labelsContainer}>
        {options.map((option) => {
          const isSelected = option.value === value;
          return (
            <Text key={option.value} style={[styles.label, isSelected && styles.selectedLabel]}>
              {option.label}
            </Text>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  title: {
    color: Colors.dark,
    marginBottom: 16,
    fontWeight: "600",
  },
  sliderContainer: {
    marginBottom: 12,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  thumb: {
    backgroundColor: Colors.primary700,
    width: 20,
    height: 20,
  },
  labelsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  label: {
    ...defaultStyles.textS,
    color: Colors.slate500,
    textAlign: "center",
  },
  selectedLabel: {
    color: Colors.primary700,
    fontWeight: "bold",
  },
});
