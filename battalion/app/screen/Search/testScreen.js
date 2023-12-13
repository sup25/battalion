import React, { useEffect, useState } from "react";
import { View, StyleSheet, Animated, Text } from "react-native";
import Svg, { Circle, G } from "react-native-svg";
import Slider from "@react-native-community/slider";
import { useDeviceSettingsContext } from "../../utils/DeviceSettingsProvider";

const HalfCircleSlider = () => {
  const { temp, setTempValue, getTempValueAndUnit } =
    useDeviceSettingsContext();
  const [sliderValue, setSliderValue] = useState(temp.value);

  const handleValueChange = (value) => {
    setSliderValue(value);
  };

  return (
    <View style={styles.container}>
      <Svg width={200} height={200}>
        <G>
          <Circle
            cx={100}
            cy={50}
            r={50}
            fill="transparent"
            stroke="grey"
            strokeWidth={10}
          />
          <Circle
            cx={100}
            cy={50}
            r={50}
            fill="transparent"
            stroke="red"
            strokeWidth={10}
            strokeLinecap="round"
            strokeDasharray={`${(Math.PI * 100) / 2}, ${Math.PI * 100}`}
            strokeDashoffset={Math.PI * ((100 - sliderValue) / 2)}
            transform="rotate(-90, 100, 50)" // Rotate by 45 degrees around the center (100, 50)
          />
        </G>
      </Svg>
      <Text>
        {getTempValueAndUnit({ value: sliderValue, unit: temp.unit })}
      </Text>
      <Slider
        circleColor="red"
        style={styles.slider}
        value={sliderValue}
        minimumTrackTintColor="red"
        minimumValue={0}
        maximumValue={100}
        step={1}
        onValueChange={(value) => handleValueChange(value)}
        onSlidingComplete={(value) => setTempValue(value)} // handles the context + asyncStorage change.
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
  slider: {
    width: 200,
  },
});

export default HalfCircleSlider;
