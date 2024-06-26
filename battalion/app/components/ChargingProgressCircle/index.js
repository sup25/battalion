import React from "react";
import { View, StyleSheet, Animated, Text, TextInput } from "react-native";
import Svg, { Circle, G } from "react-native-svg";

const ChargingProgressCircle = ({
  percents,
  circleRadius = 16,
  strokeWidth = 5,
}) => {
  const innerPercents = percents > 100 ? 100 : percents < 0 ? 0 : percents;
  const radius = circleRadius; // Half of the desired width
  const size = radius * 2 + 6;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset =
    circumference - (innerPercents / 100) * circumference;

  return (
    <View>
      <Svg width={size} height={size}>
        <G>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#252525"
            strokeWidth={strokeWidth}
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={
              innerPercents < 20
                ? "red"
                : innerPercents < 80
                ? "yellow"
                : "green"
            }
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            transform={`rotate(-90, ${size / 2}, ${size / 2})`} // Rotate by 45 degrees around the center (10, 10)
          />
        </G>
      </Svg>
    </View>
  );
};

export default ChargingProgressCircle;
