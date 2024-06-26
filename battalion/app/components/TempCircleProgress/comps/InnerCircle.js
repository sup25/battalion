import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";

const TempInnerCircle = () => {
  return (
    <View style={styles.container}>
      <Svg width={150} height={261} viewBox="0 0 150 261" fill="none">
        <Circle
          cx={19.5004}
          cy={130.5}
          r={122.085}
          transform="rotate(-165 19.5004 130.5)"
          fill="transparent"
          stroke="#393939"
          strokeWidth={15.1153}
          strokeDasharray="2.33 23.25"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: -30,
    zIndex: -1,
    top: 265,
  },
});

export default TempInnerCircle;
