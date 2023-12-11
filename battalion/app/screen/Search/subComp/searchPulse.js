import React, { useRef, useEffect } from "react";
import { View, StyleSheet, Animated } from "react-native";

const PulseAnimation = () => {
  const circle1Scale = useRef(new Animated.Value(1)).current;
  const circle2Scale = useRef(new Animated.Value(1)).current;
  const circle3Scale = useRef(new Animated.Value(1)).current;

  const circle1Opacity = useRef(new Animated.Value(1)).current;
  const circle2Opacity = useRef(new Animated.Value(1)).current;
  const circle3Opacity = useRef(new Animated.Value(1)).current;

  const pulse = (scaleRef, opacityRef, delay) => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(scaleRef, {
          toValue: 1.8,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleRef, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const opacity = (scaleRef, opacityRef, delay) => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),

        Animated.timing(opacityRef, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacityRef, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };
  useEffect(() => {
    opacity(circle1Scale, circle1Opacity, 0);
    opacity(circle1Scale, circle2Opacity, 300);
    opacity(circle1Scale, circle3Opacity, 600);

    pulse(circle1Scale, circle1Opacity, 0);
    pulse(circle2Scale, circle2Opacity, 300);
    pulse(circle3Scale, circle3Opacity, 600);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.circle,
          {
            transform: [{ scale: circle1Scale }],
            opacity: circle1Opacity,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.circle,
          {
            transform: [{ scale: circle2Scale }],
            opacity: circle2Opacity,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.circle,
          {
            transform: [{ scale: circle3Scale }],
            opacity: circle3Opacity,
          },
        ]}
      />
      <Animated.View style={[styles.circle]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  circle: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(211, 211, 211, 1)",
  },
});

export default PulseAnimation;
