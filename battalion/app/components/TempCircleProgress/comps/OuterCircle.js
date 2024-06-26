import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";

const TempOuterCircle = () => {
  return (
    <View style={styles.container}>
      <Svg width={254} height={469} viewBox="0 0 254 469" fill="none">
        <Circle
          cx={19.5003}
          cy={234.5}
          r={216.783}
          transform="rotate(-165 19.5003 234.5)"
          stroke="url(#paint0_linear_2095_941)"
          strokeWidth={34}
          strokeDasharray="4.01 40.14"
        />
        <Defs>
          <LinearGradient
            id="paint0_linear_2095_941"
            x1={74.2231}
            y1={235.403}
            x2={-230.761}
            y2={317.124}
            gradientUnits="userSpaceOnUse"
          >
            <Stop stopColor="#393939" />
            <Stop offset={1} stopColor="#393939" stopOpacity={0} />
          </LinearGradient>
        </Defs>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: -30,
    zIndex: -1,
    top: 158,
  },
});

export default TempOuterCircle;
