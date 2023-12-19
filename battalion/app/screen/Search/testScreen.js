import React, { useEffect, useState, useContext } from "react";
import { View, StyleSheet, Text, TouchableWithoutFeedback } from "react-native";
import Svg, { Circle, G } from "react-native-svg";
import Slider from "@react-native-community/slider";
import { useAppSettingContext } from "../../context/AppSettingContext";
import colors from "../../config/Colors/colors";
import CarthagosScreen from "../../component/CarthagosScreen/CarthagosScreen";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const HalfCircleSlider = ({ navigation }) => {
  const { temp, setTempValue, getTempValueAndUnit } = useAppSettingContext();
  const [sliderValue, setSliderValue] = useState(temp.value);

  const handleValueChange = (value) => {
    setSliderValue(value);
    setTempValue(value);
  };

  return (
    <CarthagosScreen style={styles.container}>
      <View style={styles.IconAndHeadingTxt}>
        <TouchableWithoutFeedback onPress={() => navigation.goBack(null)}>
          <MaterialCommunityIcons
            style={{ alignSelf: "flex-end", paddingBottom: 5 }}
            name="arrow-left"
            size={32}
            color="#B0B0B0"
          />
        </TouchableWithoutFeedback>
        <Text style={styles.Heading}>Temperature</Text>
      </View>

      <View style={styles.IconAndTemp}>
        <Svg width={300} height={400}>
          <G>
            {/*  <Circle
              cx={100}
              cy={50}
              r={50}
              fill="transparent"
              stroke="grey"
              strokeWidth={10}
            /> */}
            <Circle
              cx={50}
              cy={-50}
              r={50}
              fill="transparent"
              stroke="red"
              strokeWidth={10}
              strokeLinecap="round"
              strokeDasharray={`${(Math.PI * 100) / 2}, ${Math.PI * 100}`}
              strokeDashoffset={Math.PI * ((100 - sliderValue) / 2)}
              transform="rotate(270, 100, 50)" // Rotate by 45 degrees around the center (100, 50)
            />
          </G>
          <Text style={styles.Temptext}>
            {getTempValueAndUnit({ value: sliderValue, unit: temp.unit })}
          </Text>
        </Svg>
      </View>

      <View style={styles.SliderTxtWrapper}>
        <Text style={styles.SliderTxt}>{sliderValue}℃</Text>
        <Slider
          circleColor="red"
          style={styles.slider}
          value={sliderValue}
          minimumTrackTintColor="red"
          minimumValue={0}
          maximumValue={100}
          step={1}
          onValueChange={(value) => handleValueChange(value)}
        />
      </View>
    </CarthagosScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
    justifyContent: "space-between",
    backgroundColor: colors.background,
    flex: 1,
  },
  IconAndHeadingTxt: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    paddingLeft: 17,
  },

  Heading: {
    fontSize: 32,
    fontWeight: "900",
    color: colors.white,
    marginTop: 35,
    alignSelf: "center",
    paddingLeft: 4,
    textTransform: "uppercase",
  },
  IconAndTemp: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
  },
  Temptext: {
    alignSelf: "flex-end",
    fontSize: 50,
    fontWeight: "900",
    color: colors.white,
  },
  SliderTxtWrapper: {
    flexDirection: "column",
    width: "100%",
  },
  SliderTxt: {
    alignSelf: "center",
    color: colors.white,
  },
  slider: {
    alignSelf: "center",
    width: 200,
    paddingBottom: 155,
  },
});

export default HalfCircleSlider;
