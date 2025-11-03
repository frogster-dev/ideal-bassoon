import { Colors } from "@/utils/constants/colors";
import Svg, { Path } from "react-native-svg";

export interface FireIconProps {
  size?: number;
  smallPathColor?: string;
  smallPathOpacity?: number;
  largePathColor?: string;
  largePathOpacity?: number;
}

export const FireIcon = ({
  size,
  smallPathColor,
  smallPathOpacity,
  largePathColor,
  largePathOpacity,
}: FireIconProps) => {
  const height = size ? size : 32;
  const width = (height * 21) / 32;

  const smallPathFill = smallPathColor ? smallPathColor : Colors.dark;
  const smallPathFillOpacity = smallPathOpacity ? smallPathOpacity : 1;
  const largePathFill = largePathColor ? largePathColor : Colors.dark;
  const largePathFillOpacity = largePathOpacity ? largePathOpacity : 1;

  return (
    <Svg width={width} height={height} viewBox="0 0 21 32" fill="none">
      <Path
        fill={largePathFill}
        fillOpacity={largePathFillOpacity}
        d="M9.97686 0.259815C8.99956 0.609862 8.03494 1.20994 7.08302 2.06006C5.35687 3.61027 4.34149 5.64804 3.9861 8.21089C3.69418 10.3987 4.3161 13.2991 5.58533 15.5744C6.27072 16.812 6.52456 17.1496 8.30148 19.2624C10.8272 22.2503 11.9315 24.113 12.2615 25.9508C12.4392 26.9759 12.3503 28.8387 12.0457 30.4264C11.8426 31.5265 11.8426 31.539 12.0965 31.8016C12.3503 32.0391 12.4138 32.0516 13.0738 31.9016C13.4672 31.8141 14.2288 31.5265 14.7619 31.264C17.2495 30.0263 19.0518 27.8135 19.8895 24.9256C20.2703 23.638 20.3084 20.6876 19.9657 19.2999C19.2041 16.237 17.9476 14.0867 15.1807 11.0988C13.3657 9.12351 12.7311 8.2984 12.198 7.19825C11.538 5.87307 11.4365 5.22299 11.4365 2.59763C11.4238 -0.252754 11.4238 -0.252754 9.97686 0.259815Z"
      />
      <Path
        fill={smallPathFill}
        fillOpacity={smallPathFillOpacity}
        d="M2.27325 17.8747C1.09287 18.5748 0.318636 19.9 0.217098 21.3252C0.102867 23.0754 0.585174 24.2506 2.24786 26.3134C3.82171 28.2511 3.93594 28.5136 3.94863 30.1889C3.96132 31.364 3.9994 31.5766 4.18978 31.7266C4.53247 31.9641 4.77363 31.9266 5.40824 31.5391C7.13439 30.4389 7.9467 28.4761 7.50247 26.3884C7.21054 25.0132 6.58862 23.8755 5.40824 22.5753C3.97401 21.0001 3.72017 20.5001 3.63132 19.0499C3.55517 17.8247 3.45363 17.6372 2.92055 17.6372C2.78094 17.6372 2.48902 17.7497 2.27325 17.8747Z"
      />
    </Svg>
  );
};
