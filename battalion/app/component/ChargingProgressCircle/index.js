import React from "react";
import { View, StyleSheet, Animated, Text, TextInput } from "react-native";
import Svg, { Circle, G } from "react-native-svg";

const ChargingProgressCircle = ({ percents }) => {
  const innerPercents = percents > 100 ? 100 : percents < 0 ? 0 : percents;
  const radius = 16; // Half of the desired width

  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset =
    circumference - (innerPercents / 100) * circumference;

  return (
    <View>
      <Svg width={38} height={38}>
        <G>
          <Circle
            cx={19}
            cy={19}
            r={radius}
            fill="transparent"
            stroke="#252525"
            strokeWidth={5}
          />
          <Circle
            cx={19}
            cy={19}
            r={radius}
            fill="transparent"
            stroke={
              innerPercents < 20
                ? "red"
                : innerPercents < 80
                ? "yellow"
                : "green"
            }
            strokeWidth={5}
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90, 19, 19)" // Rotate by 45 degrees around the center (10, 10)
          />
        </G>
      </Svg>
    </View>
  );
};

export default ChargingProgressCircle;
