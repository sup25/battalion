import React from "react";
import { View, StyleSheet, Animated, Text, TextInput } from "react-native";
import Svg, { Circle, G } from "react-native-svg";

const ChargingProgressCircle = ({ percents }) => {
  const innerPercents = percents > 100 ? 100 : percents < 0 ? 0 : percents;
  const radius = 10; // Half of the desired width

  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset =
    circumference - (innerPercents / 100) * circumference;

  return (
    <View>
      <Svg width={26} height={26}>
        <G>
          <Circle
            width={20}
            height={20}
            cx={13}
            cy={13}
            r={radius}
            fill="transparent"
            stroke={
              innerPercents < 20
                ? "red"
                : innerPercents < 80
                ? "yellow"
                : "green"
            }
            strokeWidth={2}
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90, 13, 13)" // Rotate by 45 degrees around the center (10, 10)
          />
        </G>
      </Svg>
    </View>
  );
};

export default ChargingProgressCircle;
