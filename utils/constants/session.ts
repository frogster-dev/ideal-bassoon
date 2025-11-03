import { SliderOption } from "@/components/ui/custom-slider";

// Slider options - Production values
export const effortDurationOptions: SliderOption[] = [
  { label: "~10min", value: 10 * 60 },
  { label: "~15min", value: 15 * 60 },
  { label: "~20min", value: 20 * 60 },
  { label: "~25min", value: 25 * 60 },
];

export const pauseDurationOptions: SliderOption[] = [
  { label: "5sec", value: 0 },
  { label: "10sec", value: 10 },
  { label: "20sec", value: 20 },
  { label: "30sec", value: 30 },
  { label: "40sec", value: 40 },
  { label: "50sec", value: 50 },
  { label: "60sec", value: 60 },
];

export const exerciseDurationOptions: SliderOption[] = [
  { label: "30sec", value: 30 },
  { label: "40sec", value: 40 },
  { label: "50sec", value: 50 },
  { label: "60sec", value: 60 },
];

// DEV values for faster testing
export const effortDurationOptionsDev: SliderOption[] = [
  { label: "~1min", value: 1 * 60 },
  { label: "~2min", value: 2 * 60 },
  { label: "~3min", value: 3 * 60 },
  { label: "~4min", value: 4 * 60 },
];

export const pauseDurationOptionsDev: SliderOption[] = [
  { label: "2sec", value: 2 },
  { label: "4sec", value: 4 },
  { label: "6sec", value: 6 },
  { label: "8sec", value: 8 },
];

export const exerciseDurationOptionsDev: SliderOption[] = [
  { label: "4sec", value: 4 },
  { label: "8sec", value: 8 },
  { label: "12sec", value: 12 },
  { label: "16sec", value: 16 },
];
