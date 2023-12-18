import React, { useEffect, useState } from "react";
import { View, Animated, StyleSheet } from "react-native";

const PulseAnimation = ({ delay1 = 0, delay2 = 750, delay3 = 1500 }) => {
  // Create three animated values for the circles
  const [circle1, setCircle1] = useState(new Animated.Value(0));
  const [circle2, setCircle2] = useState(new Animated.Value(0));
  const [circle3, setCircle3] = useState(new Animated.Value(0));

  useEffect(() => {
    // Start the animation loop
    animate();
  }, []);

  const animate = () => {
    // Reset the animated values to zero
    circle1.setValue(0);
    circle2.setValue(0);
    circle3.setValue(0);
    // Animate the circles in sequence
    Animated.parallel([
      // Animate the first circle to grow and fade out
      Animated.timing(circle1, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
        delay: delay1,
      }),
      // Animate the second circle to grow and fade out with 300 ms delay
      Animated.timing(circle2, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
        delay: delay2,
      }),
      // Animate the third circle to grow and fade out with 300 ms delay
      Animated.timing(circle3, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
        delay: delay3,
      }),
    ]).start(() => {
      // Repeat the animation loop
      animate();
    });
  };

  // Interpolate the values to get the scale and opacity
  const scale1 = circle1.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 3],
  });
  const opacity1 = circle1.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });
  const scale2 = circle2.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 3],
  });
  const opacity2 = circle2.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });
  const scale3 = circle3.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 3],
  });
  const opacity3 = circle3.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  // Return the view with the circles
  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.circle,
          {
            transform: [{ scale: scale1 }],
            opacity: opacity1,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.circle,
          {
            transform: [{ scale: scale2 }],
            opacity: opacity2,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.circle,
          {
            transform: [{ scale: scale3 }],
            opacity: opacity3,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    top: 0,
    flex: 1,
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  circle: {
    width: 210,
    height: 210,
    borderRadius: 210,
    borderWidth: 1,
    borderColor: "black",
    backgroundColor: "transparent",
    position: "absolute",
  },
});

export default PulseAnimation;
